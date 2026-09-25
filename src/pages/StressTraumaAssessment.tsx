// StressTraumaAssessment.tsx
// Simplified orchestrator: LANDING → CONVERSATION
// The CONVERSATION stage uses ConversationalAssessment which handles
// assessment + counsellor chat internally in one unified chat interface.
// Enforces that citizen MUST be logged in first before giving the test.

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Brain, ArrowLeft, Shield } from 'lucide-react'
import { AssessmentLanding } from '../components/assessment/AssessmentLanding'
import { ReturningUserModal } from '../components/assessment/ReturningUserModal'
import { ConsentModal } from '../components/assessment/ConsentModal'
import { LoginRequiredModal } from '../components/assessment/LoginRequiredModal'
import { AIAssessmentWindow, type AssessmentLang } from '../components/assessment/AIAssessmentWindow'
import { CounsellorChatbot } from '../components/assessment/CounsellorChatbot'
import { subscribeToAuthState } from '../services/authService'
import type { User as FirebaseUser } from 'firebase/auth'

export const StressTraumaAssessment: React.FC = () => {
  type Stage = 'LANDING' | 'ASSESSMENT' | 'COUNSELLOR'
  const [stage, setStage] = useState<Stage>('LANDING')

  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginActionReason, setLoginActionReason] = useState('give the assessment')

  // Modals
  const [isReturningUserModalOpen, setIsReturningUserModalOpen] = useState(false)
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)

  // Session identifiers
  const [anonymousId, setAnonymousId] = useState('')
  const [counsellorId, setCounsellorId] = useState('C-104')
  const [selectedLang, setSelectedLang] = useState<AssessmentLang>('hinglish')
  const [distressLevel, setDistressLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})

  // Subscribe to real-time auth changes
  useEffect(() => {
    const unsub = subscribeToAuthState((user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
    })
    return () => unsub()
  }, [])

  // Guard: if user logs out while in test or tries to enter stage without login
  useEffect(() => {
    if (!isAuthLoading && !currentUser && stage !== 'LANDING') {
      setStage('LANDING')
      setLoginActionReason('give the assessment')
      setIsLoginModalOpen(true)
    }
  }, [currentUser, isAuthLoading, stage])

  // Helper to trigger login modal
  const triggerLoginRequirement = (reason: string = 'give the assessment') => {
    setLoginActionReason(reason)
    setIsLoginModalOpen(true)
  }

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
    if (!currentUser) {
      triggerLoginRequirement('start a new assessment')
      return
    }
    generateIds()
    setStage('ASSESSMENT')
  }

  // "Text Only" button on landing
  const handleStartText = () => {
    if (!currentUser) {
      triggerLoginRequirement('start the text assessment')
      return
    }
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
    if (!currentUser) {
      triggerLoginRequirement('access previous assessment records')
      return
    }
    setAnonymousId(userData.anonymousId)
    setCounsellorId(userData.counsellorId)
    setIsReturningUserModalOpen(true)
  }

  // ── Handlers from ReturningUserModal ──────────────────────────────────

  const handleContinueChat = () => {
    if (!currentUser) {
      setIsReturningUserModalOpen(false)
      triggerLoginRequirement('continue your counselor conversation')
      return
    }
    setIsReturningUserModalOpen(false)
    setStage('COUNSELLOR')
  }

  const handleTakeNewAssessment = () => {
    if (!currentUser) {
      setIsReturningUserModalOpen(false)
      triggerLoginRequirement('take a new assessment')
      return
    }
    setIsReturningUserModalOpen(false)
    setIsConsentModalOpen(true)
  }

  // ── Handlers from ConsentModal ────────────────────────────────────────

  const handleAgreeVoice = () => {
    if (!currentUser) {
      setIsConsentModalOpen(false)
      triggerLoginRequirement('start the voice assessment')
      return
    }
    setIsConsentModalOpen(false)
    setStage('ASSESSMENT')
  }

  const handleChooseText = () => {
    if (!currentUser) {
      setIsConsentModalOpen(false)
      triggerLoginRequirement('start the text assessment')
      return
    }
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

    // Store record in localStorage linked to anonymousId and user
    try {
      const record = {
        anonymousId,
        counsellorId: data.counsellorId,
        hasPreviousChat: true,
        userEmail: currentUser?.email,
        result: data,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(`NHAA_USER_${anonymousId}`, JSON.stringify(record))
    } catch {
      // ignore storage errors
    }

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
          currentUser={currentUser}
          isAuthLoading={isAuthLoading}
          onRequireLogin={triggerLoginRequirement}
        />
      )}

      {/* ── AI ASSESSMENT EXAMINATION WINDOW ── */}
      {stage === 'ASSESSMENT' && currentUser && (
        <AIAssessmentWindow
          anonymousId={anonymousId || 'ST-GUEST'}
          initialLang={selectedLang}
          onComplete={handleAssessmentComplete}
          onBackToLanding={() => setStage('LANDING')}
        />
      )}

      {/* ── COUNSELLOR CHATBOT (TAILORED SUGGESTIONS) ── */}
      {stage === 'COUNSELLOR' && currentUser && (
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

      {/* ── Login Required Modal ── */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectPath="/stress-trauma-assessment"
        actionAttempted={loginActionReason}
      />
    </div>
  )
}
