import React, { useState, useEffect } from 'react';
import { X, Zap, Clock } from 'lucide-react';
import { soundService } from '../../services/soundService';

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
    soundService.playMagic();
    setAccepted(true);
    onAccept();
  };

  const handleClose = () => {
    soundService.playClick();
    onSkip();
  };

  // When accepted, only render the floating non-blocking timer HUD at the top!
  if (accepted) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto animate-bounce-short">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border-2 border-amber-400 shadow-xl shadow-amber-500/20 text-slate-900">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
            <Zap className="w-4 h-4 fill-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider">
              {multiplier}× XP Bonus Active!
            </span>
            <span className="text-xs text-slate-500 font-sans">Solve the quest before time expires</span>
          </div>
          <div className={`font-mono font-black text-xl px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 ${
            timeLeft <= 10 ? 'text-red-600 animate-pulse bg-red-50 border-red-200' : 'text-amber-700'
          }`}>
            00:{(timeLeft < 10 ? '0' : '') + timeLeft}
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all ml-1 active:scale-95"
            title="Cancel Bonus Round"
            aria-label="Cancel Bonus Round"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Pre-accept invitation modal (Clean light theme)
  return (
    <div 
      className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-white border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative shadow-2xl overflow-hidden animate-cinematic-page"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

        {/* Big accessible Cross / Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all shadow-sm"
          title="Dismiss"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-500 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
          <Zap className="w-8 h-8 fill-amber-400 text-amber-500 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2 uppercase tracking-wide">
          <Clock className="w-3.5 h-3.5" />
          <span>Surprise Challenge!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
          ⚡ Bonus Speed Quest!
        </h2>
        
        <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
          Solve the next coding mission in <span className="font-bold text-amber-600">{timeLimit} seconds</span> to claim a massive <span className="font-bold text-amber-600">{multiplier}× XP Multiplier</span>!
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={handleAccept}
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.97] text-white font-bold rounded-xl text-base shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Accept Quest!</span>
          </button>
          <button 
            onClick={handleClose}
            className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.97] text-slate-600 font-semibold rounded-xl text-sm transition-all"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
