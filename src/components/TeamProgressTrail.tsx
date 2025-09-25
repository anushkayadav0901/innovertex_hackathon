import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Team, Stage } from '../hooks/useQuestMapData';

interface TeamProgressTrailProps {
  team: Team;
  stages: Stage[];
  showTrail?: boolean;
}

const TeamProgressTrail: React.FC<TeamProgressTrailProps> = ({ 
  team, 
  stages, 
  showTrail = true 
}) => {
  const trailRef = useRef<THREE.Group>(null);
  
  // Create trail points based on team's completed stages
  const trailPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    
    // Add points for all completed stages
    for (let i = 0; i <= team.stageIndex; i++) {
      if (stages[i]) {
        points.push(new THREE.Vector3(...stages[i].position));
      }
    }
    
    return points;
  }, [team.stageIndex, stages]);

  // Create progress particles along the trail
  const progressParticles = useMemo(() => {
    const particles: THREE.Vector3[] = [];
    
    for (let i = 0; i < trailPoints.length - 1; i++) {
      const start = trailPoints[i];
      const end = trailPoints[i + 1];
      
      // Add particles between stages
      for (let j = 0; j < 10; j++) {
        const t = j / 10;
        const point = new THREE.Vector3().lerpVectors(start, end, t);
        point.y += 0.5; // Slightly above ground
        particles.push(point);
      }
    }
    
    return particles;
  }, [trailPoints]);

  useFrame((state) => {
    if (trailRef.current) {
      // Animate trail opacity based on time
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      trailRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.opacity = opacity;
        }
      });
    }
  });

  if (!showTrail || trailPoints.length < 2) return null;

  return (
    <group ref={trailRef}>
      {/* Main trail line */}
      <Line
        points={trailPoints}
        color={team.color}
        lineWidth={3}
        transparent
        opacity={0.6}
      />
      
      {/* Progress particles */}
      {progressParticles.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial 
            color={team.color} 
            transparent 
            opacity={0.8}
            emissive={team.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Stage completion markers */}
      {trailPoints.map((point, index) => (
        <mesh key={`marker-${index}`} position={[point.x, point.y + 0.2, point.z]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial 
            color={team.color}
            emissive={team.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

export default TeamProgressTrail;
