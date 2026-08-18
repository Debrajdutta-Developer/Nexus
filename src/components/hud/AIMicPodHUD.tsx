import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Send,
  Square,
  Volume2,
  Cpu,
  CornerDownLeft,
  X,
  History,
  Zap
} from 'lucide-react';
import { useAiAssistantStore } from '../../store/useAiAssistantStore';
import { voiceEngine } from '../../services/voiceEngine';

const QUICK_COMMANDS = [
  'Open Instagram',
  'Show Projects',
  'Rotate Left',
  'Show Calendar',
  'Latest AI News',
  'How is Nvidia today?',
  'Open Stocks',
  "What's my schedule?",
  'Explain MCP',
  'Explain this',
];

interface Props {
  onToggleHistory: () => void;
  showHistory: boolean;
}

export const AIMicPodHUD: React.FC<Props> = ({ onToggleHistory, showHistory }) => {
  const [inputText, setInputText] = useState('');
  const status = useAiAssistantStore((state) => state.status);
  const wakeState = useAiAssistantStore((state) => state.wakeState);
  const currentTranscript = useAiAssistantStore((state) => state.currentTranscript);
  const audioLevel = useAiAssistantStore((state) => state.audioLevel);
  const wakeAssistant = useAiAssistantStore((state) => state.wakeAssistant);
  const sleepAssistant = useAiAssistantStore((state) => state.sleepAssistant);
  const interrupt = useAiAssistantStore((state) => state.interrupt);
  const sendUserPrompt = useAiAssistantStore((state) => state.sendUserPrompt);

  const handleMicToggle = () => {
    if (wakeState.isWoken) {
      sleepAssistant();
      voiceEngine.stopMicrophone();
    } else {
      wakeAssistant('MANUAL');
      voiceEngine.startMicrophone();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      if (!wakeState.isWoken) {
        wakeAssistant('MANUAL');
      }
      sendUserPrompt(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickCommand = (cmd: string) => {
    if (!wakeState.isWoken) {
      wakeAssistant('MANUAL');
    }
    sendUserPrompt(cmd);
  };

  const statusColorMap = {
    Listening: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400',
    Thinking: 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300 animate-pulse',
    Speaking: 'border-sky-500/60 bg-sky-500/10 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]',
    Streaming: 'border-sky-500/60 bg-sky-500/10 text-sky-300',
    Interrupted: 'border-rose-500/60 bg-rose-500/10 text-rose-400',
    Offline: 'border-slate-700 bg-slate-900/60 text-slate-400',
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-3 max-w-[95vw] w-[640px]">
      {/* Quick Prompt Command Chips Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full px-2 py-1 custom-scrollbar no-scrollbar text-[11px] select-none">
        <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/60 shrink-0">
          <Zap className="w-3 h-3 text-sky-400" /> WAKE: &quot;NEXUS&quot; / CIRCLE
        </span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-sky-950/90 text-slate-300 hover:text-sky-200 border border-slate-800 hover:border-sky-500/50 text-[11px] whitespace-nowrap transition-all duration-150 backdrop-blur-md cursor-pointer shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Main Holographic Mic Pod Control Bar */}
      <div
        className={`w-full p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border transition-all duration-300 shadow-2xl flex flex-col gap-2.5 ${
          wakeState.isWoken
            ? 'border-sky-500/60 shadow-[0_0_35px_rgba(56,189,248,0.25)]'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Futuristic Concentric Reactive Mic Button */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Outer expanding audio wave ring */}
            {wakeState.isWoken && (
              <span
                className="absolute inset-0 rounded-full bg-sky-400/20 animate-ping"
                style={{ animationDuration: '2s' }}
              />
            )}

            <button
              onClick={handleMicToggle}
              title={wakeState.isWoken ? 'Deactivate NEXUS Voice' : 'Activate NEXUS Voice (or say "Nexus")'}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                wakeState.isWoken
                  ? 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.7)]'
                  : 'bg-slate-900 text-slate-400 hover:text-sky-300 border-slate-700 hover:border-sky-500/40'
              }`}
            >
              {wakeState.isWoken ? (
                <Mic className="w-5 h-5 animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Live Transcript / Prompt Input Bar */}
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 relative">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  currentTranscript
                    ? `Heard: "${currentTranscript}"...`
                    : wakeState.isWoken
                    ? 'Listening... Speak or enter command...'
                    : 'Wake NEXUS (say "Nexus", draw Circle, or type command)...'
                }
                className="w-full h-10 px-3.5 pr-10 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-sky-500/70 focus:bg-slate-900 text-slate-100 placeholder-slate-400 text-xs tracking-wide focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interruption Button (Active when AI is speaking or thinking) */}
            {(status === 'Speaking' || status === 'Streaming' || status === 'Thinking') && (
              <button
                type="button"
                onClick={interrupt}
                title="Interrupt Speech"
                className="h-10 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/50 flex items-center gap-1.5 text-xs font-semibold tracking-wider transition-all animate-pulse cursor-pointer shrink-0"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>STOP</span>
              </button>
            )}

            {/* History Toggle Button */}
            <button
              type="button"
              onClick={onToggleHistory}
              title="Toggle Conversation Memory Drawer"
              className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 text-xs transition-colors cursor-pointer shrink-0 ${
                showHistory
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MEMORY</span>
            </button>
          </form>
        </div>

        {/* Bottom Telemetry & Status Bar */}
        <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wider uppercase ${
                statusColorMap[status] || statusColorMap.Offline
              }`}
            >
              ● {status}
            </span>

            {currentTranscript && (
              <span className="text-slate-300 italic truncate max-w-[240px]">
                &quot;{currentTranscript}&quot;
              </span>
            )}
          </div>

          {/* Audio Waveform Meter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-400 tracking-wider">MIC LEVEL</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
                const isActive = audioLevel * 8 >= bar;
                return (
                  <div
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isActive ? 'bg-sky-400 h-3' : 'bg-slate-800 h-1.5'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
