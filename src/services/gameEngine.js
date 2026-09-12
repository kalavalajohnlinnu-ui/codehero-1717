// ============================================================
// CODEHERO GAME ENGINE — XP, Levels, Achievements, Combos
// ============================================================

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 4000, 7000, 12000, 20000,
  30000, 50000, 75000, 100000, 150000, 200000
];

export const LEVEL_NAMES = [
  'Newbie Noob', 'Code Seedling', 'Script Kiddo', 'Logic Learner',
  'Bug Slayer', 'Loop Lord', 'Function Fighter', 'Class Champion',
  'Algorithm Ace', 'Data Dynamo', 'Syntax Samurai', 'Memory Master',
  'Pointer Pro', 'Stack Sorcerer', 'Queue Commander', 'Code God 👑'
];

export const LEVEL_COLORS = [
  '#94a3b8', '#67e8f9', '#86efac', '#fbbf24',
  '#fb923c', '#f87171', '#c084fc', '#818cf8',
  '#38bdf8', '#34d399', '#facc15', '#f472b6',
  '#a78bfa', '#60a5fa', '#4ade80', '#fde68a'
];

export function getLevelFromXP(xp) {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i;
    else break;
  }
  return level;
}

export function getLevelProgress(xp) {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1];
  if (!nextThreshold) return { level, progress: 100, xpInLevel: 0, xpNeeded: 0, levelName: LEVEL_NAMES[level], color: LEVEL_COLORS[level] };
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  return {
    level,
    progress: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)),
    xpInLevel,
    xpNeeded,
    levelName: LEVEL_NAMES[level] || 'Code God 👑',
    color: LEVEL_COLORS[level] || '#fde68a',
    nextLevelName: LEVEL_NAMES[level + 1] || 'Code God 👑',
  };
}

// ============================================================
// XP REWARDS TABLE
// ============================================================
export const XP_REWARDS = {
  lessonComplete: 25,
  lessonFirstTry: 50,       // completed without hints
  lessonPerfect: 75,        // first try + no hints
  bugFixed: 40,
  algoEasy: 25,
  algoMedium: 50,
  algoHard: 100,
  algoLegendary: 200,
  speedChallenge: 60,
  projectStep: 30,
  projectComplete: 200,
  dailyLogin: 100,
  streak3: 150,
  streak7: 300,
  streak14: 500,
  streak30: 1000,
  comboBonus: (combo) => Math.floor(combo * 10),
};

// ============================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================
export const ACHIEVEMENTS = [
  // --- Beginner ---
  { id: 'ach-first-lesson', icon: '🎯', name: 'First Blood', description: 'Complete your first lesson!', trigger: 'lessons_completed', threshold: 1, xpBonus: 50, rarity: 'common' },
  { id: 'ach-first-bug',    icon: '🔍', name: 'Bug Hunter',  description: 'Fix your first bug in Debug mode!', trigger: 'bugs_fixed', threshold: 1, xpBonus: 50, rarity: 'common' },
  { id: 'ach-first-algo',   icon: '⚔️', name: 'Arena Debut', description: 'Solve your first algorithm!', trigger: 'algo_solved', threshold: 1, xpBonus: 75, rarity: 'common' },
  { id: 'ach-first-speed',  icon: '⚡', name: 'Speed Demon',  description: 'Complete your first timed challenge!', trigger: 'speed_challenges', threshold: 1, xpBonus: 50, rarity: 'common' },
  { id: 'ach-first-project',icon: '🏗️', name: 'Builder Born', description: 'Complete your first project step!', trigger: 'project_steps', threshold: 1, xpBonus: 75, rarity: 'common' },
  { id: 'ach-no-hints',     icon: '🧠', name: 'Big Brain',    description: 'Complete a lesson without any hints!', trigger: 'no_hint_lessons', threshold: 1, xpBonus: 100, rarity: 'rare' },
  // --- Progress ---
  { id: 'ach-10-lessons',   icon: '📚', name: 'Bookworm',     description: 'Complete 10 lessons!', trigger: 'lessons_completed', threshold: 10, xpBonus: 150, rarity: 'common' },
  { id: 'ach-25-lessons',   icon: '🎓', name: 'Scholar',      description: 'Complete 25 lessons!', trigger: 'lessons_completed', threshold: 25, xpBonus: 250, rarity: 'rare' },
  { id: 'ach-50-lessons',   icon: '🏆', name: 'Knowledge Seeker', description: 'Complete 50 lessons!', trigger: 'lessons_completed', threshold: 50, xpBonus: 500, rarity: 'rare' },
  { id: 'ach-100-lessons',  icon: '💎', name: 'Century Coder', description: '100 lessons completed! LEGENDARY!', trigger: 'lessons_completed', threshold: 100, xpBonus: 1000, rarity: 'epic' },
  { id: 'ach-250-lessons',  icon: '👑', name: 'Code Royalty', description: '250 lessons! Truly elite.', trigger: 'lessons_completed', threshold: 250, xpBonus: 2500, rarity: 'legendary' },
  { id: 'ach-10-bugs',      icon: '🐛', name: 'Exterminator', description: 'Fix 10 bugs!', trigger: 'bugs_fixed', threshold: 10, xpBonus: 200, rarity: 'rare' },
  { id: 'ach-25-bugs',      icon: '🔬', name: 'Bug Scientist', description: 'Fix 25 bugs!', trigger: 'bugs_fixed', threshold: 25, xpBonus: 400, rarity: 'epic' },
  { id: 'ach-10-algo',      icon: '🗡️', name: 'Arena Warrior', description: 'Solve 10 algorithm challenges!', trigger: 'algo_solved', threshold: 10, xpBonus: 300, rarity: 'rare' },
  { id: 'ach-50-algo',      icon: '⚔️', name: 'Arena Champion', description: 'Solve 50 algorithm challenges!', trigger: 'algo_solved', threshold: 50, xpBonus: 750, rarity: 'epic' },
  { id: 'ach-100-algo',     icon: '🏛️', name: 'Algorithm God', description: 'Solved 100 algorithm challenges!', trigger: 'algo_solved', threshold: 100, xpBonus: 2000, rarity: 'legendary' },
  // --- Streaks ---
  { id: 'ach-streak-3',   icon: '🔥', name: '3-Day Flame',  description: '3 days coding streak!', trigger: 'streak_days', threshold: 3, xpBonus: 150, rarity: 'common' },
  { id: 'ach-streak-7',   icon: '🔥', name: 'Week Warrior', description: '7-day streak! One full week!', trigger: 'streak_days', threshold: 7, xpBonus: 300, rarity: 'rare' },
  { id: 'ach-streak-14',  icon: '🌟', name: 'Two-Week Titan', description: '14 days coding every single day!', trigger: 'streak_days', threshold: 14, xpBonus: 600, rarity: 'epic' },
  { id: 'ach-streak-30',  icon: '⚡', name: 'Month Master', description: '30 day streak! Absolutely insane!', trigger: 'streak_days', threshold: 30, xpBonus: 1500, rarity: 'legendary' },
  // --- Skill ---
  { id: 'ach-combo-5',    icon: '💥', name: 'Combo King',   description: 'Hit a 5-lesson combo!', trigger: 'max_combo', threshold: 5, xpBonus: 200, rarity: 'rare' },
  { id: 'ach-combo-10',   icon: '🌀', name: 'Unstoppable',  description: 'Hit a 10-lesson combo!', trigger: 'max_combo', threshold: 10, xpBonus: 500, rarity: 'epic' },
  { id: 'ach-speed-5',    icon: '🏎️', name: 'Speed Racer',  description: 'Complete 5 speed challenges!', trigger: 'speed_challenges', threshold: 5, xpBonus: 200, rarity: 'rare' },
  { id: 'ach-project-1',  icon: '🏗️', name: 'First Build',  description: 'Complete your first full project!', trigger: 'projects_completed', threshold: 1, xpBonus: 500, rarity: 'rare' },
  { id: 'ach-project-5',  icon: '🏙️', name: 'Builder Pro',  description: 'Complete 5 full projects!', trigger: 'projects_completed', threshold: 5, xpBonus: 1000, rarity: 'epic' },
  { id: 'ach-2-langs',    icon: '🌐', name: 'Bilingual',    description: 'Learn in 2 different languages!', trigger: 'languages_tried', threshold: 2, xpBonus: 200, rarity: 'rare' },
  { id: 'ach-5-langs',    icon: '🌍', name: 'Polyglot',     description: 'Learn in 5 different languages!', trigger: 'languages_tried', threshold: 5, xpBonus: 750, rarity: 'epic' },
  { id: 'ach-7-langs',    icon: '🌌', name: 'Code Linguist', description: 'Learn ALL 7 languages!', trigger: 'languages_tried', threshold: 7, xpBonus: 2000, rarity: 'legendary' },
  // --- Level milestones ---
  { id: 'ach-level-5',    icon: '⭐', name: 'Leveled Up!',  description: 'Reached Level 5: Bug Slayer!', trigger: 'level_reached', threshold: 5, xpBonus: 300, rarity: 'rare' },
  { id: 'ach-level-10',   icon: '🌟', name: 'Double Digits', description: 'Reached Level 10: Syntax Samurai!', trigger: 'level_reached', threshold: 10, xpBonus: 750, rarity: 'epic' },
  { id: 'ach-level-15',   icon: '👑', name: 'Almost God',   description: 'Reached Level 15: Code Oracle!', trigger: 'level_reached', threshold: 15, xpBonus: 2000, rarity: 'legendary' },
];

// ============================================================
// CHECK ACHIEVEMENTS (call after any action)
// ============================================================
export function checkAchievements(gameStats, previouslyUnlocked) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (previouslyUnlocked.includes(ach.id)) continue;
    const val = gameStats[ach.trigger] || 0;
    if (val >= ach.threshold) {
      newlyUnlocked.push(ach);
    }
  }
  return newlyUnlocked;
}

// ============================================================
// GAME STATS (stored in localStorage)
// ============================================================
const GAME_KEY = 'codehero_game_v3';

export function loadGameStats() {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    xp: 0,
    streak_days: 1,
    last_login_date: null,
    lessons_completed: 0,
    bugs_fixed: 0,
    algo_solved: 0,
    speed_challenges: 0,
    project_steps: 0,
    projects_completed: 0,
    no_hint_lessons: 0,
    languages_tried: 0,
    languages_seen: [],
    max_combo: 0,
    level_reached: 0,
    daily_claimed_date: null,
    unlocked_achievements: [],
    perfect_lessons: 0,
  };
}

export function saveGameStats(stats) {
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify(stats));
  } catch (_) {}
}

export function updateStreak(stats) {
  const today = new Date().toDateString();
  if (stats.last_login_date === today) return stats; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = stats.last_login_date === yesterday ? (stats.streak_days || 1) + 1 : 1;
  return { ...stats, streak_days: newStreak, last_login_date: today };
}

export function isDailyRewardAvailable(stats) {
  const today = new Date().toDateString();
  return stats.daily_claimed_date !== today;
}

export function claimDailyReward(stats) {
  const today = new Date().toDateString();
  return { ...stats, daily_claimed_date: today, xp: (stats.xp || 0) + 100 };
}
