import React, { useState } from 'react';
import { Disc, Play, Pause, SkipForward, Volume2, Sliders, Music as MusicIcon } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

export const MusicModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(124);
  const [volume, setVolume] = useState(80);

  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.stopAmbient();
      setIsPlaying(false);
    } else {
      audioEngine.startAmbient();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <Disc className={`w-5 h-5 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">TE-SYNTH 808</h2>
            <p className="text-xs text-cyan-400/60">INDUSTRIAL SYNTH & WAVE ENGINE</p>
          </div>
        </div>
        <div className="text-xs font-bold bg-cyan-500/20 px-2.5 py-1 rounded border border-cyan-400/30 text-cyan-200">
          {bpm} BPM
        </div>
      </div>

      {/* Simulated Frequency Visualizer Bars */}
      <div className="my-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/40">
        <div className="text-xs font-bold text-cyan-300 mb-2 flex justify-between">
          <span>AMB_DRONE_01.SYNTH</span>
          <span className="text-[10px] text-slate-400">3D BINAURAL</span>
        </div>

        {/* Visualizer bars */}
        <div className="h-16 flex items-end justify-between gap-1 border-b border-cyan-500/20 pb-1">
          {[30, 60, 45, 80, 95, 70, 85, 40, 65, 90, 100, 75, 50, 85, 60, 35].map((h, i) => (
            <div
              key={i}
              style={{ height: isPlaying ? `${Math.min(100, h * (0.8 + Math.random() * 0.4))}%` : '15%' }}
              className="flex-1 bg-gradient-to-t from-cyan-500/30 to-cyan-300 rounded-t transition-all duration-150"
            />
          ))}
        </div>
      </div>

      {/* TE Style Industrial Knobs & Switches */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl border border-cyan-500/15 bg-slate-900/50 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 mb-1">TEMPO (BPM)</span>
          <div className="flex items-center justify-between">
            <button onClick={() => setBpm(b => Math.max(60, b - 2))} className="px-2 py-0.5 rounded bg-slate-950 border border-cyan-500/30 text-xs font-bold text-cyan-300">-</button>
            <span className="text-sm font-bold text-cyan-200">{bpm}</span>
            <button onClick={() => setBpm(b => Math.min(200, b + 2))} className="px-2 py-0.5 rounded bg-slate-950 border border-cyan-500/30 text-xs font-bold text-cyan-300">+</button>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-cyan-500/15 bg-slate-900/50 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 mb-1">MASTER GAIN</span>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolume(val);
                audioEngine.setMasterVolume(val / 100);
              }}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Main Playback Control */}
      <div className="flex gap-2">
        <button
          onClick={togglePlay}
          className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            isPlaying
              ? 'bg-cyan-500/30 border-cyan-300 text-cyan-100 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
              : 'bg-slate-900/60 border-cyan-400/30 text-cyan-200 hover:bg-cyan-500/20'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'PAUSE SYNTH DRONE' : 'PLAY AMBIENT SYNTH'}
        </button>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400/60 flex justify-between">
        <span>TE-DESIGN SYSTEM 01</span>
        <span>SAMPLE RATE: 48.0 kHz</span>
      </div>
    </div>
  );
};
