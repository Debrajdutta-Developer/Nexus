/**
 * NEXUS Spatial OS - Web Audio Synthesizer & Spatial Voice Engine
 * Pure Web Audio API spatial audio engine.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isAmbientPlaying = false;

  // Spatial Voice & Analyser
  private voiceGain: GainNode | null = null;
  private voicePanner: PannerNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentSpeechSources: AudioBufferSourceNode[] = [];
  private nextVoiceStartTime = 0;
  private freqArray: Uint8Array | null = null;

  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Voice Audio Pipeline: Panner (center) -> Analyser -> Voice Gain -> Master Gain
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

      // 3D Spatial Panner centered directly in front
      if (typeof this.ctx.createPanner === 'function') {
        this.voicePanner = this.ctx.createPanner();
        this.voicePanner.panningModel = 'HRTF';
        this.voicePanner.distanceModel = 'inverse';
        this.voicePanner.refDistance = 1;
        this.voicePanner.maxDistance = 10000;
        this.voicePanner.rolloffFactor = 1;
        this.voicePanner.coneInnerAngle = 360;
        if (this.voicePanner.positionX) {
          this.voicePanner.positionX.setValueAtTime(0, this.ctx.currentTime);
          this.voicePanner.positionY.setValueAtTime(0, this.ctx.currentTime);
          this.voicePanner.positionZ.setValueAtTime(0, this.ctx.currentTime);
        } else {
          this.voicePanner.setPosition(0, 0, 0);
        }
        this.voicePanner.connect(this.analyser);
      } else {
        this.voiceGain.connect(this.analyser);
      }

      this.analyser.connect(this.voiceGain);
      this.voiceGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getFrequencyData(): Uint8Array {
    if (this.analyser && this.freqArray) {
      this.analyser.getByteFrequencyData(this.freqArray);
      return this.freqArray;
    }
    return new Uint8Array(32);
  }

  public getAudioLevel(): number {
    const data = this.getFrequencyData();
    if (!data || data.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / (data.length * 255);
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  public startAmbient() {
    if (this.isAmbientPlaying) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, now);
      this.ambientFilter.Q.setValueAtTime(4, now);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, now);

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.4, now);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.08, now);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(droneGain);
      droneGain.connect(this.masterGain);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Audio ambient start suppressed:', e);
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    try {
      this.ambientOsc1?.stop();
      this.ambientOsc2?.stop();
      this.ambientOsc1?.disconnect();
      this.ambientOsc2?.disconnect();
      this.isAmbientPlaying = false;
    } catch {
      // Ignore
    }
  }

  // Sound FX: Wake Sound (Resonant Nexus triad chord + shimmer)
  public playWakeSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [392.0, 587.33, 880.0, 1174.66];
      freqs.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * 0.85, now + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq, now + i * 0.04 + 0.15);

        gain.gain.setValueAtTime(0.12, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.6);
      });
    } catch {
      // Ignore
    }
  }

  // Sound FX: Interruption (Quick cyber frequency drop)
  public playInterruptedSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Sound FX: Command Success
  public playCommandSuccess() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [659.25, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  // Stream / PCM Audio Chunk Playback
  public async playBase64AudioChunk(base64Data: string, sampleRate = 24000): Promise<number> {
    this.initContext();
    if (!this.ctx) return 0;

    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const numSamples = Math.floor(bytes.length / 2);
      const audioBuffer = this.ctx.createBuffer(1, numSamples, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      const dataView = new DataView(bytes.buffer);

      for (let i = 0; i < numSamples; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        channelData[i] = int16 / 32768.0;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;

      if (this.voicePanner) {
        source.connect(this.voicePanner);
      } else if (this.analyser) {
        source.connect(this.analyser);
      } else if (this.masterGain) {
        source.connect(this.masterGain);
      }

      const now = this.ctx.currentTime;
      const startTime = Math.max(now, this.nextVoiceStartTime);
      source.start(startTime);
      this.nextVoiceStartTime = startTime + audioBuffer.duration;
      this.currentSpeechSources.push(source);

      source.onended = () => {
        const idx = this.currentSpeechSources.indexOf(source);
        if (idx !== -1) {
          this.currentSpeechSources.splice(idx, 1);
        }
      };

      return audioBuffer.duration;
    } catch (e) {
      console.warn('PCM Audio Chunk decoding failed:', e);
      return 0;
    }
  }

  public stopSpeech() {
    this.currentSpeechSources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Ignore
      }
    });
    this.currentSpeechSources = [];
    if (this.ctx) {
      this.nextVoiceStartTime = this.ctx.currentTime;
    }
  }

  // Sound FX: Hover Click
  public playHover() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore
    }
  }

  // Sound FX: Pinch / Select Engage
  public playPinch() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore
    }
  }

  // Sound FX: Release / Drop
  public playRelease() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.1);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  // Sound FX: Swipe Swoosh
  public playSwipe() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.1);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Sound FX: Expand Window Chime
  public playExpand() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.06, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Sound FX: AI Energy Scan Pulse
  public playAiPulse() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.5);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();
