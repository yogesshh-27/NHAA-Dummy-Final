import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SearchCheck,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  FileCheck2,
  Printer,
} from 'lucide-react'

export const TrackStatus: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('NHAA-2026-GRV-49210')
  const [hasSearched, setHasSearched] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-800">
            <SearchCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
              Track Grievance / Rescue Status
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Check current progress, officer remarks, and closure status of an already registered grievance.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-slate-300 rounded-md p-5 sm:p-6 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grievance Reference Number (URN) or Rescue ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. NHAA-2026-GRV-49210 or RESCUE-8921"
                  className="w-full text-xs sm:text-sm font-mono border border-slate-300 rounded px-3 py-2 pl-9 focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Mobile (Optional for OTP verification)
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile"
                defaultValue="9876543210"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Quick Try Samples:</span>
              <button
                type="button"
                onClick={() => { setTokenInput('NHAA-2026-GRV-49210'); setHasSearched(true); }}
                className="text-xs text-blue-700 hover:underline font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
              >
                NHAA-2026-GRV-49210
              </button>
              <button
                type="button"
                onClick={() => { setTokenInput('RESCUE-77291'); setHasSearched(true); }}
                className="text-xs text-red-700 hover:underline font-mono bg-red-50 px-2 py-0.5 rounded border border-red-200"
              >
                RESCUE-77291
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-[#0f3460] hover:bg-[#162447] text-white font-semibold text-sm rounded shadow-xs transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Status Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grievance Progress Card */}
      {hasSearched && (
        <div className="bg-white border border-slate-300 rounded-md p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dossier Ref:
                </span>
                <span className="text-lg font-mono font-extrabold text-blue-900">
                  {tokenInput || 'NHAA-2026-GRV-49210'}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                  Under Police Investigation (FIR Registered)
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Lodged on: 28 Aug 2026, 14:32 IST | Complainant: Ram Swaroop (Victim) | State: Uttar Pradesh
              </span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>

          {/* Workflow Stepper */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Government Milestone Tracking Progress
            </h3>

            <div className="relative">
              {/* Vertical connector on small screens, horizontal on md */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                {/* Step 1 */}
                <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-xs relative">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>1. Grievance Lodged</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Logged via 14566 National Helpline portal.
                  </p>
                  <span className="text-[10px] text-emerald-700 font-mono mt-1 block">
                    28 Aug 2026, 14:32
                  </span>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-xs relative">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>2. Scrutiny & Triage</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Verified under SC/ST (PoA) Act Sec 3(1)(r).
                  </p>
                  <span className="text-[10px] text-emerald-700 font-mono mt-1 block">
                    28 Aug 2026, 16:10
                  </span>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded bg-blue-50 border-2 border-blue-600 text-xs relative shadow-xs">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                    <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 animate-spin" />
                    <span>3. Nodal Transfer (Active)</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-snug">
                    Transferred to SP Office & Deputy SP (Investigation Officer).
                  </p>
                  <span className="text-[10px] text-blue-800 font-mono mt-1 block">
                    29 Aug 2026, 10:15
                  </span>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded bg-slate-50 border border-slate-300 text-xs opacity-75">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold mb-1">
                    <UserCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>4. ATR & FIR Action</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-snug">
                    FIR No. 412/2026 filed. Charge sheet under formulation.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Target: 05 Sep 2026
                  </span>
                </div>

                {/* Step 5 */}
                <div className="p-3 rounded bg-slate-50 border border-slate-300 text-xs opacity-75">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold mb-1">
                    <FileCheck2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>5. Relief & Closure</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-snug">
                    Interim relief sanction & final compliance.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Pending ATR
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Officer Remarks & Details Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Designated Investigating Authority & Remarks
              </span>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50/70 w-1/3">Investigating Officer (IO)</td>
                  <td className="p-3 text-slate-900 font-medium">Shri R.K. Yadav, Deputy Superintendent of Police (CO Sadar)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50/70">Police Station Jurisdiction</td>
                  <td className="p-3 text-slate-900">Kotwali Sadar, District Ghaziabad (FIR No. 412/2026)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50/70">Latest Officer Remark (31 Aug 2026)</td>
                  <td className="p-3 text-slate-900">
                    Statements of victim and 2 eyewitnesses recorded under Section 161 CrPC. Police bandobast deployed at village site to ensure victim family security.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50/70">Interim Compensation Sanction</td>
                  <td className="p-3 text-emerald-800 font-semibold">
                    ₹1,00,000/- (Stage 1 Relief recommended to District Social Welfare Officer)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  )
}
