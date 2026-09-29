export type DevicePerformance = 'low' | 'balanced' | 'high';

export interface DeviceProfile {
  mobile: boolean;
  performance: DevicePerformance;
  dpr: [number, number];
  particleCount: number;
  handTrackingFps: number;
  cameraWidth: number;
  cameraHeight: number;
  effects: boolean;
}

export function getDeviceProfile(): DeviceProfile {
  if (typeof navigator === 'undefined') return { mobile: false, performance: 'high', dpr: [1, 2], particleCount: 180, handTrackingFps: 24, cameraWidth: 640, cameraHeight: 480, effects: true };
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || Math.min(window.innerWidth, window.innerHeight) < 700;
  if (mobile && (cores <= 4 || memory <= 4)) return { mobile: true, performance: 'low', dpr: [1, 1.25], particleCount: 55, handTrackingFps: 12, cameraWidth: 320, cameraHeight: 240, effects: false };
  if (mobile || cores <= 6 || memory <= 6) return { mobile, performance: 'balanced', dpr: [1, 1.5], particleCount: 100, handTrackingFps: 15, cameraWidth: 480, cameraHeight: 360, effects: false };
  return { mobile: false, performance: 'high', dpr: [1, 2], particleCount: 180, handTrackingFps: 24, cameraWidth: 640, cameraHeight: 480, effects: true };
}

export const deviceProfile = getDeviceProfile();
