import React, { useState } from 'react'
import { Key, CheckCircle, X, ExternalLink, Shield } from 'lucide-react'
import { getOpenAIApiKey, saveOpenAIApiKey } from '../../services/assessmentEngine'

interface OpenAISettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const OpenAISettingsModal: React.FC<OpenAISettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getOpenAIApiKey())
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveOpenAIApiKey(apiKey)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 900)
  }

  const handleClear = () => {
    setApiKey('')
    saveOpenAIApiKey('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#003366] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">OpenAI API Key Configuration</h3>
              <p className="text-[11px] text-blue-200">Optional AI voice & triage enhancement</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs text-slate-700">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Where to paste your OpenAI Key:</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              You can paste your key below directly, OR add it to the project&apos;s <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[10px]">.env</code> file as:
              <br />
              <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[10px] text-blue-950 font-bold block mt-1">
                VITE_OPENAI_API_KEY=sk-proj-...
              </code>
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              OpenAI API Key (sk-...)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your OpenAI API Key starting with sk-..."
              className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Saved securely in your local browser session for this prototype.
            </span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Don&apos;t have an API key?</span>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:underline flex items-center gap-0.5 font-medium"
            >
              Get OpenAI Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded font-semibold text-xs"
              >
                Clear Key
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                {saved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : null}
                <span>{saved ? 'Saved Successfully!' : 'Save Key'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}
