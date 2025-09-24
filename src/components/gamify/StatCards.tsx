import React from 'react'
import { Flame, Award, Star } from 'lucide-react'

type Stat = { id: string; label: string; value: string | number; sub?: string; icon?: React.ReactNode; progress?: number }

export default function StatCards({ stats }: { stats: Stat[] }) {
  const icons = [<Flame key="f" className="h-4 w-4" />, <Award key="a" className="h-4 w-4" />, <Star key="s" className="h-4 w-4" />]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((s, i) => (
        <div
          key={s.id}
          className="relative overflow-hidden rounded-2xl border border-white/10 p-5 backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, rgba(59,92,255,0.12), rgba(255,255,255,0.04))' }}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/20 blur-2xl" />
          <div className="mb-3 inline-flex items-center gap-2 text-sm text-brand-200">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/15 text-brand-200">
              {s.icon ?? icons[i % icons.length]}
            </span>
            {s.label}
          </div>
          <div className="text-3xl font-extrabold">{s.value}</div>
          {s.sub && <div className="mt-1 text-sm text-slate-300">{s.sub}</div>}
          {typeof s.progress === 'number' && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                <span>Progress</span>
                <span>{Math.round(s.progress * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
                <div className="h-full stripes rounded-full bg-gradient-to-r from-emerald-400 via-brand-500 to-brand-600" style={{ width: `${Math.min(Math.max(s.progress, 0), 1) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
