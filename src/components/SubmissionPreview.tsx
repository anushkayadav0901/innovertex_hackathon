import React, { useEffect, useMemo, useState } from 'react'
import type { Submission } from '@/store/types'
import { drivePreviewUrl, fetchFigmaOEmbed, fetchGitHubRepoMeta, parseGitHubRepo } from '@/utils/integrations'

export default function SubmissionPreview({ submission }: { submission: Submission }) {
  const { repoUrl, figmaUrl, driveUrl, deckUrl } = submission

  // GitHub meta
  const gh = useMemo(() => (repoUrl ? parseGitHubRepo(repoUrl) : null), [repoUrl])
  const [ghMeta, setGhMeta] = useState<null | {
    full_name: string
    description?: string
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    html_url: string
  }>(null)
  const [ghErr, setGhErr] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    setGhMeta(null); setGhErr(null)
    if (gh) {
      fetchGitHubRepoMeta(gh.owner, gh.repo).then(m => { if (active) setGhMeta(m) }).catch(e => { if (active) setGhErr(String(e)) })
    }
    return () => { active = false }
  }, [gh?.owner, gh?.repo])

  // Figma preview
  const [figma, setFigma] = useState<null | { html: string; title?: string; thumbnail_url?: string }>(null)
  const [figmaErr, setFigmaErr] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    setFigma(null); setFigmaErr(null)
    if (figmaUrl) {
      fetchFigmaOEmbed(figmaUrl).then((o) => { if (active) setFigma({ html: o.html, title: o.title, thumbnail_url: o.thumbnail_url }) }).catch(e => { if (active) setFigmaErr(String(e)) })
    }
    return () => { active = false }
  }, [figmaUrl])

  const drivePreview = useMemo(() => (driveUrl ? drivePreviewUrl(driveUrl) : null), [driveUrl])

  return (
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      {/* GitHub */}
      {gh && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="mb-2 font-semibold">GitHub</div>
          {ghMeta ? (
            <a href={ghMeta.html_url} target="_blank" rel="noreferrer" className="block rounded-lg bg-white/5 p-3 hover:bg-white/10">
              <div className="font-medium">{ghMeta.full_name}</div>
              {ghMeta.description && <div className="text-sm text-slate-300">{ghMeta.description}</div>}
              <div className="mt-2 text-xs text-slate-400">⭐ {ghMeta.stargazers_count} • 🍴 {ghMeta.forks_count} • Issues {ghMeta.open_issues_count}</div>
            </a>
          ) : ghErr ? (
            <div className="text-sm text-red-400">{ghErr}</div>
          ) : (
            <div className="text-sm text-slate-400">Loading repository...</div>
          )}
        </div>
      )}

      {/* Figma */}
      {figmaUrl && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="mb-2 font-semibold">Figma</div>
          {figma ? (
            figma.thumbnail_url ? (
              <a href={figmaUrl} target="_blank" rel="noreferrer" className="block">
                <img src={figma.thumbnail_url} alt={figma.title || 'Figma preview'} className="w-full rounded-lg" />
                {figma.title && <div className="mt-2 text-sm text-slate-300">{figma.title}</div>}
              </a>
            ) : (
              <a href={figmaUrl} target="_blank" rel="noreferrer" className="text-sm text-brand-300 underline">Open in Figma</a>
            )
          ) : figmaErr ? (
            <div className="text-sm text-red-400">{figmaErr}</div>
          ) : (
            <div className="text-sm text-slate-400">Loading preview...</div>
          )}
        </div>
      )}

      {/* Google Drive */}
      {drivePreview && (
        <div className="rounded-xl border border-white/10 p-4 md:col-span-2">
          <div className="mb-2 font-semibold">Google Drive</div>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe src={drivePreview} className="h-full w-full" allow="autoplay" />
          </div>
        </div>
      )}

      {/* Slide deck link */}
      {deckUrl && (
        <div className="rounded-xl border border-white/10 p-4 md:col-span-2">
          <div className="mb-2 font-semibold">Slide Deck</div>
          <a href={deckUrl} target="_blank" rel="noreferrer" className="badge">Open Deck</a>
        </div>
      )}
    </div>
  )
}
