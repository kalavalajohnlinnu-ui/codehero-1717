import React from 'react';
import { soundService } from '../../services/soundService';

export const StreakModal = ({ streakDays, bonusXP, onClose }) => {
  React.useEffect(() => {
    soundService.playFanfare();
  }, []);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm" onClick={onClose}>
      <style>{`
        @keyframes flame-wobble {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-3deg); }
          75% { transform: scale(1.1) rotate(3deg); }
        }
        .flame-anim {
          animation: flame-wobble 2s infinite ease-in-out;
        }
        @keyframes streak-pop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .streak-container {
          animation: streak-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      
      <div className="streak-container bg-slate-900 border-4 border-orange-500 rounded-3xl p-10 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(249,115,22,0.4)] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-9xl mb-4 flame-anim filter drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
            🔥
          </div>
          
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-600 mb-2 uppercase tracking-tighter">
            {streakDays} Day Streak!
          </h2>
          
          <p className="text-slate-300 text-lg mb-6">
            You're on fire! Keep coming back every day to learn and earn bonuses.
          </p>
          
          <div className="bg-orange-950/50 border border-orange-500/30 rounded-xl p-4 mb-8">
            <span className="block text-orange-400 text-sm font-bold uppercase tracking-wider mb-1">Streak Bonus Awarded</span>
            <span className="text-3xl font-black text-yellow-400">+{bonusXP} XP</span>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-xl text-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] transform hover:scale-105 transition-all"
          >
            Keep it burning!
          </button>
        </div>
      </div>
    </div>
  );
};
