import React from 'react';
import { Hand, Zap, ArrowLeftRight, Maximize2, Lock, Radio } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';

export const GestureConfidenceHUD: React.FC = () => {
  const currentGesture = useNexusStore((state) => state.currentGesture);
  const gestureConfidence = useNexusStore((state) => state.gestureConfidence);
  const handPos = useNexusStore((state) => state.handPosition);
  const rotateCarousel = useNexusStore((state) => state.rotateCarousel);
  const triggerAiPulse = useNexusStore((state) => state.triggerAiPulse);

  return (
    <div className="absolute bottom-6 right-6 pointer-events-auto font-mono z-30 select-none flex flex-col items-end gap-3">
      {/* Interactive Quick Orbit Controls (For Mouse/Touch & Hand Gesture Fallback) */}
      <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 p-2 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(2,6,23,0.9)]">
        <button
          onClick={() => rotateCarousel(Math.PI / 5)}
          className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" /> SWIPE LEFT
        </button>
        <button
          onClick={() => rotateCarousel(-Math.PI / 5)}
          className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1"
        >
          SWIPE RIGHT <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Gesture Status Card */}
      <div className="bg-slate-950/85 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-xl min-w-[240px] shadow-[0_0_25px_rgba(2,6,23,0.9)]">
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 mb-2">
          <div className="flex items-center gap-2">
            <Hand className={`w-4 h-4 ${currentGesture !== 'NONE' ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">GESTURE DETECTED</span>
          </div>
          <span className="text-[10px] text-cyan-400/60 font-bold">
            {Math.round(gestureConfidence * 100)}%
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <span className="text-sm font-black text-cyan-100 tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-400/30">
            {currentGesture}
          </span>
          {handPos.isPinching && (
            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
              PINCH ENGAGED
            </span>
          )}
        </div>

        {/* Gesture Guide Cheat Sheet */}
        <div className="mt-3 pt-2 border-t border-cyan-500/15 text-[10px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>• Pinch & Drag:</span> <span className="text-cyan-300 font-bold">Grab Card</span>
          </div>
          <div className="flex justify-between">
            <span>• Swipe Hand:</span> <span className="text-cyan-300 font-bold">Rotate Orbit Ring</span>
          </div>
          <div className="flex justify-between">
            <span>• Pull / Push:</span> <span className="text-cyan-300 font-bold">Expand / Collapse</span>
          </div>
          <div className="flex justify-between">
            <span>• Circle Motion:</span> <span className="text-cyan-300 font-bold">AI Energy Pulse</span>
          </div>
        </div>
      </div>
    </div>
  );
};
