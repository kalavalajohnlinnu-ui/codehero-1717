import React from 'react';
import { Lock, Unlock, ArrowRight, X, ShieldAlert, Sparkles } from 'lucide-react';
import { MODE_UNLOCK_CRITERIA, progressionService } from '../services/progressionService';
import { soundService } from '../services/soundService';

export function ModeLockedModal({
  isOpen,
  onClose,
  modeId,
  languageId = 'python',
  languageName = 'Python',
  completedCount = 0,
  onGoToQuests,
  onUnlockAnyway
}) {
  if (!isOpen) return null;

  const criteria = MODE_UNLOCK_CRITERIA[modeId] || {
    name: 'Game Mode',
    requiredQuests: 5,
    description: 'Complete more quests to unlock this arena.'
  };

  const questsNeeded = progressionService.getQuestsNeeded(modeId, completedCount);
  const progressPercent = progressionService.getUnlockProgress(modeId, completedCount);

  const handleBypass = () => {
    soundService.playMagic();
    progressionService.setBypassLocks(languageId, true);
    if (onUnlockAnyway) onUnlockAnyway(modeId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#0A0D15] border border-amber-500/30 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl flex flex-col text-slate-200 text-center relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-lg shadow-amber-500/10">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {criteria.name} is Locked
        </h3>

        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
          To maintain step-by-step mastery, this mode unlocks as you progress through <strong className="text-white">{languageName}</strong> quests.
        </p>

        {/* Progress Card */}
        <div className="my-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Unlock Condition:</span>
            <span className="text-amber-300 font-bold">{criteria.requiredQuests} Quests in {languageName}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Your Current Progress:</span>
            <span className="text-white font-bold">{completedCount} / {criteria.requiredQuests}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/50 border border-white/10 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] text-amber-400 font-mono text-center pt-1">
            {questsNeeded > 0 ? `Complete ${questsNeeded} more quest${questsNeeded > 1 ? 's' : ''} to unlock!` : 'Ready to unlock!'}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              soundService.playClick();
              if (onGoToQuests) onGoToQuests();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>Continue {languageName} Quests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleBypass}
            className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-slate-200 text-[11px] font-mono transition-colors flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-3 h-3 text-slate-500" />
            <span>I'm an Experienced Dev (Unlock Mode Now)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
