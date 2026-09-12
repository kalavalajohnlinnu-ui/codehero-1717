import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export const DailyRewardModal = ({ onClaim, onClose }) => {
  const [opened, setOpened] = useState(false);
  const [rewardAmount] = useState(Math.floor(Math.random() * 100) + 50);

  const handleOpen = () => {
    if (opened) return;
    soundService.playMagic();
    setOpened(true);
    setTimeout(() => {
      onClaim(rewardAmount);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <style>{`
        @keyframes shake-chest {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-5deg) scale(1.05); }
          50% { transform: rotate(5deg) scale(1.05); }
          75% { transform: rotate(-5deg) scale(1.05); }
        }
        .chest-shake:hover {
          animation: shake-chest 0.5s ease-in-out infinite;
        }
        @keyframes coin-pop {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { transform: translateY(-100px) scale(1.5); opacity: 1; }
          100% { transform: translateY(-50px) scale(1); opacity: 0; }
        }
        .coin {
          position: absolute;
          font-size: 2rem;
          animation: coin-pop 1.5s ease-out forwards;
        }
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .reward-pop {
          animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      
      <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl max-w-md w-full text-center relative overflow-hidden shadow-2xl">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/30 to-transparent pointer-events-none"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 relative z-10">Daily Login Bonus</h2>
        <p className="text-slate-400 mb-8 relative z-10">You came back! Open your chest for a reward.</p>
        
        <div className="relative h-48 w-full flex items-center justify-center mb-6">
          {!opened ? (
            <div 
              className="text-8xl cursor-pointer chest-shake filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all"
              onClick={handleOpen}
            >
              📦
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="text-8xl filter drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]">🎁</div>
              
              {/* Coins exploding out */}
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="coin"
                  style={{
                    left: `\${40 + Math.random() * 20}%`,
                    top: '40%',
                    animationDelay: `\${Math.random() * 0.3}s`,
                    transform: `translateX(\${(Math.random() - 0.5) * 100}px)`
                  }}
                >
                  XP
                </div>
              ))}
              
              <div className="absolute top-0 w-full text-center reward-pop">
                <span className="text-5xl font-black text-amber-400 drop-shadow-lg">+{rewardAmount}</span>
                <span className="text-2xl font-bold text-amber-300 ml-2">XP</span>
              </div>
            </div>
          )}
        </div>
        
        {opened ? (
          <button 
            onClick={onClose}
            className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-lg transition-colors shadow-lg reward-pop"
            style={{ animationDelay: '1s', opacity: 0 }}
          >
            Awesome!
          </button>
        ) : (
          <p className="text-sm text-slate-500 animate-pulse">Click the chest to open</p>
        )}
      </div>
    </div>
  );
};
