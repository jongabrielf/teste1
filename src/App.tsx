/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Battery, SignalHigh } from 'lucide-react';

const COLORS = ['#FF0000', '#00FF00', '#0000FF'];
const FLASH_INTERVAL = 300; // ms
const DOUBLE_TAP_DELAY = 300; // ms

export default function App() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const lastTapRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFlashing && !isClosed) {
      intervalRef.current = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % COLORS.length);
      }, FLASH_INTERVAL);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isFlashing, isClosed]);

  const handleInteraction = () => {
    if (isClosed) return;

    const now = Date.now();
    const delay = now - lastTapRef.current;

    if (delay < DOUBLE_TAP_DELAY) {
      setIsClosed(true);
      setIsFlashing(false);
    } else {
      setIsFlashing(!isFlashing);
    }

    lastTapRef.current = now;
  };

  if (isClosed) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-dark text-white font-sans overflow-hidden relative">
        <div className="aura w-[600px] h-[600px] bg-rgb-r -top-20 -left-20 opacity-10" />
        <div className="aura w-[400px] h-[400px] bg-rgb-b -bottom-20 -right-20 opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 glass p-10 rounded-3xl text-center max-w-sm"
        >
          <div className="font-mono text-[10px] text-tech mb-4 tracking-[4px] uppercase">System Shutdown</div>
          <h1 className="text-2xl font-light mb-8 tracking-tight">Aplicação Encerrada</h1>
          <button 
            onClick={() => setIsClosed(false)}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 font-medium tracking-wide active:scale-95"
          >
            REINICIAR_SISTEMA
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-dark touch-none cursor-pointer flex items-center justify-center font-sans"
      onPointerDown={handleInteraction}
      id="main-app-container"
    >
      {/* Background Auras */}
      <div className="aura w-[600px] h-[600px] bg-rgb-r -top-24 -left-24" />
      <div className="aura w-[600px] h-[600px] bg-rgb-g -top-24 -right-24" />
      <div className="aura w-[600px] h-[600px] bg-rgb-b bottom-[-100px] left-1/2 -translate-x-1/2" />

      {/* Status Bar */}
      {!isFlashing && (
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20 font-mono text-[10px] text-tech/60 tracking-wider">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-rgb-g animate-pulse" />
            SYSTEM_v.1.0.4
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><Battery size={12} className="opacity-40" /> 88%</span>
            <span className="flex items-center gap-1.5"><SignalHigh size={12} className="opacity-40" /> HIGH</span>
          </div>
        </div>
      )}

      {/* Main UI */}
      <AnimatePresence mode="wait">
        {isFlashing ? (
          <motion.div
            key={colorIndex}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.1 }}
            style={{ backgroundColor: COLORS[colorIndex] }}
            className="absolute inset-0 z-40"
            id="flash-layer"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-16">
            {/* Main Lens */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-72 h-72 rounded-full bg-gradient-to-br from-[#222] to-[#000] border-8 border-[#1a1a1a] shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden"
              id="main-lens"
            >
              <div className="absolute inset-0 opacity-30 blur-[5px] bg-[conic-gradient(from_0deg,#ff4444,#44ff44,#4444ff,#ff4444)] animate-[spin_8s_linear_infinite]" />
              <Sun className="text-white relative z-10 opacity-60" size={64} strokeWidth={1} />
            </motion.div>

            {/* Instruction Card */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl min-w-[320px] text-center"
              id="instruction-card"
            >
              <div className="font-mono text-[10px] text-tech mb-3 tracking-[3px] uppercase">Controller Interface</div>
              <h2 className="text-xl font-light mb-4 text-white">Toque para iniciar ciclo RGB</h2>
              
              <div className="flex gap-3 justify-center mb-6">
                <div className="w-2 h-2 rounded-full bg-rgb-r shadow-[0_0_10px_#ff4444]" />
                <div className="w-2 h-2 rounded-full bg-rgb-g shadow-[0_0_10px_#44ff44]" />
                <div className="w-2 h-2 rounded-full bg-rgb-b shadow-[0_0_10px_#4444ff]" />
              </div>

              <div className="pt-5 border-t border-white/5">
                <p className="text-[11px] text-tech leading-relaxed">
                  Toque duas vezes para encerrar<br/>
                  <span className="opacity-40">CHROMA_SEQUENCER_BUILD_772</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Corner Labels */}
      {!isFlashing && (
        <>
          <div className="absolute bottom-8 left-8 text-tech opacity-20 font-mono text-[10px]">
            L_INF_0x44
          </div>
          <div className="absolute bottom-8 right-8 text-tech opacity-40 font-mono text-[10px] flex items-center gap-2">
            READY_FOR_INPUT <div className="w-1 h-1 bg-tech rounded-full" />
          </div>
        </>
      )}

      {/* Hint overlay when flashing */}
      {isFlashing && (
        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none z-50">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-[10px] font-mono uppercase tracking-[3px] bg-black/40 backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/10"
          >
            RGB_ACTIVE • Tap to suspend
          </motion.p>
        </div>
      )}
    </div>
  );
}

