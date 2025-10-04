import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Calendar, Clock, Users, Target, CheckCircle2 } from 'lucide-react'
import EnhancedTeamBuilderModal from '@/components/team/EnhancedTeamBuilderModal'
import TeamMatchingResults from '@/components/team/TeamMatchingResults'
import { findMatchingMembers } from '@/data/teamMembersData'

// Define TeamCriteria interface to match the one in EnhancedTeamBuilderModal
interface TeamCriteria {
  personalityTraits: {
    creativity: 'low' | 'moderate' | 'high' | null
    leadership: 'low' | 'moderate' | 'high' | null
    teamwork: 'low' | 'moderate' | 'high' | null
    organization: 'low' | 'moderate' | 'high' | null
    problemSolving: 'low' | 'moderate' | 'high' | null
    adaptability: 'low' | 'moderate' | 'high' | null
  }
  techStack: {
    required: string[]
    preferred: string[]
    experience: 'junior' | 'mid' | 'senior' | 'any'
  }
  availability: 'full-time' | 'part-time' | 'any'
  location: 'remote' | 'onsite' | 'hybrid' | 'any'
}

export default function HackathonDetail() {
  const { id } = useParams()
  const hack = useStore(s => (id ? s.hackathons[id] : undefined))
  const registerTeam = useStore(s => s.registerTeam)
  const currentUser = useStore(s => s.session.currentUserId ? s.users[s.session.currentUserId] : undefined)
  const mentorRequests = useStore(s => s.mentorRequests)
  const currentUserId = useStore(s => s.session.currentUserId)
  const [teamName, setTeamName] = useState('')
  // Local modal + toast state
  const [inviteOpen, setInviteOpen] = useState(false)
  const [buildOpen, setBuildOpen] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [copyToast, setCopyToast] = useState(false)
  const [traits, setTraits] = useState({
    creativity: '', teamwork: '', communication: '', problemSolving: '', adaptability: ''
  })
  
  // Enhanced team builder state
  const [showEnhancedModal, setShowEnhancedModal] = useState(false)
  const [showMatchingResults, setShowMatchingResults] = useState(false)
  const [matchingCriteria, setMatchingCriteria] = useState<TeamCriteria | null>(null)
  const [matchingMembers, setMatchingMembers] = useState<any[]>([])

  const handleInvite = () => {
    if (!teamName.trim()) {
      alert('Enter a team name to generate an invite link')
      return
    }
    const teamId = btoa(`${id || 'hack'}-${teamName.trim()}-${Date.now()}`).replace(/=+$/,'')
    const link = `${window.location.origin}/join/${teamId}`
    setInviteLink(link)
    setInviteOpen(true)
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(inviteLink); setCopyToast(true) } catch {}
  }

  const handleBuildSubmit = () => {
    try { localStorage.setItem('build:traits', JSON.stringify(traits)) } catch {}
    setBuildOpen(false)
  }

  const handleFindMatches = (criteria: TeamCriteria) => {
    const matches = findMatchingMembers(criteria)
    setMatchingCriteria(criteria)
    setMatchingMembers(matches)
    setShowMatchingResults(true)
  }

  const handleInviteMember = (member: any) => {
    // Here you would typically send an invitation
    alert(`Invitation sent to ${member.name}!`)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">{hack?.title}</h2>
        <p className="mt-1 text-sm text-slate-300">by {hack?.org} • {hack?.dateRange}</p>
        <p className="mt-2 text-slate-300">{hack?.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {hack?.tags.map(t => <span key={t} className="badge">{t}</span>)}
        </div>

      {/* Invite via Link Modal (no external UI lib) */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-4">
            <div className="text-lg font-semibold text-slate-100">Invite via Link</div>
            <div className="mt-3 space-y-2">
              <label className="text-xs text-slate-400">Invite Link</label>
              <input value={inviteLink} readOnly className="input w-full" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-primary bg-white/10 hover:bg-white/20" onClick={handleCopy}>Copy</button>
              <button className="btn-primary" onClick={() => setInviteOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Build Team Modal */}
      {buildOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-slate-900 p-4">
            <div className="text-lg font-semibold text-slate-100">Desired Teammate Traits</div>
            <div className="mt-3 grid gap-3">
              <div>
                <label className="text-xs text-slate-400">Creativity</label>
                <textarea className="input w-full min-h-[64px]" value={traits.creativity} onChange={(e)=>setTraits(t=>({...t, creativity: (e.target as HTMLTextAreaElement).value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-400">Teamwork</label>
                <textarea className="input w-full min-h-[64px]" value={traits.teamwork} onChange={(e)=>setTraits(t=>({...t, teamwork: (e.target as HTMLTextAreaElement).value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-400">Communication</label>
                <textarea className="input w-full min-h-[64px]" value={traits.communication} onChange={(e)=>setTraits(t=>({...t, communication: (e.target as HTMLTextAreaElement).value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-400">Problem Solving</label>
                <textarea className="input w-full min-h-[64px]" value={traits.problemSolving} onChange={(e)=>setTraits(t=>({...t, problemSolving: (e.target as HTMLTextAreaElement).value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-400">Adaptability</label>
                <textarea className="input w-full min-h-[64px]" value={traits.adaptability} onChange={(e)=>setTraits(t=>({...t, adaptability: (e.target as HTMLTextAreaElement).value}))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-primary bg-white/10 hover:bg-white/20" onClick={() => setBuildOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleBuildSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Simple toast */}
      {copyToast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-emerald-400/30 bg-emerald-900/40 px-3 py-2 text-sm text-emerald-200 shadow" onAnimationEnd={() => setTimeout(()=>setCopyToast(false), 1500)}>
          Link copied
        </div>
      )}

      {/* Enhanced Team Builder Modal */}
      <EnhancedTeamBuilderModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onFindMatches={handleFindMatches}
      />

      {/* Team Matching Results */}
      {showMatchingResults && matchingCriteria && (
        <TeamMatchingResults
          criteria={matchingCriteria}
          matches={matchingMembers}
          onClose={() => setShowMatchingResults(false)}
          onInviteMember={handleInviteMember}
        />
      )}
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
                    const teamId = registerTeam(id, teamName.trim())
                    alert('Team registered! Now go to Submission Portal from Dashboard.')
                    setTeamName('')
                  }}>Register</button>
                </div>
                {/* Actions below Team Name */}
                <div className="mt-3">
                  <div className="flex gap-2">
                    <button className="btn-primary bg-white/10 hover:bg-white/20" onClick={handleInvite}>Invite via Link</button>
                    <button className="btn-primary" onClick={() => setShowEnhancedModal(true)}>Build Team</button>
                  </div>
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
    </div>
  )
}
