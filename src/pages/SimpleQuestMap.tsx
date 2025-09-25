import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sphere, Box, Cylinder, Cone, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

// Simple types
interface SimpleStage {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
}

interface SimpleTeam {
  id: string;
  name: string;
  stageIndex: number;
  color: string;
}

// Sample data
const SIMPLE_STAGES: SimpleStage[] = [
  { id: '1', name: 'Registration', position: [-15, 0, 0], color: '#8b5cf6' },
  { id: '2', name: 'Ideation', position: [-7, 0, 0], color: '#10b981' },
  { id: '3', name: 'Development', position: [0, 0, 0], color: '#6366f1' },
  { id: '4', name: 'Presentation', position: [7, 0, 0], color: '#dc2626' },
  { id: '5', name: 'Results', position: [15, 0, 0], color: '#fbbf24' }
];

const SIMPLE_TEAMS: SimpleTeam[] = [
  { id: '1', name: 'Team Alpha', stageIndex: 2, color: '#ff6b6b' },
  { id: '2', name: 'Team Beta', stageIndex: 1, color: '#4ecdc4' },
  { id: '3', name: 'Team Gamma', stageIndex: 3, color: '#45b7d1' },
  { id: '4', name: 'Team Delta', stageIndex: 0, color: '#f9ca24' }
];

// Simple Stage Component
const SimpleStageComponent: React.FC<{ stage: SimpleStage; onClick: (stage: SimpleStage) => void }> = ({ stage, onClick }) => {
  return (
    <group position={stage.position} onClick={() => onClick(stage)}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Box args={[2, 2, 2]}>
          <meshStandardMaterial color={stage.color} />
        </Box>
      </Float>
      
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {stage.name}
      </Text>
      
      <pointLight position={[0, 2, 0]} color={stage.color} intensity={0.5} />
    </group>
  );
};

// Simple Team Avatar
const SimpleTeamAvatar: React.FC<{ 
  team: SimpleTeam; 
  stages: SimpleStage[];
  onClick: (team: SimpleTeam) => void;
}> = ({ team, stages, onClick }) => {
  const stage = stages[team.stageIndex];
  if (!stage) return null;

  const position: [number, number, number] = [
    stage.position[0] + (Math.random() - 0.5) * 2,
    stage.position[1] + 2,
    stage.position[2] + (Math.random() - 0.5) * 2
  ];

  return (
    <group position={position} onClick={() => onClick(team)}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere args={[0.3]}>
          <meshStandardMaterial color={team.color} />
        </Sphere>
      </Float>
      
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {team.name}
      </Text>
    </group>
  );
};

// Simple Quest Path
const SimpleQuestPath: React.FC<{ stages: SimpleStage[] }> = ({ stages }) => {
  return (
    <group>
      {stages.map((stage, index) => {
        if (index === 0) return null;
        const prevStage = stages[index - 1];
        
        const start = prevStage.position;
        const end = stage.position;
        const distance = Math.sqrt(
          Math.pow(end[0] - start[0], 2) + 
          Math.pow(end[2] - start[2], 2)
        );
        
        const midPoint: [number, number, number] = [
          (start[0] + end[0]) / 2,
          0.1,
          (start[2] + end[2]) / 2
        ];
        
        return (
          <mesh key={index} position={midPoint}>
            <cylinderGeometry args={[0.1, 0.1, distance]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        );
      })}
    </group>
  );
};

// Main Component
const SimpleQuestMap: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<SimpleStage | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<SimpleTeam | null>(null);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 relative">
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        {/* Basic Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Quest Path */}
        <SimpleQuestPath stages={SIMPLE_STAGES} />
        
        {/* Stages */}
        {SIMPLE_STAGES.map((stage) => (
          <SimpleStageComponent
            key={stage.id}
            stage={stage}
            onClick={setSelectedStage}
          />
        ))}
        
        {/* Team Avatars */}
        {SIMPLE_TEAMS.map((team) => (
          <SimpleTeamAvatar
            key={team.id}
            team={team}
            stages={SIMPLE_STAGES}
            onClick={setSelectedTeam}
          />
        ))}
        
        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-2">Simple Quest Map</h1>
        <p className="text-sm opacity-80">Basic 3D hackathon visualization</p>
        <div className="mt-2 text-xs opacity-60">
          {SIMPLE_TEAMS.length} teams • {SIMPLE_STAGES.length} stages
        </div>
      </div>
      
      {/* Stage Info */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm z-50"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedStage.name}
              </h3>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div 
              className="w-4 h-4 rounded-full mb-2" 
              style={{ backgroundColor: selectedStage.color }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stage in the hackathon journey
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Team Info */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm z-50"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedTeam.name}
              </h3>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedTeam.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Currently at: {SIMPLE_STAGES[selectedTeam.stageIndex]?.name}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleQuestMap;
