import React from 'react'

type Badge = { id: string; label: string; emoji: string }

export default function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="card p-6">
      <h3 className="mb-4">Badge Collection</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {badges.map(b => (
          <div key={b.id} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md" style={{ background: 'var(--card-bg)' }}>
            <div className="text-2xl">{b.emoji}</div>
            <div className="text-xs text-slate-300">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
