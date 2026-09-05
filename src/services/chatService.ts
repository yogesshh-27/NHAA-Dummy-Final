// Anonymous Counsellor Chat Service (LLM-first, rule-based fallback)
import { chatWithLLM, isEmergencyInput } from './llmService'

export interface ChatMessage {
  id: string
  sender: 'counsellor' | 'user'
  text: string
  timestamp: string
}

export class ChatService {
  private messages: ChatMessage[] = []

  initConversation(anonymousId: string, counsellorId = 'C-104', distressLevel = 'MEDIUM'): ChatMessage[] {
    const greetingText =
      distressLevel === 'HIGH'
        ? `Hello. I am Counsellor ${counsellorId}. I am here to support you in complete safety and confidence. Your Anonymous ID is ${anonymousId}. Take your time—what would you like to share?`
        : `Hello. I am Counsellor ${counsellorId}. I'm here to listen without judgment. Your Anonymous ID is ${anonymousId}. How would you like to begin?`

    const initialMsg: ChatMessage = {
      id: 'msg-1',
      sender: 'counsellor',
      text: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    this.messages = [initialMsg]
    return this.messages
  }

  getMessages(): ChatMessage[] {
    return this.messages
  }

  setMessages(msgs: ChatMessage[]): void {
    this.messages = msgs
  }

  async sendMessage(userText: string): Promise<ChatMessage> {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    this.messages.push(userMsg)

    // Emergency safety override (instant helpline redirect)
    if (isEmergencyInput(userText)) {
      const reply = 'Your immediate safety is our highest priority. If you or your loved ones are facing imminent physical danger right now, please reach out to local police or our toll-free 24x7 emergency helpline at 14566 immediately. We can connect you to emergency protection and an emergency nodal officer.'
      const counsellorMsg: ChatMessage = {
        id: `counsellor-${Date.now()}`,
        sender: 'counsellor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      this.messages.push(counsellorMsg)
      return counsellorMsg
    }

    // Build history for the LLM (greeting + everything said so far)
    const history: { role: 'user' | 'assistant' | 'system'; content: string }[] = this.messages.map((m) => ({
      role: m.sender === 'counsellor' ? 'assistant' : 'user',
      content: m.text,
    }))

    // LLM-backed reply, fall back to local rule if it errors
    const llmReply = await chatWithLLM(history, userText)
    const replyText = llmReply ?? this.getLocalCounsellorReply(userText)

    // Tiny natural delay so it doesn't feel robotic when LLM is fast
    await new Promise((res) => setTimeout(res, 300))

    const counsellorMsg: ChatMessage = {
      id: `counsellor-${Date.now()}`,
      sender: 'counsellor',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    this.messages.push(counsellorMsg)
    return counsellorMsg
  }

  // Resilient keyword fallback if the backend LLM is unreachable
  private getLocalCounsellorReply(input: string): string {
    const text = input.toLowerCase()

    // 1. Immediate Safety & Emergency Danger
    if (
      text.includes('kill') ||
      text.includes('suicide') ||
      text.includes('die') ||
      text.includes('weapon') ||
      text.includes('attack') ||
      text.includes('jaan') ||
      text.includes('khatra') ||
      text.includes('marne')
    ) {
      return 'Your immediate safety is our highest priority. If you or your loved ones are facing imminent physical danger right now, please reach out to local police or our toll-free 24x7 emergency helpline at 14566 immediately. We can connect you to emergency protection and an emergency nodal officer.'
    }

    // 2. Police, Legal, FIR, Atrocity Act Rights
    if (
      text.includes('police') ||
      text.includes('fir') ||
      text.includes('complaint') ||
      text.includes('court') ||
      text.includes('lawyer') ||
      text.includes('legal') ||
      text.includes('daroga') ||
      text.includes('thana')
    ) {
      return 'I hear you. Dealing with the police or filing a complaint can feel deeply overwhelming. Under the PoA (Prevention of Atrocities) Act, you are entitled to free legal aid, zero-FIR registration, and a dedicated Nodal Officer to oversee your grievance. Are you in a secure space to talk about whether an FIR has already been registered?'
    }

    // 3. Caste Discrimination, Boycott, Social Atrocities
    if (
      text.includes('caste') ||
      text.includes('dalit') ||
      text.includes('adivasi') ||
      text.includes('boycott') ||
      text.includes('water') ||
      text.includes('temple') ||
      text.includes('slur') ||
      text.includes('gaali') ||
      text.includes('chhuachhut') ||
      text.includes('bhedbhav')
    ) {
      return 'No one deserves to be subjected to discrimination, exclusion, or verbal abuse. Such actions are serious violations under the law. We are here to support your dignity and ensure protective measures are activated. Please know you have the right to live with total respect and security.'
    }

    // 4. Fear, Threats, Panic, Trembling
    if (
      text.includes('afraid') ||
      text.includes('scared') ||
      text.includes('threat') ||
      text.includes('fear') ||
      text.includes('panic') ||
      text.includes('darr') ||
      text.includes('dhamki') ||
      text.includes('ghabrahat')
    ) {
      return "It is completely understandable to feel scared and on edge after what you have experienced. Let's take a slow, gentle breath together. You do not have to carry this burden by yourself. Our counsellors and legal support desk are standing beside you."
    }

    // 5. Physical Symptoms, Sleep, Headaches, Exhaustion
    if (
      text.includes('sleep') ||
      text.includes('neend') ||
      text.includes('tired') ||
      text.includes('stress') ||
      text.includes('headache') ||
      text.includes('pain') ||
      text.includes('eating') ||
      text.includes('dard')
    ) {
      return 'Trauma and continuous tension take a heavy physical toll on sleep, appetite, and body energy. Please give yourself permission to rest. Would you like to practice a brief grounding exercise, or would you prefer to tell me more about how you are managing today?'
    }

    // 6. Default Empathetic Trauma-Informed Listening
    return 'Thank you for sharing that with me. I am listening attentively and without judgment. Take as much time as you need—how are you coping right now, and what kind of support or advice would feel most comforting for you today?'
  }
}

export const chatService = new ChatService()
