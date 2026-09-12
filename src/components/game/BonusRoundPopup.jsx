import React, { useState, useEffect } from 'react';

export const BonusRoundPopup = ({ timeLimit = 60, multiplier = 3, onAccept, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!accepted) return;
    
    if (timeLeft <= 0) {
      onSkip(); // Auto fail if time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, accepted, onSkip]);

  const handleAccept = () => {
    setAccepted(true);
    onAccept(); // Parent handles showing the challenge
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
      <style>{`
        @keyframes flash-border {
          0%, 100% { border-color: #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
          50% { border-color: #f59e0b; box-shadow: 0 0 40px rgba(245, 158, 11, 0.8); }
        }
        .bonus-box {
          animation: flash-border 1s infinite alternate;
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .urgent-timer {
          animation: heartbeat 1s infinite;
          color: #ef4444;
        }
      `}</style>
      
      {!accepted ? (
        <div className="bg-slate-900 border-4 rounded-2xl p-8 max-w-lg w-full text-center bonus-box relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
          
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-2 uppercase italic tracking-wider">
            Bonus Round!
          </h2>
          
          <p className="text-xl text-slate-200 mb-6 font-semibold">
            Solve the next challenge in <span className="text-amber-400">{timeLimit} seconds</span> for <span className="text-amber-400 font-bold">{multiplier}x XP!</span>
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-4 rounded-xl text-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] transform hover:scale-105 transition-all"
            >
              ACCEPT
            </button>
            <button 
              onClick={onSkip}
              className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900/90 border border-red-500/50 rounded-full px-8 py-3 flex items-center gap-4 shadow-[0_0_20px_rgba(239,68,68,0.3)] z-50">
          <span className="text-red-500 font-bold animate-pulse">BONUS ROUND ACTIVE</span>
          <div className={`text-3xl font-mono font-bold \${timeLeft <= 10 ? 'urgent-timer' : 'text-amber-400'}`}>
            00:{(timeLeft < 10 ? '0' : '') + timeLeft}
          </div>
        </div>
      )}
    </div>
  );
};
