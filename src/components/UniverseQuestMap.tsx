import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Box, Cylinder, Cone, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Hackathon, Team } from '../hooks/useUniverseData';

// Stage definitions
const QUEST_STAGES = [
  { 
    id: 'registration', 
    name: 'Registration Gate', 
    position: [-15, 0, 0] as [number, number, number], 
    color: '#8b5cf6',
    description: 'Teams register and prepare for the journey'
  },
  { 
    id: 'ideation', 
    name: 'Idea Valley', 
    position: [-7, 0, 0] as [number, number, number], 
    color: '#10b981',
    description: 'Brainstorming and concept development'
  },
  { 
    id: 'development', 
    name: 'Prototype Tower', 
    position: [0, 0, 0] as [number, number, number], 
    color: '#6366f1',
    description: 'Building and coding the solution'
  },
  { 
    id: 'presentation', 
    name: 'Pitch Arena', 
    position: [7, 0, 0] as [number, number, number], 
    color: '#dc2626',
    description: 'Presenting to judges and audience'
  },
  { 
    id: 'results', 
    name: "Winner's Podium", 
    position: [15, 0, 0] as [number, number, number], 
    color: '#fbbf24',
    description: 'Celebrating achievements and winners'
  }
];

// Enhanced stage components
const RegistrationGate: React.FC<{ stage: any; isActive: boolean }> = ({ stage, isActive }) => {
  const gateRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gateRef.current && isActive) {
      gateRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={gateRef} position={stage.position}>
      {/* Gate pillars */}
      <Box args={[0.5, 4, 0.5]} position={[-2, 2, 0]}>
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={isActive ? 0.3 : 0.1} />
      </Box>
      <Box args={[0.5, 4, 0.5]} position={[2, 2, 0]}>
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={isActive ? 0.3 : 0.1} />
      </Box>
      
      {/* Gate arch */}
      <Cylinder args={[0.3, 0.3, 4]} position={[0, 4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={isActive ? 0.3 : 0.1} />
      </Cylinder>
      
      {/* Floating orbs */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.2]} position={[-1, 3, 1]}>
          <meshBasicMaterial color={stage.color} transparent opacity={0.8} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <Sphere args={[0.15]} position={[1, 3.5, -1]}>
          <meshBasicMaterial color={stage.color} transparent opacity={0.8} />
        </Sphere>
      </Float>
      
      <pointLight position={[0, 3, 0]} color={stage.color} intensity={isActive ? 1 : 0.5} />
    </group>
  );
};

const IdeaValley: React.FC<{ stage: any; isActive: boolean }> = ({ stage, isActive }) => {
  const valleyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (valleyRef.current) {
      valleyRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.2 + 1;
        }
      });
    }
  });

  return (
    <group ref={valleyRef} position={stage.position}>
      {/* Valley base */}
      <Cylinder args={[3, 3, 0.5]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={isActive ? 0.2 : 0.05} />
      </Cylinder>
      
      {/* Floating light bulbs */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-1, 2, 0]}>
          <Sphere args={[0.3]}>
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={isActive ? 0.8 : 0.3} />
          </Sphere>
          <Cylinder args={[0.1, 0.15, 0.3]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#666666" />
          </Cylinder>
        </group>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
        <group position={[1, 2.5, 0.5]}>
          <Sphere args={[0.25]}>
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={isActive ? 0.8 : 0.3} />
          </Sphere>
          <Cylinder args={[0.08, 0.12, 0.25]} position={[0, -0.35, 0]}>
            <meshStandardMaterial color="#666666" />
          </Cylinder>
        </group>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <group position={[0, 1.8, -1]}>
          <Sphere args={[0.2]}>
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={isActive ? 0.8 : 0.3} />
          </Sphere>
          <Cylinder args={[0.06, 0.1, 0.2]} position={[0, -0.3, 0]}>
            <meshStandardMaterial color="#666666" />
          </Cylinder>
        </group>
      </Float>
      
      <pointLight position={[0, 3, 0]} color="#ffff00" intensity={isActive ? 1.5 : 0.8} />
    </group>
  );
};

const PrototypeTower: React.FC<{ stage: any; isActive: boolean; teamCount: number }> = ({ stage, isActive, teamCount }) => {
  const towerRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (towerRef.current && isActive) {
      towerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const windowCount = Math.min(teamCount * 2, 8);

  return (
    <group ref={towerRef} position={stage.position}>
      {/* Tower base */}
      <Cylinder args={[2, 1.5, 6]} position={[0, 3, 0]}>
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={isActive ? 0.2 : 0.05} />
      </Cylinder>
      
      {/* Tower windows */}
      {Array.from({ length: windowCount }, (_, i) => {
        const angle = (i / windowCount) * Math.PI * 2;
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        const y = 1 + (i % 4) * 1.2;
        
        return (
          <Box key={i} args={[0.3, 0.4, 0.1]} position={[x, y, z]}>
            <meshStandardMaterial 
              color="#ffff00" 
              emissive="#ffff00" 
              emissiveIntensity={isActive && i < teamCount ? 0.8 : 0.2} 
            />
          </Box>
        );
      })}
      
      {/* Rotating gears */}
      <Float speed={2} rotationIntensity={isActive ? 1 : 0.1} floatIntensity={0}>
        <Cylinder args={[0.5, 0.5, 0.2]} position={[2.5, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </Float>
      
      <Float speed={1.5} rotationIntensity={isActive ? -0.8 : -0.1} floatIntensity={0}>
        <Cylinder args={[0.3, 0.3, 0.15]} position={[-2.2, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </Float>
      
      <pointLight position={[0, 5, 0]} color={stage.color} intensity={isActive ? 1.2 : 0.6} />
    </group>
  );
};

const PitchArena: React.FC<{ stage: any; isActive: boolean }> = ({ stage, isActive }) => {
  const arenaRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={arenaRef} position={stage.position}>
      {/* Arena platform */}
      <Cylinder args={[4, 4, 0.5]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={isActive ? 0.3 : 0.1} />
      </Cylinder>
      
      {/* Spotlights */}
      <Cone args={[0.5, 1]} position={[-3, 4, 3]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Cone>
      <Cone args={[0.5, 1]} position={[3, 4, 3]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Cone>
      <Cone args={[0.5, 1]} position={[0, 4, -3]} rotation={[-Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Cone>
      
      {/* Spotlight beams */}
      {isActive && (
        <>
          <Cone args={[2, 4]} position={[-3, 2, 1]} rotation={[Math.PI / 4, 0, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </Cone>
          <Cone args={[2, 4]} position={[3, 2, 1]} rotation={[Math.PI / 4, 0, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </Cone>
          <Cone args={[2, 4]} position={[0, 2, -1]} rotation={[-Math.PI / 4, 0, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </Cone>
        </>
      )}
      
      {/* Arena lights */}
      {isActive && (
        <>
          <spotLight position={[-3, 4, 3]} target-position={[0, 0, 0]} intensity={2} angle={Math.PI / 4} />
          <spotLight position={[3, 4, 3]} target-position={[0, 0, 0]} intensity={2} angle={Math.PI / 4} />
          <spotLight position={[0, 4, -3]} target-position={[0, 0, 0]} intensity={2} angle={Math.PI / 4} />
        </>
      )}
    </group>
  );
};

const WinnersPodium: React.FC<{ stage: any; teams: Team[]; showFireworks: boolean }> = ({ stage, teams, showFireworks }) => {
  const podiumRef = useRef<THREE.Group>(null);
  const confettiRef = useRef<THREE.Points>(null);
  
  // Get top 3 teams
  const topTeams = teams
    .filter(team => team.stageIndex >= 4)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);

  useFrame((state) => {
    if (podiumRef.current && showFireworks) {
      podiumRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (confettiRef.current && showFireworks) {
      confettiRef.current.rotation.y += 0.01;
    }
  });

  // Confetti system
  const confettiGeometry = React.useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < 200; i++) {
      positions.push(
        (Math.random() - 0.5) * 10,
        Math.random() * 8 + 5,
        (Math.random() - 0.5) * 10
      );
      
      colors.push(Math.random(), Math.random(), Math.random());
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, []);

  return (
    <group ref={podiumRef} position={stage.position}>
      {/* Podium blocks */}
      {/* Gold (1st place) */}
      <Box args={[2, 2, 2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={showFireworks ? 0.5 : 0.2} />
      </Box>
      
      {/* Silver (2nd place) */}
      <Box args={[2, 1.5, 2]} position={[-3, 0.75, 0]}>
        <meshStandardMaterial color="#c0c0c0" emissive="#c0c0c0" emissiveIntensity={showFireworks ? 0.3 : 0.1} />
      </Box>
      
      {/* Bronze (3rd place) */}
      <Box args={[2, 1, 2]} position={[3, 0.5, 0]}>
        <meshStandardMaterial color="#cd7f32" emissive="#cd7f32" emissiveIntensity={showFireworks ? 0.3 : 0.1} />
      </Box>
      
      {/* Winner team avatars */}
      {topTeams.map((team, index) => {
        const positions = [[0, 3], [-3, 2.25], [3, 1.5]];
        const [x, y] = positions[index] || [0, 0];
        
        return (
          <Float key={team.id} speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Sphere args={[0.3]} position={[x, y, 0]}>
              <meshStandardMaterial 
                color={team.avatarColor} 
                emissive={team.avatarColor} 
                emissiveIntensity={0.4} 
              />
            </Sphere>
            <Text
              position={[x, y + 0.8, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {team.teamName}
            </Text>
          </Float>
        );
      })}
      
      {/* Confetti */}
      {showFireworks && (
        <points ref={confettiRef} geometry={confettiGeometry}>
          <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} />
        </points>
      )}
      
      <pointLight position={[0, 5, 0]} color="#ffd700" intensity={showFireworks ? 2 : 1} />
    </group>
  );
};

// Quest path connecting stages
const QuestPath: React.FC = () => {
  return (
    <group>
      {QUEST_STAGES.map((stage, index) => {
        if (index === 0) return null;
        const prevStage = QUEST_STAGES[index - 1];
        
        const start = prevStage.position;
        const end = stage.position;
        const distance = Math.sqrt(Math.pow(end[0] - start[0], 2));
        
        const midPoint: [number, number, number] = [
          (start[0] + end[0]) / 2,
          0.1,
          0
        ];
        
        return (
          <Cylinder key={index} args={[0.1, 0.1, distance]} position={midPoint}>
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.3} />
          </Cylinder>
        );
      })}
    </group>
  );
};

// Team avatar component
const TeamAvatar: React.FC<{ 
  team: Team; 
  onHover: (team: Team | null) => void;
  onClick: (team: Team) => void;
}> = ({ team, onHover, onClick }) => {
  const stage = QUEST_STAGES[team.stageIndex];
  if (!stage) return null;

  const position: [number, number, number] = [
    stage.position[0] + (Math.random() - 0.5) * 3,
    stage.position[1] + 2,
    stage.position[2] + (Math.random() - 0.5) * 3
  ];

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere
          args={[0.3]}
          onPointerEnter={() => onHover(team)}
          onPointerLeave={() => onHover(null)}
          onClick={() => onClick(team)}
        >
          <meshStandardMaterial 
            color={team.avatarColor}
            emissive={team.avatarColor}
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>
      
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {team.teamName}
      </Text>
    </group>
  );
};

// Main UniverseQuestMap component (3D scene only)
const UniverseQuestMapScene: React.FC<{
  hackathon: Hackathon;
  teams: Team[];
  onTeamHover: (team: Team | null) => void;
  onTeamClick: (team: Team | null) => void;
}> = ({ hackathon, teams, onTeamHover, onTeamClick }) => {
  // Get team counts per stage
  const getTeamCountAtStage = (stageIndex: number) => {
    return teams.filter(team => team.stageIndex === stageIndex).length;
  };

  const showFireworks = teams.some(team => team.stageIndex >= 4);

  return (
    <>
      {/* Quest Map Background */}
      <color attach="background" args={['#1a1a2e']} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2a2a4e" />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      
      {/* Quest Path */}
      <QuestPath />
      
      {/* Stage Labels */}
      {QUEST_STAGES.map((stage) => (
        <Text
          key={`${stage.id}-label`}
          position={[stage.position[0], stage.position[1] + 6, stage.position[2]]}
          fontSize={0.6}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {stage.name}
        </Text>
      ))}
      
      {/* Enhanced Stages */}
      {QUEST_STAGES.map((stage, index) => {
        const isActive = getTeamCountAtStage(index) > 0;
        const teamCount = getTeamCountAtStage(index);
        
        switch (stage.id) {
          case 'registration':
            return <RegistrationGate key={stage.id} stage={stage} isActive={isActive} />;
          case 'ideation':
            return <IdeaValley key={stage.id} stage={stage} isActive={isActive} />;
          case 'development':
            return <PrototypeTower key={stage.id} stage={stage} isActive={isActive} teamCount={teamCount} />;
          case 'presentation':
            return <PitchArena key={stage.id} stage={stage} isActive={isActive} />;
          case 'results':
            return <WinnersPodium key={stage.id} stage={stage} teams={teams} showFireworks={showFireworks} />;
          default:
            return null;
        }
      })}
      
      {/* Team Avatars */}
      {teams.map((team) => (
        <TeamAvatar
          key={team.id}
          team={team}
          onHover={onTeamHover}
          onClick={onTeamClick}
        />
      ))}
    </>
  );
};

// Main UniverseQuestMap component with UI
const UniverseQuestMap: React.FC<{
  hackathon: Hackathon;
  teams: Team[];
  onBackToUniverse: () => void;
  onTeamHover?: (team: Team | null) => void;
  onTeamClick?: (team: Team | null) => void;
}> = ({ hackathon, teams, onBackToUniverse, onTeamHover, onTeamClick }) => {
  return (
    <>
      {/* 3D Scene */}
      <UniverseQuestMapScene
        hackathon={hackathon}
        teams={teams}
        onTeamHover={onTeamHover || (() => {})}
        onTeamClick={onTeamClick || (() => {})}
      />
    </>
  );
};

export default UniverseQuestMap;
