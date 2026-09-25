import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone,
  Shield,
  LayoutGrid,
  FileSignature,
  UserCheck,
  Brain,
  FileSearch,
  LogIn,
  ChevronRight,
  ExternalLink,
  Download,
  Building,
  Users,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Scale,
  HeartHandshake,
} from 'lucide-react'

export const DosjeNhaaOrganisation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'portals' | 'leadership' | 'reports' | 'updates' | 'contact'>('about')

  const scrollToSection = (id: string, tabKey: typeof activeTab) => {
    setActiveTab(tabKey)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 font-sans antialiased">
      
      {/* ── 1. Secondary DOSJE Navigation Bar matching www.dosje.gov.in ── */}
      <nav className="bg-[#00274d] text-white border-b border-blue-900/60 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none text-xs sm:text-sm">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white font-medium transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <span className="text-white/30">•</span>
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <span>Department</span>
                <span className="text-[10px]">▼</span>
              </button>
            </div>
            <span className="text-white/30">•</span>
            <div className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold whitespace-nowrap flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
              <span>Associated Organisations: NHAA (14566)</span>
            </div>
            <span className="text-white/30 hidden md:inline">•</span>
            <Link
              to="/dashboard"
              className="hidden md:inline-flex px-3 py-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white font-medium transition-colors whitespace-nowrap"
            >
              Portal Dashboard
            </Link>
            <span className="text-white/30 hidden lg:inline">•</span>
            <Link
              to="/stress-trauma-assessment"
              className="hidden lg:inline-flex px-3 py-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white font-medium transition-colors whitespace-nowrap"
            >
              Trauma Assessment
            </Link>
          </div>

          <div className="flex items-center gap-2 py-2 shrink-0">
            <Link
              to="/citizen/login"
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Citizen Login</span>
            </Link>
            <Link
              to="/admin/login"
              className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors shadow-xs"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 2. Official Breadcrumbs Bar ── */}
      <div className="bg-slate-100 border-b border-slate-200 py-2 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="text-blue-700 hover:underline font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Associated Organisations</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">National Helpline Against Atrocities (NHAA - 14566)</span>
        </div>
      </div>

      {/* ── 3. HERO SECTION with Official Statutory Citation & Clickable Redirection Buttons ── */}
      <section className="bg-gradient-to-br from-[#00274d] via-[#003366] to-[#0a3161] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          
          {/* Header Tag & Constitution Article */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>A Constitutional Body under Article 338 of the Constitution of India</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  National Helpline Against Atrocities (NHAA)
                </h1>
                <p className="text-blue-200 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
                  Ministry of Social Justice and Empowerment • Department of Social Justice &amp; Empowerment, Government of India
                </p>
              </div>

              {/* Toll-free Helpline 14566 Hero Badge */}
              <div className="flex items-center gap-3.5 bg-white/10 border border-white/20 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm shrink-0 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                  <Phone className="w-6 h-6 animate-pulse text-slate-950" />
                </div>
                <div>
                  <div className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">
                    24x7 Toll-Free National Helpline
                  </div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    14566
                  </div>
                  <div className="text-[10px] text-blue-200">
                    Available in Hindi, English &amp; 13 Regional Languages
                  </div>
                </div>
              </div>
            </div>

            <p className="text-slate-200 text-xs sm:text-sm max-w-4xl leading-relaxed pt-1">
              Established with a view to provide statutory safeguards against exploitation of Scheduled Castes and Scheduled Tribes, 
              protect and promote their civil rights, and ensure transparent end-to-end grievance redressal, trauma rehabilitation, and relief tracking under the 
              <strong> Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989</strong> and the 
              <strong> Protection of Civil Rights (PCR) Act, 1955</strong>.
            </p>
          </div>

          {/* ──── CLICKABLE REDIRECTION BUTTONS (User Requirement) ──── */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Interactive Portal Services &amp; Redirection Actions:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Button 1: Operations Dashboard */}
              <Link
                to="/dashboard"
                id="btn-goto-dashboard"
                className="group p-4 rounded-2xl bg-white text-slate-900 hover:bg-blue-50 border-2 border-transparent hover:border-amber-400 shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00274d] flex items-center justify-center font-bold">
                    <LayoutGrid className="w-5 h-5 text-[#00274d]" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#00274d] border border-blue-200">
                    Main Operations
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-[#00274d] group-hover:text-blue-900 flex items-center gap-1">
                    <span>Portal Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    View active dockets, state charts, live grievance metrics &amp; closure flowchart.
                  </p>
                </div>
              </Link>

              {/* Button 2: Register Grievance */}
              <Link
                to="/register-grievance"
                id="btn-goto-register-grievance"
                className="group p-4 rounded-2xl bg-white text-slate-900 hover:bg-rose-50 border-2 border-transparent hover:border-rose-400 shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <FileSignature className="w-5 h-5 text-rose-700" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    PoA Redressal
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-rose-900 group-hover:text-rose-950 flex items-center gap-1">
                    <span>Register Grievance</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Lodge a formal SC/ST atrocity complaint as victim, informer, or NGO.
                  </p>
                </div>
              </Link>

              {/* Button 3: Register a Rescue (SOS) */}
              <Link
                to="/register-rescue"
                id="btn-goto-register-rescue"
                className="group p-4 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 border-2 border-transparent hover:border-amber-400 shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5 text-amber-800" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Immediate SOS
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-amber-950 group-hover:text-amber-900 flex items-center gap-1">
                    <span>Register a Rescue</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Emergency distress notification dispatched to local police and PCR units.
                  </p>
                </div>
              </Link>

              {/* Button 4: Stress & Trauma Assessment */}
              <Link
                to="/stress-trauma-assessment"
                id="btn-goto-trauma-assessment"
                className="group p-4 rounded-2xl bg-white text-slate-900 hover:bg-purple-50 border-2 border-transparent hover:border-purple-400 shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Psychological Aid
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-purple-950 group-hover:text-purple-900 flex items-center gap-1">
                    <span>Trauma Assessment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    AI-driven trauma screening &amp; continuous counseling for atrocity survivors.
                  </p>
                </div>
              </Link>

            </div>

            {/* Secondary Link Buttons Row: Track Status, Citizen Login, Officer Login */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <Link
                to="/track-status"
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <FileSearch className="w-4 h-4 text-blue-200" />
                <span>Track Grievance Status (URN Lookup)</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </Link>
              <Link
                to="/citizen/login"
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Citizen Portal (SAMAVESH Login)</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              </Link>
              <Link
                to="/admin/login"
                className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Shield className="w-4 h-4 text-slate-950" />
                <span>Official Nodal Officer Access (Admin Portal)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
              </Link>
            </div>
          </div>

          {/* Quick At-a-Glance Stats Cards matching the official DOSJE section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/15">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">New Delhi</h4>
                <p className="text-xs text-blue-200">Headquarters (Shastri Bhawan / CGO Complex)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Helpline 14566</h4>
                <p className="text-xs text-blue-200">Universal Toll-Free 24x7 Assistance</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">PCR &amp; PoA Acts</h4>
                <p className="text-xs text-blue-200">Statutory Protection &amp; Legal Remedies</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. In-Page Sub-Navigation Tabs matching DOSJE Website ── */}
      <div className="bg-white border-b border-slate-200 sticky top-12 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 text-xs sm:text-sm font-semibold">
          {[
            { key: 'about', label: 'About the Scheme', target: 'sec-about' },
            { key: 'portals', label: 'Interactive Portals & Services', target: 'sec-portals' },
            { key: 'leadership', label: 'Leadership & Organisation', target: 'sec-leadership' },
            { key: 'reports', label: 'Reports & Documents', target: 'sec-reports' },
            { key: 'updates', label: 'Latest Updates', target: 'sec-updates' },
            { key: 'contact', label: 'Contact Us & Directory', target: 'sec-contact' },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => scrollToSection(tab.target, tab.key as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#00274d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Main Content Sections Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ── SECTION A: About the Scheme (from official website) ── */}
        <section id="sec-about" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Mandate</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00274d] tracking-tight">About the Scheme</h2>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>Explore Portal Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                A Centrally Sponsored scheme was launched in the year <strong>1974-75</strong> for implementation of the 
                <strong> Protection of Civil Rights (PCR) Act, 1955</strong> and 
                <strong> Prevention of Atrocities (POA) Act, 1989</strong> to establish an egalitarian society free from caste discrimination and atrocities.
              </p>
              <p>
                The <strong>National Helpline Against Atrocities (NHAA - 14566)</strong> provides round-the-clock accessibility 
                to victims, witnesses, and stakeholders across India. Every grievance logged through this portal or the toll-free helpline number 
                is automatically converted into a structured legal docket, assigned a Unique Reference Number (URN), and 
                electronically synchronized with district nodal officers, state monitoring committees, and police dispatch desks.
              </p>

              {/* 4 Feature Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#00274d] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">24x7 Immediate Response</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Toll-free 14566 with continuous interactive voice and real-time live operators.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">FIR &amp; ATR Accountability</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Automated tracking of First Information Reports and Action Taken Reports.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                  <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Victim Compensation Relief</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Statutory financial relief monitoring for atrocity victims under central guidelines.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Trauma &amp; Legal Support</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Free psychological evaluations, legal counseling, and institutional rehabilitation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheme Summary Card */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#00274d] uppercase tracking-wide border-b border-slate-100 pb-2">
                Quick Scheme Facts
              </h3>
              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-slate-500 font-medium">Scheme Type:</dt>
                  <dd className="font-bold text-slate-800 text-sm">Centrally Sponsored Scheme (CSS)</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Implementing Ministry:</dt>
                  <dd className="font-bold text-slate-800 text-sm">Ministry of Social Justice &amp; Empowerment</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Core Legislation:</dt>
                  <dd className="font-bold text-slate-800 text-sm">SC/ST (PoA) Act, 1989 &amp; PCR Act, 1955</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Target Beneficiaries:</dt>
                  <dd className="font-bold text-slate-800 text-sm">Scheduled Caste &amp; Scheduled Tribe Citizens</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Helpline Availability:</dt>
                  <dd className="font-bold text-emerald-700 text-sm">24 Hours × 7 Days × 365 Days (Toll-Free)</dd>
                </div>
              </dl>
              <div className="pt-2">
                <Link
                  to="/register-grievance"
                  className="w-full py-2.5 px-4 bg-[#00274d] hover:bg-[#001730] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Lodge Official Grievance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION B: Interactive Portals & Services Grid ── */}
        <section id="sec-portals" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Digital Gateway</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00274d] tracking-tight">Interactive Portals &amp; Redirection Modules</h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">Direct access to online tools</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Dashboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-blue-500 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00274d] flex items-center justify-center font-bold">
                  <LayoutGrid className="w-6 h-6 text-[#00274d]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">NHAA Operations Dashboard</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Real-time grievance statistics, state-wise incident analysis, live triage metrics, and end-to-end resolution flowchart.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/dashboard"
                  className="w-full py-2 px-4 rounded-xl bg-[#00274d] hover:bg-[#001730] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Operations Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Stress Assessment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-purple-500 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Brain className="w-6 h-6 text-purple-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Stress &amp; Trauma Assessment</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Confidential AI-guided psychological evaluation tool with real-time trauma scoring and ongoing counselor session continuity.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/stress-trauma-assessment"
                  className="w-full py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Launch Trauma Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Register Grievance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-rose-500 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <FileSignature className="w-6 h-6 text-rose-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Register Online Grievance</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Submit detailed atrocity reports with incident date, location, accused details, audio evidence, and immediate police docket generation.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/register-grievance"
                  className="w-full py-2 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Start Grievance Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: Register Rescue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-amber-500 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6 text-amber-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Register a Rescue (SOS)</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Fast emergency alert for victims facing imminent bodily threat, physical siege, or social boycott with direct PCR van dispatch.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/register-rescue"
                  className="w-full py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Trigger Rescue Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 5: Track Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-400 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <FileSearch className="w-6 h-6 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Track Grievance Status</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Verify current investigation stage, nodal officer remarks, compensation disbursement status, and final closure documents.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/track-status"
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Check URN Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 6: Admin Portal */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-blue-700 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Official Nodal Officer Portal</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Restricted government officer console for District Magistrates, SPs, and Nodal Officers with SAATHI AI co-pilot integration.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  to="/admin/login"
                  className="w-full py-2 px-4 rounded-xl bg-[#00274d] hover:bg-[#001730] text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Authorized Officer Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION C: Leadership & Organisation ── */}
        <section id="sec-leadership" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Governance &amp; Officers</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00274d] tracking-tight">Leadership &amp; Organisation</h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">Ministry Directory (DoSJE)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Official 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 mx-auto flex items-center justify-center text-slate-600 font-bold text-xl">
                MK
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#00274d]">Mona K. Khandhar, IAS</h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Additional Secretary</p>
                <p className="text-[11px] text-slate-400 mt-1">Department of Social Justice &amp; Empowerment</p>
              </div>
              <div className="text-[11px] text-blue-700 font-medium pt-2 border-t border-slate-100">
                Supervisory Governance of NHAA &amp; SCD Bureau
              </div>
            </div>

            {/* Official 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 mx-auto flex items-center justify-center text-slate-600 font-bold text-xl">
                MS
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#00274d]">Mahender Singh</h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Deputy Secretary</p>
                <p className="text-[11px] text-slate-400 mt-1">SCD-B Division, MoSJ&amp;E</p>
              </div>
              <div className="text-[11px] text-blue-700 font-medium pt-2 border-t border-slate-100">
                PoA Scheme Implementation &amp; Coordination
              </div>
            </div>

            {/* Official 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 mx-auto flex items-center justify-center text-slate-600 font-bold text-xl">
                SB
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#00274d]">Sunil Kumar Bhatia</h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Under Secretary</p>
                <p className="text-[11px] text-slate-400 mt-1">National Helpline Operations (NHAA)</p>
              </div>
              <div className="text-[11px] text-blue-700 font-medium pt-2 border-t border-slate-100">
                Nodal Operations &amp; Grievance Tracking
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION D: Reports & Documents ── */}
        <section id="sec-reports" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Publications</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00274d] tracking-tight">Reports &amp; Central Legislation</h2>
            </div>
            <a
              href="https://www.dosje.gov.in/annual-reports/?org=nhapoa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>View All on DoSJE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">ANNUAL REPORT</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">PoA Act Annual Report 2023 (English)</h4>
                <p className="text-xs text-slate-500 mt-1">Comprehensive national report on implementation and conviction metrics under PoA Act.</p>
              </div>
              <a
                href="https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/PoA-Act-Report-2023-English.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors"
              >
                <span>View Document</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">वार्षिक प्रतिवेदन</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">अत्याचार निवारण अधिनियम वार्षिक प्रतिवेदन 2023 (हिन्दी)</h4>
                <p className="text-xs text-slate-500 mt-1">नागरिक अधिकार संरक्षण अधिनियम एवं अत्याचार निवारण अधिनियम रिपोर्ट।</p>
              </div>
              <a
                href="https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/PoA-Act-Report-2023-Hindi.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors"
              >
                <span>दस्तावेज़ देखें</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">STATUTORY ACT</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">SC/ST (PoA) Act, 1989 &amp; Rules</h4>
                <p className="text-xs text-slate-500 mt-1">Full statutory text of the Act with subsequent amendments and relief norms.</p>
              </div>
              <a
                href="https://www.dosje.gov.in/acts-rules/?org=nhapoa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors"
              >
                <span>Read Rules</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">SOP &amp; GUIDELINES</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">Modernisation of SPSs &amp; ESCs</h4>
                <p className="text-xs text-slate-500 mt-1">Special Protection Squads and Exclusive Special Courts modernization booklet.</p>
              </div>
              <a
                href="https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/Modernisation-and-Strengthening-of-SPSs-and-ESCs.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors"
              >
                <span>Download Booklet</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </section>

        {/* ── SECTION E: Latest Updates & Meetings ── */}
        <section id="sec-updates" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Notices</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00274d] tracking-tight">Latest Updates &amp; Review Meetings</h2>
            </div>
            <a
              href="https://www.dosje.gov.in/events/?org=nhapoa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>View All Events</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {[
              {
                date: 'Review Meeting',
                title: '29th Meeting of the Committee to Review the Implementation of the SC/ST (Prevention of Atrocities) Act, 1989 and the PCR Act, 1955.',
                desc: 'Chaired by the Union Minister of Social Justice & Empowerment with State Social Welfare Ministers to review district-level vigilance monitoring.',
              },
              {
                date: 'Coordination',
                title: 'DoSJE organizes 28th Coordination Committee Meeting to Devise Ways and Means to Curb Offences of Untouchability.',
                desc: 'High-level inter-ministerial panel to streamline digital FIR reporting, fast-track judicial disposals, and helpline integration.',
              },
              {
                date: 'MoU Signed',
                title: 'MoU signed between Department of Social Justice & Empowerment and National Legal Services Authority (NALSA).',
                desc: 'Joint framework to provide pro-bono senior legal counsel and free paralegal assistance to atrocity victims at district and taluk levels.',
              },
              {
                date: 'Workshop',
                title: 'Two-Day Regional Workshop Organized on Acts, Rules, and Central Schemes in Pune & Bhopal.',
                desc: 'Capacity building and automated docketing training for District Nodal Officers, Deputy Superintendents of Police, and Helpline personnel.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors flex items-start gap-4">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#00274d] border border-blue-200 shrink-0">
                  {item.date}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION F: Contact Us & Directory ── */}
        <section id="sec-contact" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Official Communication</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#00274d] tracking-tight">Helpline &amp; Contact Directory</h2>
            </div>
            <span className="text-xs text-slate-500">Department of Social Justice and Empowerment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">National Helpline (Toll-Free)</h4>
              <p className="text-2xl font-black text-[#00274d]">14566</p>
              <p className="text-xs text-slate-500">Operating 24 Hours a day, 7 Days a week across India from all networks.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Official Grievance Email</h4>
              <p className="text-sm font-bold text-blue-900 font-mono">support-nha[at]supportgov[dot]in</p>
              <p className="text-xs text-slate-500">Official secretariat email for grievance escalations and administrative correspondence.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Ministry Headquarters</h4>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                Department of Social Justice &amp; Empowerment<br />
                Shastri Bhawan, Dr. Rajendra Prasad Road,<br />
                New Delhi - 110001
              </p>
              <p className="text-[11px] text-slate-400">Landline: +91-11-24364461</p>
            </div>

          </div>
        </section>

      </div>

    </div>
  )
}

export default DosjeNhaaOrganisation
