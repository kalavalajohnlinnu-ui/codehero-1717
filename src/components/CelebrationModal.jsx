import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { soundService } from '../services/soundService';

export function CelebrationModal({
  isOpen,
  lessonTitle,
  xpGained,
  onNextLesson,
  onClose,
  nextLessonTitle,
  nextLessonHook
}) {
  useEffect(() => {
    if (isOpen) {
      soundService.playSuccess();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sky-100 rounded-full blur-3xl pointer-events-none" />

        {/* Checkmark Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-500 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8 animate-bounce" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Challenge Mastered!</span>
        </div>

        <h3 className="text-xl font-bold font-sans text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Outstanding Work!
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-sans">
          You solved: <span className="text-slate-800 font-medium">{lessonTitle}</span>
        </p>

        {/* Reward Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center justify-around">
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">XP Award</div>
            <div className="text-lg font-bold font-mono text-sky-500 flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>+{xpGained || 25} XP</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Tests Verified</div>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
              100% Passed
            </div>
          </div>
        </div>

        {/* NEXT QUEST CLIFFHANGER */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">🔮</div>
          <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1.5 font-sans">
            <span>🔮</span> Coming Up Next...
          </h4>
          <p className="text-sm font-bold text-slate-800 mb-1 font-sans">
            {nextLessonTitle || "The Next Challenge"}
          </p>
          <p className="text-xs text-slate-600 italic mb-3 font-sans">
            {nextLessonHook || "Are you ready to level up your skills?"}
          </p>
          
          <button
            onClick={() => {
              onClose();
              if (onNextLesson) onNextLesson();
            }}
            className="w-full py-2.5 px-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.97] rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
          >
            <span>→ Continue Now</span>
          </button>
        </div>

        {/* Actions */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 active:scale-[0.97] rounded-xl transition-colors"
          >
            Review Code
          </button>
        </div>
      </div>
    </div>
  );
}
