"use client";

import React, { useState } from "react";
import {
  FileEdit,
  Mic,
  MicOff,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Shield,
  Upload,
  Building,
} from "lucide-react";

interface RegisterGrievanceViewProps {
  onBack: () => void;
  onSuccess: (urn: string) => void;
}

export function RegisterGrievanceView({ onBack, onSuccess }: RegisterGrievanceViewProps) {
  const [role, setRole] = useState<"victim" | "informer" | "ngo">("victim");
  const [complainantName, setComplainantName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Uttar Pradesh");
  const [district, setDistrict] = useState("Sant Kabir Nagar");
  const [policeStation, setPoliceStation] = useState("Kotwali Sadar");
  const [offenceCategory, setOffenceCategory] = useState("social_boycott");
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestedSections, setAiSuggestedSections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated AI Speech / Text analysis for SC/ST PoA Auto-tagging
  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate live speech transcription
      setTimeout(() => {
        setDescription(
          (prev) =>
            (prev ? prev + " " : "") +
            "The village heads denied our community access to the common public well on Monday and threatened physical violence if we attempted to fetch water."
        );
        setIsAiAnalyzing(true);
        setIsRecording(false);
        setTimeout(() => {
          setAiSuggestedSections([
            "Sec 3(1)(za) - Obstructing access to water sources",
            "Sec 3(1)(r) - Intentional insult or intimidation in public view",
            "Sec 3(1)(u) - Promoting hatred or ill-will against SC/ST members",
          ]);
          setIsAiAnalyzing(false);
        }, 1200);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedUrn = `NHAA-2026-GRV-${Math.floor(10000 + Math.random() * 90000)}`;
      setIsSubmitting(false);
      onSuccess(generatedUrn);
    }, 1000);
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
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE] shadow-2xs">
          <FileEdit className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Register Grievance under SC/ST (PoA) Act
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748B]">
            Automated triage, immediate digital receipt, and direct Nodal Officer accountability.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#1E293B]">
            I am registering as: <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "victim", label: "Victim (Self / Family)" },
              { id: "informer", label: "Informer / Eyewitness" },
              { id: "ngo", label: "Authorized NGO / Legal Aid" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id as any)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  role === item.id
                    ? "bg-[#EFF6FF] border-[#2563EB] text-[#1E40AF] ring-2 ring-[#BFDBFE]"
                    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:bg-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Citizen Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Complainant Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={complainantName}
              onChange={(e) => setComplainantName(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Mobile Number (For SMS Updates &amp; FIR Tracking) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Location & Jurisdiction */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              District <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Sant Kabir Nagar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Nearest Police Station
            </label>
            <input
              type="text"
              value={policeStation}
              onChange={(e) => setPoliceStation(e.target.value)}
              placeholder="e.g. Kotwali Sadar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Offence Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#1E293B]">
            Alleged Offence Category <span className="text-red-500">*</span>
          </label>
          <select
            value={offenceCategory}
            onChange={(e) => setOffenceCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="social_boycott">Social Boycott / Denial of Access to Public Resources (Sec 3(1)(za))</option>
            <option value="land_dispossession">Land Dispossession / Illegal Eviction (Sec 3(1)(f)/(g))</option>
            <option value="physical_assault">Physical Assault / Mob Encirclement (Sec 3(2)(v))</option>
            <option value="humiliation">Public Humiliation & Caste-Based Abuses (Sec 3(1)(r))</option>
            <option value="denial_rights">Denial of Customary or Voting Rights (Sec 3(1)(c))</option>
            <option value="other">Other Offence under SC/ST PoA Act</option>
          </select>
        </div>

        {/* Incident Narrative with AI Speech Assistant */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#1E293B]">
              Detailed Description of the Incident <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] border border-[#BFDBFE]"
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? "Listening... (Click to Stop)" : "AI Voice Input (Hindi / English)"}</span>
            </button>
          </div>

          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, who was involved, date and time, and immediate safety concerns..."
            className="w-full p-3.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] leading-relaxed"
          />

          {isAiAnalyzing && (
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs text-[#16A34A] animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>SAATHI-AI analyzing narrative for legal PoA sections...</span>
            </div>
          )}

          {aiSuggestedSections.length > 0 && (
            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF]">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>SAATHI-AI Auto-Tagged Legal Sections:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#334155]">
                {aiSuggestedSections.map((sec, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <p className="text-[11px] text-[#64748B]">
            All submissions are encrypted and synchronized with State Police CCTNS.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#172554] transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Registering Complaint..." : "Submit Grievance"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
