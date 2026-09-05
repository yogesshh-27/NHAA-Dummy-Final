"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Send,
  ArrowLeft,
  CheckCircle2,
  Radio,
  Users,
} from "lucide-react";

interface RegisterRescueViewProps {
  onBack: () => void;
  onSuccess: (rescueId: string) => void;
}

export function RegisterRescueView({ onBack, onSuccess }: RegisterRescueViewProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Village Atrauli, Near Primary School, Aligarh UP");
  const [peopleTrapped, setPeopleTrapped] = useState("4");
  const [threatType, setThreatType] = useState("Mob Encirclement & Physical Threat");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `RESCUE-${Math.floor(10000 + Math.random() * 90000)}`;
      setIsSubmitting(false);
      onSuccess(generatedId);
    }, 800);
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

      {/* Emergency Distress Banner */}
      <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5 flex items-start gap-4 shadow-xs">
        <div className="w-11 h-11 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
          <AlertOctagon className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-black text-[#991B1B]">
            Emergency Rescue &amp; Distress SOS Portal
          </h1>
          <p className="text-xs text-[#B91C1C] leading-relaxed">
            Use this for active violence, mob intimidation, forced encirclement, or life-threatening situations.
            Alerts are immediately dispatched to the nearest Police Control Room (Dial 112) &amp; District Special Cell.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Caller / Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or protected identity"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Active Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Immediate callback number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
            />
          </div>
        </div>

        {/* Current Location & GPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#1E293B]">
              Exact Location / Landmark <span className="text-red-500">*</span>
            </label>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#059669]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>GPS Geofence: 27.9142° N, 78.0754° E (Accurate to 12m)</span>
            </span>
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DC2626]" />
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="House number, landmark, village, police station jurisdiction"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
            />
          </div>
        </div>

        {/* Threat Type & Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Immediate Threat Nature <span className="text-red-500">*</span>
            </label>
            <select
              value={threatType}
              onChange={(e) => setThreatType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
            >
              <option value="Mob Encirclement & Physical Threat">Mob Encirclement &amp; Physical Threat</option>
              <option value="Active Arson / Property Attack">Active Arson / Property Attack</option>
              <option value="Hostage / Illegal Captivity">Hostage / Illegal Captivity</option>
              <option value="Weapon Brandishing & Severe Intimidation">Weapon Brandishing &amp; Severe Intimidation</option>
              <option value="Medical Emergency following Atrocity">Medical Emergency following Atrocity</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Number of Persons in Danger
            </label>
            <input
              type="number"
              value={peopleTrapped}
              onChange={(e) => setPeopleTrapped(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
            />
          </div>
        </div>

        {/* Immediate SOS Dispatch Action */}
        <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
            <span>Directly signals Police PCR Van &amp; District Magistrate Special Cell.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#DC2626] text-white text-xs font-black uppercase tracking-wider hover:bg-[#B91C1C] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isSubmitting ? "Dispatching Emergency Units..." : "Trigger Emergency Rescue SOS"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
