import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import SubmissionPreview from '@/components/SubmissionPreview'

export default function ParticipantDashboard() {
  const currentUserId = useStore(s => s.session.currentUserId)!
  const teams = Object.values(useStore(s => s.teams)).filter(t => t.members.includes(currentUserId))
  const submissions = Object.values(useStore(s => s.submissions)).filter(su => teams.some(t => t.id === su.teamId))

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Your Teams</h2>
        <ul className="mt-3 space-y-2">
          {teams.map(t => (
            <li key={t.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <span>{t.name}</span>
              <Link to={`/submission/${t.hackathonId}/${t.id}`} className="btn-primary">Open Submission Portal</Link>
            </li>
          ))}
          {teams.length === 0 && <p className="text-sm text-slate-300">You are not part of any team yet. Go to a hackathon and register.</p>}
        </ul>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Your Submissions</h2>
        <ul className="mt-3 space-y-2">
          {submissions.map(su => (
            <li key={su.id} className="rounded-lg bg-white/5 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{su.title}</span>
                <span className="badge">{new Date(su.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-slate-300">
                {su.repoUrl && <a href={su.repoUrl} className="badge">Repo</a>}
                {su.figmaUrl && <a href={su.figmaUrl} className="badge">Figma</a>}
                {su.driveUrl && <a href={su.driveUrl} className="badge">Drive</a>}
                {su.deckUrl && <a href={su.deckUrl} className="badge">Deck</a>}
              </div>
              <SubmissionPreview submission={su} />
            </li>
          ))}
          {submissions.length === 0 && <p className="text-sm text-slate-300">No submissions yet.</p>}
        </ul>
      </div>
    </div>
  )
}
