import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '../../store/useNexusStore';

export const LaserPointer3D: React.FC = () => {
  const pointerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const handPos = useNexusStore((state) => state.handPosition);
  const isHandTrackingActive = useNexusStore((state) => state.isHandTrackingActive);

  useFrame(({ clock }) => {
    if (!pointerRef.current) return;
    const t = clock.getElapsedTime();

    // Map handPos (-1..1) to 3D world space coordinates
    const targetX = handPos.x * 5.0;
    const targetY = handPos.y * 3.5;
    const targetZ = -2 + (handPos.isPinching ? -0.5 : 0);

    // Spring Lerp
    pointerRef.current.position.x = THREE.MathUtils.lerp(pointerRef.current.position.x, targetX, 0.2);
    pointerRef.current.position.y = THREE.MathUtils.lerp(pointerRef.current.position.y, targetY, 0.2);
    pointerRef.current.position.z = THREE.MathUtils.lerp(pointerRef.current.position.z, targetZ, 0.2);

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 2;
      const scale = handPos.isPinching ? 0.6 : 1.0 + Math.sin(t * 4) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={pointerRef} position={[0, 0, -2]}>
      {/* Laser Tip Point Light */}
      <pointLight
        color={handPos.isPinching ? '#f97316' : '#38bdf8'}
        intensity={handPos.isPinching ? 4 : 2}
        distance={4}
      />

      {/* Outer Targeting Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial
          color={handPos.isPinching ? '#f97316' : '#38bdf8'}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Reticle Dot */}
      <mesh>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={handPos.isPinching ? '#f97316' : '#ffffff'} />
      </mesh>
    </group>
  );
};
