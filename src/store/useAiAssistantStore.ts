import { create } from 'zustand';
import { AiStatus, ChatMessage, WakeState, ModuleId } from '../types/nexus';
import { useNexusStore } from './useNexusStore';
import { audioEngine } from '../services/audioEngine';

interface AiAssistantState {
  status: AiStatus;
  wakeState: WakeState;
  currentTranscript: string;
  streamingResponse: string;
  streamingTokens: string[];
  currentActionExecuting: string | null;
  history: ChatMessage[];
  isMicEnabled: boolean;
  abortController: AbortController | null;
  audioLevel: number;
  lastExecutedCommand: string | null;

  // Actions
  setStatus: (status: AiStatus) => void;
  setAudioLevel: (level: number) => void;
  setCurrentTranscript: (transcript: string) => void;
  wakeAssistant: (trigger?: 'VOICE' | 'GESTURE' | 'MANUAL') => void;
  sleepAssistant: () => void;
  interrupt: () => void;
  clearHistory: () => void;
  sendUserPrompt: (prompt: string) => Promise<void>;
  executeActionTag: (actionJsonStr: string) => void;
  speakSentence: (sentence: string) => Promise<void>;
}

// Module map matching natural queries to ModuleId
const MODULE_NAME_MAP: Record<string, ModuleId> = {
  instagram: 'instagram',
  insta: 'instagram',
  feed: 'instagram',
  reels: 'instagram',
  stocks: 'stocks',
  market: 'stocks',
  nvidia: 'stocks',
  nvda: 'stocks',
  finance: 'stocks',
  projects: 'projects',
  linear: 'projects',
  tasks: 'projects',
  sprint: 'projects',
  sports: 'sports',
  arena: 'sports',
  match: 'sports',
  football: 'sports',
  calendar: 'calendar',
  schedule: 'calendar',
  agenda: 'calendar',
  temporal: 'calendar',
  weather: 'weather',
  atmosphere: 'weather',
  climate: 'weather',
  radar: 'weather',
  ai: 'ai',
  neural: 'ai',
  synapse: 'ai',
  news: 'news',
  quantum: 'news',
  headlines: 'news',
  music: 'music',
  synth: 'music',
  audio: 'music',
  system: 'system',
  core: 'system',
  os: 'system',
};

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  status: 'Offline',
  wakeState: {
    isWoken: false,
    wakeTrigger: 'NONE',
    auraIntensity: 0,
    waveProgress: 0,
    micVisible: false,
  },
  currentTranscript: '',
  streamingResponse: '',
  streamingTokens: [],
  currentActionExecuting: null,
  history: [
    {
      id: 'init-1',
      role: 'system',
      text: 'NEXUS Spatial AI Neural Subsystem initialized. Say "Nexus" or perform Circle gesture to activate.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  isMicEnabled: false,
  abortController: null,
  audioLevel: 0,
  lastExecutedCommand: null,

  setStatus: (status) => set({ status }),

  setAudioLevel: (audioLevel) => set({ audioLevel }),

  setCurrentTranscript: (currentTranscript) => set({ currentTranscript }),

  wakeAssistant: (trigger = 'MANUAL') => {
    audioEngine.initContext();
    audioEngine.playWakeSound();

    useNexusStore.getState().addLog('SYS', `NEXUS AI activated via [${trigger}]`);

    set({
      wakeState: {
        isWoken: true,
        wakeTrigger: trigger,
        auraIntensity: 1.0,
        waveProgress: 0,
        micVisible: true,
      },
      status: 'Listening',
      isMicEnabled: true,
      currentTranscript: '',
    });

    // Wave spread animation loop
    let progress = 0;
    const waveInterval = setInterval(() => {
      progress += 0.08;
      if (progress >= 1.2) {
        clearInterval(waveInterval);
        set((state) => ({
          wakeState: { ...state.wakeState, waveProgress: 1.0, auraIntensity: 0.7 },
        }));
      } else {
        set((state) => ({
          wakeState: { ...state.wakeState, waveProgress: progress },
        }));
      }
    }, 30);
  },

  sleepAssistant: () => {
    get().interrupt();
    set({
      wakeState: {
        isWoken: false,
        wakeTrigger: 'NONE',
        auraIntensity: 0,
        waveProgress: 0,
        micVisible: false,
      },
      status: 'Offline',
      isMicEnabled: false,
      currentTranscript: '',
    });
    useNexusStore.getState().addLog('SYS', 'NEXUS AI entered Standby');
  },

  interrupt: () => {
    const { status, abortController } = get();
    if (status === 'Speaking' || status === 'Streaming' || status === 'Thinking') {
      if (abortController) {
        abortController.abort();
      }
      audioEngine.stopSpeech();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      audioEngine.playInterruptedSound();
      useNexusStore.getState().addLog('WARN', 'AI Speech Interrupted by user input');

      set({
        status: 'Interrupted',
        abortController: null,
      });

      setTimeout(() => {
        if (get().wakeState.isWoken) {
          set({ status: 'Listening' });
        }
      }, 500);
    }
  },

  clearHistory: () => {
    set({
      history: [],
      streamingResponse: '',
      streamingTokens: [],
    });
  },

  executeActionTag: (actionJsonStr: string) => {
    try {
      const action = JSON.parse(actionJsonStr);
      const nexus = useNexusStore.getState();
      const target = action.target ? String(action.target).toLowerCase() : '';

      switch (action.type) {
        case 'OPEN_MODULE': {
          const matchedModule = MODULE_NAME_MAP[target] || (target as ModuleId);
          if (matchedModule) {
            nexus.setActiveCard(matchedModule);
            audioEngine.playCommandSuccess();
            set({ lastExecutedCommand: `FOCUSED: [${matchedModule.toUpperCase()}]` });
          }
          break;
        }
        case 'EXPAND_MODULE': {
          const matchedModule = MODULE_NAME_MAP[target] || (target as ModuleId);
          if (matchedModule) {
            nexus.setActiveCard(matchedModule);
            nexus.setExpandedCard(matchedModule);
            audioEngine.playExpand();
            set({ lastExecutedCommand: `EXPANDED: [${matchedModule.toUpperCase()}]` });
          }
          break;
        }
        case 'CLOSE_EXPANDED': {
          nexus.setExpandedCard(null);
          audioEngine.playRelease();
          set({ lastExecutedCommand: 'CLOSED MODAL VIEW' });
          break;
        }
        case 'ROTATE': {
          if (action.direction === 'left') {
            nexus.rotateCarousel(Math.PI / 5);
            audioEngine.playSwipe();
            set({ lastExecutedCommand: 'ROTATED CAROUSEL LEFT' });
          } else if (action.direction === 'right') {
            nexus.rotateCarousel(-Math.PI / 5);
            audioEngine.playSwipe();
            set({ lastExecutedCommand: 'ROTATED CAROUSEL RIGHT' });
          }
          break;
        }
        case 'PULSE': {
          nexus.triggerAiPulse();
          audioEngine.playAiPulse();
          set({ lastExecutedCommand: 'AI ENERGY PULSE TRIGGERED' });
          break;
        }
        case 'SEARCH': {
          useNexusStore.getState().addLog('INFO', `Search Query: "${action.query}"`);
          set({ lastExecutedCommand: `SEARCH: ${action.query}` });
          break;
        }
        case 'MUSIC_CONTROL': {
          if (action.command === 'play') {
            audioEngine.startAmbient();
            set({ lastExecutedCommand: 'SYNTH AUDIO PLAYING' });
          }
          break;
        }
      }
    } catch (e) {
      console.warn('Action Tag Parse Failed:', actionJsonStr, e);
    }
  },

  speakSentence: async (sentence: string) => {
    const cleanSentence = sentence.replace(/\[\[ACTION:[^\]]+\]\]/g, '').trim();
    if (!cleanSentence) return;

    // Try server-side Gemini TTS first
    try {
      const ttsRes = await fetch('/api/nexus/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanSentence, voice: 'Zephyr' }),
      });

      if (ttsRes.ok) {
        const data = await ttsRes.json();
        if (data.audio) {
          await audioEngine.playBase64AudioChunk(data.audio, data.sampleRate || 24000);
          return;
        }
      }
    } catch (e) {
      console.warn('Server TTS unavailable, falling back to Web Speech API:', e);
    }

    // Fallback: Web Speech API SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanSentence);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
        ) || voices.find((v) => v.lang.startsWith('en'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        window.speechSynthesis.speak(utterance);
      } catch {
        // Ignore speech error
      }
    }
  },

  sendUserPrompt: async (prompt: string) => {
    if (!prompt.trim()) return;

    // Direct client quick actions for fast spatial responsiveness
    const lower = prompt.toLowerCase().trim();
    const nexus = useNexusStore.getState();

    if (lower.includes('rotate left')) {
      nexus.rotateCarousel(Math.PI / 5);
      audioEngine.playSwipe();
    } else if (lower.includes('rotate right')) {
      nexus.rotateCarousel(-Math.PI / 5);
      audioEngine.playSwipe();
    }

    const prevAbort = get().abortController;
    if (prevAbort) {
      prevAbort.abort();
    }

    const abortController = new AbortController();
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      history: [...state.history, userMsg],
      status: 'Thinking',
      streamingResponse: '',
      streamingTokens: [],
      currentTranscript: '',
      abortController,
    }));

    const activeModuleId = nexus.activeCardId;
    const activeCard = nexus.cards.find((c) => c.id === activeModuleId);
    const expandedCardId = nexus.expandedCardId;

    const payload = {
      prompt,
      history: get().history.slice(-8),
      activeModule: activeModuleId,
      activeModuleData: {
        title: activeCard?.title,
        category: activeCard?.category,
        metrics: activeCard?.metrics,
        status: activeCard?.status,
        isExpanded: expandedCardId === activeModuleId,
      },
      systemState: {
        activeCardId: activeModuleId,
        expandedCardId: expandedCardId,
        isHandTrackingActive: nexus.isHandTrackingActive,
        fps: nexus.fps,
      },
    };

    try {
      const response = await fetch('/api/nexus/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`);
      }

      set({ status: 'Streaming' });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';
      let spokenUpToIndex = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.text) {
                accumulatedText += data.text;
                const tokens = accumulatedText.split(/(\s+)/).filter(Boolean);

                set({
                  streamingResponse: accumulatedText,
                  streamingTokens: tokens,
                });

                // Sentence level streaming speech synthesis
                const remainingUnspoken = accumulatedText.substring(spokenUpToIndex);
                const sentenceMatch = remainingUnspoken.match(/[^.!?\n]+[.!?\n]+/);

                if (sentenceMatch && sentenceMatch[0]) {
                  const sentenceToSpeak = sentenceMatch[0].trim();
                  spokenUpToIndex += sentenceMatch.index! + sentenceMatch[0].length;
                  set({ status: 'Speaking' });
                  get().speakSentence(sentenceToSpeak);
                }

                // Parse and execute actions
                const actionRegex = /\[\[ACTION:(\{.+?\})\]\]/g;
                let match;
                while ((match = actionRegex.exec(accumulatedText)) !== null) {
                  get().executeActionTag(match[1]);
                }
              }

              if (data.isComplete) {
                const finalRemaining = accumulatedText.substring(spokenUpToIndex).trim();
                if (finalRemaining) {
                  get().speakSentence(finalRemaining);
                }
              }
            } catch (e) {
              console.warn('SSE Chunk Parse Error:', e);
            }
          }
        }
      }

      const cleanAiText = accumulatedText.replace(/\[\[ACTION:[^\]]+\]\]/g, '').trim();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: cleanAiText || 'Command processed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokens: get().streamingTokens,
      };

      set((state) => ({
        history: [...state.history, assistantMsg],
        abortController: null,
      }));

      setTimeout(() => {
        if (get().status === 'Speaking' || get().status === 'Streaming') {
          set({ status: get().wakeState.isWoken ? 'Listening' : 'Offline' });
        }
      }, 2000);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('Stream aborted by user interruption');
        return;
      }
      console.error('AI Stream Error:', err);
      set({
        status: 'Offline',
        abortController: null,
      });
      useNexusStore.getState().addLog('WARN', `AI Link: ${err?.message || 'Offline'}`);
    }
  },
}));
