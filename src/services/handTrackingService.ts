import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { gestureEngine } from './gestureEngine';
import { useNexusStore } from '../store/useNexusStore';
import { useAiAssistantStore } from '../store/useAiAssistantStore';
import { audioEngine } from './audioEngine';
import { deviceProfile } from './deviceProfile';

class HandTrackingService {
  private handLandmarker: HandLandmarker | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;
  private lastVideoTime = -1;
  private lastDetectMs = 0;

  public async initialize(): Promise<boolean> {
    const store = useNexusStore.getState();
    try {
      store.setCameraLoading(true);
      store.addLog('SYS', `Vision profile: ${deviceProfile.performance} / ${deviceProfile.handTrackingFps} FPS`);
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
        runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: 0.55, minHandPresenceConfidence: 0.5, minTrackingConfidence: 0.5
      });
      store.setCameraLoading(false);
      return true;
    } catch (err) {
      console.warn('HandLandmarker initialization failed:', err);
      store.addLog('WARN', 'Hand tracking unavailable. Touch/pointer control remains active.');
      store.setCameraLoading(false);
      return false;
    }
  }

  public async startWebcam(videoEl: HTMLVideoElement): Promise<boolean> {
    const store = useNexusStore.getState();
    this.videoElement = videoEl;
    try {
      if (!this.handLandmarker && !(await this.initialize())) return false;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: deviceProfile.cameraWidth }, height: { ideal: deviceProfile.cameraHeight }, frameRate: { ideal: deviceProfile.handTrackingFps, max: deviceProfile.handTrackingFps }, facingMode: 'user' },
        audio: false
      });
      this.videoElement.srcObject = stream;
      await this.videoElement.play();
      this.isRunning = true;
      this.lastDetectMs = 0;
      store.addLog('INFO', `Hand tracking active at ${deviceProfile.handTrackingFps} FPS`);
      this.processVideoFrame();
      return true;
    } catch (err) {
      console.warn('Camera access failed:', err);
      store.addLog('WARN', 'Camera unavailable. Pointer/touch mode active.');
      return false;
    }
  }

  public stopWebcam() {
    this.isRunning = false;
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    if (this.videoElement?.srcObject) {
      (this.videoElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }
  }

  private processVideoFrame = () => {
    if (!this.isRunning || !this.videoElement || !this.handLandmarker) return;
    const now = performance.now();
    if (now - this.lastDetectMs >= 1000 / deviceProfile.handTrackingFps && this.videoElement.currentTime !== this.lastVideoTime) {
      this.lastDetectMs = now;
      this.lastVideoTime = this.videoElement.currentTime;
      const results = this.handLandmarker.detectForVideo(this.videoElement, now);
      const store = useNexusStore.getState();
      if (results.landmarks?.length) {
        const { gesture, confidence, handPos } = gestureEngine.processLandmarks(results.landmarks[0]);
        store.setHandPosition(handPos);
        store.setCurrentGesture(gesture, confidence);
        if (!store.spatialLock && confidence >= 0.68) this.handleGestureAction(gesture);
      } else store.setCurrentGesture('NONE', 0);
    }
    this.animationFrameId = requestAnimationFrame(this.processVideoFrame);
  };

  private handleGestureAction(gesture: string) {
    const store = useNexusStore.getState();
    switch (gesture) {
      case 'SWIPE_LEFT': store.rotateCarousel(Math.PI / 5); audioEngine.playSwipe(); break;
      case 'SWIPE_RIGHT': store.rotateCarousel(-Math.PI / 5); audioEngine.playSwipe(); break;
      case 'PULL': if (store.activeCardId) { store.setExpandedCard(store.activeCardId); audioEngine.playExpand(); } break;
      case 'PUSH': if (store.expandedCardId) { store.setExpandedCard(null); audioEngine.playRelease(); } break;
      case 'CIRCLE': store.triggerAiPulse(); audioEngine.playAiPulse(); useAiAssistantStore.getState().wakeAssistant('GESTURE'); break;
    }
  }
}

export const handTrackingService = new HandTrackingService();
