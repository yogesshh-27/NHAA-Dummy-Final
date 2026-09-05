import React, { useState } from 'react'
import { Globe, ArrowRight, Check, X } from 'lucide-react'

export type PreferredLanguage = 'en' | 'hi' | 'hinglish'

interface LanguageSelectionModalProps {
  isOpen: boolean
  currentLang: PreferredLanguage
  onSelectLanguage: (lang: PreferredLanguage) => void
  onClose: () => void
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  currentLang,
  onSelectLanguage,
  onClose,
}) => {
  const [selected, setSelected] = useState<PreferredLanguage>(currentLang)

  if (!isOpen) return null

  const options: { id: PreferredLanguage; title: string; subtitle: string; sample: string }[] = [
    {
      id: 'en',
      title: 'English',
      subtitle: 'Standard English',
      sample: 'How has this situation affected you?',
    },
    {
      id: 'hi',
      title: 'हिंदी (Hindi)',
      subtitle: 'शुद्ध हिंदी (Devanagari script)',
      sample: 'आपको हाल ही में किस बात से परेशानी हो रही है?',
    },
    {
      id: 'hinglish',
      title: 'Hinglish',
      subtitle: 'Conversational Roman Hindi + English',
      sample: 'Kya aapko kisi se koi threat ya problem hui hai?',
    },
  ]

  const handleConfirm = () => {
    onSelectLanguage(selected)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#00274d] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-lg font-bold">Choose your preferred language</h2>
              <p className="text-[11px] text-blue-200">Question display language preference</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Options */}
        <div className="p-6 space-y-3">
          {options.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-700 bg-blue-50/70 ring-2 ring-blue-700/20 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      isSelected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{opt.title}</h3>
                    <p className="text-[11px] text-slate-500">{opt.subtitle}</p>
                    <p className="text-xs text-blue-900/80 font-medium italic mt-1">&ldquo;{opt.sample}&rdquo;</p>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed mt-2">
            💡 <strong>Note:</strong> You can answer naturally in English, Hindi, or Hinglish regardless of this selection.
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
