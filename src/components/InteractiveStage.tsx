import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { StageInfo } from '../data/stageData';

interface InteractiveStageProps {
  stageInfo: StageInfo;
  position: [number, number, number];
  children: React.ReactNode;
  isJudgeMode: boolean;
  onLearnMore?: () => void;
  onHoverStart?: (stageInfo: StageInfo, position: [number, number, number]) => void;
  onHoverEnd?: () => void;
}

const InteractiveStage: React.FC<InteractiveStageProps> = ({
  stageInfo,
  position,
  children,
  isJudgeMode,
  onLearnMore,
  onHoverStart,
  onHoverEnd
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subtle pulsing glow animation
  useFrame((state) => {
    if (glowRef.current && isHovered) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const handlePointerEnter = useCallback(() => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setIsHovered(true);
    setShowTooltip(true);
    document.body.style.cursor = 'pointer';
    
    // Add small delay to prevent rapid flickering
    hoverTimeoutRef.current = setTimeout(() => {
      onHoverStart?.(stageInfo, position);
    }, 100);
  }, [stageInfo, position, onHoverStart]);

  const handlePointerLeave = useCallback(() => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setIsHovered(false);
    setShowTooltip(false);
    document.body.style.cursor = 'auto';
    
    // Add small delay before hiding to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      onHoverEnd?.();
    }, 50);
  }, [onHoverEnd]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Toggle tooltip on mobile/touch devices
    setShowTooltip(!showTooltip);
    setIsHovered(!isHovered);
  };

  return (
    <group position={position}>
      {/* Invisible larger collision area for stable hover detection */}
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        visible={false}
      >
        <sphereGeometry args={[6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Interactive wrapper */}
      <group ref={groupRef}>
        {/* Subtle pulsing glow when hovered */}
        {isHovered && (
          <mesh ref={glowRef} position={[0, 0, 0]}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshBasicMaterial
              color={stageInfo.color}
              transparent
              opacity={0.08}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Stage content with subtle lift */}
        <animated.group
          position-y={useSpring({ y: isHovered ? 0.2 : 0 }).y}
        >
          {children}
        </animated.group>
      </group>

    </group>
  );
};

export default InteractiveStage;
