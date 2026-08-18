import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VolumetricEnvironment } from './VolumetricEnvironment';
import { FloatingParticles } from './FloatingParticles';
import { LightBeams } from './LightBeams';
import { Carousel3D } from './Carousel3D';
import { LaserPointer3D } from './LaserPointer3D';
import { PostProcessingFX } from './PostProcessingFX';
import { Holographic3DAIPulse } from './Holographic3DAIPulse';
import { CentralAIOrc } from './CentralAIOrc';
import { FloatingHolographicText3D } from './FloatingHolographicText3D';
import { useNexusStore } from '../../store/useNexusStore';

const FloatingCameraRig: React.FC = () => {
  const handPos = useNexusStore((state) => state.handPosition);
  const activeCardId = useNexusStore((state) => state.activeCardId);

  useFrame(({ camera, clock, pointer }) => {
    const t = clock.getElapsedTime();

    // Floating subtle camera drift
    const driftX = Math.sin(t * 0.3) * 0.3;
    const driftY = Math.cos(t * 0.2) * 0.2;

    // Pointer or hand spatial parallax
    const targetX = (pointer.x || handPos.x) * 0.8 + driftX;
    const targetY = (pointer.y || handPos.y) * 0.5 + driftY;

    // Smooth Spring Lerp Camera Position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.2, 0.05);

    camera.lookAt(0, 0, -1);
  });

  return null;
};

export const NexusCanvas: React.FC = () => {
  const setHandPosition = useNexusStore((state) => state.setHandPosition);

  const handlePointerMove = (e: React.PointerEvent) => {
    // Convert screen coordinates to normalized (-1 to 1) for spatial pointer fallback
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setHandPosition({ x, y });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="w-full h-full relative cursor-crosshair bg-slate-950"
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <FloatingCameraRig />
        <VolumetricEnvironment />
        <LightBeams />
        <FloatingParticles count={280} />
        <Holographic3DAIPulse />
        <CentralAIOrc />
        <Carousel3D />
        <FloatingHolographicText3D />
        <LaserPointer3D />
        <PostProcessingFX />
      </Canvas>
    </div>
  );
};
