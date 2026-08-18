import React from 'react';
import { Newspaper, ExternalLink, Flame, ShieldAlert } from 'lucide-react';

export const NewsModule: React.FC = () => {
  const news = [
    {
      source: 'SPATIAL TIMES',
      title: 'Apple and Teenage Engineering announce open spatial computing protocols for WebGL OS',
      time: '18m ago',
      category: 'TECH'
    },
    {
      source: 'QUANTUM BRIEF',
      title: 'Real-time hand tracking latency reaches sub-5ms with GPU web workers',
      time: '42m ago',
      category: 'AI'
    },
    {
      source: 'FINANCIAL WIRE',
      title: 'Tech indices rally as spatial spatial software demand surges 140%',
      time: '1h ago',
      category: 'MARKETS'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <Newspaper className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">QUANTUM NEWS FEED</h2>
            <p className="text-xs text-cyan-400/60">HOLOGRAPHIC NEWS TICKER</p>
          </div>
        </div>
        <div className="text-xs bg-cyan-500/10 px-2 py-1 rounded border border-cyan-400/30 text-cyan-300">
          128 UNREAD
        </div>
      </div>

      {/* News Stream */}
      <div className="my-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {news.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-cyan-500/20 bg-slate-900/40 hover:bg-slate-900/70 hover:border-cyan-400/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] text-cyan-400/70 mb-1">
              <span className="font-bold text-cyan-300">{item.source}</span>
              <span>{item.time}</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-200 transition-colors leading-snug">
              {item.title}
            </h4>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400/60 flex justify-between">
        <span>SENTIMENT: +0.68 BULLISH</span>
        <span>AGENCY FEED: OK</span>
      </div>
    </div>
  );
};
