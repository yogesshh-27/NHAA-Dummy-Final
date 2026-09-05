import React, { useState } from 'react'
import { ShieldCheck, Mic, Keyboard, X, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

interface ConsentModalProps {
  isOpen: boolean
  anonymousId: string
  onAgreeVoice: () => void
  onChooseText: () => void
  onCancel: () => void
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  anonymousId,
  onAgreeVoice,
  onChooseText,
  onCancel,
}) => {
  const [canSpeakChoice, setCanSpeakChoice] = useState<'yes' | 'no'>('yes')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="bg-[#00274d] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Confidential & Anonymous Assessment
              </span>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-3">
            Informed Consent & Assessment Mode
          </h2>
          <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-full bg-blue-900/70 border border-blue-400/40 text-xs text-blue-100 font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Assigned Anonymous ID: {anonymousId}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-slate-700 text-xs sm:text-sm">
          
          {/* Official Consent Quote */}
          <blockquote className="bg-slate-50 border-l-4 border-blue-800 p-3.5 rounded-r-lg text-slate-700 leading-relaxed text-xs">
            &ldquo;This assessment uses your voice and spoken responses to understand your situation and provide an appropriate support pathway. Your conversation will be recorded and converted into text for analysis. Voice characteristics may also be analyzed as supporting signals. You can choose a text-based assessment instead.&rdquo;
          </blockquote>

          {/* Preliminary Check: Can you speak? */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 text-xs sm:text-sm">
              Can you speak during this assessment?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCanSpeakChoice('yes')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  canSpeakChoice === 'yes'
                    ? 'border-blue-700 bg-blue-50/70 ring-2 ring-blue-700/20 text-[#003366]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm">Yes, I can speak</span>
                  <span className="text-[11px] text-slate-500">Audio-first voice assessment</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCanSpeakChoice('no')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  canSpeakChoice === 'no'
                    ? 'border-blue-700 bg-blue-50/70 ring-2 ring-blue-700/20 text-[#003366]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-xs sm:text-sm">No, I prefer not to speak</span>
                  <span className="text-[11px] text-slate-500">Text-based questionnaire</span>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy & Safeguard notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <AlertCircle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <span>
              Your real identity remains hidden. Microphone is only activated after your explicit confirmation below.
            </span>
          </div>

          {/* Action Buttons as requested */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              id="btn-prefer-text"
              type="button"
              onClick={onChooseText}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
              <span>I Prefer Text</span>
            </button>

            {canSpeakChoice === 'yes' ? (
              <button
                type="button"
                onClick={onAgreeVoice}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-yellow-300" />
                <span>Agree & Start Voice Assessment</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onChooseText}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Start Text Assessment</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
