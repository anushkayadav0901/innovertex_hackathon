import React from 'react'
import { useStore } from '@/store/useStore'
import { Link } from 'react-router-dom'

export default function OrganizerDashboard() {
  const hacks = Object.values(useStore(s => s.hackathons))
  const teams = Object.values(useStore(s => s.teams))
  const submissions = Object.values(useStore(s => s.submissions))

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Your Hackathons</h2>
        <div className="mt-3">
          <Link to="/organizer/create" className="btn-primary">Create New Hackathon</Link>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {hacks.map(h => (
            <li key={h.id} className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{h.title}</span>
                <span className="badge">{h.tags.join(', ')}</span>
              </div>
              <p className="text-slate-300">{h.dateRange}</p>
              <div className="mt-2 flex gap-2">
                <Link to={`/hackathons/${h.id}`} className="btn-primary bg-white/10 hover:bg-white/20">View</Link>
                <Link to={`/comms/${h.id}`} className="btn-primary bg-white/10 hover:bg-white/20">Communication Hub</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold">Teams</h3>
          <p className="text-sm text-slate-300">Total teams: {teams.length}</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">Submissions</h3>
          <p className="text-sm text-slate-300">Total submissions: {submissions.length}</p>
        </div>
      </div>
    </div>
  )
}
