import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function EvaluateSubmission() {
  const { submissionId } = useParams()
  const sub = useStore(s => submissionId ? s.submissions[submissionId] : undefined)
  const hack = useStore(s => sub ? s.hackathons[sub.hackathonId] : undefined)
  const addEvaluation = useStore(s => s.addEvaluation)
  const [scores, setScores] = useState<{ [k: string]: number }>({})
  const [feedback, setFeedback] = useState('')

  if (!sub || !hack) return <div className="card p-6">Submission not found</div>

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const packed = hack.criteria.map(c => ({ criterionId: c.id, score: Number(scores[c.id] || 0) }))
    addEvaluation(sub.id, packed, feedback)
    alert('Evaluation submitted!')
    setScores({}); setFeedback('')
  }

  return (
    <div className="mx-auto max-w-2xl card p-6">
      <h2 className="text-xl font-semibold">Evaluate: {sub.title}</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        {hack.criteria.map(c => (
          <div key={c.id} className="grid grid-cols-2 items-center gap-3">
            <label className="text-sm text-slate-300">{c.label} (max {c.max})</label>
            <input className="input" type="number" min={0} max={c.max} value={scores[c.id] || ''} onChange={e => setScores(s => ({ ...s, [c.id]: Number(e.target.value) }))} />
          </div>
        ))}
        <textarea className="input" placeholder="Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} />
        <button className="btn-primary" type="submit">Submit Scores</button>
      </form>
    </div>
  )
}
