import React from 'react';
import { Lock, Unlock, ArrowRight, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white border border-amber-300 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl flex flex-col text-slate-900 text-center relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto mb-3 shadow-sm">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
          {criteria.name} is Locked
        </h3>

        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
          {criteria.reason || `You need to finish earlier lessons first so you have the skills to solve these!` }
        </p>

        {/* Progress Card */}
        <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Unlock Condition:</span>
            <span className="text-amber-700 font-bold">Finish {criteria.requiredQuests} Lessons in {languageName}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Your Progress:</span>
            <span className="text-slate-800 font-bold">{completedCount} of {criteria.requiredQuests} Lessons</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 border border-slate-300 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] text-amber-700 font-mono text-center pt-1 font-bold">
            {questsNeeded > 0 ? `Complete ${questsNeeded} more lesson${questsNeeded > 1 ? 's' : ''} to unlock!` : 'Ready to unlock!'}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1 font-sans">
          <button
            onClick={() => {
              soundService.playClick();
              if (onGoToQuests) onGoToQuests();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
          >
            <span>Continue {languageName} Lessons →</span>
          </button>

          <button
            onClick={handleBypass}
            className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 text-[11px] font-mono transition-colors active:scale-[0.97] flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-3 h-3 text-slate-400" />
            <span>I already know how to code (Unlock now)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
