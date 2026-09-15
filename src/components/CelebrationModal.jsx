import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, X, ArrowRight, Trophy, Flame, ShieldCheck } from 'lucide-react';
import { soundService } from '../services/soundService';

export function CelebrationModal({
  isOpen,
  lessonTitle,
  xpGained = 25,
  onNextLesson,
  onClose,
  nextLessonTitle,
  nextLessonHook
}) {
  useEffect(() => {
    if (isOpen) {
      soundService.playFanfare();
      
      // Multi-stage celebratory confetti explosion
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 1000
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#FCD34D', '#F59E0B', '#FFFFFF']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#38BDF8', '#0284C7', '#FCD34D']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#10B981', '#34D399', '#FCD34D']
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ['#FCD34D', '#F43F5E', '#A855F7']
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
        colors: ['#FFFFFF', '#FCD34D', '#38BDF8']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="bg-[#0B0F19]/98 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-[0_0_60px_rgba(252,211,77,0.22)] relative overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Background radial ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-amber-500/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20"
          title="Close celebration"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Golden Crest Emblem */}
        <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#FCD34D]/20 rounded-2xl rotate-6 blur-md animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FCD34D] via-[#F59E0B] to-[#B45309] p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[#FCD34D] animate-bounce" />
            </div>
          </div>
        </div>

        {/* Eyebrow & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] bg-amber-400/15 text-[#FCD34D] border border-amber-400/30 mb-2.5">
          <Sparkles className="w-3 h-3 text-[#FCD34D]" />
          <span>QUEST CONQUERED</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mb-1.5">
          Outstanding Work!
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-sm mx-auto font-medium">
          You mastered: <span className="text-[#FCD34D] font-bold">{lessonTitle}</span>
        </p>

        {/* Telemetry Reward Grid */}
        <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-5 text-center">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">XP AWARD</div>
            <div className="text-base sm:text-lg font-mono font-black text-[#FCD34D] mt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{xpGained || 25} XP</span>
            </div>
          </div>
          <div className="border-x border-white/10 px-1">
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">TESTS</div>
            <div className="text-base sm:text-lg font-mono font-black text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100%</span>
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">STREAK</div>
            <div className="text-base sm:text-lg font-mono font-black text-orange-400 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>ACTIVE</span>
            </div>
          </div>
        </div>

        {/* NEXT QUEST CLIFFHANGER */}
        <div className="rounded-2xl p-4 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 text-left relative overflow-hidden mb-4 shadow-xl">
          <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#FCD34D] mb-1 flex items-center gap-1.5">
            <span>🔮</span>
            <span>NEXT UPCOMING CHALLENGE</span>
          </div>
          <p className="text-sm font-black text-white mb-1">
            {nextLessonTitle || "The Next Frontier"}
          </p>
          <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {nextLessonHook || "Continue forging your coding mastery. Ready for the next quest?"}
          </p>
          
          <button
            onClick={() => {
              onClose();
              if (onNextLesson) onNextLesson();
            }}
            className="w-full py-3 px-4 text-xs sm:text-sm font-black text-slate-950 bg-[#FCD34D] hover:bg-[#FACC15] active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 cursor-pointer touch-manipulation"
          >
            <span>Continue to Next Quest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action: Practice Drills / Review Code */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-mono font-bold text-slate-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/15 active:scale-[0.98] rounded-xl transition-colors cursor-pointer touch-manipulation"
          >
            Explore Practice Variations & Review Code
          </button>
        </div>

      </div>
    </div>
  );
}

export default CelebrationModal;
