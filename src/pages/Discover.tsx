import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export default function Discover() {
  const hackathons = Object.values(useStore(s => s.hackathons))
  return (
    <div>
      <h2 className="text-2xl font-bold">Discover Hackathons</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hackathons.map(h => (
          <Link to={`/hackathons/${h.id}`} key={h.id} className="card p-6 hover:shadow-glow transition">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{h.title}</h3>
              <span className="badge">{h.prize}</span>
            </div>
            <p className="mt-1 text-sm text-slate-300">by {h.org}</p>
            <p className="mt-1 text-xs text-slate-400">{h.dateRange}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {h.tags.map(t => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
