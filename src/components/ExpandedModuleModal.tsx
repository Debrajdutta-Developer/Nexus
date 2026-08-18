import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { X, Minimize2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

// Import 10 module components
import { InstagramModule } from './modules/InstagramModule';
import { StocksModule } from './modules/StocksModule';
import { ProjectsModule } from './modules/ProjectsModule';
import { SportsModule } from './modules/SportsModule';
import { CalendarModule } from './modules/CalendarModule';
import { WeatherModule } from './modules/WeatherModule';
import { AIModule } from './modules/AIModule';
import { NewsModule } from './modules/NewsModule';
import { MusicModule } from './modules/MusicModule';
import { SystemModule } from './modules/SystemModule';

const MODULE_MAP: Record<string, React.FC> = {
  instagram: InstagramModule,
  stocks: StocksModule,
  projects: ProjectsModule,
  sports: SportsModule,
  calendar: CalendarModule,
  weather: WeatherModule,
  ai: AIModule,
  news: NewsModule,
  music: MusicModule,
  system: SystemModule
};

export const ExpandedModuleModal: React.FC = () => {
  const expandedCardId = useNexusStore((state) => state.expandedCardId);
  const setExpandedCard = useNexusStore((state) => state.setExpandedCard);

  if (!expandedCardId) return null;

  const ActiveComponent = MODULE_MAP[expandedCardId] || SystemModule;

  const handleClose = () => {
    setExpandedCard(null);
    audioEngine.playRelease();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/80 backdrop-blur-2xl animate-fade-in font-mono">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl border border-cyan-400/40 bg-slate-950/90 shadow-[0_0_60px_rgba(56,189,248,0.3)] overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-cyan-500/30 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-200 tracking-wider">
              NEXUS SPATIAL MODULE // [{expandedCardId.toUpperCase()}]
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1 text-xs"
          >
            <Minimize2 className="w-4 h-4" /> COLLAPSE
          </button>
        </div>

        {/* Active Module View */}
        <div className="flex-1 p-6 overflow-hidden">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};
