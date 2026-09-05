import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export interface AnonymousUser {
  anonymous_id: string
  created_at: string
  last_active_at: string
}

export interface AssessmentRecord {
  assessment_id: string
  anonymous_id: string
  status: 'in_progress' | 'completed'
  language_pref: 'en' | 'hi' | 'hinglish'
  mode: 'voice' | 'text'
  responses: Record<string, { answer: string; timestamp: string }>
  distress_level: 'LOW' | 'MEDIUM' | 'HIGH' | null
  counsellor_assigned: string | null
  created_at: string
  completed_at: string | null
}

export interface ChatMessage {
  id: string
  sender: 'counsellor' | 'user'
  text: string
  timestamp: string
}

export interface ChatSessionRecord {
  session_id: string
  assessment_id: string
  anonymous_id: string
  counsellor_id: string
  messages: ChatMessage[]
  created_at: string
}

interface DatabaseSchema {
  users: Record<string, AnonymousUser>
  assessments: Record<string, AssessmentRecord>
  chatSessions: Record<string, ChatSessionRecord>
}

// Persistent JSON storage file (use /tmp on Vercel serverless)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'nhaa_database.json')
  : path.join(__dirname, 'nhaa_database.json')

class Database {
  private data: DatabaseSchema = {
    users: {},
    assessments: {},
    chatSessions: {},
  }

  constructor() {
    this.load()
    this.seedDemoDataIfEmpty()
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8')
        this.data = JSON.parse(raw)
      }
    } catch (err) {
      console.warn('DB load failed, using clean store:', err)
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (err) {
      console.warn('DB save failed:', err)
    }
  }

  private seedDemoDataIfEmpty() {
    // Seed example returning user ST-82K7P4 from prompt specification
    if (!this.data.users['ST-82K7P4']) {
      const demoId = 'ST-82K7P4'
      const demoAsm = 'ASM-10482'
      const demoSession = 'CHAT-82K7P4'

      this.data.users[demoId] = {
        anonymous_id: demoId,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        last_active_at: new Date().toISOString(),
      }

      this.data.assessments[demoAsm] = {
        assessment_id: demoAsm,
        anonymous_id: demoId,
        status: 'completed',
        language_pref: 'hinglish',
        mode: 'voice',
        responses: {
          Q1: { answer: 'Mere college mein kaafi discrimination face karna pad raha hai.', timestamp: new Date(Date.now() - 86400000).toISOString() },
          Q2: { answer: 'Main properly sleep nahi kar pa raha hoon because of anxiety.', timestamp: new Date(Date.now() - 86400000).toISOString() },
        },
        distress_level: 'MEDIUM',
        counsellor_assigned: 'C-104',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86400000).toISOString(),
      }

      this.data.chatSessions[demoSession] = {
        session_id: demoSession,
        assessment_id: demoAsm,
        anonymous_id: demoId,
        counsellor_id: 'C-104',
        messages: [
          {
            id: 'msg-seed-1',
            sender: 'counsellor',
            text: "Hello. I'm Counsellor C-104. I'm here to listen. How would you like to begin?",
            timestamp: 'Yesterday, 14:15',
          },
          {
            id: 'msg-seed-2',
            sender: 'user',
            text: 'I want to talk about what happened at my village well and college hostel.',
            timestamp: 'Yesterday, 14:16',
          },
          {
            id: 'msg-seed-3',
            sender: 'counsellor',
            text: 'Thank you for sharing that with me. What you faced was wrong, and you deserve safety and dignity. We are here to support you step by step.',
            timestamp: 'Yesterday, 14:18',
          },
        ],
        created_at: new Date(Date.now() - 86400000).toISOString(),
      }

      this.save()
    }
  }

  // Create or retrieve Anonymous User
  createUser(anonymousId: string): AnonymousUser {
    if (!this.data.users[anonymousId]) {
      this.data.users[anonymousId] = {
        anonymous_id: anonymousId,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      }
      this.save()
    }
    return this.data.users[anonymousId]
  }

  getUser(anonymousId: string): AnonymousUser | null {
    return this.data.users[anonymousId] || null
  }

  // Create New Assessment for User
  createAssessment(assessmentId: string, anonymousId: string, lang: 'en' | 'hi' | 'hinglish', mode: 'voice' | 'text'): AssessmentRecord {
    this.createUser(anonymousId)
    const rec: AssessmentRecord = {
      assessment_id: assessmentId,
      anonymous_id: anonymousId,
      status: 'in_progress',
      language_pref: lang,
      mode,
      responses: {},
      distress_level: null,
      counsellor_assigned: null,
      created_at: new Date().toISOString(),
      completed_at: null,
    }
    this.data.assessments[assessmentId] = rec
    this.save()
    return rec
  }

  getAssessment(assessmentId: string): AssessmentRecord | null {
    return this.data.assessments[assessmentId] || null
  }

  getUserAssessments(anonymousId: string): AssessmentRecord[] {
    return Object.values(this.data.assessments)
      .filter(a => a.anonymous_id === anonymousId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  updateAssessment(assessmentId: string, updates: Partial<AssessmentRecord>): AssessmentRecord | null {
    const asm = this.data.assessments[assessmentId]
    if (!asm) return null
    Object.assign(asm, updates)
    this.save()
    return asm
  }

  // Chat Session Management
  getOrCreateChatSession(assessmentId: string, anonymousId: string, counsellorId = 'C-104'): ChatSessionRecord {
    const existing = Object.values(this.data.chatSessions).find(
      s => s.assessment_id === assessmentId || s.anonymous_id === anonymousId
    )
    if (existing) return existing

    const sessionId = `CHAT-${anonymousId}-${Date.now().toString().slice(-4)}`
    const session: ChatSessionRecord = {
      session_id: sessionId,
      assessment_id: assessmentId,
      anonymous_id: anonymousId,
      counsellor_id: counsellorId,
      messages: [
        {
          id: 'msg-init-1',
          sender: 'counsellor',
          text: `Hello. I am Counsellor ${counsellorId}. I'm here to listen without judgment. How would you like to begin?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      created_at: new Date().toISOString(),
    }
    this.data.chatSessions[sessionId] = session
    this.save()
    return session
  }

  getChatSessionForUser(anonymousId: string): ChatSessionRecord | null {
    return (
      Object.values(this.data.chatSessions)
        .filter(s => s.anonymous_id === anonymousId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null
    )
  }

  addChatMessage(sessionId: string, sender: 'counsellor' | 'user', text: string): ChatMessage | null {
    const session = this.data.chatSessions[sessionId]
    if (!session) return null
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    session.messages.push(msg)
    this.save()
    return msg
  }
}

export const db = new Database()
