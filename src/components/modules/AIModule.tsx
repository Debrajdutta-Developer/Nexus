import React from 'react';
import { Cpu, Zap, Activity, Radio, Sparkles } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';

export const AIModule: React.FC = () => {
  const triggerAiPulse = useNexusStore((state) => state.triggerAiPulse);
  const aiPulseActive = useNexusStore((state) => state.aiPulseActive);

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">NEURAL CORE SYNAPSE</h2>
            <p className="text-xs text-cyan-400/60">SPATIAL VECTOR FIELD // LATENT SPACE</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-500/30">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> FP16 ACTIVE
        </div>
      </div>

      {/* Latency / Model Info */}
      <div className="my-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/40 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">LATENT MODEL:</span>
          <span className="font-bold text-cyan-200">NEXUS-OMNI 1.0</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">INFERENCE LATENCY:</span>
          <span className="font-bold text-emerald-400">12ms (320 TOK/S)</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">QUANTIZATION:</span>
          <span className="font-bold text-cyan-200">FP16 / TENSORRT-LLM</span>
        </div>
      </div>

      {/* Action Button: Trigger Spatial AI Energy Pulse */}
      <div className="flex-1 flex flex-col justify-center items-center my-2">
        <button
          onClick={triggerAiPulse}
          disabled={aiPulseActive}
          className={`w-full py-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            aiPulseActive
              ? 'bg-cyan-500/30 border-cyan-300 text-cyan-100 shadow-[0_0_25px_rgba(56,189,248,0.5)]'
              : 'bg-slate-900/60 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-300'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${aiPulseActive ? 'animate-spin' : ''}`} />
          {aiPulseActive ? 'EMITTING SPATIAL PULSE...' : 'TRIGGER SPATIAL AI PULSE'}
        </button>
        <p className="text-[10px] text-cyan-400/50 mt-2 text-center">
          (TIP: You can also trace a circle with your hand to pulse spatial energy)
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400/60 flex justify-between">
        <span>VECTOR NODES: 1,024</span>
        <span>SYNAPSE ENGINE READY</span>
      </div>
    </div>
  );
};
