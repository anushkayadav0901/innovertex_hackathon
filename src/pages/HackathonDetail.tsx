import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Snackbar, Alert } from '@mui/material'
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
  // MUI dialogs state
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

      {/* Invite via Link Dialog */}
      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Invite via Link</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Invite Link" value={inviteLink} InputProps={{ readOnly: true }} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy}>Copy</Button>
          <Button onClick={() => setInviteOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Build Team Dialog */}
      <Dialog open={buildOpen} onClose={() => setBuildOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Desired Teammate Traits</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Creativity" value={traits.creativity} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, creativity: e.target.value}))} fullWidth multiline minRows={2} />
            <TextField label="Teamwork" value={traits.teamwork} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, teamwork: e.target.value}))} fullWidth multiline minRows={2} />
            <TextField label="Communication" value={traits.communication} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, communication: e.target.value}))} fullWidth multiline minRows={2} />
            <TextField label="Problem Solving" value={traits.problemSolving} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, problemSolving: e.target.value}))} fullWidth multiline minRows={2} />
            <TextField label="Adaptability" value={traits.adaptability} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, adaptability: e.target.value}))} fullWidth multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuildOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBuildSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={copyToast} autoHideDuration={2000} onClose={() => setCopyToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Link copied</Alert>
      </Snackbar>

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
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" onClick={handleInvite}>Invite via Link</Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => setShowEnhancedModal(true)}
                      sx={{ 
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                        }
                      }}
                    >
                      Build Team
                    </Button>
                  </Stack>
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
