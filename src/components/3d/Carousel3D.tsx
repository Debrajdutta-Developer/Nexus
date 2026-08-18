import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '../../store/useNexusStore';
import { HolographicCard3D } from './HolographicCard3D';

export const Carousel3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const cards = useNexusStore((state) => state.cards);
  const activeCardId = useNexusStore((state) => state.activeCardId);
  const hoveredCardId = useNexusStore((state) => state.hoveredCardId);
  const carouselRotation = useNexusStore((state) => state.carouselRotation);
  
  const setActiveCard = useNexusStore((state) => state.setActiveCard);
  const setHoveredCard = useNexusStore((state) => state.setHoveredCard);
  const setExpandedCard = useNexusStore((state) => state.setExpandedCard);
  const updateCarouselPhysics = useNexusStore((state) => state.updateCarouselPhysics);

  const radius = 5.6; // Circular orbit radius
  const cardCount = cards.length;
  const stepAngle = (2 * Math.PI) / cardCount;

  useFrame(() => {
    // Continuous spring physics update
    updateCarouselPhysics();

    if (groupRef.current) {
      groupRef.current.rotation.y = carouselRotation;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {cards.map((card, idx) => {
        const baseAngle = idx * stepAngle;
        const x = Math.sin(baseAngle) * radius;
        const z = Math.cos(baseAngle) * radius;
        
        // Facing outward / inward
        const cardRotationY = baseAngle;

        const isSelected = activeCardId === card.id;
        const isHovered = hoveredCardId === card.id;

        return (
          <HolographicCard3D
            key={card.id}
            card={card}
            position={[x, 0, z]}
            rotation={[0, cardRotationY, 0]}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() => setActiveCard(card.id)}
            onHover={(hovered) => setHoveredCard(hovered ? card.id : null)}
            onExpand={() => setExpandedCard(card.id)}
          />
        );
      })}
    </group>
  );
};
