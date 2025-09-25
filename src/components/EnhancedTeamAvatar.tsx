import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import { Team, Stage } from '../hooks/useQuestMapData';

interface EnhancedTeamAvatarProps {
  team: Team;
  stages: Stage[];
  onHover: (team: Team | null) => void;
  onClick: (team: Team) => void;
  showTrail?: boolean;
}

const EnhancedTeamAvatar: React.FC<EnhancedTeamAvatarProps> = ({
  team,
  stages,
  onHover,
  onClick,
  showTrail = true
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [trailPoints, setTrailPoints] = useState<THREE.Vector3[]>([]);
  
  // Calculate target position along curved path
  const getTargetPosition = (): [number, number, number] => {
    const currentStage = stages[team.stageIndex];
    if (!currentStage) return [0, 1, 0];
    
    // Add some randomness to prevent overlapping
    const offset = Math.sin(parseFloat(team.id) * 2) * 0.8;
    return [
      currentStage.position[0] + offset,
      currentStage.position[1] + 1.5,
      currentStage.position[2] + Math.cos(parseFloat(team.id) * 2) * 0.8
    ];
  };

  const [targetPosition, setTargetPosition] = useState(getTargetPosition());

  // Update target position when stage changes
  useEffect(() => {
    const newTarget = getTargetPosition();
    setTargetPosition(newTarget);
    
    // Add to trail
    if (showTrail) {
      setTrailPoints(prev => {
        const newPoints = [...prev, new THREE.Vector3(...newTarget)];
        return newPoints.slice(-10); // Keep last 10 points
      });
    }
  }, [team.stageIndex, stages]);

  // Smooth position animation
  const { position, scale } = useSpring({
    position: targetPosition,
    scale: isHovered ? 1.3 : 1,
    config: config.gentle
  });

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const floatOffset = Math.sin(time * 2 + parseFloat(team.id)) * 0.1;
      meshRef.current.position.y = targetPosition[1] + floatOffset;
      
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(time * 0.5 + parseFloat(team.id)) * 0.2;
    }
  });

  // Neon trail effect
  const NeonTrail: React.FC = () => {
    if (!showTrail || trailPoints.length < 2) return null;

    return (
      <group ref={trailRef}>
        {trailPoints.map((point, index) => {
          if (index === 0) return null;
          
          const prevPoint = trailPoints[index - 1];
          const direction = new THREE.Vector3().subVectors(point, prevPoint);
          const distance = direction.length();
          const midPoint = new THREE.Vector3().addVectors(prevPoint, point).multiplyScalar(0.5);
          
          return (
            <mesh key={index} position={midPoint}>
              <cylinderGeometry args={[0.02, 0.02, distance]} />
              <meshBasicMaterial 
                color={team.color}
                transparent
                opacity={0.6 * (index / trailPoints.length)}
                emissive={team.color}
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}
        
        {/* Trail particles */}
        {trailPoints.map((point, index) => (
          <mesh key={`particle-${index}`} position={point}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial 
              color={team.color}
              transparent
              opacity={0.8 * (index / trailPoints.length)}
              emissive={team.color}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    );
  };

  return (
    <animated.group position={position} scale={scale}>
      <NeonTrail />
      
      {/* Main avatar */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => {
            setIsHovered(true);
            onHover(team);
          }}
          onPointerLeave={() => {
            setIsHovered(false);
            onHover(null);
          }}
          onClick={() => onClick(team)}
        >
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial
            color={team.color}
            emissive={team.color}
            emissiveIntensity={isHovered ? 0.3 : 0.1}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        
        {/* Glowing ring effect */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 16]} />
          <meshBasicMaterial
            color={team.color}
            transparent
            opacity={isHovered ? 0.4 : 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Team name */}
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {team.name}
        </Text>
        
        {/* Score indicator */}
        {team.score !== undefined && (
          <Text
            position={[0, -0.7, 0]}
            fontSize={0.15}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="black"
          >
            {team.score} pts
          </Text>
        )}
      </Float>
      
      {/* Interactive tooltip */}
      {isHovered && (
        <Html
          position={[0, 1.2, 0]}
          center
          distanceFactor={10}
          occlude
        >
          <div className="bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-xl border border-white/20 min-w-48">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: team.color }}
              />
              <h3 className="font-bold text-sm">{team.name}</h3>
            </div>
            <div className="text-xs space-y-1">
              <p><span className="text-gray-400">Members:</span> {team.members.join(', ')}</p>
              <p><span className="text-gray-400">Stage:</span> {stages[team.stageIndex]?.name}</p>
              {team.score !== undefined && (
                <p><span className="text-gray-400">Score:</span> {team.score} points</p>
              )}
              <p><span className="text-gray-400">Progress:</span> {Math.round(((team.stageIndex + 1) / stages.length) * 100)}%</p>
            </div>
          </div>
        </Html>
      )}
    </animated.group>
  );
};

export default EnhancedTeamAvatar;
