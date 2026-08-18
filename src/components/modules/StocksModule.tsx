import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';

export const StocksModule: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  const tickers = [
    { symbol: 'NEXUS', name: 'NEXUS OS CORP', price: '$482.10', change: '+4.82%', up: true },
    { symbol: 'AAPL', name: 'APPLE INC', price: '$238.45', change: '+1.20%', up: true },
    { symbol: 'NVDA', name: 'NVIDIA CORP', price: '$134.90', change: '+5.64%', up: true },
    { symbol: 'TSLA', name: 'TESLA INC', price: '$210.30', change: '-2.15%', up: false }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">MARKET MATRIX</h2>
            <p className="text-xs text-cyan-400/60">REAL-TIME VOLUMETRIC TICKER & QUANT</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs rounded border transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stock Chart & Candlestick Visualization */}
      <div className="my-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/30 flex-1 flex flex-col justify-between">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-xs text-slate-400">NEXUS-500 INDEX</span>
            <div className="text-2xl font-bold text-cyan-200 tracking-tight">$5,842.10</div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            <ArrowUpRight className="w-4 h-4" />
            <span>+104.20 (+1.82%)</span>
          </div>
        </div>

        {/* Simulated Candlestick / Volumetric Wave Area */}
        <div className="h-32 my-3 relative flex items-end justify-between gap-1 border-b border-cyan-500/20 pb-2">
          {[40, 55, 48, 62, 70, 65, 80, 75, 90, 88, 95, 110, 105, 125, 120, 140].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
              <div
                style={{ height: `${val}%` }}
                className="w-full bg-gradient-to-t from-cyan-500/10 to-cyan-400/80 rounded-t border-t border-cyan-300 transition-all group-hover:bg-cyan-300 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              />
            </div>
          ))}
        </div>

        {/* Watchlist Tickers */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {tickers.map((t) => (
            <div key={t.symbol} className="p-2.5 rounded-lg border border-cyan-500/15 bg-slate-900/50 flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-cyan-200">{t.symbol}</div>
                <div className="text-[10px] text-slate-400">{t.price}</div>
              </div>
              <div className={`text-xs font-semibold flex items-center gap-0.5 ${t.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {t.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-cyan-500/20 flex justify-between text-[10px] text-cyan-400/60">
        <span>QUANT SIGNAL: BULLISH ACCUMULATION</span>
        <span>NYSE / NASDAQ LIVE FEED</span>
      </div>
    </div>
  );
};
