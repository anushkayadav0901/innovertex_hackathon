export function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url)
    if (u.hostname !== 'github.com') return null
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') }
  } catch {
    return null
  }
}

export async function fetchGitHubRepoMeta(owner: string, repo: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Failed to fetch GitHub repo')
  return res.json() as Promise<{
    full_name: string
    description: string
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    html_url: string
  }>
}

export async function fetchFigmaOEmbed(url: string) {
  const res = await fetch(`https://www.figma.com/oembed?url=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error('Failed to fetch Figma oEmbed')
  return res.json() as Promise<{
    html: string
    title?: string
    author_name?: string
    thumbnail_url?: string
    width?: number
    height?: number
  }>
}

export function drivePreviewUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('drive.google.com')) {
      // Try to transform different formats to preview link
      // Format: https://drive.google.com/file/d/<id>/view?... -> /preview
      const parts = u.pathname.split('/').filter(Boolean)
      const fileIdx = parts.indexOf('file')
      if (fileIdx !== -1 && parts[fileIdx + 1] === 'd' && parts[fileIdx + 2]) {
        const id = parts[fileIdx + 2]
        return `https://drive.google.com/file/d/${id}/preview`
      }
      // Fallback to original
      return url
    }
    return null
  } catch {
    return null
  }
}
