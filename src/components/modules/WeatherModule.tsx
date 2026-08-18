import React from 'react';
import { CloudRain, Wind, Droplets, Sun, Compass } from 'lucide-react';

export const WeatherModule: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <CloudRain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">ATMOSPHERE RADAR</h2>
            <p className="text-xs text-cyan-400/60">TOKYO // METROPOLIS RADAR</p>
          </div>
        </div>
        <div className="text-xs bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-400/30 text-cyan-300">
          PARTLY CLOUDY
        </div>
      </div>

      {/* Main Temperature Hero */}
      <div className="my-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/40 flex items-center justify-between">
        <div>
          <div className="text-4xl font-extrabold text-cyan-100 tracking-tight">22°C</div>
          <div className="text-xs text-cyan-400/70 mt-1">FEELS LIKE 23.5°C // HUMIDITY 48%</div>
        </div>
        <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Sun className="w-8 h-8 text-cyan-300 animate-pulse" />
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <div className="p-2.5 rounded-lg border border-cyan-500/15 bg-slate-900/50 flex flex-col items-center">
          <Wind className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-[10px] text-slate-400">WIND</span>
          <span className="text-xs font-bold text-cyan-200">14.2 km/h</span>
        </div>
        <div className="p-2.5 rounded-lg border border-cyan-500/15 bg-slate-900/50 flex flex-col items-center">
          <Droplets className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-[10px] text-slate-400">PRECIP</span>
          <span className="text-xs font-bold text-cyan-200">0.0 mm</span>
        </div>
        <div className="p-2.5 rounded-lg border border-cyan-500/15 bg-slate-900/50 flex flex-col items-center">
          <Compass className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-[10px] text-slate-400">BARO</span>
          <span className="text-xs font-bold text-cyan-200">1013 hPa</span>
        </div>
      </div>

      {/* 5-Day Forecast Strip */}
      <div className="mt-2 pt-3 border-t border-cyan-500/20 flex justify-between text-center">
        {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, i) => (
          <div key={day} className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400">{day}</span>
            <span className="text-xs font-bold text-cyan-200 my-1">{21 + i}°</span>
            <span className="text-[9px] text-cyan-400/60">SUN</span>
          </div>
        ))}
      </div>
    </div>
  );
};
