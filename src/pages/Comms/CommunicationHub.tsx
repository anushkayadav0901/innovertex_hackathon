import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export default function CommunicationHub() {
  const { id } = useParams()
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const hack = useStore(s => (id ? s.hackathons[id] : undefined))
  const announcements = Object.values(useStore(s => s.announcements)).filter(a => a.hackathonId === id).sort((a,b) => b.createdAt - a.createdAt)
  const faqs = Object.values(useStore(s => s.faqs)).filter(f => f.hackathonId === id)
  const questions = Object.values(useStore(s => s.questions)).filter(q => q.hackathonId === id).sort((a,b) => b.createdAt - a.createdAt)

  const addAnnouncement = useStore(s => s.addAnnouncement)
  const addFAQ = useStore(s => s.addFAQ)
  const askQuestion = useStore(s => s.askQuestion)
  const answerQuestion = useStore(s => s.answerQuestion)

  const [annText, setAnnText] = useState('')
  const [faqQ, setFaqQ] = useState('')
  const [faqA, setFaqA] = useState('')
  const [qText, setQText] = useState('')
  const isOrganizer = useMemo(() => user && hack && user.id === hack.organizerId || user?.role === 'organizer', [user, hack])

  if (!hack) return <div className="card p-6">Hackathon not found</div>

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold">{hack.title} • Communication Hub</h2>
        <p className="text-sm text-slate-300">Manage announcements, FAQs, and Q&A</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold">Announcements</h3>
          {isOrganizer && (
            <div className="mt-3 flex gap-2">
              <input className="input" placeholder="Write an announcement" value={annText} onChange={e => setAnnText(e.target.value)} />
              <button className="btn-primary" onClick={() => { if (id && annText.trim()) { addAnnouncement(id, annText.trim()); setAnnText('') } }}>Post</button>
            </div>
          )}
          <ul className="mt-3 space-y-2">
            {announcements.map(a => (
              <li key={a.id} className="rounded-lg bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1">{a.message}</p>
              </li>
            ))}
            {announcements.length === 0 && <p className="text-sm text-slate-300">No announcements yet.</p>}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold">FAQs</h3>
          {isOrganizer && (
            <div className="mt-3 grid gap-2 sm:grid-cols-12">
              <input className="input sm:col-span-5" placeholder="Question" value={faqQ} onChange={e => setFaqQ(e.target.value)} />
              <input className="input sm:col-span-5" placeholder="Answer" value={faqA} onChange={e => setFaqA(e.target.value)} />
              <button className="btn-primary sm:col-span-2" onClick={() => { if (id && faqQ.trim() && faqA.trim()) { addFAQ(id, faqQ.trim(), faqA.trim()); setFaqQ(''); setFaqA('') } }}>Add</button>
            </div>
          )}
          <ul className="mt-3 space-y-2">
            {faqs.map(f => (
              <li key={f.id} className="rounded-lg bg-white/5 p-3">
                <div className="font-medium">Q: {f.question}</div>
                <div className="text-slate-300">A: {f.answer}</div>
              </li>
            ))}
            {faqs.length === 0 && <p className="text-sm text-slate-300">No FAQs yet.</p>}
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold">Q&A</h3>
        {user && (
          <div className="mt-3 flex gap-2">
            <input className="input" placeholder="Ask a question" value={qText} onChange={e => setQText(e.target.value)} />
            <button className="btn-primary" onClick={() => { if (id && qText.trim()) { askQuestion(id, qText.trim()); setQText('') } }}>Ask</button>
          </div>
        )}
        <ul className="mt-3 space-y-2">
          {questions.map(q => (
            <li key={q.id} className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{q.text}</div>
                <span className="text-xs text-slate-400">{new Date(q.createdAt).toLocaleString()}</span>
              </div>
              {q.answer ? (
                <div className="mt-2 rounded bg-white/5 p-2 text-sm">
                  <div className="text-slate-300">Answer: {q.answer.text}</div>
                  <div className="text-xs text-slate-400">{new Date(q.answer.createdAt).toLocaleString()}</div>
                </div>
              ) : (
                isOrganizer && (
                  <AnswerForm onAnswer={(text) => answerQuestion(q.id, text)} />
                )
              )}
            </li>
          ))}
          {questions.length === 0 && <p className="text-sm text-slate-300">No questions yet.</p>}
        </ul>
      </div>
    </div>
  )
}

function AnswerForm({ onAnswer }: { onAnswer: (t: string) => void }) {
  const [text, setText] = useState('')
  return (
    <div className="mt-2 flex gap-2">
      <input className="input" placeholder="Write an answer" value={text} onChange={e => setText(e.target.value)} />
      <button className="btn-primary" onClick={() => { if (text.trim()) { onAnswer(text.trim()); setText('') } }}>Answer</button>
    </div>
  )
}
