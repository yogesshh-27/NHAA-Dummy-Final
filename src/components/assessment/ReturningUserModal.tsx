import React from 'react'
import { MessageSquare, Sparkles, X, Lock, CheckCircle2 } from 'lucide-react'

interface ReturningUserModalProps {
  isOpen: boolean
  anonymousId: string
  counsellorId: string
  onContinueChat: () => void
  onTakeNewAssessment: () => void
  onClose: () => void
}

export const ReturningUserModal: React.FC<ReturningUserModalProps> = ({
  isOpen,
  anonymousId,
  counsellorId,
  onContinueChat,
  onTakeNewAssessment,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#00274d] text-white p-5 sm:p-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-900 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-[#003366]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Welcome Back
          </h2>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400/40 text-xs text-blue-200 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anonymous ID: {anonymousId}</span>
          </div>
        </div>

        {/* Content matching Section 4 */}
        <div className="p-6 space-y-4 text-center">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Previous support conversation found with <strong>Counsellor {counsellorId}</strong>.
          </p>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={onContinueChat}
              className="w-full py-3 px-4 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Continue Previous Chat</span>
            </button>

            <button
              type="button"
              onClick={onTakeNewAssessment}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Take New Assessment</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 leading-tight">
            Starting a new assessment will link to your same Anonymous ID without overwriting your past records.
          </p>
        </div>

      </div>
    </div>
  )
}
