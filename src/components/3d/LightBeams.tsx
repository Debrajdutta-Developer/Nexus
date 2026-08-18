import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const LightBeams: React.FC = () => {
  const beamGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (beamGroupRef.current) {
      beamGroupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  return (
    <group ref={beamGroupRef}>
      {/* Light Shaft 1 */}
      <mesh position={[-8, 4, -12]} rotation={[0.4, 0.2, -0.3]}>
        <cylinderGeometry args={[0.2, 3.5, 24, 16, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Light Shaft 2 */}
      <mesh position={[8, 3, -10]} rotation={[-0.3, -0.4, 0.2]}>
        <cylinderGeometry args={[0.2, 4.0, 24, 16, 1, true]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
