import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface TimelineCardProps {
  position: [number, number, number]
  title: string
  date: string
  prize: string
  color: string
  isActive: boolean
  onClick: () => void
}

function TimelineCard3D({ position, title, date, prize, color, isActive, onClick }: TimelineCardProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.05
      
      // Scale and rotation based on state
      const targetScale = isActive ? 1.2 : hovered ? 1.1 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      
      if (isActive) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
      }
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Card background */}
      <RoundedBox args={[2, 1.5, 0.1]} radius={0.05}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.3 : hovered ? 0.2 : 0.1}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      
      {/* Title */}
      <Text
        position={[0, 0.3, 0.06]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {title}
      </Text>
      
      {/* Date */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.08}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
      >
        {date}
      </Text>
      
      {/* Prize */}
      <Text
        position={[0, -0.3, 0.06]}
        fontSize={0.1}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        {prize}
      </Text>
      
      {/* Glow effect for active card */}
      {isActive && (
        <RoundedBox args={[2.2, 1.7, 0.05]} radius={0.05} position={[0, 0, -0.05]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
      )}
    </group>
  )
}

export default function Timeline3D() {
  const [activeCard, setActiveCard] = useState(0)
  
  const hackathons = [
    {
      title: "AI Innovation Challenge",
      date: "Dec 15-17, 2024",
      prize: "$50,000",
      color: "#3b5cff"
    },
    {
      title: "Web3 Future Fest",
      date: "Jan 20-22, 2025", 
      prize: "$75,000",
      color: "#ff6b6b"
    },
    {
      title: "Climate Tech Summit",
      date: "Feb 10-12, 2025",
      prize: "$100,000", 
      color: "#4ecdc4"
    },
    {
      title: "Healthcare Innovation",
      date: "Mar 5-7, 2025",
      prize: "$60,000",
      color: "#ffe66d"
    }
  ]
  
  return (
    <div className="relative">
      <div className="h-96 w-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b6b" />
          
          {hackathons.map((hackathon, index) => (
            <TimelineCard3D
              key={index}
              position={[(index - 1.5) * 2.5, 0, 0]}
              title={hackathon.title}
              date={hackathon.date}
              prize={hackathon.prize}
              color={hackathon.color}
              isActive={activeCard === index}
              onClick={() => setActiveCard(index)}
            />
          ))}
        </Canvas>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {hackathons.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full ${activeCard === index ? 'bg-brand-400' : 'bg-white/30'}`}
            onClick={() => setActiveCard(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
      
      {/* Active card details */}
      <motion.div 
        className="mt-8 text-center"
        key={activeCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">
          {hackathons[activeCard].title}
        </h3>
        <p className="text-slate-300 mb-4">
          Join us for an incredible hackathon experience with amazing prizes and networking opportunities.
        </p>
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register Now
        </motion.button>
      </motion.div>
    </div>
  )
}
