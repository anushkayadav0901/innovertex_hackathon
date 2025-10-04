import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { HelpBubble } from '@/components/beginner-mode/HelpBubble'

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
      <p className="mt-1 text-sm text-slate-400">Don’t worry, you can edit these later. This is just to get you started 🚀</p>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm">Project Title</label>
            <HelpBubble topicId="title" title="Project Title">
              Pick a short, memorable name. Example: “Smart Plant Care”.
            </HelpBubble>
          </div>
          <input className="input" placeholder="e.g., Smart Plant Care" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm">Short Description</label>
            <HelpBubble topicId="description" title="Short Description">
              In 1–2 lines, explain what your project does and who it helps.
            </HelpBubble>
          </div>
          <textarea className="input" placeholder="What does it do? Who benefits?" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm">Project Folder (GitHub)</label>
              <HelpBubble topicId="repo" title="Project Folder (GitHub)">
                Link to your code. Not ready? Leave it blank—you can add later.
              </HelpBubble>
            </div>
            <input className="input" placeholder="https://github.com/your/repo" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm">Design (Figma)</label>
              <HelpBubble topicId="figma" title="Design (Figma)">
                Optional: share your design file.
              </HelpBubble>
            </div>
            <input className="input" placeholder="https://figma.com/file/..." value={figmaUrl} onChange={e => setFigmaUrl(e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm">Assets (Drive)</label>
              <HelpBubble topicId="drive" title="Assets (Drive)">
                Optional: demos, screenshots, or data.
              </HelpBubble>
            </div>
            <input className="input" placeholder="https://drive.google.com/..." value={driveUrl} onChange={e => setDriveUrl(e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm">Slide Deck</label>
              <HelpBubble topicId="deck" title="Slide Deck">
                Optional: your presentation link.
              </HelpBubble>
            </div>
            <input className="input" placeholder="https://.../slides" value={deckUrl} onChange={e => setDeckUrl(e.target.value)} />
          </div>
        </div>
        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  )
}
