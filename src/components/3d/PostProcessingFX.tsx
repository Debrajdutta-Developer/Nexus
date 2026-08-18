import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export const PostProcessingFX: React.FC = () => {
  return (
    <EffectComposer enableNormalPass={false}>
      {/* Soft Holographic Glow Bloom */}
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        height={300}
      />
      {/* Subtle Cinematic Spatial Vignette */}
      <Vignette eskil={false} offset={0.1} darkness={0.7} />
    </EffectComposer>
  );
};
