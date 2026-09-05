import React, { useState, useEffect } from 'react'
import {
  HeartPulse,
  Wind,
  ShieldAlert,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  RefreshCw,
  UserCheck,
} from 'lucide-react'
import type { HiddenDistressResult } from '../../services/assessmentEngine'

interface SupportRoutingProps {
  result: HiddenDistressResult
  anonymousId: string
  onOpenChat: () => void
  onRetake: () => void
}

export const SupportRoutingView: React.FC<SupportRoutingProps> = ({
  result,
  anonymousId,
  onOpenChat,
  onRetake,
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')
  const [breathCount, setBreathCount] = useState(4)
  const [queueCountdown, setQueueCountdown] = useState(45) // simulated queue timer
  const [isQueueConnecting, setIsQueueConnecting] = useState(false)

  // Guided breathing timer for LOW distress
  useEffect(() => {
    if (result.distress_level !== 'LOW') return
    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold'
            if (currentPhase === 'Hold') return 'Exhale'
            return 'Inhale'
          })
          return 4
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [result.distress_level])

  // Counsellor matching countdown for MEDIUM / HIGH
  useEffect(() => {
    if (result.distress_level === 'LOW') return
    const timer = setInterval(() => {
      setQueueCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsQueueConnecting(true)
          setTimeout(() => {
            onOpenChat()
          }, 1500)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [result.distress_level, onOpenChat])

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      
      {/* Assessment Principle Banner (Section 12 requirement) */}
      <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3 shadow-2xs">
        <Sparkles className="w-5 h-5 text-[#003366] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-900">
            Assessment Observation Summary:
          </p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            The assessment identified indicators of distress based on combined speech content and supporting vocal characteristics. This is an indicative support assessment, not a clinical diagnosis or legal determination.
          </p>
        </div>
      </div>

      {/* Safety Alert if Immediate Danger Detected (Section 10 Requirement) */}
      {result.has_safety_concern && (
        <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-6 shadow-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-red-950">
                Urgent Safety & Immediate Threat Pathway Activated
              </h3>
              <p className="text-xs text-red-800">
                If you are currently facing physical harm or immediate violence, do not wait for the chat queue.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="tel:14566"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Toll-Free 14566 (24x7 Emergency)</span>
            </a>
            <a
              href="/register-rescue"
              className="px-5 py-2.5 bg-white border border-red-300 text-red-800 hover:bg-red-50 font-bold text-xs rounded-xl"
            >
              Trigger Rapid Police Rescue →
            </a>
          </div>
        </div>
      )}

      {/* ===================== LOW DISTRESS PATHWAY ===================== */}
      {result.distress_level === 'LOW' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Mindfulness, Grounding & Self-Help Resources
                </h3>
                <p className="text-xs text-slate-500">
                  Your responses indicate mild or manageable stress levels at this moment.
                </p>
              </div>
            </div>

            {/* Interactive Guided Breathing Exercise */}
            <div className="bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-200 rounded-3xl p-8 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
                <Wind className="w-4 h-4 text-blue-700" />
                <span>Interactive Calming Breath</span>
              </div>

              {/* Animated Breath Circle */}
              <div className="w-36 h-36 mx-auto rounded-full bg-blue-100 border-4 border-blue-400/60 flex flex-col items-center justify-center text-[#003366] shadow-md transition-all duration-1000 transform scale-105">
                <span className="text-xl font-black">{breathPhase}</span>
                <span className="text-2xl font-mono font-extrabold mt-0.5">{breathCount}s</span>
              </div>

              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Follow the rhythm: Inhale slowly for 4 seconds, gently hold, and breathe out completely.
              </p>
            </div>

            {/* Grounding 5-4-3-2-1 Technique */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  <span>5-4-3-2-1 Sensory Grounding</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 pl-2">
                  <li>• Acknowledge <strong>5 things</strong> you see around you</li>
                  <li>• Acknowledge <strong>4 things</strong> you can physically touch</li>
                  <li>• Acknowledge <strong>3 things</strong> you hear in the room</li>
                  <li>• Acknowledge <strong>2 things</strong> you can smell</li>
                  <li>• Acknowledge <strong>1 positive thing</strong> about yourself</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-700" />
                  <span>Available Support Resources</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No counsellor assignment is mandatory for this tier, but our helpline and trained officers remain fully available if you ever wish to discuss any incident.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:underline"
                  >
                    <span>Request Optional Counsellor Chat Anyway →</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== MEDIUM DISTRESS PATHWAY ===================== */}
      {result.distress_level === 'MEDIUM' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
              Moderate Distress Support Pathway
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#00274d] mt-2">
              A trained support professional may be able to help you talk through this.
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Connecting you with our specialized psychological and grievance assistance network.
            </p>
          </div>

          {/* Matching Queue Box matching Section 10 */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 text-[#003366] flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-800" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Finding an available counsellor...
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Anonymous ID: <strong className="text-blue-900">{anonymousId}</strong>
              </p>
              <p className="text-xs font-semibold text-blue-800">
                {isQueueConnecting ? 'Connecting you to support now...' : `Estimated wait time: ~${queueCountdown}s`}
              </p>
            </div>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#003366] transition-all duration-1000"
                style={{ width: `${((45 - queueCountdown) / 45) * 100}%` }}
              />
            </div>

            {/* Instant Connect Fast-Forward button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenChat}
                className="px-6 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Anonymous Chat Immediately →</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ===================== HIGH DISTRESS PATHWAY ===================== */}
      {result.distress_level === 'HIGH' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 uppercase tracking-wide">
              Priority Support Pathway
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#00274d] mt-2">
              A trained professional has been prioritized to support you.
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Your reported experiences indicate elevated emotional pressure. You have been placed at the front of the queue.
            </p>
          </div>

          {/* Priority Matching Box matching Section 10 */}
          <div className="bg-red-50/50 border border-red-200 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <UserCheck className="w-7 h-7 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                Priority Support
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Finding an experienced support professional...
              </h4>
              <p className="text-xs text-slate-600 font-mono">
                Anonymous ID: <strong className="text-red-900">{anonymousId}</strong>
              </p>
            </div>

            {/* Instant Chat CTA */}
            <div className="pt-3">
              <button
                type="button"
                onClick={onOpenChat}
                className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-bold shadow-md inline-flex items-center gap-2 cursor-pointer animate-pulse"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect with Priority Support Officer (C-104) →</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Retake / Exit row */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
        <button
          type="button"
          onClick={onRetake}
          className="text-slate-600 hover:text-slate-900 font-semibold"
        >
          ← Retake Assessment
        </button>

        <span className="text-slate-400 font-mono">
          Session ID: {anonymousId}
        </span>
      </div>

    </div>
  )
}
