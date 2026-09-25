import React, { useState } from 'react'
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react'

interface AssessmentLandingProps {
  onStartNew: () => void
  onStartText?: () => void
  onReturningUserFound: (userData: {
    anonymousId: string
    counsellorId: string
    hasPreviousChat: boolean
    chatSession: any
    previousAssessment: any
  }) => void
}

export const AssessmentLanding: React.FC<AssessmentLandingProps> = ({
  onStartNew,
  onStartText,
  onReturningUserFound,
}) => {
  const [anonymousIdInput, setAnonymousIdInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleContinuePrevious = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanId = anonymousIdInput.trim().toUpperCase()
    if (!cleanId) {
      setErrorMessage('Please enter your Anonymous ID.')
      return
    }

    if (cleanId.length < 4) {
      setErrorMessage('Anonymous ID must be at least 4 characters (e.g. ST-XXXXXX).')
      return
    }

    setIsLoading(true)
    // Rule-based local lookup with brief UI feedback
    await new Promise((res) => setTimeout(res, 400))

    try {
      // 1. Check localStorage for past sessions
      const localRecord = localStorage.getItem(`NHAA_USER_${cleanId}`)
      if (localRecord) {
        try {
          const parsed = JSON.parse(localRecord)
          onReturningUserFound({
            anonymousId: cleanId,
            counsellorId: parsed.counsellorId || 'C-104',
            hasPreviousChat: Boolean(parsed.hasPreviousChat),
            chatSession: parsed.chatSession || null,
            previousAssessment: parsed.result || null,
          })
          setIsLoading(false)
          return
        } catch {
          // fall through
        }
      }

      // 2. Built-in Demo ID (ST-82K7P4)
      if (cleanId === 'ST-82K7P4') {
        onReturningUserFound({
          anonymousId: 'ST-82K7P4',
          counsellorId: 'C-104',
          hasPreviousChat: true,
          chatSession: {
            session_id: 'CHAT-82K7P4',
            messages: [
              {
                id: 'msg-seed-1',
                sender: 'counsellor',
                text: "Hello. I'm Counsellor C-104. I'm here to listen. How would you like to begin?",
                timestamp: 'Yesterday, 14:15',
              },
              {
                id: 'msg-seed-2',
                sender: 'user',
                text: 'I want to talk about what happened at my village and college.',
                timestamp: 'Yesterday, 14:16',
              },
              {
                id: 'msg-seed-3',
                sender: 'counsellor',
                text: 'Thank you for sharing that with me. We are here to support you step by step.',
                timestamp: 'Yesterday, 14:18',
              },
            ],
          },
          previousAssessment: null,
        })
        setIsLoading(false)
        return
      }

      // 3. Any properly formatted ST- ID can be resumed or retaken
      if (cleanId.startsWith('ST-')) {
        onReturningUserFound({
          anonymousId: cleanId,
          counsellorId: 'C-104',
          hasPreviousChat: false,
          chatSession: null,
          previousAssessment: null,
        })
        setIsLoading(false)
        return
      }

      setErrorMessage('Anonymous ID not recognized.\nPlease enter an ID in format ST-XXXXXX or click Start New Assessment.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-1">
      
      {/* Landing Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#003366]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Confidential Government Support System</span>
        </div>
        <h2 className="text-2xl font-black text-[#00274d] tracking-tight">
          Stress & Trauma Assessment
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          Choose whether you are starting a new confidential assessment or continuing a previous support discussion.
        </p>
      </div>

      {/* Dual Options matching Section 2 of requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        
        {/* Option 1: Start New Assessment */}
        <div
          onClick={(e) => { e.preventDefault(); onStartNew(); }}
          className="bg-white border-2 border-slate-200 hover:border-blue-700 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs transition-all duration-200 group cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStartNew(); } }}
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#003366]" />
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-blue-700 tracking-wider">
                New User
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Start New Assessment
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                For users taking the assessment for the first time. Generates a new unique Anonymous ID and guides you through 7 confidential questions.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              id="btn-start-new-assessment"
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStartNew(); }}
              className="flex-1 py-2.5 px-4 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>🎙 Start Voice Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onStartText && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStartText(); }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                title="Start directly in text questionnaire mode"
              >
                <span>⌨ Text Only</span>
              </button>
            )}
          </div>
        </div>

        {/* Option 2: Continue Previous Chat */}
        <div className="bg-white border-2 border-slate-200 hover:border-blue-700 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs transition-all duration-200">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
                Returning User
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Continue Previous Chat
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Enter your previously generated Anonymous ID to continue your support conversation with your assigned counsellor.
              </p>
            </div>

            {/* Anonymous ID input form */}
            <form onSubmit={handleContinuePrevious} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-700" />
                  <span>Enter Previous Anonymous ID:</span>
                </label>
                <input
                  type="text"
                  value={anonymousIdInput}
                  onChange={(e) => setAnonymousIdInput(e.target.value)}
                  placeholder="ST-82K7P4"
                  className="w-full text-sm font-mono uppercase tracking-wider border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003366] focus:outline-hidden"
                />
              </div>

              {/* Error Message matching Section 5 */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Demo Returning ID:</span>
                <button
                  type="button"
                  onClick={() => setAnonymousIdInput('ST-82K7P4')}
                  className="font-mono font-bold text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded"
                >
                  ST-82K7P4
                </button>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{isLoading ? 'Verifying...' : 'Continue'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  )
}
