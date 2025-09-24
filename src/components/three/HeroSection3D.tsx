import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import LoadingAnimation from './LoadingAnimation'
import FloatingShapes from './FloatingShapes'
import ParticleSystem from './ParticleSystem'
import InteractiveLogos from './InteractiveLogos'
import MorphingText from './MorphingText'
import Timeline3D from './Timeline3D'
import ParallaxLayers from './ParallaxLayers'

export default function HeroSection3D() {
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth < 768)
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
    }
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
    } else {
      window.addEventListener('touchmove', handleTouchMove)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isMobile])
  
  if (isLoading) {
    return <LoadingAnimation />
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Parallax background layers */}
      <ParallaxLayers />
      
      {/* Particle system background */}
      <Suspense fallback={null}>
        <ParticleSystem />
      </Suspense>
      
      {/* Floating 3D shapes */}
      <Suspense fallback={null}>
        <FloatingShapes mousePosition={mousePosition} />
      </Suspense>
      
      {/* Main content */}
      <div className="relative z-40 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Hero title with morphing text */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <MorphingText />
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Join the most innovative hackathon platform where creativity meets technology. 
          Build, compete, and shape the future together.
        </motion.p>
        
        {/* Interactive logos */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Suspense fallback={<div className="h-64 w-full" />}>
            <InteractiveLogos />
          </Suspense>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 92, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building
          </motion.button>
          <motion.button
            className="btn-primary bg-white/10 hover:bg-white/20 text-lg px-8 py-4"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Events
          </motion.button>
        </motion.div>
      </div>
      
      {/* 3D Timeline section */}
      <motion.div
        className="relative z-40 py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
          >
            Upcoming Hackathons
          </motion.h2>
          <motion.p
            className="text-xl text-slate-300 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.2 }}
          >
            Discover amazing opportunities to showcase your skills
          </motion.p>
          
          <Suspense fallback={<div className="h-96 w-full" />}>
            <Timeline3D />
          </Suspense>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  )
}
