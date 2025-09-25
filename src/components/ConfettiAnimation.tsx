import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConfettiParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Euler;
  color: THREE.Color;
  scale: number;
}

interface ConfettiAnimationProps {
  position: [number, number, number];
  count?: number;
  spread?: number;
  active?: boolean;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  position, 
  count = 200, 
  spread = 5,
  active = true 
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<ConfettiParticle[]>([]);
  
  // Initialize particles
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.1, 0.1, 0.02);
    const mat = new THREE.MeshStandardMaterial();
    
    // Initialize particle system
    particles.current = Array.from({ length: count }, () => {
      const colors = [
        new THREE.Color('#ff6b6b'),
        new THREE.Color('#4ecdc4'),
        new THREE.Color('#45b7d1'),
        new THREE.Color('#f9ca24'),
        new THREE.Color('#6c5ce7'),
        new THREE.Color('#a55eea'),
        new THREE.Color('#26de81'),
        new THREE.Color('#fd79a8'),
        new THREE.Color('#fdcb6e'),
        new THREE.Color('#e17055')
      ];
      
      return {
        position: new THREE.Vector3(
          position[0] + (Math.random() - 0.5) * spread,
          position[1] + Math.random() * 2,
          position[2] + (Math.random() - 0.5) * spread
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.15 + 0.05,
          (Math.random() - 0.5) * 0.1
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Euler(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.5 + 0.5
      };
    });
    
    return { geometry: geo, material: mat };
  }, [count, spread, position]);

  useFrame((state, delta) => {
    if (!meshRef.current || !active) return;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    particles.current.forEach((particle, index) => {
      // Update physics
      particle.velocity.y -= 0.005; // gravity
      particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));
      
      // Update rotation
      particle.rotation.x += particle.rotationSpeed.x;
      particle.rotation.y += particle.rotationSpeed.y;
      particle.rotation.z += particle.rotationSpeed.z;
      
      // Reset particle if it falls too low
      if (particle.position.y < position[1] - 10) {
        particle.position.set(
          position[0] + (Math.random() - 0.5) * spread,
          position[1] + Math.random() * 2,
          position[2] + (Math.random() - 0.5) * spread
        );
        particle.velocity.set(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.15 + 0.05,
          (Math.random() - 0.5) * 0.1
        );
      }
      
      // Apply transformation matrix
      matrix.makeRotationFromEuler(particle.rotation);
      matrix.setPosition(particle.position);
      matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale));
      
      meshRef.current!.setMatrixAt(index, matrix);
      meshRef.current!.setColorAt(index, particle.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
};

export default ConfettiAnimation;
