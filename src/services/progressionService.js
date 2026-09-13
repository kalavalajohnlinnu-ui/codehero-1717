// ============================================================================
// CodeHero Universe 2.0 — Simple & Clear Learning Unlock Progression
// Plain English progression conditions so learners only get challenges they have
// actually learned the tools to solve!
// ============================================================================

export const MODE_UNLOCK_CRITERIA = {
  lessons: {
    id: 'lessons',
    name: 'Lessons',
    requiredQuests: 0,
    badge: 'Always Open',
    reason: 'Learn step-by-step from zero with interactive practice.',
    description: 'Start here! Learn coding one simple step at a time.'
  },
  speed: {
    id: 'speed',
    name: 'Speed Practice',
    requiredQuests: 5,
    badge: '5 Lessons',
    reason: 'Practice typing simple code fast once you know basic variables and print statements.',
    description: 'Race the 60-second timer to type and run short code fast. Builds finger muscle memory!'
  },
  bugs: {
    id: 'bugs',
    name: 'Find & Fix Bugs',
    requiredQuests: 10,
    badge: '10 Lessons',
    reason: 'Requires knowing variables, numbers, text, and if/else decisions to spot mistakes.',
    description: 'Look at broken code, find what went wrong, and fix it like a detective.'
  },
  arena: {
    id: 'arena',
    name: 'Coding Puzzles (Algorithms)',
    requiredQuests: 20,
    badge: '20 Lessons',
    reason: 'Requires knowing loops (for/while) and lists/arrays so you have the tools to solve puzzles!',
    description: 'Solve fun logic puzzles (like finding the biggest number, reversing words, or counting items).'
  },
  projects: {
    id: 'projects',
    name: 'Build Real Projects',
    requiredQuests: 25,
    badge: '25 Lessons',
    reason: 'Requires knowing functions, loops, and data so you can build a complete working app.',
    description: 'Build complete apps step-by-step (like a calculator, quiz game, or counter).'
  },
  oracle: {
    id: 'oracle',
    name: 'Ask Questions & Help',
    requiredQuests: 0,
    badge: 'Always Open',
    reason: 'Always open so you can ask questions and look up help anytime.',
    description: 'Ask any coding question, get simple explanations, and view easy cheat sheets.'
  }
};

export const progressionService = {
  // Check if a mode is unlocked for a given language
  isModeUnlocked(modeId, languageId, completedCount = 0) {
    const criteria = MODE_UNLOCK_CRITERIA[modeId];
    if (!criteria) return true;
    if (criteria.requiredQuests === 0) return true;

    // Check if user clicked bypass
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

  // Get remaining lessons needed to unlock
  getQuestsNeeded(modeId, completedCount = 0) {
    const criteria = MODE_UNLOCK_CRITERIA[modeId];
    if (!criteria) return 0;
    return Math.max(0, criteria.requiredQuests - completedCount);
  },

  // Bypass locks for advanced users who already know how to code
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
