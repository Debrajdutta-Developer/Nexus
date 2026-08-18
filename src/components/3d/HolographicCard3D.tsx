import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NexusCard } from '../../types/nexus';
import { Card3DContent } from './Card3DContent';
import { useNexusStore } from '../../store/useNexusStore';
import { audioEngine } from '../../services/audioEngine';

interface HolographicCard3DProps {
  card: NexusCard;
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onExpand: () => void;
}

export const HolographicCard3D: React.FC<HolographicCard3DProps> = ({
  card,
  position,
  rotation,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onExpand
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const aiPulseActive = useNexusStore((state) => state.aiPulseActive);
  const handPos = useNexusStore((state) => state.handPosition);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle floating spring offset
    const floatY = Math.sin(t * 1.5 + position[0]) * 0.08;
    const floatX = Math.cos(t * 1.2 + position[2]) * 0.04;

    // Subtle tilt toward pointer or hand position
    let tiltX = 0;
    let tiltY = 0;

    if (isHovered || isSelected) {
      tiltX = handPos.y * 0.2;
      tiltY = handPos.x * 0.2;
    }

    // Spring Lerp Position
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      position[0] + floatX,
      0.1
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      position[1] + floatY + (isSelected ? 0.3 : 0),
      0.1
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      position[2] + (isSelected ? 0.5 : 0),
      0.1
    );

    // Spring Lerp Rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      rotation[0] + tiltX,
      0.1
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotation[1] + tiltY,
      0.1
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      rotation[2],
      0.1
    );
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* 3D Glass Card Backing Mesh */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          audioEngine.playHover();
        }}
        onPointerOut={() => onHover(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
          audioEngine.playPinch();
        }}
      >
        <boxGeometry args={[2.2, 2.8, 0.06]} />
        <meshPhysicalMaterial
          color={isSelected ? '#38bdf8' : '#0f172a'}
          roughness={0.15}
          metalness={0.1}
          transmission={0.8}
          thickness={0.5}
          transparent
          opacity={0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Holographic Glowing Border Wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.22, 2.82, 0.07)]} />
        <lineBasicMaterial
          color={aiPulseActive ? '#38bdf8' : isSelected ? '#38bdf8' : isHovered ? '#60a5fa' : '#1e293b'}
          linewidth={isSelected ? 3 : 1}
        />
      </lineSegments>

      {/* HTML Content Overlay */}
      <Html
        transform
        distanceFactor={2.4}
        position={[0, 0, 0.04]}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <Card3DContent
          card={card}
          isHovered={isHovered}
          isSelected={isSelected}
          onSelect={() => {
            onSelect();
            audioEngine.playPinch();
          }}
          onExpand={() => {
            onExpand();
            audioEngine.playExpand();
          }}
        />
      </Html>
    </group>
  );
};
