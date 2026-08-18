import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useNexusStore } from '../../store/useNexusStore';

export const SystemLogHUD: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const logs = useNexusStore((state) => state.logs);

  return (
    <div className="absolute bottom-6 left-6 pointer-events-auto font-mono z-30 select-none max-w-md w-full">
      <div className="bg-slate-950/85 border border-cyan-500/30 rounded-2xl backdrop-blur-xl overflow-hidden shadow-[0_0_25px_rgba(2,6,23,0.9)]">
        {/* Terminal Header */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-cyan-500/20 cursor-pointer hover:bg-slate-900"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-200 tracking-wider">SYSTEM TELEMETRY LOG</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/30">
              {logs.length} EVENTS
            </span>
          </div>

          <button className="text-slate-400 hover:text-cyan-200">
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Terminal Stream */}
        {!collapsed && (
          <div className="p-3 max-h-40 overflow-y-auto space-y-1.5 text-[11px] custom-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 text-[10px] shrink-0 font-bold">{log.timestamp}</span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded font-black shrink-0 ${
                    log.level === 'SYS'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : log.level === 'EXEC'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : log.level === 'WARN'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-slate-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
