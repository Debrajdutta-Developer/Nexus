import React from 'react';
import { Calendar as CalendarIcon, Clock, Video, Users, MapPin } from 'lucide-react';

export const CalendarModule: React.FC = () => {
  const events = [
    { time: '14:30 - 15:15', title: 'NEXUS Spatial OS Architecture Review', room: 'HOLOROOM ALPHA', category: 'DEV', active: true },
    { time: '16:00 - 16:45', title: 'Hand Gesture Engine Calibration & Latency', room: 'VISION LAB 4', category: 'AI', active: false },
    { time: '18:00 - 19:00', title: 'Global Spatial Design Sync with TE & Apple', room: 'VIRTUAL NODE', category: 'DESIGN', active: false }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">TEMPORAL GRID</h2>
            <p className="text-xs text-cyan-400/60">AUGUST 10, 2026 // UTC+00:00</p>
          </div>
        </div>
        <div className="text-xs bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-400/30 text-cyan-300">
          3.5 Hrs Focus Left
        </div>
      </div>

      {/* Schedule Items */}
      <div className="my-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {events.map((evt, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border transition-all ${
              evt.active
                ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'bg-slate-900/40 border-cyan-500/15 hover:border-cyan-400/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {evt.time}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-cyan-500/30 text-cyan-400 font-bold">
                {evt.category}
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-100 my-1">{evt.title}</h4>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {evt.room}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3 text-cyan-400" /> 6 Attendees</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400/60 flex justify-between">
        <span>NEXT NOTIFICATION IN 12 MIN</span>
        <span>TEMPORAL SYNC: OK</span>
      </div>
    </div>
  );
};
