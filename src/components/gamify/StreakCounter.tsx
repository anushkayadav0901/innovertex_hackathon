import React, { useMemo } from 'react'

export default function StreakCounter({ days }: { days: number }) {
  const sparks = useMemo(() => Array.from({ length: 6 }, (_, i) => i), [])
  return (
    <div className="card flex items-center justify-between p-6">
      <div>
        <h3>Daily Streak</h3>
        <div className="mt-1 text-sm text-slate-300">Keep up the momentum!</div>
      </div>
      <div className="relative">
        <div className="text-4xl">🔥</div>
        {sparks.map(i => (
          <div key={i} className="pointer-events-none absolute -left-2 -top-2 animate-spark" style={{ animationDelay: `${i * 120}ms` }}>✨</div>
        ))}
      </div>
      <div className="rounded-xl bg-white/10 px-4 py-2 text-xl font-semibold">{days} days</div>
    </div>
  )
}
