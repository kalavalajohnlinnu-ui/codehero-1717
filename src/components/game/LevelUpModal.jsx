import React, { useEffect } from 'react';
import { soundService } from '../../services/soundService';

export const LevelUpModal = ({ newLevel, levelName, onClose }) => {
  useEffect(() => {
    soundService.playFanfare();
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" onClick={onClose}>
      <style>{`
        @keyframes particle-up {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translateY(80vh) scale(1); }
          100% { transform: translateY(-20vh) scale(0.5); opacity: 0; }
        }
        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: particle-up 3s linear infinite;
        }
        @keyframes scale-bounce {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-scale-bounce {
          animation: scale-bounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes rotate-rays {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .rays {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200vw;
          height: 200vw;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(251, 191, 36, 0.2) 15deg, transparent 30deg, rgba(251, 191, 36, 0.2) 45deg, transparent 60deg, rgba(251, 191, 36, 0.2) 75deg, transparent 90deg, rgba(251, 191, 36, 0.2) 105deg, transparent 120deg, rgba(251, 191, 36, 0.2) 135deg, transparent 150deg, rgba(251, 191, 36, 0.2) 165deg, transparent 180deg, rgba(251, 191, 36, 0.2) 195deg, transparent 210deg, rgba(251, 191, 36, 0.2) 225deg, transparent 240deg, rgba(251, 191, 36, 0.2) 255deg, transparent 270deg, rgba(251, 191, 36, 0.2) 285deg, transparent 300deg, rgba(251, 191, 36, 0.2) 315deg, transparent 330deg, rgba(251, 191, 36, 0.2) 345deg, transparent 360deg);
          animation: rotate-rays 20s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Light overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      {/* Sun rays background */}
      <div className="rays"></div>

      {/* Particles */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="particle shadow-sm"
          style={{
            left: `\${Math.random() * 100}%`,
            width: `\${Math.random() * 8 + 2}px`,
            height: `\${Math.random() * 8 + 2}px`,
            backgroundColor: ['#fbbf24', '#38bdf8', '#a78bfa', '#f87171'][Math.floor(Math.random() * 4)],
            animationDelay: `\${Math.random() * 2}s`,
            animationDuration: `\${Math.random() * 2 + 2}s`
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center animate-scale-bounce">
        <div className="text-amber-500 font-black text-7xl md:text-9xl tracking-tighter drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] mb-2 uppercase" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Level Up!
        </div>
        
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
          <div className="text-slate-500 text-xl font-bold uppercase tracking-widest mb-2 font-sans">You have ascended to</div>
          <div className="text-sky-600 text-5xl font-black mb-8 drop-shadow-sm font-sans">{levelName}</div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-6 font-bold text-sm font-sans">
            Level {newLevel} Achieved
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-inner">
            <h3 className="text-slate-700 font-bold mb-3 uppercase text-sm tracking-wider font-sans">Unlocks</h3>
            <ul className="text-left space-y-3 font-sans">
              <li className="flex items-center text-slate-700 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                <span className="text-2xl mr-3">⚔️</span> 
                <span className="font-medium">Algorithm Arena Difficulty +</span>
              </li>
              <li className="flex items-center text-slate-700 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                <span className="text-2xl mr-3">✨</span> 
                <span className="font-medium">New Profile Badge Earned</span>
              </li>
              <li className="flex items-center text-slate-700 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                <span className="text-2xl mr-3">🏆</span> 
                <span className="font-medium">+500 Bonus XP</span>
              </li>
            </ul>
          </div>
          
          <p className="text-slate-400 text-sm mt-6 animate-pulse font-sans">Click anywhere to continue</p>
        </div>
      </div>
    </div>
  );
};
