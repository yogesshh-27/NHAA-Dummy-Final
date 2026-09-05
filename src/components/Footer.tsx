import React, { useState } from 'react'
import { MessageSquare, X, Bot } from 'lucide-react'

export const Footer: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <footer className="bg-[#002040] text-white py-4 px-4 sm:px-6 lg:px-8 text-xs border-t border-[#001730] mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Copyright & UX4G / NeGD / MeitY notice */}
          <div className="text-slate-300 text-center md:text-left text-[11px] sm:text-xs">
            <span>© 2026 - Copyright UX4G. All rights reserved. Powered by NeGD | MeitY Government of India® 2026 UX4G</span>
          </div>

          {/* Right: Policy Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-200">
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span className="text-slate-500">|</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="text-slate-500">|</span>
            <span className="hover:underline cursor-pointer">Feedback</span>
          </div>

        </div>
      </footer>

      {/* Floating Samajik Sahayak AI Assistant Widget (matching bottom-right circle in screenshot) */}
      <div className="fixed bottom-5 right-5 z-40">
        {isChatOpen ? (
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col">
            <div className="bg-[#003366] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-yellow-300" />
                <div>
                  <h4 className="font-bold text-xs">Samajik Sahayak (सामाजिक सहायक)</h4>
                  <p className="text-[10px] text-blue-200">NHAA Automated Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 text-xs space-y-3 h-64 overflow-y-auto">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <p className="font-semibold text-slate-800">
                  नमस्ते! I am Samajik Sahayak. How may I help you today regarding atrocity complaints, rescue requests, or trauma support?
                </p>
              </div>
            </div>

            <div className="p-2 border-t border-slate-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-700"
              />
              <button
                type="button"
                className="px-3 py-1.5 bg-[#003366] text-white rounded text-xs font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="w-13 h-13 rounded-full bg-white border-2 border-[#003366] shadow-xl flex items-center justify-center p-1 hover:scale-105 transition-transform group cursor-pointer"
            title="Samajik Sahayak for NHAA / NHAA के लिए सामाजिक सहायक"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
          </button>
        )}
      </div>
    </>
  )
}
