import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, User, RefreshCw, ShieldAlert, ArrowLeft, KeyRound, Building } from 'lucide-react'
import { EmblemOfIndia } from '../components/Emblems'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [adminId, setAdminId] = useState('nodal.officer@dosje.gov.in')
  const [password, setPassword] = useState('••••••••••••')
  const [captchaInput, setCaptchaInput] = useState('7K9P2')
  const [captchaCode, setCaptchaCode] = useState('7K9P2')

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
    setCaptchaInput(result)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login navigating directly to admin dashboard
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Bar for Admin */}
      <div className="bg-[#0c2340] text-white py-2 px-4 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">GOVERNMENT OF INDIA</span>
            <span>|</span>
            <span className="text-slate-300">Department of Social Justice and Empowerment</span>
          </div>
          <Link
            to="/"
            className="text-blue-200 hover:text-white flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-300 rounded-md shadow-lg overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0f3460] p-6 text-white text-center border-b border-[#0b2545] relative">
            <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xs">
              <EmblemOfIndia className="h-12 w-auto text-amber-200" />
            </div>
            <h1 className="text-lg font-bold tracking-wide">
              Official Administration Login
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              National Helpline Against Atrocities (NHAA - 14566)
            </p>
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded bg-blue-900/60 border border-blue-400/30 text-[10px] uppercase font-bold tracking-wider text-blue-100">
              <Lock className="w-3 h-3" />
              <span>Restricted Government Officer Access</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            
            {/* Officer Designation / Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-800" />
                <span>Select Administrative Role *</span>
              </label>
              <select
                className="w-full text-xs sm:text-sm border border-slate-300 rounded px-3 py-2 bg-white focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
              >
                <option>District Nodal Officer (SC/ST Welfare)</option>
                <option>Superintendent of Police (DSP / SP Office)</option>
                <option>District Magistrate (DM / Collectorate)</option>
                <option>State Vigilance & Monitoring Committee</option>
                <option>National NHAA Helpline Supervisor</option>
              </select>
            </div>

            {/* Admin ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-800" />
                <span>Official Admin ID / Government Email *</span>
              </label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. nodal.officer@dosje.gov.in"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-800" />
                <span>Officer Password *</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Captcha Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Verification (Captcha) *
              </label>
              
              <div className="flex items-center gap-3 mb-2">
                {/* Visual Captcha Box with stylized font */}
                <div className="flex-1 bg-slate-200 border border-slate-400 rounded px-4 py-2 text-center select-none tracking-widest font-mono text-lg font-black text-slate-800 shadow-inner italic bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:8px_8px]">
                  {captchaCode}
                </div>
                
                {/* Refresh Captcha Button */}
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 rounded border border-slate-300 bg-slate-50 hover:bg-slate-200 text-slate-700"
                  title="Generate New Captcha"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter characters shown above"
                className="w-full text-xs sm:text-sm uppercase font-mono tracking-wider border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Warning info */}
            <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                Unauthorized access to this government portal is punishable under the Information Technology Act, 2000. All logins are logged with IP and timestamp.
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded bg-[#0f3460] hover:bg-[#162447] active:bg-[#091f3a] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Secure Admin Login →</span>
            </button>

            {/* Helper link */}
            <div className="text-center pt-2">
              <Link
                to="/"
                className="text-xs text-blue-800 hover:underline font-medium"
              >
                ← Return to Public Grievance Portal
              </Link>
            </div>
          </form>

        </div>
      </div>

      {/* Admin Footer */}
      <div className="bg-[#0c2340] text-slate-400 py-3 text-center text-xs border-t border-slate-700">
        <p>National Informatics Centre (NIC) • Department of Social Justice and Empowerment, GoI</p>
      </div>
    </div>
  )
}
