import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed: number
  className?: string
}

function ParallaxLayer({ children, speed, className = '' }: ParallaxLayerProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000])
  
  return (
    <motion.div 
      className={`absolute inset-0 ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  )
}

export default function ParallaxLayers() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div className="relative overflow-hidden">
      {/* Background layer - slowest */}
      <ParallaxLayer speed={-0.5} className="z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }}
        />
      </ParallaxLayer>
      
      {/* Mid layer - medium speed */}
      <ParallaxLayer speed={-0.3} className="z-10">
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 border border-white/20 rotate-45"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translate(${mousePosition.x * (i + 1) * 5}px, ${mousePosition.y * (i + 1) * 5}px)`
              }}
              animate={{
                rotate: [45, 405],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </ParallaxLayer>
      
      {/* Foreground layer - fastest */}
      <ParallaxLayer speed={-0.1} className="z-20">
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 92, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 92, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
            }}
          />
        </div>
      </ParallaxLayer>
      
      {/* Static overlay for content */}
      <div className="relative z-30">
        {/* Content will be placed here */}
      </div>
    </div>
  )
}
