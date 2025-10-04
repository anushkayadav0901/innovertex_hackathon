import { CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function OnboardingMeter() {
  const { isBeginnerMode, onboarding } = useStore()
  const [open, setOpen] = useState(false)

  // Don't early-return before all hooks are called
  if (!isBeginnerMode) return null

  const items: { key: keyof typeof onboarding; label: string }[] = [
    { key: 'finishedRegistration', label: 'Finish Registration' },
    { key: 'joinedTeam', label: 'Join/Make a Team' },
    { key: 'readRules', label: 'Read Rules' },
    { key: 'startedProject', label: 'Start Project' },
    { key: 'askedMentor', label: 'Ask a Mentor' },
  ]
  const total = items.length
  const done = items.filter(i => onboarding[i.key]).length
  const pct = Math.round((done / total) * 100)

  return (
    <div className="fixed bottom-6 left-6 z-[850]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur px-3 py-1.5 text-sm text-slate-100 shadow-md hover:bg-white/15"
          aria-label="Open Your Learning Journey"
        >
          <span>Your Journey</span>
          <div className="h-1.5 w-24 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} />
          </div>
          <ChevronUp className="h-4 w-4" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-72 rounded-xl border border-white/10 bg-white/10 backdrop-blur p-3 text-slate-100 shadow-lg"
            aria-label="Beginner Onboarding Progress"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Your Learning Journey</div>
              <button aria-label="Close" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-2">
              <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <ul className="space-y-1">
              {items.map(i => (
                <li key={i.key} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className={`h-4 w-4 ${onboarding[i.key] ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className={onboarding[i.key] ? 'text-slate-200' : 'text-slate-400'}>{i.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
