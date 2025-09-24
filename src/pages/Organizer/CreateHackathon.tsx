import React, { useState } from 'react'
import { uid } from '@/utils/id'
import { useStore } from '@/store/useStore'

export default function CreateHackathon() {
  const createHackathon = useStore(s => s.createHackathon)
  const [title, setTitle] = useState('')
  const [org, setOrg] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [tags, setTags] = useState<string>('AI, Web')
  const [prize, setPrize] = useState('₹50,000')
  const [description, setDescription] = useState('')
  const [criteria, setCriteria] = useState<{ id: string; label: string; max: number }[]>([
    { id: uid('c'), label: 'Innovation', max: 10 },
  ])

  const addCriterion = () => setCriteria(c => [...c, { id: uid('c'), label: '', max: 10 }])
  const updateCriterion = (id: string, key: 'label' | 'max', value: string) =>
    setCriteria(cs => cs.map(c => (c.id === id ? { ...c, [key]: key === 'max' ? Number(value) : value } : c)))
  const removeCriterion = (id: string) => setCriteria(cs => cs.filter(c => c.id !== id))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !org || !dateRange || criteria.length === 0) {
      alert('Please complete title, org, dates, and at least one criterion')
      return
    }
    const id = createHackathon({
      title,
      org,
      dateRange,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      prize,
      description,
      criteria: criteria.map(c => ({ ...c, max: Number(c.max) || 10 })),
    })
    alert('Hackathon created! ID: ' + id)
    setTitle(''); setOrg(''); setDateRange(''); setTags('AI'); setPrize('₹50,000'); setDescription(''); setCriteria([{ id: uid('c'), label: 'Innovation', max: 10 }])
  }

  return (
    <div className="mx-auto max-w-3xl card p-6">
      <h2 className="text-xl font-semibold">Create Hackathon</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Organizer Name" value={org} onChange={e => setOrg(e.target.value)} />
          <input className="input" placeholder="Date Range (e.g. Oct 15 - Oct 17)" value={dateRange} onChange={e => setDateRange(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
          <input className="input" placeholder="Prize (e.g. ₹1,00,000)" value={prize} onChange={e => setPrize(e.target.value)} />
        </div>
        <textarea className="input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

        <div className="rounded-xl border border-white/10 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Judging Criteria</h3>
            <button type="button" onClick={addCriterion} className="btn-primary bg-white/10 hover:bg-white/20">Add Criterion</button>
          </div>
          <div className="space-y-3">
            {criteria.map(c => (
              <div key={c.id} className="grid gap-3 sm:grid-cols-12">
                <input className="input sm:col-span-8" placeholder="Label" value={c.label} onChange={e => updateCriterion(c.id, 'label', e.target.value)} />
                <input className="input sm:col-span-3" type="number" min={1} placeholder="Max" value={c.max} onChange={e => updateCriterion(c.id, 'max', e.target.value)} />
                <button type="button" className="btn-primary bg-red-500/20 hover:bg-red-500/30" onClick={() => removeCriterion(c.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" type="submit">Create</button>
      </form>
    </div>
  )
}
