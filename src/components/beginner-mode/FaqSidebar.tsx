import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HelpCircle, Search, ChevronRight, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  { id: 'join-team', q: 'How do I join a team?', a: 'Go to Discover or Teams and click Join on a team that matches your interests.', to: '/teams' },
  { id: 'make-team', q: 'How do I create a team?', a: 'From Dashboard, click Create Team and invite friends with their email.', to: '/dashboard' },
  { id: 'what-submission', q: 'What is a submission?', a: 'Your project entry—title, files/links, and description. You can edit later.', to: '/dashboard' },
  { id: 'deadlines', q: 'Where are the deadlines?', a: 'See the Dashboard Deadlines card for key dates and reminders.', to: '/dashboard' },
  { id: 'help-mentor', q: 'How do I ask a mentor?', a: 'Open Community to get support or DM mentors.', to: '/community' },
]

export function FaqSidebar() {
  const { isBeginnerMode } = useStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const items = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return FAQS
    return FAQS.filter(f => f.q.toLowerCase().includes(q))
  }, [query])

  if (!isBeginnerMode) return null

  return (
    <div className="fixed left-4 bottom-6 z-[900]">
      {/* Left trigger button */}
      <button onClick={() => setOpen(true)} className="hidden md:inline-flex items-center gap-2 rounded-full bg-indigo-600/20 text-indigo-200 px-3 py-1.5 border border-indigo-400/20">
        <HelpCircle className="h-4 w-4" /> Help
      </button>

      {/* Centered modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[950] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal
            role="dialog"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-[min(92vw,720px)] max-h-[80vh] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md p-5 text-slate-100 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <HelpCircle className="h-5 w-5" /> Quick Help
                </div>
                <button aria-label="Close FAQ" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  aria-label="Search FAQs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl bg-white/5 pl-10 pr-3 py-2.5 text-sm border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/60 placeholder:text-slate-400"
                  placeholder="Search help..."
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {items.map(f => (
                  <div key={f.id} className={`rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/3 p-3 shadow-sm ${location.pathname === f.to ? 'ring-1 ring-indigo-500/40' : ''}`}>
                    <div className="text-sm font-semibold mb-1.5">{f.q}</div>
                    <div className="text-xs text-slate-300 mb-2 leading-relaxed">{f.a}</div>
                    <button
                      onClick={() => { navigate(f.to); setOpen(false) }}
                      className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600/30 text-indigo-100 px-2.5 py-1 text-xs border border-indigo-400/30 hover:bg-indigo-600/40"
                    >
                      Open <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
