import { create } from 'zustand';
import { NexusCard, ModuleId, GestureType, HandPosition, SystemLogEntry, AudioSettings } from '../types/nexus';

export const INITIAL_CARDS: NexusCard[] = [
  {
    id: 'instagram',
    title: 'SPATIAL FEED',
    category: 'MEDIA // SOCIAL',
    subtitle: 'VOLUMETRIC REELS & MEDIA',
    version: 'v4.2.0',
    iconName: 'Instagram',
    accentColor: '#38bdf8', // Cyan/blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ONLINE',
    metrics: [
      { label: 'ENGAGEMENT', value: '98.4%' },
      { label: 'IMPRESSIONS', value: '1.2M', change: '+14%' },
      { label: 'LIVE REELS', value: '4 ACTIVE' }
    ]
  },
  {
    id: 'stocks',
    title: 'MARKET MATRIX',
    category: 'FINANCE // QUANT',
    subtitle: 'REAL-TIME VOLUMETRIC TICKER',
    version: 'v8.1.1',
    iconName: 'TrendingUp',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ACTIVE',
    metrics: [
      { label: 'NEXUS-500', value: '5,842.10', change: '+1.82%' },
      { label: 'TECH-INDEX', value: '$18,420', change: '+3.4%' },
      { label: 'ALPHA SIGNAL', value: 'STRONG BUY' }
    ]
  },
  {
    id: 'projects',
    title: 'LINEAR CORE',
    category: 'DEV // WORKSPACE',
    subtitle: 'SPRINT VELOCITY & TASKS',
    version: 'v2.9.0',
    iconName: 'Kanban',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'SYNCING',
    metrics: [
      { label: 'SPRINT', value: 'CYCL-89' },
      { label: 'VELOCITY', value: '94 pts' },
      { label: 'OPEN ISSUES', value: '3 Critical' }
    ]
  },
  {
    id: 'sports',
    title: 'SPATIAL ARENA',
    category: 'LIVE TELEMETRY',
    subtitle: '3D PITCH & PLAYER DATA',
    version: 'v1.4.0',
    iconName: 'Trophy',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ONLINE',
    metrics: [
      { label: 'MATCH', value: 'FCB 3 - 1 RMA' },
      { label: 'POSSESSION', value: '64%' },
      { label: 'XG METRIC', value: '2.84' }
    ]
  },
  {
    id: 'calendar',
    title: 'TEMPORAL GRID',
    category: 'TIME // CHRONO',
    subtitle: 'SPATIAL SCHEDULER & NODES',
    version: 'v3.0.5',
    iconName: 'Calendar',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ONLINE',
    metrics: [
      { label: 'NEXT EVENT', value: '14:30 UTC' },
      { label: 'AGENDA', value: '4 Meetings' },
      { label: 'FOCUS TIME', value: '3.5 Hrs Left' }
    ]
  },
  {
    id: 'weather',
    title: 'ATMOSPHERE',
    category: 'CLIMATE // RADAR',
    subtitle: '3D VOLUMETRIC RADAR',
    version: 'v6.0.1',
    iconName: 'CloudRain',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ACTIVE',
    metrics: [
      { label: 'TEMP', value: '22°C / 71.6°F' },
      { label: 'PRESSURE', value: '1013 hPa' },
      { label: 'PRECIP', value: '0.0 mm/h' }
    ]
  },
  {
    id: 'ai',
    title: 'NEURAL CORE',
    category: 'INTELLIGENCE // SYNAPSE',
    subtitle: 'SPATIAL VECTOR FIELD',
    version: 'v0.9.9',
    iconName: 'Cpu',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'STANDBY',
    metrics: [
      { label: 'MODEL', value: 'NEXUS-OMNI' },
      { label: 'LATENCY', value: '12ms' },
      { label: 'QUANT LEVEL', value: 'FP16 HIGH' }
    ]
  },
  {
    id: 'news',
    title: 'QUANTUM FEED',
    category: 'GLOBAL // TELEMETRY',
    subtitle: 'REALTIME HOLOGRAPHIC NEWS',
    version: 'v5.1.0',
    iconName: 'Newspaper',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ONLINE',
    metrics: [
      { label: 'HEADLINES', value: '128 UNREAD' },
      { label: 'SENTIMENT', value: '+0.68 BULL' },
      { label: 'LATENCY', value: '8ms' }
    ]
  },
  {
    id: 'music',
    title: 'TE-SYNTH 808',
    category: 'AUDIO // FREQUENCY',
    subtitle: 'INDUSTRIAL SYNTH & WAVE',
    version: 'v10.0.1',
    iconName: 'Disc',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ACTIVE',
    metrics: [
      { label: 'BPM', value: '124.0' },
      { label: 'PRESET', value: 'AMB_DRONE_01' },
      { label: 'SPATIAL', value: '3D BINAURAL' }
    ]
  },
  {
    id: 'system',
    title: 'NEXUS OS CORE',
    category: 'KERNEL // HARDWARE',
    subtitle: 'SPATIAL OS PROCESS MONITOR',
    version: 'v1.0.0-PROD',
    iconName: 'Server',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    status: 'ONLINE',
    metrics: [
      { label: 'CPU UTIL', value: '14.2%' },
      { label: 'GPU MEM', value: '2.1 GB / 16 GB' },
      { label: 'TEMP', value: '42.0 °C' }
    ]
  }
];

interface NexusState {
  cards: NexusCard[];
  activeCardId: ModuleId;
  expandedCardId: ModuleId | null;
  hoveredCardId: ModuleId | null;
  draggedCardId: ModuleId | null;
  
  // Carousel Orbit State
  carouselRotation: number;
  targetCarouselRotation: number;
  rotationVelocity: number;
  
  // Hand Tracking State
  isHandTrackingActive: boolean;
  isCameraLoading: boolean;
  handPosition: HandPosition;
  currentGesture: GestureType;
  gestureConfidence: number;
  spatialLock: boolean;
  
  // FPS & Quality
  fps: number;
  rendererInfo: {
    vendor: string;
    renderer: string;
  };
  
  // System Logs
  logs: SystemLogEntry[];
  
  // Audio
  audio: AudioSettings;
  
  // Actions
  setActiveCard: (id: ModuleId) => void;
  setHoveredCard: (id: ModuleId | null) => void;
  setExpandedCard: (id: ModuleId | null) => void;
  setDraggedCard: (id: ModuleId | null) => void;
  rotateCarousel: (deltaAngle: number) => void;
  setTargetRotation: (angle: number) => void;
  updateCarouselPhysics: () => void;
  
  setHandPosition: (pos: Partial<HandPosition>) => void;
  setCurrentGesture: (gesture: GestureType, confidence?: number) => void;
  toggleHandTracking: () => void;
  setCameraLoading: (loading: boolean) => void;
  toggleSpatialLock: () => void;
  
  addLog: (level: SystemLogEntry['level'], message: string) => void;
  updateFps: (fps: number) => void;
  
  setAudioSettings: (settings: Partial<AudioSettings>) => void;
  triggerAiPulse: () => void;
  aiPulseActive: boolean;
}

export const useNexusStore = create<NexusState>((set, get) => ({
  cards: INITIAL_CARDS,
  activeCardId: 'instagram',
  expandedCardId: null,
  hoveredCardId: null,
  draggedCardId: null,
  
  carouselRotation: 0,
  targetCarouselRotation: 0,
  rotationVelocity: 0,
  
  isHandTrackingActive: false,
  isCameraLoading: false,
  handPosition: {
    x: 0,
    y: 0,
    z: 0,
    isPinching: false,
    pinchDistance: 1,
    isOpenPalm: false,
    isFreeze: false,
  },
  currentGesture: 'NONE',
  gestureConfidence: 0.98,
  spatialLock: false,
  
  fps: 60,
  rendererInfo: {
    vendor: 'WebGL 2.0 Engine',
    renderer: 'NEXUS Spatial Shader Core'
  },
  
  logs: [
    {
      id: '1',
      timestamp: new Date().toISOString().substring(11, 19),
      level: 'SYS',
      message: 'NEXUS Spatial OS Kernel v1.0 initialized'
    },
    {
      id: '2',
      timestamp: new Date().toISOString().substring(11, 19),
      level: 'INFO',
      message: '10 Volumetric Holographic Modules loaded into orbit ring'
    },
    {
      id: '3',
      timestamp: new Date().toISOString().substring(11, 19),
      level: 'EXEC',
      message: 'Spatial Audio Engine: Synthesizer active'
    }
  ],
  
  audio: {
    masterVolume: 0.8,
    ambientEnabled: true,
    sfxEnabled: true,
  },
  
  aiPulseActive: false,

  setActiveCard: (id) => {
    const cards = get().cards;
    const index = cards.findIndex(c => c.id === id);
    if (index !== -1) {
      const stepAngle = (2 * Math.PI) / cards.length;
      const targetAngle = -index * stepAngle;
      set({ 
        activeCardId: id,
        targetCarouselRotation: targetAngle
      });
      get().addLog('EXEC', `Active card set to: [${id.toUpperCase()}]`);
    }
  },
  
  setHoveredCard: (id) => set({ hoveredCardId: id }),
  setExpandedCard: (id) => {
    set({ expandedCardId: id });
    if (id) {
      get().addLog('EXEC', `Card expanded: [${id.toUpperCase()}]`);
    } else {
      get().addLog('SYS', 'Expanded view collapsed');
    }
  },
  setDraggedCard: (id) => set({ draggedCardId: id }),
  
  rotateCarousel: (deltaAngle) => {
    const current = get().targetCarouselRotation;
    set({ targetCarouselRotation: current + deltaAngle });
  },
  
  setTargetRotation: (angle) => set({ targetCarouselRotation: angle }),
  
  updateCarouselPhysics: () => {
    const { carouselRotation, targetCarouselRotation } = get();
    // Spring lerp
    const diff = targetCarouselRotation - carouselRotation;
    const lerped = carouselRotation + diff * 0.12;
    set({ carouselRotation: lerped });
  },
  
  setHandPosition: (pos) => set((state) => ({
    handPosition: { ...state.handPosition, ...pos }
  })),
  
  setCurrentGesture: (gesture, confidence = 0.95) => {
    if (get().currentGesture !== gesture) {
      set({ currentGesture: gesture, gestureConfidence: confidence });
      if (gesture !== 'NONE') {
        get().addLog('INFO', `Gesture detected: ${gesture} (${Math.round(confidence * 100)}%)`);
      }
    }
  },
  
  toggleHandTracking: () => {
    const active = !get().isHandTrackingActive;
    set({ isHandTrackingActive: active });
    get().addLog('SYS', `Hand tracking ${active ? 'ENABLED' : 'DISABLED'}`);
  },
  
  setCameraLoading: (loading) => set({ isCameraLoading: loading }),
  
  toggleSpatialLock: () => {
    const lock = !get().spatialLock;
    set({ spatialLock: lock });
    get().addLog('WARN', `Spatial Lock ${lock ? 'ENGAGED' : 'DISENGAGED'}`);
  },
  
  addLog: (level, message) => set((state) => ({
    logs: [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString().substring(11, 19),
        level,
        message
      },
      ...state.logs.slice(0, 40) // Keep latest 40
    ]
  })),
  
  updateFps: (fps) => set({ fps }),
  
  setAudioSettings: (settings) => set((state) => ({
    audio: { ...state.audio, ...settings }
  })),
  
  triggerAiPulse: () => {
    set({ aiPulseActive: true });
    get().addLog('EXEC', 'AI Spatial Energy Scan triggered');
    setTimeout(() => {
      set({ aiPulseActive: false });
    }, 2000);
  }
}));
