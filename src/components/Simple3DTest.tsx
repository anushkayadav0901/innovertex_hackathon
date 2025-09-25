import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';

// Simple test component to verify 3D rendering works
const Simple3DTest: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Basic lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Simple 3D objects */}
        <Box position={[-2, 0, 0]} args={[1, 1, 1]}>
          <meshStandardMaterial color="hotpink" />
        </Box>
        
        <Sphere position={[2, 0, 0]} args={[0.5]}>
          <meshStandardMaterial color="lightblue" />
        </Sphere>
        
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 2]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        
        {/* Camera controls */}
        <OrbitControls />
      </Canvas>
      
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">3D Test Scene</h2>
        <p className="text-sm">If you can see 3D objects, Three.js is working!</p>
        <ul className="text-xs mt-2 space-y-1">
          <li>• Pink cube (left)</li>
          <li>• Orange cylinder (center)</li>
          <li>• Blue sphere (right)</li>
          <li>• Mouse to rotate camera</li>
        </ul>
      </div>
    </div>
  );
};

export default Simple3DTest;
