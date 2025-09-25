import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Text, Line, Float, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Hackathon, Constellation } from '../hooks/useUniverseData';

// Planet component for individual hackathons
const HackathonPlanet: React.FC<{
  hackathon: Hackathon;
  onHover: (hackathon: Hackathon | null) => void;
  onClick: (hackathon: Hackathon) => void;
  isHovered: boolean;
}> = ({ hackathon, onHover, onClick, isHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (glowRef.current) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(isHovered ? 1.3 * pulse : 1.1 * pulse);
    }
  });

  return (
    <group position={hackathon.position}>
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[hackathon.scale * 1.2, 32, 32]}>
        <meshBasicMaterial 
          color={hackathon.color} 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Main planet */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere
          ref={meshRef}
          args={[hackathon.scale, 32, 32]}
          onPointerEnter={() => onHover(hackathon)}
          onPointerLeave={() => onHover(null)}
          onClick={() => onClick(hackathon)}
        >
          <meshStandardMaterial 
            color={hackathon.color}
            emissive={hackathon.color}
            emissiveIntensity={isHovered ? 0.3 : 0.1}
            roughness={0.7}
            metalness={0.3}
          />
        </Sphere>
      </Float>
      
      {/* Planet label */}
      <Text
        position={[0, hackathon.scale + 1.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {hackathon.name}
      </Text>
      
      {/* Organizer label */}
      <Text
        position={[0, hackathon.scale + 1, 0]}
        fontSize={0.2}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="black"
      >
        by {hackathon.organizer}
      </Text>
      
      {/* Point light for planet */}
      <pointLight 
        position={[0, 0, 0]} 
        color={hackathon.color} 
        intensity={isHovered ? 0.8 : 0.4} 
        distance={10}
      />
    </group>
  );
};

// Constellation lines connecting planets from same organizer
const ConstellationLines: React.FC<{ constellations: Constellation[] }> = ({ constellations }) => {
  return (
    <>
      {constellations.map((constellation, index) => (
        <group key={constellation.organizer}>
          {constellation.hackathons.map((hackathon, hackIndex) => 
            constellation.hackathons.slice(hackIndex + 1).map((otherHackathon, otherIndex) => {
              const points = [
                new THREE.Vector3(...hackathon.position),
                new THREE.Vector3(...otherHackathon.position)
              ];
              
              return (
                <Line
                  key={`${hackathon.id}-${otherHackathon.id}`}
                  points={points}
                  color={constellation.color}
                  lineWidth={1}
                  transparent
                  opacity={0.3}
                  dashed
                  dashScale={50}
                  dashSize={1}
                  gapSize={1}
                />
              );
            })
          )}
        </group>
      ))}
    </>
  );
};

// Info card component for hovered hackathon
const HackathonInfoCard: React.FC<{ hackathon: Hackathon | null }> = ({ hackathon }) => {
  if (!hackathon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="absolute bottom-4 left-4 bg-black bg-opacity-80 backdrop-blur-md text-white p-6 rounded-xl border border-white/30 shadow-2xl max-w-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full shadow-lg"
          style={{ backgroundColor: hackathon.color }}
        />
        <h3 className="font-bold text-xl">{hackathon.name}</h3>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Organizer:</span>
          <span className="text-white font-medium">{hackathon.organizer}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Category:</span>
          <span className="text-blue-400">{hackathon.category}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Dates:</span>
          <span className="text-white">
            {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
          </span>
        </div>
        
        {hackathon.participantCount && (
          <div className="flex justify-between">
            <span className="text-gray-400">Participants:</span>
            <span className="text-green-400 font-semibold">{hackathon.participantCount}</span>
          </div>
        )}
        
        {hackathon.prizePool && (
          <div className="flex justify-between">
            <span className="text-gray-400">Prize Pool:</span>
            <span className="text-yellow-400 font-bold">{hackathon.prizePool}</span>
          </div>
        )}
        
        {hackathon.description && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-gray-300 text-xs leading-relaxed">
              {hackathon.description}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-600">
        <p className="text-xs text-blue-400 flex items-center gap-1">
          👆 Click planet to explore this hackathon
        </p>
      </div>
    </motion.div>
  );
};

// Main HackathonUniverse component
const HackathonUniverse: React.FC<{
  hackathons: Hackathon[];
  constellations: Constellation[];
  onPlanetClick: (hackathon: Hackathon) => void;
  onPlanetHover?: (hackathon: Hackathon | null) => void;
}> = ({ hackathons, constellations, onPlanetClick, onPlanetHover }) => {
  const [hoveredHackathon, setHoveredHackathon] = useState<Hackathon | null>(null);
  const { camera } = useThree();

  const handleHover = (hackathon: Hackathon | null) => {
    setHoveredHackathon(hackathon);
    if (onPlanetHover) {
      onPlanetHover(hackathon);
    }
  };

  // Set up universe camera position
  React.useEffect(() => {
    camera.position.set(0, 20, 40);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Universe Background */}
      <Stars 
        radius={300} 
        depth={100} 
        count={10000} 
        factor={8} 
        saturation={0.8} 
        fade 
        speed={0.3}
      />
      
      {/* Ambient space lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[50, 50, 25]} intensity={0.4} color="#87ceeb" />
      
      {/* Constellation lines */}
      <ConstellationLines constellations={constellations} />
      
      {/* Hackathon planets */}
      {hackathons.map((hackathon) => (
        <HackathonPlanet
          key={hackathon.id}
          hackathon={hackathon}
          onHover={handleHover}
          onClick={onPlanetClick}
          isHovered={hoveredHackathon?.id === hackathon.id}
        />
      ))}
      
      {/* Universe center glow */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
    </>
  );
};

export default HackathonUniverse;
