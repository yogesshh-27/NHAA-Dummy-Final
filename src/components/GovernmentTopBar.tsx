import React, { useState } from 'react'
import { ExternalLink, Globe, ChevronDown } from 'lucide-react'

export const GovernmentTopBar: React.FC = () => {
  const [fontSize, setFontSize] = useState<'sm' | 'normal' | 'lg'>('normal')
  const [lang, setLang] = useState('English')

  const handleFontSize = (size: 'sm' | 'normal' | 'lg') => {
    setFontSize(size)
    const root = document.documentElement
    root.classList.remove('font-size-sm', 'font-size-normal', 'font-size-lg')
    root.classList.add(`font-size-${size}`)
  }

  return (
    <div className="bg-[#00274d] text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#001f3f]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Left: Indian Flag + Government of India link */}
        <a
          href="https://india.gov.in"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
        >
          {/* Authentic Indian Flag */}
          <span className="inline-flex w-4 h-3 rounded-xs overflow-hidden shadow-2xs border border-white/20">
            <span className="flex-1 flex flex-col">
              <span className="h-1 bg-[#FF9933]"></span>
              <span className="h-1 bg-[#FFFFFF] flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-[#000080]"></span>
              </span>
              <span className="h-1 bg-[#138808]"></span>
            </span>
          </span>
          <span className="font-semibold tracking-wide text-xs">Government of India</span>
          <ExternalLink className="w-3 h-3 text-slate-300" />
        </a>

        {/* Right: Accessibility Controls & Language */}
        <div className="flex items-center gap-3 text-xs">
          
          <a
            href="#main-content"
            className="hover:underline text-slate-200 hidden md:inline"
          >
            Skip to Main Content
          </a>

          <span className="text-slate-500 hidden md:inline">|</span>

          {/* Font Resizing Controls A- A A+ */}
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleFontSize('sm')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors ${fontSize === 'sm' ? 'bg-blue-600 font-bold' : ''}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontSize('normal')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors ${fontSize === 'normal' ? 'bg-blue-600 font-bold' : ''}`}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontSize('lg')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors ${fontSize === 'lg' ? 'bg-blue-600 font-bold' : ''}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-500">|</span>

          {/* High Contrast Half-Circle Icon */}
          <button
            type="button"
            onClick={() => document.documentElement.classList.toggle('high-contrast')}
            className="p-1 rounded hover:bg-white/20"
            title="High Contrast"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z" />
            </svg>
          </button>

          <span className="text-slate-500">|</span>

          {/* Accessibility Person Icon */}
          <button
            type="button"
            className="p-1 rounded hover:bg-white/20"
            title="Accessibility Options"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <circle cx="12" cy="4" r="2" />
              <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.71-.34-1.55-.3-2.22.09l-2.92 1.7c-.55.32-.89.92-.89 1.56V19h2v-6l2.11-1.22.9 6.22H16v-2h-1.12l-.7-4.84c.83.69 1.93 1.15 3.12 1.15H19v2h2v-2h-2z" />
            </svg>
          </button>

          <span className="text-slate-500">|</span>

          {/* Language Selector */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
            <Globe className="w-3.5 h-3.5" />
            <button
              type="button"
              onClick={() => setLang(prev => (prev === 'English' ? 'हिन्दी' : 'English'))}
              className="flex items-center gap-1 font-medium"
            >
              <span>{lang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
