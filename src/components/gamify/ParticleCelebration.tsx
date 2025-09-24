import React, { useEffect, useRef } from 'react'

export default function ParticleCelebration({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = []

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resize()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const spawn = () => {
      const count = 80
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = 2 + Math.random() * 2
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 40,
          hue: 200 + Math.random() * 80,
        })
      }
    }

    spawn()

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.03
        p.life -= 1
        ctx.beginPath()
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${Math.max(p.life / 80, 0)})`
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
        if (p.life <= 0) particles.splice(i, 1)
      }
      if (particles.length < 10) spawn()
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [trigger])

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex h-full w-full items-center justify-center text-brand-200">
        Milestone Unlocked! 🎉
      </div>
    </div>
  )
}
