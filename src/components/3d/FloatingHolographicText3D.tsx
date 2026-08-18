import React, { useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAiAssistantStore } from '../../store/useAiAssistantStore';
import { audioEngine } from '../../services/audioEngine';
import { Sparkles, Terminal, Volume2 } from 'lucide-react';

export const FloatingHolographicText3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const streamingResponse = useAiAssistantStore((state) => state.streamingResponse);
  const streamingTokens = useAiAssistantStore((state) => state.streamingTokens);
  const status = useAiAssistantStore((state) => state.status);
  const isWoken = useAiAssistantStore((state) => state.wakeState.isWoken);
  const lastExecutedCommand = useAiAssistantStore((state) => state.lastExecutedCommand);

  // Clean text from any internal action tags
  const displayTokens = useMemo(() => {
    const clean = streamingResponse.replace(/\[\[ACTION:[^\]]+\]\]/g, '').trim();
    if (!clean) return [];
    return clean.split(/(\s+)/).filter(Boolean);
  }, [streamingResponse]);

  // Dynamic particle swarm that assembles around the holographic text
  const particleCount = 48;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Floating organic bobbing motion
      groupRef.current.position.y = 1.35 + Math.sin(t * 1.5) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.03;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.15;
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      const audio = audioEngine.getAudioLevel();
      mat.size = 0.03 + audio * 0.08;
      mat.opacity = status === 'Speaking' || status === 'Streaming' ? 0.9 : isWoken ? 0.4 : 0.1;
    }
  });

  const isVisible = isWoken || displayTokens.length > 0 || status === 'Thinking' || status === 'Speaking';

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, 1.35, 1.6]}>
      {/* Particle cloud assembling text in 3D space */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.035}
          color="#38bdf8"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating 3D Holographic Text Container */}
      <Html
        transform
        distanceFactor={4.2}
        position={[0, 0, 0]}
        center
        className="pointer-events-none select-none"
      >
        <div className="w-[520px] max-w-[90vw] p-5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-sky-500/40 shadow-[0_0_40px_rgba(56,189,248,0.25)] text-slate-100 font-mono relative overflow-hidden transition-all duration-300">
          {/* Holographic Header Bar */}
          <div className="flex items-center justify-between border-b border-sky-500/30 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    status === 'Speaking'
                      ? 'bg-sky-400'
                      : status === 'Thinking'
                      ? 'bg-cyan-400'
                      : status === 'Interrupted'
                      ? 'bg-rose-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    status === 'Speaking'
                      ? 'bg-sky-500'
                      : status === 'Thinking'
                      ? 'bg-cyan-500'
                      : status === 'Interrupted'
                      ? 'bg-rose-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-[11px] tracking-wider text-sky-300 uppercase font-semibold">
                NEXUS // NEURAL SYNAPSE
              </span>
            </div>

            <div className="flex items-center gap-3">
              {lastExecutedCommand && (
                <span className="text-[9px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 tracking-wider">
                  {lastExecutedCommand}
                </span>
              )}
              <span className="text-[10px] text-slate-400 tracking-wider">
                [{status.toUpperCase()}]
              </span>
            </div>
          </div>

          {/* Holographic Body: Word-by-word streaming particle assembly */}
          <div className="min-h-[60px] max-h-[160px] overflow-y-auto text-sm leading-relaxed text-slate-200 custom-scrollbar relative">
            {status === 'Thinking' && displayTokens.length === 0 ? (
              <div className="flex items-center gap-2 text-sky-400/80 animate-pulse text-xs tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Assembling neural quantum response...</span>
              </div>
            ) : displayTokens.length > 0 ? (
              <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                {displayTokens.map((token, index) => (
                  <span
                    key={index}
                    className="inline-block animate-fade-in transition-all text-slate-100 font-normal hover:text-sky-300"
                    style={{
                      animationDelay: `${Math.min(index * 15, 300)}ms`,
                      textShadow:
                        index >= displayTokens.length - 3
                          ? '0 0 12px rgba(56, 189, 248, 0.9)'
                          : 'none',
                    }}
                  >
                    {token}
                  </span>
                ))}
                {(status === 'Streaming' || status === 'Speaking') && (
                  <span className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-pulse" />
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                Listening for spatial commands... (e.g. &quot;Open Instagram&quot;, &quot;How is Nvidia today?&quot;, &quot;Show Calendar&quot;)
              </div>
            )}
          </div>

          {/* Futuristic Audio Reactivity Footer Bar */}
          <div className="mt-3 pt-2 border-t border-sky-500/20 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3 h-3 text-sky-400" />
              <span className="tracking-widest">SPATIAL 3D AUDIO</span>
            </div>

            {/* Reactive Waveform Equalizer Bars */}
            <div className="flex items-center gap-1">
              {[0.4, 0.8, 0.3, 0.9, 0.5, 0.7, 0.2].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-sky-400 rounded-full transition-all duration-75"
                  style={{
                    height: `${
                      status === 'Speaking' || status === 'Streaming'
                        ? Math.max(3, Math.min(14, height * 14 * (0.5 + Math.random())))
                        : 3
                    }px`,
                    opacity: status === 'Speaking' ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
