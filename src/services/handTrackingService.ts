import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { gestureEngine } from './gestureEngine';
import { useNexusStore } from '../store/useNexusStore';
import { useAiAssistantStore } from '../store/useAiAssistantStore';
import { audioEngine } from './audioEngine';

class HandTrackingService {
  private handLandmarker: HandLandmarker | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;
  private lastVideoTime = -1;

  public async initialize(): Promise<boolean> {
    const store = useNexusStore.getState();
    try {
      store.setCameraLoading(true);
      store.addLog('SYS', 'Initializing MediaPipe HandLandmarker vision tasks...');

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1
      });

      store.addLog('SYS', 'MediaPipe HandLandmarker GPU engine loaded');
      store.setCameraLoading(false);
      return true;
    } catch (err) {
      console.warn('Failed to load MediaPipe HandLandmarker:', err);
      store.addLog('WARN', 'MediaPipe CDN fallback error, falling back to spatial simulation pointer');
      store.setCameraLoading(false);
      return false;
    }
  }

  public async startWebcam(videoEl: HTMLVideoElement): Promise<boolean> {
    const store = useNexusStore.getState();
    this.videoElement = videoEl;

    try {
      if (!this.handLandmarker) {
        const loaded = await this.initialize();
        if (!loaded) return false;
      }

      store.addLog('SYS', 'Requesting camera frame permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });

      this.videoElement.srcObject = stream;
      await new Promise<void>((resolve) => {
        if (this.videoElement) {
          this.videoElement.onloadedmetadata = () => resolve();
        }
      });
      await this.videoElement.play();

      this.isRunning = true;
      store.addLog('INFO', 'Webcam stream active (640x480 @ 60fps)');
      this.processVideoFrame();
      return true;
    } catch (err) {
      console.error('Camera access denied or error:', err);
      store.addLog('WARN', 'Camera access denied. Hand gesture simulator active.');
      return false;
    }
  }

  public stopWebcam() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
    useNexusStore.getState().addLog('SYS', 'Webcam stream stopped');
  }

  private processVideoFrame = () => {
    if (!this.isRunning || !this.videoElement || !this.handLandmarker) return;

    if (this.videoElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      const startTimeMs = performance.now();
      const results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);

      const store = useNexusStore.getState();

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0]; // First hand
        const { gesture, confidence, handPos } = gestureEngine.processLandmarks(landmarks);

        // Update state
        store.setHandPosition(handPos);
        store.setCurrentGesture(gesture, confidence);

        // Process Gesture Action Responses
        if (!store.spatialLock) {
          this.handleGestureAction(gesture, handPos);
        }
      } else {
        store.setCurrentGesture('NONE', 0);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.processVideoFrame);
  };

  private handleGestureAction(gesture: string, handPos: any) {
    const store = useNexusStore.getState();

    switch (gesture) {
      case 'SWIPE_LEFT':
        store.rotateCarousel(Math.PI / 5);
        audioEngine.playSwipe();
        break;
      case 'SWIPE_RIGHT':
        store.rotateCarousel(-Math.PI / 5);
        audioEngine.playSwipe();
        break;
      case 'PULL':
        if (store.activeCardId) {
          store.setExpandedCard(store.activeCardId);
          audioEngine.playExpand();
        }
        break;
      case 'PUSH':
        if (store.expandedCardId) {
          store.setExpandedCard(null);
          audioEngine.playRelease();
        }
        break;
      case 'CIRCLE':
        store.triggerAiPulse();
        audioEngine.playAiPulse();
        useAiAssistantStore.getState().wakeAssistant('GESTURE');
        break;
    }
  }
}

export const handTrackingService = new HandTrackingService();
