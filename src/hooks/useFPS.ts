import { useEffect, useRef } from 'react';
import { useNexusStore } from '../store/useNexusStore';

export function useFPS() {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const updateFps = useNexusStore((state) => state.updateFps);

  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        const calculatedFps = Math.round((frameCount.current * 1000) / delta);
        updateFps(calculatedFps);
        frameCount.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateFps]);
}
