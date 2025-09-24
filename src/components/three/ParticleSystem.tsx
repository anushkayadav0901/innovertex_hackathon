import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 1000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // Color - gradient from blue to purple to pink
      const hue = Math.random() * 0.3 + 0.6 // 0.6 to 0.9 (blue to purple range)
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      // Size
      sizes[i] = Math.random() * 3 + 1
    }
    
    return { positions, colors, sizes }
  }, [count])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03
      
      // Animate particle positions
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + positions[i3]) * 0.001
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  const vertexShader = `
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;
    
    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `
  
  const fragmentShader = `
    varying vec3 vColor;
    
    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function ParticleSystem() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Particles count={800} />
      </Canvas>
    </div>
  )
}
