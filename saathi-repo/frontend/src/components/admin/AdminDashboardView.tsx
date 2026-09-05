"use client";

import React, { useState } from "react";
import {
  FileText,
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  LogOut,
  ExternalLink,
  Mic,
  Activity,
  FolderOpen,
  FileCode,
  Shield,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
} from "lucide-react";
import { CaseRecord } from "@/data/caseData";
import { CaseReasoningView } from "../CaseReasoningView";
import { LiveSessionView } from "../LiveSessionView";
import { Engine2HistoricalView } from "../Engine2HistoricalView";
import { NHAAProtocolsView } from "../NHAAProtocolsView";

interface AdminDashboardViewProps {
  onSwitchToCitizen: () => void;
  allCases: CaseRecord[];
  onRefreshCases?: () => void;
}

type AdminTab = "queue" | "live_console" | "precedents" | "protocols" | "dossier";
type FilterType = "all" | "distress" | "investigation" | "disposed";

interface AdminCaseRow {
  urn: string;
  victimName: string;
  dateStr: string;
  offence: string;
  location: string;
  policeStation: string;
  priority: "HIGH" | "CRITICAL SOS" | "MEDIUM" | "RESOLVED";
  workflowStatus: string;
  caseId?: string;
}

const ADMIN_CASE_ROWS: AdminCaseRow[] = [
  {
    urn: "NHAA-2026-GRV-88392",
    victimName: "Jagdish Chandra",
    dateStr: "02 Sep 2026",
    offence: "Social Boycott & Water Denial",
    location: "Ghaziabad, UP",
    policeStation: "Kotwali Sadar",
    priority: "HIGH",
    workflowStatus: "Investigation (FIR Filed)",
    caseId: "case-4471",
  },
  {
    urn: "RESCUE-90142",
    victimName: "Anita Devi & Family",
    dateStr: "03 Sep 2026 (12 mins ago)",
    offence: "Mob Encirclement & Physical Threat",
    location: "Aligarh, UP",
    policeStation: "Atrauli Police Stn",
    priority: "CRITICAL SOS",
    workflowStatus: "Police Force Deployed",
    caseId: "case-4471",
  },
  {
    urn: "NHAA-2026-GRV-87114",
    victimName: "Maheshwar Paswan",
    dateStr: "31 Aug 2026",
    offence: "Land Dispossession / Eviction",
    location: "Patna, Bihar",
    policeStation: "Phulwari Sharif",
    priority: "MEDIUM",
    workflowStatus: "DM Notice Issued",
    caseId: "case-4472",
  },
  {
    urn: "NHAA-2026-GRV-86501",
    victimName: "Devika Bai",
    dateStr: "27 Aug 2026",
    offence: "Public Humiliation & Abuse",
    location: "Bhopal, MP",
    policeStation: "Govindpura",
    priority: "RESOLVED",
    workflowStatus: "ATR Submitted & Closed",
    caseId: "case-4473",
  },
];

export function AdminDashboardView({
  onSwitchToCitizen,
  allCases,
  onRefreshCases,
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("queue");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-4471");

  const currentCase =
    allCases.find((c) => c.id === selectedCaseId) || (allCases.length > 0 ? allCases[0] : null);

  const filteredRows = ADMIN_CASE_ROWS.filter((row) => {
    if (filterType === "distress") return row.priority === "CRITICAL SOS";
    if (filterType === "investigation")
      return row.workflowStatus.includes("Investigation") || row.priority === "HIGH";
    if (filterType === "disposed") return row.priority === "RESOLVED";
    return true;
  });

  const handleOpenDossier = (caseId?: string) => {
    if (caseId) setSelectedCaseId(caseId);
    setActiveTab("dossier");
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] text-[#111827] flex flex-col font-sans">
      {/* 1. Dark Navy Nodal Officer Administration Console Header Bar */}
      <header className="bg-[#071221] text-white px-4 sm:px-6 py-3 border-b border-[#1E293B] shadow-md z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Emblem + Console Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F233D] border border-[#1E3A8A] flex items-center justify-center shrink-0 shadow-inner">
              <Shield className="w-5 h-5 text-[#60A5FA]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white">
                  NHAA Nodal Officer Administration Console
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1D4ED8] text-white font-bold tracking-wider uppercase">
                  SECURE v2.4
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] tracking-tight">
                Department of Social Justice and Empowerment, Government of India
              </p>
            </div>
          </div>

          {/* Right: Officer Profile & Logout Button */}
          <div className="flex items-center gap-4 self-end md:self-center">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">
                Shri A.K. Srivastava (IAS)
              </div>
              <div className="text-[10.5px] text-[#93C5FD]">
                District Nodal Officer (Special Cell)
              </div>
            </div>

            <button
              onClick={onSwitchToCitizen}
              className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Active Jurisdiction & Secondary Navigation Strip */}
      <div className="bg-[#0F1E34] border-b border-[#1E293B] px-4 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[#FBBF24] font-bold">Active Jurisdiction:</span>
            <span className="text-white font-medium">Western Region Zone-1 (NCR &amp; UP-West)</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab navigation for SAATHI AI Engines */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("queue")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "queue"
                    ? "bg-[#1D4ED8] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                Triage Queue
              </button>
              <button
                onClick={() => setActiveTab("live_console")}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === "live_console"
                    ? "bg-[#1D4ED8] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <Mic className="w-3 h-3 text-[#F87171]" />
                <span>Live Intake Console</span>
              </button>
              <button
                onClick={() => setActiveTab("precedents")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "precedents"
                    ? "bg-[#1D4ED8] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                Engine 2 Precedents
              </button>
              <button
                onClick={() => setActiveTab("protocols")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "protocols"
                    ? "bg-[#1D4ED8] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                PoA SOP
              </button>
            </div>

            <button
              onClick={onSwitchToCitizen}
              className="text-[#60A5FA] hover:text-[#93C5FD] text-xs font-medium hover:underline flex items-center gap-1"
            >
              <span>Public Portal Homepage</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Console Workspace */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Render Live Intake Console */}
        {activeTab === "live_console" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab("queue")}
                className="px-3 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-bold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
              >
                ← Back to Triage Queue
              </button>
              <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#A7F3D0]">
                Engine 1 Real-time STT &amp; SVI Active
              </span>
            </div>
            <LiveSessionView onSessionComplete={() => onRefreshCases && onRefreshCases()} />
          </div>
        )}

        {/* Render Engine 2 Precedents */}
        {activeTab === "precedents" && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab("queue")}
              className="px-3 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-bold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
            >
              ← Back to Triage Queue
            </button>
            <Engine2HistoricalView currentCase={currentCase} />
          </div>
        )}

        {/* Render NHAA Protocols */}
        {activeTab === "protocols" && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab("queue")}
              className="px-3 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-bold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
            >
              ← Back to Triage Queue
            </button>
            <NHAAProtocolsView />
          </div>
        )}

        {/* Render Case Reasoning Dossier (Full SAATHI AI Breakdown) */}
        {activeTab === "dossier" && (
          <div className="space-y-4">
            <CaseReasoningView
              currentCase={currentCase}
              allCases={allCases}
              onSelectCase={(id) => setSelectedCaseId(id)}
              onBack={() => setActiveTab("queue")}
            />
          </div>
        )}

        {/* Render Image 1: Main Admin Dashboard Queue */}
        {activeTab === "queue" && (
          <>
            {/* Top 4 KPI Stat Cards matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Assigned Complaints */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    ASSIGNED COMPLAINTS
                  </span>
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="py-2">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-mono">
                    128
                  </div>
                  <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                    14 pending initial scrutiny
                  </div>
                </div>
              </div>

              {/* Card 2: Emergency Rescues */}
              <div className="bg-white rounded-xl p-5 border border-[#FECACA] shadow-2xs flex flex-col justify-between ring-1 ring-[#F87171]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#DC2626]">
                    EMERGENCY RESCUES
                  </span>
                  <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                </div>
                <div className="py-2">
                  <div className="text-2xl sm:text-3xl font-black text-[#DC2626] font-mono flex items-center gap-2">
                    3 ACTIVE
                  </div>
                  <div className="text-[11px] text-[#DC2626] font-medium mt-0.5">
                    Immediate police dispatch underway
                  </div>
                </div>
              </div>

              {/* Card 3: FIRs Tracked */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    FIRS TRACKED
                  </span>
                  <Building2 className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <div className="py-2">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-mono">
                    94
                  </div>
                  <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                    Section 3(1) &amp; 3(2) PoA Act
                  </div>
                </div>
              </div>

              {/* Card 4: Relief Disbursed */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    RELIEF DISBURSED
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                </div>
                <div className="py-2">
                  <div className="text-2xl sm:text-3xl font-black text-[#059669] font-mono">
                    ₹1.48 Cr
                  </div>
                  <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                    Direct Benefit Transfer (DBT)
                  </div>
                </div>
              </div>
            </div>

            {/* Atrocities Grievance & Distress Triage Queue Card Table */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              {/* Table Header & Filter Tabs */}
              <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    Atrocities Grievance &amp; Distress Triage Queue
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Incoming citizen cases under the SC/ST (Prevention of Atrocities) Act
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      filterType === "all"
                        ? "bg-[#1E3A8A] text-white shadow-2xs"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    All Cases
                  </button>
                  <button
                    onClick={() => setFilterType("distress")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      filterType === "distress"
                        ? "bg-[#1E3A8A] text-white shadow-2xs"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    Distress / SOS
                  </button>
                  <button
                    onClick={() => setFilterType("investigation")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      filterType === "investigation"
                        ? "bg-[#1E3A8A] text-white shadow-2xs"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    Under Investigation
                  </button>
                  <button
                    onClick={() => setFilterType("disposed")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      filterType === "disposed"
                        ? "bg-[#1E3A8A] text-white shadow-2xs"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    Disposed
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                    <tr>
                      <th className="px-5 py-3.5">REFERENCE URN</th>
                      <th className="px-5 py-3.5">VICTIM / INFORMER</th>
                      <th className="px-5 py-3.5">ALLEGED OFFENCE</th>
                      <th className="px-5 py-3.5">DISTRICT &amp; POLICE STATION</th>
                      <th className="px-5 py-3.5">PRIORITY</th>
                      <th className="px-5 py-3.5">WORKFLOW STATUS</th>
                      <th className="px-5 py-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] font-normal">
                    {filteredRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                        onClick={() => handleOpenDossier(row.caseId)}
                      >
                        {/* Reference URN */}
                        <td className="px-5 py-4 font-mono font-bold text-[#1E3A8A]">
                          {row.urn}
                        </td>

                        {/* Victim / Informer */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#0F172A]">{row.victimName}</div>
                          <div className="text-[11px] text-[#64748B]">{row.dateStr}</div>
                        </td>

                        {/* Alleged Offence */}
                        <td className="px-5 py-4 font-medium text-[#334155]">
                          {row.offence}
                        </td>

                        {/* District & Police Station */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#0F172A]">{row.location}</div>
                          <div className="text-[11px] text-[#64748B]">{row.policeStation}</div>
                        </td>

                        {/* Priority Badge */}
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${
                              row.priority === "CRITICAL SOS"
                                ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                                : row.priority === "HIGH"
                                ? "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]"
                                : row.priority === "MEDIUM"
                                ? "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
                                : "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                            }`}
                          >
                            {row.priority}
                          </span>
                        </td>

                        {/* Workflow Status */}
                        <td className="px-5 py-4 font-semibold text-[#0F172A]">
                          {row.workflowStatus}
                        </td>

                        {/* Action View Dossier Button */}
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDossier(row.caseId);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-[11px] font-bold hover:bg-[#172554] transition-colors shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Dossier</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
                Showing {filteredRows.length} records. Automated synchronization with State Police CCTNS network active.
              </div>
            </div>
          </>
        )}
      </main>

      {/* 4. Footer */}
      <footer className="bg-[#071221] border-t border-[#1E293B] py-3 px-4 sm:px-6 text-center text-xs text-[#9CA3AF]">
        National Informatics Centre (NIC) • Department of Social Justice and Empowerment, Government of India
      </footer>
    </div>
  );
}
