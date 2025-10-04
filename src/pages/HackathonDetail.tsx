import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Grid, Snackbar, Alert } from '@mui/material'
import EnhancedTeamBuilderModal, { TeamCriteria } from '@/components/team/EnhancedTeamBuilderModal'
import TeamMatchingResults from '@/components/team/TeamMatchingResults'
import { findMatchingMembers } from '@/data/teamMembersData'

export default function HackathonDetail() {
  const { id } = useParams()
  const hack = useStore(s => (id ? s.hackathons[id] : undefined))
  const registerTeam = useStore(s => s.registerTeam)
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
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField label="Creativity" value={traits.creativity} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, creativity: e.target.value}))} fullWidth multiline minRows={2} /></Grid>
            <Grid item xs={12}><TextField label="Teamwork" value={traits.teamwork} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, teamwork: e.target.value}))} fullWidth multiline minRows={2} /></Grid>
            <Grid item xs={12}><TextField label="Communication" value={traits.communication} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, communication: e.target.value}))} fullWidth multiline minRows={2} /></Grid>
            <Grid item xs={12}><TextField label="Problem Solving" value={traits.problemSolving} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, problemSolving: e.target.value}))} fullWidth multiline minRows={2} /></Grid>
            <Grid item xs={12}><TextField label="Adaptability" value={traits.adaptability} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTraits(t=>({...t, adaptability: e.target.value}))} fullWidth multiline minRows={2} /></Grid>
          </Grid>
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
        </div>
        <div className="mt-4 flex gap-3">
          <Link to="/discover" className="btn-primary bg-white/10 hover:bg-white/20">Back to Discover</Link>
        </div>
      </div>
    </div>
  )
}
