import React, { useState, useEffect } from 'react'
import {
  Mic,
  Volume2,
  Pause,
  Play,
  Square,
  ArrowRight,
  ArrowLeft,
  Keyboard,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Globe,
  CheckCircle2,
  Check,
} from 'lucide-react'
import { VoiceWaveformVisualizer } from './VoiceWaveformVisualizer'
import type { PreferredLanguage } from './LanguageSelectionModal'
import type { SpeechStatus } from '../../services/audioEngine'

export interface QuestionData {
  id: number
  question_id: string
  question_en: string
  question_hi: string
  question_hinglish: string
  hint: string
}

const SAMPLE_RESPONSES: Record<string, { en: string; hi: string; hinglish: string }> = {
  Q1: {
    en: 'People from the dominant group have been threatening our family and intimidating us.',
    hi: 'स्थानीय कुछ प्रभावशाली लोग हमारे परिवार को डरा-धमका रहे हैं और घर खाली करने का दबाव बना रहे हैं।',
    hinglish: 'Kuch log hamare parivar ko pareshan aur dhamki de rahe hain, bohot tension aur dar hai.',
  },
  Q2: {
    en: 'I am unable to sleep at night or focus on my routine due to constant fear of an attack.',
    hi: 'लगातार डर की वजह से मेरी नींद उड़ गई है और मैं अपने काम या पढ़ाई पर ध्यान नहीं दे पा रहा हूँ।',
    hinglish: 'Is situation ki wajah se meri daily life bohot disturb ho gayi hai, raat ko neend nahi aati.',
  },
  Q3: {
    en: 'Yes, they used caste-based slurs against us and warned us not to complain to the authorities.',
    hi: 'हाँ, उन्होंने जातिसूचक शब्दों का इस्तेमाल किया और पुलिस में न जाने की सीधी धमकी दी।',
    hinglish: 'Haan, unhone caste slurs use kiye aur dhamki di ki police ke paas mat jana.',
  },
  Q4: {
    en: 'I feel deeply anxious, overwhelmed, and completely stressed about our security.',
    hi: 'मैं इस वक्त बहुत असहज, डरा हुआ और मानसिक तनाव में महसूस कर रहा हूँ।',
    hinglish: 'Main emotionally bohot stressed aur helpless feel kar raha hoon, samajh nahi aa raha.',
  },
  Q5: {
    en: 'We feel completely isolated; nobody in the neighborhood is willing to stand by us.',
    hi: 'हम बिल्कुल अकेला महसूस कर रहे हैं, कोई भी मदद के लिए आगे नहीं आ रहा है।',
    hinglish: 'Pura parivar isolated feel kar raha hai, koi aage aakar sath nahi de raha.',
  },
  Q6: {
    en: 'Yes, there is an immediate threat to our physical safety and we urgently need protection.',
    hi: 'हाँ, हमें अपने और अपने परिवार की शारीरिक सुरक्षा को लेकर बहुत बड़ा खतरा महसूस हो रहा है।',
    hinglish: 'Haan, physical attack ka immediate khatra hai aur family ki safety ki chinta hai.',
  },
  Q7: {
    en: 'We need immediate nodal officer assistance, police protection, and counseling support.',
    hi: 'हमें तुरंत नोडल अधिकारी से संपर्क, सुरक्षा और कानूनी सहायता की आवश्यकता है।',
    hinglish: 'Hamein immediate nodal officer ka contact aur emergency safety assistance chahiye.',
  },
}

interface QuestionStepProps {
  questions: QuestionData[]
  currentStep: number
  mode: 'voice' | 'text'
  languagePref: PreferredLanguage
  isRecording: boolean
  audioLevel: number
  secondsElapsed: number
  transcript: string
  userAnswer: string
  onAnswerChange: (text: string) => void
  onNext: () => void
  onPrev: () => void
  onTogglePause: () => void
  isPaused: boolean
  onEndAssessment: () => void
  onSwitchToText: () => void
  onReplayAudio: () => void
  isSpeaking: boolean
  speechStatus?: SpeechStatus
  speechErrorMessage?: string
  speechLang?: 'en-IN' | 'hi-IN'
  onToggleSpeechLang?: (lang: 'en-IN' | 'hi-IN') => void
  onRestartSpeech?: () => void
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  questions,
  currentStep,
  mode,
  languagePref: _languagePref,
  isRecording,
  audioLevel,
  secondsElapsed,
  transcript,
  userAnswer,
  onAnswerChange,
  onNext,
  onPrev,
  onTogglePause,
  isPaused,
  onEndAssessment,
  onSwitchToText,
  onReplayAudio,
  isSpeaking,
  speechStatus = 'listening',
  speechErrorMessage,
  speechLang = 'en-IN',
  onToggleSpeechLang,
  onRestartSpeech,
}) => {
  const currentQuestion = questions[currentStep]
  const totalQuestions = questions.length
  const [emptyAudioWarning, setEmptyAudioWarning] = useState(false)
  const [isMarkedDone, setIsMarkedDone] = useState(false)

  // Reset marked done state whenever question step changes
  useEffect(() => {
    setIsMarkedDone(false)
    setEmptyAudioWarning(false)
  }, [currentStep])

  const getDisplayedQuestion = () => currentQuestion.question_en

  const currentAnswer = (userAnswer || transcript || '').trim()
  const isAnswerProvided = currentAnswer.length >= 2
  const sample = SAMPLE_RESPONSES[currentQuestion.question_id]

  const handleMarkDone = () => {
    const textToCommit = (userAnswer || transcript || '').trim()
    if (!textToCommit) {
      if (mode === 'voice') {
        setEmptyAudioWarning(true)
        setTimeout(() => setEmptyAudioWarning(false), 4500)
      }
      return
    }

    onAnswerChange(textToCommit)
    setIsMarkedDone(true)
    setEmptyAudioWarning(false)

    // In voice mode, pause active microphone capture so room noise is not appended
    if (mode === 'voice' && !isPaused) {
      onTogglePause()
    }
  }

  const handleNextClick = () => {
    if (!isAnswerProvided) {
      if (mode === 'voice') {
        setEmptyAudioWarning(true)
        setTimeout(() => setEmptyAudioWarning(false), 4500)
      }
      return
    }
    setEmptyAudioWarning(false)
    onNext()
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Mic className="w-5 h-5 text-[#003366] animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-[#003366] flex items-center gap-1.5">
            <span>🎙️ Your assessment is active</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Please answer naturally in English, Hindi, or Hinglish. Both spoken voice and typed responses are analyzed.
          </p>
        </div>

        {mode === 'voice' && (
          <button
            type="button"
            onClick={onSwitchToText}
            className="text-[11px] font-semibold text-blue-800 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1 flex-shrink-0"
            title="Switch to typing"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Switch to Text</span>
          </button>
        )}
      </div>

      {/* Progress Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-slate-500 text-[11px]">Assessment Progress</span>
            <span className="text-red-600 font-bold">* Required</span>
          </div>
          <span className="text-[#003366] font-mono">
            Question {currentStep + 1} of {totalQuestions} *
          </span>
        </div>

        {/* Stepper Dots & Line */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-[#003366] transition-all duration-300 z-0"
            style={{ width: `${(currentStep / (totalQuestions - 1)) * 95}%` }}
          />

          {questions.map((_, idx) => {
            const isCompleted = idx < currentStep
            const isCurrent = idx === currentStep
            return (
              <div
                key={idx}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                  isCurrent
                    ? 'bg-[#003366] text-white ring-4 ring-blue-100 scale-110'
                    : isCompleted
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {idx + 1}
              </div>
            )
          })}
        </div>
      </div>

      {/* Waveform Visualizer & Timer */}
      <VoiceWaveformVisualizer
        isRecording={isRecording && !isPaused}
        audioLevel={audioLevel}
        secondsElapsed={secondsElapsed}
        mode={mode}
      />

      {/* Question Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question presentation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Question {currentStep + 1} of {totalQuestions} *
              </span>
            </span>

            <button
              type="button"
              onClick={onReplayAudio}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 animate-pulse border border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Hear question aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeaking ? 'Speaking...' : 'Replay Voice'}</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#00274d] leading-snug">
            &ldquo;{getDisplayedQuestion()}&rdquo;
          </h2>

          {/* Multilingual subtitles */}
          <p className="text-sm text-slate-500 font-sans">{currentQuestion.question_hi}</p>
          <p className="text-xs text-slate-400 italic font-sans">{currentQuestion.question_hinglish}</p>

          {/* Answer-in-any-language badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-800">
            <span>🌐</span>
            <span>Answer freely in English, हिंदी, or Hinglish</span>
          </div>
        </div>

        {/* User Answer / Voice transcription box */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {mode === 'voice' ? 'Your Spoken Response *' : 'Your Typed Response *'}
            </label>

            {mode === 'voice' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>Mic Language:</span>
                </span>
                <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onToggleSpeechLang?.('en-IN')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      speechLang === 'en-IN'
                        ? 'bg-white text-[#003366] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English (IN)
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSpeechLang?.('hi-IN')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      speechLang === 'hi-IN'
                        ? 'bg-white text-[#003366] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    हिंदी (IN)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real-Time Speech Status Indicator in Voice Mode */}
          {mode === 'voice' && (
            <div>
              {speechStatus === 'capturing' && (
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl animate-pulse">
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
                    <span className="font-semibold">Transcribing your voice in real-time...</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkDone}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                    title="Finish speaking and mark answer as done"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done Speaking (बोलना पूरा हुआ)</span>
                  </button>
                </div>
              )}

              {speechStatus === 'listening' && (
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Microphone is active — speak clearly in {speechLang === 'hi-IN' ? 'Hindi' : 'English / Hinglish'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMarkDone}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 ${
                        isAnswerProvided
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer'
                      }`}
                      title="Mark your audio response as done"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done Speaking</span>
                    </button>
                    <button
                      type="button"
                      onClick={onRestartSpeech}
                      className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold underline flex items-center gap-0.5"
                      title="Restart microphone recognition"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Restart</span>
                    </button>
                  </div>
                </div>
              )}

              {speechStatus === 'paused' && (
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded-xl">
                  <div className="flex items-center gap-2">
                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                    <span>Recording paused.</span>
                  </div>
                  {isAnswerProvided && !isMarkedDone && (
                    <button
                      type="button"
                      onClick={handleMarkDone}
                      className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Done</span>
                    </button>
                  )}
                </div>
              )}

              {speechStatus === 'error' && (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      {speechErrorMessage || 'Speech recognition network error: Google Speech service is unavailable on this network.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onRestartSpeech}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-bold hover:bg-amber-100 text-[11px] text-amber-900 flex items-center gap-1 shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Mic</span>
                  </button>
                </div>
              )}

              {speechStatus === 'unsupported' && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Web Speech API is not supported in this browser. Please use Chrome/Edge or type your response.</span>
                </div>
              )}
            </div>
          )}

          {/* Answer marked completed banner */}
          {isMarkedDone && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 font-black" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Answer marked as completed!</p>
                  <p className="text-[11px] text-emerald-700">
                    Your response is saved. Click &ldquo;Next Question →&rdquo; to continue, or resume speaking below.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMarkedDone(false)
                  if (isPaused) onTogglePause()
                }}
                className="text-[11px] px-3 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-bold hover:bg-emerald-100 shadow-2xs transition-colors flex-shrink-0"
              >
                Edit / Speak More
              </button>
            </div>
          )}

          <div className="relative">
            <textarea
              rows={4}
              value={userAnswer || transcript}
              onChange={(e) => {
                onAnswerChange(e.target.value)
                if (isMarkedDone) setIsMarkedDone(false)
              }}
              placeholder={
                mode === 'voice'
                  ? speechLang === 'hi-IN'
                    ? 'माइक चालू है... (हिंदी में बोलें या नीचे सीधे टाइप करें)'
                    : 'Listening for your voice... (Speak naturally in English, Hindi, or Hinglish, or type directly)'
                  : 'Type your answer here in English, Hindi, or Hinglish...'
              }
              className={`w-full text-xs sm:text-sm border rounded-2xl p-4 pb-14 focus:ring-2 focus:ring-[#003366] focus:outline-hidden transition-all shadow-inner leading-relaxed ${
                isMarkedDone
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 bg-slate-50/70 focus:bg-white'
              }`}
            />

            {/* In Audio Mode: Quick "Mark as Done" button directly inside response box */}
            {mode === 'voice' && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {isMarkedDone ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>✓ Answer Marked Done</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkDone}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                      isAnswerProvided
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                    title="Finish speaking and mark this answer done"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Done (बोलना पूरा हुआ)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Voice / Sample Response Options */}
          {sample && (
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                <span className="font-semibold flex items-center gap-1 text-slate-700">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Quick Voice Samples (Click to test / populate):</span>
                </span>
                <span className="text-[10px] text-slate-400">English • हिंदी • Hinglish</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onAnswerChange(sample.en)
                    setEmptyAudioWarning(false)
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003366] hover:border-blue-300 border border-slate-200 text-slate-700 transition-colors text-left"
                  title="Click to insert English sample"
                >
                  🇬🇧 &ldquo;{sample.en.length > 40 ? sample.en.slice(0, 40) + '...' : sample.en}&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAnswerChange(sample.hi)
                    setEmptyAudioWarning(false)
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003366] hover:border-blue-300 border border-slate-200 text-slate-700 transition-colors text-left"
                  title="Click to insert Hindi sample"
                >
                  🇮🇳 &ldquo;{sample.hi.length > 40 ? sample.hi.slice(0, 40) + '...' : sample.hi}&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAnswerChange(sample.hinglish)
                    setEmptyAudioWarning(false)
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#003366] hover:border-blue-300 border border-slate-200 text-slate-700 transition-colors text-left"
                  title="Click to insert Hinglish sample"
                >
                  🗣️ &ldquo;{sample.hinglish.length > 40 ? sample.hinglish.slice(0, 40) + '...' : sample.hinglish}&rdquo;
                </button>
              </div>
            </div>
          )}

          {/* Meaningful Audio / Answer Warning */}
          {emptyAudioWarning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">We couldn&apos;t hear an answer.</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Please speak into your microphone or type your response before continuing. You can also click any of
                  the Quick Voice Samples above.
                </p>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-500 italic">{currentQuestion.hint}</p>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {mode === 'voice' && (
              <button
                type="button"
                onClick={onTogglePause}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onEndAssessment}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>End Assessment</span>
            </button>
          </div>

          {/* Navigation with disabled state if empty */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={onPrev}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            {mode === 'voice' && !isMarkedDone && (
              <button
                type="button"
                onClick={handleMarkDone}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border flex items-center gap-1.5 transition-all active:scale-95 ${
                  isAnswerProvided
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs cursor-pointer'
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 cursor-pointer'
                }`}
                title="Mark this answer as completed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Done</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNextClick}
              disabled={!isAnswerProvided}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all ${
                isAnswerProvided
                  ? isMarkedDone
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-300 cursor-pointer'
                    : 'bg-[#003366] hover:bg-[#002244] text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
              title={isAnswerProvided ? 'Proceed to next question' : 'Answer is required'}
            >
              <span>{currentStep === totalQuestions - 1 ? 'Complete Assessment →' : 'Next Question →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
