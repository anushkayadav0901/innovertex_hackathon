import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Enhanced components
import EnhancedTeamAvatar from '../components/EnhancedTeamAvatar';
import {
  EnhancedRegistrationGate,
  EnhancedIdeaValley,
  EnhancedPrototypeTower,
  EnhancedPitchArena,
  EnhancedWinnersPodium,
  StageInfoPanel
} from '../components/EnhancedStages';
import CurvedQuestPath from '../components/CurvedQuestPath';
import AtmosphericBackground from '../components/AtmosphericBackground';
import CompetitiveLeaderboard from '../components/CompetitiveLeaderboard';
import JudgeWalkingMode from '../components/JudgeWalkingMode';
import JudgeEvaluationPanel from '../components/JudgeEvaluationPanel';

// Data hook
import { useQuestMapData, type Stage, type Team } from '../hooks/useQuestMapData';

// Audio component for background music
const BackgroundMusic: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (enabled) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Autoplay prevented - user interaction required');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [enabled]);

  return (
    <audio
      ref={audioRef}
      loop
      style={{ display: 'none' }}
    >
      {/* You would add your audio source here */}
      {/* <source src="/path/to/your/background-music.mp3" type="audio/mpeg" /> */}
    </audio>
  );
};

// Enhanced main component
const EnhancedHackathonQuestMap: React.FC = () => {
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [judgeWalkingMode, setJudgeWalkingMode] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [judgeEvaluating, setJudgeEvaluating] = useState<Team | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [dayNightCycle, setDayNightCycle] = useState(true);

  const {
    stages,
    teams,
    isLoading,
    getTeamPosition,
    updateTeamStage
  } = useQuestMapData();

  const handleJudgeEvaluation = (teamId: string, evaluation: any) => {
    console.log('Team evaluation:', teamId, evaluation);
    if (evaluation.approved) {
      const team = teams.find(t => t.id === teamId);
      if (team && team.stageIndex < stages.length - 1) {
        updateTeamStage(teamId, team.stageIndex + 1);
      }
    }
  };

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage);
  };

  const handleTeamClick = (team: Team) => {
    if (judgeWalkingMode) {
      setJudgeEvaluating(team);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center"
        >
          <div className="text-2xl font-bold mb-4">Loading Epic Quest Map...</div>
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 15, 30], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        {/* Atmospheric Background */}
        <AtmosphericBackground dayNightCycle={dayNightCycle} />

        {/* Curved Quest Path */}
        <CurvedQuestPath stages={stages} animated={true} />

        {/* Enhanced Stages */}
        {stages.map((stage: Stage) => {
          const StageComponent = {
            gate: EnhancedRegistrationGate,
            valley: EnhancedIdeaValley,
            tower: EnhancedPrototypeTower,
            arena: EnhancedPitchArena,
            podium: EnhancedWinnersPodium
          }[stage.type];

          return StageComponent ? (
            <StageComponent
              key={stage.id}
              stage={stage}
              teams={teams}
              onStageClick={handleStageClick}
              showFireworks={stage.type === 'podium'}
            />
          ) : null;
        })}

        {/* Stage Labels */}
        {stages.map((stage: Stage) => (
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

        {/* Enhanced Team Avatars */}
        {teams.map((team) => (
          <EnhancedTeamAvatar
            key={team.id}
            team={team}
            stages={stages}
            onHover={setHoveredTeam}
            onClick={handleTeamClick}
            showTrail={showTrails}
          />
        ))}

        {/* Stage Info Panel */}
        <StageInfoPanel
          stage={selectedStage}
          teams={teams}
          onClose={() => setSelectedStage(null)}
        />

        {/* Judge Walking Mode */}
        <JudgeWalkingMode
          enabled={judgeWalkingMode}
          onToggle={setJudgeWalkingMode}
        />

        {/* Camera Controls */}
        {!judgeWalkingMode && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={10}
            maxDistance={80}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>

      {/* Enhanced UI Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-xl border border-white/20"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Epic Hackathon Quest
        </h1>
        <p className="text-sm opacity-90 mb-3">
          Interactive journey • Live competition • Judge exploration
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1">
            <span className="text-green-400">●</span>
            <span>{teams.length} teams</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">●</span>
            <span>{stages.length} stages</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">●</span>
            <span>{teams.filter(t => t.stageIndex >= stages.length - 1).length} finished</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-400">●</span>
            <span>{teams.filter(t => t.rank).length} ranked</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setJudgeWalkingMode(!judgeWalkingMode)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                judgeWalkingMode
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {judgeWalkingMode ? 'Walking Mode' : 'Judge Walk'}
            </button>
            
            <button
              onClick={() => setShowTrails(!showTrails)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                showTrails
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {showTrails ? 'Trails' : 'Show Trails'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDayNightCycle(!dayNightCycle)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                dayNightCycle
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {dayNightCycle ? 'Day/Night' : 'Static Sky'}
            </button>
            
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                musicEnabled
                  ? 'bg-pink-600 hover:bg-pink-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {musicEnabled ? 'Music ON' : 'Music'}
            </button>
          </div>
        </div>

        {judgeWalkingMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-xs bg-green-900/50 p-2 rounded-lg border border-green-500/30"
          >
            <p className="font-semibold text-green-300 mb-1">Judge Mode Active</p>
            <p>WASD to move • Mouse to look • Click teams to evaluate • ESC to exit</p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Team Tooltip */}
      <AnimatePresence>
        {hoveredTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-4 left-4 bg-black bg-opacity-80 backdrop-blur-md text-white p-4 rounded-xl border border-white/30 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full shadow-lg"
                style={{ backgroundColor: hoveredTeam.color }}
              />
              <h3 className="font-bold text-lg">{hoveredTeam.name}</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Stage:</span>
                <span className="text-white">{stages[hoveredTeam.stageIndex]?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Progress:</span>
                <span className="text-green-400">
                  {Math.round(((hoveredTeam.stageIndex + 1) / stages.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Members:</span>
                <span className="text-white">{hoveredTeam.members.length}</span>
              </div>
              {hoveredTeam.score && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Score:</span>
                  <span className="text-yellow-400 font-semibold">{hoveredTeam.score} pts</span>
                </div>
              )}
              {hoveredTeam.rank && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Rank:</span>
                  <span className="text-yellow-400 font-semibold">#{hoveredTeam.rank}</span>
                </div>
              )}
            </div>
            
            {judgeWalkingMode && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-green-400 flex items-center gap-1">
                  Click to evaluate this team
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: selectedTeam.color }}
                    />
                    <h2 className="text-xl font-bold text-white">{selectedTeam.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Team Members</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeam.members.map((member, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-800 text-white text-xs rounded-lg"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Current Stage</h3>
                      <p className="text-white">{stages[selectedTeam.stageIndex]?.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Progress</h3>
                      <p className="text-green-400 font-semibold">
                        {Math.round(((selectedTeam.stageIndex + 1) / stages.length) * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  {selectedTeam.score && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Score</h3>
                      <p className="text-yellow-400 font-bold text-lg">{selectedTeam.score} points</p>
                    </div>
                  )}
                  
                  {selectedTeam.submissionLink && (
                    <a
                      href={selectedTeam.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View Submission
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
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

      {/* Background Music */}
      <BackgroundMusic enabled={musicEnabled} />
    </div>
  );
};

export default EnhancedHackathonQuestMap;
