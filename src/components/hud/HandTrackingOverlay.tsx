import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { useHandTracking } from '../../hooks/useHandTracking';
import { Camera, EyeOff } from 'lucide-react';

export const HandTrackingOverlay: React.FC = () => {
  const isHandTrackingActive = useNexusStore((state) => state.isHandTrackingActive);
  const isCameraLoading = useNexusStore((state) => state.isCameraLoading);
  const handPos = useNexusStore((state) => state.handPosition);
  const { videoRef, hasWebcamPermission } = useHandTracking();

  if (!isHandTrackingActive) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto z-40 font-mono select-none">
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950/90 shadow-[0_0_30px_rgba(56,189,248,0.25)] p-2 backdrop-blur-xl flex flex-col items-center">
        {/* Hidden / Rendered Video Canvas */}
        <div className="relative w-48 h-36 rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-900">
          <video
            ref={videoRef}
            className="w-full h-full object-cover transform -scale-x-100 opacity-80"
            playsInline
            muted
          />

          {isCameraLoading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-xs text-cyan-300 gap-2">
              <Camera className="w-5 h-5 text-cyan-400 animate-spin" />
              <span>LOADING GPU VISION...</span>
            </div>
          )}

          {/* Joint Position Laser Marker Box */}
          {handPos.rawLandmarks && handPos.rawLandmarks.length > 0 && (
            <div
              style={{
                left: `${(1 - handPos.rawLandmarks[8].x) * 100}%`,
                top: `${handPos.rawLandmarks[8].y * 100}%`
              }}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#38bdf8] animate-ping"
            />
          )}
        </div>

        <div className="mt-1.5 text-[10px] text-cyan-300 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MEDIAPIPE HAND LANDMARKER ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
