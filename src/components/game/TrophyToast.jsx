import React, { useEffect } from 'react';

export const TrophyToast = ({ achievements, onDismiss }) => {
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievements, onDismiss]);

  if (!achievements || achievements.length === 0) return null;

  const current = achievements[0];

  return (
    <div className="fixed top-20 right-4 z-[90]">
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(120%); opacity: 0; }
          15% { transform: translateX(-5%); opacity: 1; }
          20% { transform: translateX(0); opacity: 1; }
          85% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        .toast-animate {
          animation: slide-in-right 4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes shimmer-border {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .shimmer-wrapper {
          background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24, #f59e0b);
          background-size: 200% auto;
          animation: shimmer-border 2s linear infinite;
          padding: 3px;
          border-radius: 1rem;
        }
      `}</style>
      
      <div className="toast-animate shimmer-wrapper shadow-2xl cursor-pointer" onClick={onDismiss}>
        <div className="bg-slate-900 rounded-[14px] p-4 pr-6 flex items-center max-w-sm w-80 relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="flex-shrink-0 w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/40 mr-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="text-3xl drop-shadow-md">{current.icon || '🏆'}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">Achievement Unlocked</span>
            <span className="text-white font-bold text-lg leading-tight mb-1">{current.name}</span>
            <span className="text-slate-400 text-xs leading-snug">{current.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
