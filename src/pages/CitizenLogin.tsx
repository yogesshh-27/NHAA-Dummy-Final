import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, User,
  Shield, ChevronRight, AlertCircle, CheckCircle2, Phone,
  HeartHandshake, Scale,
} from 'lucide-react'
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
  subscribeToAuthState,
  AuthError,
} from '../services/authService'
import { EmblemOfIndia } from '../components/Emblems'

type AuthMode = 'login' | 'register' | 'forgot'

// Official Google "G" colour icon
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export const CitizenLogin: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'

  const [mode, setMode] = useState<AuthMode>('login')
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [aadhaarLast4, setAadhaarLast4] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Real-time auth state listener — if logged in, redirect straight to redirectUrl
  useEffect(() => {
    const unsub = subscribeToAuthState((user) => {
      if (user) {
        navigate(redirectUrl, { replace: true })
      }
    })
    return () => unsub()
  }, [navigate, redirectUrl])

  const reset = () => { setSuccessMsg(''); setErrorMsg('') }

  const handleAuthError = (err: unknown) => {
    if (err instanceof AuthError) {
      setErrorMsg(err.message)
    } else {
      setErrorMsg('An unexpected error occurred. Please try again.')
    }
  }

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    reset()
    try {
      await signInWithGoogle()
      navigate(redirectUrl, { replace: true })
    } catch (err) {
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Email / Password Sign-In ────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    reset()
    try {
      await signInWithEmail(email, password)
      navigate(redirectUrl, { replace: true })
    } catch (err) {
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Register ────────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !mobile) {
      setErrorMsg('Please fill all required fields.')
      return
    }
    setIsLoading(true)
    reset()
    try {
      await registerWithEmail(email, password, name)
      navigate(redirectUrl, { replace: true })
    } catch (err) {
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Forgot Password ─────────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) { setErrorMsg('Please enter your registered email.'); return }
    setIsLoading(true)
    reset()
    try {
      await resetPassword(forgotEmail)
      setSuccessMsg(`Password reset email sent to ${forgotEmail}. Please check your inbox.`)
    } catch (err) {
      handleAuthError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Login / Register / Forgot UI ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans antialiased flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-100">

      {/* ── Top Bar with Return link & Ministry branding ── */}
      <header className="w-full bg-[#00274d] text-white py-2 px-4 sm:px-6 lg:px-10 shadow-xs z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider uppercase text-[11px] sm:text-xs">GOVERNMENT OF INDIA</span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-blue-100 text-[11px] sm:text-xs hidden sm:inline">Ministry of Social Justice &amp; Empowerment</span>
          </div>
          <Link to="/" className="text-blue-200 hover:text-white flex items-center gap-1.5 font-medium transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Public Portal</span>
          </Link>
        </div>
      </header>

      {/* ── Main Dual-Column Content (Full width & balanced on Laptops / Desktops) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center z-10">
        
        {/* ──── LEFT SIDE: Citizen Guidance, Government Trust & Support Features (Desktop/Laptop) ──── */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6 lg:space-y-7">
          
          {/* Official Emblem + Ministry Header */}
          <div className="flex items-center gap-3.5">
            <EmblemOfIndia className="h-16 sm:h-20 w-auto text-slate-800 flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-[13px] sm:text-sm font-semibold text-slate-800 leading-tight">
                भारत सरकार
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase leading-tight">
                GOVERNMENT OF INDIA
              </span>
              <span className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5">
                Department of Social Justice and Empowerment • SAMAVESH
              </span>
            </div>
          </div>

          {/* Kicker & Main Title */}
          <div className="space-y-2 pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#003366] text-[11px] font-bold tracking-wider uppercase">
              <Shield className="w-3 h-3 text-[#003366]" />
              CITIZEN SUPPORT &amp; EMPOWERMENT PORTAL
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-[42px] font-black text-[#00274d] tracking-tight leading-[1.15]">
              National Helpline<br />
              Against Atrocities<br />
              <span className="text-[#003366] font-extrabold">(NHAA - 14566)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl pt-1">
              Confidential digital gateway for citizens to file grievances, undergo guided stress and trauma evaluations, access legal aid, and track relief compensation under the SC/ST (Prevention of Atrocities) Act.
            </p>
          </div>

          {/* 3 Citizen Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            
            {/* 1. Psychological & Trauma Aid */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Trauma &amp; Counseling
              </h2>
              <p className="text-[11px] text-slate-500 leading-snug">
                AI-guided assessment and direct connection to certified psychologists.
              </p>
            </div>

            {/* 2. 24x7 Emergency Grievance */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                100% Confidential
              </h2>
              <p className="text-[11px] text-slate-500 leading-snug">
                End-to-end encryption protects your identity and testimony.
              </p>
            </div>

            {/* 3. Statutory Relief Monitoring */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                PoA Legal Aid
              </h2>
              <p className="text-[11px] text-slate-500 leading-snug">
                Fast-track FIR follow-up, legal assistance, and government ATR tracking.
              </p>
            </div>

          </div>

          {/* 24x7 Helpline Direct Callout Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-[#003366] to-[#0f3460] text-white flex items-center justify-between gap-4 shadow-sm max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Phone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">
                  In Urgent Danger or Crisis?
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  Call National Helpline: <span className="text-amber-300 font-black text-base">14566</span> (Toll-Free 24x7)
                </div>
              </div>
            </div>
            <a
              href="tel:14566"
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              Call Now
            </a>
          </div>

          {/* Tricolor Slogan Divider */}
          <div className="flex items-center gap-3 pt-1 max-w-lg">
            <div className="h-[2px] w-12 sm:w-16 bg-[#ff9933] rounded-full" />
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
              Together for an inclusive and protected society
            </span>
            <div className="h-[2px] w-12 sm:w-16 bg-[#138808] rounded-full" />
          </div>

          {/* Silhouette Artwork */}
          <div className="pt-1 max-w-md hidden sm:block opacity-60 pointer-events-none select-none">
            <svg
              viewBox="0 0 500 120"
              className="w-full h-auto text-slate-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="0" y="112" width="500" height="2" fill="#94a3b8" />
              <rect x="30" y="106" width="440" height="6" fill="#cbd5e1" />
              <rect x="50" y="100" width="400" height="6" fill="#cbd5e1" />
              
              <rect x="60" y="70" width="140" height="30" fill="#e2e8f0" />
              <rect x="60" y="66" width="140" height="4" fill="#cbd5e1" />
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={`col-l-${i}`} x={65 + i * 11} y="72" width="4" height="28" fill="#94a3b8" />
              ))}

              <rect x="300" y="70" width="140" height="30" fill="#e2e8f0" />
              <rect x="300" y="66" width="140" height="4" fill="#cbd5e1" />
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={`col-r-${i}`} x={305 + i * 11} y="72" width="4" height="28" fill="#94a3b8" />
              ))}

              <rect x="195" y="60" width="110" height="40" fill="#e2e8f0" />
              <rect x="190" y="56" width="120" height="4" fill="#cbd5e1" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={`col-c-${i}`} x={202 + i * 13} y="62" width="5" height="38" fill="#64748b" />
              ))}
              <polygon points="190,56 250,38 310,56" fill="#cbd5e1" />

              <rect x="220" y="32" width="60" height="8" fill="#94a3b8" />
              <path d="M225,32 C225,12 275,12 275,32 Z" fill="#64748b" />
              <rect x="249" y="4" width="2" height="10" fill="#475569" />
              <circle cx="250" cy="3" r="2.5" fill="#f59e0b" />
            </svg>
          </div>

        </div>

        {/* ──── RIGHT SIDE: Citizen Login / Register Card ──── */}
        <div className="lg:col-span-6 xl:col-span-5 w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">

            {/* Banner */}
            <div className="bg-gradient-to-br from-[#003366] to-[#0f3460] px-6 py-7 text-white text-center relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center ring-2 ring-white/20 backdrop-blur-sm">
                <EmblemOfIndia className="h-11 w-auto text-amber-200" />
              </div>
              <h1 className="text-lg font-extrabold tracking-wide">Citizen Login Portal</h1>
              <p className="text-blue-200 text-xs mt-1">National Helpline Against Atrocities — NHAA 14566</p>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200">
                <Shield className="w-3 h-3" /> Secured by Google Firebase
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {(['login', 'register'] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => { setMode(tab); reset() }}
                  className={`flex-1 py-2.5 text-xs font-bold transition-colors capitalize ${mode === tab ? 'text-[#003366] border-b-2 border-[#003366] bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab === 'login' ? 'Sign In' : 'New Registration'}
                </button>
              ))}
            </div>

            <div className="px-6 py-6 space-y-4">

              {/* Assessment login required alert */}
              {redirectUrl.includes('stress-trauma-assessment') && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs shadow-2xs">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[#003366]" />
                  <div className="leading-relaxed">
                    <strong className="block font-bold text-[#003366] text-xs">Citizen Login Required to Give Test</strong>
                    <span>Please sign in or register below. Once authenticated, you will immediately be redirected to take your Stress &amp; Trauma Assessment.</span>
                  </div>
                </div>
              )}

              {/* Feedback banners */}
              {successMsg && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ──── SIGN IN ──── */}
              {mode === 'login' && (
                <>
                  {/* Google One-Click Sign-In */}
                  <button
                    type="button"
                    id="citizen-google-signin"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md text-slate-700 font-semibold text-sm shadow-xs transition-all disabled:opacity-60 group cursor-pointer"
                  >
                    {isLoading
                      ? <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                      : <GoogleIcon className="w-5 h-5" />
                    }
                    <span className="group-hover:text-[#003366] transition-colors">Continue with Google</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] text-slate-400 font-medium">OR SIGN IN WITH EMAIL</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input id="citizen-email" type="email" required value={email}
                          onChange={e => setEmail(e.target.value)} placeholder="yourname@email.com"
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">Password *</label>
                        <button type="button" onClick={() => { setMode('forgot'); reset() }}
                          className="text-[11px] text-blue-700 hover:underline font-medium">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input id="citizen-password" type={showPass ? 'text' : 'password'} required value={password}
                          onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                          className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button type="submit" id="citizen-email-signin" disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
                      {isLoading
                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><span>Sign In to Portal</span><ChevronRight className="w-4 h-4" /></>
                      }
                    </button>
                  </form>
                </>
              )}

              {/* ──── REGISTER ──── */}
              {mode === 'register' && (
                <>
                  <button type="button" onClick={handleGoogleSignIn} disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md text-slate-700 font-semibold text-sm shadow-xs transition-all disabled:opacity-60 group">
                    {isLoading
                      ? <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                      : <GoogleIcon className="w-5 h-5" />
                    }
                    <span className="group-hover:text-[#003366] transition-colors">Register with Google</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] text-slate-400 font-medium">OR CREATE ACCOUNT</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input id="reg-name" type="text" required value={name} onChange={e => setName(e.target.value)}
                          placeholder="As per Aadhaar / ID proof"
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input id="reg-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="yourname@email.com"
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input id="reg-mobile" type="tel" required maxLength={10} value={mobile}
                          onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Aadhaar Last 4 Digits{' '}
                        <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <input id="reg-aadhaar" type="text" maxLength={4} value={aadhaarLast4}
                        onChange={e => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                        placeholder="XXXX"
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all tracking-widest font-mono" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Create Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input id="reg-password" type={showPass ? 'text' : 'password'} required value={password}
                          onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                          className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      By registering you agree to the NHAA Portal{' '}
                      <span className="text-[#003366] font-semibold hover:underline cursor-pointer">Terms of Use</span>
                      {' '}and{' '}
                      <span className="text-[#003366] font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
                    </p>

                    <button type="submit" id="citizen-register-btn" disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {isLoading
                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><span>Create My Account</span><ChevronRight className="w-4 h-4" /></>
                      }
                    </button>
                  </form>
                </>
              )}

              {/* ──── FORGOT PASSWORD ──── */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="text-center pb-1">
                    <h2 className="text-sm font-bold text-slate-800">Reset your password</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your registered email — we'll send a reset link instantly.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Registered Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input id="forgot-email" type="email" required value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)} placeholder="yourname@email.com"
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all" />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {isLoading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <span>Send Reset Link</span>
                    }
                  </button>

                  <button type="button" onClick={() => { setMode('login'); reset() }}
                    className="w-full text-xs text-blue-700 hover:underline font-semibold py-1">
                    ← Back to Sign In
                  </button>
                </form>
              )}

              {/* Security note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Protected under the IT Act, 2000 &amp; NHAA privacy guidelines.
                  Powered by Google Firebase — NHAA does not store passwords.
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-500 mt-4">
            Having trouble?{' '}
            <Link to="/help-faqs" className="text-blue-700 hover:underline font-semibold">View FAQs</Link>
            {' '}or call toll-free{' '}
            <span className="font-bold text-slate-800">14566</span>
          </p>
        </div>

      </main>

      {/* ── Official Government Footer ── */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/70 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-600">
            National Informatics Centre (NIC) • Department of Social Justice and Empowerment, Government of India
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Portal Version 2.5.0 • NIC Certified Government Portal
          </p>
        </div>
      </footer>
    </div>
  )
}
