import React, { useEffect, useRef } from 'react'

export default function ParallaxOrbs() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current!
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 10
      const y = (e.clientY / innerHeight - 0.5) * 10
      el.style.setProperty('--x', `${x}px`)
      el.style.setProperty('--y', `${y}px`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-20 top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" style={{ transform: 'translate(var(--x), var(--y))' }} />
      <div className="absolute right-24 top-32 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" style={{ transform: 'translate(calc(var(--x) * -1), calc(var(--y) * 0.7))' }} />
      <div className="absolute bottom-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" style={{ transform: 'translate(calc(var(--x) * 0.6), calc(var(--y) * -0.6))' }} />
    </div>
  )
}
