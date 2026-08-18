import { GestureType, HandPosition } from '../types/nexus';

interface Landmark {
  x: number;
  y: number;
  z: number;
}

export class GestureEngine {
  private historyX: number[] = [];
  private historyZ: number[] = [];
  private historyIndexPoints: Array<{ x: number; y: number; t: number }> = [];
  private lastSwipeTime = 0;
  private lastPullPushTime = 0;
  private lastCircleTime = 0;

  public processLandmarks(landmarks: Landmark[]): {
    gesture: GestureType;
    confidence: number;
    handPos: HandPosition;
  } {
    if (!landmarks || landmarks.length < 21) {
      return {
        gesture: 'NONE',
        confidence: 0,
        handPos: {
          x: 0,
          y: 0,
          z: 0,
          isPinching: false,
          pinchDistance: 1,
          isOpenPalm: false,
          isFreeze: false,
        }
      };
    }

    const now = Date.now();
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const palmCenter = landmarks[9];

    // Normalized screen position (-1 to 1)
    // MediaPipe x is 0..1 (left to right), y is 0..1 (top to bottom)
    const normX = (indexTip.x - 0.5) * 2;
    const normY = -(indexTip.y - 0.5) * 2; // Invert Y for 3D coordinate space
    const normZ = indexTip.z; // Depth estimation

    // 1. Calculate Pinch Distance (Thumb Tip to Index Tip)
    const dxPinch = thumbTip.x - indexTip.x;
    const dyPinch = thumbTip.y - indexTip.y;
    const dzPinch = thumbTip.z - indexTip.z;
    const pinchDistance = Math.sqrt(dxPinch * dxPinch + dyPinch * dyPinch + dzPinch * dzPinch);
    const isPinching = pinchDistance < 0.075;

    // 2. Open Palm Check
    const distWristToIndex = this.dist3d(wrist, indexTip);
    const distWristToMiddle = this.dist3d(wrist, middleTip);
    const distWristToRing = this.dist3d(wrist, ringTip);
    const distWristToPinky = this.dist3d(wrist, pinkyTip);

    const avgExt = (distWristToIndex + distWristToMiddle + distWristToRing + distWristToPinky) / 4;
    const isOpenPalm = avgExt > 0.35 && !isPinching;

    // 3. Freeze / Fist Check
    const distPalmToIndex = this.dist3d(palmCenter, indexTip);
    const distPalmToMiddle = this.dist3d(palmCenter, middleTip);
    const isFreeze = distPalmToIndex < 0.12 && distPalmToMiddle < 0.12 && !isPinching;

    // 4. Track Wrist Movement for Swipe
    this.historyX.push(wrist.x);
    if (this.historyX.length > 12) this.historyX.shift();

    let gesture: GestureType = 'NONE';
    let confidence = 0.92;

    if (isPinching) {
      gesture = 'PINCH';
      confidence = Math.max(0.85, 1 - pinchDistance * 5);
    } else if (isFreeze) {
      gesture = 'FREEZE';
      confidence = 0.95;
    } else if (isOpenPalm) {
      gesture = 'OPEN_PALM';
      confidence = 0.96;
    }

    // Check Swipe Gesture
    if (this.historyX.length >= 8 && now - this.lastSwipeTime > 500 && !isPinching) {
      const deltaX = this.historyX[this.historyX.length - 1] - this.historyX[0];
      if (deltaX > 0.18) {
        // Hand moved right on video = Swipe Right in 3D
        gesture = 'SWIPE_RIGHT';
        confidence = 0.98;
        this.lastSwipeTime = now;
      } else if (deltaX < -0.18) {
        // Hand moved left
        gesture = 'SWIPE_LEFT';
        confidence = 0.98;
        this.lastSwipeTime = now;
      }
    }

    // 5. Track Z for Pull / Push (Camera expansion / collapse)
    const handScale = distWristToIndex;
    this.historyZ.push(handScale);
    if (this.historyZ.length > 10) this.historyZ.shift();

    if (this.historyZ.length >= 6 && now - this.lastPullPushTime > 700 && !isPinching) {
      const scaleDelta = this.historyZ[this.historyZ.length - 1] - this.historyZ[0];
      if (scaleDelta > 0.12) {
        gesture = 'PULL';
        confidence = 0.94;
        this.lastPullPushTime = now;
      } else if (scaleDelta < -0.12) {
        gesture = 'PUSH';
        confidence = 0.94;
        this.lastPullPushTime = now;
      }
    }

    // 6. Check Circle Gesture (Index fingertip circular trail)
    this.historyIndexPoints.push({ x: indexTip.x, y: indexTip.y, t: now });
    this.historyIndexPoints = this.historyIndexPoints.filter(p => now - p.t < 1000);

    if (this.historyIndexPoints.length >= 15 && now - this.lastCircleTime > 2000) {
      if (this.isCircularMotion(this.historyIndexPoints)) {
        gesture = 'CIRCLE';
        confidence = 0.96;
        this.lastCircleTime = now;
      }
    }

    const handPos: HandPosition = {
      x: normX,
      y: normY,
      z: normZ,
      isPinching,
      pinchDistance,
      isOpenPalm,
      isFreeze,
      rawLandmarks: landmarks
    };

    return { gesture, confidence, handPos };
  }

  private dist3d(a: Landmark, b: Landmark): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private isCircularMotion(points: Array<{ x: number; y: number }>): boolean {
    if (points.length < 12) return false;
    let cx = 0, cy = 0;
    points.forEach(p => { cx += p.x; cy += p.y; });
    cx /= points.length;
    cy /= points.length;

    let totalAngle = 0;
    for (let i = 1; i < points.length; i++) {
      const v1x = points[i - 1].x - cx;
      const v1y = points[i - 1].y - cy;
      const v2x = points[i].x - cx;
      const v2y = points[i].y - cy;
      const angle1 = Math.atan2(v1y, v1x);
      const angle2 = Math.atan2(v2y, v2x);
      let diff = angle2 - angle1;
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      totalAngle += diff;
    }

    return Math.abs(totalAngle) > Math.PI * 1.5;
  }
}

export const gestureEngine = new GestureEngine();
