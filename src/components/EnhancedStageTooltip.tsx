import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StageInfo } from '../data/stageData';

interface EnhancedStageTooltipProps {
  stageInfo: StageInfo;
  isVisible: boolean;
  isJudgeMode: boolean;
  onLearnMore?: () => void;
  targetElement?: HTMLElement | null;
  mousePosition?: { x: number; y: number };
}

interface TooltipPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const EnhancedStageTooltip: React.FC<EnhancedStageTooltipProps> = ({
  stageInfo,
  isVisible,
  isJudgeMode,
  onLearnMore,
  targetElement,
  mousePosition
}) => {
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0, placement: 'top' });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (): TooltipPosition => {
    if (!tooltipRef.current) return { x: 0, y: 0, placement: 'top' };

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let targetRect: DOMRect;
    
    if (targetElement) {
      targetRect = targetElement.getBoundingClientRect();
    } else if (mousePosition) {
      // Create a virtual rect around mouse position
      targetRect = {
        left: mousePosition.x - 10,
        right: mousePosition.x + 10,
        top: mousePosition.y - 10,
        bottom: mousePosition.y + 10,
        width: 20,
        height: 20,
        x: mousePosition.x - 10,
        y: mousePosition.y - 10,
        toJSON: () => ({})
      } as DOMRect;
    } else {
      return { x: 0, y: 0, placement: 'top' };
    }

    const spacing = 15; // Distance from target element
    const tooltipWidth = tooltipRect.width || 280;
    const tooltipHeight = tooltipRect.height || 200;

    // Calculate center positions
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Try different placements and find the best one
    const placements = [
      {
        placement: 'top' as const,
        x: targetCenterX - tooltipWidth / 2,
        y: targetRect.top - tooltipHeight - spacing
      },
      {
        placement: 'bottom' as const,
        x: targetCenterX - tooltipWidth / 2,
        y: targetRect.bottom + spacing
      },
      {
        placement: 'left' as const,
        x: targetRect.left - tooltipWidth - spacing,
        y: targetCenterY - tooltipHeight / 2
      },
      {
        placement: 'right' as const,
        x: targetRect.right + spacing,
        y: targetCenterY - tooltipHeight / 2
      }
    ];

    // Find the best placement that fits in viewport
    for (const pos of placements) {
      const fitsHorizontally = pos.x >= 10 && pos.x + tooltipWidth <= viewportWidth - 10;
      const fitsVertically = pos.y >= 10 && pos.y + tooltipHeight <= viewportHeight - 10;
      
      if (fitsHorizontally && fitsVertically) {
        return pos;
      }
    }

    // Fallback: position near mouse/target but ensure it stays in viewport
    let x = targetCenterX - tooltipWidth / 2;
    let y = targetRect.top - tooltipHeight - spacing;

    // Adjust horizontal position
    if (x < 10) x = 10;
    if (x + tooltipWidth > viewportWidth - 10) x = viewportWidth - tooltipWidth - 10;

    // Adjust vertical position
    if (y < 10) y = targetRect.bottom + spacing;
    if (y + tooltipHeight > viewportHeight - 10) y = viewportHeight - tooltipHeight - 10;

    return { x, y, placement: 'top' };
  };

  useEffect(() => {
    if (isVisible && (targetElement || mousePosition)) {
      const updatePosition = () => {
        const newPosition = calculatePosition();
        setPosition(newPosition);
      };

      // Initial position calculation
      updatePosition();

      // Update position on scroll/resize
      const handleUpdate = () => updatePosition();
      window.addEventListener('scroll', handleUpdate);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible, targetElement, mousePosition]);

  const getArrowStyles = () => {
    const arrowSize = 8;
    const { placement } = position;
    
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
      case 'left':
        return {
          ...baseStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${stageInfo.color}80`,
        };
      case 'right':
        return {
          ...baseStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${stageInfo.color}80 transparent transparent`,
        };
      default:
        return baseStyles;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ 
            duration: 0.2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="fixed z-[9999] pointer-events-auto"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div
            className="bg-black/90 backdrop-blur-md text-white p-4 rounded-xl border shadow-2xl min-w-[240px] max-w-[320px] relative"
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

              {/* Action Buttons */}
              <div className="flex gap-2">
                {onLearnMore && (
                  <button
                    onClick={onLearnMore}
                    className="flex-1 text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
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
                <button
                  className="px-3 py-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  onClick={() => {/* Close tooltip */}}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedStageTooltip;
