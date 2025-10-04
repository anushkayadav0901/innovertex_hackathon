import { useId, useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

type HelpBubbleProps = {
  topicId: string
  title: string
  children: React.ReactNode
}

export function HelpBubble({ topicId, title, children }: HelpBubbleProps) {
  const id = useId()
  const { isBeginnerMode, helpSeen, markHelpSeen } = useStore()
  const [open, setOpen] = useState(false)

  if (!isBeginnerMode) return null

  const seen = (helpSeen || []).includes(topicId)

  return (
    <div className="relative inline-block align-middle">
      <button
        aria-haspopup="dialog"
        aria-controls={`${id}-help`}
        aria-expanded={open}
        onClick={() => {
          setOpen(v => !v)
          markHelpSeen(topicId)
        }}
        className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs gap-1 transition-colors ${seen ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-indigo-600/20 border-indigo-400/30 text-indigo-200'} `}
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Help
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${id}-help`}
            role="dialog"
            aria-label={title}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            className="absolute z-[950] mt-2 w-72 rounded-xl border border-white/10 bg-white/10 backdrop-blur p-3 text-slate-100 shadow-xl"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold">{title}</div>
              <button aria-label="Close" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
