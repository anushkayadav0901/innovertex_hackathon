import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';

export interface CameraTransitionProps {
  isTransitioning: boolean;
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
  onTransitionComplete?: () => void;
  transitionDuration?: number;
  enableControls?: boolean;
}

const CameraTransition: React.FC<CameraTransitionProps> = ({
  isTransitioning,
  targetPosition = [0, 0, 0],
  targetLookAt = [0, 0, 0],
  onTransitionComplete,
  transitionDuration = 2.0,
  enableControls = true
}) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  
  const transitionRef = useRef({
    isTransitioning: false,
    startTime: 0,
    startPosition: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    duration: transitionDuration
  });

  // Start transition when requested
  useEffect(() => {
    if (isTransitioning && !transitionRef.current.isTransitioning) {
      const controls = controlsRef.current;
      
      // Store current camera state
      transitionRef.current.startPosition.copy(camera.position);
      transitionRef.current.startLookAt.copy(
        controls ? controls.getTarget(new THREE.Vector3()) : new THREE.Vector3(0, 0, 0)
      );
      
      // Set target state
      transitionRef.current.targetPosition.set(...targetPosition);
      transitionRef.current.targetLookAt.set(...targetLookAt);
      
      // Start transition
      transitionRef.current.isTransitioning = true;
      transitionRef.current.startTime = Date.now();
      transitionRef.current.duration = transitionDuration * 1000; // Convert to ms
      
      // Disable controls during transition
      if (controls) {
        controls.enabled = false;
      }
    }
  }, [isTransitioning, targetPosition, targetLookAt, transitionDuration, camera]);

  useFrame(() => {
    const transition = transitionRef.current;
    
    if (transition.isTransitioning) {
      const elapsed = Date.now() - transition.startTime;
      const progress = Math.min(elapsed / transition.duration, 1);
      
      // Smooth easing function (ease-in-out cubic)
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const easedProgress = easeInOutCubic(progress);
      
      // Interpolate camera position
      const currentPosition = new THREE.Vector3().lerpVectors(
        transition.startPosition,
        transition.targetPosition,
        easedProgress
      );
      
      // Interpolate look-at target
      const currentLookAt = new THREE.Vector3().lerpVectors(
        transition.startLookAt,
        transition.targetLookAt,
        easedProgress
      );
      
      // Update camera
      camera.position.copy(currentPosition);
      camera.lookAt(currentLookAt);
      
      // Update controls target if available
      if (controlsRef.current) {
        controlsRef.current.setLookAt(
          currentPosition.x, currentPosition.y, currentPosition.z,
          currentLookAt.x, currentLookAt.y, currentLookAt.z,
          false // Don't animate, we're handling it manually
        );
      }
      
      // Check if transition is complete
      if (progress >= 1) {
        transition.isTransitioning = false;
        
        // Re-enable controls
        if (controlsRef.current && enableControls) {
          controlsRef.current.enabled = true;
        }
        
        // Call completion callback
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      enabled={enableControls && !transitionRef.current.isTransitioning}
      makeDefault
      minDistance={5}
      maxDistance={100}
      maxPolarAngle={Math.PI / 2}
      azimuthRotateSpeed={0.3}
      polarRotateSpeed={0.3}
      dollySpeed={0.3}
      truckSpeed={0.3}
    />
  );
};

export default CameraTransition;
