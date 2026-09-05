import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp, Phone, BookOpen, ShieldCheck, Mail } from 'lucide-react'

export const HelpFaqs: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What is the National Helpline Against Atrocities (NHAA) 14566?',
      a: 'NHAA is a toll-free round-the-clock national helpline operationalized by the Department of Social Justice and Empowerment, Government of India. It serves as a unified grievance redressal and rescue coordination platform for victims and informers under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989.',
    },
    {
      q: 'Who can register a complaint or rescue alert on this portal?',
      a: 'Any citizen can register a complaint. You can register as a Victim (पीड़ित), an Informer (witness or concerned citizen reporting an atrocity), or on behalf of an authorized Non-Governmental Organization (NGO) or legal aid body. Informer details can remain confidential.',
    },
    {
      q: 'What happens immediately when I click "Start Rescue"?',
      a: 'Clicking "Start Rescue" opens a high-priority distress form requiring minimal details (location, phone, nature of threat). Once submitted, it automatically triggers an emergency ticket directly to the District Police Control Room and Superintendent of Police for immediate police deployment.',
    },
    {
      q: 'What is the Stress & Trauma Assessment feature?',
      a: 'The Stress & Trauma Assessment section is a citizen well-being module designed to evaluate acute psychological distress, trauma, and mental well-being of survivors following atrocity incidents. It helps connect citizens to appropriate counseling, rehabilitation, and psycho-social support.',
    },
    {
      q: 'How can I track the status of my registered grievance?',
      a: 'After submission, a unique Grievance Reference Number (URN) such as NHAA-2026-GRV-XXXXX is issued via screen and SMS. You can enter this URN in the "Track Status" section anytime to review officer remarks, FIR registration, and relief sanction stages.',
    },
    {
      q: 'What are the monetary relief entitlements under the PoA Act?',
      a: 'Under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Rules, prescribed minimum relief ranges from ₹85,000 to ₹8,25,000 depending on the nature of the offence, payable in stages (FIR registration, charge-sheet filing, and trial conclusion).',
    },
  ]

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
          <div className="w-10 h-10 rounded-md bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
              Help & Frequently Asked Questions
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Comprehensive guidance on filing grievances, legal provisions, and helpline services.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Quick Support Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-500">Toll-Free Helpline</span>
            <div className="text-lg font-mono font-extrabold text-red-600">14566</div>
            <span className="text-[10px] text-slate-500">24 Hours x 7 Days</span>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-500">Email Assistance</span>
            <div className="text-sm font-semibold text-slate-800">support-nhaa@gov.in</div>
            <span className="text-[10px] text-slate-500">Official Portal Support Desk</span>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-500">Statutory Act</span>
            <div className="text-sm font-semibold text-slate-800">PoA Act, 1989 & 2015</div>
            <span className="text-[10px] text-slate-500">Protection & Relief Rules</span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white border border-slate-300 rounded-md p-5 sm:p-6 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-800" />
          <span>Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)</span>
        </h2>

        <div className="divide-y divide-slate-200">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div key={faq.q} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-800 hover:text-blue-900 py-1"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed pl-2 border-l-2 border-blue-600">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
