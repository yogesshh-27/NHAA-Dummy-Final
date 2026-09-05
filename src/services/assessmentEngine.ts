// Dual-Stream Combined Assessment Engine (LLM-first, rule-based fallback)
import type { AcousticFeatures } from './audioEngine'
import { analyzeWithLLM } from './llmService'

export interface HiddenDistressResult {
  distress_level: 'LOW' | 'MEDIUM' | 'HIGH'
  content_indicators: string[]
  vocal_signals: {
    speech_rate_change: boolean
    increased_pauses: boolean
    pitch_variation: boolean
    voice_tremor?: boolean
  }
  urgency: 'low' | 'moderate' | 'high'
  support_recommended: boolean
  has_safety_concern: boolean
}

// Kept for backward compatibility with settings UI if referenced
export function getOpenAIApiKey(): string {
  return ''
}

export function saveOpenAIApiKey(_key: string): void {
  // No-op in rule-based mode
}

export class AssessmentEngine {
  async evaluateDualStream(
    fullTranscript: string,
    answers: Record<string | number, string>,
    acoustics: AcousticFeatures
  ): Promise<HiddenDistressResult> {
    // Try LLM-backed semantic analysis first
    const llm = await analyzeWithLLM(fullTranscript, answers, {
      speakingRate: acoustics?.speakingRate,
      pauseCount: acoustics?.pauseCount,
      pitchVariation: acoustics?.pitchVariation,
      voiceIntensity: acoustics?.voiceIntensity,
    })
    if (llm) return llm

    // Resilient local fallback
    return this.evaluateLocal(fullTranscript, answers, acoustics)
  }

  // Local Dual-Stream Rule Engine
  evaluateLocal(
    fullTranscript: string,
    answers: Record<string | number, string>,
    acoustics: AcousticFeatures
  ): HiddenDistressResult {
    const combinedText = (fullTranscript + ' ' + Object.values(answers).join(' ')).toLowerCase()

    // Multilingual & Hinglish Content Indicators
    const highRiskTerms = [
      'kill', 'suicide', 'die', 'murder', 'blood', 'weapon', 'mob', 'burn', 'lynch', 'arson', 'life',
      'marne', 'jaan', 'khatra', 'hathiyar', 'aag', 'himmat nahi'
    ]
    const violenceTerms = [
      'beat', 'attack', 'hit', 'assault', 'slap', 'injure', 'hospital', 'fracture', 'broken', 'wound',
      'maara', 'peeta', 'hamla', 'chot', 'hospital', 'khoon'
    ]
    const threatTerms = [
      'threat', 'threaten', 'scared', 'afraid', 'intimidate', 'harass', 'stalk', 'warn', 'police', 'fear',
      'darr', 'dhamki', 'pareshan', 'ghabrahat', 'chinta'
    ]
    const discriminationTerms = [
      'caste', 'untouchable', 'dalit', 'adivasi', 'boycott', 'temple', 'well', 'water', 'abused', 'insult', 'slur',
      'bhedbhav', 'chhuachhut', 'gaali', 'jaati'
    ]

    const contentIndicators: string[] = []
    let highRiskCount = 0
    let moderateRiskCount = 0

    highRiskTerms.forEach((term) => {
      if (combinedText.includes(term)) {
        highRiskCount++
        if (!contentIndicators.includes('safety_threat')) contentIndicators.push('safety_threat')
      }
    })

    violenceTerms.forEach((term) => {
      if (combinedText.includes(term)) {
        highRiskCount++
        if (!contentIndicators.includes('violence')) contentIndicators.push('violence')
      }
    })

    threatTerms.forEach((term) => {
      if (combinedText.includes(term)) {
        moderateRiskCount++
        if (!contentIndicators.includes('harassment')) contentIndicators.push('harassment')
        if (!contentIndicators.includes('fear')) contentIndicators.push('fear')
      }
    })

    discriminationTerms.forEach((term) => {
      if (combinedText.includes(term)) {
        moderateRiskCount++
        if (!contentIndicators.includes('discrimination')) contentIndicators.push('discrimination')
      }
    })

    // Vocal Signals Analysis from Web Audio API Stream
    const vocalSignals = {
      speech_rate_change: acoustics.speakingRate > 0 && (acoustics.speakingRate < 90 || acoustics.speakingRate > 150),
      increased_pauses: acoustics.pauseCount >= 3,
      pitch_variation: acoustics.pitchVariation,
      voice_tremor: acoustics.voiceIntensity === 'tremor',
    }

    let vocalDistressPoints = 0
    if (vocalSignals.increased_pauses) vocalDistressPoints += 1
    if (vocalSignals.speech_rate_change) vocalDistressPoints += 1
    if (vocalSignals.pitch_variation) vocalDistressPoints += 1
    if (vocalSignals.voice_tremor) vocalDistressPoints += 1

    // Classification Rule Synthesis
    let distressLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
    let urgency: 'low' | 'moderate' | 'high' = 'low'
    const hasSafetyConcern =
      highRiskCount >= 1 ||
      combinedText.includes('kill') ||
      combinedText.includes('suicide') ||
      combinedText.includes('jaan ka khatra')

    if (hasSafetyConcern || highRiskCount >= 2 || (moderateRiskCount >= 2 && vocalDistressPoints >= 2)) {
      distressLevel = 'HIGH'
      urgency = 'high'
    } else if (moderateRiskCount >= 1 || vocalDistressPoints >= 2 || combinedText.length > 50) {
      distressLevel = 'MEDIUM'
      urgency = 'moderate'
    } else {
      distressLevel = 'LOW'
      urgency = 'low'
    }

    return {
      distress_level: distressLevel,
      content_indicators: contentIndicators.length > 0 ? contentIndicators : ['mild_worry'],
      vocal_signals: vocalSignals,
      urgency,
      support_recommended: distressLevel !== 'LOW',
      has_safety_concern: hasSafetyConcern,
    }
  }
}

export const assessmentEngine = new AssessmentEngine()
