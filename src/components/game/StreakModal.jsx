import React from 'react';
import { X, Flame, Sparkles } from 'lucide-react';
import { soundService } from '../../services/soundService';

export const StreakModal = ({ streakDays, bonusXP, onClose }) => {
  React.useEffect(() => {
    soundService.playFanfare();
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-amber-300 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

        {/* Large Accessible Cross / Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all shadow-sm"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Flame Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-500 mx-auto flex items-center justify-center mb-4 shadow-xl shadow-amber-500/15">
          <span className="text-5xl animate-bounce">🔥</span>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2 uppercase tracking-wide">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Milestone Achieved!</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">
          {streakDays} Day Streak!
        </h2>
        
        <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
          You're on fire! Consistency builds technical mastery. Claim your loyalty bonus below.
        </p>
        
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="text-left">
            <span className="block text-amber-800 text-xs font-bold uppercase tracking-wider">Milestone Reward</span>
            <span className="text-xs text-slate-500 font-medium">Automatic XP credit</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono font-black text-2xl text-amber-600">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <span>+{bonusXP} XP</span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.97] text-white font-bold rounded-xl text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
        >
          <span>Claim Bonus &amp; Continue 🔥</span>
        </button>
      </div>
    </div>
  );
};
