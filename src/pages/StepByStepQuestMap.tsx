import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sphere, Box, Cylinder, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';

// Simple data
const stages = [
  { id: '1', name: 'Registration', position: [-15, 0, 0], color: '#8b5cf6' },
  { id: '2', name: 'Ideation', position: [-7, 0, 0], color: '#10b981' },
  { id: '3', name: 'Development', position: [0, 0, 0], color: '#6366f1' },
  { id: '4', name: 'Presentation', position: [7, 0, 0], color: '#dc2626' },
  { id: '5', name: 'Results', position: [15, 0, 0], color: '#fbbf24' }
];

const teams = [
  { id: '1', name: 'Team Alpha', stageIndex: 2, color: '#ff6b6b' },
  { id: '2', name: 'Team Beta', stageIndex: 1, color: '#4ecdc4' },
  { id: '3', name: 'Team Gamma', stageIndex: 3, color: '#45b7d1' }
];

// Feature toggle component
const FeatureToggle: React.FC<{
  label: string;
  enabled: boolean;
  onToggle: () => void;
  description: string;
}> = ({ label, enabled, onToggle, description }) => (
  <div className="mb-3">
    <button
      onClick={onToggle}
      className={`w-full text-left p-2 rounded transition-colors ${
        enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{label}</span>
        <span className="text-xs">{enabled ? 'ON' : 'OFF'}</span>
      </div>
    </button>
    <p className="text-xs text-gray-300 mt-1 px-2">{description}</p>
  </div>
);

// Enhanced stage component
const EnhancedStage: React.FC<{
  stage: any;
  showAnimation: boolean;
  showGlow: boolean;
}> = ({ stage, showAnimation, showGlow }) => {
  return (
    <group position={stage.position}>
      {showAnimation ? (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <Box args={[2, 2, 2]}>
            <meshStandardMaterial 
              color={stage.color} 
              emissive={showGlow ? stage.color : '#000000'}
              emissiveIntensity={showGlow ? 0.3 : 0}
            />
          </Box>
        </Float>
      ) : (
        <Box args={[2, 2, 2]}>
          <meshStandardMaterial color={stage.color} />
        </Box>
      )}
      
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {stage.name}
      </Text>
      
      {showGlow && (
        <pointLight position={[0, 2, 0]} color={stage.color} intensity={0.5} />
      )}
    </group>
  );
};

// Enhanced team avatar
const EnhancedTeamAvatar: React.FC<{
  team: any;
  showAnimation: boolean;
  showTrail: boolean;
}> = ({ team, showAnimation, showTrail }) => {
  const stage = stages[team.stageIndex];
  if (!stage) return null;

  const position: [number, number, number] = [
    stage.position[0] + (Math.random() - 0.5) * 2,
    stage.position[1] + 2,
    stage.position[2] + (Math.random() - 0.5) * 2
  ];

  return (
    <group position={position}>
      {/* Trail effect */}
      {showTrail && (
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshBasicMaterial color={team.color} transparent opacity={0.5} />
        </mesh>
      )}
      
      {showAnimation ? (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <Sphere args={[0.3]}>
            <meshStandardMaterial 
              color={team.color}
              emissive={team.color}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ) : (
        <Sphere args={[0.3]}>
          <meshStandardMaterial color={team.color} />
        </Sphere>
      )}
      
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

// Path component
const QuestPath: React.FC<{ showPath: boolean }> = ({ showPath }) => {
  if (!showPath) return null;
  
  return (
    <group>
      {stages.map((stage, index) => {
        if (index === 0) return null;
        const prevStage = stages[index - 1];
        
        const start = prevStage.position;
        const end = stage.position;
        const distance = Math.sqrt(Math.pow(end[0] - start[0], 2));
        
        const midPoint: [number, number, number] = [
          (start[0] + end[0]) / 2,
          0.1,
          0
        ];
        
        return (
          <mesh key={index} position={midPoint}>
            <cylinderGeometry args={[0.1, 0.1, distance]} />
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// Main component
const StepByStepQuestMap: React.FC = () => {
  const [showStars, setShowStars] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [showTrails, setShowTrails] = useState(false);
  const [showAtmosphere, setShowAtmosphere] = useState(false);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 relative">
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        {/* Basic Lighting */}
        <ambientLight intensity={showAtmosphere ? 0.2 : 0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Atmospheric lighting */}
        {showAtmosphere && (
          <>
            <directionalLight position={[50, 50, 25]} intensity={0.6} color="#ffffff" />
            <directionalLight position={[-50, 30, -25]} intensity={0.2} color="#87ceeb" />
          </>
        )}
        
        {/* Background Stars */}
        {showStars && (
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        )}
        
        {/* Quest Path */}
        <QuestPath showPath={showPath} />
        
        {/* Stages */}
        {stages.map((stage) => (
          <EnhancedStage
            key={stage.id}
            stage={stage}
            showAnimation={showAnimation}
            showGlow={showGlow}
          />
        ))}
        
        {/* Team Avatars */}
        {teams.map((team) => (
          <EnhancedTeamAvatar
            key={team.id}
            team={team}
            showAnimation={showAnimation}
            showTrail={showTrails}
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
      
      {/* Feature Control Panel */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-sm">
        <h1 className="text-xl font-bold mb-4">Quest Map Features</h1>
        <p className="text-sm mb-4 opacity-80">
          Toggle features ON/OFF to see what makes the enhanced version unique!
        </p>
        
        <FeatureToggle
          label="Background Stars"
          enabled={showStars}
          onToggle={() => setShowStars(!showStars)}
          description="Animated starfield background for immersion"
        />
        
        <FeatureToggle
          label="Quest Path"
          enabled={showPath}
          onToggle={() => setShowPath(!showPath)}
          description="Glowing path connecting all stages"
        />
        
        <FeatureToggle
          label="Floating Animation"
          enabled={showAnimation}
          onToggle={() => setShowAnimation(!showAnimation)}
          description="Objects float and bob naturally"
        />
        
        <FeatureToggle
          label="Glowing Effects"
          enabled={showGlow}
          onToggle={() => setShowGlow(!showGlow)}
          description="Stages glow with colored light"
        />
        
        <FeatureToggle
          label="Team Trails"
          enabled={showTrails}
          onToggle={() => setShowTrails(!showTrails)}
          description="Teams leave glowing trails"
        />
        
        <FeatureToggle
          label="Atmospheric Lighting"
          enabled={showAtmosphere}
          onToggle={() => setShowAtmosphere(!showAtmosphere)}
          description="Dynamic lighting system"
        />
        
        <div className="mt-4 pt-4 border-t border-gray-600">
          <p className="text-xs text-gray-300">
            <strong>Turn ALL features ON</strong> to see the full enhanced experience!
          </p>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">How to Explore</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Mouse drag</strong> - Rotate camera</li>
          <li>• <strong>Mouse wheel</strong> - Zoom in/out</li>
          <li>• <strong>Toggle features</strong> - See differences</li>
          <li>• <strong>Turn all ON</strong> - Full experience</li>
        </ul>
      </div>
    </div>
  );
};

export default StepByStepQuestMap;
