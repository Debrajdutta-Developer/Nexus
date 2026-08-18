import React from 'react';
import { useAiAssistantStore } from '../../store/useAiAssistantStore';
import { Bot, User, Trash2, X, Sparkles, Command } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIConversationHistoryDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const history = useAiAssistantStore((state) => state.history);
  const clearHistory = useAiAssistantStore((state) => state.clearHistory);

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 right-6 z-40 w-96 max-w-[90vw] max-h-[70vh] flex flex-col rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-sky-500/40 shadow-[0_0_50px_rgba(56,189,248,0.2)] text-slate-100 font-mono pointer-events-auto overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sky-500/30 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-sky-300 tracking-wider uppercase">
            NEURAL MEMORY BUFFER
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearHistory}
            title="Clear Memory Buffer"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Memory buffer is empty.</div>
        ) : (
          history.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl border ${
                msg.role === 'user'
                  ? 'bg-sky-950/40 border-sky-500/40 ml-4'
                  : msg.role === 'assistant'
                  ? 'bg-slate-900/80 border-slate-800 mr-2'
                  : 'bg-slate-950/50 border-dashed border-slate-800 text-slate-400 text-[11px]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold">
                  {msg.role === 'user' ? (
                    <>
                      <User className="w-3 h-3 text-sky-400" />
                      <span className="text-sky-300">USER</span>
                    </>
                  ) : msg.role === 'assistant' ? (
                    <>
                      <Bot className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-300">NEXUS AI</span>
                    </>
                  ) : (
                    <>
                      <Command className="w-3 h-3 text-slate-400" />
                      <span>SYSTEM</span>
                    </>
                  )}
                </div>
                <span>{msg.timestamp}</span>
              </div>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
