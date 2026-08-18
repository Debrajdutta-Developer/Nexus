import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Clock, Camera, Volume2, VolumeX, Sparkles, Lock, Unlock } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';
import { audioEngine } from '../../services/audioEngine';

export const HeaderHUD: React.FC = () => {
  const fps = useNexusStore((state) => state.fps);
  const isHandTrackingActive = useNexusStore((state) => state.isHandTrackingActive);
  const toggleHandTracking = useNexusStore((state) => state.toggleHandTracking);
  const handPos = useNexusStore((state) => state.handPosition);
  const spatialLock = useNexusStore((state) => state.spatialLock);
  const toggleSpatialLock = useNexusStore((state) => state.toggleSpatialLock);
  const triggerAiPulse = useNexusStore((state) => state.triggerAiPulse);
  
  const audio = useNexusStore((state) => state.audio);
  const setAudioSettings = useNexusStore((state) => state.setAudioSettings);

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().substring(0, 8) + '.' + String(now.getMilliseconds()).padStart(3, '0').substring(0, 2));
      setDateStr(now.toISOString().substring(0, 10));
    };
    const interval = setInterval(updateTime, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const newMute = !audio.ambientEnabled;
    setAudioSettings({ ambientEnabled: newMute, sfxEnabled: newMute });
    if (newMute) {
      audioEngine.startAmbient();
    } else {
      audioEngine.stopAmbient();
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start font-mono z-30 select-none">
      {/* Top Left: System Status, FPS, Tracking, GPU */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-slate-950/80 border border-cyan-500/30 px-3.5 py-2 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(2,6,23,0.8)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-black tracking-widest text-cyan-200">NEXUS OS // KERNEL</span>
          <span className="text-[10px] text-cyan-400/60 border-l border-cyan-500/30 pl-3">v1.0.0</span>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 border border-cyan-500/20 px-3 py-1.5 rounded-lg text-xs text-slate-300 backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <strong className="text-cyan-200">{fps} FPS</strong>
          </span>
          <span className="text-cyan-500/40">•</span>
          <span className="text-[11px] text-slate-400">
            TRACKING: <strong className={isHandTrackingActive ? 'text-emerald-400' : 'text-slate-400'}>{isHandTrackingActive ? 'HAND_CAM' : 'POINTER'}</strong>
          </span>
          <span className="text-cyan-500/40">•</span>
          <span className="text-[11px] text-slate-400">GPU: WEBGL2</span>
        </div>
      </div>

      {/* Center Controls */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 p-1.5 rounded-2xl backdrop-blur-xl">
        <button
          onClick={toggleHandTracking}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isHandTrackingActive
              ? 'bg-cyan-500/30 border-cyan-300 text-cyan-100 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'bg-slate-900/60 border-cyan-500/20 text-slate-400 hover:text-cyan-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{isHandTrackingActive ? 'CAMERA ON' : 'CAMERA INPUT'}</span>
        </button>

        <button
          onClick={toggleSpatialLock}
          className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
            spatialLock
              ? 'bg-amber-500/30 border-amber-400 text-amber-200'
              : 'bg-slate-900/60 border-cyan-500/20 text-slate-400 hover:text-cyan-200'
          }`}
          title="Toggle Spatial Orbit Freeze"
        >
          {spatialLock ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>

        <button
          onClick={triggerAiPulse}
          className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-slate-400 hover:text-cyan-200 hover:border-cyan-400 transition-all cursor-pointer"
          title="Trigger Spatial AI Pulse"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-slate-400 hover:text-cyan-200 hover:border-cyan-400 transition-all cursor-pointer"
          title="Toggle Ambient Synthesizer"
        >
          {audio.ambientEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Top Right: Clock, Date, Coordinates */}
      <div className="pointer-events-auto flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl backdrop-blur-xl">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-sm font-black text-cyan-100 tracking-wider">{timeStr}</span>
          <span className="text-[10px] text-cyan-400/60 font-semibold">{dateStr}</span>
        </div>

        <div className="bg-slate-950/60 border border-cyan-500/20 px-3 py-1 rounded-lg text-[10px] text-cyan-400/70 backdrop-blur-md">
          X: {handPos.x > 0 ? `+${handPos.x.toFixed(2)}` : handPos.x.toFixed(2)} Y: {handPos.y > 0 ? `+${handPos.y.toFixed(2)}` : handPos.y.toFixed(2)} Z: {handPos.z.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
