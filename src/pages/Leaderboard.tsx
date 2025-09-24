import React from 'react'
import { useStore } from '@/store/useStore'

export default function Leaderboard() {
  const submissions = Object.values(useStore(s => s.submissions))
  const evaluations = Object.values(useStore(s => s.evaluations))
  const scores = submissions.map(su => {
    const evs = evaluations.filter(e => e.submissionId === su.id)
    const total = evs.reduce((acc, e) => acc + e.scores.reduce((a, s) => a + s.score, 0), 0)
    return { submission: su, total }
  }).sort((a, b) => b.total - a.total)

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">Leaderboard</h2>
      <ul className="mt-3 space-y-2">
        {scores.map((row, idx) => (
          <li key={row.submission.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
            <div>
              <span className="font-medium">#{idx + 1}</span>
              <span className="ml-3">{row.submission.title}</span>
            </div>
            <span className="badge">{row.total} pts</span>
          </li>
        ))}
        {scores.length === 0 && <p className="text-sm text-slate-300">No results yet.</p>}
      </ul>
    </div>
  )
}
