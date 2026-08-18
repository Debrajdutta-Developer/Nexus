import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAiAssistantStore } from '../../store/useAiAssistantStore';
import { useNexusStore } from '../../store/useNexusStore';

export const Holographic3DAIPulse: React.FC = () => {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);

  const wakeProgress = useAiAssistantStore((state) => state.wakeState.waveProgress);
  const isWoken = useAiAssistantStore((state) => state.wakeState.isWoken);
  const aiPulseActive = useNexusStore((state) => state.aiPulseActive);

  useFrame((_, delta) => {
    const active = isWoken || aiPulseActive;

    if (meshRef1.current) {
      if (active) {
        meshRef1.current.scale.x += delta * 4.5;
        meshRef1.current.scale.y += delta * 4.5;
        meshRef1.current.scale.z += delta * 4.5;
        if (meshRef1.current.scale.x > 8.0) {
          meshRef1.current.scale.set(0.1, 0.1, 0.1);
        }
        const mat = meshRef1.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.6 * (1 - meshRef1.current.scale.x / 8.0));
      } else {
        const mat = meshRef1.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
      }
    }

    if (meshRef2.current) {
      if (active) {
        meshRef2.current.scale.x += delta * 3.2;
        meshRef2.current.scale.y += delta * 3.2;
        meshRef2.current.scale.z += delta * 3.2;
        if (meshRef2.current.scale.x > 7.0) {
          meshRef2.current.scale.set(0.1, 0.1, 0.1);
        }
        const mat = meshRef2.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.45 * (1 - meshRef2.current.scale.x / 7.0));
      } else {
        const mat = meshRef2.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
      }
    }

    if (meshRef3.current) {
      meshRef3.current.rotation.z += delta * 0.4;
      const mat = meshRef3.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.3 + Math.sin(Date.now() * 0.005) * 0.15 : 0.05;
    }
  });

  return (
    <group position={[0, 0, -0.4]}>
      {/* Primary Expanding Wave Shockwave Ring */}
      <mesh ref={meshRef1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.05, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Staggered Wave Ring */}
      <mesh ref={meshRef2} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 1.0, 64]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Static Concentric Grid Disc */}
      <mesh ref={meshRef3} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.85, 96]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
