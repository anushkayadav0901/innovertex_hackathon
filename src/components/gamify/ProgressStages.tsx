import React, { useEffect, useState } from 'react'

type Stage = {
  name: string
  percent: number // 0 - 100
}

export default function ProgressStages({ stages }: { stages: Stage[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="card p-6">
      <h3 className="mb-4">Hackathon Progress</h3>
      <div className="space-y-4">
        {stages.map((s, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{s.name}</span>
              <span>{s.percent}%</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full border border-white/10 bg-white/5 neon">
              {/* segment markers */}
              <div className="pointer-events-none absolute inset-0 flex justify-between px-1">
                {Array.from({ length: 9 }).map((_, k) => (
                  <div key={k} className="h-full w-px bg-white/10" />
                ))}
              </div>
              {/* progress fill */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 shadow-[0_0_24px_rgba(59,92,255,0.5)] animate-progress stripes"
                style={{ width: mounted ? `${s.percent}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
