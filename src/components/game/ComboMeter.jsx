import React, { useEffect, useState } from 'react';
import { soundService } from '../../services/soundService';

export const ComboMeter = ({ combo }) => {
  const [shake, setShake] = useState(false);
  const [prevCombo, setPrevCombo] = useState(0);

  useEffect(() => {
    if (combo === 0 && prevCombo > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setPrevCombo(combo);
  }, [combo, prevCombo]);

  if (combo <= 1) return null;

  const multiplier = Math.min(Math.floor(combo / 2) + 1, 5); // Max x5
  
  let borderColor = "border-amber-300";
  let icon = "⚡";
  let size = "scale-100";
  let gradientColors = "from-amber-400 to-amber-600";
  
  if (multiplier >= 3) {
    borderColor = "border-orange-400";
    icon = "🔥";
    size = "scale-110";
    gradientColors = "from-orange-400 to-orange-600";
  }
  if (multiplier >= 5) {
    borderColor = "border-red-400";
    icon = "☄️";
    size = "scale-125";
    gradientColors = "from-red-400 to-red-600";
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-transform duration-300 \${size}`}>
      <style>{`
        @keyframes meter-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          50% { transform: translateX(5px) rotate(5deg); }
          75% { transform: translateX(-5px) rotate(-5deg); }
        }
        .combo-shake {
          animation: meter-shake 0.4s ease-in-out;
        }
        @keyframes pulse-combo {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.05); }
        }
        .combo-pulse {
          animation: pulse-combo 1s infinite alternate;
        }
      `}</style>
      
      <div className={`flex items-center bg-white border-2 \${borderColor} rounded-2xl pl-2 pr-4 py-2 shadow-lg shadow-amber-500/20 \${shake ? 'combo-shake' : 'combo-pulse'}`}>
        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-100 mr-3`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-700 font-bold uppercase tracking-wider leading-none mb-1 font-sans">Combo</span>
          <span className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r \${gradientColors} leading-none font-sans`}>
            x{multiplier}
          </span>
        </div>
      </div>
    </div>
  );
};
