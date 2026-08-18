export type ModuleId = 
  | 'instagram'
  | 'stocks'
  | 'projects'
  | 'sports'
  | 'calendar'
  | 'weather'
  | 'ai'
  | 'news'
  | 'music'
  | 'system';

export type CardState = 'idle' | 'hovered' | 'selected' | 'expanded' | 'focused' | 'dragging';

export interface NexusCard {
  id: ModuleId;
  title: string;
  category: string;
  subtitle: string;
  version: string;
  iconName: string;
  accentColor: string;
  glowColor: string;
  status: 'ONLINE' | 'ACTIVE' | 'STANDBY' | 'SYNCING';
  metrics: {
    label: string;
    value: string;
    change?: string;
  }[];
}

export type GestureType = 
  | 'NONE'
  | 'SWIPE_LEFT'
  | 'SWIPE_RIGHT'
  | 'PINCH'
  | 'RELEASE'
  | 'PULL'
  | 'PUSH'
  | 'FREEZE'
  | 'CIRCLE'
  | 'OPEN_PALM';

export interface HandPosition {
  x: number; // Normalized -1 to 1
  y: number; // Normalized -1 to 1
  z: number; // Normalized depth
  isPinching: boolean;
  pinchDistance: number;
  isOpenPalm: boolean;
  isFreeze: boolean;
  rawLandmarks?: Array<{ x: number; y: number; z: number }>;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'EXEC' | 'SYS';
  message: string;
}

export interface AudioSettings {
  masterVolume: number;
  ambientEnabled: boolean;
  sfxEnabled: boolean;
}

export type AiStatus =
  | 'Listening'
  | 'Thinking'
  | 'Speaking'
  | 'Interrupted'
  | 'Offline'
  | 'Streaming';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  tokens?: string[];
}

export interface WakeState {
  isWoken: boolean;
  wakeTrigger: 'VOICE' | 'GESTURE' | 'MANUAL' | 'NONE';
  auraIntensity: number;
  waveProgress: number;
  micVisible: boolean;
}

export interface VoiceCommandAction {
  type: 'OPEN_MODULE' | 'EXPAND_MODULE' | 'CLOSE_EXPANDED' | 'ROTATE' | 'PULSE' | 'SEARCH' | 'MUSIC_CONTROL';
  target?: string;
  direction?: 'left' | 'right';
  query?: string;
  command?: string;
}

