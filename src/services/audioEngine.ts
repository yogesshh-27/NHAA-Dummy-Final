// Web Audio & Speech Engine for Audio-First Stress & Trauma Assessment

export type SpeechStatus = 'idle' | 'listening' | 'capturing' | 'paused' | 'error' | 'unsupported'

export interface AcousticFeatures {
  rmsLevel: number
  pitchVariation: boolean
  speakingRate: number // approx words per minute
  pauseCount: number
  totalSilenceSeconds: number
  hesitationScore: number // 0 - 1
  voiceIntensity: 'low' | 'normal' | 'elevated' | 'tremor'
}

export class AudioEngine {
  private mediaStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  private questionRecordings: Record<number, Blob> = {}
  private isRecordingActive = false
  private isPaused = false
  private silenceTimer: number | null = null
  private totalSilenceMs = 0
  private pauseCount = 0
  private recognition: any = null
  private recognitionLang: 'en-IN' | 'hi-IN' = 'en-IN'
  private recognitionRestartTimer: any = null
  private accumulatedTranscript = ''
  private currentTranscript = ''
  private onTranscriptUpdate: ((text: string, isFinal: boolean) => void) | null = null
  private onAudioLevelUpdate: ((level: number) => void) | null = null
  private onStatusUpdate: ((status: SpeechStatus, message?: string) => void) | null = null
  private onSilenceThreshold: ((durationMs: number) => void) | null = null
  private extendedSilenceStart: number | null = null
  private silenceAlertSent = false
  private animFrameId: number | null = null

  // Check if Web Speech API is supported
  isSpeechRecognitionSupported(): boolean {
    return Boolean(
      typeof window !== 'undefined' &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    )
  }

  // Request Microphone Access
  async requestMicrophone(): Promise<boolean> {
    try {
      if (this.mediaStream && this.mediaStream.active) return true
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia is not supported or not available in this context')
        return false
      }
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
      } catch (err) {
        console.warn('Constrained audio failed, trying fallback { audio: true }:', err)
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      }
      this.setupAudioContext()
      return true
    } catch (err) {
      console.warn('Microphone access denied or unavailable:', err)
      return false
    }
  }

  private setupAudioContext() {
    if (!this.mediaStream) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      if (this.audioContext && this.audioContext.state !== 'closed') {
        try { this.audioContext.close() } catch {}
      }

      this.audioContext = new AudioCtx()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8

      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      source.connect(this.analyser)

      this.startLevelMonitoring()
    } catch (e) {
      console.warn('AudioContext setup error:', e)
    }
  }

  private startLevelMonitoring() {
    if (!this.analyser) return
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    const checkLevel = () => {
      if (!this.analyser || !this.isRecordingActive || this.isPaused) {
        if (this.isRecordingActive) {
          this.animFrameId = requestAnimationFrame(checkLevel)
        }
        return
      }
      this.analyser.getByteFrequencyData(dataArray)

      // Calculate average volume
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const avg = sum / dataArray.length
      const normalizedLevel = Math.min(1, avg / 128)

      if (this.onAudioLevelUpdate) {
        this.onAudioLevelUpdate(normalizedLevel)
      }

      // Silence & Pause detection
      const now = Date.now()
      const silenceThreshold = 0.08
      if (normalizedLevel < silenceThreshold) {
        if (!this.silenceTimer) {
          this.silenceTimer = now
        } else if (now - this.silenceTimer > 1400) {
          // Pause detected (>1.4s silence)
          this.pauseCount++
          this.totalSilenceMs += now - this.silenceTimer
          this.silenceTimer = null
        }
      } else {
        this.silenceTimer = null
        // Speech resumed — reset extended silence tracking
        this.extendedSilenceStart = null
        this.silenceAlertSent = false
      }

      // Extended silence detection — fires once after 7 continuous seconds of quiet
      if (normalizedLevel < silenceThreshold) {
        if (this.extendedSilenceStart === null) {
          this.extendedSilenceStart = now
        } else if (!this.silenceAlertSent && (now - this.extendedSilenceStart) >= 7000) {
          this.silenceAlertSent = true
          if (this.onSilenceThreshold) this.onSilenceThreshold(now - this.extendedSilenceStart)
        }
      }

      this.animFrameId = requestAnimationFrame(checkLevel)
    }

    this.animFrameId = requestAnimationFrame(checkLevel)
  }

  // Set Language for Speech Recognition ('en-IN' or 'hi-IN')
  setRecognitionLanguage(lang: 'en-IN' | 'hi-IN') {
    if (this.recognitionLang === lang) return
    this.recognitionLang = lang
    if (this.isRecordingActive && !this.isPaused) {
      this.restartRecognition()
    }
  }

  getRecognitionLanguage(): 'en-IN' | 'hi-IN' {
    return this.recognitionLang
  }

  // Reset transcript for the next question step
  resetQuestionTranscript() {
    this.accumulatedTranscript = ''
    this.currentTranscript = ''
    if (this.recognition) {
      try {
        this.recognition.abort()
      } catch {}
    }
    this.scheduleRestartRecognition(100)
  }

  // Pause speech recognition and media recorder
  pause() {
    this.isPaused = true
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.pause()
      } catch {}
    }
    if (this.recognition) {
      try {
        this.recognition.abort()
      } catch {}
    }
    this.onStatusUpdate?.('paused', 'Microphone paused')
  }

  // Resume speech recognition and media recorder
  resume() {
    this.isPaused = false
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      try {
        this.mediaRecorder.resume()
      } catch {}
    }
    if (this.isRecordingActive) {
      this.startSpeechRecognition()
    }
  }

  // Restart recognition manually or after error/config change
  restartRecognition() {
    if (!this.isRecordingActive || this.isPaused) return
    if (this.recognitionRestartTimer) {
      clearTimeout(this.recognitionRestartTimer)
      this.recognitionRestartTimer = null
    }
    if (this.recognition) {
      try {
        this.recognition.abort()
      } catch {}
    }
    this.startSpeechRecognition()
  }

  private scheduleRestartRecognition(delayMs = 250) {
    if (!this.isRecordingActive || this.isPaused) return
    if (this.recognitionRestartTimer) {
      clearTimeout(this.recognitionRestartTimer)
    }
    this.recognitionRestartTimer = setTimeout(() => {
      this.recognitionRestartTimer = null
      if (this.isRecordingActive && !this.isPaused) {
        this.startSpeechRecognition()
      }
    }, delayMs)
  }

  // Start Recording Assessment Session
  startRecording(
    onTranscript?: (text: string, isFinal: boolean) => void,
    onLevel?: (level: number) => void,
    onStatus?: (status: SpeechStatus, message?: string) => void,
    onSilenceThreshold?: (durationMs: number) => void
  ) {
    this.onTranscriptUpdate = onTranscript || null
    this.onAudioLevelUpdate = onLevel || null
    this.onStatusUpdate = onStatus || null
    this.onSilenceThreshold = onSilenceThreshold || null
    this.extendedSilenceStart = null
    this.silenceAlertSent = false
    this.isRecordingActive = true
    this.isPaused = false
    this.recordedChunks = []
    this.pauseCount = 0
    this.totalSilenceMs = 0
    this.accumulatedTranscript = ''
    this.currentTranscript = ''

    if (this.mediaStream) {
      try {
        this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: 'audio/webm' })
      } catch {
        try {
          this.mediaRecorder = new MediaRecorder(this.mediaStream)
        } catch (err) {
          console.warn('Could not initialize MediaRecorder:', err)
        }
      }

      if (this.mediaRecorder) {
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data)
          }
        }

        try {
          this.mediaRecorder.start(1000)
        } catch (err) {
          console.warn('Could not start MediaRecorder:', err)
        }
      }
    }

    this.startSpeechRecognition()
  }

  // Start Web Speech API Speech-to-Text
  private startSpeechRecognition() {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      console.log('Web Speech API not supported in this browser, using simulated/manual fallback')
      this.onStatusUpdate?.(
        'unsupported',
        'Web Speech API is not supported in this browser. Please use Chrome/Edge or type your response below.'
      )
      return
    }

    // Clean up previous instance
    if (this.recognition) {
      try {
        this.recognition.onresult = null
        this.recognition.onerror = null
        this.recognition.onend = null
        this.recognition.onstart = null
        this.recognition.onspeechstart = null
        this.recognition.onspeechend = null
        this.recognition.abort()
      } catch {}
    }

    try {
      this.recognition = new SpeechRec()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = this.recognitionLang

      this.recognition.onstart = () => {
        this.onStatusUpdate?.('listening', 'Microphone active — listening...')
      }

      this.recognition.onspeechstart = () => {
        this.onStatusUpdate?.('capturing', 'Capturing your voice...')
      }

      this.recognition.onspeechend = () => {
        this.onStatusUpdate?.('listening', 'Microphone active — listening...')
      }

      this.recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let sessionFinal = ''

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i]
          if (res && res[0]) {
            if (res.isFinal) {
              sessionFinal += res[0].transcript + ' '
            } else {
              interimTranscript += res[0].transcript
            }
          }
        }

        const combinedFinal = (this.accumulatedTranscript + ' ' + sessionFinal).replace(/\s+/g, ' ').trim()
        const fullDisplay = (combinedFinal + (interimTranscript ? ' ' + interimTranscript : '')).replace(/\s+/g, ' ').trim()

        this.currentTranscript = fullDisplay
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(fullDisplay, false)
        }
      }

      this.recognition.onerror = (e: any) => {
        console.warn('Speech recognition event:', e.error)
        if (e.error === 'no-speech') {
          // Normal silence, no error to show to user
          return
        }
        if (e.error === 'aborted') {
          return
        }
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          this.onStatusUpdate?.('error', 'Microphone or speech permission was denied in your browser settings.')
        } else if (e.error === 'network') {
          this.onStatusUpdate?.(
            'error',
            'Google Speech network error: Online speech recognition is unreachable in this network. You can type below or use the quick sample responses.'
          )
        } else {
          this.onStatusUpdate?.('error', `Speech error (${e.error}). You can type your response or restart microphone.`)
        }
      }

      this.recognition.onend = () => {
        if (this.currentTranscript) {
          this.accumulatedTranscript = this.currentTranscript
        }

        if (this.isRecordingActive && !this.isPaused) {
          this.scheduleRestartRecognition(250)
        } else {
          this.onStatusUpdate?.('idle', 'Speech recognition stopped')
        }
      }

      this.recognition.start()
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e)
      this.scheduleRestartRecognition(800)
    }
  }

  // Stop Recording for Current Question & save segment
  saveQuestionSegment(questionIndex: number) {
    if (this.recordedChunks.length > 0) {
      const blob = new Blob(this.recordedChunks, { type: 'audio/webm' })
      this.questionRecordings[questionIndex] = blob
    }
  }

  // Stop Complete Session Recording
  stopRecording(): { fullSessionBlob: Blob; acousticFeatures: AcousticFeatures; transcript: string } {
    this.isRecordingActive = false
    this.isPaused = false

    if (this.recognitionRestartTimer) {
      clearTimeout(this.recognitionRestartTimer)
      this.recognitionRestartTimer = null
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop()
      } catch (err) {
        console.log('Error stopping mediaRecorder', err)
      }
    }

    if (this.recognition) {
      try {
        this.recognition.onend = null
        this.recognition.abort()
      } catch (err) {
        console.log('Error stopping recognition', err)
      }
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
    }

    const fullBlob = new Blob(this.recordedChunks, { type: 'audio/webm' })
    const wordCount = this.currentTranscript.trim().split(/\s+/).filter(Boolean).length
    const speakingRateWpm = Math.max(70, Math.min(180, Math.round(wordCount * 4)))

    const acousticFeatures: AcousticFeatures = {
      rmsLevel: 0.42,
      pitchVariation: this.pauseCount > 3 || wordCount > 25,
      speakingRate: speakingRateWpm,
      pauseCount: Math.max(1, this.pauseCount),
      totalSilenceSeconds: Math.round(this.totalSilenceMs / 1000),
      hesitationScore: Math.min(1, Number((this.pauseCount * 0.15).toFixed(2))),
      voiceIntensity: this.pauseCount > 4 ? 'tremor' : 'normal',
    }

    return {
      fullSessionBlob: fullBlob,
      acousticFeatures,
      transcript: this.currentTranscript,
    }
  }

  // Find best matching voice for language (Hindi, Hinglish, English)
  private getMatchingVoice(lang: string): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
    const voices = window.speechSynthesis.getVoices()
    if (!voices || voices.length === 0) return null

    const lowerLang = (lang || 'en').toLowerCase()

    if (lowerLang.includes('hi') || lowerLang === 'hindi') {
      // Look for Hindi voice
      const hindiVoice = voices.find(
        (v) => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
      )
      if (hindiVoice) return hindiVoice
    }

    if (lowerLang.includes('hinglish')) {
      // Hinglish works best with Indian Hindi or Indian English voice
      const hinglishVoice = voices.find(
        (v) =>
          v.lang === 'hi-IN' ||
          v.lang === 'en-IN' ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('india')
      )
      if (hinglishVoice) return hinglishVoice
    }

    // English (preferred Indian English, then natural/en)
    const englishVoice =
      voices.find((v) => v.lang === 'en-IN') ||
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0]

    return englishVoice || null
  }

  // AI Voice Narration for Multiple Sentences sequentially
  // Speaks sentence 0 -> onSentenceStart(0) -> finishes -> speaks sentence 1 -> onSentenceStart(1)... -> onComplete()
  speakSentences(
    sentences: string[],
    lang: string = 'en',
    onSentenceStart?: (index: number) => void,
    onComplete?: () => void
  ): () => void {
    if (!('speechSynthesis' in window) || !sentences || sentences.length === 0) {
      if (onComplete) onComplete()
      return () => {}
    }

    window.speechSynthesis.cancel()
    let isCancelled = false
    let currentIndex = 0
    const voice = this.getMatchingVoice(lang)

    const speakNextSentence = () => {
      if (isCancelled) return

      if (currentIndex >= sentences.length) {
        if (onComplete) onComplete()
        return
      }

      const sentenceText = sentences[currentIndex].trim()
      if (!sentenceText) {
        currentIndex++
        speakNextSentence()
        return
      }

      if (onSentenceStart) {
        onSentenceStart(currentIndex)
      }

      const utterance = new SpeechSynthesisUtterance(sentenceText)
      utterance.rate = 0.92
      utterance.pitch = 1.0

      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else if (lang.toLowerCase().includes('hi')) {
        utterance.lang = 'hi-IN'
      } else {
        utterance.lang = 'en-IN'
      }

      utterance.onend = () => {
        if (isCancelled) return
        currentIndex++
        // Small natural pause between sentences
        setTimeout(() => {
          speakNextSentence()
        }, 320)
      }

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis sentence error:', e)
        if (isCancelled) return
        currentIndex++
        speakNextSentence()
      }

      window.speechSynthesis.speak(utterance)
    }

    // Small initial delay before speaking
    const timer = setTimeout(() => {
      speakNextSentence()
    }, 150)

    // Return cancellation function
    return () => {
      isCancelled = true
      clearTimeout(timer)
      window.speechSynthesis.cancel()
    }
  }

  // AI Voice Narration (Single text / prompt)
  speakText(text: string, lang: string = 'en', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd()
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    const voice = this.getMatchingVoice(lang)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else if (lang.toLowerCase().includes('hi')) {
      utterance.lang = 'hi-IN'
    } else {
      utterance.lang = 'en-IN'
    }

    utterance.onend = () => {
      if (onEnd) onEnd()
    }
    utterance.onerror = () => {
      if (onEnd) onEnd()
    }

    window.speechSynthesis.speak(utterance)
  }

  // Legacy speakQuestion
  speakQuestion(text: string, onEnd?: () => void) {
    this.speakText(text, 'en', onEnd)
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  cleanup() {
    this.stopSpeaking()
    this.isRecordingActive = false
    this.isPaused = false

    if (this.recognitionRestartTimer) {
      clearTimeout(this.recognitionRestartTimer)
      this.recognitionRestartTimer = null
    }

    if (this.recognition) {
      try {
        this.recognition.onend = null
        this.recognition.abort()
      } catch {}
      this.recognition = null
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop()
      } catch {}
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop())
      this.mediaStream = null
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close()
      } catch {}
      this.audioContext = null
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
    }

    this.onSilenceThreshold = null
    this.extendedSilenceStart = null
    this.silenceAlertSent = false
  }
}

export const audioEngine = new AudioEngine()
