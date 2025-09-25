import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sphere, Box, Cylinder, Cone, Html } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { Stage, Team } from '../hooks/useQuestMapData';
import ConfettiAnimation from './ConfettiAnimation';

interface StageProps {
  stage: Stage;
  teams: Team[];
  onStageClick: (stage: Stage) => void;
}

// Enhanced Registration Gate with opening doors
export const EnhancedRegistrationGate: React.FC<StageProps> = ({ stage, teams, onStageClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  
  const teamsAtStage = teams.filter(team => team.stageIndex === 0);
  
  useEffect(() => {
    setIsActive(teamsAtStage.length > 0);
    setDoorsOpen(teams.some(team => team.stageIndex > 0));
  }, [teams]);

  const { leftDoorRotation, rightDoorRotation } = useSpring({
    leftDoorRotation: doorsOpen ? [-Math.PI / 3, 0, 0] : [0, 0, 0],
    rightDoorRotation: doorsOpen ? [Math.PI / 3, 0, 0] : [0, 0, 0],
    config: { tension: 120, friction: 30 }
  });

  return (
    <group position={stage.position} onClick={() => onStageClick(stage)}>
      {/* Gate pillars */}
      <Cylinder args={[0.3, 0.3, 4]} position={[-2, 2, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={isActive ? 0.3 : 0.1} />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 4]} position={[2, 2, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={isActive ? 0.3 : 0.1} />
      </Cylinder>
      
      {/* Gate arch */}
      <Box args={[4.6, 0.5, 0.5]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={isActive ? 0.2 : 0.05} />
      </Box>
      
      {/* Animated doors */}
      <animated.group rotation={leftDoorRotation}>
        <Box args={[1.8, 3.5, 0.2]} position={[-1, 1.75, 0]}>
          <meshStandardMaterial color="#6d28d9" />
        </Box>
      </animated.group>
      
      <animated.group rotation={rightDoorRotation}>
        <Box args={[1.8, 3.5, 0.2]} position={[1, 1.75, 0]}>
          <meshStandardMaterial color="#6d28d9" />
        </Box>
      </animated.group>
      
      {/* Glowing effect */}
      <pointLight 
        position={[0, 3, 0]} 
        color="#8b5cf6" 
        intensity={isActive ? 1.0 : 0.3}
        distance={10}
      />
      
      {/* Magical particles */}
      {isActive && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          {[...Array(5)].map((_, i) => (
            <Sphere key={i} args={[0.05]} position={[
              Math.sin(i * 1.2) * 2,
              2 + Math.cos(i * 1.5) * 0.5,
              Math.cos(i * 1.2) * 2
            ]}>
              <meshBasicMaterial color="#8b5cf6" transparent opacity={0.7} />
            </Sphere>
          ))}
        </Float>
      )}
    </group>
  );
};

// Enhanced Idea Valley with floating bulbs
export const EnhancedIdeaValley: React.FC<StageProps> = ({ stage, teams, onStageClick }) => {
  const [isActive, setIsActive] = useState(false);
  const teamsAtStage = teams.filter(team => team.stageIndex === 1);
  
  useEffect(() => {
    setIsActive(teamsAtStage.length > 0);
  }, [teams]);

  return (
    <group position={stage.position} onClick={() => onStageClick(stage)}>
      {/* Valley base */}
      <Cylinder args={[3, 3, 0.5]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={isActive ? 0.2 : 0.05} />
      </Cylinder>
      
      {/* Animated idea bulbs */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.3]} position={[-1, 2, 0]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={isActive ? 0.6 : 0.3}
            transparent
            opacity={isActive ? 1 : 0.7}
          />
        </Sphere>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <Sphere args={[0.25]} position={[1, 2.5, 0.5]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={isActive ? 0.6 : 0.3}
            transparent
            opacity={isActive ? 1 : 0.7}
          />
        </Sphere>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.7} floatIntensity={0.3}>
        <Sphere args={[0.2]} position={[0, 3, -0.5]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={isActive ? 0.6 : 0.3}
            transparent
            opacity={isActive ? 1 : 0.7}
          />
        </Sphere>
      </Float>
      
      <pointLight 
        position={[0, 2, 0]} 
        color="#10b981" 
        intensity={isActive ? 0.8 : 0.3}
        distance={8}
      />
    </group>
  );
};

// Enhanced Prototype Tower with glowing windows
export const EnhancedPrototypeTower: React.FC<StageProps> = ({ stage, teams, onStageClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [windowsLit, setWindowsLit] = useState(0);
  const gearRef = useRef<THREE.Group>(null);
  
  const teamsAtStage = teams.filter(team => team.stageIndex === 2);
  
  useEffect(() => {
    setIsActive(teamsAtStage.length > 0);
    setWindowsLit(teamsAtStage.length);
  }, [teams]);

  useFrame((state) => {
    if (gearRef.current && isActive) {
      gearRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={stage.position} onClick={() => onStageClick(stage)}>
      {/* Tower base */}
      <Cylinder args={[1.5, 2, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#6366f1" />
      </Cylinder>
      
      {/* Tower middle */}
      <Cylinder args={[1.2, 1.5, 2]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#7c3aed" />
      </Cylinder>
      
      {/* Tower top */}
      <Cone args={[1.2, 1.5]} position={[0, 3.75, 0]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Cone>
      
      {/* Glowing windows */}
      {[...Array(Math.min(windowsLit, 6))].map((_, i) => (
        <Box key={i} args={[0.2, 0.3, 0.1]} position={[
          Math.sin(i * Math.PI / 3) * 1.1,
          1.5 + (i % 3) * 0.5,
          Math.cos(i * Math.PI / 3) * 1.1
        ]}>
          <meshBasicMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={0.8}
          />
        </Box>
      ))}
      
      {/* Rotating gears */}
      <group ref={gearRef}>
        <Float speed={2} rotationIntensity={1} floatIntensity={0}>
          <Cylinder args={[0.5, 0.5, 0.2]} position={[-1.5, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={isActive ? 0.3 : 0.1} />
          </Cylinder>
        </Float>
        
        <Float speed={1.5} rotationIntensity={-1} floatIntensity={0}>
          <Cylinder args={[0.3, 0.3, 0.15]} position={[1.2, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={isActive ? 0.3 : 0.1} />
          </Cylinder>
        </Float>
      </group>
      
      <pointLight 
        position={[0, 4, 0]} 
        color="#6366f1" 
        intensity={isActive ? 1.0 : 0.4}
        distance={12}
      />
    </group>
  );
};

// Enhanced Pitch Arena with dynamic spotlights
export const EnhancedPitchArena: React.FC<StageProps> = ({ stage, teams, onStageClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [spotlightsOn, setSpotlightsOn] = useState(false);
  
  const teamsAtStage = teams.filter(team => team.stageIndex === 3);
  
  useEffect(() => {
    setIsActive(teamsAtStage.length > 0);
    setSpotlightsOn(teamsAtStage.length > 0);
  }, [teams]);

  return (
    <group position={stage.position} onClick={() => onStageClick(stage)}>
      {/* Arena platform */}
      <Cylinder args={[3, 3, 0.5]} position={[0, 0.25, 0]}>
        <meshStandardMaterial 
          color="#dc2626" 
          emissive="#dc2626" 
          emissiveIntensity={isActive ? 0.2 : 0.05}
        />
      </Cylinder>
      
      {/* Spotlight pillars */}
      <Cylinder args={[0.2, 0.2, 3]} position={[-2, 1.5, 2]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3]} position={[2, 1.5, 2]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3]} position={[0, 1.5, -2]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      
      {/* Dynamic spotlights */}
      {spotlightsOn && (
        <>
          <spotLight 
            position={[-2, 3, 2]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={2} 
            color="#ffffff"
            target-position={[0, 0.5, 0]}
          />
          <spotLight 
            position={[2, 3, 2]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={2} 
            color="#ffffff"
            target-position={[0, 0.5, 0]}
          />
          <spotLight 
            position={[0, 3, -2]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={2} 
            color="#ffffff"
            target-position={[0, 0.5, 0]}
          />
        </>
      )}
      
      {/* Spotlight beam effects */}
      {spotlightsOn && (
        <>
          <Cone args={[0.8, 2]} position={[-2, 2, 2]} rotation={[Math.PI / 6, 0, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </Cone>
          <Cone args={[0.8, 2]} position={[2, 2, 2]} rotation={[Math.PI / 6, 0, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </Cone>
          <Cone args={[0.8, 2]} position={[0, 2, -2]} rotation={[-Math.PI / 6, 0, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </Cone>
        </>
      )}
    </group>
  );
};

// Enhanced Winner's Podium with fireworks
export const EnhancedWinnersPodium: React.FC<StageProps & { showFireworks?: boolean }> = ({ 
  stage, 
  teams, 
  onStageClick, 
  showFireworks = true 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [winnersLocked, setWinnersLocked] = useState(false);
  
  const topTeams = teams.filter(team => team.rank).sort((a, b) => (a.rank || 0) - (b.rank || 0));
  
  useEffect(() => {
    setIsActive(topTeams.length > 0);
    setWinnersLocked(topTeams.length >= 3);
  }, [teams]);

  const { podiumGlow } = useSpring({
    podiumGlow: winnersLocked ? 0.4 : 0.1,
    config: { tension: 120, friction: 30 }
  });

  return (
    <group position={stage.position} onClick={() => onStageClick(stage)}>
      {/* Podium bases with dynamic heights */}
      <Box args={[2, 2, 2]} position={[0, 1, 0]}>
        <animated.meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={podiumGlow}
        />
      </Box>
      <Box args={[1.5, 1.5, 1.5]} position={[-3, 0.75, 0]}>
        <animated.meshStandardMaterial 
          color="#9ca3af" 
          emissive="#9ca3af" 
          emissiveIntensity={podiumGlow}
        />
      </Box>
      <Box args={[1.5, 1, 1.5]} position={[3, 0.5, 0]}>
        <animated.meshStandardMaterial 
          color="#cd7f32" 
          emissive="#cd7f32" 
          emissiveIntensity={podiumGlow}
        />
      </Box>
      
      {/* Team avatars on podium */}
      {topTeams.map((team, index) => {
        const positions = [[0, 3, 0], [-3, 2.25, 0], [3, 1.5, 0]];
        const pos = positions[index] as [number, number, number];
        return (
          <Float key={team.id} speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Sphere args={[0.4]} position={pos}>
              <meshStandardMaterial 
                color={team.color} 
                emissive={team.color} 
                emissiveIntensity={winnersLocked ? 0.4 : 0.2}
              />
            </Sphere>
          </Float>
        );
      })}
      
      {/* Fireworks effect */}
      {winnersLocked && showFireworks && (
        <>
          <ConfettiAnimation 
            position={[stage.position[0], stage.position[1] + 6, stage.position[2]]} 
            count={200}
            spread={10}
            active={true}
          />
          
          {/* Firework bursts */}
          {[...Array(3)].map((_, i) => (
            <Float key={i} speed={3} rotationIntensity={2} floatIntensity={1}>
              <Sphere args={[0.1]} position={[
                (i - 1) * 4,
                6 + Math.sin(i * 2) * 2,
                Math.cos(i * 2) * 2
              ]}>
                <meshBasicMaterial 
                  color={['#ff6b6b', '#4ecdc4', '#45b7d1'][i]}
                  emissive={['#ff6b6b', '#4ecdc4', '#45b7d1'][i]}
                  emissiveIntensity={0.8}
                />
              </Sphere>
            </Float>
          ))}
        </>
      )}
      
      {/* Victory lights */}
      <pointLight 
        position={[0, 5, 0]} 
        color="#fbbf24" 
        intensity={winnersLocked ? 2.0 : 0.8}
        distance={15}
      />
      <pointLight 
        position={[-3, 4, 0]} 
        color="#9ca3af" 
        intensity={winnersLocked ? 1.5 : 0.6}
        distance={12}
      />
      <pointLight 
        position={[3, 3, 0]} 
        color="#cd7f32" 
        intensity={winnersLocked ? 1.2 : 0.5}
        distance={10}
      />
    </group>
  );
};

// Stage Info Panel Component
export const StageInfoPanel: React.FC<{ 
  stage: Stage | null; 
  onClose: () => void;
  teams: Team[];
}> = ({ stage, onClose, teams }) => {
  if (!stage) return null;

  const teamsAtStage = teams.filter(team => team.stageIndex === teams.findIndex(t => t.stageIndex === teams.indexOf(teams.find(tm => tm.stageIndex === stage.position.indexOf(stage.position[0])))));

  return (
    <Html position={[stage.position[0], stage.position[1] + 6, stage.position[2]]} center>
      <div className="bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-2xl border border-white/30 min-w-72 max-w-sm">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-white">{stage.name}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{stage.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Teams at stage:</span>
            <span className="text-white">{teamsAtStage.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Stage type:</span>
            <span className="text-white capitalize">{stage.type}</span>
          </div>
        </div>
        
        {teamsAtStage.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Teams here:</h4>
            <div className="space-y-1">
              {teamsAtStage.slice(0, 3).map(team => (
                <div key={team.id} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-white">{team.name}</span>
                </div>
              ))}
              {teamsAtStage.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{teamsAtStage.length - 3} more teams
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};
