import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import SubmissionPreview from '@/components/SubmissionPreview'
import { HelpCircle, Send, AlertCircle } from 'lucide-react'

export default function ParticipantDashboard() {
  const currentUserId = useStore(s => s.session.currentUserId)!
  const teams = Object.values(useStore(s => s.teams)).filter(t => t.members.includes(currentUserId))
  const submissions = Object.values(useStore(s => s.submissions)).filter(su => teams.some(t => t.id === su.teamId))
  const createHelpRequest = useStore(s => s.createHelpRequest)
  
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [helpMessage, setHelpMessage] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')
  const [showHelpForm, setShowHelpForm] = useState(false)

  const handleSubmitHelp = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTeam && helpMessage.trim()) {
      const team = teams.find(t => t.id === selectedTeam)
      if (team) {
        createHelpRequest(selectedTeam, team.hackathonId, helpMessage, priority)
        setHelpMessage('')
        setSelectedTeam('')
        setPriority('normal')
        setShowHelpForm(false)
        alert('Help request sent to mentors!')
      }
    }
  }

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

      {/* Request Help from Mentors */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-blue-400"/>Request Help from Mentors</h2>
          {!showHelpForm && teams.length > 0 && (
            <button onClick={() => setShowHelpForm(true)} className="btn-primary text-sm">
              <Send className="h-4 w-4 inline mr-1"/>New Request
            </button>
          )}
        </div>
        
        {showHelpForm && teams.length > 0 ? (
          <form onSubmit={handleSubmitHelp} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 block mb-1">Select Team</label>
              <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="input" required>
                <option value="">Choose a team...</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-1">What do you need help with?</label>
              <textarea 
                value={helpMessage} 
                onChange={(e) => setHelpMessage(e.target.value)} 
                className="input min-h-[100px]" 
                placeholder="Describe your question or challenge..."
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-1">Priority</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" value="normal" checked={priority === 'normal'} onChange={(e) => setPriority('normal')} />
                  <span className="text-sm">Normal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" value="urgent" checked={priority === 'urgent'} onChange={(e) => setPriority('urgent')} />
                  <span className="text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4 text-red-400"/>Urgent</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Send Request</button>
              <button type="button" onClick={() => { setShowHelpForm(false); setHelpMessage(''); setSelectedTeam(''); }} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10">Cancel</button>
            </div>
          </form>
        ) : teams.length === 0 ? (
          <p className="text-sm text-slate-400">Join a team first to request help from mentors.</p>
        ) : (
          <p className="text-sm text-slate-400">Click "New Request" to ask mentors for help.</p>
        )}
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
