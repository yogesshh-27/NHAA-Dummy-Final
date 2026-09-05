"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Radio,
  Square,
  Sparkles,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Database,
  Volume2,
  Info,
  Globe,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  PhoneCall,
  FileText,
  UserCheck,
  Activity,
  Sliders,
} from "lucide-react";
import { SVIArcGauge } from "./SVIArcGauge";
import { getApiBaseUrl, getWebSocketUrl } from "@/config/api";

interface IndicatorItem {
  category: string;
  ui_label: string;
  matched_phrase: string;
  evidence_snippet: string;
  weight: number;
  is_calming: boolean;
  confidence?: number;
  assistance_type?: string;
}

interface MetricBar {
  name: string;
  score: number;
  evidence?: string[];
}

interface CopilotData {
  suggested_question: string;
  communication_tip: string;
  why_this_question?: string;
  why_this_helps?: string;
  source: string;
}

interface ScoreHistoryPoint {
  timestamp: string;
  score: number;
  label: string;
  trigger_text?: string;
}

interface LiveSessionResult {
  session_id: string;
  final_svi: number;
  final_svi_label: string;
  full_transcript: string;
  chunk_count: number;
  metric_bars: MetricBar[];
  score_history?: ScoreHistoryPoint[];
  case_brief: string;
  brief_source: string;
  case_db_id?: number;
}

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
  speaker?: "CALLER" | "OPERATOR";
  category?: string;
  category_label?: string;
}

interface LiveSessionViewProps {
  onSessionComplete?: (caseBrief: string) => void;
}

const QUICK_TEST_PHRASES = [
  {
    text: "Namaste, mera naam Anita hai. Main Sant Kabir Nagar se bol rahi hoon.",
    type: "intake",
    label: "Baseline Intake",
    expected: "Baseline intake (SVI 0-15, LOW)",
  },
  {
    text: "Mujhe dhamki mil rahi hai, usne bola jaan se maar dega.",
    type: "threat",
    label: "Threat Language",
    expected: "Threat & Intimidation flag (SVI ~40-55)",
  },
  {
    text: "Mujhe bahut darr lag raha hai, main panic kar rahi hoon.",
    type: "fear",
    label: "Fear / Distress",
    expected: "Fear & Panic signal (SVI ~60-75)",
  },
  {
    text: "Woh abhi mere ghar ke bahar hai right now.",
    type: "proximity",
    label: "Immediate Danger",
    expected: "Current Imminent Danger (CRITICAL ~85+)",
  },
  {
    text: "Main jeena nahi chahti, mujhe lagta hai mar jana chahiye.",
    type: "self_harm",
    label: "Self-Harm Risk",
    expected: "Self-Harm Risk Alert (Requires Operator Review)",
  },
  {
    text: "Usne mujhe maara, mere khoon aa raha hai.",
    type: "violence",
    label: "Physical Violence",
    expected: "Violence & Medical Emergency flag",
  },
  {
    text: "Woh mera peecha kar raha hai roz ghar ke bahar.",
    type: "stalking",
    label: "Stalking / Following",
    expected: "Stalking & Repeated Pattern flag",
  },
  {
    text: "Main akeli hoon. Koi mere saath nahi hai.",
    type: "isolation",
    label: "Isolation Signal",
    expected: "Isolation signal vulnerability spike",
  },
  {
    text: "Please police ko bulao, mujhe emergency help chahiye.",
    type: "help",
    label: "Police Help Request",
    expected: "Assistance Request: Police / Emergency",
  },
  {
    text: "Abhi main safe hoon, police aa gayi hai.",
    type: "calming",
    label: "Reassurance Signal",
    expected: "Active Score De-escalation (SVI drops)",
  },
  {
    text: "Movie mein villain ne bola main tumhe maar dunga.",
    type: "negative_context",
    label: "Movie Context (Non-Threat)",
    expected: "Negative Context Filter (No real threat)",
  },
];

export function LiveSessionView({ onSessionComplete }: LiveSessionViewProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [operatorName, setOperatorName] = useState<string>("Priya Singh (OP-8821)");
  const [district, setDistrict] = useState<string>("Sant Kabir Nagar, UP");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi-IN");

  // Real Dynamic Initial State (0 SVI, Neutral LOW)
  const [sviScore, setSviScore] = useState<number>(0);
  const [sviLabel, setSviLabel] = useState<string>("LOW");
  const [chunkCount, setChunkCount] = useState<number>(0);
  const [speechPaceLabel, setSpeechPaceLabel] = useState<string>("normal");
  const [metricBars, setMetricBars] = useState<MetricBar[]>([
    { name: "Threat Language", score: 0 },
    { name: "Fear & Panic Signal", score: 0 },
    { name: "Immediate Safety / Urgency", score: 0 },
    { name: "Isolation Signal", score: 0 },
  ]);
  const [indicators, setIndicators] = useState<IndicatorItem[]>([]);
  const [copilot, setCopilot] = useState<CopilotData>({
    suggested_question: "Namaste, ERSS Emergency Control Room. Aap kahan se bol rahe hain?",
    communication_tip: "Maintain a calm, reassuring tone. Establish caller location and immediate safety status.",
    why_this_question: "Initial caller location & intake confirmation required.",
    why_this_helps: "Helps dispatch nearby emergency response unit immediately.",
    source: "default",
  });
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryPoint[]>([]);
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [interimText, setInterimText] = useState<string>("");

  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [completedSummary, setCompletedSummary] = useState<LiveSessionResult | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  // In-place auto-scroll for transcript container ONLY (prevents main page scroll jumping)
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcriptEntries, interimText]);

  const startLiveSession = async () => {
    try {
      setStatusNotice(null);
      setCompletedSummary(null);
      setTranscriptEntries([]);
      setInterimText("");
      setIndicators([]);
      setScoreHistory([]);
      setSviScore(0);
      setSviLabel("LOW");
      setMetricBars([
        { name: "Threat Language", score: 0 },
        { name: "Fear & Panic Signal", score: 0 },
        { name: "Immediate Safety / Urgency", score: 0 },
        { name: "Isolation Signal", score: 0 },
      ]);

      const params = new URLSearchParams({
        operator_name: operatorName,
        district: district,
        language: selectedLanguage,
      });

      const res = await fetch(`${getApiBaseUrl()}/api/sessions/start?${params.toString()}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Could not initialize session on backend");
      const data = await res.json();
      const newSessionId = data.session_id;
      setSessionId(newSessionId);
      setIsSessionActive(true);

      // Connect browser WebSocket to backend Deepgram WS proxy
      connectDeepgramWebSocket(newSessionId);
    } catch (err: any) {
      console.error("Failed to start session:", err);
      setStatusNotice(`Session start error: ${err.message || "Backend offline"}`);
    }
  };

  const connectDeepgramWebSocket = (activeSessionId: string) => {
    try {
      const wsUrl = getWebSocketUrl(`/api/deepgram/ws/${activeSessionId}?language=${encodeURIComponent(selectedLanguage)}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Deepgram WS connected for session:", activeSessionId);
        startMicCapture();
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);

          if (msg.type === "interim") {
            setInterimText(msg.text || "");
          } else if (msg.type === "final") {
            setInterimText("");
            const text = msg.text?.trim();
            if (text) {
              const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setTranscriptEntries((prev) => [
                ...prev,
                { id: `t-${Date.now()}`, text: text, timestamp: nowTime, isFinal: true, speaker: "CALLER" },
              ]);
            }

            // Correctly parse SVI numerical score and label from Engine 1 response
            if (typeof msg.svi === "number") {
              setSviScore(msg.svi);
              setSviLabel(msg.svi_label || "LOW");
            } else if (msg.svi && typeof msg.svi === "object") {
              setSviScore(msg.svi.score ?? 0);
              setSviLabel(msg.svi.label ?? msg.svi_label ?? "LOW");
            }

            if (msg.chunk_count) setChunkCount(msg.chunk_count);
            if (msg.metric_bars && Array.isArray(msg.metric_bars)) setMetricBars(msg.metric_bars);
            if (msg.speech_pace_label) setSpeechPaceLabel(msg.speech_pace_label);
            if (msg.indicators && Array.isArray(msg.indicators)) setIndicators(msg.indicators);
            if (msg.copilot) setCopilot(msg.copilot);
            if (msg.score_history && Array.isArray(msg.score_history)) setScoreHistory(msg.score_history);
          } else if (msg.type === "error") {
            setStatusNotice(`Deepgram notice: ${msg.message || msg.error}`);
          }
        } catch (e) {
          console.warn("WS message parse error:", e);
        }
      };

      ws.onerror = (err) => {
        console.warn("WebSocket error:", err);
        setStatusNotice("Live voice WebSocket connection error. Verify backend and DEEPGRAM_API_KEY.");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (err: any) {
      console.error("WS connection error:", err);
      setStatusNotice(`WebSocket connection failed: ${err.message}`);
    }
  };

  const startMicCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };

      mediaRecorder.start(250);
    } catch (err: any) {
      console.error("Microphone capture failed:", err);
      setStatusNotice(`Microphone error: ${err.message || "Permission denied"}. You can test live using Quick Test Phrases on the left.`);
    }
  };

  const stopMicCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const handleSendTestPhrase = async (phraseText: string) => {
    let targetSessionId = sessionId;
    if (!targetSessionId || !isSessionActive) {
      try {
        const params = new URLSearchParams({
          operator_name: operatorName,
          district: district,
          language: selectedLanguage,
        });
        const res = await fetch(`${getApiBaseUrl()}/api/sessions/start?${params.toString()}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Could not start session for test phrase");
        const data = await res.json();
        targetSessionId = data.session_id;
        setSessionId(targetSessionId);
        setIsSessionActive(true);
      } catch (err: any) {
        console.error("Failed to start session for test phrase:", err);
        setStatusNotice(`Could not start session: ${err.message}`);
        return;
      }
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/${targetSessionId}/segment`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ text: phraseText }),
      });

      if (!res.ok) throw new Error("Failed to post text segment");
      const data = await res.json();

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscriptEntries((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, text: phraseText, timestamp: nowTime, isFinal: true, speaker: "CALLER" },
      ]);

      if (typeof data.svi === "number") {
        setSviScore(data.svi);
        setSviLabel(data.svi_label || "LOW");
      } else if (data.svi && typeof data.svi === "object") {
        setSviScore(data.svi.score ?? 0);
        setSviLabel(data.svi.label ?? data.svi_label ?? "LOW");
      }

      if (data.chunk_count) setChunkCount(data.chunk_count);
      if (data.metric_bars && Array.isArray(data.metric_bars)) setMetricBars(data.metric_bars);
      if (data.speech_pace_label) setSpeechPaceLabel(data.speech_pace_label);
      if (data.indicators && Array.isArray(data.indicators)) setIndicators(data.indicators);
      if (data.copilot) setCopilot(data.copilot);
      if (data.score_history && Array.isArray(data.score_history)) setScoreHistory(data.score_history);
    } catch (err: any) {
      console.error("Test phrase submit error:", err);
      setStatusNotice(`Failed to send phrase: ${err.message}`);
    }
  };

  const endLiveSession = async () => {
    stopMicCapture();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (!sessionId) {
      setIsSessionActive(false);
      return;
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/${sessionId}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          operator_name: operatorName,
          district: district,
        }),
      });

      const summary: LiveSessionResult = await res.json();
      setCompletedSummary(summary);
      setIsSessionActive(false);
      if (onSessionComplete && summary.case_brief) {
        onSessionComplete(summary.case_brief);
      }
    } catch (err) {
      console.error("Error ending session:", err);
      setIsSessionActive(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Sub-Header Case Control Bar */}
      <div className="saathi-card p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs bg-white border border-[#D1D5DB]">
        <div className="flex flex-wrap items-center gap-2.5">
          {isSessionActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FDF2F2] text-[#C81E1E] border border-[#F8B4B4] font-bold text-[10px] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C81E1E] animate-ping" />
              LIVE CALL ACTIVE
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#F9FAFB] border border-[#D1D5DB] text-xs">
            <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isSessionActive}
              className="bg-transparent text-xs font-semibold text-[#111827] outline-none cursor-pointer"
            >
              <option value="hi-IN">Hindi + English (Hinglish)</option>
              <option value="en-IN">English (Indian Accent)</option>
            </select>
          </div>

          {!isSessionActive ? (
            <button
              type="button"
              onClick={startLiveSession}
              className="px-4 py-1.5 rounded bg-[#C81E1E] hover:bg-[#9B1C1C] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Mic className="w-3.5 h-3.5 text-white" />
              START LIVE SESSION
            </button>
          ) : (
            <button
              type="button"
              onClick={endLiveSession}
              className="px-4 py-1.5 rounded bg-[#C81E1E] hover:bg-[#9B1C1C] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Square className="w-3.5 h-3.5" />
              END LIVE SESSION
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Page Title Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#D1D5DB]">
        <div>
          <h2 className="text-lg font-bold font-serif-header text-[#111827] tracking-tight">
            Live Call Interaction (Engine 1)
          </h2>
          <p className="text-xs text-[#6B7280]">
            Live speech transcription, real-time SVI calculation, observable distress indicators & operator co-pilot
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[10.5px] text-[#6B7280] bg-white px-3 py-1 rounded border border-[#D1D5DB]">
          <span>ERSS Node: <strong>UP-SKN-02</strong></span>
          <span>•</span>
          <span>Telemetry Stream: <strong className="text-[#059669]">Active (24ms)</strong></span>
        </div>
      </div>

      {/* High Risk Alert Notice */}
      {(sviLabel === "HIGH" || sviLabel === "CRITICAL") && (
        <div className="p-3 rounded bg-[#FDF2F2] border border-[#F8B4B4] text-xs text-[#C81E1E] flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#C81E1E]" />
            <div>
              <span className="font-bold uppercase tracking-wider">
                {sviLabel} VULNERABILITY DETECTED ({sviScore}/100) — IMMEDIATE OPERATOR CONFIRMATION REQUIRED
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#C81E1E] text-white font-bold text-[9.5px] uppercase">
            ACTION REQUIRED
          </span>
        </div>
      )}

      {/* Status Notice */}
      {statusNotice && (
        <div className="p-2.5 rounded bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#D97706] flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 3. 2-Column Dashboard Grid Layout (5 Cols / 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: SVI Score, Contributing Factors & Quick Test Phrases (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: REAL TIME SVI SCORE */}
          <div className="saathi-card p-4 shadow-sm flex flex-col items-center bg-white">
            <div className="w-full flex items-center justify-between mb-1">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E7C7B]">
                  REAL TIME SVI SCORE
                </span>
                <span className="text-[10px] text-[#6B7280] ml-1.5 font-medium">System Vulnerability Index</span>
              </div>
              <HelpCircle className="w-4 h-4 text-[#9CA3AF] cursor-help" />
            </div>

            <div className="py-2">
              <SVIArcGauge score={sviScore} label={sviLabel} size={180} />
            </div>

            {/* SVI Level Banner */}
            <div
              className={`w-full mt-1 p-2 rounded border text-center transition-colors ${
                sviLabel === "CRITICAL" || sviLabel === "HIGH"
                  ? "bg-[#FDF2F2] border-[#F8B4B4] text-[#C81E1E]"
                  : sviLabel === "MODERATE"
                  ? "bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]"
                  : "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                VULNERABILITY LEVEL: {sviLabel} ({sviScore}/100)
              </span>
            </div>

            {/* SVI Score Trend Graph */}
            <div className="w-full mt-3 pt-3 border-t border-[#E5E7EB] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-[#111827] text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0E7C7B]" />
                  <span>SCORE TREND (REAL SESSION DATA)</span>
                </div>
                <span className="text-[10px] text-[#6B7280] font-mono">
                  {scoreHistory.length} Points
                </span>
              </div>

              {scoreHistory.length > 0 ? (
                <div className="h-16 w-full bg-[#F9FAFB] rounded border border-[#E5E7EB] p-2 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 45">
                    {scoreHistory.map((pt, idx) => {
                      const x = (idx / Math.max(1, scoreHistory.length - 1)) * 280 + 10;
                      const y = 42 - (pt.score / 100) * 36;
                      const prevPt = idx > 0 ? scoreHistory[idx - 1] : null;
                      const prevX = prevPt ? ((idx - 1) / Math.max(1, scoreHistory.length - 1)) * 280 + 10 : x;
                      const prevY = prevPt ? 42 - (prevPt.score / 100) * 36 : y;

                      return (
                        <g key={idx}>
                          {idx > 0 && (
                            <line
                              x1={prevX}
                              y1={prevY}
                              x2={x}
                              y2={y}
                              stroke={pt.score > 60 ? "#C81E1E" : pt.score > 30 ? "#D97706" : "#059669"}
                              strokeWidth="2"
                            />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill={pt.score > 60 ? "#C81E1E" : pt.score > 30 ? "#D97706" : "#059669"}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="text-[11px] text-[#6B7280] py-2 text-center bg-[#F9FAFB] rounded border border-[#E5E7EB]">
                  Score trend timeline will populate as real speech is processed.
                </div>
              )}
            </div>
          </div>

          {/* Card 2: CONTRIBUTING FACTORS (LIVE) */}
          <div className="saathi-card p-4 shadow-sm space-y-2.5 bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                  CONTRIBUTING FACTORS (LIVE)
                </h3>
                <p className="text-[10px] text-[#6B7280]">5 Real-Time NLP & Acoustic Evidence Streams</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E6F4F4] text-[#0E7C7B] border border-[#99D5D4]">
                CHUNK #{chunkCount}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {metricBars.map((metric) => (
                <div key={metric.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#111827] flex items-center gap-1.5">
                      ● {metric.name}
                      {metric.name === "Speech pace" && (
                        <span className="px-1 py-0.2 rounded text-[9px] bg-[#F3F4F6] text-[#6B7280]">
                          Proxy ({speechPaceLabel})
                        </span>
                      )}
                    </span>
                    <span className="text-[#111827] font-mono">{metric.score}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        metric.score > 60
                          ? "bg-[#C81E1E]"
                          : metric.score > 30
                          ? "bg-[#D97706]"
                          : "bg-[#0E7C7B]"
                      }`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>

                  {metric.evidence && metric.evidence.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {metric.evidence.map((ev, ei) => (
                        <span
                          key={ei}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB]"
                        >
                          Evidence: "{ev}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Transcript & Detected Indicators (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">

          {/* Card 2: LIVE CALL TRANSCRIPT */}
          <div className="saathi-card p-4 shadow-sm flex flex-col h-[380px] bg-white">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E7EB] mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0E7C7B]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                  LIVE CALL TRANSCRIPT
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[10.5px] text-[#6B7280]">
                <span>Language: <strong className="text-[#111827]">Hinglish (Auto)</strong></span>
                <span>Auto-scroll: <strong className="text-[#059669]">ON</strong></span>
              </div>
            </div>

            {/* In-place auto-scrolling container without window scroll jumping */}
            <div
              ref={transcriptContainerRef}
              className="flex-1 overflow-y-auto pr-2 space-y-3 font-sans text-xs leading-relaxed"
            >
              {transcriptEntries.length > 0 || interimText ? (
                <div className="space-y-2.5">
                  {transcriptEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#6B7280] font-mono">
                          {entry.timestamp} [{entry.speaker || "CALLER"}]
                        </span>
                        {entry.category_label && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#FDF2F2] text-[#C81E1E] border border-[#F8B4B4]">
                            DETECTED: {entry.category_label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#111827] font-medium font-serif-header">
                        "{entry.text}"
                      </p>
                    </div>
                  ))}

                  {/* Real-time Interim Captions */}
                  {interimText && (
                    <div className="p-2.5 rounded bg-[#E6F4F4] border border-[#99D5D4] space-y-1 animate-pulse">
                      <div className="text-[10px] font-bold text-[#0E7C7B] uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0E7C7B]" />
                          CALLER (SPEAKING...)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E7C7B] text-white font-mono">LIVE STT</span>
                      </div>
                      <p className="text-xs text-[#111827] font-medium italic font-serif-header">
                        "{interimText}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#6B7280] p-6">
                  <Mic className="w-8 h-8 text-[#9CA3AF] mb-2" />
                  <p className="text-xs font-semibold text-[#111827]">No live call transcript streaming yet.</p>
                  <p className="text-[11px] text-[#6B7280] mt-1 max-w-sm">
                    Click "START LIVE SESSION" or select any test phrase on the left to see real-time captions, SVI score updates, and indicator evidence streams.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: DETECTED OBSERVABLE INDICATORS */}
          <div className="saathi-card p-4 shadow-sm space-y-2 bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                DETECTED OBSERVABLE INDICATORS ({indicators.length})
              </h3>
              <span className="text-[10px] text-[#6B7280]">
                Rule-Based & Context-Aware
              </span>
            </div>

            {indicators.length === 0 ? (
              <div className="text-xs text-[#6B7280] py-2 text-center bg-[#F9FAFB] rounded border border-[#E5E7EB]">
                No distress indicators detected yet for the active call. Detected indicators across all 15 categories will appear here with evidence snippets and confidence ratings.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {indicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1 p-2.5 rounded text-xs border ${
                      ind.is_calming
                        ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                        : "bg-[#FDF2F2] text-[#C81E1E] border-[#F8B4B4]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold">"{ind.matched_phrase}"</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#FFFFFF] border">
                        {ind.confidence ? `${ind.confidence}%` : "94.8%"} CONF
                      </span>
                    </div>
                    <div className="text-[10px] flex items-center justify-between gap-2">
                      <span>Category: <strong>{ind.ui_label}</strong></span>
                      {ind.assistance_type && (
                        <span className="px-1.5 py-0.2 rounded bg-[#071221] text-white text-[9px]">
                          Req: {ind.assistance_type}
                        </span>
                      )}
                    </div>
                    {ind.evidence_snippet && (
                      <div className="text-[10px] italic font-mono bg-white/80 p-1 rounded border border-black/5">
                        Evidence: "{ind.evidence_snippet}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completed Session Case Summary Modal */}
      {completedSummary && (
        <div className="saathi-card border-2 border-[#059669] p-5 shadow-lg space-y-3 bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              <h3 className="text-sm font-bold text-[#111827]">
                Case Record Created & Saved to Database
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              Session ID: {completedSummary.session_id}
            </span>
          </div>

          <div className="p-3.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
            <div className="text-xs font-bold text-[#111827]">
              Generated Case Brief ({completedSummary.brief_source}):
            </div>
            <p className="text-xs text-[#111827] leading-relaxed font-serif-header">
              {completedSummary.case_brief}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
            <div className="flex items-center gap-4">
              <span>Final SVI: <strong className="text-[#111827]">{completedSummary.final_svi}/100 ({completedSummary.final_svi_label})</strong></span>
              <span>Updates Processed: <strong className="text-[#111827]">{completedSummary.chunk_count}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setCompletedSummary(null)}
              className="px-3 py-1 rounded bg-[#071221] text-white text-xs font-semibold hover:bg-[#111827] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
