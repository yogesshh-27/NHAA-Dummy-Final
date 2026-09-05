import React, { useState } from 'react'
import {
  Activity,
  Brain,
  Headphones,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { AIAssessmentWindow, type AssessmentLang } from './AIAssessmentWindow'
import { CounsellorChatbot } from './CounsellorChatbot'

interface AdminSaathiConsoleProps {
  initialCaseUrn?: string
  initialVictimName?: string
  onBackToQueue: () => void
}

export const AdminSaathiConsole: React.FC<AdminSaathiConsoleProps> = ({
  initialCaseUrn = 'NHAA-LIVE-INTAKE-' + Math.floor(1000 + Math.random() * 9000),
  initialVictimName = 'Live Citizen Intake',
  onBackToQueue,
}) => {
  const [activeStage, setActiveStage] = useState<'assessment' | 'counsellor' | 'diagnostics'>('assessment')
  const [anonymousId, setAnonymousId] = useState<string>(() => 'ST-' + Math.random().toString(36).substring(2, 8).toUpperCase())
  const [selectedLang, setSelectedLang] = useState<AssessmentLang>('hinglish')
  const [assessmentResult, setAssessmentResult] = useState<{
    answers: Record<string, string>
    distressLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    language: AssessmentLang
    counsellorId: string
    indicators: string[]
  } | null>(null)

  const handleAssessmentComplete = (data: {
    answers: Record<string, string>
    distressLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    language: AssessmentLang
    counsellorId: string
    indicators: string[]
  }) => {
    setAssessmentResult(data)
    setActiveStage('counsellor')
  }

  const handleResetSession = () => {
    const newId = 'ST-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setAnonymousId(newId)
    setAssessmentResult(null)
    setActiveStage('assessment')
  }

  return (
    <div className="space-y-6">
      {/* Officer Console Navigation & Header Strip */}
      <div className="bg-[#0b1f36] text-white rounded-lg p-4 sm:p-5 border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-300">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-white">
                SAATHI-AI Live Intake & Triage Console
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                Dual-Engine AI Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Human-in-the-Loop decision support, trilingual speech intake, calibrated SVI scoring, and real-time de-escalation co-pilot.
            </p>
          </div>
        </div>

        {/* Case & Session Meta Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Case Reference</span>
            <span className="font-mono font-bold text-amber-300">{initialCaseUrn}</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Caller Session ID</span>
            <span className="font-mono font-bold text-blue-300">{anonymousId}</span>
          </div>

          <button
            type="button"
            onClick={handleResetSession}
            title="Start New Live Intake Session"
            className="inline-flex items-center gap-1 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Mode / Stage Switcher Bar */}
      <div className="bg-white border border-slate-300 rounded-md p-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveStage('assessment')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeStage === 'assessment'
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>1. Live Speech Intake & SVI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStage('counsellor')}
            disabled={!assessmentResult}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeStage === 'counsellor'
                ? 'bg-blue-800 text-white shadow-2xs'
                : assessmentResult
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. AI Counsellor Co-Pilot</span>
            {assessmentResult && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                Ready
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveStage('diagnostics')}
            disabled={!assessmentResult}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeStage === 'diagnostics'
                ? 'bg-blue-800 text-white shadow-2xs'
                : assessmentResult
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>3. Officer Diagnostic Dossier</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Language Stream:</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as AssessmentLang)}
            className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="hinglish">Hinglish (Default)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
          </select>

          <button
            type="button"
            onClick={onBackToQueue}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 hover:bg-slate-100 rounded transition-colors"
          >
            ← Return to Triage Queue
          </button>
        </div>
      </div>

      {/* Main Active Stage Rendering */}
      {activeStage === 'assessment' && (
        <div className="bg-white rounded-lg border border-slate-300 p-3 sm:p-5 shadow-xs">
          <div className="mb-4 bg-blue-50/70 border border-blue-200 rounded p-3 text-xs text-blue-900 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Intake Guidance:</strong> Caller: <em>{initialVictimName}</em>. AI Engine 1 will speak questions aloud, listen for speech responses, compute acoustic vocal tremor/rate, and extract risk indicators.
              </span>
            </div>
            <span className="text-[11px] font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              Engine 1 & 2 Synchronized
            </span>
          </div>

          <AIAssessmentWindow
            anonymousId={anonymousId}
            initialLang={selectedLang}
            onComplete={handleAssessmentComplete}
            onBackToLanding={onBackToQueue}
          />
        </div>
      )}

      {activeStage === 'counsellor' && assessmentResult && (
        <div className="bg-white rounded-lg border border-slate-300 p-3 sm:p-5 shadow-xs space-y-4">
          <div className="bg-slate-900 text-white p-3 rounded flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Assigned Nodal Specialist:</strong> {assessmentResult.counsellorId} | Distress Evaluation:{' '}
                <span
                  className={`font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${
                    assessmentResult.distressLevel === 'HIGH'
                      ? 'bg-red-600 text-white'
                      : assessmentResult.distressLevel === 'MEDIUM'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {assessmentResult.distressLevel}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveStage('diagnostics')}
              className="text-xs text-blue-200 hover:text-white underline font-semibold"
            >
              View Full Clinical Dossier →
            </button>
          </div>

          <CounsellorChatbot
            anonymousId={anonymousId}
            counsellorId={assessmentResult.counsellorId}
            distressLevel={assessmentResult.distressLevel}
            language={assessmentResult.language}
            assessmentAnswers={assessmentResult.answers}
            onBackToAssessment={() => setActiveStage('assessment')}
          />
        </div>
      )}

      {activeStage === 'diagnostics' && assessmentResult && (
        <div className="bg-white rounded-lg border border-slate-300 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                SAATHI-AI Clinical & Risk Assessment Dossier
              </h2>
              <p className="text-xs text-slate-500">
                Generated from live audio telemetry, semantic parsing, and SVI scoring engine.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase ${
                assessmentResult.distressLevel === 'HIGH'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : assessmentResult.distressLevel === 'MEDIUM'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              Risk Level: {assessmentResult.distressLevel}
            </span>
          </div>

          {/* Indicators Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Detected Indicators</span>
              <div className="mt-2 flex flex-wrap gap-1">
                {assessmentResult.indicators && assessmentResult.indicators.length > 0 ? (
                  assessmentResult.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[10px] uppercase font-mono"
                    >
                      {ind}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No severe critical threats triggered</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Recommended Action</span>
              <p className="text-xs text-slate-800 font-semibold mt-1">
                {assessmentResult.distressLevel === 'HIGH'
                  ? 'Immediate Nodal Officer Dispatch & Priority Legal Assistance'
                  : assessmentResult.distressLevel === 'MEDIUM'
                  ? 'Follow-up Call & Psychological First Aid Assistance'
                  : 'Routine Case Logging & Information Provision'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Assigned Specialist</span>
              <p className="text-xs text-slate-900 font-bold font-mono mt-1">
                {assessmentResult.counsellorId}
              </p>
              <span className="text-[10px] text-slate-500">Atrocities Trauma Specialist</span>
            </div>
          </div>

          {/* Citizen Recorded Responses */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Recorded Speech Responses (Engine 1 Transcriptions)
            </h3>
            <div className="space-y-3">
              {Object.entries(assessmentResult.answers).map(([qid, ans]) => (
                <div key={qid} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                  <div className="font-bold text-blue-950 flex items-center justify-between mb-1">
                    <span>Question {qid}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Audio Verified</span>
                  </div>
                  <p className="text-slate-800 font-medium">{ans || 'No response recorded'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveStage('counsellor')}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open AI Counsellor Co-Pilot Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
