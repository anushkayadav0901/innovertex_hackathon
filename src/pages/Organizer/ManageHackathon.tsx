import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export default function ManageHackathon() {
  const { id } = useParams()
  const hack = useStore(s => (id ? s.hackathons[id] : undefined))
  const updateHackathon = useStore(s => s.updateHackathon)
  const currentUserId = useStore(s => s.session.currentUserId)
  const isOrganizer = useMemo(() => !!hack && hack.organizerId === currentUserId, [hack, currentUserId])

  const [title, setTitle] = useState(hack?.title || '')
  const [org] = useState(hack?.org || '')
  const [dateRange, setDateRange] = useState(hack?.dateRange || '')
  const [venue, setVenue] = useState(hack?.venue || '')
  const [timeline, setTimeline] = useState(hack?.timeline || '')
  const [schedule, setSchedule] = useState(hack?.schedule || '')
  const [additionalInfo, setAdditionalInfo] = useState(hack?.additionalInfo || '')

  const [judges, setJudges] = useState<{ name: string; title?: string; org?: string }[]>(hack?.judges || [])
  const [mentors, setMentors] = useState<{ name: string; expertise?: string }[]>(hack?.mentors || [])

  if (!hack) {
    return (
      <div className="card p-6">
        <div className="text-xl font-semibold mb-2">Hackathon not found</div>
        <Link to="/discover" className="btn-primary">Back</Link>
      </div>
    )
  }

  const saveBasics = () => {
    // Organizer name is locked (from login); do not update 'org'
    updateHackathon(hack.id, { title, dateRange, venue, timeline, schedule, additionalInfo })
    alert('Saved basic information')
  }

  const addJudge = () => setJudges(list => [...list, { name: '' }])
  const updateJudge = (idx: number, key: 'name' | 'title' | 'org', value: string) => {
    setJudges(list => list.map((j, i) => (i === idx ? { ...j, [key]: value } : j)))
  }
  const removeJudge = (idx: number) => setJudges(list => list.filter((_, i) => i !== idx))
  const saveJudges = () => { updateHackathon(hack.id, { judges }); alert('Saved judges') }

  const addMentor = () => setMentors(list => [...list, { name: '' }])
  const updateMentor = (idx: number, key: 'name' | 'expertise', value: string) => {
    setMentors(list => list.map((m, i) => (i === idx ? { ...m, [key]: value } : m)))
  }
  const removeMentor = (idx: number) => setMentors(list => list.filter((_, i) => i !== idx))
  const saveMentors = () => { updateHackathon(hack.id, { mentors }); alert('Saved mentors') }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Manage: {hack.title}</h2>
            {!isOrganizer && <div className="text-sm text-red-400">You are not the organizer of this hackathon. Changes may be restricted.</div>}
          </div>
          <Link to="/discover" className="btn-primary bg-white/10 hover:bg-white/20">Back</Link>
        </div>
      </div>

      {/* Edit basic info */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Current Info</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="input" placeholder="Organizer Name" value={org} readOnly disabled />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 mt-3">
          <input className="input" placeholder="Date Range (e.g. Oct 15 - Oct 17)" value={dateRange} onChange={e => setDateRange(e.target.value)} />
          <input className="input" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} />
        </div>
        <div className="grid gap-3 mt-3">
          <textarea className="input min-h-[90px]" placeholder="Timeline (key milestones)" value={timeline} onChange={e => setTimeline(e.target.value)} />
          <textarea className="input min-h-[90px]" placeholder="Schedule (detailed timings)" value={schedule} onChange={e => setSchedule(e.target.value)} />
          <textarea className="input min-h-[90px]" placeholder="Additional Information" value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} />
        </div>
        <div className="mt-3">
          <button className="btn-primary" onClick={saveBasics}>Save</button>
        </div>
      </div>

      {/* Judges */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Add Judge Info</h3>
          <button className="btn-primary bg-white/10 hover:bg-white/20" onClick={addJudge}>Add Judge</button>
        </div>
        <div className="space-y-3">
          {judges.map((j, idx) => (
            <div key={idx} className="grid gap-3 sm:grid-cols-12">
              <input className="input sm:col-span-4" placeholder="Name" value={j.name} onChange={e => updateJudge(idx, 'name', e.target.value)} />
              <input className="input sm:col-span-4" placeholder="Title (e.g. VP Engineering)" value={j.title || ''} onChange={e => updateJudge(idx, 'title', e.target.value)} />
              <input className="input sm:col-span-3" placeholder="Organization" value={j.org || ''} onChange={e => updateJudge(idx, 'org', e.target.value)} />
              <button className="btn-primary bg-red-500/20 hover:bg-red-500/30" onClick={() => removeJudge(idx)}>Remove</button>
            </div>
          ))}
          {judges.length === 0 && <div className="text-sm text-slate-400">No judges added yet.</div>}
        </div>
        <div className="mt-3"><button className="btn-primary" onClick={saveJudges}>Save Judges</button></div>
      </div>

      {/* Mentors */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Add Mentor Info</h3>
          <button className="btn-primary bg-white/10 hover:bg-white/20" onClick={addMentor}>Add Mentor</button>
        </div>
        <div className="space-y-3">
          {mentors.map((m, idx) => (
            <div key={idx} className="grid gap-3 sm:grid-cols-12">
              <input className="input sm:col-span-6" placeholder="Name" value={m.name} onChange={e => updateMentor(idx, 'name', e.target.value)} />
              <input className="input sm:col-span-5" placeholder="Expertise (e.g. AI/ML, DevOps)" value={m.expertise || ''} onChange={e => updateMentor(idx, 'expertise', e.target.value)} />
              <button className="btn-primary bg-red-500/20 hover:bg-red-500/30" onClick={() => removeMentor(idx)}>Remove</button>
            </div>
          ))}
          {mentors.length === 0 && <div className="text-sm text-slate-400">No mentors added yet.</div>}
        </div>
        <div className="mt-3"><button className="btn-primary" onClick={saveMentors}>Save Mentors</button></div>
      </div>

      {/* Helpful organizer prompts */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-2">Other details organizers often add</h3>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
          <li>Communication channels (Slack/Discord link, email)</li>
          <li>Code of conduct and anti-plagiarism policy</li>
          <li>Submission guidelines and deadlines</li>
          <li>Problem statements and tracks</li>
          <li>On-site logistics (Wi-Fi, power, ID requirements)</li>
        </ul>
      </div>
    </div>
  )
}
