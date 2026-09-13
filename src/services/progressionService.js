// ============================================================================
// CodeHero Universe 2.0 — Per-Language Mode Unlock Progression System
// Defines progression gating for game modes based on language quest count
// ============================================================================

export const MODE_UNLOCK_CRITERIA = {
  lessons: {
    id: 'lessons',
    name: 'Core Quests',
    requiredQuests: 0,
    badge: 'Always Open',
    description: 'The foundation of your journey. Master 631 quests step-by-step.'
  },
  arena: {
    id: 'arena',
    name: 'Algorithm Arena',
    requiredQuests: 3,
    badge: '3 Quests',
    description: 'Solve 80 LeetCode-style algorithm challenges. Requires core syntax basics.'
  },
  bugs: {
    id: 'bugs',
    name: 'Bug Detective',
    requiredQuests: 7,
    badge: '7 Quests',
    description: 'Hunt and fix intentional bugs in broken code. Requires debugging intuition.'
  },
  speed: {
    id: 'speed',
    name: 'Speed Sprint',
    requiredQuests: 12,
    badge: '12 Quests',
    description: 'Race against the clock in 60s timed battles. Requires fluent typing speed.'
  },
  projects: {
    id: 'projects',
    name: 'Project Lab',
    requiredQuests: 18,
    badge: '18 Quests',
    description: 'Build 15 real-world applications from scratch. Requires multi-module mastery.'
  },
  oracle: {
    id: 'oracle',
    name: 'Language Oracle & AI Hub',
    requiredQuests: 0,
    badge: 'Always Open',
    description: 'Deep language dossiers, traps, and external AI prompt forge.'
  }
};

export const progressionService = {
  // Check if a mode is unlocked for a given language
  isModeUnlocked(modeId, languageId, completedCount = 0) {
    const criteria = MODE_UNLOCK_CRITERIA[modeId];
    if (!criteria) return true;
    if (criteria.requiredQuests === 0) return true;

    // Check if user bypassed locks in localStorage
    const bypass = localStorage.getItem(`bypass_locks_${languageId}`);
    if (bypass === 'true') return true;

    return completedCount >= criteria.requiredQuests;
  },

  // Get unlock progress percentage (0 - 100)
  getUnlockProgress(modeId, completedCount = 0) {
    const criteria = MODE_UNLOCK_CRITERIA[modeId];
    if (!criteria || criteria.requiredQuests === 0) return 100;
    return Math.min(100, Math.round((completedCount / criteria.requiredQuests) * 100));
  },

  // Get remaining quests needed to unlock
  getQuestsNeeded(modeId, completedCount = 0) {
    const criteria = MODE_UNLOCK_CRITERIA[modeId];
    if (!criteria) return 0;
    return Math.max(0, criteria.requiredQuests - completedCount);
  },

  // Bypass locks for advanced users
  setBypassLocks(languageId, enable = true) {
    if (enable) {
      localStorage.setItem(`bypass_locks_${languageId}`, 'true');
    } else {
      localStorage.removeItem(`bypass_locks_${languageId}`);
    }
  },

  isBypassed(languageId) {
    return localStorage.getItem(`bypass_locks_${languageId}`) === 'true';
  }
};
