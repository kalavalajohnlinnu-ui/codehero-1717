import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { MascotAvatar } from './mascots/MascotAvatar';
import { soundService } from '../services/soundService';

const LANGUAGE_TIPS = {
  dragon: [
    "In Python, indentation is like organizing your toy shelf neatly! 🐍",
    "Did you know? Python is named after Monty Python, not the snake!",
    "Variables are like labeled jars: store something inside and reuse it whenever you want!",
    "Functions are like reusable spell scrolls in your spellbook!",
    "Don't worry if your code breaks! Even NASA programmers make typos every day.",
    "Click 'Run & Test' anytime to see what Python thinks of your code!"
  ],
  fox: [
    "JavaScript brings the web to life! Like lightning in your browser! ⚡",
    "Use `const` for things that never change, and `let` for variables that do!",
    "Arrays `['apple', 'banana']` let you pack multiple items into a single backpack!",
    "Functions in JS can be written like `function jump() {}` or `() => {}`!",
    "You can log anything to the console with `console.log()`!"
  ],
  cat: [
    "HTML is the skeleton of the web, and CSS is the stylish outfit! 🎨",
    "Always remember to close your tags: `<h1>` starts it, and `</h1>` finishes it!",
    "With CSS you can change colors, rounded corners, shadows, and fonts!",
    "Buttons `<button>` let your users interact with your creation!",
    "Inspect the Web Preview tab to see your webpage come alive!"
  ],
  turtle: [
    "Databases remember everything like an impenetrable ancient vault! 🐢",
    "`SELECT` finds the treasure, and `WHERE` filters out the rocks!",
    "Always double check table names like `heroes` and `inventory`!",
    "SQL is the universal language spoken by almost all companies to store data!",
    "`ORDER BY` sorts your data in ascending or descending order!"
  ],
  golem: [
    "C gives you direct keys to the computer's deepest engine! ⚙️",
    "Every C program begins at `int main()`—the command center!",
    "Don't forget your semicolons `;`—they tell the compiler a thought is complete!",
    "`printf` displays formatted strings with tokens like `%d` and `%s`!",
    "C makes rocket software, operating systems, and game engines run super fast!"
  ],
  owl: [
    "Write once, run anywhere! Java powers millions of devices worldwide! ☕",
    "In Java, every line of code lives safely inside a `class`!",
    "`System.out.println()` speaks loud and clear to your terminal screen!",
    "Java checks types strictly so you catch errors before running your code!",
    "Objects are like real-world items that have properties and actions!"
  ],
  crab: [
    "Rust gives you blazing speed with complete memory safety! 🦀",
    "Variables in Rust are immutable by default—use `let mut` if you want to change them!",
    "`println!(\"Hello {}\", name)` is a Rust macro that formats your text safely!",
    "The Rust compiler is like a strict teacher that prevents all memory bugs!",
    "Rust powers modern web browsers, game engines, and cloud servers!"
  ]
};

export function PythieMascot({
  mascotName = 'Pythie',
  mascotType = 'dragon',
  mascotTitle = 'Coding Companion',
  mood = 'idle', // 'idle' | 'thinking' | 'celebrating' | 'detective'
  speechText,
  isHeroMode = true
}) {
  const [customTip, setCustomTip] = useState(null);

  const tipsList = LANGUAGE_TIPS[mascotType] || LANGUAGE_TIPS.dragon;

  const handleClickMascot = () => {
    soundService.playMagic();
    const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];
    setCustomTip(randomTip);
    setTimeout(() => setCustomTip(null), 7000);
  };

  const displayText = customTip || speechText || (
    mood === 'detective'
      ? `Aha! Detective ${mascotName} spotted a clue! Let's inspect what happened!`
      : mood === 'celebrating'
      ? `WOOHOO! Quest complete! You're becoming a true Code Hero! ⭐`
      : mood === 'thinking'
      ? `Evaluating your code... looking for victory conditions...`
      : `Hi! I'm ${mascotName}, your ${mascotTitle}! Click me for a secret tip!`
  );

  return (
    <div className="flex items-end gap-3 select-none group">
      {/* Speech Bubble */}
      <div className="relative max-w-xs sm:max-w-sm bg-gradient-to-r from-slate-900 to-slate-850 border border-sky-500/30 rounded-2xl p-3 shadow-lg shadow-sky-500/5 mb-1 animate-fade-in">
        <div className="flex items-start gap-2">
          {mood === 'detective' ? (
            <span className="text-base">🔍</span>
          ) : mood === 'celebrating' ? (
            <span className="text-base">🎉</span>
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
          )}
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {displayText}
          </p>
        </div>

        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-slate-850 border-r border-b border-sky-500/30 rotate-45" />
      </div>

      {/* Mascot Avatar Button */}
      <button
        onClick={handleClickMascot}
        className={`
          relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0
          ${mood === 'celebrating' ? 'animate-bounce' : 'animate-pulse-subtle'}
        `}
        title={`Click ${mascotName} for a tip!`}
      >
        <MascotAvatar mascotType={mascotType} mood={mood} className="w-full h-full" />
      </button>
    </div>
  );
}
