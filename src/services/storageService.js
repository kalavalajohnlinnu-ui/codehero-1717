// Persistent Storage Service for CodeHero Universe
import { authService } from './authService';

const LEGACY_STORAGE_KEY_V2 = 'codehero_universe_state_v2';
const LEGACY_STORAGE_KEY_V1 = 'python_mastery_state_v1';

const getActiveStorageKey = () => authService.getStudentStorageKey('state_v3');
const getStudyPlanStorageKey = () => authService.getStudentStorageKey('study_plan_v1');

const DEFAULT_SANDBOX_BY_LANG = {
  python: `# Python Sandbox: Test anything you like!
import math

print("=== Python Sandbox Ready ===")
radius = 5
area = math.pi * (radius ** 2)
print(f"Area of circle with radius {radius} is {area:.2f}")
`,
  javascript: `// JavaScript & TypeScript Playground
console.log("=== JavaScript Sandbox Ready ⚡ ===");

const heroes = ["Aria", "Leo", "Kael"];
heroes.forEach((hero, index) => {
  console.log("Hero #" + (index + 1) + ": " + hero);
});
`,
  html: `<!-- HTML & CSS Live Studio -->
<div style="font-family: system-ui, sans-serif; padding: 24px; text-align: center; background: linear-gradient(135deg, #1e1b4b, #312e81); color: white; border-radius: 16px;">
  <h1 style="color: #38bdf8; margin-bottom: 8px;">🎨 Live Web Sandbox</h1>
  <p style="color: #cbd5e1;">Edit HTML and styles here and see instant live updates!</p>
  <button style="background: #ec4899; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 14px rgba(236,72,153,0.4);">
    Magic Button ✨
  </button>
</div>
`,
  sql: `-- SQL Relational Query Studio
-- Available tables: heroes, inventory
SELECT name, class, level, power 
FROM heroes 
WHERE level >= 10;
`,
  c: `// C & C++ Simulator
#include <stdio.h>

int main() {
    printf("=== Welcome to C Programming! ⚙️ ===\\n");
    int level = 5;
    int health = 100;
    printf("Hero Stats: Level %d | HP: %d\\n", level, health);
    return 0;
}
`,
  java: `// Java Hero Studio
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Java Object Studio ☕ ===");
        int mana = 150;
        System.out.println("Current Hero Mana: " + mana);
    }
}
`,
  rust: `// Rust Fast & Safe Studio
fn main() {
    println!("=== Rust Memory Studio 🦀 ===");
    let hero = "Ferris";
    let speed = 99;
    println!("Hero {} running at speed {}!", hero, speed);
}
`
};

const DEFAULT_STATE = {
  currentLanguageId: 'python',
  totalXP: 0,
  streak: 1,
  lastVisitDate: new Date().toISOString().split('T')[0],
  completedByLanguage: {
    python: [],
    javascript: [],
    html: [],
    sql: [],
    c: [],
    java: [],
    rust: []
  },
  currentLessonByLanguage: {
    python: 'lesson-1',
    javascript: 'js-lesson-1',
    html: 'html-lesson-1',
    sql: 'sql-lesson-1',
    c: 'c-lesson-1',
    java: 'java-lesson-1',
    rust: 'rust-lesson-1'
  },
  codeDrafts: {},
  sandboxByLanguage: DEFAULT_SANDBOX_BY_LANG
};

export const storageService = {
  loadState() {
    try {
      const activeKey = getActiveStorageKey();
      let data = localStorage.getItem(activeKey);
      let parsed = null;

      if (!data) {
        // Check legacy keys for migration into this student's profile
        const legacyDataV2 = localStorage.getItem(LEGACY_STORAGE_KEY_V2);
        const legacyDataV1 = localStorage.getItem(LEGACY_STORAGE_KEY_V1);
        const sourceData = legacyDataV2 || legacyDataV1;

        if (sourceData) {
          try {
            const legacyParsed = JSON.parse(sourceData);
            parsed = {
              ...DEFAULT_STATE,
              totalXP: legacyParsed.totalXP || 0,
              streak: legacyParsed.streak || 1,
              completedByLanguage: {
                ...DEFAULT_STATE.completedByLanguage,
                ...(legacyParsed.completedByLanguage || { python: legacyParsed.completedLessons || [] })
              },
              currentLessonByLanguage: {
                ...DEFAULT_STATE.currentLessonByLanguage,
                ...(legacyParsed.currentLessonByLanguage || { python: legacyParsed.currentLessonId || 'lesson-1' })
              },
              codeDrafts: legacyParsed.codeDrafts || {}
            };
            this.saveState(parsed);
          } catch (e) {
            console.error("Migration error:", e);
          }
        }
      } else {
        parsed = JSON.parse(data);
      }

      if (!parsed) parsed = DEFAULT_STATE;

      // Check daily streak
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastVisitDate) {
        const lastDate = new Date(parsed.lastVisitDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          parsed.streak = (parsed.streak || 0) + 1;
        } else if (diffDays > 1) {
          parsed.streak = 1;
        }
      }
      parsed.lastVisitDate = today;

      // Ensure nested fields exist
      parsed.completedByLanguage = parsed.completedByLanguage || DEFAULT_STATE.completedByLanguage;
      parsed.currentLessonByLanguage = parsed.currentLessonByLanguage || DEFAULT_STATE.currentLessonByLanguage;
      parsed.sandboxByLanguage = { ...DEFAULT_SANDBOX_BY_LANG, ...(parsed.sandboxByLanguage || {}) };

      return { ...DEFAULT_STATE, ...parsed };
    } catch (e) {
      console.error("Failed to load progress state:", e);
      return DEFAULT_STATE;
    }
  },

  saveState(state) {
    try {
      const activeKey = getActiveStorageKey();
      localStorage.setItem(activeKey, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save progress state:", e);
    }
  },

  // Study Plan Persistence (per student)
  saveStudyPlan(planData) {
    try {
      const key = getStudyPlanStorageKey();
      localStorage.setItem(key, JSON.stringify(planData));
    } catch (e) {
      console.error("Failed to save study plan:", e);
    }
  },

  getStudyPlan() {
    try {
      const key = getStudyPlanStorageKey();
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Failed to load study plan:", e);
      return null;
    }
  },

  markLessonComplete(languageId, lessonId, xpAward = 25) {
    const state = this.loadState();
    const langList = state.completedByLanguage[languageId] || [];
    
    if (!langList.includes(lessonId)) {
      langList.push(lessonId);
      state.completedByLanguage[languageId] = langList;
      state.totalXP = (state.totalXP || 0) + xpAward;
      this.saveState(state);
      return { 
        isNewCompletion: true, 
        newXP: state.totalXP, 
        totalCompletedInLang: langList.length,
        completedByLanguage: state.completedByLanguage
      };
    }

    return { 
      isNewCompletion: false, 
      newXP: state.totalXP, 
      totalCompletedInLang: langList.length,
      completedByLanguage: state.completedByLanguage
    };
  },

  saveCurrentLessonId(languageId, lessonId) {
    const state = this.loadState();
    state.currentLessonByLanguage = state.currentLessonByLanguage || {};
    state.currentLessonByLanguage[languageId] = lessonId;
    this.saveState(state);
  },

  getCurrentLessonId(languageId, fallbackId) {
    const state = this.loadState();
    return (state.currentLessonByLanguage && state.currentLessonByLanguage[languageId]) || fallbackId;
  },

  saveLessonDraft(lessonId, code) {
    const state = this.loadState();
    state.codeDrafts = state.codeDrafts || {};
    state.codeDrafts[lessonId] = code;
    this.saveState(state);
  },

  getLessonDraft(lessonId, defaultCode) {
    const state = this.loadState();
    if (state.codeDrafts && state.codeDrafts[lessonId] !== undefined) {
      return state.codeDrafts[lessonId];
    }
    return defaultCode;
  },

  saveSandboxCode(languageId, code) {
    const state = this.loadState();
    state.sandboxByLanguage = state.sandboxByLanguage || {};
    state.sandboxByLanguage[languageId] = code;
    this.saveState(state);
  },

  getSandboxCode(languageId) {
    const state = this.loadState();
    if (state.sandboxByLanguage && state.sandboxByLanguage[languageId]) {
      return state.sandboxByLanguage[languageId];
    }
    return DEFAULT_SANDBOX_BY_LANG[languageId] || DEFAULT_SANDBOX_BY_LANG.python;
  },

  resetLanguageProgress(languageId) {
    const state = this.loadState();
    if (state.completedByLanguage && state.completedByLanguage[languageId]) {
      state.completedByLanguage[languageId] = [];
    }
    this.saveState(state);
    return state;
  },

  resetAllProgress() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return DEFAULT_STATE;
  }
};
