import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function SubmissionPortal() {
  const { hackathonId, teamId } = useParams()
  const submitProject = useStore(s => s.submitProject)
  const [title, setTitle] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [figmaUrl, setFigmaUrl] = useState('')
  const [driveUrl, setDriveUrl] = useState('')
  const [deckUrl, setDeckUrl] = useState('')
  const [description, setDescription] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hackathonId || !teamId) return
    submitProject(hackathonId, teamId, { title, repoUrl, figmaUrl, driveUrl, deckUrl, description })
    alert('Submission saved!')
    setTitle(''); setRepoUrl(''); setFigmaUrl(''); setDriveUrl(''); setDeckUrl(''); setDescription('')
  }

  return (
    <div className="mx-auto max-w-2xl card p-6">
      <h2 className="text-xl font-semibold">Submission Portal</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input className="input" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="input" placeholder="Short Description" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="GitHub Repo URL" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
          <input className="input" placeholder="Figma URL" value={figmaUrl} onChange={e => setFigmaUrl(e.target.value)} />
          <input className="input" placeholder="Google Drive URL" value={driveUrl} onChange={e => setDriveUrl(e.target.value)} />
          <input className="input" placeholder="Slide Deck URL" value={deckUrl} onChange={e => setDeckUrl(e.target.value)} />
        </div>
        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  )
}
