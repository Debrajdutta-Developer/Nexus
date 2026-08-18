import { useAiAssistantStore } from '../store/useAiAssistantStore';

class VoiceEngine {
  private recognition: any = null;
  private isListening = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  public init() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition API is not supported in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const store = useAiAssistantStore.getState();
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const activeTranscript = (finalTranscript || interimTranscript).trim();

        // 1. Wake Phrase Detection ("Nexus", "Hey Nexus")
        if (!store.wakeState.isWoken) {
          const lower = activeTranscript.toLowerCase();
          if (lower.includes('nexus') || lower.includes('hey nexus') || lower.includes('computer')) {
            store.wakeAssistant('VOICE');
            const cleanPrompt = lower.replace(/^(hey\s+)?nexus\s*/i, '').trim();
            if (cleanPrompt.length > 2) {
              store.sendUserPrompt(cleanPrompt);
            }
            return;
          }
        }

        // 2. Interruption Detection
        // If user speaks while AI is speaking, thinking, or streaming, immediately stop AI
        if (store.status === 'Speaking' || store.status === 'Streaming' || store.status === 'Thinking') {
          if (activeTranscript.length > 0) {
            store.interrupt();
          }
        }

        // 3. Active Transcription Display
        if (store.wakeState.isWoken) {
          store.setCurrentTranscript(interimTranscript || finalTranscript);

          // 4. Send final recognized phrase to Gemini
          if (finalTranscript.trim().length > 1) {
            const promptToSend = finalTranscript.trim();
            store.setCurrentTranscript('');
            store.sendUserPrompt(promptToSend);
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech Recognition error:', event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // Auto-restart continuous listening if mic is enabled
        const store = useAiAssistantStore.getState();
        if (store.isMicEnabled || store.wakeState.isWoken) {
          try {
            this.recognition?.start();
          } catch {
            // Ignore start error if already active
          }
        }
      };
    } catch (e) {
      console.warn('Failed to initialize SpeechRecognition:', e);
    }
  }

  public async startMicrophone() {
    if (!this.recognition) {
      this.init();
    }
    try {
      if (!this.isListening && this.recognition) {
        this.recognition.start();
      }
      this.initAudioAnalyser();
    } catch (e) {
      // Ignore already started
    }
  }

  public stopMicrophone() {
    try {
      if (this.isListening && this.recognition) {
        this.recognition.stop();
      }
      this.stopAudioAnalyser();
    } catch {
      // Ignore
    }
  }

  private async initAudioAnalyser() {
    if (this.analyser) return;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const AudioCtx =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(this.micStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 32;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const updateLevel = () => {
          if (this.analyser) {
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / (dataArray.length * 255);
            useAiAssistantStore.getState().setAudioLevel(avg);
          }
          this.animFrameId = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }
    } catch (e) {
      console.warn('Microphone stream audio metering suppressed or permission denied:', e);
    }
  }

  private stopAudioAnalyser() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    this.analyser = null;
  }
}

export const voiceEngine = new VoiceEngine();
