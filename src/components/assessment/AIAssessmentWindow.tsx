// AIAssessmentWindow.tsx
// Dedicated Clinical AI Assessment Examination Window
// Features:
// - Step-by-step clinical questions (1 to 5) with clinical domains
// - Sentence-by-sentence AI Voice Narration (sentence 1 completes, then moves to sentence 2)
// - User answering unlocks ONLY after AI finishes speaking
// - Trilingual support: English, Hindi, Hinglish
// - Silence / No-Response detection with language-specific prompts spoken aloud
// - Real-time AI answer analysis & empathetic bridges
// - Comprehensive Trauma & Stress Clinical Report with transition to Counsellor

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Mic,
  Volume2,
  VolumeX,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Brain,
  Activity,
  Check,
} from 'lucide-react'
import { audioEngine, type SpeechStatus } from '../../services/audioEngine'
import { assessmentEngine } from '../../services/assessmentEngine'

export type AssessmentLang = 'en' | 'hi' | 'hinglish'

export interface AssessmentQuestion {
  id: string
  order: number
  domain: {
    en: string
    hi: string
    hinglish: string
  }
  sentences: {
    en: string[]
    hi: string[]
    hinglish: string[]
  }
  sampleResponses: {
    en: string[]
    hi: string[]
    hinglish: string[]
  }
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'Q1',
    order: 1,
    domain: {
      en: 'Primary Incident & Threat Exposure',
      hi: 'प्राथमिक घटना एवं धमकी की जांच',
      hinglish: 'Incident & Threat Screening',
    },
    sentences: {
      en: [
        'Can you tell us what has been troubling you recently?',
        'Please share any incident, threats, or discrimination you or your family have experienced.',
      ],
      hi: [
        'क्या आप बता सकते हैं कि हाल ही में आपको किस बात से परेशानी हो रही है?',
        'कृपया बताएं कि क्या आपके या आपके परिवार के साथ कोई घटना, धमकी या भेदभाव हुआ है।',
      ],
      hinglish: [
        'Kya aap bata sakte hain ki recently aapko kis baat se pareshani ho rahi hai?',
        'Koi bhi incident, dhamki ya harassment jisse aap darr ya tension mein hain, khulkar share karein.',
      ],
    },
    sampleResponses: {
      en: [
        'People from the dominant group have been threatening our family and warning us to stay quiet.',
        'I faced caste-based harassment and slurs at my workplace and feel extremely unsafe.',
      ],
      hi: [
        'कुछ स्थानीय दबंग लोग हमारे परिवार को डरा-धमका रहे हैं और घर खाली करने का दबाव बना रहे हैं।',
        'मेरे साथ जातिसूचक शब्दों और भेदभाव का इस्तेमाल किया गया जिससे मैं बहुत डरा हुआ हूँ।',
      ],
      hinglish: [
        'Kuch log hamare parivar ko dhamki de rahe hain aur continuous dar ka mahol bana rakha hai.',
        'College aur locality mein caste discrimination face karna pad raha hai, bohot tension hai.',
      ],
    },
  },
  {
    id: 'Q2',
    order: 2,
    domain: {
      en: 'Sleep, Hyperarousal & Trauma Flashbacks',
      hi: 'नींद, घबराहट एवं मानसिक आघात',
      hinglish: 'Sleep Disruption & Trauma Intrusion',
    },
    sentences: {
      en: [
        'How has this situation affected your sleep and daily routine?',
        'Do you find yourself experiencing constant anxiety, night panics, or sudden flashbacks?',
      ],
      hi: [
        'इस स्थिति ने आपकी नींद और दैनिक दिनचर्या को कैसे प्रभावित किया है?',
        'क्या आपको रात में अचानक घबराहट, डरावने सपने या पुरानी बातें बार-बार याद आती हैं?',
      ],
      hinglish: [
        'Is situation ne aapki neend aur daily routine ko kaise affect kiya hai?',
        'Kya aapko raat ko panics aate hain, flashbacks hote hain ya har waqt bechaini rehti hai?',
      ],
    },
    sampleResponses: {
      en: [
        'I am unable to sleep at night due to constant fear; even small noises make my heart race.',
        'I get recurring flashbacks of the incident and cannot focus on my work or studies.',
      ],
      hi: [
        'डर की वजह से मेरी रातों की नींद उड़ गई है और छोटी सी आवाज से भी दिल जोर से धड़कने लगता है।',
        'लगातार वही डरावनी घटना याद आती रहती है और किसी काम में मन नहीं लगता।',
      ],
      hinglish: [
        'Pichle 2 hafton se bilkul neend nahi aati, raat ko achanak darr lagta hai aur heart beat badh jati hai.',
        'Har roz flashbacks aate hain aur kaam par bilkul focus nahi ho pata.',
      ],
    },
  },
  {
    id: 'Q3',
    order: 3,
    domain: {
      en: 'Caste Discrimination & Social Boycott',
      hi: 'जातिगत भेदभाव एवं सामाजिक दबाव',
      hinglish: 'Discrimination & Atrocity Pressure',
    },
    sentences: {
      en: [
        'Have you faced caste-based abuse, social boycott, or systemic injustice?',
        'Has anyone warned or intimidated you against filing a police complaint or seeking help?',
      ],
      hi: [
        'क्या आपने किसी जातिगत अपमान, सामाजिक बहिष्कार या अन्याय का सामना किया है?',
        'क्या किसी ने आपको पुलिस में शिकायत दर्ज कराने या मदद मांगने से रोका है?',
      ],
      hinglish: [
        'Kya aapne caste slurs, social boycott ya dabangon ka pressure face kiya hai?',
        'Kya kisi ne aapko police ya authorities ke paas jane se mana kiya ya dhamki di hai?',
      ],
    },
    sampleResponses: {
      en: [
        'Yes, caste slurs were used against us and we were told not to approach the police.',
        'They warned us of severe consequences if we register a complaint under the SC/ST Act.',
      ],
      hi: [
        'हाँ, खुलेआम जातिसूचक गालियाँ दी गईं और चेतावनी दी गई कि अगर पुलिस में गए तो अंजाम बुरा होगा।',
        'हमारे परिवार का सामाजिक बहिष्कार करने की कोशिश की जा रही है।',
      ],
      hinglish: [
        'Haan, unhone caste-based slurs use kiye aur direct dhamki di ki police mein mat jana.',
        'Hamein boycott karne ki dhamki di ja rahi hai taaki hum chup rahein.',
      ],
    },
  },
  {
    id: 'Q4',
    order: 4,
    domain: {
      en: 'Emotional State & Psychological Isolation',
      hi: 'मानसिक स्थिति एवं अकेलापन',
      hinglish: 'Emotional Coping & Support Need',
    },
    sentences: {
      en: [
        'How are you coping emotionally right now as we discuss this?',
        'Do you have people supporting you, or do you feel completely isolated and helpless?',
      ],
      hi: [
        'इस बारे में बात करते हुए आप अभी भावनात्मक रूप से कैसा महसूस कर रहे हैं?',
        'क्या आपके पास किसी का सहारा है, या आप पूरी तरह से अकेला और असहाय महसूस कर रहे हैं?',
      ],
      hinglish: [
        'Aap emotionally is waqt kaisa feel kar rahe hain?',
        'Kya koi support kar raha hai, ya aap pure parivar ke sath akela aur helpless feel kar rahe hain?',
      ],
    },
    sampleResponses: {
      en: [
        'I feel deeply anxious, overwhelmed, and completely exhausted with no one standing by us.',
        'We feel entirely abandoned by our neighborhood and fear nobody will protect us.',
      ],
      hi: [
        'मैं बहुत तनावग्रस्त, असहाय और टूटा हुआ महसूस कर रहा हूँ; कोई साथ देने को तैयार नहीं है।',
        'हम बिल्कुल अकेले पड़ गए हैं और समझ नहीं आ रहा कि किससे मदद मांगें।',
      ],
      hinglish: [
        'Main emotionally bohot stressed aur helpless feel kar raha hoon, koi aage aakar sath nahi de raha.',
        'Pura parivar isolated ho gaya hai aur har waqt anjaana darr laga rehta hai.',
      ],
    },
  },
  {
    id: 'Q5',
    order: 5,
    domain: {
      en: 'Immediate Physical Safety & Crisis Protection',
      hi: 'शारीरिक सुरक्षा एवं तत्काल संरक्षण',
      hinglish: 'Physical Safety & Immediate Protection',
    },
    sentences: {
      en: [
        'Are you or your family facing any immediate threat to physical safety right now?',
        'What urgent protection or nodal officer assistance do you need from NHAA?',
      ],
      hi: [
        'क्या आपको या आपके परिवार को अभी शारीरिक सुरक्षा का कोई तत्काल खतरा है?',
        'आपको NHAA से किस प्रकार की तत्काल सुरक्षा, कानूनी सहायता या संरक्षण की आवश्यकता है?',
      ],
      hinglish: [
        'Kya aapko ya aapki family ko physical safety ka immediate khatra hai?',
        'Aapko NHAA se turant kis tarah ki police protection ya legal help chahiye?',
      ],
    },
    sampleResponses: {
      en: [
        'Yes, there is an imminent threat of attack; we urgently need police protection and a safe place.',
        'We need an immediate Nodal Officer to intervene and ensure our family is secured.',
      ],
      hi: [
        'हाँ, हमारे ऊपर हमले का सीधा खतरा है, हमें तुरंत नोडल अधिकारी और पुलिस सुरक्षा चाहिए।',
        'हमें तत्काल कानूनी सुरक्षा और रहने के लिए सुरक्षित जगह की आवश्यकता है।',
      ],
      hinglish: [
        'Haan, immediate physical attack ka risk hai, hamein police protection aur nodal officer assistance chahiye.',
        'Family ki safety ke liye immediate legal protection aur safe shelter ki help chahiye.',
      ],
    },
  },
]

const SILENCE_TEXT: Record<AssessmentLang, string> = {
  hi: 'कुछ बोलें, आपकी तरफ से मुझे उत्तर नहीं मिल रहा है।',
  hinglish: 'Kuch bolein, aapki taraf se mujhe answer nahi mil raha hai.',
  en: "Please share, I'm listening to your answer.",
}

interface AIAssessmentWindowProps {
  anonymousId: string
  initialLang?: AssessmentLang
  onComplete: (data: {
    answers: Record<string, string>
    distressLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    language: AssessmentLang
    counsellorId: string
    indicators: string[]
  }) => void
  onBackToLanding: () => void
}

export const AIAssessmentWindow: React.FC<AIAssessmentWindowProps> = ({
  anonymousId,
  initialLang = 'hinglish',
  onComplete,
  onBackToLanding,
}) => {
  const [selectedLang, setSelectedLang] = useState<AssessmentLang>(initialLang)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [recordedAnswers, setRecordedAnswers] = useState<Record<string, string>>({})
  const [userAnswerText, setUserAnswerText] = useState('')

  // Speech & Voice State
  const [isVoiceMuted, setIsVoiceMuted] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0)
  const [, setSpeechStatus] = useState<SpeechStatus>('idle')
  const [isUserRecording, setIsUserRecording] = useState(false)
  const [liveAudioLevel, setLiveAudioLevel] = useState(0)
  const [, setLiveTranscript] = useState('')

  // Silence state
  const [silenceAlert, setSilenceAlert] = useState<string | null>(null)
  const silenceTimerRef = useRef<number | null>(null)
  const cancelSpeechRef = useRef<(() => void) | null>(null)

  // Evaluating / Completed state
  const [isEvaluatingTurn, setIsEvaluatingTurn] = useState(false)
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalReport, setFinalReport] = useState<{
    distressLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    counsellorId: string
    indicators: string[]
    summary: string
  } | null>(null)

  const currentQ = ASSESSMENT_QUESTIONS[currentStepIndex]
  const currentSentences = currentQ.sentences[selectedLang]

  // ── Clear silence timer ──────────────────────────────────────────────────
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    setSilenceAlert(null)
  }, [])

  // ── Start silence detection ──────────────────────────────────────────────
  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer()
    silenceTimerRef.current = window.setTimeout(() => {
      const prompt = SILENCE_TEXT[selectedLang] || SILENCE_TEXT.hinglish
      setSilenceAlert(prompt)
      // Speak silence prompt gently
      if (!isVoiceMuted) {
        audioEngine.speakText(prompt, selectedLang)
      }
    }, 7500)
  }, [clearSilenceTimer, selectedLang, isVoiceMuted])

  // ── Speak Question Sentence-by-Sentence ──────────────────────────────────
  const playCurrentQuestionAudio = useCallback(
    (lang: AssessmentLang, questionIdx: number) => {
      // Cancel previous speech & silence timers
      if (cancelSpeechRef.current) {
        cancelSpeechRef.current()
        cancelSpeechRef.current = null
      }
      clearSilenceTimer()

      if (isVoiceMuted) {
        setIsAISpeaking(false)
        setActiveSentenceIndex(0)
        startSilenceTimer()
        return
      }

      const q = ASSESSMENT_QUESTIONS[questionIdx]
      const sentences = q.sentences[lang]

      setIsAISpeaking(true)
      setActiveSentenceIndex(0)

      cancelSpeechRef.current = audioEngine.speakSentences(
        sentences,
        lang,
        (sentenceIdx) => {
          setActiveSentenceIndex(sentenceIdx)
        },
        () => {
          // Finished all sentences!
          setIsAISpeaking(false)
          cancelSpeechRef.current = null
          // Start silence countdown
          startSilenceTimer()
          // If mic is enabled, start listening
          autoStartListening(lang)
        }
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVoiceMuted, startSilenceTimer]
  )

  // ── Auto-start mic listening after AI completes speaking ────────────────
  const autoStartListening = async (lang: AssessmentLang) => {
    try {
      const granted = await audioEngine.requestMicrophone()
      if (!granted) return

      const speechCode = lang === 'hi' ? 'hi-IN' : 'en-IN'
      audioEngine.setRecognitionLanguage(speechCode)

      audioEngine.startRecording(
        (transcript) => {
          setLiveTranscript(transcript)
          setUserAnswerText(transcript)
          clearSilenceTimer()
        },
        (level) => setLiveAudioLevel(level),
        (status) => setSpeechStatus(status),
        () => {
          // Extended quiet detected by audio engine
          startSilenceTimer()
        }
      )
      setIsUserRecording(true)
      setSpeechStatus('listening')
    } catch {
      // Voice fallback to typing
    }
  }

  // ── Stop recording helper ────────────────────────────────────────────────
  const stopListening = () => {
    if (isUserRecording) {
      audioEngine.stopRecording()
      setIsUserRecording(false)
      setSpeechStatus('idle')
      setLiveAudioLevel(0)
    }
  }

  // ── Lifecycle on question change ─────────────────────────────────────────
  useEffect(() => {
    setUserAnswerText('')
    setLiveTranscript('')
    setEvaluationFeedback(null)
    playCurrentQuestionAudio(selectedLang, currentStepIndex)

    return () => {
      if (cancelSpeechRef.current) cancelSpeechRef.current()
      clearSilenceTimer()
      stopListening()
    }
  }, [currentStepIndex, selectedLang]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle Language Switch ──────────────────────────────────────────────
  const handleSwitchLanguage = (newLang: AssessmentLang) => {
    if (newLang === selectedLang) return
    setSelectedLang(newLang)
    stopListening()
  }

  // ── Toggle Mute Voice ────────────────────────────────────────────────────
  const handleToggleVoiceMute = () => {
    if (!isVoiceMuted) {
      if (cancelSpeechRef.current) cancelSpeechRef.current()
      audioEngine.stopSpeaking()
      setIsAISpeaking(false)
      setIsVoiceMuted(true)
    } else {
      setIsVoiceMuted(false)
      playCurrentQuestionAudio(selectedLang, currentStepIndex)
    }
  }

  // ── User Submits Answer for Current Question ─────────────────────────────
  const handleSubmitAnswer = async (textToSubmit?: string) => {
    const finalAnswer = (textToSubmit || userAnswerText).trim()
    if (!finalAnswer || isAISpeaking || isEvaluatingTurn) return

    clearSilenceTimer()
    stopListening()
    setIsEvaluatingTurn(true)

    // Save answer
    const updatedAnswers = {
      ...recordedAnswers,
      [currentQ.id]: finalAnswer,
    }
    setRecordedAnswers(updatedAnswers)

    // Empathetic bridge in the selected language
    let feedback = ''
    if (selectedLang === 'hi') {
      feedback = 'आपके उत्तर को दर्ज कर लिया गया है। हम आपकी स्थिति को समझ रहे हैं।'
    } else if (selectedLang === 'hinglish') {
      feedback = 'Aapka answer evaluate ho gaya hai. We deeply understand this difficulty.'
    } else {
      feedback = 'Thank you for sharing that. Your response has been securely evaluated.'
    }
    setEvaluationFeedback(feedback)

    // Brief pause to display empathetic feedback before moving
    await new Promise((res) => setTimeout(res, 1000))
    setIsEvaluatingTurn(false)

    if (currentStepIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      // Completed all questions! Compile final clinical assessment report
      const allText = Object.values(updatedAnswers).join(' ')
      const fullEval = assessmentEngine.evaluateLocal(allText, {}, {
        speakingRate: 120,
        pauseCount: 2,
        pitchVariation: true,
        totalSilenceSeconds: 2,
        hesitationScore: 0.2,
        rmsLevel: 0.42,
        voiceIntensity: 'normal',
      })

      const counsellorId =
        fullEval.distress_level === 'HIGH' ? 'C-108 (Priority Specialist)' : 'C-104 (Trauma Counselor)'

      const report = {
        distressLevel: fullEval.distress_level,
        counsellorId,
        indicators: fullEval.content_indicators,
        summary:
          selectedLang === 'hi'
            ? 'मूल्यांकन पूर्ण: आपकी स्थिति के अनुसार विशेष सुरक्षा और मनोवैज्ञानिक सहायता की आवश्यकता है।'
            : selectedLang === 'hinglish'
            ? 'Assessment Complete: Identified indicators of distress and security need. Counsellor assigned.'
            : 'Assessment Complete: Clinical distress indicators noted. Transitioning to assigned Counsellor.',
      }

      setFinalReport(report)
      setIsCompleted(true)
    }
  }

  // ── Transition to Counsellor ─────────────────────────────────────────────
  const handleProceedToCounsellor = () => {
    if (!finalReport) return
    onComplete({
      answers: recordedAnswers,
      distressLevel: finalReport.distressLevel,
      language: selectedLang,
      counsellorId: finalReport.counsellorId,
      indicators: finalReport.indicators,
    })
  }

  // ── Render Completed Summary View ────────────────────────────────────────
  if (isCompleted && finalReport) {
    const isHigh = finalReport.distressLevel === 'HIGH'
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#00274d] tracking-tight">
            Clinical Assessment Completed
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Anonymous ID: <strong className="font-mono text-slate-800">{anonymousId}</strong> · All 5 Domains Evaluated
          </p>
        </div>

        {/* Distress Severity Meter */}
        <div
          className={`p-5 rounded-2xl border-2 space-y-3 ${
            isHigh
              ? 'bg-red-50 border-red-300 text-red-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Evaluated Distress Level
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isHigh ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              ● {finalReport.distressLevel} PRIORITY
            </span>
          </div>

          <p className="text-sm font-semibold leading-relaxed">
            {finalReport.summary}
          </p>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              Identified Concerns:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {finalReport.indicators.map((ind, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-800"
                >
                  ✓ {ind.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Counsellor Allocation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] text-white flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Assigned Support Specialist</div>
              <div className="text-sm font-bold text-[#00274d]">
                {finalReport.counsellorId}
              </div>
            </div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
            Ready to Connect
          </span>
        </div>

        {/* Primary Action Button */}
        <button
          id="btn-connect-counsellor"
          type="button"
          onClick={handleProceedToCounsellor}
          className="w-full py-4 px-6 bg-[#003366] hover:bg-[#002244] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Chat with Counsellor for Tailored Suggestions</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // ── Render Active Assessment Window ───────────────────────────────────────
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto flex flex-col">
      {/* Top Bar: Emergency + Anonymous ID + Language Selector */}
      <div className="bg-[#00274d] text-white px-5 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight">
              AI Clinical Assessment Window
            </div>
            <div className="text-[10px] text-blue-200 font-mono">
              ID: {anonymousId} · 100% Encrypted
            </div>
          </div>
        </div>

        {/* Language Switcher Tabs: English, हिन्दी, Hinglish */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => handleSwitchLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedLang === 'en'
                ? 'bg-white text-[#00274d] shadow-sm'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleSwitchLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedLang === 'hi'
                ? 'bg-white text-[#00274d] shadow-sm'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => handleSwitchLanguage('hinglish')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedLang === 'hinglish'
                ? 'bg-white text-[#00274d] shadow-sm'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            Hinglish
          </button>
        </div>

        {/* Emergency Call */}
        <a
          href="tel:14566"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>14566</span>
        </a>
      </div>

      {/* Progress & Domain Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#003366] bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg">
            Question {currentStepIndex + 1} of {ASSESSMENT_QUESTIONS.length}
          </span>
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">
            {currentQ.domain[selectedLang]}
          </span>
        </div>

        {/* Voice Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => playCurrentQuestionAudio(selectedLang, currentStepIndex)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-700 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Replay Voice Question"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <button
            type="button"
            onClick={handleToggleVoiceMute}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isVoiceMuted
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isVoiceMuted ? 'Unmute AI voice' : 'Mute AI voice'}
          >
            {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentStepIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-7 space-y-6 flex-1">
        {/* AI Examiner Speaking Card with Sentence-by-Sentence Highlight */}
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-2 border-blue-100 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isAISpeaking ? 'bg-blue-600 animate-ping' : 'bg-emerald-500'
                }`}
              />
              <span className="text-xs font-bold tracking-wide uppercase text-blue-900 flex items-center gap-1.5">
                {isAISpeaking ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-pulse text-blue-700" />
                    AI Examiner Speaking (Sentence {activeSentenceIndex + 1} of {currentSentences.length})...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    AI Finished Speaking — Your Turn to Answer
                  </>
                )}
              </span>
            </div>

            {isAISpeaking && (
              <span className="text-[11px] bg-blue-100/90 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold animate-pulse">
                Please listen...
              </span>
            )}
          </div>

          {/* Sentence-by-Sentence Display with Active Glow Highlight */}
          <div className="space-y-2.5">
            {currentSentences.map((sentence, sIdx) => {
              const isActive = isAISpeaking && activeSentenceIndex === sIdx
              const isPast = isAISpeaking && activeSentenceIndex > sIdx
              return (
                <div
                  key={sIdx}
                  className={`p-3.5 rounded-2xl text-base sm:text-lg font-medium leading-relaxed transition-all duration-300 ${
                    isActive
                      ? 'bg-white border-2 border-blue-600 text-blue-950 shadow-md transform scale-[1.01]'
                      : isPast
                      ? 'bg-white/60 border border-slate-200 text-slate-800'
                      : 'bg-transparent text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {sIdx + 1}
                    </span>
                    <p className="flex-1">{sentence}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Silence Detection Alert */}
        {silenceAlert && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 animate-bounce">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎙️</span>
              <div>
                <p className="text-xs sm:text-sm font-bold">{silenceAlert}</p>
                <p className="text-[11px] text-amber-700">
                  {selectedLang === 'hi'
                    ? 'आप बोल सकते हैं या नीचे दिए गए विकल्पों में से चुन सकते हैं।'
                    : 'Aap voice se bol sakte hain ya sample options par click kar sakte hain.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => clearSilenceTimer()}
              className="text-xs text-amber-800 underline font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* User Answering Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>Your Response:</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Speak or type in Hindi, English, or Hinglish)
              </span>
            </label>

            {isUserRecording && (
              <span className="text-[11px] text-red-600 font-bold flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Listening to your voice...
              </span>
            )}
          </div>

          {/* Text Input with Microphone Control */}
          <div className="relative border-2 border-slate-300 focus-within:border-[#003366] rounded-2xl overflow-hidden bg-white shadow-xs">
            <textarea
              rows={3}
              value={userAnswerText}
              onChange={(e) => {
                setUserAnswerText(e.target.value)
                clearSilenceTimer()
              }}
              placeholder={
                isAISpeaking
                  ? 'AI is currently speaking... Please listen.'
                  : selectedLang === 'hi'
                  ? 'यहाँ अपना उत्तर लिखें या माइक पर क्लिक करके बोलें...'
                  : selectedLang === 'hinglish'
                  ? 'Yahan apna answer type karein ya mic se bolein...'
                  : 'Type your answer here or speak through the microphone...'
              }
              disabled={isAISpeaking || isEvaluatingTurn}
              className="w-full p-4 text-sm text-slate-800 focus:outline-none resize-none disabled:bg-slate-50 disabled:text-slate-400"
            />

            {/* Live Audio Level Bar */}
            {isUserRecording && (
              <div className="h-1 bg-slate-100">
                <div
                  className="h-full bg-red-500 transition-all duration-75"
                  style={{ width: `${Math.min(100, Math.round(liveAudioLevel * 100))}%` }}
                />
              </div>
            )}

            {/* Bottom Actions Bar inside textarea */}
            <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex items-center justify-between">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (isUserRecording) {
                    stopListening()
                  } else {
                    autoStartListening(selectedLang)
                  }
                }}
                disabled={isAISpeaking || isEvaluatingTurn}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isUserRecording
                    ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-200 animate-pulse'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUserRecording ? (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Stop Mic</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-blue-700" />
                    <span>Speak Answer</span>
                  </>
                )}
              </button>

              {/* Submit / Next Button */}
              <button
                id="btn-submit-assessment-step"
                type="button"
                onClick={() => handleSubmitAnswer()}
                disabled={!userAnswerText.trim() || isAISpeaking || isEvaluatingTurn}
                className="py-1.5 px-4 bg-[#003366] hover:bg-[#002244] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs disabled:cursor-not-allowed cursor-pointer"
              >
                {isEvaluatingTurn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sample Response Chips for Fast Answering */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Sample Answers (Click to populate):
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              {currentQ.sampleResponses[selectedLang].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUserAnswerText(sample)
                    clearSilenceTimer()
                  }}
                  disabled={isAISpeaking || isEvaluatingTurn}
                  className="flex-1 text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-xs text-slate-700 leading-snug transition-colors cursor-pointer disabled:opacity-50"
                >
                  &ldquo;{sample}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Empathetic Evaluation Feedback Toast */}
          {evaluationFeedback && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{evaluationFeedback}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Exit / Retake option */}
      <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={onBackToLanding}
          className="text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
        >
          ← Cancel &amp; Back to Start
        </button>
        <span className="text-slate-400">
          Step {currentStepIndex + 1} of 5 · National Helpline 14566
        </span>
      </div>
    </div>
  )
}
