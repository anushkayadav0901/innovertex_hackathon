import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { MessageCircle, Filter, Clock, CheckCircle2, AlertCircle, Users, Search, Bell, Send, AlertTriangle, Activity, TrendingUp, Mail, Zap, Target } from 'lucide-react'

export default function MentorDashboard() {
  const users = useStore(s => s.users)
  const teams = useStore(s => s.teams)
  const submissions = useStore(s => s.submissions)
  const hackathons = useStore(s => s.hackathons)
  const session = useStore(s => s.session)
  const helpRequests = Object.values(useStore(s => s.helpRequests))
  const mentorActivities = Object.values(useStore(s => s.mentorActivities))
  const mentorRequests = Object.values(useStore(s => s.mentorRequests))
  const resolveHelpRequest = useStore(s => s.resolveHelpRequest)
  const addMentorActivity = useStore(s => s.addMentorActivity)
  const requestMentorForHackathon = useStore(s => s.requestMentorForHackathon)
  const acceptMentorRequest = useStore(s => s.acceptMentorRequest)
  const { hackathonId } = useParams<{ hackathonId?: string }>()

  const currentUser = session.currentUserId ? users[session.currentUserId] : null
  const [filter, setFilter] = useState<'all'|'urgent'|'pending'|'resolved'>('all')
  const [search, setSearch] = useState('')
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  
  // Filter help requests (optionally by hackathon)
  const filtered = useMemo(() => {
    return helpRequests.filter(r => {
      if (hackathonId && r.hackathonId !== hackathonId) return false
      if (filter !== 'all') {
        if (filter === 'urgent' && r.priority !== 'urgent') return false
        if (filter === 'pending' && r.status !== 'pending') return false
        if (filter === 'resolved' && r.status !== 'resolved') return false
      }

  // Ensure current mentor has accepted assignments for seeded hackathons if none
  useEffect(() => {
    if (!session.currentUserId) return
    const me = users[session.currentUserId]
    if (me?.role !== 'mentor') return
    const myAcceptedCount = mentorRequests.filter(r => r.mentorId === me.id && r.status === 'accepted').length
    if (myAcceptedCount === 0) {
      const seeds = ['hx-1', 'hx-2'].filter(id => !!hackathons[id])
      seeds.forEach(hid => {
        const existing = mentorRequests.find(r => r.hackathonId === hid && r.mentorId === me.id)
        if (existing) {
          if (existing.status !== 'accepted') acceptMentorRequest(existing.id)
        } else {
          const rid = requestMentorForHackathon(hid)
          acceptMentorRequest(rid)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.currentUserId, users, hackathons])
      if (search.trim()) {
        const team = teams[r.teamId]
        const hay = `${team?.name || ''} ${r.message}`.toLowerCase()
        if (!hay.includes(search.toLowerCase())) return false
      }
      return true
    }).sort((a, b) => b.createdAt - a.createdAt)
  }, [helpRequests, filter, search, teams, hackathonId])

  // Stats
  const stats = useMemo(() => {
    const inScope = helpRequests.filter(r => (hackathonId ? r.hackathonId === hackathonId : true))
    const pending = inScope.filter(r => r.status === 'pending').length
    const urgent = inScope.filter(r => r.status === 'pending' && r.priority === 'urgent').length
    const myResolved = inScope.filter(r => r.status === 'resolved' && r.assignedMentorId === session.currentUserId).length
    return { pending, urgent, myResolved }
  }, [helpRequests, session.currentUserId, hackathonId])

  // My activities today
  const myActivities = useMemo(() => {
    const today = Date.now() - 24 * 60 * 60 * 1000
    return mentorActivities.filter(a => a.mentorId === session.currentUserId && a.createdAt > today).sort((a,b) => b.createdAt - a.createdAt)
  }, [mentorActivities, session.currentUserId])

  const activeRequest = useMemo(() => helpRequests.find(r => r.id === activeRequestId), [helpRequests, activeRequestId])

  const handleResolve = (requestId: string) => {
    if (session.currentUserId) {
      const req = helpRequests.find(r => r.id === requestId)
      if (req) {
        resolveHelpRequest(requestId, session.currentUserId)
        addMentorActivity(req.teamId, req.hackathonId, 'resolved_request', 'Resolved help request')
      }
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeRequest && messageText.trim() && session.currentUserId) {
      addMentorActivity(activeRequest.teamId, activeRequest.hackathonId, 'chat', messageText)
      setMessageText('')
    }
  }

  // Get active hackathons for this mentor
  const myAccepted = useMemo(() => {
    if (!session.currentUserId) return []
    return mentorRequests.filter(r => r.mentorId === session.currentUserId && r.status === 'accepted')
  }, [mentorRequests, session.currentUserId])

  const activeHackathons = useMemo(() => {
    const now = Date.now()
    return myAccepted
      .map(r => hackathons[r.hackathonId])
      .filter(h => h && (h.endAt ? h.endAt > now : true))
  }, [myAccepted, hackathons])

  // If no hackathon selected, show Active Hackathons selection page
  if (!hackathonId) {
    if (activeHackathons.length > 0) {
      return (
        <div className="space-y-6">
          <div className="card p-6">
            <h1 className="text-2xl font-bold text-emerald-300">Mentor Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1">Welcome back, {currentUser?.name || 'Mentor'}! Select a hackathon to view help requests.</p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Active Hackathons</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeHackathons.map(h => {
                const hackRequests = helpRequests.filter(r => r.hackathonId === h.id)
                const pending = hackRequests.filter(r => r.status === 'pending').length
                const urgent = hackRequests.filter(r => r.status === 'pending' && r.priority === 'urgent').length
                
                return (
                  <Link key={h.id} to={`/mentor/${h.id}`} className="card p-4 hover:shadow-glow transition group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-emerald-300 transition">{h.title}</h3>
                      {urgent > 0 && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{h.org} • {h.dateRange}</p>
                    <div className="flex gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-amber-400"/>
                        <span className="text-slate-300">{pending} pending</span>
                      </div>
                      {urgent > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-400"/>
                          <span className="text-red-300">{urgent} urgent</span>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )
    } else {
      // No active hackathons - show message to request mentoring
      return (
        <div className="space-y-6">
          <div className="card p-6">
            <h1 className="text-2xl font-bold text-emerald-300">Mentor Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1">Welcome back, {currentUser?.name || 'Mentor'}!</p>
          </div>

          <div className="card p-6 text-center">
            <Users className="h-16 w-16 mx-auto text-slate-600 mb-4"/>
            <h2 className="text-xl font-semibold mb-2">No Active Hackathons</h2>
            <p className="text-slate-400 mb-4">You haven't been assigned to any hackathons yet.</p>
            <Link to="/discover" className="btn-primary inline-flex items-center gap-2">
              <Target className="h-4 w-4"/>
              Find Hackathons to Mentor
            </Link>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb for selected hackathon */}
      {hackathonId && activeHackathons.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/mentor" className="text-sm text-slate-300 hover:text-white">← Active Hackathons</Link>
              <span className="text-slate-500">/</span>
              <span className="text-sm text-emerald-300">{hackathons[hackathonId]?.title}</span>
            </div>
          </div>
        </div>
      )}
      {/* Header + Notification Badge */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-300">Mentor Dashboard</h1>
            <p className="text-slate-300 text-sm">Welcome back, {currentUser?.name || 'Mentor'}! Ready to help teams succeed.</p>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-emerald-400" />
            {stats.urgent > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                {stats.urgent}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Pending Requests</div>
              <div className="text-2xl font-bold text-amber-300">{stats.pending}</div>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        <div className="card p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Urgent</div>
              <div className="text-2xl font-bold text-red-300">{stats.urgent}</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="card p-4 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Resolved by You</div>
              <div className="text-2xl font-bold text-emerald-300">{stats.myResolved}</div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Help Request Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-emerald-400"/>Help Request Tracker</h2>
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="input pl-9 pr-3 py-1.5 text-sm w-40" />
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
                  <button onClick={()=>setFilter('all')} className={`px-2 py-1 text-xs rounded ${filter==='all'?'bg-emerald-600 text-white':'text-slate-300 hover:bg-white/5'}`}>All</button>
                  <button onClick={()=>setFilter('urgent')} className={`px-2 py-1 text-xs rounded ${filter==='urgent'?'bg-red-600 text-white':'text-slate-300 hover:bg-white/5'}`}>Urgent</button>
                  <button onClick={()=>setFilter('pending')} className={`px-2 py-1 text-xs rounded ${filter==='pending'?'bg-amber-600 text-white':'text-slate-300 hover:bg-white/5'}`}>Pending</button>
                  <button onClick={()=>setFilter('resolved')} className={`px-2 py-1 text-xs rounded ${filter==='resolved'?'bg-emerald-600 text-white':'text-slate-300 hover:bg-white/5'}`}>Resolved</button>
                </div>
              </div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map(r => {
                const team = teams[r.teamId]
                const hackathon = hackathons[r.hackathonId]
                const isActive = activeRequestId === r.id
                return (
                  <div key={r.id} onClick={()=>setActiveRequestId(r.id)} className={`rounded-lg bg-gradient-to-r from-white/5 to-white/3 hover:from-white/10 hover:to-white/5 p-3 cursor-pointer border transition-all ${isActive ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-white/10'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-sm">{team?.name || 'Team'}</div>
                      <div className="flex items-center gap-2">
                        {r.priority === 'urgent' && <Zap className="h-4 w-4 text-red-400" />}
                        <div className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(r.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{hackathon?.title || 'Hackathon'}</div>
                    <div className="text-sm text-slate-200 mb-2">{r.message}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.priority==='urgent'?'bg-red-600/30 text-red-200 border border-red-600/50':'bg-amber-600/20 text-amber-200 border border-amber-600/30'}`}>{r.priority}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status==='resolved'?'bg-emerald-600/30 text-emerald-200 border border-emerald-600/50':'bg-blue-600/20 text-blue-200 border border-blue-600/30'}`}>{r.status}</span>
                      </div>
                      {r.status === 'pending' && (
                        <button onClick={(e)=>{e.stopPropagation(); handleResolve(r.id)}} className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-600/40">Mark Resolved</button>
                      )}
                    </div>
                  </div>
                )
              })}
              {filtered.length===0 && <div className="text-center py-12"><TrendingUp className="h-12 w-12 mx-auto text-slate-600 mb-2"/><p className="text-sm text-slate-400">No requests found. Great job!</p></div>}
            </div>
          </div>

          {/* 4. Mentor Activity Log */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-400"/>My Activity Log (Today)</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {myActivities.map(a => {
                const team = teams[a.teamId]
                return (
                  <div key={a.id} className="rounded bg-white/5 p-2 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-xs">{team?.name || 'Team'}</div>
                      <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.type==='chat' && <MessageCircle className="h-3.5 w-3.5 text-blue-400"/>}
                      {a.type==='feedback' && <Mail className="h-3.5 w-3.5 text-purple-400"/>}
                      {a.type==='resolved_request' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/>}
                      <span className="text-xs text-slate-300">{a.note}</span>
                    </div>
                  </div>
                )
              })}
              {myActivities.length===0 && <p className="text-sm text-slate-400 text-center py-8">No activity yet today.</p>}
            </div>
          </div>
        </div>

        {/* Right Column: 2. Team Profile + 3. Chat Panel */}
        <div className="space-y-4">
          {/* 2. Team Profile */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-400"/>Team Profile</h2>
            {!activeRequest && <p className="text-sm text-slate-400 text-center py-8">Select a request to view team details</p>}
            {activeRequest && (()=>{
              const team = teams[activeRequest.teamId]
              const members = (team?.members || []).map((id: string)=>users[id]?.name).filter(Boolean)
              const proj = Object.values(submissions).find(s => s.teamId===activeRequest.teamId)
              const hackathon = hackathons[activeRequest.hackathonId]
              return (
                <div className="space-y-3">
                  <div className="rounded-lg bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-600/20 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-10 w-10 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-200 font-bold">
                        {team?.name?.charAt(0) || 'T'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{team?.name || 'Team'}</div>
                        <div className="text-xs text-slate-400">{hackathon?.title || 'Hackathon'}</div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2"><span className="text-slate-400">Project:</span><span className="text-slate-200">{proj?.title || 'Not submitted'}</span></div>
                      <div className="flex items-center gap-2"><span className="text-slate-400">Members:</span><span className="text-slate-200 text-xs">{members.join(', ') || 'N/A'}</span></div>
                      <div className="flex items-center gap-2"><span className="text-slate-400">Stage:</span><span className="px-2 py-0.5 rounded text-xs bg-blue-600/20 text-blue-200 border border-blue-600/30">In Progress</span></div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* 3. Chat/Support Panel */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><MessageCircle className="h-5 w-5 text-emerald-400"/>Chat & Support</h2>
            {!activeRequest && <p className="text-sm text-slate-400 text-center py-8">Select a request to send a message</p>}
            {activeRequest && (
              <form className="space-y-3" onSubmit={handleSendMessage}>
                <textarea value={messageText} onChange={(e)=>setMessageText(e.target.value)} className="input min-h-[120px] text-sm" placeholder="Type your guidance, tips, or resource links here..."/>
                <button type="submit" disabled={!messageText.trim()} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Send className="h-4 w-4"/>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
