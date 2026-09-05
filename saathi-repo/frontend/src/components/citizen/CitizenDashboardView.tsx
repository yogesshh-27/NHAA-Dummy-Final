"use client";

import React from "react";
import {
  FileEdit,
  UserCheck,
  Search,
  Brain,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  HeartHandshake,
  AlertTriangle,
} from "lucide-react";
import { CitizenTab } from "../gov/SambalSidebar";

interface CitizenDashboardViewProps {
  onNavigate: (tab: CitizenTab) => void;
}

export function CitizenDashboardView({ onNavigate }: CitizenDashboardViewProps) {
  const cards = [
    {
      id: "register_grievance" as CitizenTab,
      icon: FileEdit,
      iconBg: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
      title: "Register Grievance",
      description:
        "Submit a new complaint regarding atrocities. You can register as a Victim, Informer, or on behalf of an NGO.",
      actionText: "Start Registration →",
    },
    {
      id: "register_rescue" as CitizenTab,
      icon: UserCheck,
      iconBg: "bg-[#FEF2F2]",
      iconColor: "text-[#DC2626]",
      title: "Register Rescue",
      description:
        "Quick distress report with essential information. Routed to the appropriate responding authority.",
      actionText: "Start Rescue →",
    },
    {
      id: "track_status" as CitizenTab,
      icon: Search,
      iconBg: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
      title: "Track Status",
      description:
        "Check the current progress, officer remarks, and closure status of an already registered grievance.",
      actionText: "Track Application →",
    },
    {
      id: "stress_assessment" as CitizenTab,
      icon: Brain,
      iconBg: "bg-[#F0FDF4]",
      iconColor: "text-[#16A34A]",
      title: "Stress & Trauma Assessment",
      description:
        "Access the Stress & Trauma Assessment section. Evaluates psychological distress and connects to support resources.",
      actionText: "Start Assessment →",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Hero Section */}
      <div className="text-center space-y-3 pt-4 pb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A]">
          National Helpline Against Atrocities (NHAA)
        </h1>
        <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto font-normal leading-relaxed">
          Submit, track, and resolve grievances through automated workflow. Transparent governance for all citizens.
        </p>
      </div>

      {/* 4 Primary Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#2563EB] transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[280px]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-[#E2E8F0] group-hover:border-[#2563EB] group-hover:bg-[#EFF6FF] transition-all shadow-2xs">
                  <Icon className={`w-6 h-6 ${card.iconColor} group-hover:scale-110 transition-transform`} />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1E40AF] transition-colors leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F1F5F9]">
                <span className="text-xs sm:text-[13px] font-bold text-[#1E40AF] group-hover:underline flex items-center gap-1.5 transition-all">
                  {card.actionText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Legal Safeguards Strip */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              SC/ST (Prevention of Atrocities) Act, 1989 &amp; Amendment 2018
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Mandatory FIR registration within 24 hours • Special Court trial &amp; victim relief disbursement within 7 days.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("help_faqs")}
          className="px-4 py-2 rounded-xl bg-[#F8FAFC] text-[#1E40AF] hover:bg-[#EFF6FF] border border-[#CBD5E1] text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
        >
          View Legal Rights &amp; SOP →
        </button>
      </div>
    </div>
  );
}
