import React, { useState } from 'react'
import { X } from 'lucide-react'

export const NotificationBanner: React.FC = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-[#F05424] text-white py-2.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
          <span>
            National Helpline Against Atrocities is now <strong className="font-bold">SAMBAL (संबल)</strong> — same team, same number.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="p-1 rounded hover:bg-black/10 text-white transition-colors cursor-pointer"
          title="Dismiss Notice"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  )
}
