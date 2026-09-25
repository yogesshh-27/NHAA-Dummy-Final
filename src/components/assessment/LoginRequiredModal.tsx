import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Shield, User, ArrowRight, X, HeartHandshake, FileCheck } from 'lucide-react'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
  actionAttempted?: string
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  redirectPath = '/stress-trauma-assessment',
  actionAttempted = 'give the assessment',
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleProceedToLogin = () => {
    onClose()
    navigate(`/citizen/login?redirect=${encodeURIComponent(redirectPath)}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#00274d] text-white p-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-amber-300" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Citizen Login Required
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Authentication is required to {actionAttempted}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
              <Shield className="w-5 h-5 text-[#003366] shrink-0 mt-0.5" />
              <div className="text-left text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 block font-bold mb-0.5">Confidential & Protected Data</strong>
                Your evaluation scores, indicators, and trauma responses are encrypted and stored safely under your verified Citizen profile.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <FileCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-left text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 block font-bold mb-0.5">Session Continuity</strong>
                Resume previous assessments, review historical progress reports, and re-connect with your assigned psychologist anytime.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-left text-xs leading-relaxed text-slate-700">
                <strong className="text-amber-950 block font-bold mb-0.5">Official Assistance & Compensation</strong>
                Verified citizen records assist nodal officers in fast-tracking trauma rehabilitation relief.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleProceedToLogin}
              className="w-full py-3 px-4 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              <span>Login / Register with Citizen Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Powered by Government Citizen Authentication Portal (SAMAVESH)
          </p>
        </div>

      </div>
    </div>
  )
}
