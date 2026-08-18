import React from 'react';
import { Server, Activity, Cpu, HardDrive, ShieldCheck, Terminal } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';

export const SystemModule: React.FC = () => {
  const fps = useNexusStore((state) => state.fps);

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <Server className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">NEXUS OS KERNEL</h2>
            <p className="text-xs text-cyan-400/60">PROCESS & HARDWARE MONITOR</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> KERNEL OK
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="p-3 rounded-xl border border-cyan-500/15 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>RENDER FRAME RATE</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-200">{fps} FPS</div>
          <div className="text-[10px] text-cyan-400/60 mt-1">TARGET: 60 FPS VSYNC</div>
        </div>

        <div className="p-3 rounded-xl border border-cyan-500/15 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>GPU VRAM</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-200">2.1 GB</div>
          <div className="text-[10px] text-cyan-400/60 mt-1">ALLOCATED / 16.0 GB</div>
        </div>
      </div>

      {/* System Hardware Gauges */}
      <div className="my-2 p-3 rounded-xl border border-cyan-500/15 bg-slate-900/40 space-y-2.5">
        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>CPU THREADS (8 CORES)</span>
            <span>14.2%</span>
          </div>
          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
            <div className="h-full bg-cyan-400 w-[14.2%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>THERMAL PROFILE</span>
            <span>42.0 °C</span>
          </div>
          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
            <div className="h-full bg-emerald-400 w-[35%]" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400/60 flex justify-between">
        <span>OS VERSION: 1.0.0-PROD</span>
        <span>Uptime: 04:12:38</span>
      </div>
    </div>
  );
};
