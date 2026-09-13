// Study Plan Generation Service for CodeHero Universe
// Calculates "When to do, What to do, How to do" day-by-day timetable

export const STUDY_PRESETS = [
  { days: 15, label: '15-Day Bootcamp Sprint', desc: 'Intensive fast-track pace for quick mastery', badge: '⚡ High Intensity' },
  { days: 30, label: '30-Day Complete Course', desc: 'The gold standard 1-month recommended pace', badge: '⭐ Recommended' },
  { days: 60, label: '60-Day Balanced Mastery', desc: 'Thorough, relaxed pace with built-in revision days', badge: '🎯 Thorough' },
  { days: 90, label: '90-Day Deep Foundation', desc: 'Comprehensive mastery from absolute basics to advanced algorithms', badge: '🏛️ Deep Mastery' }
];

export const DAILY_HOURS_PRESETS = [
  { hours: 0.5, label: '30 Minutes / Day', desc: 'Light, consistent daily habit' },
  { hours: 1, label: '1 Hour / Day (Recommended)', desc: 'Optimal balance of theory and coding' },
  { hours: 2, label: '2 Hours / Day', desc: 'Deep dive with extra debugging and speed practice' },
  { hours: 3, label: '3 Hours / Day', desc: 'Maximum speed immersion' }
];

export function generateDailyTimeBreakdown(hours) {
  if (hours <= 0.5) {
    return [
      { time: '00:00 - 00:08 (8 min)', activity: 'Read Concept & Memory Model Analogy' },
      { time: '00:08 - 00:23 (15 min)', activity: 'Hands-On Code Editor Practice' },
      { time: '00:23 - 00:30 (7 min)', activity: 'Run Unit Tests & Self-Correction' }
    ];
  } else if (hours <= 1) {
    return [
      { time: '00:00 - 00:15 (15 min)', activity: 'Read Concepts, Syntax Rules & Pitfalls' },
      { time: '00:15 - 00:45 (30 min)', activity: 'Write and Test Code in Editor (No Hints)' },
      { time: '00:45 - 00:55 (10 min)', activity: 'Speed Practice / Bug Debugging Drill' },
      { time: '00:55 - 01:00 (5 min)', activity: 'Review Digital Notes & Download Checkpoint' }
    ];
  } else if (hours <= 2) {
    return [
      { time: '00:00 - 00:25 (25 min)', activity: 'Deep Conceptual Review & Memory Architecture' },
      { time: '00:25 - 01:15 (50 min)', activity: 'Solve Assigned Quests & Coding Exercises' },
      { time: '01:15 - 01:45 (30 min)', activity: 'Algorithm Puzzle or Bug Detective Case' },
      { time: '01:45 - 02:00 (15 min)', activity: 'Write Personal Notes & Take Module Mini-Quiz' }
    ];
  } else {
    return [
      { time: '00:00 - 00:35 (35 min)', activity: 'Core Theory, Official Docs & Memory Models' },
      { time: '00:35 - 01:45 (70 min)', activity: 'Complete Daily Lesson Batch & Coding Tasks' },
      { time: '01:45 - 02:30 (45 min)', activity: 'Timed Speed Sprint & Algorithm Arena Puzzles' },
      { time: '02:30 - 03:00 (30 min)', activity: 'Work on Step-by-Step Project Lab Build' }
    ];
  }
}

export function generateStudyPlan({
  targetDays = 30,
  dailyHours = 1,
  languageId = 'python',
  startDate = new Date().toISOString().split('T')[0]
}) {
  const langUpper = languageId.toUpperCase();
  const timeBreakdown = generateDailyTimeBreakdown(dailyHours);

  // Curriculum outline across modules
  const moduleThemes = [
    { title: 'Variables, Math & Memory Jars', lessons: 'Lessons 1 - 5', type: 'fundamentals' },
    { title: 'Strings, Text Manipulation & Printing', lessons: 'Lessons 6 - 9', type: 'strings' },
    { title: 'Decisions, Logic & If/Else Conditions', lessons: 'Lessons 10 - 14', type: 'logic' },
    { title: 'Loops, Repetition & Sequences', lessons: 'Lessons 15 - 19', type: 'loops' },
    { title: 'Lists, Arrays & Data Collections', lessons: 'Lessons 20 - 24', type: 'arrays' },
    { title: 'Functions, Parameters & Return Values', lessons: 'Lessons 25 - 29', type: 'functions' },
    { title: 'Dictionaries, Objects & Key-Value Maps', lessons: 'Lessons 30 - 34', type: 'maps' },
    { title: 'Error Handling, Debugging & Clean Code', lessons: 'Lessons 35 - 38', type: 'errors' },
    { title: 'Object-Oriented Programming (Classes & Objects)', lessons: 'Lessons 39 - 42', type: 'oop' },
    { title: 'File Handling & Real-World Modules', lessons: 'Lessons 43 - 46', type: 'io' }
  ];

  const daysList = [];
  const start = new Date(startDate);

  for (let i = 1; i <= targetDays; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (i - 1));
    const dateStr = dayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' });

    // Progress through topics based on day ratio
    const progressRatio = (i - 1) / targetDays;
    const themeIndex = Math.min(Math.floor(progressRatio * moduleThemes.length), moduleThemes.length - 1);
    const theme = moduleThemes[themeIndex];

    let milestone = null;
    let whatToDo = '';
    let howToDo = '';

    // Rest/Review days every 7th day
    if (i % 7 === 0 && i !== targetDays) {
      milestone = '🧘 Review & Consolidation Day';
      whatToDo = `Consolidate ${langUpper} concepts learned this week. No new lessons today.`;
      howToDo = `1. Open your Illustrated Digital Notes.\n2. Review any failed tests or bugs from the past 6 days.\n3. Solve 2 Bug Detective cases or 1 Algorithm Arena puzzle.\n4. Take a well-deserved rest!`;
    } else if (i === targetDays) {
      milestone = '🏆 Final Certification Examination';
      whatToDo = `Take the Official ${langUpper} Knowledge Test without hints.`;
      howToDo = `1. Ensure a quiet study space for 20 minutes.\n2. Open the Knowledge Test.\n3. Write solutions to all 3 coding problems independently.\n4. Score 80%+ to generate and print your Certificate of Completion!`;
    } else if (i % 5 === 0) {
      milestone = '⚡ Speed Practice & Module Mini-Quiz';
      whatToDo = `Complete 1 Speed Sprint drill and take the ${theme.title} Mini-Quiz.`;
      howToDo = `1. Test your keyboard typing speed in Speed Practice.\n2. Open the Module Mini-Quiz in the sidebar.\n3. Answer the concept question, then write the verification code.\n4. Earn your ⭐ Passed badge!`;
    } else if (i % 3 === 0) {
      milestone = '🔍 Bug Detective & Logic Debugging';
      whatToDo = `Fix 2 broken code cases in ${langUpper} Bug Detective.`;
      howToDo = `1. Inspect the broken code carefully.\n2. Identify whether the mistake is an off-by-one, spelling typo, or return value.\n3. Fix the bug without looking at the answer.\n4. Confirm all tests pass green.`;
    } else {
      whatToDo = `Study ${theme.title} (${theme.lessons}).`;
      howToDo = `1. Read the friendly analogy and visual diagram.\n2. Type the starter code manually in the editor (do not copy-paste).\n3. Click "Run & Test Code".\n4. If code fails, read the "Why Your Code Did Not Pass" hint and try again.`;
    }

    daysList.push({
      dayNumber: i,
      date: dateStr,
      theme: theme.title,
      whatToDo,
      whenToDo: timeBreakdown,
      howToDo,
      milestone,
      isCompleted: false
    });
  }

  return {
    id: `plan_${languageId}_${targetDays}d_${dailyHours}h`,
    targetDays,
    dailyHours,
    languageId,
    startDate,
    createdAt: new Date().toISOString(),
    days: daysList
  };
}
