// StressTraumaAssessment.tsx
// Simplified orchestrator: LANDING → CONVERSATION
// The CONVERSATION stage uses ConversationalAssessment which handles
// assessment + counsellor chat internally in one unified chat interface.

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, ArrowLeft, Shield } from 'lucide-react'
import { AssessmentLanding } from '../components/assessment/AssessmentLanding'
import { ReturningUserModal } from '../components/assessment/ReturningUserModal'
import { ConsentModal } from '../components/assessment/ConsentModal'
import { AIAssessmentWindow, type AssessmentLang } from '../components/assessment/AIAssessmentWindow'
import { CounsellorChatbot } from '../components/assessment/CounsellorChatbot'

export const StressTraumaAssessment: React.FC = () => {
  type Stage = 'LANDING' | 'ASSESSMENT' | 'COUNSELLOR'
  const [stage, setStage] = useState<Stage>('LANDING')

  // Modals
  const [isReturningUserModalOpen, setIsReturningUserModalOpen] = useState(false)
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)

  // Session identifiers
  const [anonymousId, setAnonymousId] = useState('')
  const [counsellorId, setCounsellorId] = useState('C-104')
  const [selectedLang, setSelectedLang] = useState<AssessmentLang>('hinglish')
  const [distressLevel, setDistressLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})

  // ── ID generation ─────────────────────────────────────────────────────

  const generateIds = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let id = 'ST-'
    for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
    setAnonymousId(id)
    return id
  }

  // ── Handlers from AssessmentLanding ──────────────────────────────────

  // "Start Assessment" button on landing
  const handleStartNew = () => {
    generateIds()
    setStage('ASSESSMENT')
  }

  // "Text Only" button on landing
  const handleStartText = () => {
    if (!anonymousId) generateIds()
    setStage('ASSESSMENT')
  }

  // Returning user ID entered
  const handleReturningUserFound = (userData: {
    anonymousId: string
    counsellorId: string
    hasPreviousChat: boolean
    chatSession: any
    previousAssessment: any
  }) => {
    setAnonymousId(userData.anonymousId)
    setCounsellorId(userData.counsellorId)
    setIsReturningUserModalOpen(true)
  }

  // ── Handlers from ReturningUserModal ──────────────────────────────────

  const handleContinueChat = () => {
    setIsReturningUserModalOpen(false)
    setStage('COUNSELLOR')
  }

  const handleTakeNewAssessment = () => {
    setIsReturningUserModalOpen(false)
    setIsConsentModalOpen(true)
  }

  // ── Handlers from ConsentModal ────────────────────────────────────────

  const handleAgreeVoice = () => {
    setIsConsentModalOpen(false)
    setStage('ASSESSMENT')
  }

  const handleChooseText = () => {
    setIsConsentModalOpen(false)
    setStage('ASSESSMENT')
  }

  // ── Assessment Completion ────────────────────────────────────────────

  const handleAssessmentComplete = (data: {
    answers: Record<string, string>
    distressLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    language: AssessmentLang
    counsellorId: string
    indicators: string[]
  }) => {
    setAssessmentAnswers(data.answers)
    setDistressLevel(data.distressLevel)
    setCounsellorId(data.counsellorId)
    setSelectedLang(data.language)
    setStage('COUNSELLOR')
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          Back to Dashboard
        </Link>

        {anonymousId && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-700">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            {anonymousId}
          </div>
        )}
      </div>

      {/* ── Page Header ── */}
      <div className="border-b border-slate-200 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E5EFF9] flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-[#003366]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00274d] tracking-tight">
            Stress &amp; Trauma Assessment
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Confidential AI-driven psychological and grievance support
          </p>
        </div>
      </div>

      {/* ── LANDING ── */}
      {stage === 'LANDING' && (
        <AssessmentLanding
          onStartNew={handleStartNew}
          onStartText={handleStartText}
          onReturningUserFound={handleReturningUserFound}
        />
      )}

      {/* ── AI ASSESSMENT EXAMINATION WINDOW ── */}
      {stage === 'ASSESSMENT' && (
        <AIAssessmentWindow
          anonymousId={anonymousId || 'ST-GUEST'}
          initialLang={selectedLang}
          onComplete={handleAssessmentComplete}
          onBackToLanding={() => setStage('LANDING')}
        />
      )}

      {/* ── COUNSELLOR CHATBOT (TAILORED SUGGESTIONS) ── */}
      {stage === 'COUNSELLOR' && (
        <CounsellorChatbot
          anonymousId={anonymousId || 'ST-GUEST'}
          counsellorId={counsellorId}
          distressLevel={distressLevel}
          language={selectedLang}
          assessmentAnswers={assessmentAnswers}
          onBackToAssessment={() => setStage('ASSESSMENT')}
          onExit={() => setStage('LANDING')}
        />
      )}

      {/* ── Modals ── */}
      <ReturningUserModal
        isOpen={isReturningUserModalOpen}
        anonymousId={anonymousId}
        counsellorId={counsellorId}
        onContinueChat={handleContinueChat}
        onTakeNewAssessment={handleTakeNewAssessment}
        onClose={() => setIsReturningUserModalOpen(false)}
      />

      <ConsentModal
        isOpen={isConsentModalOpen}
        anonymousId={anonymousId}
        onAgreeVoice={handleAgreeVoice}
        onChooseText={handleChooseText}
        onCancel={() => setIsConsentModalOpen(false)}
      />
    </div>
  )
}
