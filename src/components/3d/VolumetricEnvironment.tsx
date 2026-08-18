import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const VolumetricEnvironment: React.FC = () => {
  const fogRef = useRef<THREE.FogExp2>(null);
  const lightGroupRef = useRef<THREE.Group>(null);
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightGroupRef.current) {
      lightGroupRef.current.rotation.y = t * 0.05;
    }
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.4) * 8;
      light1Ref.current.position.y = Math.cos(t * 0.3) * 4;
      light1Ref.current.intensity = 2.5 + Math.sin(t * 1.5) * 0.8;
    }
    if (light2Ref.current) {
      light2Ref.current.position.z = Math.cos(t * 0.5) * 8;
      light2Ref.current.position.y = Math.sin(t * 0.2) * 5;
      light2Ref.current.intensity = 2.0 + Math.cos(t * 1.2) * 0.6;
    }
  });

  return (
    <>
      {/* Dark Volumetric Atmospheric Fog */}
      <color attach="background" args={['#020617']} />
      <fogExp2 ref={fogRef} attach="fog" args={['#020617', 0.045]} />

      {/* Ambient Lighting */}
      <ambientLight intensity={0.25} color="#0f172a" />

      {/* Moving Holographic Blue / Cyan Point Lights */}
      <group ref={lightGroupRef}>
        <pointLight
          ref={light1Ref}
          position={[6, 3, -4]}
          color="#38bdf8"
          intensity={3}
          distance={25}
          decay={2}
        />
        <pointLight
          ref={light2Ref}
          position={[-6, -2, -6]}
          color="#3b82f6"
          intensity={2.5}
          distance={25}
          decay={2}
        />
        {/* Subtle Warm Accent Light (Warning / Accent state indicator) */}
        <pointLight
          position={[0, 8, -10]}
          color="#f97316"
          intensity={0.4}
          distance={20}
          decay={2}
        />
      </group>

      {/* Atmospheric Floor Grid Mesh with Holographic Shader lines */}
      <gridHelper
        args={[60, 60, '#0284c7', '#0f172a']}
        position={[0, -5, 0]}
      />
    </>
  );
};
