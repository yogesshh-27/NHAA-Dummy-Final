import React from 'react'
import { FileSignature, UserCheck, FileSearch, Brain } from 'lucide-react'
import { ServiceCard } from '../components/ServiceCard'

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 max-w-[1240px] mx-auto py-2">
      
      {/* Dashboard Title & Subtitle matching official NHAPOA portal */}
      <div className="text-center space-y-2 pt-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00274d] tracking-tight">
          National Helpline Against Atrocities (NHAA)
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Submit, track, and resolve grievances through automated workflow. Transparent governance for all citizens.
        </p>
      </div>

      {/* Main Service Cards Grid (Responsive: 1-col mobile, 2-col tablet, 4-col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Register Grievance */}
        <ServiceCard
          title="Register Grievance"
          description="Submit a new complaint regarding atrocities. You can register as a Victim, Informer, or on behalf of an NGO."
          buttonText="Start Registration →"
          to="/register-grievance"
          icon={FileSignature}
        />

        {/* Card 2: Register Rescue */}
        <ServiceCard
          title="Register Rescue"
          description="Quick distress report with essential information. Routed to the appropriate responding authority."
          buttonText="Start Rescue →"
          to="/register-rescue"
          icon={UserCheck}
        />

        {/* Card 3: Track Status */}
        <ServiceCard
          title="Track Status"
          description="Check the current progress, officer remarks, and closure status of an already registered grievance."
          buttonText="Track Application →"
          to="/track-status"
          icon={FileSearch}
        />

        {/* Card 4: Stress & Trauma Assessment (Redirects to a different webpage /stress-trauma-assessment) */}
        <ServiceCard
          title="Stress & Trauma Assessment"
          description="Access the Stress & Trauma Assessment section. Evaluates psychological distress and connects to support resources."
          buttonText="Start Assessment →"
          to="/stress-trauma-assessment"
          icon={Brain}
        />

      </div>

      {/* Grievance Closure Process Section (from official NHAPOA portal) */}
      <div className="space-y-6 pt-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00274d]">
            Grievance Closure Process
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Transparent and time-bound grievance resolution workflow under the PoA Act
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#E5EFF9] text-[#003366] font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Registration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit incident details and required documentation securely through portal or 14566.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#E5EFF9] text-[#003366] font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Review
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                DM/DC Office reviews the grievance and documents for jurisdictional verification.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#E5EFF9] text-[#003366] font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Investigation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field verification and evidence collection by police authorities and DSP level IO.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#E5EFF9] text-[#003366] font-bold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Approval
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                State / District Authority approves Action Taken Report (ATR) or returns for rework.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#E5EFF9] text-[#003366] font-bold text-sm flex items-center justify-center mb-3">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Closure & Relief
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Case is closed and eligible financial relief / compensation is directly disbursed.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
