import React from 'react';
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
import { deviceProfile } from '../../services/deviceProfile';

const FloatingCameraRig: React.FC = () => {
  const handPos = useNexusStore((state) => state.handPosition);
  useFrame(({ camera, clock, pointer }) => {
    const t = clock.getElapsedTime();
    const driftX = Math.sin(t * 0.3) * 0.3;
    const driftY = Math.cos(t * 0.2) * 0.2;
    const targetX = (pointer.x || handPos.x) * 0.8 + driftX;
    const targetY = (pointer.y || handPos.y) * 0.5 + driftY;
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
    setHandPosition({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
  };
  return (
    <div onPointerMove={handlePointerMove} className="w-full h-full relative cursor-crosshair bg-slate-950">
      <Canvas
        dpr={deviceProfile.dpr}
        camera={{ position: [0, 0, 6.2], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: deviceProfile.performance !== 'low', alpha: false, powerPreference: 'high-performance' }}
      >
        <FloatingCameraRig />
        <VolumetricEnvironment />
        {deviceProfile.performance !== 'low' && <LightBeams />}
        <FloatingParticles count={deviceProfile.particleCount} />
        <Holographic3DAIPulse />
        <CentralAIOrc />
        <Carousel3D />
        {deviceProfile.performance !== 'low' && <FloatingHolographicText3D />}
        <LaserPointer3D />
        {deviceProfile.effects && <PostProcessingFX />}
      </Canvas>
    </div>
  );
};
