"use client";

import React, { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";

export function GovTopBar() {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <div className="bg-[#0B2545] text-[#D0E2FF] px-4 sm:px-6 py-1 text-[11px] flex items-center justify-between border-b border-[#133E6D] select-none z-30 font-sans">
      {/* Left: Flag & GOI Link */}
      <div className="flex items-center gap-2">
        {/* Tricolor icon */}
        <div className="flex flex-col w-3.5 h-2.5 rounded-xs overflow-hidden border border-white/20 shadow-xs">
          <div className="h-1/3 bg-[#FF9933]"></div>
          <div className="h-1/3 bg-white flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-[#000080]"></div>
          </div>
          <div className="h-1/3 bg-[#138808]"></div>
        </div>
        <a
          href="https://india.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white hover:underline flex items-center gap-1"
        >
          <span>Government of India</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      </div>

      {/* Right: Accessibility Controls & Language */}
      <div className="flex items-center gap-4 text-[10.5px]">
        <a
          href="#main-content"
          className="hidden md:inline-block text-[#B8D5FF] hover:text-white transition-colors"
        >
          Skip to Main Content
        </a>

        <div className="hidden sm:flex items-center gap-1.5 border-l border-r border-[#1C4E8A] px-3">
          <button
            onClick={() => setFontSize("normal")}
            className={`px-1 rounded hover:bg-white/10 font-bold ${fontSize === "normal" ? "text-white underline" : "text-[#B8D5FF]"}`}
            title="Standard Text Size"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize("large")}
            className={`px-1 rounded hover:bg-white/10 font-bold ${fontSize === "large" ? "text-white underline" : "text-[#B8D5FF]"}`}
            title="Medium Text Size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize("larger")}
            className={`px-1 rounded hover:bg-white/10 font-bold ${fontSize === "larger" ? "text-white underline" : "text-[#B8D5FF]"}`}
            title="Large Text Size"
          >
            A+
          </button>
        </div>

        {/* Contrast / Dark indicator toggle */}
        <button
          className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
          title="Toggle High Contrast"
        >
          <div className="w-1/2 h-full bg-white"></div>
          <div className="w-1/2 h-full bg-transparent"></div>
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-[#B8D5FF]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="bg-transparent text-white border-none text-[11px] font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="en" className="bg-[#0B2545] text-white">English</option>
            <option value="hi" className="bg-[#0B2545] text-white">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
