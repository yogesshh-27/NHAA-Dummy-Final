// LLM Service: thin browser wrapper around the NHAA backend proxy
// Backend holds the OPENROUTER_API_KEY and routes requests to OpenRouter.
// Endpoints used:
//   POST /api/analyze -> semantic distress classification
//   POST /api/chat    -> trauma-informed counsellor reply

import type { HiddenDistressResult } from './assessmentEngine'

export interface ChatTurn {
  role: 'user' | 'counsellor' | 'assistant' | 'system'
  content: string
}

const SAFETY_KEYWORDS = [
  'kill', 'suicide', 'die', 'murder', 'weapon', 'attack', 'bomb', 'blood',
  'jaan', 'khatra', 'marne', 'hathiyar', 'hamla', 'khoon', 'maut', 'jala',
  'kutte', 'goli', 'chaku', 'kaanp', 'jane', 'dhamki', 'maar', 'peet',
]

const EMERGENCY_REPLY =
  'Your immediate safety is our highest priority. If you or your loved ones are facing imminent physical danger right now, please reach out to local police or our toll-free 24x7 emergency helpline at 14566 immediately. We can connect you to emergency protection and an emergency nodal officer.'

export function isEmergencyInput(text: string): boolean {
  const lower = text.toLowerCase()
  return SAFETY_KEYWORDS.some((k) => lower.includes(k))
}

export async function analyzeWithLLM(
  fullTranscript: string,
  answers: Record<string | number, string>,
  acoustics: {
    speakingRate?: number
    pauseCount?: number
    pitchVariation?: boolean
    voiceIntensity?: string
  },
): Promise<HiddenDistressResult | null> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullTranscript, answers, acoustics }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data || typeof data !== 'object') return null
    return {
      distress_level: data.distress_level ?? 'LOW',
      content_indicators: Array.isArray(data.content_indicators) ? data.content_indicators : [],
      vocal_signals: {
        speech_rate_change: Boolean(data.vocal_signals?.speech_rate_change),
        increased_pauses: Boolean(data.vocal_signals?.increased_pauses),
        pitch_variation: Boolean(data.vocal_signals?.pitch_variation),
        voice_tremor: Boolean(data.vocal_signals?.voice_tremor),
      },
      urgency: data.urgency ?? 'low',
      support_recommended: Boolean(data.support_recommended),
      has_safety_concern: Boolean(data.has_safety_concern),
    }
  } catch (err) {
    console.warn('LLM analyze failed:', err)
    return null
  }
}

export async function chatWithLLM(
  history: ChatTurn[],
  userText: string,
): Promise<string | null> {
  if (isEmergencyInput(userText)) {
    return EMERGENCY_REPLY
  }
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: history.map(({ role, content }) => ({
          role: role === 'counsellor' ? 'assistant' : role,
          content,
        })),
        user_text: userText,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data?.reply ?? data?.counsellor_message?.text ?? '').toString() || null
  } catch (err) {
    console.warn('LLM chat failed:', err)
    return null
  }
}

export const llmService = { analyzeWithLLM, chatWithLLM, isEmergencyInput }