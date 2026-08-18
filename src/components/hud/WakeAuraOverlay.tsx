import React from 'react';
import { useAiAssistantStore } from '../../store/useAiAssistantStore';

export const WakeAuraOverlay: React.FC = () => {
  const isWoken = useAiAssistantStore((state) => state.wakeState.isWoken);
  const auraIntensity = useAiAssistantStore((state) => state.wakeState.auraIntensity);
  const status = useAiAssistantStore((state) => state.status);
  const audioLevel = useAiAssistantStore((state) => state.audioLevel);

  if (!isWoken && auraIntensity <= 0) return null;

  const glowColor =
    status === 'Interrupted'
      ? 'rgba(244, 63, 94, 0.35)'
      : status === 'Thinking'
      ? 'rgba(6, 182, 212, 0.45)'
      : 'rgba(56, 189, 248, 0.45)';

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden transition-opacity duration-500">
      {/* Screen Edge Vignette Aura Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 100px 30px ${glowColor}`,
          opacity: Math.min(1, auraIntensity * (0.6 + audioLevel * 0.8)),
        }}
      />

      {/* Central Radiating Ambient Shockwave Ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/30 transition-all duration-700"
        style={{
          width: '70vw',
          height: '70vw',
          maxWidth: '900px',
          maxHeight: '900px',
          boxShadow: `0 0 80px 20px ${glowColor}`,
          opacity: auraIntensity * 0.4,
          transform: `translate(-50%, -50%) scale(${1 + audioLevel * 0.15})`,
        }}
      />
    </div>
  );
};
