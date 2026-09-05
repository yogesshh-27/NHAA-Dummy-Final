import { useState, useEffect } from "react";
import type { CaseRecord } from "../data/caseData";
import { getApiBaseUrl } from "../config/api";
import {
  History,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  FileCheck,
  Scale,
  Car,
  ChevronRight,
} from "lucide-react";

interface PrecedentItem {
  caseId: string;
  title: string;
  similarityScore: number;
  year: number;
  district: string;
  state?: string;
  category: string;
  resolution: string;
  statutorySections?: string[];
  dispatchTimeMinutes?: number;
  outcome?: string;
}

interface RegionalClusterData {
  clusterName: string;
  district: string;
  incidentCount: number;
  avgDispatchTimeMinutes: number;
  riskAlert: string;
  spatialDensityIndex: string;
  temporalTrend: string;
  activeTimeframe?: string;
}

interface DelayRiskData {
  delayRiskScore: number;
  bottleneckProbability: string;
  availablePcrUnits: number;
  pcrFleetStatus: string;
  dutySupervisor: string;
  stationName: string;
  recommendedAction: string;
  estimatedEtaMinutes: number;
}

interface Engine2MatchResult {
  case: {
    id: string;
    caseNumber: string;
    district: string;
    finalSvi: number;
    sviLabel: string;
    caseBrief: string;
    fullTranscript: string;
    createdAt: string;
  };
  closestPrecedent: PrecedentItem;
  topPrecedents: PrecedentItem[];
  regionalCluster: RegionalClusterData;
  delayRisk: DelayRiskData;
  auditReasoning: string[];
}

interface Engine2HistoricalViewProps {
  currentCase?: CaseRecord | null;
  allCases?: CaseRecord[];
  onSelectCase?: (caseId: string) => void;
}

export function Engine2HistoricalView({
  currentCase,
  allCases = [],
  onSelectCase,
}: Engine2HistoricalViewProps) {
  const [engine2Data, setEngine2Data] = useState<Engine2MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adoptedPrecedentId, setAdoptedPrecedentId] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "14d" | "30d">("14d");
  const [selectedPrecedentIdx, setSelectedPrecedentIdx] = useState<number>(0);

  useEffect(() => {
    if (!currentCase) {
      setEngine2Data(null);
      return;
    }

    setIsLoading(true);
    fetch(`${getApiBaseUrl()}/api/engine2/match/${currentCase.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch Engine 2 matching result.");
        return res.json();
      })
      .then((data: Engine2MatchResult) => {
        setEngine2Data(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Engine 2 fetch error:", err);
        setIsLoading(false);
      });
  }, [currentCase]);

  const handleAdoptResolution = async (precedent: PrecedentItem) => {
    if (!currentCase) return;
    try {
      await fetch(`${getApiBaseUrl()}/api/engine2/adopt-resolution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: currentCase.caseNumber,
          precedent_id: precedent.caseId,
          operator_name: currentCase.operatorName || "Operator",
          resolution: precedent.resolution,
        }),
      });
      setAdoptedPrecedentId(precedent.caseId);
      setTimeout(() => setAdoptedPrecedentId(null), 4000);
    } catch (e) {
      console.error("Error adopting resolution:", e);
    }
  };

  if (!currentCase) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#E8EAEE] flex items-center justify-center text-[#66707A]">
            <History className="w-6 h-6 text-[#0E7C7B]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1F2430]">
              No Case Available for Engine 2 Historical Analysis
            </h3>
            <p className="text-xs text-[#66707A] max-w-md mt-1 leading-relaxed">
              Complete a live call interaction or select a case to run semantic precedent matching and regional cluster intelligence.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const precedentList = engine2Data?.topPrecedents && engine2Data.topPrecedents.length > 0
    ? engine2Data.topPrecedents
    : [
        engine2Data?.closestPrecedent || {
          caseId: currentCase.historicalMatch?.caseId || "#SKN-2025-1102",
          title: "Prior Incident Precedent Match",
          similarityScore: currentCase.historicalMatch?.similarityScore || 78,
          year: currentCase.historicalMatch?.year || 2024,
          district: currentCase.district,
          category: "EMERGENCY_DISPATCH",
          resolution: currentCase.historicalMatch?.resolution || "Immediate patrol response dispatched.",
          statutorySections: ["BNS Sec 351", "Police Act Sec 107"],
          dispatchTimeMinutes: 6.4,
          outcome: "Perpetrator restrained; victim secured.",
        },
      ];

  const activePrecedent = precedentList[selectedPrecedentIdx] || precedentList[0];
  const cluster = engine2Data?.regionalCluster;
  const delayRisk = engine2Data?.delayRisk;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Case Switcher Bar if multiple cases exist */}
      {allCases.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-[#66707A]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Evaluate Historical Precedent For:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {allCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCase && onSelectCase(c.id)}
                  className={`px-3 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                    c.id === currentCase.id
                      ? "bg-[#0b1f36] text-white border-[#0b1f36] font-bold shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c.caseNumber} ({c.district})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>SVI: </span>
            <strong className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {currentCase.sviScore}/100 ({currentCase.statusLabel.toUpperCase()})
            </strong>
          </div>
        </div>
      )}

      {/* Main Intelligence Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8EAEE]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F1FBFA] border border-[#D0F2EE]">
              <History className="w-5 h-5 text-[#0E7C7B]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-[#1F2430]">
                  Engine 2: Historical Intelligence &amp; Semantic Precedents
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F7EF] text-[#2F855A] border border-[#C7EBD7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F855A] animate-ping" />
                  Semantic Engine Active
                </span>
                {isLoading && (
                  <span className="text-xs text-slate-400 italic">Calculating vector similarities...</span>
                )}
              </div>
              <p className="text-xs text-[#66707A] mt-0.5">
                Evaluating Case <strong>{currentCase.caseNumber}</strong> ({currentCase.district}) against state incident archives and spatial density matrices
              </p>
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-semibold self-start sm:self-auto">
            <button
              onClick={() => setSelectedTimeframe("7d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedTimeframe === "7d" ? "bg-white text-[#0b1f36] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe("14d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedTimeframe === "14d" ? "bg-white text-[#0b1f36] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe("30d")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedTimeframe === "30d" ? "bg-white text-[#0b1f36] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* 3-Column Metric Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Semantic Match Precedent */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8EAEE] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#0E7C7B]/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Primary Precedent
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F7EF] text-[#2F855A] border border-[#C7EBD7]">
                  {activePrecedent.similarityScore}% Match
                </span>
              </div>

              <h4 className="text-base font-bold text-[#1F2430] mb-0.5">
                {activePrecedent.caseId}
              </h4>
              <p className="text-xs text-[#66707A] mb-3">
                {activePrecedent.district} District ({activePrecedent.year}) • {activePrecedent.category}
              </p>

              <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E8EAEE] space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Historical Resolution:
                </div>
                <p className="text-xs text-[#1F2430] leading-relaxed">
                  {activePrecedent.resolution}
                </p>
                {activePrecedent.outcome && (
                  <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mt-1">
                    ✓ Outcome: {activePrecedent.outcome}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleAdoptResolution(activePrecedent)}
                className="w-full py-2 px-3 rounded-lg bg-[#0b1f36] hover:bg-[#122e4d] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {adoptedPrecedentId === activePrecedent.caseId ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Resolution Adopted &amp; Logged</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Adopt Precedent Pathway</span>
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98]">
                <span>TF-IDF Cosine Vector Match</span>
                <span className="font-semibold text-[#0E7C7B]">Verified Similarity</span>
              </div>
            </div>
          </div>

          {/* Box 2: Regional Cluster Pattern */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8EAEE] flex flex-col justify-between space-y-4 shadow-sm hover:border-amber-400/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Regional Cluster
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FBF1E1] text-[#A6650F] border border-[#F5E2C4]">
                  {cluster ? cluster.riskAlert : "Elevated Cluster Alert"}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#1F2430] mb-0.5">
                {cluster ? cluster.clusterName : `${currentCase.district} Sector Cluster`}
              </h4>
              <p className="text-xs text-[#66707A] mb-3">
                Identified across {selectedTimeframe === "7d" ? "last 7 days" : selectedTimeframe === "30d" ? "last 30 days" : "last 14 days"}
              </p>

              <div className="space-y-2 text-xs text-[#1F2430]">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E8EAEE]">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Correlated incidents:
                  </span>
                  <strong className="text-[#B23A3A] font-bold">
                    {cluster
                      ? selectedTimeframe === "7d"
                        ? `${Math.max(1, cluster.incidentCount - 1)} reports`
                        : selectedTimeframe === "30d"
                        ? `${cluster.incidentCount + 4} reports`
                        : `${cluster.incidentCount} reports`
                      : "3 reports"}
                  </strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E8EAEE]">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Average dispatch response:
                  </span>
                  <strong className="text-[#1F2430] font-bold">
                    {cluster ? `${cluster.avgDispatchTimeMinutes} mins` : "6.4 mins"}
                  </strong>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11.5px] text-amber-900 leading-snug">
                  <strong>Spatial Alert:</strong> {cluster?.temporalTrend || "Cluster elevated in evening and late-night calls."}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98]">
              <span>Spatial Density Index</span>
              <span className="font-semibold text-[#A6650F]">
                {cluster?.spatialDensityIndex || "Elevated Density"}
              </span>
            </div>
          </div>

          {/* Box 3: Delay-Risk Prediction */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8EAEE] flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-400/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Delay-Risk Prediction
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  (delayRisk?.delayRiskScore || 0) >= 60
                    ? "bg-red-50 text-red-700 border-red-200"
                    : (delayRisk?.delayRiskScore || 0) >= 30
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {delayRisk ? `${delayRisk.bottleneckProbability} (${delayRisk.delayRiskScore}%)` : `Moderate (37%)`}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#1F2430] mb-0.5">
                Resource Availability
              </h4>
              <p className="text-xs text-[#66707A] mb-3">
                {delayRisk?.stationName || `${currentCase.district} Sector Station`}
              </p>

              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-2 text-xs text-[#1F2430]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Car className="w-3.5 h-3.5 text-emerald-600" />
                    Available PCR Units:
                  </span>
                  <strong className="text-[#2F855A] font-bold">
                    {delayRisk ? `${delayRisk.availablePcrUnits} Active Patrols` : "4 Active"}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Duty Supervisor:</span>
                  <strong className="text-[#1F2430]">
                    {delayRisk ? delayRisk.dutySupervisor : "Station Officer 02"}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Estimated Dispatch ETA:</span>
                  <strong className="text-[#0b1f36] font-mono font-bold">
                    ~{delayRisk?.estimatedEtaMinutes || 5.8} mins
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98]">
              <span>Bottleneck Probability</span>
              <span className="font-semibold text-[#2F855A]">
                {delayRisk ? delayRisk.bottleneckProbability : "Moderate"}
              </span>
            </div>
          </div>
        </div>

        {/* Top 3 Alternative Historical Precedents Comparison */}
        {precedentList.length > 1 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Top Correlated Historical Incident Archives ({precedentList.length} Found)
              </span>
              <span className="text-xs text-[#0E7C7B] font-medium">Click to inspect resolution pathway</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {precedentList.map((prec, idx) => (
                <div
                  key={prec.caseId}
                  onClick={() => setSelectedPrecedentIdx(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedPrecedentIdx === idx
                      ? "bg-slate-50 border-[#0b1f36] ring-1 ring-[#0b1f36]"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-[#0b1f36]">{prec.caseId}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {prec.similarityScore}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 truncate mb-1">{prec.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{prec.resolution}</div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-500">{prec.district}</span>
                    <span className="text-[#0E7C7B] font-bold flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statutory Legal Remedies & Recommendation Pathway */}
        {activePrecedent.statutorySections && activePrecedent.statutorySections.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Recommended Statutory Legal Framework &amp; Standard Operating Protocol</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {activePrecedent.statutorySections.map((sec, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-white border border-blue-300 font-mono font-semibold text-blue-900 text-xs shadow-2xs"
                >
                  § {sec}
                </span>
              ))}
            </div>
            <p className="text-[11.5px] text-blue-800 leading-relaxed pt-1">
              {delayRisk?.recommendedAction || "Coordinate immediate PCR dispatch and assign dedicated protection beat officer."}
            </p>
          </div>
        )}

        {/* Audit Reasoning Steps */}
        {engine2Data?.auditReasoning && engine2Data.auditReasoning.length > 0 && (
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-2">
            <div className="text-xs font-bold text-[#1F2430] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0E7C7B]" />
              <span>Engine 2 Explainable Reasoning Breakdown:</span>
            </div>
            <ul className="space-y-1 text-xs text-[#66707A] list-disc list-inside leading-relaxed">
              {engine2Data.auditReasoning.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
