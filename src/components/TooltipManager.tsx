import React, { useCallback, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TooltipManagerProps {
  onTooltipUpdate: (data: {
    isVisible: boolean;
    stageInfo: any;
    screenPosition: { x: number; y: number } | null;
  }) => void;
}

export const TooltipManager: React.FC<TooltipManagerProps> = ({ onTooltipUpdate }) => {
  const { camera, size } = useThree();
  const currentTooltipRef = useRef<{
    stageInfo: any;
    worldPosition: [number, number, number];
  } | null>(null);

  const convertWorldToScreen = useCallback((worldPosition: [number, number, number]) => {
    const vector = new THREE.Vector3(...worldPosition);
    vector.project(camera);

    // Check if the position is visible (not behind camera)
    if (vector.z > 1) {
      return null;
    }

    // Convert normalized device coordinates to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * size.width;
    const y = (vector.y * -0.5 + 0.5) * size.height;

    return { x, y };
  }, [camera, size]);

  const showTooltip = useCallback((stageInfo: any, worldPosition: [number, number, number]) => {
    currentTooltipRef.current = { stageInfo, worldPosition };
    
    const screenPosition = convertWorldToScreen(worldPosition);
    if (screenPosition) {
      onTooltipUpdate({
        isVisible: true,
        stageInfo,
        screenPosition
      });
    }
  }, [convertWorldToScreen, onTooltipUpdate]);

  const hideTooltip = useCallback(() => {
    currentTooltipRef.current = null;
    onTooltipUpdate({
      isVisible: false,
      stageInfo: null,
      screenPosition: null
    });
  }, [onTooltipUpdate]);

  // Update tooltip position on camera/viewport changes
  useEffect(() => {
    if (currentTooltipRef.current) {
      const { stageInfo, worldPosition } = currentTooltipRef.current;
      const screenPosition = convertWorldToScreen(worldPosition);
      
      if (screenPosition) {
        onTooltipUpdate({
          isVisible: true,
          stageInfo,
          screenPosition
        });
      } else {
        hideTooltip();
      }
    }
  }, [camera.position.x, camera.position.y, camera.position.z, size.width, size.height, convertWorldToScreen, onTooltipUpdate, hideTooltip]);

  // Expose methods to parent through a global reference
  useEffect(() => {
    (window as any).__tooltipManager = {
      showTooltip,
      hideTooltip
    };

    return () => {
      delete (window as any).__tooltipManager;
    };
  }, [showTooltip, hideTooltip]);

  return null; // This component doesn't render anything
};
