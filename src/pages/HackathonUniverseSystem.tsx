import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import HackathonUniverse from '../components/HackathonUniverse';
import UniverseQuestMap from '../components/UniverseQuestMap';
import CameraTransition from '../components/CameraTransition';
import HackathonQuestMap from './HackathonQuestMap';
import { useUniverseData, Hackathon } from '../hooks/useUniverseData';

// Info card component for hovered hackathon
const HackathonInfoCard: React.FC<{ hackathon: Hackathon | null }> = ({ hackathon }) => {
  if (!hackathon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="absolute bottom-4 left-4 bg-black bg-opacity-80 backdrop-blur-md text-white p-6 rounded-xl border border-white/30 shadow-2xl max-w-sm z-50"
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

type ViewMode = 'universe' | 'quest-map' | 'transitioning';

const HackathonUniverseSystem: React.FC = () => {
  const {
    hackathons,
    teams,
    selectedHackathon,
    constellations,
    selectHackathon,
    backToUniverse,
    getTeamsForHackathon,
    getHackathonStats
  } = useUniverseData();

  const [viewMode, setViewMode] = useState<ViewMode>('universe');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredHackathon, setHoveredHackathon] = useState<Hackathon | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [cameraTarget, setCameraTarget] = useState<{
    position: [number, number, number];
    lookAt: [number, number, number];
  } | null>(null);

  // Handle planet click - transition to quest map
  const handlePlanetClick = (hackathon: Hackathon) => {
    selectHackathon(hackathon);
    setViewMode('transitioning');
    setIsTransitioning(true);
    
    // Set camera target for quest map view
    setCameraTarget({
      position: [0, 10, 20],
      lookAt: [0, 0, 0]
    });
  };

  // Handle back to universe
  const handleBackToUniverse = () => {
    // Clear selected hackathon first
    backToUniverse(); // This clears selectedHackathon in the hook
    
    setViewMode('transitioning');
    setIsTransitioning(true);
    
    // Set camera target for universe view
    setCameraTarget({
      position: [0, 20, 40],
      lookAt: [0, 0, 0]
    });
  };

  // Handle transition completion
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    
    if (selectedHackathon) {
      setViewMode('quest-map');
    } else {
      setViewMode('universe');
    }
    
    setCameraTarget(null);
  };

  // Get current hackathon teams
  const currentTeams = selectedHackathon ? getTeamsForHackathon(selectedHackathon.id) : [];

  // Loading state
  if (!hackathons.length) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center"
        >
          <div className="text-2xl font-bold mb-4">🌌 Loading Hackathon Universe...</div>
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  // If we're in quest map view, render the quest map component directly
  if (viewMode === 'quest-map' && selectedHackathon) {
    return (
      <div className="w-full h-screen relative">
        <HackathonQuestMap />
        {/* Back to Universe Button for Quest Map */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={handleBackToUniverse}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg border border-blue-500"
            disabled={isTransitioning}
          >
            🌌 Back to Universe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 20, 40], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        {/* Camera transition system */}
        <CameraTransition
          isTransitioning={isTransitioning}
          targetPosition={cameraTarget?.position}
          targetLookAt={cameraTarget?.lookAt}
          onTransitionComplete={handleTransitionComplete}
          transitionDuration={2.5}
          enableControls={!isTransitioning}
        />

        {/* Render current view */}
        {viewMode === 'universe' && (
          <HackathonUniverse
            hackathons={hackathons}
            constellations={constellations}
            onPlanetClick={handlePlanetClick}
            onPlanetHover={setHoveredHackathon}
          />
        )}
        
        {viewMode === 'transitioning' && !selectedHackathon && (
          <HackathonUniverse
            hackathons={hackathons}
            constellations={constellations}
            onPlanetClick={() => {}}
            onPlanetHover={() => {}}
          />
        )}

        {/* Camera controls (disabled during transition) */}
        {!isTransitioning && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={10}
            maxDistance={100}
            autoRotate={false}
          />
        )}
      </Canvas>

      {/* UI Overlay - Universe View Only */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-xl border border-white/20"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          🌌 Hackathon Universe
        </h1>
        
        <div>
          <p className="text-sm opacity-90 mb-3">
            Explore hackathons across the galaxy
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-blue-400">🪐</span>
              <span>{hackathons.length} hackathons</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-purple-400">✨</span>
              <span>{constellations.length} organizers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">👥</span>
              <span>{teams.length} total teams</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">🏆</span>
              <span>{teams.filter(t => t.stageIndex >= 4).length} winners</span>
            </div>
          </div>
        </div>

        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-xs bg-blue-900/50 p-2 rounded-lg border border-blue-500/30"
          >
            <p className="font-semibold text-blue-300 mb-1">
              {selectedHackathon ? '🚀 Flying to hackathon...' : '🌌 Returning to universe...'}
            </p>
            <div className="w-full bg-blue-900/30 rounded-full h-1">
              <motion.div
                className="bg-blue-400 h-1 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-xl border border-white/20 max-w-sm"
      >
        <h3 className="font-bold mb-2">🎮 How to Navigate</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Hover planets</strong> - View hackathon details</li>
          <li>• <strong>Click planets</strong> - Dive into quest map</li>
          <li>• <strong>Mouse drag</strong> - Rotate universe</li>
          <li>• <strong>Mouse wheel</strong> - Zoom in/out</li>
          <li>• <strong>Constellation lines</strong> - Same organizer</li>
        </ul>
      </motion.div>

      {/* Constellation Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-xl border border-white/20"
      >
        <h3 className="font-bold mb-3">✨ Constellations</h3>
        <div className="space-y-2">
          {constellations.map((constellation) => (
            <div key={constellation.organizer} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: constellation.color }}
              />
              <span className="font-medium">{constellation.organizer}</span>
              <span className="text-gray-400">({constellation.hackathons.length})</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hackathon Info Card */}
      <AnimatePresence>
        <HackathonInfoCard hackathon={hoveredHackathon} />
      </AnimatePresence>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HackathonUniverseSystem;
