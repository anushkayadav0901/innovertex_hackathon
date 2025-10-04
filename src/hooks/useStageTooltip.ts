import { useState, useCallback, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TooltipState {
  isVisible: boolean;
  stageInfo: any;
  screenPosition: { x: number; y: number } | null;
  targetElement: HTMLElement | null;
}

export const useStageTooltip = () => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isVisible: false,
    stageInfo: null,
    screenPosition: null,
    targetElement: null
  });

  const { camera, gl, size } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });

  // Track mouse position for fallback positioning
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showTooltip = useCallback((stageInfo: any, worldPosition: [number, number, number]) => {
    // Convert 3D world position to 2D screen coordinates
    const vector = new THREE.Vector3(...worldPosition);
    vector.project(camera);

    // Convert normalized device coordinates to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * size.width;
    const y = (vector.y * -0.5 + 0.5) * size.height;

    // Check if the position is visible (not behind camera)
    if (vector.z > 1) {
      hideTooltip();
      return;
    }

    setTooltipState({
      isVisible: true,
      stageInfo,
      screenPosition: { x, y },
      targetElement: null
    });
  }, [camera, size]);

  const showTooltipAtElement = useCallback((stageInfo: any, element: HTMLElement) => {
    setTooltipState({
      isVisible: true,
      stageInfo,
      screenPosition: null,
      targetElement: element
    });
  }, []);

  const showTooltipAtMouse = useCallback((stageInfo: any) => {
    setTooltipState({
      isVisible: true,
      stageInfo,
      screenPosition: mousePosition.current,
      targetElement: null
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipState({
      isVisible: false,
      stageInfo: null,
      screenPosition: null,
      targetElement: null
    });
  }, []);

  const updateTooltipPosition = useCallback((worldPosition: [number, number, number]) => {
    if (!tooltipState.isVisible) return;

    const vector = new THREE.Vector3(...worldPosition);
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * size.width;
    const y = (vector.y * -0.5 + 0.5) * size.height;

    if (vector.z <= 1) {
      setTooltipState(prev => ({
        ...prev,
        screenPosition: { x, y }
      }));
    }
  }, [camera, size, tooltipState.isVisible]);

  return {
    tooltipState,
    showTooltip,
    showTooltipAtElement,
    showTooltipAtMouse,
    hideTooltip,
    updateTooltipPosition
  };
};
