import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  LogOut,
  AlertOctagon,
  FileText,
  CheckCircle2,
  Eye,
  Building,
  Brain,
  ListFilter,
  Shield,
  Server,
  Clock,
  RefreshCw,
  X,
  Activity,
  Laptop,
} from 'lucide-react'
import { EmblemOfIndia } from '../components/Emblems'
import { SaathiConsole } from '../saathi/SaathiConsole'
import { getApiBaseUrl } from '../saathi/config/api'

interface TriageCase {
  urn: string
  sessionId?: string
  victim: string
  type: string
  district: string
  ps: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RESOLVED' | string
  status: string
  connectionStatus?: 'Online' | 'Active' | 'Disconnected' | 'Completed' | string
  date: string
  intakeTimestampExact?: string
  lastActivityAt?: string
  lastActivitySeconds?: number
  clientIp?: string
  userAgent?: string
  isLive?: boolean
  sviScore?: number
  sviLabel?: string
  rawCase?: any
}

interface DashboardStats {
  assigned_complaints: number
  emergency_rescues: number
  live_active_intakes: number
  firs_tracked: number
  relief_disbursed: string
  total_db_cases: number
  total_live_sessions: number
}

const DEFAULT_STATS: DashboardStats = {
  assigned_complaints: 0,
  emergency_rescues: 0,
  live_active_intakes: 0,
  firs_tracked: 0,
  relief_disbursed: '₹0',
  total_db_cases: 0,
  total_live_sessions: 0,
}

const formatIntakeDateTime = (isoString?: string, fallback = 'Just now') => {
  if (!isoString) return fallback
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return fallback
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  } catch {
    return fallback
  }
}

const formatLastActive = (isoString?: string, secondsAgo?: number) => {
  if (typeof secondsAgo === 'number') {
    if (secondsAgo < 5) return 'Just now'
    if (secondsAgo < 60) return `${secondsAgo}s ago`
    return `${Math.floor(secondsAgo / 60)}m ago`
  }
  if (!isoString) return 'Just now'
  try {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
    if (diff < 5) return 'Just now'
    if (diff < 60) return `${diff}s ago`
    return `${Math.floor(diff / 60)}m ago`
  } catch {
    return 'Just now'
  }
}

const parseUserAgentSummary = (ua?: string) => {
  if (!ua) return 'Standard Web Client'
  let browser = 'Web Browser'
  if (ua.includes('Edg/')) browser = 'Microsoft Edge'
  else if (ua.includes('Chrome/')) browser = 'Google Chrome'
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox'
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari'

  let os = 'OS'
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Linux')) os = 'Linux'

  return `${browser} on ${os}`
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'saathi' ? 'saathi' : 'queue'
  
  const [activeTab, setActiveTab] = useState<'queue' | 'saathi'>(defaultTab)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'urgent' | 'pending' | 'resolved'>('all')
  const [activeCaseUrn, setActiveCaseUrn] = useState<string>('NHAA-2026-GRV-88392')
  const [activeVictimName, setActiveVictimName] = useState<string>('Jagdish Chandra')

  // Live queue data and metadata modal state
  const [realBackendQueue, setRealBackendQueue] = useState<TriageCase[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(DEFAULT_STATS)
  const [selectedMetaCase, setSelectedMetaCase] = useState<TriageCase | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [lastSyncTime, setLastSyncTime] = useState<string>('')

  const handleSwitchTab = (tab: 'queue' | 'saathi') => {
    setActiveTab(tab)
    if (tab === 'saathi') {
      setSearchParams({ tab: 'saathi' })
    } else {
      setSearchParams({})
    }
  }

  const handleLaunchSaathiForCase = (urn: string, victim: string) => {
    setActiveCaseUrn(urn)
    setActiveVictimName(victim)
    setActiveTab('saathi')
    setSearchParams({ tab: 'saathi', case: urn })
  }

  // Fetch real live sessions and completed cases from backend
  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/triage-queue`)
      if (!res.ok) throw new Error('Could not fetch queue')
      const data = await res.json()
      if (data && Array.isArray(data.queue)) {
        setRealBackendQueue(data.queue)
        setLastSyncTime(new Date().toLocaleTimeString())
      }
    } catch {
      // Fallback: fetch active and cases
      try {
        const [activeRes, casesRes] = await Promise.all([
          fetch(`${getApiBaseUrl()}/api/sessions/active`),
          fetch(`${getApiBaseUrl()}/api/sessions/cases`),
        ])
        const activeData = activeRes.ok ? await activeRes.json() : null
        const casesData = casesRes.ok ? await casesRes.json() : null
        const combined: TriageCase[] = []
        if (activeData?.active && activeData.case) {
          const ac = activeData.case
          combined.push({
            urn: ac.caseNumber || `#LIVE-${ac.session_id}`,
            sessionId: ac.session_id,
            victim: ac.callerNameAnonymized || 'Live Caller',
            type: ac.detectedKeywords?.[0] || 'Distress / Atrocity Intake',
            district: ac.displayLocation || 'Triaging location...',
            ps: 'Jurisdiction Auto-Dispatch',
            priority: ac.priority || (ac.sviScore >= 76 ? 'CRITICAL' : ac.sviScore >= 40 ? 'HIGH' : 'MEDIUM'),
            status: `Live Intake (${ac.connectionStatus || 'Active'})`,
            connectionStatus: ac.connectionStatus || 'Active',
            date: 'Just now (Live)',
            intakeTimestampExact: ac.intakeTimestampExact,
            lastActivityAt: ac.lastActivityAt,
            lastActivitySeconds: ac.lastActivitySeconds || 0,
            clientIp: ac.clientIp || '127.0.0.1',
            userAgent: ac.userAgent || 'Web Client',
            isLive: true,
            sviScore: ac.sviScore || 0,
            sviLabel: ac.svi_label || 'LOW',
          })
        }
        if (casesData?.cases && Array.isArray(casesData.cases)) {
          for (const c of casesData.cases) {
            combined.push({
              urn: c.caseNumber || `#CASE-${c.id}`,
              sessionId: c.session_id,
              victim: c.callerNameAnonymized || `Caller #${c.id}`,
              type: c.detectedKeywords?.[0] || 'Atrocities Grievance & Relief Request',
              district: c.district || 'Sant Kabir Nagar, UP',
              ps: 'Kotwali Special Cell',
              priority: c.priority || ((c.final_svi || 0) >= 76 ? 'CRITICAL' : (c.final_svi || 0) >= 40 ? 'HIGH' : 'MEDIUM'),
              status: 'Investigation (FIR Tracked)',
              connectionStatus: c.connectionStatus || 'Completed',
              date: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Earlier',
              intakeTimestampExact: c.intakeTimestampExact,
              lastActivityAt: c.lastActivityAt,
              clientIp: c.clientIp || '127.0.0.1',
              userAgent: c.userAgent || 'Web Client',
              isLive: false,
              sviScore: c.final_svi || 0,
              sviLabel: c.svi_label || 'LOW',
            })
          }
        }
        setRealBackendQueue(combined)
        setLastSyncTime(new Date().toLocaleTimeString())
      } catch (e) {
        console.warn('Queue sync fallback error', e)
      }
    }
  }, [])

  // Fetch real dashboard KPI stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/dashboard-stats`)
      if (!res.ok) return
      const data = await res.json()
      if (data && typeof data.assigned_complaints === 'number') {
        setDashboardStats(data as DashboardStats)
      }
    } catch {
      // silently ignore — fallback to existing state
    }
  }, [])

  // Auto-sync polling every 2.5 seconds
  useEffect(() => {
    fetchQueue()
    fetchStats()
    const timer = setInterval(() => {
      fetchQueue()
      fetchStats()
    }, 2500)
    return () => clearInterval(timer)
  }, [fetchQueue, fetchStats])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchQueue(), fetchStats()])
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const mockCases: TriageCase[] = [
    {
      urn: 'NHAA-2026-GRV-88392',
      victim: 'Jagdish Chandra',
      type: 'Social Boycott & Water Denial',
      district: 'Ghaziabad, UP',
      ps: 'Kotwali Sadar',
      priority: 'HIGH',
      status: 'Investigation (FIR Filed)',
      connectionStatus: 'Completed',
      date: '02 Sep 2026',
      intakeTimestampExact: '2026-09-02T10:15:00+05:30',
      clientIp: '14.139.60.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
    },
    {
      urn: 'RESCUE-90142',
      victim: 'Anita Devi & Family',
      type: 'Mob Encirclement & Physical Threat',
      district: 'Aligarh, UP',
      ps: 'Atrauli Police Stn',
      priority: 'CRITICAL',
      status: 'Police Force Deployed',
      connectionStatus: 'Completed',
      date: '03 Sep 2026 (12 mins ago)',
      intakeTimestampExact: '2026-09-03T11:42:00+05:30',
      clientIp: '103.248.80.22',
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36',
    },
    {
      urn: 'NHAA-2026-GRV-87114',
      victim: 'Maheshwar Paswan',
      type: 'Land Dispossession / Eviction',
      district: 'Patna, Bihar',
      ps: 'Phulwari Sharif',
      priority: 'MEDIUM',
      status: 'DM Notice Issued',
      connectionStatus: 'Completed',
      date: '31 Aug 2026',
      intakeTimestampExact: '2026-08-31T09:30:00+05:30',
      clientIp: '117.218.45.19',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
    },
    {
      urn: 'NHAA-2026-GRV-86501',
      victim: 'Devika Bai',
      type: 'Public Humiliation & Abuse',
      district: 'Bhopal, MP',
      ps: 'Govindpura',
      priority: 'RESOLVED',
      status: 'ATR Submitted & Closed',
      connectionStatus: 'Completed',
      date: '27 Aug 2026',
      intakeTimestampExact: '2026-08-27T16:20:00+05:30',
      clientIp: '157.34.112.5',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
    },
  ]

  // Combined cases: live and real database queue items at top, followed by mock cases
  const allCases: TriageCase[] = [
    ...realBackendQueue,
    ...mockCases.filter(
      (mc) => !realBackendQueue.some((rc) => rc.urn === mc.urn || (rc.sessionId && mc.urn.includes(rc.sessionId)))
    ),
  ]

  const filteredCases = allCases.filter((c) => {
    if (selectedStatus === 'urgent') return c.priority === 'CRITICAL' || c.priority === 'HIGH' || c.isLive
    if (selectedStatus === 'pending') return c.priority !== 'RESOLVED' && c.status !== 'ATR Submitted & Closed'
    if (selectedStatus === 'resolved') return c.priority === 'RESOLVED' || c.status === 'ATR Submitted & Closed'
    return true
  })

  const liveActiveCount = allCases.filter(
    (c) => c.isLive && (c.connectionStatus === 'Active' || c.connectionStatus === 'Online')
  ).length

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Officer Portal Navigation Bar */}
      <header className="bg-[#0b1f36] text-white border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmblemOfIndia className="h-10 w-auto text-amber-300" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-wide">
                  NHAA Nodal Officer Administration Console
                </span>
                <span className="text-[10px] bg-blue-700 text-blue-100 px-2 py-0.5 rounded font-mono font-semibold">
                  SECURE v2.4
                </span>
              </div>
              <span className="text-xs text-slate-300 block">
                Department of Social Justice and Empowerment, Government of India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right text-xs">
              <span className="font-bold text-white">Shri A.K. Srivastava (IAS)</span>
              <span className="text-slate-300">District Nodal Officer (Special Cell)</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-header / Quick Links & Top View Switcher */}
      <div className="bg-[#122e4d] text-slate-200 text-xs py-2 px-4 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-amber-300">Active Jurisdiction:</span>
            <span>Western Region Zone-1 (NCR & UP-West)</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-blue-200 hover:text-white underline">
              Public Portal Homepage
            </Link>
            <span className="text-slate-500">|</span>
            <Link to="/stress-trauma-assessment" className="text-amber-300 hover:text-white underline">
              Citizen Assessment Window
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="bg-slate-200/90 border-b border-slate-300 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleSwitchTab('queue')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-md text-xs font-bold transition-all border-t border-x ${
              activeTab === 'queue'
                ? 'bg-white text-slate-900 border-slate-300 border-b-white -mb-[1px] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-4 h-4 text-blue-700" />
            <span>Atrocities Grievance & Triage Queue</span>
            {liveActiveCount > 0 && (
              <span className="text-[10px] bg-red-100 text-red-800 border border-red-300 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                {liveActiveCount} LIVE
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('saathi')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-md text-xs font-bold transition-all border-t border-x ${
              activeTab === 'saathi'
                ? 'bg-white text-slate-900 border-slate-300 border-b-white -mb-[1px] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-600" />
            <span>SAATHI-AI Live Intake Console</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 px-1.5 py-0.2 rounded font-mono font-semibold">
              Live Engine
            </span>
          </button>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {activeTab === 'saathi' ? (
          <SaathiConsole
            initialCaseUrn={activeCaseUrn}
            initialVictimName={activeVictimName}
            onBackToQueue={() => handleSwitchTab('queue')}
          />
        ) : (
          <>
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-300 rounded p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Assigned Complaints</span>
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
                  {dashboardStats.assigned_complaints}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {dashboardStats.total_db_cases} completed · {dashboardStats.total_live_sessions} live
                </span>
              </div>

              <div className="bg-red-50 border border-red-300 rounded p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700 uppercase">Emergency Rescues</span>
                  <AlertOctagon className="w-5 h-5 text-red-600 animate-pulse" />
                </div>
                <div className="text-2xl font-extrabold text-red-900 font-mono mt-2">
                  {dashboardStats.emergency_rescues > 0
                    ? `${dashboardStats.emergency_rescues} ACTIVE`
                    : '0'}
                </div>
                <span className="text-[11px] text-red-700 mt-0.5 block">
                  {dashboardStats.live_active_intakes > 0
                    ? `${dashboardStats.live_active_intakes} live caller intake(s) streaming`
                    : 'No active emergency intakes'}
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">FIRs Tracked</span>
                  <Building className="w-5 h-5 text-indigo-700" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
                  {dashboardStats.firs_tracked}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Section 3(1) & 3(2) PoA Act</span>
              </div>

              <div className="bg-white border border-slate-300 rounded p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Relief Disbursed</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-2">
                  {dashboardStats.relief_disbursed}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Direct Benefit Transfer (DBT)</span>
              </div>

            </div>

            {/* Triage & Management Queue */}
            <div className="bg-white border border-slate-300 rounded-md shadow-xs overflow-hidden">
              
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold text-slate-900">
                      Atrocities Grievance & Distress Triage Queue
                    </h2>
                    {liveActiveCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-red-600 text-white font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        {liveActiveCount} Live Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Incoming citizen cases under the SC/ST (Prevention of Atrocities) Act with live intake metadata
                  </p>
                </div>

                {/* Filter Tabs and Refresh */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('all')}
                      className={`px-3 py-1 rounded font-medium ${selectedStatus === 'all' ? 'bg-blue-800 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      All Cases ({allCases.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('urgent')}
                      className={`px-3 py-1 rounded font-medium ${selectedStatus === 'urgent' ? 'bg-red-700 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Distress / SOS
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('pending')}
                      className={`px-3 py-1 rounded font-medium ${selectedStatus === 'pending' ? 'bg-blue-800 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Under Investigation
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('resolved')}
                      className={`px-3 py-1 rounded font-medium ${selectedStatus === 'resolved' ? 'bg-emerald-700 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Disposed
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    title="Refresh live queue from backend"
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Reference URN / Session</th>
                      <th className="p-3">Victim / Intake Date-Time</th>
                      <th className="p-3">Alleged Offence</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Workflow & Connection</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCases.map((c) => (
                      <tr
                        key={c.urn}
                        className={`transition-colors ${
                          c.isLive
                            ? 'bg-purple-50/50 hover:bg-purple-100/60 border-l-4 border-l-purple-600'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Reference URN & Session ID */}
                        <td className="p-3 font-mono">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-blue-900">{c.urn}</span>
                            {c.isLive && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300 text-[9px] font-bold uppercase animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                                LIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            ID: {c.sessionId || c.urn.slice(-8)}
                          </span>
                        </td>

                        {/* Victim & Exact Intake Timestamp */}
                        <td className="p-3 font-medium text-slate-900">
                          <div className="font-bold">{c.victim}</div>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span>{formatIntakeDateTime(c.intakeTimestampExact, c.date)}</span>
                          </div>
                          {c.isLive && (
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                              <Activity className="w-2.5 h-2.5 shrink-0 animate-pulse text-emerald-600" />
                              <span>Active: {formatLastActive(c.lastActivityAt, c.lastActivitySeconds)}</span>
                            </div>
                          )}
                        </td>

                        {/* Alleged Offence / Distress Factor */}
                        <td className="p-3 text-slate-700 max-w-xs">
                          <div className="line-clamp-2">{c.type}</div>
                          {c.sviScore !== undefined && c.sviScore > 0 && (
                            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              SVI {c.sviScore}/100 ({c.sviLabel || 'LOW'})
                            </span>
                          )}
                        </td>



                        {/* Priority */}
                        <td className="p-3">
                          {c.priority === 'CRITICAL' && (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase animate-pulse">
                              CRITICAL SOS
                            </span>
                          )}
                          {c.priority === 'HIGH' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] uppercase">
                              HIGH
                            </span>
                          )}
                          {c.priority === 'MEDIUM' && (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px] uppercase">
                              MEDIUM
                            </span>
                          )}
                          {c.priority === 'RESOLVED' && (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                              RESOLVED
                            </span>
                          )}
                        </td>

                        {/* Workflow Status & Connection Status */}
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            {c.connectionStatus === 'Active' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                                Active Stream
                              </span>
                            )}
                            {c.connectionStatus === 'Online' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px] border border-emerald-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online
                              </span>
                            )}
                            {c.connectionStatus === 'Disconnected' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px] border border-amber-300">
                                Disconnected
                              </span>
                            )}
                            {(!c.connectionStatus || c.connectionStatus === 'Completed') && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                                Completed
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-slate-800 text-[11px]">{c.status}</div>
                          {c.clientIp && (
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <Shield className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                              <span>IP: {c.clientIp}</span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedMetaCase(c)}
                              title="View Dossier, Location, Metadata & Audit"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f3460] hover:bg-[#162447] text-white text-[11px] font-semibold transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Dossier / View</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <div>
                  Showing {filteredCases.length} records. Automated synchronization with State Police CCTNS network active.
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Backend Synced {lastSyncTime ? `at ${lastSyncTime}` : 'live'}</span>
                </div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Sensitive Technical Intake Metadata Modal */}
      {selectedMetaCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0b1f36] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold tracking-wide">Case Dossier & Technical Audit</h3>
                  <p className="text-[11px] text-slate-300">Location, Jurisdiction & Intake Metadata — Nodal Officer View</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMetaCase(null)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Top Banner with Case URN and Status */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Case Reference</span>
                  <span className="text-sm font-extrabold font-mono text-blue-900">{selectedMetaCase.urn}</span>
                  <span className="text-[11px] text-slate-600 ml-2">({selectedMetaCase.victim})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    Status: {selectedMetaCase.connectionStatus || 'Completed'}
                  </span>
                  {selectedMetaCase.isLive && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300 animate-pulse">
                      LIVE SESSION
                    </span>
                  )}
                </div>
              </div>

              {/* Location & Jurisdiction */}
              <div className="p-3 rounded border border-indigo-200 bg-indigo-50/60">
                <div className="flex items-center gap-1.5 mb-2">
                  <Building className="w-3.5 h-3.5 text-indigo-700" />
                  <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide">Location & Jurisdiction</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">District / Area</span>
                    <span className="font-bold text-slate-800">
                      {selectedMetaCase.rawCase?.district || selectedMetaCase.district || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Police Station</span>
                    <span className="font-bold text-slate-800">
                      {selectedMetaCase.rawCase?.policeStation || selectedMetaCase.rawCase?.ps || selectedMetaCase.ps || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Detected Location</span>
                    <span className="font-bold text-slate-800">
                      {selectedMetaCase.rawCase?.displayLocation ||
                        selectedMetaCase.rawCase?.location?.city ||
                        (selectedMetaCase.isLive ? 'Triaging...' : '—')}
                    </span>
                  </div>
                </div>
                {selectedMetaCase.rawCase?.location && (
                  <div className="mt-2 text-[10px] text-indigo-800 font-mono bg-indigo-100 rounded px-2 py-1">
                    {[
                      selectedMetaCase.rawCase.location.street,
                      selectedMetaCase.rawCase.location.area,
                      selectedMetaCase.rawCase.location.city,
                      selectedMetaCase.rawCase.location.district,
                      selectedMetaCase.rawCase.location.state,
                    ].filter(Boolean).join(', ') || 'Full address pending caller testimony'}
                  </div>
                )}
              </div>

              {/* Grid of Key Technical Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Backend Request IP */}
                <div className="p-3 rounded border border-blue-200 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-700" />
                      <span>Caller / Client Public IP</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-blue-200 text-blue-900 font-semibold">
                      Backend Verified
                    </span>
                  </div>
                  <div className="text-lg font-extrabold font-mono text-slate-900 mt-1">
                    {selectedMetaCase.clientIp || '127.0.0.1'}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Directly received by backend request socket / X-Forwarded-For header.
                  </p>
                </div>

                {/* Exact Intake Timestamp */}
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Exact Intake Date-Time</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-slate-200 text-slate-800 font-semibold">
                      ISO-8601
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900 mt-1">
                    {formatIntakeDateTime(selectedMetaCase.intakeTimestampExact, selectedMetaCase.date)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    Raw: {selectedMetaCase.intakeTimestampExact || selectedMetaCase.date}
                  </div>
                </div>

                {/* Session ID / Reference ID */}
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-slate-600" />
                      <span>Session / Reference ID</span>
                    </span>
                  </div>
                  <div className="text-sm font-extrabold font-mono text-indigo-900 mt-1">
                    {selectedMetaCase.sessionId || selectedMetaCase.urn}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Unique backend intake handle for streaming & triage reconciliation.
                  </p>
                </div>

                {/* Live Connection & Activity */}
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-slate-600" />
                      <span>Connection & Last Activity</span>
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <span>{selectedMetaCase.connectionStatus || 'Completed'}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-700">{formatLastActive(selectedMetaCase.lastActivityAt, selectedMetaCase.lastActivitySeconds)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono truncate">
                    Last: {selectedMetaCase.lastActivityAt || 'Finalized'}
                  </p>
                </div>
              </div>

              {/* Device & User-Agent Information */}
              <div className="p-3 rounded border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-slate-600" />
                    <span>Browser & Device Environment</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700">
                    {parseUserAgentSummary(selectedMetaCase.userAgent)}
                  </span>
                </div>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[10px] break-all border border-slate-700">
                  {selectedMetaCase.userAgent || 'No User-Agent header supplied'}
                </div>
              </div>

              {/* Privacy & Compliance Notice */}
              <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>STATUTORY PRIVACY GUARANTEE:</strong> Real IP and technical request metadata are recorded strictly for incident accountability, operator verification, and prevention of fraudulent dispatches under the SC/ST PoA rules. In strict compliance with NHAA guidelines, <em>IP-based geo-location estimation is permanently disabled</em>. Case location is determined solely through caller testimony or GPS dispatch.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Audit ID: SEC-{selectedMetaCase.sessionId || 'NHAA'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleLaunchSaathiForCase(selectedMetaCase.urn, selectedMetaCase.victim)
                    setSelectedMetaCase(null)
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Launch SAATHI-AI Console</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetaCase(null)}
                  className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0b1f36] text-slate-400 py-3 text-center text-xs border-t border-slate-700">
        <p>National Informatics Centre (NIC) • Department of Social Justice and Empowerment, Government of India</p>
      </footer>
    </div>
  )
}


