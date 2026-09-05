"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Building,
  AlertCircle,
  Share2,
} from "lucide-react";
import { CitizenTab } from "../gov/SambalSidebar";

interface TrackStatusViewProps {
  onBack: () => void;
  initialUrn?: string;
}

interface Milestone {
  id: number;
  title: string;
  subtitle: string;
  timestamp: string;
  status: "completed" | "active" | "pending";
}

interface CaseDossier {
  urn: string;
  statusTag: string;
  statusType: "investigation" | "critical" | "resolved" | "scrutiny";
  lodgedDate: string;
  complainant: string;
  state: string;
  district: string;
  offence: string;
  milestones: Milestone[];
  officerRemarks: string;
  firNumber?: string;
  reliefDisbursed?: string;
}

const SAMPLE_DOSSIERS: Record<string, CaseDossier> = {
  "NHAA-2026-GRV-49210": {
    urn: "NHAA-2026-GRV-49210",
    statusTag: "Under Police Investigation (FIR Registered)",
    statusType: "investigation",
    lodgedDate: "28 Aug 2026, 14:32 IST",
    complainant: "Ram Swaroop (Victim)",
    state: "Uttar Pradesh",
    district: "Sant Kabir Nagar",
    offence: "Caste abuse & obstruction to public water access (Sec 3(1)(za) & 3(1)(r) PoA Act)",
    officerRemarks: "Case verified by District Nodal Officer. DSP Shri R.K. Yadav appointed as Investigating Officer. Immediate security provided to victim family.",
    firNumber: "FIR No. 412/2026 (Kotwali Sadar)",
    reliefDisbursed: "₹1,00,000 (Interim Stage-1 DBT)",
    milestones: [
      {
        id: 1,
        title: "1. Grievance Lodged",
        subtitle: "Logged via 14566 National Helpline portal.",
        timestamp: "28 Aug 2026, 14:32",
        status: "completed",
      },
      {
        id: 2,
        title: "2. Scrutiny & Triage",
        subtitle: "Verified under SC/ST (PoA) Act Sec 3(1)(r).",
        timestamp: "28 Aug 2026, 16:10",
        status: "completed",
      },
      {
        id: 3,
        title: "3. Nodal Transfer (Active)",
        subtitle: "Transferred to SP Office & Deputy SP (Investigation Officer).",
        timestamp: "29 Aug 2026, 10:15",
        status: "active",
      },
      {
        id: 4,
        title: "4. ATR & FIR Action",
        subtitle: "FIR No. 412/2026 filed. Charge sheet under formulation.",
        timestamp: "Target: 05 Sep 2026",
        status: "pending",
      },
      {
        id: 5,
        title: "5. Relief & Closure",
        subtitle: "Interim relief sanction & final compliance.",
        timestamp: "Pending ATR",
        status: "pending",
      },
    ],
  },
  "RESCUE-77291": {
    urn: "RESCUE-77291",
    statusTag: "Emergency Police Dispatch Active",
    statusType: "critical",
    lodgedDate: "03 Sep 2026, 09:12 IST",
    complainant: "Anita Devi & Family (Distress Informer)",
    state: "Uttar Pradesh",
    district: "Aligarh (Atrauli)",
    offence: "Mob encirclement & immediate physical threat",
    officerRemarks: "Dial 112 PCR Van Unit 4 dispatched with 4 armed personnel. High priority SOS triage escalated by SAATHI-AI Engine 1.",
    firNumber: "Emergency Zero-FIR #89/26",
    reliefDisbursed: "Emergency medical transport sanctioned",
    milestones: [
      {
        id: 1,
        title: "1. SOS Alert Triggered",
        subtitle: "High distress voice triage logged.",
        timestamp: "03 Sep 2026, 09:12",
        status: "completed",
      },
      {
        id: 2,
        title: "2. Police PCR Dispatched",
        subtitle: "Dial 112 unit en route to GPS coordinates.",
        timestamp: "03 Sep 2026, 09:16",
        status: "completed",
      },
      {
        id: 3,
        title: "3. Perimeter Secured (Active)",
        subtitle: "Atrauli Police Station personnel on-site.",
        timestamp: "03 Sep 2026, 09:28",
        status: "active",
      },
      {
        id: 4,
        title: "4. Formal FIR Registration",
        subtitle: "Sec 3(1)(s) and 3(2)(va) PoA Act.",
        timestamp: "In progress",
        status: "pending",
      },
      {
        id: 5,
        title: "5. Safe Relocation & Relief",
        subtitle: "Victim protection scheme active.",
        timestamp: "Pending",
        status: "pending",
      },
    ],
  },
  "NHAA-2026-GRV-88392": {
    urn: "NHAA-2026-GRV-88392",
    statusTag: "Investigation (FIR Filed)",
    statusType: "investigation",
    lodgedDate: "02 Sep 2026, 11:20 IST",
    complainant: "Jagdish Chandra (Victim)",
    state: "Uttar Pradesh",
    district: "Ghaziabad (Kotwali Sadar)",
    offence: "Social Boycott & Water Denial",
    officerRemarks: "FIR lodged under PoA Act 3(1)(za). Station House Officer served notice to village heads. Water supply restored under police oversight.",
    firNumber: "FIR No. 718/2026",
    reliefDisbursed: "₹1,25,000 Interim DBT",
    milestones: [
      {
        id: 1,
        title: "1. Grievance Lodged",
        subtitle: "Direct portal intake with audio statement.",
        timestamp: "02 Sep 2026, 11:20",
        status: "completed",
      },
      {
        id: 2,
        title: "2. Scrutiny & Triage",
        subtitle: "High priority atrocity validation complete.",
        timestamp: "02 Sep 2026, 12:05",
        status: "completed",
      },
      {
        id: 3,
        title: "3. Nodal Transfer (Active)",
        subtitle: "SP City & District Magistrate Office notified.",
        timestamp: "02 Sep 2026, 14:30",
        status: "active",
      },
      {
        id: 4,
        title: "4. Action Taken Report",
        subtitle: "Interim ATR submitted to Nodal Officer.",
        timestamp: "Target: 09 Sep 2026",
        status: "pending",
      },
      {
        id: 5,
        title: "5. Final Disposal",
        subtitle: "Court charge sheet filing.",
        timestamp: "Pending",
        status: "pending",
      },
    ],
  },
};

export function TrackStatusView({ onBack, initialUrn = "NHAA-2026-GRV-49210" }: TrackStatusViewProps) {
  const [urnInput, setUrnInput] = useState(initialUrn);
  const [mobileInput, setMobileInput] = useState("9876543210");
  const [activeDossier, setActiveDossier] = useState<CaseDossier | null>(
    SAMPLE_DOSSIERS[initialUrn] || SAMPLE_DOSSIERS["NHAA-2026-GRV-49210"]
  );
  const [searched, setSearched] = useState(true);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrn = urnInput.trim().toUpperCase();
    if (SAMPLE_DOSSIERS[cleanUrn]) {
      setActiveDossier(SAMPLE_DOSSIERS[cleanUrn]);
    } else {
      // Dynamic fallback dossier
      setActiveDossier({
        urn: cleanUrn || "NHAA-2026-GRV-GENERIC",
        statusTag: "Under Scrutiny by Nodal Cell",
        statusType: "scrutiny",
        lodgedDate: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + ", 10:00 IST",
        complainant: "Citizen Complainant",
        state: "National Jurisdiction",
        district: "District Special Cell",
        offence: "Complaint under review under SC/ST (PoA) Act",
        officerRemarks: "Grievance received and assigned to District Nodal Officer for verification.",
        milestones: [
          {
            id: 1,
            title: "1. Grievance Lodged",
            subtitle: "Successfully received in SAMBAL portal.",
            timestamp: "Today",
            status: "completed",
          },
          {
            id: 2,
            title: "2. Scrutiny & Triage (Active)",
            subtitle: "Nodal officer verifying jurisdiction.",
            timestamp: "In Progress",
            status: "active",
          },
          {
            id: 3,
            title: "3. Nodal Transfer",
            subtitle: "Routing to investigating officer.",
            timestamp: "Pending",
            status: "pending",
          },
          {
            id: 4,
            title: "4. ATR & FIR Action",
            subtitle: "Police station inquiry.",
            timestamp: "Pending",
            status: "pending",
          },
          {
            id: 5,
            title: "5. Relief & Closure",
            subtitle: "Direct Benefit Transfer relief.",
            timestamp: "Pending",
            status: "pending",
          },
        ],
      });
    }
    setSearched(true);
  };

  const handleQuickSample = (sampleUrn: string) => {
    setUrnInput(sampleUrn);
    setActiveDossier(SAMPLE_DOSSIERS[sampleUrn]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Back Action */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Title Header */}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE] shadow-2xs">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Track Grievance / Rescue Status
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748B]">
            Check current progress, officer remarks, and closure status of an already registered grievance.
          </p>
        </div>
      </div>

      {/* Search Input Box Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Grievance Reference Number (URN) or Rescue ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={urnInput}
                onChange={(e) => setUrnInput(e.target.value)}
                placeholder="e.g. NHAA-2026-GRV-49210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF]"
                required
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">
              Registered Mobile (Optional for OTP verification)
            </label>
            <input
              type="text"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              placeholder="9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#172554] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Status Now</span>
            </button>
          </div>
        </form>

        {/* Quick Try Samples Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9] text-xs text-[#64748B]">
          <span className="font-semibold text-[#475569]">Quick Try Samples:</span>
          <button
            type="button"
            onClick={() => handleQuickSample("NHAA-2026-GRV-49210")}
            className="px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] font-mono text-[11px] font-bold border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors cursor-pointer"
          >
            NHAA-2026-GRV-49210
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample("RESCUE-77291")}
            className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#DC2626] font-mono text-[11px] font-bold border border-[#FECACA] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
          >
            RESCUE-77291
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample("NHAA-2026-GRV-88392")}
            className="px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#16A34A] font-mono text-[11px] font-bold border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
          >
            NHAA-2026-GRV-88392
          </button>
        </div>
      </div>

      {/* Case Dossier Result */}
      {searched && activeDossier && (
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-6 animate-in fade-in">
          {/* Dossier Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-sm sm:text-base font-black text-[#0F172A]">
                  DOSSIER REF: {activeDossier.urn}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    activeDossier.statusType === "critical"
                      ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                      : activeDossier.statusType === "investigation"
                      ? "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]"
                      : activeDossier.statusType === "resolved"
                      ? "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]"
                      : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
                  }`}
                >
                  {activeDossier.statusTag}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Lodged on: <strong className="text-[#334155]">{activeDossier.lodgedDate}</strong> | Complainant:{" "}
                <strong className="text-[#334155]">{activeDossier.complainant}</strong> | State:{" "}
                <strong className="text-[#334155]">{activeDossier.state}</strong>
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-bold text-[#1E293B] hover:bg-[#F1F5F9] transition-colors cursor-pointer self-start sm:self-center shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>

          {/* Milestone Tracking Progress (5 Cards) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#475569]">
              GOVERNMENT MILESTONE TRACKING PROGRESS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {activeDossier.milestones.map((m) => {
                const isCompleted = m.status === "completed";
                const isActive = m.status === "active";

                return (
                  <div
                    key={m.id}
                    className={`rounded-xl p-4 border transition-all flex flex-col justify-between space-y-2.5 ${
                      isCompleted
                        ? "bg-[#F0FDF4] border-[#86EFAC] text-[#14532D]"
                        : isActive
                        ? "bg-[#EFF6FF] border-[#3B82F6] ring-2 ring-[#93C5FD] text-[#1E3A8A]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] opacity-80"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                      ) : isActive ? (
                        <Clock className="w-4 h-4 text-[#2563EB] animate-spin shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#94A3B8] shrink-0" />
                      )}
                      <span className="text-xs font-bold leading-tight">
                        {m.title}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      {m.subtitle}
                    </p>

                    <div className="pt-2 border-t border-black/5 text-[10px] font-mono font-medium">
                      {m.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal / Officer Remarks Box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E293B]">
                Nodal Officer Case Summary &amp; Legal Annotations
              </span>
              {activeDossier.reliefDisbursed && (
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
                  Relief: {activeDossier.reliefDisbursed}
                </span>
              )}
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {activeDossier.officerRemarks}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
