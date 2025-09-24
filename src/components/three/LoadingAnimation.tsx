import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

function SpinningGeometry({ position, geometry }: { position: [number, number, number], geometry: 'sphere' | 'box' | 'octahedron' }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  const GeometryComponent = geometry === 'sphere' ? Sphere : geometry === 'box' ? Box : Octahedron

  return (
    <GeometryComponent ref={meshRef} position={position} args={[0.5]}>
      <meshStandardMaterial 
        color="#3b5cff" 
        emissive="#1a2b7a" 
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </GeometryComponent>
  )
}

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ width: 200, height: 200 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
          
          <SpinningGeometry position={[-1.5, 0, 0]} geometry="sphere" />
          <SpinningGeometry position={[0, 0, 0]} geometry="box" />
          <SpinningGeometry position={[1.5, 0, 0]} geometry="octahedron" />
        </Canvas>
        
        <div className="mt-6 text-center">
          <div className="text-xl font-bold text-white">Loading Experience</div>
          <div className="mt-2 flex justify-center space-x-1">
            {[0, 1, 2].map(i => (
              <div 
                key={i}
                className="h-2 w-2 rounded-full bg-brand-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
