import { useEffect, useRef, useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { handTrackingService } from '../services/handTrackingService';

export function useHandTracking() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  const isHandTrackingActive = useNexusStore((state) => state.isHandTrackingActive);

  useEffect(() => {
    if (isHandTrackingActive && videoRef.current) {
      handTrackingService.startWebcam(videoRef.current).then((success) => {
        setHasWebcamPermission(success);
      });
    } else {
      handTrackingService.stopWebcam();
    }

    return () => {
      handTrackingService.stopWebcam();
    };
  }, [isHandTrackingActive]);

  return {
    videoRef,
    hasWebcamPermission
  };
}
