import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, User, LogOut } from 'lucide-react'
import { EmblemOfIndia, DigitalIndiaLogo, SamaveshLogo } from './Emblems'
import { subscribeToAuthState, signOutUser } from '../services/authService'
import type { User as FirebaseUser } from 'firebase/auth'

interface HeaderProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsub = subscribeToAuthState((user) => setCurrentUser(user))
    return () => unsub()
  }, [])

  const handleSignOut = async () => {
    await signOutUser()
    setCurrentUser(null)
  }

  return (
    <header className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Hamburger + Emblem + Ministry text */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Hamburger Menu button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6 text-[#003366]" />
          </button>

          {/* Ashoka Lion Emblem */}
          <Link to="/" className="flex-shrink-0">
            <EmblemOfIndia className="h-13 sm:h-14 w-auto" />
          </Link>

          {/* Ministry Text */}
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded bg-[#FBC02D] text-slate-900 leading-tight">
                BETA
              </span>
              <span className="text-[11px] sm:text-xs text-slate-600 font-medium">
                Government of India
              </span>
            </div>
            <span className="text-xs sm:text-sm text-slate-700 font-medium">
              Ministry of Social Justice & Empowerment
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#003366] tracking-tight">
              Department of Social Justice & Empowerment
            </span>
          </div>

        </div>

        {/* Right: Digital India + SAMAVESH + Admin Login / User Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Digital India */}
          <div className="hidden lg:block">
            <DigitalIndiaLogo />
          </div>

          {/* SAMAVESH */}
          <div className="hidden xl:block">
            <SamaveshLogo />
          </div>

          {/* Citizen Account / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2" id="header-user-profile-badge">
              <Link
                to="/citizen/login"
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition-all shadow-xs"
                title={`Logged in as ${currentUser.email}`}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#003366] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] text-emerald-700 font-semibold">Logged in as</span>
                  <span className="text-xs font-extrabold text-slate-900 truncate max-w-[110px] sm:max-w-[150px]">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/citizen/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white text-sm font-bold shadow-xs transition-colors bg-transparent"
              id="header-citizen-login-btn"
            >
              <User className="w-4 h-4" />
              Citizen Login
            </Link>
          )}

          {/* Official Admin Portal Button */}
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-sm font-bold shadow-xs transition-colors"
            id="header-admin-login-btn"
          >
            Admin Portal
          </Link>

        </div>

      </div>
    </header>
  )
}
