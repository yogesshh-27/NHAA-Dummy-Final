"use client";

import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Activity,
  PhoneCall,
} from "lucide-react";
import { SVIArcGauge } from "../SVIArcGauge";

interface StressAssessmentViewProps {
  onBack: () => void;
  onNavigateToGrievance?: () => void;
}

export function StressAssessmentView({ onBack, onNavigateToGrievance }: StressAssessmentViewProps) {
  const [q1, setQ1] = useState<number>(3); // 1-5 scale
  const [q2, setQ2] = useState<number>(4);
  const [q3, setQ3] = useState<number>(3);
  const [q4, setQ4] = useState<number>(4);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [sviCalculated, setSviCalculated] = useState(78);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = q1 + q2 + q3 + q4;
    // Map 4-20 scale to 0-100 SVI
    const calculated = Math.min(95, Math.round((sum / 20) * 100));
    setSviCalculated(calculated);
    setHasEvaluated(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#BBF7D0] shadow-2xs">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Stress &amp; Trauma Psychological Assessment
            </h1>
            <span className="text-[10px] font-extrabold bg-[#2563EB] text-white px-2 py-0.5 rounded-md uppercase">
              SAATHI-AI SVI
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-[#64748B]">
            Confidential evaluation of trauma severity, sleep disruption, fear indicators, and psychological distress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Questionnaire Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#1E293B] border-b border-[#F1F5F9] pb-3">
            Standardized Trauma &amp; Distress Indicators (Clinical SVI Framework)
          </h2>

          <form onSubmit={handleEvaluate} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#334155]">
                1. How safe do you and your family feel in your current residence?
              </label>
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                <span>Completely Unsafe (1)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={q1}
                  onChange={(e) => setQ1(Number(e.target.value))}
                  className="mx-3 flex-1 accent-[#2563EB]"
                />
                <span>Completely Safe (5)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#334155]">
                2. Frequency of fear, panic episodes, or acute anxiety in the last 7 days?
              </label>
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                <span>Constant / Severe (5)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={q2}
                  onChange={(e) => setQ2(Number(e.target.value))}
                  className="mx-3 flex-1 accent-[#DC2626]"
                />
                <span>None (1)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#334155]">
                3. Level of social boycott or isolation imposed on your household?
              </label>
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                <span>Total Isolation (5)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={q3}
                  onChange={(e) => setQ3(Number(e.target.value))}
                  className="mx-3 flex-1 accent-[#D97706]"
                />
                <span>Normal Access (1)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#334155]">
                4. Experience of sleep loss, recurring nightmares, or hyper-vigilance?
              </label>
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                <span>Severe (5)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={q4}
                  onChange={(e) => setQ4(Number(e.target.value))}
                  className="mx-3 flex-1 accent-[#2563EB]"
                />
                <span>None (1)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#172554] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>Calculate SVI Score &amp; Trauma Profile</span>
            </button>
          </form>
        </div>

        {/* Diagnostic Results Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Calculated Severity &amp; Vulnerability Index
            </h3>

            <div className="py-2 flex justify-center">
              <SVIArcGauge score={sviCalculated} size={150} />
            </div>

            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-left text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#1E40AF]">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Recommended Legal &amp; Psychosocial Action:</span>
              </div>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                {sviCalculated >= 70
                  ? "Elevated vulnerability detected. Priority SC/ST PoA grievance registration and District Mental Health counselor assignment strongly advised."
                  : "Moderate vulnerability detected. Routine legal aid counseling and surveillance support available."}
              </p>
            </div>

            {onNavigateToGrievance && (
              <button
                onClick={onNavigateToGrievance}
                className="w-full py-2 px-4 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Register Grievance →</span>
              </button>
            )}
          </div>

          {/* Tele-MANAS Counseling Ribbon */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#9333EA] text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#7E22CE]">
                National Tele-MANAS Mental Health
              </div>
              <div className="text-xs font-black text-[#111827] font-mono">
                Toll-Free: 14416 / 1800-891-4416
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
