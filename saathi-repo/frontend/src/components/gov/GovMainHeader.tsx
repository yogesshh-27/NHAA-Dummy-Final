"use client";

import React from "react";
import { Menu, Shield, User, ArrowRight } from "lucide-react";

interface GovMainHeaderProps {
  onToggleSidebar?: () => void;
  isAdminView?: boolean;
  onSwitchToAdmin: () => void;
  onSwitchToCitizen: () => void;
}

export function GovMainHeader({
  onToggleSidebar,
  isAdminView = false,
  onSwitchToAdmin,
  onSwitchToCitizen,
}: GovMainHeaderProps) {
  return (
    <header className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-20">
      {/* Left: Mobile menu toggle + Emblem + Ministry Details */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#374151] lg:hidden cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Ashok Stambh Emblem Graphic */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-9 h-9 text-[#1F2937]" fill="currentColor">
              {/* Stylized National Emblem of India (Ashok Stambh) */}
              <circle cx="50" cy="50" r="46" fill="none" stroke="#2563EB" strokeWidth="2.5" />
              <path d="M50 12 L54 26 L68 26 L56 35 L61 48 L50 40 L39 48 L44 35 L32 26 L46 26 Z" fill="#D97706" />
              <circle cx="50" cy="62" r="14" fill="none" stroke="#1E40AF" strokeWidth="2" />
              <path d="M50 50 L50 74 M38 62 L62 62 M41 53 L59 71 M41 71 L59 53" stroke="#1E40AF" strokeWidth="1.5" />
              <rect x="36" y="80" width="28" height="5" rx="1.5" fill="#374151" />
              <text x="50" y="93" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#111827">सत्यमेव जयते</text>
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-[#EBF5FF] text-[#1E40AF] text-[9.5px] font-extrabold px-1.5 py-0.2 rounded border border-[#BFDBFE] tracking-wide">
                BETA
              </span>
              <span className="text-[11px] font-semibold text-[#4B5563]">
                Government of India
              </span>
            </div>
            <h1 className="text-xs sm:text-[13px] font-bold text-[#111827] leading-tight">
              Ministry of Social Justice & Empowerment
            </h1>
            <p className="text-[10px] text-[#2563EB] font-bold tracking-tight">
              Department of Social Justice & Empowerment
            </p>
          </div>
        </div>
      </div>

      {/* Right: Digital India & SAMAVESH Badges + Admin Switch */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Digital India & SAMAVESH (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          {/* Digital India Emblem */}
          <div className="flex items-center gap-2 border-r border-[#E5E7EB] pr-5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF9933] via-[#059669] to-[#1E40AF] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[8px] font-black text-[#1E40AF]">
                DI
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-[#1E3A8A]">
                Digital India
              </span>
              <span className="text-[7.5px] font-bold tracking-wider text-[#D97706] uppercase">
                Power to Empower
              </span>
            </div>
          </div>

          {/* SAMAVESH Badge */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-[#1E40AF] flex items-center justify-center">
              <span className="text-[8.5px] font-black text-[#1E40AF]">समा</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-[#111827]">
                SAMAVESH
              </span>
              <span className="text-[7px] text-[#6B7280] leading-none max-w-[140px]">
                Single Access Mechanism for All Verticals of Empowerment & Social Harmony
              </span>
            </div>
          </div>
        </div>

        {/* Admin Login / Citizen Portal Switch Button */}
        <div>
          {!isAdminView ? (
            <button
              onClick={onSwitchToAdmin}
              className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#172554] transition-all shadow-xs flex items-center gap-2 cursor-pointer border border-[#1E40AF]"
            >
              <Shield className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>Admin Login</span>
            </button>
          ) : (
            <button
              onClick={onSwitchToCitizen}
              className="px-3.5 py-1.5 rounded-lg bg-[#F3F4F6] text-[#1E40AF] hover:bg-[#E5E7EB] text-xs font-bold transition-all border border-[#D1D5DB] flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Public Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
