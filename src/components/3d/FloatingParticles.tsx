import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 300 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 35;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 35;
      const speed = 0.1 + Math.random() * 0.3;
      const factor = 0.2 + Math.random() * 0.8;
      const scale = 0.03 + Math.random() * 0.06;
      temp.push({ x, y, z, speed, factor, scale, initialY: y });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Floating motion
      const y = p.initialY + Math.sin(t * p.speed + p.factor) * 0.8;
      const x = p.x + Math.cos(t * p.speed * 0.5) * 0.4;
      const z = p.z + Math.sin(t * p.speed * 0.3) * 0.4;

      dummy.position.set(x, y, z);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
};
