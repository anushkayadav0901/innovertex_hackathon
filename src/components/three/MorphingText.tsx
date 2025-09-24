import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const texts = [
  "BUILD THE FUTURE",
  "CODE YOUR DREAMS", 
  "INNOVATE TOGETHER",
  "HACK THE WORLD"
]

export default function MorphingText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(texts[0])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    // Morphing animation effect
    const currentText = texts[currentIndex]
    let morphProgress = 0
    
    const morphInterval = setInterval(() => {
      morphProgress += 0.05
      
      if (morphProgress <= 1) {
        let morphedText = ''
        for (let i = 0; i < Math.max(displayText.length, currentText.length); i++) {
          const fromChar = displayText[i] || ''
          const toChar = currentText[i] || ''
          
          if (morphProgress < 0.5) {
            // First half: scramble
            morphedText += Math.random() > 0.7 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : fromChar
          } else {
            // Second half: reveal target
            const revealProgress = (morphProgress - 0.5) * 2
            morphedText += Math.random() < revealProgress ? toChar : String.fromCharCode(65 + Math.floor(Math.random() * 26))
          }
        }
        setDisplayText(morphedText)
      } else {
        setDisplayText(currentText)
        clearInterval(morphInterval)
      }
    }, 50)
    
    return () => clearInterval(morphInterval)
  }, [currentIndex])
  
  return (
    <div className="relative overflow-hidden">
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-black text-center"
        style={{
          background: 'linear-gradient(45deg, #3b5cff, #ff6b6b, #4ecdc4, #ffe66d)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {displayText}
      </motion.h1>
      
      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-black text-center text-red-500 opacity-20"
        animate={{
          x: [0, -2, 2, 0],
          y: [0, 1, -1, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {displayText}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-black text-center text-cyan-500 opacity-20"
        animate={{
          x: [0, 2, -2, 0],
          y: [0, -1, 1, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.05
        }}
      >
        {displayText}
      </motion.div>
    </div>
  )
}
