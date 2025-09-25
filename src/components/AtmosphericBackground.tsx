import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Sky } from '@react-three/drei';
import * as THREE from 'three';

interface AtmosphericBackgroundProps {
  dayNightCycle?: boolean;
  cycleSpeed?: number;
}

const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  dayNightCycle = true,
  cycleSpeed = 0.1
}) => {
  const { scene } = useThree();
  const skyRef = useRef<any>(null);
  const starsRef = useRef<any>(null);
  
  // Create gradient skybox
  const skyboxGeometry = useMemo(() => new THREE.SphereGeometry(500, 32, 32), []);
  const skyboxMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0x89b2ff) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        uniform float time;
        varying vec3 vWorldPosition;
        
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          
          // Day-night cycle colors
          vec3 dayTop = vec3(0.3, 0.6, 1.0);
          vec3 dayBottom = vec3(0.8, 0.9, 1.0);
          vec3 nightTop = vec3(0.05, 0.05, 0.2);
          vec3 nightBottom = vec3(0.1, 0.1, 0.3);
          
          float cycle = sin(time * 0.1) * 0.5 + 0.5;
          vec3 currentTop = mix(nightTop, dayTop, cycle);
          vec3 currentBottom = mix(nightBottom, dayBottom, cycle);
          
          gl_FragColor = vec4(mix(currentBottom, currentTop, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    return material;
  }, []);

  // Animated nebula clouds
  const nebulaGeometry = useMemo(() => new THREE.PlaneGeometry(100, 100), []);
  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;
        
        // Simple noise function
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 st = vUv * 3.0;
          float n = noise(st + time * 0.1);
          n += noise(st * 2.0 + time * 0.15) * 0.5;
          n += noise(st * 4.0 + time * 0.2) * 0.25;
          
          vec3 color1 = vec3(0.8, 0.3, 1.0); // Purple
          vec3 color2 = vec3(0.3, 0.8, 1.0); // Cyan
          vec3 color3 = vec3(1.0, 0.5, 0.8); // Pink
          
          vec3 finalColor = mix(color1, color2, sin(n * 3.14159));
          finalColor = mix(finalColor, color3, cos(n * 2.0));
          
          gl_FragColor = vec4(finalColor, opacity * n);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update skybox shader
    if (skyboxMaterial.uniforms) {
      skyboxMaterial.uniforms.time.value = time * cycleSpeed;
    }
    
    // Update nebula shader
    if (nebulaMaterial.uniforms) {
      nebulaMaterial.uniforms.time.value = time;
    }
    
    // Rotate stars slowly
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = Math.sin(time * 0.005) * 0.1;
    }
  });

  return (
    <>
      {/* Animated Skybox */}
      <mesh geometry={skyboxGeometry} material={skyboxMaterial} />
      
      {/* Animated Stars */}
      <group ref={starsRef}>
        <Stars 
          radius={300} 
          depth={100} 
          count={8000} 
          factor={6} 
          saturation={0.8} 
          fade 
          speed={0.5}
        />
      </group>
      
      {/* Nebula clouds */}
      <mesh 
        geometry={nebulaGeometry} 
        material={nebulaMaterial}
        position={[-50, 30, -80]}
        rotation={[0, 0.5, 0]}
      />
      <mesh 
        geometry={nebulaGeometry} 
        material={nebulaMaterial}
        position={[60, 25, -70]}
        rotation={[0, -0.3, 0]}
        scale={[0.8, 0.8, 0.8]}
      />
      <mesh 
        geometry={nebulaGeometry} 
        material={nebulaMaterial}
        position={[0, 40, -90]}
        rotation={[0, 0.8, 0]}
        scale={[1.2, 0.6, 1.2]}
      />
      
      {/* Ambient lighting that changes with day-night cycle */}
      <ambientLight 
        intensity={dayNightCycle ? 0.2 + Math.sin(Date.now() * 0.0001) * 0.1 : 0.3} 
        color="#ffffff" 
      />
      
      {/* Directional light (sun) */}
      <directionalLight
        position={[50, 50, 25]}
        intensity={dayNightCycle ? 0.8 + Math.sin(Date.now() * 0.0001) * 0.3 : 0.8}
        color="#ffffff"
        castShadow
      />
      
      {/* Moon light (subtle blue) */}
      <directionalLight
        position={[-50, 30, -25]}
        intensity={dayNightCycle ? 0.3 - Math.sin(Date.now() * 0.0001) * 0.2 : 0.1}
        color="#87ceeb"
      />
      
      {/* Atmospheric fog */}
      <fog attach="fog" args={['#87ceeb', 100, 400]} />
    </>
  );
};

export default AtmosphericBackground;
