import React, { useEffect } from 'react';
import { NexusCanvas } from './components/3d/NexusCanvas';
import { FUIHUD } from './components/hud/FUIHUD';
import { ExpandedModuleModal } from './components/ExpandedModuleModal';
import { useFPS } from './hooks/useFPS';
import { voiceEngine } from './services/voiceEngine';

export default function App() {
  useFPS();

  useEffect(() => {
    // Initialize Voice Engine for Wake phrase & Speech recognition
    voiceEngine.init();
  }, []);

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 relative font-mono select-none">
      {/* 3D WebGL Spatial Scene Canvas */}
      <NexusCanvas />

      {/* Futuristic FUI HUD Overlay */}
      <FUIHUD />

      {/* Focused Expanded Module Modal View */}
      <ExpandedModuleModal />
    </main>
  );
}
