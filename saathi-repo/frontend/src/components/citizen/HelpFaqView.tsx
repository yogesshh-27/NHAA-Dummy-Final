"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
  FileText,
  PhoneCall,
  ArrowLeft,
} from "lucide-react";

interface HelpFaqViewProps {
  onBack: () => void;
}

export function HelpFaqView({ onBack }: HelpFaqViewProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is SAMBAL (NHAA 2.0)?",
      a: "SAMBAL (Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages) is the Government of India's enhanced National Helpline Against Atrocities (NHAA) portal, providing 24x7 automated grievance intake, SOS distress triage, real-time FIR milestone tracking, and Direct Benefit Transfer (DBT) victim relief under the SC/ST (Prevention of Atrocities) Act, 1989.",
    },
    {
      q: "How does the emergency rescue SOS feature work?",
      a: "When an Emergency Rescue is registered, our automated system immediately transmits the caller's live GPS coordinates, threat assessment, and victim details to the State Police Control Room (Dial 112) and the District Nodal Officer, activating emergency police patrol dispatch within minutes.",
    },
    {
      q: "What rights do victims have under the SC/ST (PoA) Act?",
      a: "Under the SC/ST (PoA) Act 1989 & 2018 Amendment, victims are entitled to: mandatory immediate FIR registration without preliminary inquiry; complete witness and victim protection; free legal aid; mandatory investigation completion and charge sheet within 60 days; and structured statutory monetary relief ranging from ₹85,000 to ₹8,25,000 disbursed across FIR, charge sheet, and court conviction milestones.",
    },
    {
      q: "How can I track my submitted grievance?",
      a: "Navigate to 'Track Status' in the navigation bar and enter your Grievance URN (e.g. NHAA-2026-GRV-49210) along with your registered mobile number to see real-time updates from the investigating officer, DSP, and Nodal Cell.",
    },
    {
      q: "What is the SAATHI-AI SVI Score?",
      a: "The Severity & Vulnerability Index (SVI) is an explainable AI score calculated from vocal stress, distress keywords, physical threat levels, and social isolation signals to help helpline operators and nodal officers prioritize critical cases without human bias.",
    },
  ];

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
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE] shadow-2xs">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Help, Legal Rights &amp; Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748B]">
            Official guidelines under SC/ST (Prevention of Atrocities) Act &amp; SAMBAL operations.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = expandedFaq === idx;
          return (
            <div
              key={idx}
              className="border border-[#E2E8F0] rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 bg-white text-xs sm:text-[13px] text-[#475569] leading-relaxed border-t border-[#E2E8F0] animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
