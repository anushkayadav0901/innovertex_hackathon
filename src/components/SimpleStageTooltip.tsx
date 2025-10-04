import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StageInfo } from '../data/stageData';

interface SimpleStageTooltipProps {
  stageInfo: StageInfo | null;
  isVisible: boolean;
  isJudgeMode: boolean;
  onLearnMore?: () => void;
  position?: { x: number; y: number };
}

const SimpleStageTooltip: React.FC<SimpleStageTooltipProps> = ({
  stageInfo,
  isVisible,
  isJudgeMode,
  onLearnMore,
  position = { x: 0, y: 0 }
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const positionUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isVisible || !position) return;

    // Clear existing timeout
    if (positionUpdateTimeoutRef.current) {
      clearTimeout(positionUpdateTimeoutRef.current);
    }

    // Debounce position updates to prevent flickering
    positionUpdateTimeoutRef.current = setTimeout(() => {
      const tooltipWidth = 280;
      const tooltipHeight = 200;
      const spacing = 15;
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let finalX = position.x - tooltipWidth / 2;
      let finalY = position.y - tooltipHeight - spacing;
      let finalPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';

      // Check if tooltip fits above
      if (finalY < 10) {
        finalY = position.y + spacing;
        finalPlacement = 'bottom';
      }

      // Check horizontal bounds
      if (finalX < 10) {
        finalX = 10;
      } else if (finalX + tooltipWidth > viewport.width - 10) {
        finalX = viewport.width - tooltipWidth - 10;
      }

      // Check if tooltip fits below (if we switched to bottom)
      if (finalPlacement === 'bottom' && finalY + tooltipHeight > viewport.height - 10) {
        finalY = viewport.height - tooltipHeight - 10;
      }

      setTooltipPosition({ x: finalX, y: finalY });
      setPlacement(finalPlacement);
    }, 50); // 50ms debounce

    return () => {
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
      }
    };
  }, [isVisible, position]);

  if (!stageInfo || !isVisible) return null;

  const getArrowStyles = () => {
    const arrowSize = 8;
    
    const baseStyles = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderStyle: 'solid' as const,
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyles,
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: `${stageInfo.color}80 transparent transparent transparent`,
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${stageInfo.color}80 transparent`,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: placement === 'top' ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: placement === 'top' ? 10 : -10 }}
          transition={{ 
            duration: 0.2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="fixed z-[9999] pointer-events-auto"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div
            className="bg-black/90 backdrop-blur-md text-white p-4 rounded-xl border shadow-2xl w-[280px] relative"
            style={{
              borderColor: `${stageInfo.color}60`,
              boxShadow: `0 0 20px ${stageInfo.color}20, 0 8px 32px rgba(0,0,0,0.4)`
            }}
          >
            {/* Arrow pointer */}
            <div style={getArrowStyles()} />
            
            {/* Subtle glow effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-10 blur-sm -z-10"
              style={{ backgroundColor: stageInfo.color }}
            />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <span 
                  className="text-2xl p-2 rounded-lg"
                  style={{ backgroundColor: `${stageInfo.color}20` }}
                >
                  {stageInfo.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {stageInfo.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stageInfo.color }}
                    />
                    <span className="text-xs text-gray-300">Stage {stageInfo.id + 1}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-200 mb-4 leading-relaxed">
                {stageInfo.shortDescription}
              </p>

              {/* Key Tasks Preview */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Key Tasks
                </h4>
                <ul className="space-y-1">
                  {stageInfo.tasks.slice(0, 3).map((task, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                      <span 
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: stageInfo.color }}
                      />
                      {task}
                    </li>
                  ))}
                  {stageInfo.tasks.length > 3 && (
                    <li className="text-xs text-gray-400 italic">
                      +{stageInfo.tasks.length - 3} more tasks...
                    </li>
                  )}
                </ul>
              </div>

              {/* Judge Mode Criteria */}
              {isJudgeMode && stageInfo.judgeCriteria && (
                <div className="mb-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400">⚖️</span>
                    <span className="text-xs font-semibold text-yellow-200 uppercase tracking-wide">
                      Judge Criteria
                    </span>
                  </div>
                  <p className="text-sm text-yellow-100">
                    {stageInfo.judgeCriteria}
                  </p>
                </div>
              )}

              {/* Action Button */}
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="w-full text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ 
                    backgroundColor: `${stageInfo.color}20`,
                    borderColor: `${stageInfo.color}60`,
                    color: stageInfo.color,
                    border: '1px solid'
                  }}
                >
                  Learn More →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimpleStageTooltip;
