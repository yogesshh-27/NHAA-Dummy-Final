import React, { useEffect, useState } from 'react'
import { Check, Loader2, Sparkles, Shield } from 'lucide-react'

interface ProcessingStepProps {
  onCompleted: () => void
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ onCompleted }) => {
  const steps = [
    'Voice recording processed',
    'Conversation transcribed',
    'Speech patterns analyzed',
    'Incident indicators identified',
    'Support pathway determined',
  ]

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length) {
          return prev + 1
        }
        clearInterval(timer)
        setTimeout(() => {
          onCompleted()
        }, 800)
        return prev
      })
    }, 650)

    return () => clearInterval(timer)
  }, [onCompleted, steps.length])

  return (
    <div className="max-w-lg mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6 my-6">
      
      <div className="w-16 h-16 rounded-full bg-blue-50 text-[#003366] mx-auto flex items-center justify-center border-2 border-blue-200">
        <Sparkles className="w-8 h-8 animate-pulse text-blue-700" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-[#00274d]">
          Assessment Completed
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Thank you for sharing your experience.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3.5 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Processing your assessment...
          </span>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" />
        </div>

        <div className="space-y-2.5">
          {steps.map((text, idx) => {
            const isDone = idx < activeStep
            const isCurrent = idx === activeStep

            return (
              <div
                key={text}
                className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-800 font-semibold'
                    : isCurrent
                    ? 'text-[#003366] font-bold'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'border-2 border-blue-700 text-blue-700'
                      : 'border border-slate-300 text-slate-300'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                </div>

                <span>{text}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <Shield className="w-3.5 h-3.5 text-slate-400" />
        <span>Confidential Indicative Support Assessment</span>
      </div>

    </div>
  )
}
