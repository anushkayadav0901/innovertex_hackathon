import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { UserPlus2, CheckCircle2, Hourglass } from 'lucide-react'

export default function Discover() {
  const allHackathons = useStore(s => s.hackathons)
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const mentorRequests = useStore(s => s.mentorRequests)
  const requestMentorForHackathon = useStore(s => s.requestMentorForHackathon)
  const hackathons = useMemo(() => {
    const list = Object.values(allHackathons)
    if (user?.role === 'organizer') {
      return list.filter(h => h.organizerId === user.id)
    }
    return list
  }, [allHackathons, user?.role, user?.id])
  return (
    <div>
      <h2 className="text-2xl font-bold">{user?.role === 'organizer' ? 'Your Active Hackathons' : 'Discover Hackathons'}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hackathons.map(h => (
          <div key={h.id} className="card p-6 hover:shadow-glow transition">
            <div className="flex items-center justify-between">
              <Link to={user?.role === 'organizer' ? `/organizer/manage/${h.id}` : `/hackathons/${h.id}`} className="text-lg font-semibold hover:underline">{h.title}</Link>
              <span className="badge">{h.prize}</span>
            </div>
            <p className="mt-1 text-sm text-slate-300">by {h.org}</p>
            <p className="mt-1 text-xs text-slate-400">{h.dateRange}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {h.tags.map(t => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>

            {/* Mentor request action */}
            {user?.role === 'mentor' && (
              <div className="mt-4 flex items-center justify-between">
                {(() => {
                  const myReq = Object.values(mentorRequests).find(r => r.hackathonId === h.id && r.mentorId === user.id)
                  if (myReq?.status === 'accepted') {
                    return <span className="inline-flex items-center gap-1 text-emerald-300 text-sm"><CheckCircle2 className="h-4 w-4"/>Accepted</span>
                  }
                  if (myReq?.status === 'pending') {
                    return <span className="inline-flex items-center gap-1 text-amber-300 text-sm"><Hourglass className="h-4 w-4"/>Request sent</span>
                  }
                  return (
                    <button
                      onClick={() => requestMentorForHackathon(h.id)}
                      className="px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-200 hover:bg-emerald-600/30 border border-emerald-600/40 inline-flex items-center gap-2 text-sm"
                    >
                      <UserPlus2 className="h-4 w-4"/> Request to Mentor
                    </button>
                  )
                })()}
                <Link to={`/hackathons/${h.id}`} className="text-sm text-slate-300 hover:text-white">View details →</Link>
              </div>
            )}
            {user?.role === 'organizer' && (
              <div className="mt-4 text-right">
                <Link to={`/organizer/manage/${h.id}`} className="text-sm text-slate-300 hover:text-white">Manage hackathon →</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
