import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Row = { id: string; name: string; score: number }

type Props = { rows: Row[] }

const podiumColors = ['text-amber-300', 'text-slate-300', 'text-amber-700']

export default function AnimatedLeaderboard({ rows }: Props) {
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score')
  const [asc, setAsc] = useState(false)

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const dir = asc ? 1 : -1
      if (sortBy === 'score') return (a.score - b.score) * dir
      return a.name.localeCompare(b.name) * dir
    })
    return copy
  }, [rows, sortBy, asc])

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3>Leaderboard</h3>
        <div className="flex items-center gap-2 text-sm">
          <button className="badge" onClick={() => setSortBy('score')}>Sort: Score</button>
          <button className="badge" onClick={() => setSortBy('name')}>Sort: Name</button>
          <button className="badge" onClick={() => setAsc(a => !a)}>{asc ? 'Asc' : 'Desc'}</button>
        </div>
      </div>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((r, idx) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md"
              style={{ background: 'var(--card-bg)' }}
            >
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${idx < 3 ? podiumColors[idx] : 'text-brand-300'}`}>#{idx + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 text-sm">
                  {r.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <span>{r.name}</span>
                {idx < 3 && <span className="ml-1">{idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}</span>}
              </div>
              <div className="flex items-center gap-3">
                {/* rank delta mock based on score parity for demo */}
                <span className={`text-xs ${r.score % 2 === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {r.score % 2 === 0 ? '▲ +1' : '▼ -1'}
                </span>
                <span className="badge">{r.score} pts</span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
