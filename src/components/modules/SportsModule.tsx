import React from 'react';
import { Trophy, Shield, Activity, Zap } from 'lucide-react';

export const SportsModule: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">SPATIAL ARENA 3D</h2>
            <p className="text-xs text-cyan-400/60">CHAMPIONS LEAGUE // FINAL 87'</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded border border-red-500/40 animate-pulse">
          <Activity className="w-3.5 h-3.5" /> LIVE TELEMETRY
        </div>
      </div>

      {/* Match Score Display */}
      <div className="my-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/40 text-center">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center font-bold text-sm text-blue-200">FCB</div>
            <span className="text-xs mt-1 text-slate-300 font-bold">BARCELONA</span>
          </div>

          <div className="text-3xl font-extrabold text-cyan-200 tracking-wider">
            3 <span className="text-cyan-500/50">:</span> 1
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center font-bold text-sm text-purple-200">RMA</div>
            <span className="text-xs mt-1 text-slate-300 font-bold">REAL MADRID</span>
          </div>
        </div>
      </div>

      {/* Simulated 3D Pitch Blueprint */}
      <div className="flex-1 rounded-xl border border-cyan-500/30 bg-slate-900/60 relative overflow-hidden p-3 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

        {/* Pitch Field Markings */}
        <div className="relative z-10 border border-cyan-500/40 rounded h-full flex flex-col justify-between p-2">
          <div className="flex justify-between text-[10px] text-cyan-400/70">
            <span>POSSESSION: 64%</span>
            <span>EXPECTED GOALS (xG): 2.84</span>
          </div>

          <div className="flex justify-center my-2">
            <div className="w-16 h-16 rounded-full border border-cyan-400/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-cyan-300">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan-400" /> SHOTS: 18 (11 ON TARGET)</span>
            <span>PASS ACCURACY: 91%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400/60 flex justify-between">
        <span>3D HOLOGRAPHIC STADIUM SYNC</span>
        <span>CAM 4 // ULTRA MOTION</span>
      </div>
    </div>
  );
};
