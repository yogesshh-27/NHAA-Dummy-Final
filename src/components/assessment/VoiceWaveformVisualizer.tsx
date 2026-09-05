import React, { useEffect, useState } from 'react'

interface VoiceWaveformProps {
  isRecording: boolean
  audioLevel: number // 0 to 1
  secondsElapsed: number
  mode?: 'voice' | 'text'
}

export const VoiceWaveformVisualizer: React.FC<VoiceWaveformProps> = ({
  isRecording,
  audioLevel,
  secondsElapsed,
  mode = 'voice',
}) => {
  const [bars, setBars] = useState<number[]>([15, 25, 40, 20, 30, 60, 45, 20, 15, 30, 50, 25])

  useEffect(() => {
    if (!isRecording || mode !== 'voice') return
    // Animate bars based on real-time audioLevel
    const interval = setInterval(() => {
      setBars(() =>
        Array.from({ length: 16 }, () => {
          const base = 12
          const variance = Math.random() * 45 * Math.max(0.2, audioLevel * 2)
          return Math.min(80, Math.round(base + variance))
        })
      )
    }, 90)

    return () => clearInterval(interval)
  }, [isRecording, audioLevel, mode])

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-md">
      
      {/* Left: Recording Status Badge */}
      <div className="flex items-center gap-3">
        {mode === 'voice' ? (
          <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 px-3 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-200">
              Recording Assessment
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-blue-950/80 border border-blue-500/40 px-3 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Text-Based Mode
            </span>
          </div>
        )}

        <span className="font-mono text-xs sm:text-sm font-bold text-slate-300">
          {formatTimer(secondsElapsed)}
        </span>
      </div>

      {/* Center: Dynamic Audio Waveform Animation (Voice mode) */}
      {mode === 'voice' && (
        <div className="flex items-center gap-1 h-10 px-3 flex-1 justify-center max-w-xs">
          {bars.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${height}%`,
                backgroundColor:
                  audioLevel > 0.15
                    ? i % 3 === 0
                      ? '#38bdf8'
                      : '#60a5fa'
                    : '#475569',
              }}
            />
          ))}
        </div>
      )}

      {/* Right: Signal Quality indicator */}
      <div className="text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Dual-Stream Acoustic Active</span>
      </div>

    </div>
  )
}
