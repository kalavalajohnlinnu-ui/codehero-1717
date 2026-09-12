import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

export function CelebrationModal({
  isOpen,
  lessonTitle,
  xpGained,
  onNextLesson,
  onClose
}) {
  useEffect(() => {
    if (isOpen) {
      // Launch celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#facc15', '#10b981', '#a855f7']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Challenge Mastered!</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Outstanding Work!
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          You successfully solved <span className="text-slate-200 font-medium">{lessonTitle}</span>.
        </p>

        {/* Reward Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-around">
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">XP Award</div>
            <div className="text-lg font-bold font-mono text-sky-400 flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+{xpGained || 25} XP</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Tests Verified</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              100% Passed
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
          >
            Review Code
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNextLesson) onNextLesson();
            }}
            className="w-full sm:w-1/2 py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-emerald-400 hover:opacity-90 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
