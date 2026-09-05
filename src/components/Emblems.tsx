import React from 'react'

export const EmblemOfIndia: React.FC<{ className?: string }> = ({ className = 'h-14 w-auto' }) => (
  <svg viewBox="0 0 100 125" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="State Emblem of India">
    {/* Ashoka Lion Capital (Official State Emblem) */}
    <g fill="#1f2937">
      {/* Center Lion Head */}
      <path d="M50 10 C43 10 38 15 38 23 C38 30 43 35 46 38 C44 42 44 47 47 51 C45 55 45 60 50 62 C55 60 55 55 53 51 C56 47 56 42 54 38 C57 35 62 30 62 23 C62 15 57 10 50 10 Z" />
      {/* Left Lion Head */}
      <path d="M38 20 C32 16 23 21 24 30 C25 36 29 40 33 42 C32 47 35 52 40 54 C40 48 38 43 39 39 C36 37 34 33 35 28 C35 24 37 21 39 20 Z" />
      {/* Right Lion Head */}
      <path d="M62 20 C68 16 77 21 76 30 C75 36 71 40 67 42 C68 47 65 52 60 54 C60 48 62 43 61 39 C64 37 66 33 65 28 C65 24 63 21 61 20 Z" />
      {/* Base Abacus */}
      <rect x="20" y="65" width="60" height="8" rx="1" fill="#1f2937" />
      {/* Ashoka Chakra */}
      <circle cx="50" cy="69" r="3.5" stroke="#ffffff" strokeWidth="0.8" fill="#1f2937" />
      <circle cx="50" cy="69" r="0.7" fill="#ffffff" />
      {/* Lotus Base */}
      <path d="M22 75 C30 83 70 83 78 75 C72 85 28 85 22 75 Z" />
      {/* Pedestal */}
      <rect x="18" y="86" width="64" height="3" rx="0.5" />
    </g>
    {/* Satyameva Jayate text in Devanagari */}
    <text x="50" y="100" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="'Noto Sans Devanagari', sans-serif" fill="#1f2937" letterSpacing="0.4">
      सत्यमेव जयते
    </text>
  </svg>
)

export const DigitalIndiaLogo: React.FC<{ className?: string }> = ({ className = 'h-10 w-auto' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg className="h-9 w-9 flex-shrink-0" viewBox="0 0 100 100" fill="none">
      {/* Stylized Digital India 'i' swirl */}
      <circle cx="50" cy="50" r="44" stroke="#F05424" strokeWidth="4" strokeDasharray="80 190" />
      <circle cx="50" cy="50" r="36" stroke="#003366" strokeWidth="4" strokeDasharray="120 150" />
      <circle cx="50" cy="50" r="28" stroke="#138808" strokeWidth="4" strokeDasharray="90 180" />
      <circle cx="50" cy="36" r="6" fill="#003366" />
      <rect x="46" y="46" width="8" height="24" rx="4" fill="#F05424" />
    </svg>
    <div className="flex flex-col leading-tight">
      <div className="flex items-baseline font-black tracking-tight">
        <span className="text-[#F05424] font-extrabold text-base">Digital</span>
        <span className="text-[#003366] font-extrabold text-base ml-1">India</span>
      </div>
      <span className="text-[9px] tracking-wider text-slate-500 font-medium uppercase">
        Power To Empower
      </span>
    </div>
  </div>
)

export const SamaveshLogo: React.FC<{ className?: string }> = ({ className = 'h-10 w-auto' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Circular emblem with handshake / tricolor */}
    <svg className="h-9 w-9 flex-shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" stroke="#FF9933" strokeWidth="3" strokeDasharray="60 190" />
      <circle cx="50" cy="50" r="40" stroke="#138808" strokeWidth="3" strokeDasharray="60 190" strokeDashoffset="125" />
      <path d="M35 50 C35 42 42 35 50 35 C58 35 65 42 65 50 C65 58 58 65 50 65" stroke="#003366" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="6" fill="#F05424" />
    </svg>
    <div className="flex flex-col leading-tight">
      <span className="text-[#003366] font-extrabold text-sm tracking-wide">SAMAVESH</span>
      <span className="text-[8px] text-slate-500 font-medium max-w-[170px] leading-tight">
        Single Access Mechanism for All Verticals of Empowerment & Social Harmony
      </span>
    </div>
  </div>
)

export const SambalLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#E2E8F0" strokeWidth="2" />
    {/* Concentric rings */}
    <circle cx="50" cy="50" r="43" stroke="#F05424" strokeWidth="2.5" strokeDasharray="15 5" />
    <circle cx="50" cy="50" r="39" stroke="#003366" strokeWidth="1.5" />
    {/* Inner decorative figure */}
    <path d="M50 25 C45 25 41 29 41 34 C41 39 45 43 50 43 C55 43 59 39 59 34 C59 29 55 25 50 25 Z" fill="#003366" />
    <path d="M34 68 C34 56 41 47 50 47 C59 47 66 56 66 68 Z" fill="#F05424" />
    {/* Ashoka wheel or rays */}
    <circle cx="50" cy="50" r="7" fill="#ffffff" stroke="#003366" strokeWidth="1.5" />
    {/* Text circular banner */}
    <text x="50" y="84" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="sans-serif" fill="#003366">
      SAMBAL
    </text>
    <text x="50" y="93" textAnchor="middle" fontSize="6.5" fontWeight="bold" fontFamily="'Noto Sans Devanagari', sans-serif" fill="#F05424">
      संबल
    </text>
  </svg>
)
