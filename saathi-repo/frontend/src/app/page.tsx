"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Headphones,
  Activity,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  UserCheck,
  Layers,
  History,
  Sparkles,
  Mic,
  Database,
  Layers3,
  Building2,
  Radio,
  User,
  Shield,
  FileCode,
  FolderOpen,
  Globe,
  ExternalLink,
  X,
  PhoneCall,
  Menu,
} from "lucide-react";
import { SYNTHETIC_CASES, CaseRecord } from "@/data/caseData";
import { Engine2HistoricalView } from "@/components/Engine2HistoricalView";
import { LiveSessionView } from "@/components/LiveSessionView";
import { SVIArcGauge } from "@/components/SVIArcGauge";
import { NHAAProtocolsView } from "@/components/NHAAProtocolsView";
import { ChatbotPanel } from "@/components/ChatbotPanel";
import { getApiBaseUrl } from "@/config/api";

type ActiveTab = "live_session" | "engine2" | "protocols";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("live_session");
  const [realCases, setRealCases] = useState<CaseRecord[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Active cases set based on mode
  const activeCases = isDemoMode ? SYNTHETIC_CASES : realCases.length > 0 ? realCases : SYNTHETIC_CASES;

  // Selected case derived from selectedCaseId or first active case
  const currentCase = selectedCaseId
    ? activeCases.find((c) => c.id === selectedCaseId) || null
    : activeCases.length > 0
    ? activeCases[0]
    : null;

  // Fetch real saved cases from backend API
  const fetchRealCases = useCallback(() => {
    fetch(`${getApiBaseUrl()}/api/sessions/cases`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch cases");
        return res.json();
      })
      .then((data) => {
        if (data && data.cases) {
          setRealCases(data.cases);
          if (data.cases.length > 0 && !selectedCaseId && !isDemoMode) {
            setSelectedCaseId(data.cases[0].id);
          }
        }
      })
      .catch((err) => {
        console.warn("Backend cases fetch failed:", err);
      });
  }, [selectedCaseId, isDemoMode]);

  useEffect(() => {
    fetch(`${getApiBaseUrl()}/health`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then((data) => {
        setBackendStatus(
          data.status === "healthy" ? "Online (Engine 1 Live)" : "Degraded"
        );
        setIsBackendHealthy(data.status === "healthy");
      })
      .catch(() => {
        setBackendStatus("Standby (Ready to connect)");
        setIsBackendHealthy(false);
      });

    fetchRealCases();
  }, [fetchRealCases]);

  const handleSessionComplete = (caseBrief: string) => {
    fetchRealCases();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* 1. Top Government of India Ribbon */}
      <div className="bg-[#0B2545] text-[#D0E2FF] px-4 sm:px-6 py-1 text-[11px] flex items-center justify-between border-b border-[#133E6D] select-none z-30 font-sans">
        <div className="flex items-center gap-2">
          {/* Indian Tricolor Icon */}
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

        <div className="flex items-center gap-4 text-[10.5px]">
          <span className="hidden md:inline-block text-[#B8D5FF]">
            Skip to Main Content
          </span>
          <div className="hidden sm:flex items-center gap-1.5 border-l border-r border-[#1C4E8A] px-3 font-bold text-white">
            <button className="px-1 hover:underline">A-</button>
            <button className="px-1 hover:underline">A</button>
            <button className="px-1 hover:underline">A+</button>
          </div>
          <div className="flex items-center gap-1 text-[#D0E2FF]">
            <Globe className="w-3 h-3 text-[#B8D5FF]" />
            <span className="font-semibold text-white">English</span>
          </div>
        </div>
      </div>

      {/* 2. Official Ministry & Department Header Bar */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-md hover:bg-[#F1F5F9] text-[#475569] lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Ashok Stambh Emblem & Ministry Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#1E3A8A]" fill="currentColor">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                <path d="M50 12 L54 26 L68 26 L56 35 L61 48 L50 40 L39 48 L44 35 L32 26 L46 26 Z" fill="#D97706" />
                <circle cx="50" cy="62" r="14" fill="none" stroke="#1E40AF" strokeWidth="2" />
                <path d="M50 50 L50 74 M38 62 L62 62 M41 53 L59 71 M41 71 L59 53" stroke="#1E40AF" strokeWidth="1.5" />
                <rect x="36" y="80" width="28" height="5" rx="1.5" fill="#374151" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#EFF6FF] text-[#1E40AF] text-[9.5px] font-extrabold px-1.5 py-0.2 rounded border border-[#BFDBFE] tracking-wide">
                  BETA
                </span>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  Government of India
                </span>
              </div>
              <h1 className="text-xs sm:text-[13px] font-extrabold text-[#0F172A] leading-tight">
                Ministry of Social Justice &amp; Empowerment
              </h1>
              <p className="text-[10px] text-[#2563EB] font-bold tracking-tight">
                Department of Social Justice &amp; Empowerment
              </p>
            </div>
          </div>
        </div>

        {/* Right Digital India & SAMAVESH Branding */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-5">
            {/* Digital India Emblem */}
            <div className="flex items-center gap-2 border-r border-[#E2E8F0] pr-5">
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
                <span className="text-xs font-black tracking-tight text-[#0F172A]">
                  SAMAVESH
                </span>
                <span className="text-[7px] text-[#64748B] leading-none max-w-[140px]">
                  Single Access Mechanism for All Verticals of Empowerment
                </span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* 3. Orange SAMBAL Notification Announcement */}
      {showBanner && (
        <div className="bg-[#E65100] text-white px-4 sm:px-6 py-2 text-xs font-medium flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
            <p className="tracking-wide">
              National Helpline Against Atrocities is now{" "}
              <strong className="font-bold underline decoration-white/50 underline-offset-2">
                SAMBAL (संबल)
              </strong>{" "}
              — same team, same number.
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-md hover:bg-black/15 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Main Body: Left SAMBAL Navigation + Right Main Content Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`w-64 bg-white border-r border-[#E2E8F0] p-4 flex flex-col justify-between shrink-0 transition-transform duration-200 z-30 ${
            mobileSidebarOpen ? "fixed inset-y-0 left-0 shadow-2xl" : "hidden lg:flex"
          }`}
        >
          <div className="space-y-5">
            {/* SAMBAL Logo & Details */}
            <div className="flex items-start gap-3 pb-3 border-b border-[#F1F5F9]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#2563EB] to-[#0D9488] p-0.5 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-[13px] font-extrabold text-[#0F172A] leading-tight">
                  SAMBAL <span className="text-[11px] text-[#2563EB] font-bold">(NHAA 2.0)</span>
                </h2>
                <p className="text-[9px] text-[#64748B] font-medium leading-tight mt-0.5">
                  Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab("live_session");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "live_session"
                    ? "bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-2xs"
                    : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mic className={`w-4 h-4 ${activeTab === "live_session" ? "text-[#2563EB]" : "text-[#64748B]"}`} />
                  <span>Live Intake Console</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              </button>

              <button
                onClick={() => {
                  setActiveTab("engine2");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "engine2"
                    ? "bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-2xs"
                    : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                <FolderOpen className={`w-4 h-4 ${activeTab === "engine2" ? "text-[#2563EB]" : "text-[#7C3AED]"}`} />
                <span>Caller Case Records</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("protocols");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "protocols"
                    ? "bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-2xs"
                    : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                <FileCode className={`w-4 h-4 ${activeTab === "protocols" ? "text-[#2563EB]" : "text-[#059669]"}`} />
                <span>NHAA SOP &amp; Protocols</span>
              </button>
            </nav>
          </div>

          {/* Helpline Call Ribbon */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#1E40AF]">
                  24x7 Helpline
                </div>
                <div className="text-xs font-black text-[#0F172A] font-mono">
                  14566 / 14567
                </div>
              </div>
            </div>
            <p className="text-[9.5px] text-[#94A3B8] text-center">
              SC/ST Protection &amp; Support Network
            </p>
          </div>
        </aside>

        {/* Right Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto max-w-7xl mx-auto w-full space-y-5">
          {/* 1. Live Intake Console (Engine 1) */}
          {activeTab === "live_session" && (
            <LiveSessionView onSessionComplete={handleSessionComplete} />
          )}

          {/* 2. Engine 2 Historical View */}
          {activeTab === "engine2" && (
            <Engine2HistoricalView currentCase={currentCase} />
          )}

          {/* 3. Protocols View */}
          {activeTab === "protocols" && <NHAAProtocolsView />}

          {/* Footer Ribbon */}
          <footer className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#64748B] mt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
              <span>
                SAMBAL &bull; SAATHI-AI • Explainable Decision Support Engine • Human Oversight Mandatory
              </span>
            </div>
            <div className="text-[#94A3B8] font-medium font-mono text-[10.5px]">
              {isDemoMode ? "Synthetic Demo Data Active" : "Live Workspace Mode • SQLite Database Synced"}
            </div>
          </footer>
        </main>
      </div>

      {/* Floating 24x7 SAMBAL / SAATHI-AI Assistant */}
      <ChatbotPanel currentCase={currentCase} />
    </div>
  );
}
