import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Calendar, Clock, CheckCircle2, Hourglass, Users } from 'lucide-react'

export default function JudgeHub() {
  const navigate = useNavigate()
  const hackathons = useStore(s => s.hackathons)
  const applyAsJudge = useStore(s => s.applyAsJudge)
  const applications = useStore(s => s.judgeApplications)
  const currentUserId = useStore(s => s.session.currentUserId)

  const now = Date.now()
  const all = Object.values(hackathons)

  const { active, past, upcoming } = useMemo(() => {
    const active = [] as typeof all
    const past = [] as typeof all
    const upcoming = [] as typeof all

    for (const h of all) {
      const start = h.startAt ?? now
      const end = h.endAt ?? now
      if (start <= now && end >= now) active.push(h)
      else if (end < now) past.push(h)
      else upcoming.push(h)
    }

    // sort by startAt descending for active, past; ascending for upcoming
    active.sort((a,b) => (b.startAt ?? 0) - (a.startAt ?? 0))
    past.sort((a,b) => (b.startAt ?? 0) - (a.startAt ?? 0))
    upcoming.sort((a,b) => (a.startAt ?? 0) - (b.startAt ?? 0))

    return { active, past, upcoming }
  }, [hackathons])

  const getMyApplication = (hackathonId: string) => {
    if (!currentUserId) return undefined
    return Object.values(applications).find(a => a.hackathonId === hackathonId && a.userId === currentUserId)
  }

  return (
    <div className="space-y-6">
      <div
        className="card p-6 cursor-pointer transition-colors hover:bg-white/10"
        onClick={() => navigate('/discover')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/discover') }}
      >
        <h1 className="text-2xl font-bold mb-2">Judge Hub</h1>
        <p className="text-slate-300">Browse hackathons by timeline and jump into judging.</p>
      </div>

      {/* Active Hackathons */}
      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400"/>Active Hackathons</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {active.map(h => (
            <div key={h.id} className="rounded-xl bg-white/5 p-4 flex flex-col">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{h.title}</h3>
                <p className="text-sm text-slate-300">{h.org}</p>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4"/> {h.dateRange}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {h.tags.map(tag => (
                    <span key={tag} className="badge">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => navigate(`/judge/${h.id}`)}
                  className="btn-primary mt-4 inline-flex items-center gap-2"
                >
                  Evaluate
                </button>
              </div>
            </div>
          ))}
          {active.length === 0 && (
            <p className="text-slate-400">No active hackathons.</p>
          )}
        </div>
      </section>

      {/* Upcoming Hackathons */}
      <section className="card p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map(h => {
            const app = getMyApplication(h.id)
            return (
              <div key={h.id} className="rounded-xl bg-white/5 p-4 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{h.title}</h3>
                  <p className="text-sm text-slate-300">{h.org}</p>
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4"/> {h.dateRange}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {h.tags.map(tag => (
                      <span key={tag} className="badge">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    disabled={!!app}
                    onClick={() => applyAsJudge(h.id)}
                    className={`btn-primary ${app ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {app ? (app.status === 'pending' ? 'Applied (Pending)' : app.status === 'approved' ? 'Approved' : 'Rejected') : 'Apply to Judge'}
                  </button>
                </div>
              </div>
            )
          })}
          {upcoming.length === 0 && (
            <p className="text-slate-400">No upcoming hackathons.</p>
          )}
        </div>
      </section>

      {/* Past Hackathons */}
      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-slate-300"/>Past Hackathons</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {past.map(h => (
            <div key={h.id} className="rounded-xl bg-white/5 p-4">
              <h3 className="font-semibold text-lg">{h.title}</h3>
              <p className="text-sm text-slate-300">{h.org}</p>
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4"/> {h.dateRange}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {h.tags.map(tag => (
                  <span key={tag} className="badge">{tag}</span>
                ))}
              </div>
            </div>
          ))}
          {past.length === 0 && (
            <p className="text-slate-400">No past hackathons.</p>
          )}
        </div>
      </section>
    </div>
  )
}
