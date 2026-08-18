import React from 'react';
import { NexusCard } from '../../types/nexus';
import {
  Instagram,
  TrendingUp,
  Kanban,
  Trophy,
  Calendar,
  CloudRain,
  Cpu,
  Newspaper,
  Disc,
  Server,
  Activity,
  Maximize2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram,
  TrendingUp,
  Kanban,
  Trophy,
  Calendar,
  CloudRain,
  Cpu,
  Newspaper,
  Disc,
  Server
};

interface Card3DContentProps {
  card: NexusCard;
  isHovered: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onExpand: () => void;
}

export const Card3DContent: React.FC<Card3DContentProps> = ({
  card,
  isHovered,
  isSelected,
  onSelect,
  onExpand
}) => {
  const IconComponent = ICON_MAP[card.iconName] || Activity;

  return (
    <div
      onClick={onSelect}
      className={`w-[320px] h-[400px] p-5 rounded-2xl flex flex-col justify-between font-mono select-none backdrop-blur-2xl transition-all duration-300 border cursor-pointer ${
        isSelected
          ? 'bg-slate-950/85 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.4)] text-cyan-100'
          : isHovered
          ? 'bg-slate-950/75 border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.2)] text-slate-100'
          : 'bg-slate-950/60 border-cyan-500/20 text-slate-300'
      }`}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400/70 block uppercase tracking-wider">{card.category}</span>
              <h3 className="text-sm font-extrabold text-cyan-100 tracking-wide uppercase">{card.title}</h3>
            </div>
          </div>
          <div className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 font-bold">
            {card.status}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2">{card.subtitle}</p>
      </div>

      {/* Metrics Center Box */}
      <div className="my-3 space-y-2">
        {card.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/15 flex items-center justify-between text-xs"
          >
            <span className="text-slate-400 text-[10px]">{m.label}</span>
            <div className="flex items-center gap-1.5 font-bold text-cyan-200">
              <span>{m.value}</span>
              {m.change && <span className="text-[10px] text-emerald-400">({m.change})</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
        <span className="text-[10px] text-cyan-400/50">{card.version}</span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-400/40 hover:bg-cyan-500/40 transition-all cursor-pointer"
        >
          <Maximize2 className="w-3 h-3" /> EXPAND
        </button>
      </div>
    </div>
  );
};
