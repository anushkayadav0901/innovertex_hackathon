import React from 'react'
import { motion } from 'framer-motion'

type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
type Badge = {
  id: string
  label: string
  icon?: React.ReactNode
  rarity?: Rarity
}

const hover = {
  hover: {
    y: -6,
    rotate: -2,
    boxShadow: '0 12px 30px rgba(59,92,255,0.25)',
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
}

const rarityStyles: Record<Rarity, { ring: string; glow: string }> = {
  common: { ring: 'ring-white/10', glow: 'from-slate-400/20 to-slate-500/20' },
  rare: { ring: 'ring-cyan-300/40', glow: 'from-cyan-400/30 to-teal-500/30' },
  epic: { ring: 'ring-violet-300/40', glow: 'from-violet-400/30 to-fuchsia-500/30' },
  legendary: { ring: 'ring-amber-300/40', glow: 'from-amber-400/30 to-rose-500/30' },
}

export default function Badges({ badges }: { badges: Badge[] }) {
  return (
    <div className="card p-6">
      <h3 className="mb-3">Achievements</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {badges.map((b) => {
          const r: Rarity = b.rarity ?? 'common'
          const styles = rarityStyles[r]
          return (
            <motion.div
              key={b.id}
              whileHover="hover"
              variants={hover}
              className={`relative animate-float rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md ring-1 ${styles.ring} ${r !== 'common' ? 'holo' : ''}`}
              style={{ background: 'var(--card-bg)' }}
            >
              <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${styles.glow} text-brand-100`}
              >
                {b.icon ?? <span>🏆</span>}
              </div>
              <div className="text-sm text-slate-200">{b.label}</div>
              {r !== 'common' && (
                <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-300">{r}</div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
