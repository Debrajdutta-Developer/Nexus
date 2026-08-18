import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAiAssistantStore } from '../../store/useAiAssistantStore';
import { audioEngine } from '../../services/audioEngine';

export const CentralAIOrc: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const status = useAiAssistantStore((state) => state.status);
  const isWoken = useAiAssistantStore((state) => state.wakeState.isWoken);
  const audioLevel = useAiAssistantStore((state) => state.audioLevel);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const liveAudio = Math.max(audioLevel, audioEngine.getAudioLevel());

    // Scale dynamics based on AI status & speech reactivity
    let targetScale = 0.8;
    let pulseSpeed = 1.0;

    if (status === 'Listening') {
      targetScale = 0.95 + liveAudio * 0.8 + Math.sin(t * 4) * 0.05;
      pulseSpeed = 2.0;
    } else if (status === 'Thinking') {
      targetScale = 0.85 + Math.sin(t * 8) * 0.12;
      pulseSpeed = 4.0;
    } else if (status === 'Speaking' || status === 'Streaming') {
      targetScale = 1.05 + liveAudio * 1.2 + Math.sin(t * 6) * 0.08;
      pulseSpeed = 3.0;
    } else if (status === 'Interrupted') {
      targetScale = 0.7;
    } else if (!isWoken) {
      targetScale = 0.6 + Math.sin(t * 1.2) * 0.03;
    }

    if (coreRef.current) {
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      coreRef.current.rotation.y += delta * 0.6 * pulseSpeed;
      coreRef.current.rotation.x += delta * 0.4 * pulseSpeed;

      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      if (status === 'Thinking') {
        mat.color.set('#06b6d4');
        mat.emissive.set('#0284c7');
      } else if (status === 'Speaking') {
        mat.color.set('#38bdf8');
        mat.emissive.set('#38bdf8');
      } else if (status === 'Interrupted') {
        mat.color.set('#f43f5e');
        mat.emissive.set('#e11d48');
      } else {
        mat.color.set('#38bdf8');
        mat.emissive.set('#0369a1');
      }
    }

    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.8 * pulseSpeed;
      wireRef.current.rotation.z += delta * 0.5 * pulseSpeed;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
      ringRef.current.rotation.y += delta * 0.5;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.2;
    }
  });

  // Particle cloud around AI core
  const particleGeo = React.useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 72;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.3 + Math.random() * 0.4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <group position={[0, 0, -0.6]}>
      {/* Outer Holographic Glow Sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.45, 2]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Outer Wireframe Gyroscope Shell */}
      <mesh ref={wireRef}>
        <octahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rotating Orbital Rings */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.85, 0.008, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.95, 0.006, 16, 64]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Orbiting Quantum Synapse Particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.035}
          color="#7dd3fc"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
