import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import StageTooltip from './StageTooltip';
import { StageInfo } from '../data/stageData';

interface InteractiveStageProps {
  stageInfo: StageInfo;
  position: [number, number, number];
  children: React.ReactNode;
  isJudgeMode: boolean;
  onLearnMore?: () => void;
}

const InteractiveStage: React.FC<InteractiveStageProps> = ({
  stageInfo,
  position,
  children,
  isJudgeMode,
  onLearnMore
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Subtle pulsing glow animation
  useFrame((state) => {
    if (glowRef.current && isHovered) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const handlePointerEnter = () => {
    setIsHovered(true);
    setShowTooltip(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Toggle tooltip on mobile/touch devices
    setShowTooltip(!showTooltip);
    setIsHovered(!isHovered);
  };

  return (
    <group position={position}>
      {/* Interactive wrapper */}
      <group
        ref={groupRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
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

      {/* Clean, minimal tooltip */}
      <StageTooltip
        stageInfo={stageInfo}
        position={position}
        isVisible={showTooltip}
        isJudgeMode={isJudgeMode}
        onLearnMore={onLearnMore}
      />
    </group>
  );
};

export default InteractiveStage;
