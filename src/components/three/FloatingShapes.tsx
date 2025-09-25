import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Box, Octahedron, Torus, Cone } from '@react-three/drei'
import * as THREE from 'three'

interface ShapeProps {
  position: [number, number, number]
  geometry: 'sphere' | 'box' | 'octahedron' | 'torus' | 'cone'
  scale: number
  color: string
  mousePosition: { x: number; y: number }
}

function FloatingShape({ position, geometry, scale, color, mousePosition }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { viewport } = useThree()
  
  const initialPosition = useMemo(() => [...position], [position])
  
  useFrame((state) => {
    if (meshRef.current) {
      // Mouse interaction
      const mouseInfluence = 0.5
      const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1
      const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1
      
      // Floating animation
      const time = state.clock.elapsedTime
      meshRef.current.position.x = initialPosition[0] + Math.sin(time * 0.5 + position[0]) * 0.3 + mouseX * mouseInfluence
      meshRef.current.position.y = initialPosition[1] + Math.cos(time * 0.3 + position[1]) * 0.2 + mouseY * mouseInfluence
      meshRef.current.position.z = initialPosition[2] + Math.sin(time * 0.4 + position[2]) * 0.1
      
      // Rotation
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002
    }
  })

  const GeometryComponent = {
    sphere: Sphere,
    box: Box,
    octahedron: Octahedron,
    torus: Torus,
    cone: Cone
  }[geometry]

  const args = geometry === 'torus' ? [0.3, 0.1, 16, 100] : geometry === 'cone' ? [0.3, 0.6, 8] : [0.4, 16]

  return (
    <GeometryComponent ref={meshRef} position={position} scale={scale} args={args as any}>
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={0.8}
      />
    </GeometryComponent>
  )
}

interface FloatingShapesProps {
  mousePosition: { x: number; y: number }
}

export default function FloatingShapes({ mousePosition }: FloatingShapesProps) {
  const shapes = useMemo(() => [
    { position: [-4, 2, -2], geometry: 'sphere', scale: 0.8, color: '#3b5cff' },
    { position: [3, -1, -1], geometry: 'box', scale: 0.6, color: '#ff6b6b' },
    { position: [-2, -3, -3], geometry: 'octahedron', scale: 0.7, color: '#4ecdc4' },
    { position: [4, 3, -2], geometry: 'torus', scale: 0.9, color: '#ffe66d' },
    { position: [1, -2, -4], geometry: 'cone', scale: 0.5, color: '#ff8b94' },
    { position: [-3, 1, -1], geometry: 'sphere', scale: 0.4, color: '#95e1d3' },
    { position: [2, 2, -3], geometry: 'box', scale: 0.3, color: '#a8e6cf' },
    { position: [-1, -1, -2], geometry: 'octahedron', scale: 0.6, color: '#dda0dd' },
  ] as const, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b6b" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
        
        {shapes.map((shape, index) => (
          <FloatingShape
            key={index}
            position={shape.position as [number, number, number]}
            geometry={shape.geometry}
            scale={shape.scale}
            color={shape.color}
            mousePosition={mousePosition}
          />
        ))}
      </Canvas>
    </div>
  )
}
