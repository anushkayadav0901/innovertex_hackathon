import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Float, 
  Sphere, 
  Box, 
  Cylinder,
  Cone,
  Html,
  useGLTF,
  Environment,
  Stars
} from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import ConfettiAnimation from '../components/ConfettiAnimation';
import JudgeWalkingMode from '../components/JudgeWalkingMode';
import TeamProgressTrail from '../components/TeamProgressTrail';
import CompetitiveLeaderboard from '../components/CompetitiveLeaderboard';
import JudgeEvaluationPanel from '../components/JudgeEvaluationPanel';
import InteractiveStage from '../components/InteractiveStage';
import StageDetailModal from '../components/StageDetailModal';
import SimpleStageTooltip from '../components/SimpleStageTooltip';
import { useQuestMapData, type Stage, type Team } from '../hooks/useQuestMapData';
import { STAGE_DATA, getStageInfo } from '../data/stageData';

// Stage Components
const RegistrationGate: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Gate pillars */}
      <Cylinder args={[0.3, 0.3, 4]} position={[-2, 2, 0]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 4]} position={[2, 2, 0]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Cylinder>
      {/* Gate arch */}
      <Box args={[4.6, 0.5, 0.5]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#a855f7" />
      </Box>
      {/* Glowing effect */}
      <pointLight position={[0, 3, 0]} color="#8b5cf6" intensity={0.5} />
    </group>
  );
};

const IdeaValley: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Valley base */}
      <Cylinder args={[3, 3, 0.5]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#10b981" />
      </Cylinder>
      {/* Floating idea bulbs */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.3]} position={[-1, 2, 0]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <Sphere args={[0.25]} position={[1, 2.5, 0.5]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      <Float speed={0.8} rotationIntensity={0.7} floatIntensity={0.3}>
        <Sphere args={[0.2]} position={[0, 3, -0.5]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      <pointLight position={[0, 2, 0]} color="#10b981" intensity={0.4} />
    </group>
  );
};

const PrototypeTower: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
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
      {/* Rotating gears */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0}>
        <Cylinder args={[0.5, 0.5, 0.2]} position={[-1.5, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#f59e0b" />
        </Cylinder>
      </Float>
      <Float speed={1.5} rotationIntensity={-1} floatIntensity={0}>
        <Cylinder args={[0.3, 0.3, 0.15]} position={[1.2, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#f59e0b" />
        </Cylinder>
      </Float>
      <pointLight position={[0, 4, 0]} color="#6366f1" intensity={0.6} />
    </group>
  );
};

const PitchArena: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Arena platform */}
      <Cylinder args={[3, 3, 0.5]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#dc2626" />
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
      {/* Spotlights */}
      <spotLight position={[-2, 3, 2]} angle={0.3} penumbra={0.5} intensity={1} color="#ffffff" target-position={[0, 0.5, 0]} />
      <spotLight position={[2, 3, 2]} angle={0.3} penumbra={0.5} intensity={1} color="#ffffff" target-position={[0, 0.5, 0]} />
      <spotLight position={[0, 3, -2]} angle={0.3} penumbra={0.5} intensity={1} color="#ffffff" target-position={[0, 0.5, 0]} />
    </group>
  );
};

const WinnersPodium: React.FC<{ position: [number, number, number]; teams: Team[]; showConfetti?: boolean }> = ({ position, teams, showConfetti = true }) => {
  const topTeams = teams.filter(team => team.rank).sort((a, b) => (a.rank || 0) - (b.rank || 0));
  
  return (
    <group position={position}>
      {/* Podium bases */}
      <Box args={[2, 2, 2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Box args={[1.5, 1.5, 1.5]} position={[-3, 0.75, 0]}>
        <meshStandardMaterial color="#9ca3af" />
      </Box>
      <Box args={[1.5, 1, 1.5]} position={[3, 0.5, 0]}>
        <meshStandardMaterial color="#cd7f32" />
      </Box>
      
      {/* Team avatars on podium */}
      {topTeams.map((team, index) => {
        const positions = [[0, 3, 0], [-3, 2.25, 0], [3, 1.5, 0]];
        const pos = positions[index] as [number, number, number];
        return (
          <Float key={team.id} speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Sphere args={[0.4]} position={pos}>
              <meshStandardMaterial color={team.color} emissive={team.color} emissiveIntensity={0.2} />
            </Sphere>
          </Float>
        );
      })}
      
      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiAnimation 
          position={[position[0], position[1] + 4, position[2]]} 
          count={150}
          spread={8}
          active={true}
        />
      )}
      
      {/* Victory lights */}
      <pointLight position={[0, 5, 0]} color="#fbbf24" intensity={1} />
      <pointLight position={[-3, 4, 0]} color="#9ca3af" intensity={0.8} />
      <pointLight position={[3, 3, 0]} color="#cd7f32" intensity={0.6} />
    </group>
  );
};

// Team Avatar Component
const TeamAvatar: React.FC<{ 
  team: Team; 
  targetPosition: [number, number, number];
  onHover: (team: Team | null) => void;
  onClick: (team: Team) => void;
}> = ({ team, targetPosition, onHover, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { position } = useSpring({
    position: targetPosition,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <animated.group position={position}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere 
          ref={meshRef}
          args={[0.5]} 
          onPointerEnter={() => onHover(team)}
          onPointerLeave={() => onHover(null)}
          onClick={() => onClick(team)}
        >
          <meshStandardMaterial 
            color={team.color} 
            emissive={team.color} 
            emissiveIntensity={0.1}
          />
        </Sphere>
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {team.name}
        </Text>
      </Float>
    </animated.group>
  );
};

// Path Component
const QuestPath: React.FC<{ stages: Stage[] }> = ({ stages }) => {
  const points = stages.map((stage: Stage) => new THREE.Vector3(...stage.position));
  const curve = new THREE.CatmullRomCurve3(points);
  const pathGeometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
  
  return (
    <mesh geometry={pathGeometry}>
      <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.1} />
    </mesh>
  );
};

// Team Info Card Component
const TeamInfoCard: React.FC<{ team: Team; stages: Stage[]; onClose: () => void }> = ({ team, stages, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm z-50"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{team.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Members:</h4>
          <p className="text-gray-600 dark:text-gray-400">{team.members.join(', ')}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Current Stage:</h4>
          <p className="text-gray-600 dark:text-gray-400">{stages[team.stageIndex]?.name}</p>
        </div>
        
        {team.rank && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Rank:</h4>
            <p className="text-gray-600 dark:text-gray-400">#{team.rank}</p>
          </div>
        )}
        
        {team.submissionLink && (
          <a
            href={team.submissionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            View Submission
          </a>
        )}
      </div>
    </motion.div>
  );
};

// Main Component
const HackathonQuestMap: React.FC = () => {
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [judgeWalkingMode, setJudgeWalkingMode] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [judgeEvaluating, setJudgeEvaluating] = useState<Team | null>(null);
  const [selectedStageDetail, setSelectedStageDetail] = useState<any>(null);
  
  // Simple tooltip system using mouse position
  const [tooltipState, setTooltipState] = useState<{
    isVisible: boolean;
    stageInfo: any;
    mousePosition: { x: number; y: number };
  }>({
    isVisible: false,
    stageInfo: null,
    mousePosition: { x: 0, y: 0 }
  });

  // Track mouse position for tooltip placement
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showTooltip = useCallback((stageInfo: any, position: [number, number, number]) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    setTooltipState({
      isVisible: true,
      stageInfo,
      mousePosition: mousePosition
    });
  }, [mousePosition]);

  const hideTooltip = useCallback(() => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Add small delay to prevent rapid flickering
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipState(prev => ({
        ...prev,
        isVisible: false
      }));
    }, 100);
  }, []);

  // Cleanup tooltip timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);
  
  const { 
    stages, 
    teams, 
    isLoading, 
    getTeamPosition,
    getTopTeams,
    updateTeamStage 
  } = useQuestMapData();

  const handleJudgeEvaluation = (teamId: string, evaluation: any) => {
    console.log('Team evaluation:', teamId, evaluation);
    // In a real app, this would send to backend
    if (evaluation.approved) {
      const team = teams.find(t => t.id === teamId);
      if (team && team.stageIndex < stages.length - 1) {
        updateTeamStage(teamId, team.stageIndex + 1);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Quest Map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 relative">
      <Canvas camera={{ position: [0, 10, 25], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
        
        {/* Quest Path */}
        <QuestPath stages={stages} />
        
        {/* Interactive Stages with Tooltips */}
        {stages.map((stage: Stage, index) => {
          const stageInfo = getStageInfo(index);
          if (!stageInfo) return null;

          let StageComponent;
          switch (stage.type) {
            case 'gate':
              StageComponent = <RegistrationGate position={[0, 0, 0]} />;
              break;
            case 'valley':
              StageComponent = <IdeaValley position={[0, 0, 0]} />;
              break;
            case 'tower':
              StageComponent = <PrototypeTower position={[0, 0, 0]} />;
              break;
            case 'arena':
              StageComponent = <PitchArena position={[0, 0, 0]} />;
              break;
            case 'podium':
              StageComponent = <WinnersPodium position={[0, 0, 0]} teams={teams} />;
              break;
            default:
              return null;
          }

          return (
            <InteractiveStage
              key={stage.id}
              stageInfo={stageInfo}
              position={stage.position}
              isJudgeMode={judgeWalkingMode}
              onLearnMore={() => setSelectedStageDetail(stageInfo)}
              onHoverStart={(stageInfo, position) => showTooltip(stageInfo, position)}
              onHoverEnd={hideTooltip}
            >
              {StageComponent}
            </InteractiveStage>
          );
        })}
        
        {/* Stage Labels */}
        {stages.map((stage: Stage) => (
          <Text
            key={`${stage.id}-label`}
            position={[stage.position[0], stage.position[1] + 5, stage.position[2]]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {stage.name}
          </Text>
        ))}
        
        {/* Team Progress Trails */}
        {showTrails && teams.map((team) => (
          <TeamProgressTrail
            key={`trail-${team.id}`}
            team={team}
            stages={stages}
            showTrail={team.stageIndex > 0}
          />
        ))}

        {/* Team Avatars */}
        {teams.map((team) => (
          <TeamAvatar
            key={team.id}
            team={team}
            targetPosition={getTeamPosition(team)}
            onHover={setHoveredTeam}
            onClick={(clickedTeam) => {
              setSelectedTeam(clickedTeam);
              // If in judge mode, open evaluation panel
              if (judgeWalkingMode) {
                setJudgeEvaluating(clickedTeam);
              }
            }}
          />
        ))}

        {/* Judge Walking Mode Controls */}
        <JudgeWalkingMode 
          enabled={judgeWalkingMode}
          onToggle={setJudgeWalkingMode}
        />
        
        {!judgeWalkingMode && (
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={10}
            maxDistance={50}
          />
        )}
      </Canvas>
      
      {/* Enhanced UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">🗺️ Hackathon Quest Map</h1>
        <p className="text-sm opacity-80">Epic journey • Live competition • Judge walkthrough</p>
        <div className="mt-2 text-xs opacity-60">
          {teams.length} teams • {stages.length} stages • {teams.filter(t => t.stageIndex >= stages.length - 1).length} finished
        </div>
        
        {/* Interactive Help */}
        <div className="mt-3 text-xs bg-blue-900/30 p-2 rounded border border-blue-700/30">
          <p className="text-blue-200">
            💡 <strong>Hover stages</strong> for quick info • <strong>Click "Learn More"</strong> for details
          </p>
          <p className="text-blue-300 mt-1">
            📱 On mobile: <strong>Tap stages</strong> to show tooltips
          </p>
        </div>
        
        {/* Control Buttons */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setJudgeWalkingMode(!judgeWalkingMode)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              judgeWalkingMode 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {judgeWalkingMode ? '🚶 Walking Mode ON' : '🎮 Judge Walk Mode'}
          </button>
          <button
            onClick={() => setShowTrails(!showTrails)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              showTrails 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {showTrails ? '✨ Trails ON' : '✨ Show Trails'}
          </button>
        </div>
        
        {judgeWalkingMode && (
          <div className="mt-2 text-xs bg-green-900/50 p-2 rounded">
            <p>🎮 WASD to move • Mouse to look • Click teams to evaluate • ESC to exit</p>
          </div>
        )}
      </div>
      
      {/* Enhanced Hovered Team Tooltip */}
      {hoveredTeam && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-black bg-opacity-80 backdrop-blur text-white p-4 rounded-lg border border-white/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: hoveredTeam.color }}
            />
            <h3 className="font-bold">{hoveredTeam.name}</h3>
          </div>
          <p className="text-sm mb-1">📍 {stages[hoveredTeam.stageIndex]?.name}</p>
          <p className="text-xs opacity-80">
            Progress: {Math.round(((hoveredTeam.stageIndex + 1) / stages.length) * 100)}% • 
            {hoveredTeam.members.length} members
            {hoveredTeam.rank && ` • Rank #${hoveredTeam.rank}`}
          </p>
          {judgeWalkingMode && (
            <p className="text-xs text-green-400 mt-1">👆 Click to evaluate</p>
          )}
        </motion.div>
      )}
      
      {/* Competitive Leaderboard */}
      <CompetitiveLeaderboard
        teams={teams}
        stages={stages}
        isVisible={showLeaderboard}
        onToggle={() => setShowLeaderboard(!showLeaderboard)}
      />

      {/* Team Info Card */}
      <AnimatePresence>
        {selectedTeam && !judgeEvaluating && (
          <TeamInfoCard 
            team={selectedTeam} 
            stages={stages}
            onClose={() => setSelectedTeam(null)} 
          />
        )}
      </AnimatePresence>

      {/* Judge Evaluation Panel */}
      <JudgeEvaluationPanel
        selectedTeam={judgeEvaluating}
        stages={stages}
        onClose={() => {
          setJudgeEvaluating(null);
          setSelectedTeam(null);
        }}
        onEvaluate={handleJudgeEvaluation}
      />

      {/* Stage Detail Modal */}
      <StageDetailModal
        stageInfo={selectedStageDetail}
        isOpen={!!selectedStageDetail}
        onClose={() => setSelectedStageDetail(null)}
        isJudgeMode={judgeWalkingMode}
      />

      {/* Simple Stage Tooltip */}
      <SimpleStageTooltip
        stageInfo={tooltipState.stageInfo}
        isVisible={tooltipState.isVisible}
        isJudgeMode={judgeWalkingMode}
        onLearnMore={() => {
          if (tooltipState.stageInfo) {
            setSelectedStageDetail(tooltipState.stageInfo);
            hideTooltip();
          }
        }}
        position={tooltipState.mousePosition}
      />
    </div>
  );
};

export default HackathonQuestMap;
