import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function HackathonDetail() {
  const { id } = useParams()
  const hack = useStore(s => (id ? s.hackathons[id] : undefined))
  const registerTeam = useStore(s => s.registerTeam)
  const currentUserId = useStore(s => s.session.currentUserId)
  const [teamName, setTeamName] = useState('')

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">{hack?.title}</h2>
        <p className="mt-1 text-sm text-slate-300">by {hack?.org} • {hack?.dateRange}</p>
        <p className="mt-2 text-slate-300">{hack?.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {hack?.tags.map(t => <span key={t} className="badge">{t}</span>)}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="card p-4">
            <h4 className="font-semibold">Register your team</h4>
            <div className="mt-2 flex gap-2">
              <input className="input" placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} />
              <button className="btn-primary" onClick={() => {
                if (!id) return
                if (!currentUserId) {
                  alert('Please login to register')
                  return
                }
                if (!teamName.trim()) {
                  alert('Enter a team name')
                  return
                }
                const teamId = registerTeam(id, teamName.trim())
                alert('Team registered! Now go to Submission Portal from Dashboard.')
                setTeamName('')
              }}>Register</button>
            </div>
          </div>
          <div className="card p-4">
            <h4 className="font-semibold">Judging Criteria</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
              {hack?.criteria.map(c => (
                <li key={c.id}>{c.label} (max {c.max})</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link to="/discover" className="btn-primary bg-white/10 hover:bg-white/20">Back to Discover</Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold">Announcements</h3>
          <ul className="mt-2 list-disc pl-5 text-slate-300 text-sm">
            <li>Kickoff at 10:00 AM IST</li>
            <li>Team formation closes at 2:00 PM</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">FAQs</h3>
          <ul className="mt-2 list-disc pl-5 text-slate-300 text-sm">
            <li>Team size: 1-4</li>
            <li>Submission: GitHub link and slide deck</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
