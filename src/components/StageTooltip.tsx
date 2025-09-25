import React from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { StageInfo } from '../data/stageData';

interface StageTooltipProps {
  stageInfo: StageInfo;
  position: [number, number, number];
  isVisible: boolean;
  isJudgeMode: boolean;
  onLearnMore?: () => void;
}

const StageTooltip: React.FC<StageTooltipProps> = ({
  stageInfo,
  position,
  isVisible,
  isJudgeMode,
  onLearnMore
}) => {
  if (!isVisible) return null;

  // Calculate offset position to avoid overlapping with stage
  const offsetPosition: [number, number, number] = [
    position[0] + 4, // Offset to the right
    position[1] + 3, // Slightly above
    position[2]
  ];

  return (
    <Html
      position={offsetPosition}
      center
      distanceFactor={8}
      occlude="blending"
      transform
      sprite // Billboard effect - always faces camera
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg border shadow-lg min-w-[220px] max-w-[280px]"
            style={{
              borderColor: `${stageInfo.color}80`,
              boxShadow: `0 0 15px ${stageInfo.color}30, 0 4px 20px rgba(0,0,0,0.3)`
            }}
          >
            {/* Subtle glow effect */}
            <div 
              className="absolute inset-0 rounded-lg opacity-20 blur-sm"
              style={{ backgroundColor: stageInfo.color }}
            />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stageInfo.icon}</span>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {stageInfo.name}
                </h3>
              </div>

              {/* Short Description */}
              <p className="text-xs text-gray-200 mb-3 leading-relaxed">
                {stageInfo.shortDescription}
              </p>

              {/* Judge Mode Criteria */}
              {isJudgeMode && stageInfo.judgeCriteria && (
                <div className="mb-3 p-2 bg-yellow-900/20 rounded border border-yellow-700/30">
                  <p className="text-xs text-yellow-200">
                    <span className="font-semibold">Criteria:</span> {stageInfo.judgeCriteria}
                  </p>
                </div>
              )}

              {/* Learn More Button */}
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="w-full text-xs px-2 py-1 rounded transition-colors"
                  style={{ 
                    backgroundColor: `${stageInfo.color}20`,
                    borderColor: `${stageInfo.color}60`,
                    color: stageInfo.color
                  }}
                >
                  Learn More →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
};

export default StageTooltip;
