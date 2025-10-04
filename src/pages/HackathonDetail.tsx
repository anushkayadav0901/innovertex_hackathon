import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Calendar, Clock, Users, Target, CheckCircle2 } from 'lucide-react'

export default function HackathonDetail() {
  const { id } = useParams()
  const hack = useStore(s => (id ? s.hackathons[id] : undefined))
  const registerTeam = useStore(s => s.registerTeam)
  const currentUser = useStore(s => s.session.currentUserId ? s.users[s.session.currentUserId] : undefined)
  const mentorRequests = useStore(s => s.mentorRequests)
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
          {currentUser?.role === 'mentor' ? (
            <>
              <div className="card p-4">
                <h4 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4"/>Rounds & Schedule</h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-300"/> Day 1: Ideation & Team Check-ins</li>
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-300"/> Day 2: Build & Midway Demos</li>
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-300"/> Day 3: Final Submission & Presentations</li>
                </ul>
                <div className="mt-3 text-xs text-slate-400">Note: Mentors are expected to be present during check-ins and demo windows.</div>
              </div>
              <div className="card p-4">
                <h4 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4"/>Mentoring Info</h4>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  <li>Assist teams via the Mentor Dashboard Help Requests.</li>
                  <li>Share resources and guidance in Chat & Support.</li>
                  <li>Mark requests as resolved once addressed.</li>
                </ul>
                {currentUser && (()=>{
                  const myReq = Object.values(mentorRequests).find(r => r.hackathonId === id && r.mentorId === currentUser.id)
                  return myReq?.status === 'accepted' ? (
                    <div className="mt-3 inline-flex items-center gap-2 text-emerald-300 text-sm"><CheckCircle2 className="h-4 w-4"/>You are assigned as a mentor</div>
                  ) : null
                })()}
              </div>
            </>
          ) : (
            <>
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
                    registerTeam(id, teamName.trim())
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
            </>
          )}
        </div>
        <div className="mt-4">
          <Link to="/discover" className="btn-primary">Back</Link>
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
