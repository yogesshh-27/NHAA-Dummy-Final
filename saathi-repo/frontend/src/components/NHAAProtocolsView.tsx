"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  AlertTriangle,
  HeartHandshake,
  UserX,
  Lock,
  Stethoscope,
  LifeBuoy,
  FileText,
  CheckCircle2,
  AlertOctagon,
  Users,
  Search,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  BellRing,
  HelpCircle,
  Radio,
  FileCheck2,
} from "lucide-react";

type ProtocolCategory =
  | "all"
  | "atrocity"
  | "threat"
  | "safety"
  | "violence"
  | "sexual"
  | "domestic"
  | "coercion"
  | "isolation"
  | "self_harm"
  | "medical";

interface ProtocolCardData {
  id: string;
  category: ProtocolCategory;
  title: string;
  badge: string;
  badgeColor: string;
  objective: string;
  markers: string[];
  operationalActions: string[];
  nhaaEscalationPath: string;
  sviThreshold: string;
}

const PROTOCOLS_LIST: ProtocolCardData[] = [
  {
    id: "sc_st_atrocity",
    category: "atrocity",
    title: "1. SC/ST Atrocity Complaint",
    badge: "PoA Act Redressal",
    badgeColor: "bg-[#E6F4F4] text-[#0E7C7B] border-[#99D5D4]",
    objective:
      "Formal intake and expedited grievance registration for offenses under the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act.",
    markers: [
      "Caste-based slurs, verbal humiliation, or hate speech targeting identity",
      "Denial of access to public water sources, temples, pathways, or community resources",
      "Forced dispossession of land, property damage, or illegal occupation of land",
      "Threats of social boycott or institutional discrimination",
    ],
    operationalActions: [
      "Log full grievance details with exact timestamp, location, and party identifiers",
      "Categorize offense under relevant sections of the PoA Act (Section 3)",
      "Issue immediate NHAA grievance reference number to caller via SMS/voice confirm",
      "Direct priority dispatch alert to District Nodal Officer & SC/ST Protection Cell",
    ],
    nhaaEscalationPath: "District Nodal Officer (PoA Cell) & Sub-Divisional Magistrate (SDM)",
    sviThreshold: "SVI 45 - 65 (Moderate to High)",
  },
  {
    id: "threat_intimidation",
    category: "threat",
    title: "2. Threat & Intimidation",
    badge: "High Risk Assessment",
    badgeColor: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    objective:
      "Immediate risk mitigation for callers facing explicit threats, harassment, or mob pressure targeting their safety or dignity.",
    markers: [
      "Explicit verbal threats of bodily harm, murder, or village eviction",
      "Gathering of perpetrators or mobs outside caller's residence",
      "Targeted intimidation aimed at forcing complaint withdrawal",
      "Hostile surveillance or stalking around caller's household",
    ],
    operationalActions: [
      "Flag call as High Risk on operator console; initiate real-time audio log",
      "Maintain continuous active line connection while gathering exact location landmarks",
      "Trigger immediate notification to NHAA Field Liaison and District Nodal Protection Officer",
      "Guide caller to lock premises, move to inner room, and stay away from windows",
    ],
    nhaaEscalationPath: "District Protection Officer & Special SC/ST Police Unit",
    sviThreshold: "SVI 65 - 80 (High)",
  },
  {
    id: "immediate_safety_distress",
    category: "safety",
    title: "3. Immediate Safety & Distress",
    badge: "Urgent Siege Protocol",
    badgeColor: "bg-[#FDF2F2] text-[#C81E1E] border-[#F8B4B4]",
    objective:
      "Rapid crisis de-escalation for callers under active physical siege, extreme panic, or imminent threat to life.",
    markers: [
      "High voice agitation, screaming, hyperventilation, or active weeping",
      "Audible sounds of forced entry, shouting perpetrators, or physical disturbance",
      "Direct statements of immediate physical danger ('They are breaking the door')",
      "Severe caller disorientation caused by acute panic or distress",
    ],
    operationalActions: [
      "Maintain calm, steady voice; apply immediate grounding protocol ('You are on line 14566, help is being dispatched')",
      "Perform priority location lock (GPS / cell tower / landmark verification)",
      "Activate Priority 1 Emergency Dispatch to nearest NHAA Emergency Mobile Unit",
      "Keep line open silently if caller must hide from perpetrators",
    ],
    nhaaEscalationPath: "NHAA Emergency Mobile Unit & District Command Center",
    sviThreshold: "SVI 80 - 100 (Critical)",
  },
  {
    id: "physical_violence_injury",
    category: "violence",
    title: "4. Physical Violence & Injury",
    badge: "Medical-Legal Dispatch",
    badgeColor: "bg-[#FDF2F2] text-[#C81E1E] border-[#F8B4B4]",
    objective:
      "Emergency response to physical assault, arson, bodily harm, or severe injury arising from atrocity incidents.",
    markers: [
      "Reports of physical battery, weapon use, arson, or severe bodily harm",
      "Bleeding, fractures, head injuries, or physical incapacitation",
      "Destruction or burning of crops, dwelling houses, or livestock",
      "Multiple injured family or community members requiring emergency care",
    ],
    operationalActions: [
      "Simultaneous dual dispatch: Link caller location to District Medical Emergency Unit & SC/ST Protection Unit",
      "Provide step-by-step telephonic emergency first-aid advice (bleeding control, airway management)",
      "Ensure prompt medical-legal examination (MLC) protocol tag for evidence preservation",
      "Notify District Social Welfare Officer for immediate relief fund disbursal under PoA Rules",
    ],
    nhaaEscalationPath: "District Emergency Ambulance (108 Link) & District Magistrate Nodal Cell",
    sviThreshold: "SVI 85 - 100 (Critical)",
  },
  {
    id: "sexual_violence_harassment",
    category: "sexual",
    title: "5. Sexual Violence & Harassment",
    badge: "Trauma-Informed Priority",
    badgeColor: "bg-[#FDF2F2] text-[#C81E1E] border-[#F8B4B4]",
    objective:
      "Sensitive, trauma-informed response to gender and caste-targeted sexual assault, molestation, or harassment.",
    markers: [
      "Reports of sexual assault, attempted rape, or outraging of modesty",
      "Caste-targeted sexual harassment, stalker intimidation, or blackmail",
      "Extreme emotional trauma, fear of stigma, or reluctance to report",
      "Threats of sexual violence against family members",
    ],
    operationalActions: [
      "Offer warm transfer to certified female operator or survivor support liaison",
      "Execute strict trauma-informed protocol: prioritize caller emotional safety, avoid intrusive probing",
      "Dispatch specialized One Stop Centre (OSC) support unit & female medical escort",
      "Initiate immediate victim protection tag under Section 15A of the PoA Act",
    ],
    nhaaEscalationPath: "District One Stop Centre (OSC) & District Female Protection Officer",
    sviThreshold: "SVI 80 - 100 (Critical)",
  },
  {
    id: "domestic_community_pressure",
    category: "domestic",
    title: "6. Domestic & Community Pressure",
    badge: "Systemic Protection",
    badgeColor: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    objective:
      "Intervention against community-wide social boycotts, village sanctions, caste isolation, or severe domestic coercion.",
    markers: [
      "Enforced social or economic boycott imposed by dominant village groups",
      "Denial of access to shops, employment, grinding mills, or public transport",
      "Pressure from local leaders or relatives to suppress atrocity reporting",
      "Systemic exclusion of family from village community activities",
    ],
    operationalActions: [
      "Log detailed incident report specifying dominant group leaders enforcing boycott",
      "Escalate to Sub-Divisional Magistrate (SDM) for Section 3(1) PoA Act enforcement",
      "Alert District Welfare Officer to inspect village site and restore essential supplies",
      "Assign NHAA Legal Aid Counselor for community protection orientation",
    ],
    nhaaEscalationPath: "Sub-Divisional Magistrate (SDM) & District Social Welfare Officer",
    sviThreshold: "SVI 50 - 70 (Moderate to High)",
  },
  {
    id: "coercion_blackmail",
    category: "coercion",
    title: "7. Coercion & Blackmail",
    badge: "Witness Protection",
    badgeColor: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    objective:
      "Protection for victims and witnesses against extortion, blackmail, or forced compromise of atrocity proceedings.",
    markers: [
      "Threats of economic ruin or job loss if complaint is not withdrawn",
      "Fabrication of false counter-complaints or legal intimidation",
      "Financial extortion or blackmail by perpetrators or intermediaries",
      "Intimidation of key witnesses prior to judicial testimony",
    ],
    operationalActions: [
      "Apply Witness Protection Protocol under Section 15A of PoA Act to case file",
      "Record secure audio metadata and timestamp all coercive threat logs",
      "Notify District Special Public Prosecutor & Nodal Police Officer for witness security",
      "Advise caller on legal rights regarding non-compoundable nature of atrocity offenses",
    ],
    nhaaEscalationPath: "District Special Public Prosecutor & Witness Protection Cell",
    sviThreshold: "SVI 60 - 75 (High)",
  },
  {
    id: "vulnerability_isolation",
    category: "isolation",
    title: "8. Vulnerability & Isolation",
    badge: "Targeted Welfare",
    badgeColor: "bg-[#E6F4F4] text-[#0E7C7B] border-[#99D5D4]",
    objective:
      "Specialized tracking and protective outreach for isolated, elderly, disabled, or single SC/ST callers.",
    markers: [
      "Caller residing in remote hamlet with no immediate caste community support",
      "Physical disability, advanced age, or single-occupant household status",
      "Lack of mobile network stability or transportation access",
      "Expressed feelings of extreme social isolation and abandonment",
    ],
    operationalActions: [
      "Calculate SVI Isolation Multiplier (+15 pts) to reflect heightened risk profile",
      "Tag caller profile for periodic automated/operator safety check-ins",
      "Route case file to District Social Welfare Officer for field visit",
      "Connect caller with nearest community protection volunteer network",
    ],
    nhaaEscalationPath: "District Social Welfare Liaison & Community Protection Volunteer",
    sviThreshold: "SVI 40 - 60 (Moderate)",
  },
  {
    id: "self_harm_concern",
    category: "self_harm",
    title: "9. Self-Harm Concern",
    badge: "Crisis Lifeline",
    badgeColor: "bg-[#FDF2F2] text-[#C81E1E] border-[#F8B4B4]",
    objective:
      "Immediate psychological crisis grounding and intervention for callers expressing self-harm or suicidal ideation from severe atrocity distress.",
    markers: [
      "Expressions of despair or hopelessness ('I can no longer endure this oppression')",
      "Direct or indirect statements of self-harm or suicide intention",
      "Acute psychological breakdown stemming from humiliation or loss of livelihood",
      "Caller stating farewells or distributing belongings",
    ],
    operationalActions: [
      "STRICT MANDATE: Do NOT disconnect call under any circumstances",
      "Execute verbal crisis stabilization: use calm tone, validate suffering without reinforcing despair",
      "Initiate immediate silent warm bridge with Tele-MANAS / Certified Mental Health Counselor",
      "Coordinate local emergency welfare dispatch to caller's physical address",
    ],
    nhaaEscalationPath: "Tele-MANAS Crisis Unit & Emergency Health Officer",
    sviThreshold: "SVI 75 - 95 (Critical)",
  },
  {
    id: "medical_urgency",
    category: "medical",
    title: "10. Medical Urgency",
    badge: "Acute Health Priority",
    badgeColor: "bg-[#FDF2F2] text-[#C81E1E] border-[#F8B4B4]",
    objective:
      "Rapid medical triage for severe physical trauma, unconsciousness, or acute health collapse during helpline intake.",
    markers: [
      "Unconsciousness, unresponsive caller, or severe difficulty breathing",
      "Active heavy hemorrhage, deep lacerations, or burn trauma",
      "Pre-existing critical health condition aggravated by stress or physical assault",
      "Bystander calling on behalf of injured survivor",
    ],
    operationalActions: [
      "Instantly activate priority medical ambulance bridge (108 / local hospital network)",
      "Provide step-by-step tele-triage instructions (positioning, wound compression, airway clearance)",
      "Maintain active line until emergency medical technician (EMT) confirms arrival on site",
      "Log medical intake report into NHAA Emergency Record for hospital coordination",
    ],
    nhaaEscalationPath: "District Emergency Ambulance Service & District Hospital Emergency Ward",
    sviThreshold: "SVI 85 - 100 (Critical)",
  },
];

export function NHAAProtocolsView() {
  const [activeSubTab, setActiveSubTab] = useState<"protocols" | "guidelines" | "escalation">("protocols");
  const [selectedCategory, setSelectedCategory] = useState<ProtocolCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>("sc_st_atrocity");

  const filteredProtocols = PROTOCOLS_LIST.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.markers.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-5 w-full max-w-6xl mx-auto">
      {/* 1. Header Banner & Context */}
      <div className="saathi-card p-5 sm:p-6 bg-white border border-[#E5E7EB] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#0E7C7B] text-white uppercase tracking-wider">
                NHAA 14566 Mandate
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#E6F4F4] text-[#0E7C7B] border border-[#99D5D4] uppercase">
                SC/ST PoA Act Redressal
              </span>
            </div>
            <h2 className="text-xl font-extrabold font-serif-header text-[#111827] tracking-tight">
              NHAA Atrocity Response Protocols & Standard Operating Procedures (SOP)
            </h2>
            <p className="text-xs text-[#4B5563] max-w-3xl">
              Operational call-handling protocols aligned with the National Helpline against Atrocities (NHAA - 14566) 
              and the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act for emergency helpline operators.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
            <Radio className="w-5 h-5 text-[#0E7C7B] animate-pulse" />
            <div>
              <div className="text-[10px] font-bold text-[#64748B] uppercase font-mono">HELINE TRUNK</div>
              <div className="text-xs font-bold text-[#0F172A] font-mono">14566 / TOLL-FREE ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Mandatory Decision Support Disclaimer Note */}
        <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs text-[#92400E] leading-relaxed">
            <strong className="font-bold">Important Decision Support Notice:</strong> SAATHI-AI provides decision support only; it does not diagnose or make autonomous legal/medical decisions. Helpline operators retain 100% final decision authority and operational responsibility for case dispatches, grievance logging, and emergency escalations.
          </div>
        </div>

        {/* Section Main Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-[#F1F5F9]">
          <button
            onClick={() => setActiveSubTab("protocols")}
            className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "protocols"
                ? "bg-[#0E7C7B] text-white shadow-sm"
                : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>10 Atrocity Response Protocols</span>
          </button>

          <button
            onClick={() => setActiveSubTab("guidelines")}
            className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "guidelines"
                ? "bg-[#0E7C7B] text-white shadow-sm"
                : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Operator Communication Guidelines</span>
          </button>

          <button
            onClick={() => setActiveSubTab("escalation")}
            className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "escalation"
                ? "bg-[#0E7C7B] text-white shadow-sm"
                : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>AI Escalation & Human Override</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB 1: PROTOCOLS LIST */}
      {activeSubTab === "protocols" && (
        <div className="space-y-4">
          {/* Category Filter & Search Bar */}
          <div className="saathi-card p-4 bg-white border border-[#E5E7EB] flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search protocols or markers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded text-xs border border-[#D1D5DB] focus:outline-none focus:border-[#0E7C7B] bg-[#F9FAFB]"
              />
            </div>

            {/* Category Filter Dropdown / Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mr-1 shrink-0">
                Filter:
              </span>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-[#071221] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setSelectedCategory("atrocity")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "atrocity"
                    ? "bg-[#071221] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                }`}
              >
                Atrocity
              </button>
              <button
                onClick={() => setSelectedCategory("threat")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "threat"
                    ? "bg-[#071221] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                }`}
              >
                Threat
              </button>
              <button
                onClick={() => setSelectedCategory("safety")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "safety"
                    ? "bg-[#071221] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                }`}
              >
                Siege/Safety
              </button>
              <button
                onClick={() => setSelectedCategory("violence")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "violence"
                    ? "bg-[#071221] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                }`}
              >
                Violence
              </button>
              <button
                onClick={() => setSelectedCategory("sexual")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "sexual"
                    ? "bg-[#071221] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                }`}
              >
                Sexual Harassment
              </button>
            </div>
          </div>

          {/* Cards Grid / List */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredProtocols.length > 0 ? (
              filteredProtocols.map((item) => {
                const isExpanded = expandedCardId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`saathi-card bg-white border transition-all ${
                      isExpanded
                        ? "border-[#0E7C7B] ring-1 ring-[#0E7C7B]"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    {/* Header bar of the card */}
                    <div
                      onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center text-[#0E7C7B] font-bold shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#111827]">
                              {item.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">
                            {item.objective}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                          {item.sviThreshold}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                        )}
                      </div>
                    </div>

                    {/* Detailed expanded content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#F1F5F9] space-y-4">
                        {/* Objective */}
                        <div>
                          <span className="text-[10.5px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                            Primary SOP Objective:
                          </span>
                          <p className="text-xs text-[#111827] bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] leading-relaxed">
                            {item.objective}
                          </p>
                        </div>

                        {/* Two columns: Intake Markers & Operational Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Key Intake Markers */}
                          <div className="space-y-1.5">
                            <span className="text-[10.5px] font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                              <span>Observable Intake Markers</span>
                            </span>
                            <ul className="space-y-1 bg-[#FFFBEB] p-3 rounded border border-[#FDE68A] text-xs text-[#92400E]">
                              {item.markers.map((marker, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="font-bold text-[#D97706]">•</span>
                                  <span>{marker}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Mandatory Operational Actions */}
                          <div className="space-y-1.5">
                            <span className="text-[10.5px] font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7C7B]" />
                              <span>Mandatory Operational Actions</span>
                            </span>
                            <ul className="space-y-1 bg-[#E6F4F4] p-3 rounded border border-[#99D5D4] text-xs text-[#064E3B]">
                              {item.operationalActions.map((act, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="font-bold text-[#0E7C7B]">{idx + 1}.</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Footer: Escalation Target & SVI range */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-[#0E7C7B]" />
                            <span>
                              <strong>NHAA Nodal Target:</strong> {item.nhaaEscalationPath}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#4B5563] font-mono text-[11px]">
                            <span>Calibrated Score:</span>
                            <strong className="text-[#111827]">{item.sviThreshold}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="saathi-card p-8 bg-white text-center space-y-2">
                <Search className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                <p className="text-xs text-[#6B7280]">
                  No protocols found matching &quot;{searchQuery}&quot;. Try clearing filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: OPERATOR COMMUNICATION GUIDELINES */}
      {activeSubTab === "guidelines" && (
        <div className="space-y-4">
          <div className="saathi-card p-6 bg-white border border-[#E5E7EB] space-y-4">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="w-10 h-10 rounded bg-[#E6F4F4] text-[#0E7C7B] flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif-header text-[#111827]">
                  NHAA 14566 Operator Communication Guidelines
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Mandatory communication protocols for handling distressed callers reporting SC/ST atrocities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Trauma-Informed Active Listening */}
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A] uppercase font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#0E7C7B]" />
                  <span>1. Trauma-Informed Listening</span>
                </div>
                <ul className="text-xs text-[#334155] space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Maintain an empathetic, non-judgmental, and steady tone of voice throughout the call.</li>
                  <li>Never invalidate the caller&apos;s experience or question the authenticity of caste discrimination statements.</li>
                  <li>Avoid intrusive, skeptical, or cross-examination phrasing that could cause re-traumatization.</li>
                  <li>Explicitly reassure the caller that their grievance is being handled under strict confidentiality.</li>
                </ul>
              </div>

              {/* Box 2: De-escalation & Reassurance Phrasing */}
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A] uppercase font-mono">
                  <LifeBuoy className="w-4 h-4 text-[#0E7C7B]" />
                  <span>2. De-escalation Phrasing</span>
                </div>
                <ul className="text-xs text-[#334155] space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>
                    <strong>Standard Safety Reassurance:</strong> &quot;You are connected to National Helpline 14566. You are safe now, and I am documenting your grievance.&quot;
                  </li>
                  <li>
                    <strong>Grounding in Panic:</strong> &quot;Take a slow breath. Can you tell me if you are currently in a secure room away from the main door?&quot;
                  </li>
                  <li>
                    <strong>Controlled Cadence:</strong> Speak slowly and clearly to naturally calm hyperventilating or panicked callers.
                  </li>
                </ul>
              </div>

              {/* Box 3: Structured Grievance Intake */}
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A] uppercase font-mono">
                  <FileText className="w-4 h-4 text-[#0E7C7B]" />
                  <span>3. Structured Intake Protocol</span>
                </div>
                <ul className="text-xs text-[#334155] space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>First priority: Confirm immediate physical safety and current location (District, Block, Landmark).</li>
                  <li>Second priority: Identify whether active violence, physical siege, or injury is taking place right now.</li>
                  <li>Third priority: Document perpetrator details, caste slurs, weapon presence, and witness accounts.</li>
                  <li>Always provide the caller with their unique NHAA Grievance Reference Number before call termination.</li>
                </ul>
              </div>

              {/* Box 4: Language & Dialect Accessibility */}
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A] uppercase font-mono">
                  <Users className="w-4 h-4 text-[#0E7C7B]" />
                  <span>4. Language Accessibility</span>
                </div>
                <ul className="text-xs text-[#334155] space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Support callers in Hindi (Devanagari), Hinglish, English, or local regional dialects seamlessly.</li>
                  <li>Use simple, jargon-free legal terms so callers understand their rights under the PoA Act.</li>
                  <li>If language barriers arise, request immediate live assistance from multi-lingual NHAA pool operators.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: AI ESCALATION & HUMAN OVERRIDE */}
      {activeSubTab === "escalation" && (
        <div className="space-y-4">
          <div className="saathi-card p-6 bg-white border border-[#E5E7EB] space-y-5">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="w-10 h-10 rounded bg-[#F0FDF4] text-[#059669] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif-header text-[#111827]">
                  AI Escalation Matrix & Human-in-the-Loop Override
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Governance framework for SVI score calculation, automated alert thresholds, and operator override controls.
                </p>
              </div>
            </div>

            {/* SVI Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Low */}
              <div className="p-3.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#065F46] font-mono">SVI 0 - 30</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#A7F3D0] text-[#064E3B] uppercase">
                    Low Triage
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#065F46]">Standard Intake</h4>
                <p className="text-[11.5px] text-[#047857] leading-tight">
                  Standard grievance recording; automated dispatch to District Nodal Officer within standard SLA (24 hrs).
                </p>
              </div>

              {/* Moderate */}
              <div className="p-3.5 rounded bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#92400E] font-mono">SVI 31 - 60</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FDE68A] text-[#78350F] uppercase">
                    Moderate Risk
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#92400E]">Elevated Monitoring</h4>
                <p className="text-[11.5px] text-[#B45309] leading-tight">
                  Highlights atrocity indicators; prompts operator for clarifying questions; SLA review within 4 hrs.
                </p>
              </div>

              {/* High */}
              <div className="p-3.5 rounded bg-[#FFF7ED] border border-[#FFD8A8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C2410C] font-mono">SVI 61 - 80</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFD8A8] text-[#9A3412] uppercase">
                    High Alert
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#C2410C]">Priority Escalation</h4>
                <p className="text-[11.5px] text-[#C2410C] leading-tight">
                  Triggers visual alert on operator console; recommends immediate District Nodal Officer & Protection Unit alert.
                </p>
              </div>

              {/* Critical */}
              <div className="p-3.5 rounded bg-[#FDF2F2] border border-[#F8B4B4] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#991B1B] font-mono">SVI 81 - 100</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F8B4B4] text-[#7F1D1D] uppercase">
                    Critical Siege
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#991B1B]">Immediate Dispatch</h4>
                <p className="text-[11.5px] text-[#991B1B] leading-tight">
                  Flashing red banner; surfaces immediate siege checklist; auto-suggests emergency medical & field unit bridge.
                </p>
              </div>
            </div>

            {/* Human Override & Auditability Section */}
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A] font-mono">
                <Lock className="w-4 h-4 text-[#0E7C7B]" />
                <span>Human Operator Override & Immutable Audit Logging</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#334155]">
                <div className="p-3 rounded bg-white border border-[#E2E8F0] space-y-1">
                  <strong className="font-bold text-[#0F172A] block">1. Full Override Authority</strong>
                  <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                    Helpline operators can manually adjust the calculated SVI score (e.g. from Low to Critical) or override AI recommendations at any time based on human judgment.
                  </p>
                </div>
                <div className="p-3 rounded bg-white border border-[#E2E8F0] space-y-1">
                  <strong className="font-bold text-[#0F172A] block">2. Mandatory Rationale Logging</strong>
                  <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                    Any override action requires entering a mandatory reason code and brief text justification into the system prompt before saving.
                  </p>
                </div>
                <div className="p-3 rounded bg-white border border-[#E2E8F0] space-y-1">
                  <strong className="font-bold text-[#0F172A] block">3. Immutable Audit Trail</strong>
                  <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                    All score updates, indicator matches, operator overrides, and dispatch timestamps are saved into an encrypted SQLite audit log for statutory compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
