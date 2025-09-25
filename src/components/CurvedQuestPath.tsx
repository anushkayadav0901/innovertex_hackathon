import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Stage } from '../hooks/useQuestMapData';

interface CurvedQuestPathProps {
  stages: Stage[];
  animated?: boolean;
}

const CurvedQuestPath: React.FC<CurvedQuestPathProps> = ({ stages, animated = true }) => {
  const pathRef = useRef<THREE.Group>(null);
  const neonRef = useRef<THREE.Group>(null);

  // Create curved path points
  const pathPoints = useMemo(() => {
    if (stages.length < 2) return [];

    // Create a more interesting curved path
    const points: THREE.Vector3[] = [];
    
    stages.forEach((stage, index) => {
      const basePoint = new THREE.Vector3(...stage.position);
      
      // Add curve variation to make it look like a board game path
      if (index > 0) {
        const prevStage = stages[index - 1];
        const direction = new THREE.Vector3()
          .subVectors(basePoint, new THREE.Vector3(...prevStage.position))
          .normalize();
        
        // Add some curve points between stages
        const midPoint1 = new THREE.Vector3()
          .addVectors(new THREE.Vector3(...prevStage.position), basePoint)
          .multiplyScalar(0.3)
          .add(new THREE.Vector3(...prevStage.position));
        
        const midPoint2 = new THREE.Vector3()
          .addVectors(new THREE.Vector3(...prevStage.position), basePoint)
          .multiplyScalar(0.7)
          .add(new THREE.Vector3(...prevStage.position));
        
        // Add curve offset
        const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);
        const curveOffset = Math.sin(index * 0.8) * 2;
        
        midPoint1.add(perpendicular.clone().multiplyScalar(curveOffset));
        midPoint2.add(perpendicular.clone().multiplyScalar(curveOffset * 0.5));
        
        points.push(midPoint1, midPoint2);
      }
      
      points.push(basePoint);
    });

    return points;
  }, [stages]);

  // Create smooth curve
  const curve = useMemo(() => {
    if (pathPoints.length < 2) return null;
    return new THREE.CatmullRomCurve3(pathPoints);
  }, [pathPoints]);

  // Generate path geometry
  const pathGeometry = useMemo(() => {
    if (!curve) return null;
    return new THREE.TubeGeometry(curve, 200, 0.05, 8, false);
  }, [curve]);

  // Generate neon trail points
  const neonPoints = useMemo(() => {
    if (!curve) return [];
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const point = curve.getPoint(t);
      point.y += 0.1; // Slightly above the main path
      points.push(point);
    }
    
    return points;
  }, [curve]);

  // Animation
  useFrame((state) => {
    if (animated && neonRef.current) {
      const time = state.clock.elapsedTime;
      
      // Animate neon glow intensity
      neonRef.current.children.forEach((child: any, index) => {
        if (child.material) {
          const wave = Math.sin(time * 2 + index * 0.1);
          child.material.emissiveIntensity = 0.3 + wave * 0.2;
          child.material.opacity = 0.6 + wave * 0.3;
        }
      });
    }
  });

  if (!curve || !pathGeometry) return null;

  return (
    <group ref={pathRef}>
      {/* Main path */}
      <mesh geometry={pathGeometry}>
        <meshStandardMaterial 
          color="#4ade80" 
          emissive="#4ade80" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Neon trail effect */}
      <group ref={neonRef}>
        <Line
          points={neonPoints}
          color="#00ff88"
          lineWidth={4}
          transparent
          opacity={0.8}
        />
        
        {/* Glowing particles along path */}
        {neonPoints.map((point, index) => {
          if (index % 10 !== 0) return null; // Only every 10th point
          
          return (
            <mesh key={index} position={point}>
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
        
        {/* Pulsing rings at stage connections */}
        {stages.map((stage, index) => (
          <mesh 
            key={`ring-${stage.id}`}
            position={[stage.position[0], stage.position[1] + 0.1, stage.position[2]]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.8, 1.0, 16]} />
            <meshBasicMaterial
              color="#4ade80"
              emissive="#4ade80"
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Path markers */}
      {pathPoints.map((point, index) => {
        if (index % 5 !== 0) return null; // Only every 5th point
        
        return (
          <mesh key={`marker-${index}`} position={point}>
            <cylinderGeometry args={[0.02, 0.02, 0.2]} />
            <meshBasicMaterial
              color="#4ade80"
              emissive="#4ade80"
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default CurvedQuestPath;
