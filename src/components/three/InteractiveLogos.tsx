import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Sphere, RoundedBox } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface LogoProps {
  position: [number, number, number]
  text: string
  color: string
  isHovered: boolean
  onHover: (hovered: boolean) => void
}

function Logo3D({ position, text, color, isHovered, onHover }: LogoProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const boxRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
      
      // Rotation animation
      if (isHovered) {
        groupRef.current.rotation.y += 0.02
        groupRef.current.scale.setScalar(1.2)
      } else {
        groupRef.current.rotation.y += 0.005
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <RoundedBox ref={boxRef} args={[1.5, 0.8, 0.2]} radius={0.1}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {text}
      </Text>
    </group>
  )
}

export default function InteractiveLogos() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const logos = [
    { text: "INNOVORTEX", color: "#3b5cff", position: [-2, 1, 0] as [number, number, number] },
    { text: "HACKATHON", color: "#ff6b6b", position: [2, -0.5, 0] as [number, number, number] },
    { text: "2024", color: "#4ecdc4", position: [0, -2, 0] as [number, number, number] },
  ]

  return (
    <div className="relative h-64 w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
        
        {logos.map((logo, index) => (
          <Logo3D
            key={index}
            position={logo.position}
            text={logo.text}
            color={logo.color}
            isHovered={hoveredIndex === index}
            onHover={(hovered) => setHoveredIndex(hovered ? index : null)}
          />
        ))}
      </Canvas>
      
      {/* Overlay text effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-500 to-pink-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        >
          INNOVORTEX
        </motion.div>
      </div>
    </div>
  )
}
