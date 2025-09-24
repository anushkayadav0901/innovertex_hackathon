import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  initialLiked?: boolean
  likeCount?: number
  onLike?: (liked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

interface FloatingHeart {
  id: string
  x: number
  y: number
}

export default function LikeButton({ 
  initialLiked = false, 
  likeCount = 0, 
  onLike,
  size = 'md',
  showCount = true
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(likeCount)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1))
    onLike?.(newLiked)

    if (newLiked) {
      createFloatingHearts()
    }
  }

  const createFloatingHearts = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const newHearts: FloatingHeart[] = []

    // Create multiple floating hearts
    for (let i = 0; i < 3; i++) {
      const heart: FloatingHeart = {
        id: `${Date.now()}-${i}`,
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
        y: rect.top + rect.height / 2
      }
      newHearts.push(heart)
    }

    setFloatingHearts(prev => [...prev, ...newHearts])

    // Remove hearts after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => 
        !newHearts.some(newHeart => newHeart.id === heart.id)
      ))
    }, 2000)
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={handleLike}
        className={`like-button ${liked ? 'liked' : ''} ${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-200 ${
          liked 
            ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
            : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-red-400 border border-white/20'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={liked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`${iconSizes[size]} ${liked ? 'fill-current' : ''}`}
        />
      </motion.button>

      {showCount && count > 0 && (
        <motion.span
          className="text-sm text-slate-400 ml-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          key={count}
        >
          {count}
        </motion.span>
      )}

      {/* Floating Hearts */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="floating-heart fixed pointer-events-none z-50"
            style={{
              left: heart.x,
              top: heart.y,
            }}
            initial={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0
            }}
            animate={{ 
              opacity: 0, 
              scale: 1.5,
              y: -100,
              x: (Math.random() - 0.5) * 60
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
          >
            <Heart className="w-6 h-6 text-red-500 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}
