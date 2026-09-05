import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  FileSignature,
  UserCheck,
  Brain,
  FileSearch,
  HelpCircle,
  X,
} from 'lucide-react'
import { SambalLogo } from './Emblems'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutGrid,
    },
    {
      name: 'Register Grievance',
      path: '/register-grievance',
      icon: FileSignature,
    },
    {
      name: 'Register Rescue',
      path: '/register-rescue',
      icon: UserCheck,
    },
    {
      name: 'Stress & Trauma Assessment',
      path: '/stress-trauma-assessment',
      icon: Brain,
      badge: 'NEW',
    },
    {
      name: 'Track Status',
      path: '/track-status',
      icon: FileSearch,
    },
    {
      name: 'Help & FAQs',
      path: '/help-faqs',
      icon: HelpCircle,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Official Light Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          w-72 md:w-64 lg:w-72
          bg-white text-slate-800
          border-r border-slate-200
          flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-lg md:shadow-none min-h-[calc(100vh-140px)]
        `}
      >
        {/* Top Branding Area: SAMBAL (NHAA 2.0) */}
        <div className="p-4 border-b border-slate-200 flex items-start gap-3 bg-white">
          <SambalLogo className="h-12 w-12 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                SAMBAL (NHAA 2.0)
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="md:hidden text-slate-500 hover:text-slate-900 p-1"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug mt-1">
              Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages
            </p>
          </div>
        </div>

        {/* Navigation items matching NHAPOA official portal */}
        <nav className="p-3 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) => `
                  group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all
                  ${
                    isActive
                      ? 'bg-[#E5EFF9] text-[#003366] shadow-2xs font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#003366]'
                  }
                `}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    className="w-5 h-5 flex-shrink-0 text-slate-700 group-hover:text-[#003366]"
                    strokeWidth={1.8}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Subtle Bottom Act info */}
        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-500 text-center">
          Department of Social Justice & Empowerment
        </div>

      </aside>
    </>
  )
}
