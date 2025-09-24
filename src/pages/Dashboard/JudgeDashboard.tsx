import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export default function JudgeDashboard() {
  const subs = Object.values(useStore(s => s.submissions))
  const hackathons = useStore(s => s.hackathons)
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Submissions to Review</h2>
        <ul className="mt-3 space-y-2">
          {subs.map(su => (
            <li key={su.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div>
                <div className="font-medium">{su.title}</div>
                <div className="text-sm text-slate-300">{hackathons[su.hackathonId]?.title}</div>
              </div>
              <Link to={`/evaluate/${su.id}`} className="btn-primary">Evaluate</Link>
            </li>
          ))}
          {subs.length === 0 && <p className="text-sm text-slate-300">No submissions yet.</p>}
        </ul>
      </div>
    </div>
  )
}
