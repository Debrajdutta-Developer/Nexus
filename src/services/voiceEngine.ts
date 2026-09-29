import { useAiAssistantStore } from '../store/useAiAssistantStore';
import { dispatchDeviceCommand } from './commandGateway';

class VoiceEngine {
  private recognition: any = null;
  private isListening = false;
  private restartTimer: number | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private lastRestart = 0;

  public init() {
    if (typeof window === 'undefined' || this.recognition) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      const locale = navigator.language || 'en-IN';
      this.recognition.lang = locale.startsWith('bn') ? 'bn-IN' : locale.startsWith('hi') ? 'hi-IN' : 'en-IN';
      this.recognition.onstart = () => { this.isListening = true; useAiAssistantStore.getState().setStatus('Listening'); };
      this.recognition.onresult = (event: any) => {
        const store = useAiAssistantStore.getState();
        let interim = '', finalText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = String(event.results[i][0]?.transcript || '').trim();
          if (event.results[i].isFinal) finalText += ` ${text}`; else interim += ` ${text}`;
        }
        const active = (finalText || interim).trim();
        if (!store.wakeState.isWoken) {
          const wake = /^(hey\s+)?(nexus|jarvis|computer)\b/i.exec(active);
          if (wake) {
            store.wakeAssistant('VOICE');
            const clean = active.slice(wake[0].length).trim();
            if (clean.length > 1) void this.dispatchOrAi(clean);
          } else if (finalText.trim().length > 1 && store.isMicEnabled) {
            void this.dispatchOrAi(finalText.trim());
          }
          return;
        }
        store.setCurrentTranscript(interim || finalText.trim());
        if (finalText.trim().length > 1) {
          const prompt = finalText.trim();
          store.setCurrentTranscript('');
          void this.dispatchOrAi(prompt);
        }
      };
      this.recognition.onerror = (event: any) => {
        const error = event?.error;
        if (error === 'not-allowed' || error === 'service-not-allowed') useAiAssistantStore.getState().setStatus('Offline');
        else if (error !== 'no-speech' && error !== 'aborted') console.warn('Speech recognition:', error);
      };
      this.recognition.onend = () => {
        this.isListening = false;
        const store = useAiAssistantStore.getState();
        if ((store.isMicEnabled || store.wakeState.isWoken) && Date.now() - this.lastRestart > 500) {
          this.lastRestart = Date.now();
          this.restartTimer = window.setTimeout(() => this.safeStart(), 250);
        }
      };
    } catch (e) { console.warn('SpeechRecognition init failed:', e); }
  }

  private async dispatchOrAi(prompt: string) {
    if (await dispatchDeviceCommand(prompt)) {
      useAiAssistantStore.getState().setStatus('Listening');
      return;
    }
    void useAiAssistantStore.getState().sendUserPrompt(prompt);
  }

  private safeStart() { if (!this.recognition || this.isListening) return; try { this.recognition.start(); } catch {} }
  public async startMicrophone() { if (!this.recognition) this.init(); this.safeStart(); this.initAudioAnalyser(); }
  public stopMicrophone() {
    if (this.restartTimer) window.clearTimeout(this.restartTimer);
    this.restartTimer = null;
    try { this.recognition?.stop(); } catch {}
    this.isListening = false;
    this.stopAudioAnalyser();
  }

  private async initAudioAnalyser() {
    if (this.analyser || !navigator.mediaDevices?.getUserMedia) return;
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 32;
      source.connect(this.analyser);
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      const update = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(data);
        let sum = 0; for (const value of data) sum += value;
        useAiAssistantStore.getState().setAudioLevel(sum / (data.length * 255));
        this.animFrameId = requestAnimationFrame(update);
      };
      update();
    } catch (e) { console.warn('Microphone metering unavailable:', e); }
  }

  private stopAudioAnalyser() {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = null;
    this.micStream?.getTracks().forEach((track) => track.stop());
    this.micStream = null;
    this.analyser = null;
  }
}

export const voiceEngine = new VoiceEngine();
