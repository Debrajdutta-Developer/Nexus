import React, { useState } from 'react';
import { HeaderHUD } from './HeaderHUD';
import { SystemLogHUD } from './SystemLogHUD';
import { GestureConfidenceHUD } from './GestureConfidenceHUD';
import { HandTrackingOverlay } from './HandTrackingOverlay';
import { WakeAuraOverlay } from './WakeAuraOverlay';
import { AIMicPodHUD } from './AIMicPodHUD';
import { AIConversationHistoryDrawer } from './AIConversationHistoryDrawer';

export const FUIHUD: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Dynamic Interface Aura on Wake */}
      <WakeAuraOverlay />

      <HeaderHUD />
      <HandTrackingOverlay />
      <SystemLogHUD />
      <GestureConfidenceHUD />

      {/* Floating Holographic AI Microphone Pod */}
      <AIMicPodHUD
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
      />

      {/* Conversation Memory Drawer */}
      <AIConversationHistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

