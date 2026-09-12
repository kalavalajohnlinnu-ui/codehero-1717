import React, { useState } from 'react';
import { X, Play, RotateCcw, Sparkles, Terminal, Copy, Check, Loader2 } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { OutputConsole } from './OutputConsole';
import { runMultiLanguageCode } from '../services/multiLangService';
import { soundService } from '../services/soundService';

const PRESETS_BY_LANG = {
  python: [
    {
      name: "Dice Roller Simulator",
      code: `import random

print("Rolling 3 six-sided dice...")
rolls = [random.randint(1, 6) for _ in range(3)]
total = sum(rolls)

print(f"Results: {rolls}")
print(f"Total Score: {total}")
if total >= 15:
    print("Epic roll! Critical success!")
else:
    print("Normal roll.")
`
    },
    {
      name: "Fibonacci Generator",
      code: `def fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

fib_10 = fibonacci(10)
print("First 10 Fibonacci numbers:")
for i, num in enumerate(fib_10, start=1):
    print(f"F({i}) = {num}")
`
    }
  ],
  javascript: [
    {
      name: "Hero Inventory Level Up",
      code: `const party = [
  { name: "Aria", role: "Mage", power: 85 },
  { name: "Leo", role: "Knight", power: 92 },
  { name: "Kael", role: "Rogue", power: 78 }
];

console.log("=== Party Members ===");
party.forEach(hero => {
  console.log(\`\${hero.name} the \${hero.role} (Power: \${hero.power})\`);
});

const strongest = party.reduce((max, h) => h.power > max.power ? h : max, party[0]);
console.log(\`\\nChampion: \${strongest.name}!\`);
`
    }
  ],
  html: [
    {
      name: "Animated Hero Card",
      code: `<div style="font-family: system-ui, sans-serif; max-width: 320px; margin: 20px auto; padding: 24px; background: linear-gradient(135deg, #0f172a, #1e293b); border: 2px solid #38bdf8; border-radius: 20px; text-align: center; color: white; box-shadow: 0 10px 25px rgba(56,189,248,0.2);">
  <div style="font-size: 40px; margin-bottom: 8px;">👑</div>
  <h2 style="color: #38bdf8; margin: 0 0 6px 0;">Code Master</h2>
  <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px 0;">Zero to Hero Champion</p>
  <button style="background: linear-gradient(to right, #38bdf8, #34d399); color: #020617; font-weight: bold; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer;">
    Power Level 9000
  </button>
</div>
`
    }
  ],
  sql: [
    {
      name: "Top Ranked Heroes",
      code: `-- Available tables: heroes, inventory
SELECT name, class, level, power 
FROM heroes 
WHERE power >= 90;
`
    }
  ],
  c: [
    {
      name: "C Hero Stats",
      code: `#include <stdio.h>

int main() {
    printf("=== Hero Status ===\\n");
    int hp = 100;
    int max_hp = 100;
    printf("Health: %d / %d HP\\n", hp, max_hp);
    return 0;
}
`
    }
  ],
  java: [
    {
      name: "Java RPG Party",
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java Hero Engine Activated!");
        int score = 500;
        System.out.println("Total Score: " + score);
    }
}
`
    }
  ],
  rust: [
    {
      name: "Rust Fearless Concurrency",
      code: `fn main() {
    let name = "Ferris";
    let speed = 100;
    println!("Hero {} zooming at {} speed!", name, speed);
}
`
    }
  ]
};

export function SandboxModal({
  isOpen,
  onClose,
  sandboxCode,
  onSaveSandboxCode,
  pyodideInstance,
  currentLanguageId = 'python',
  languageName = 'Python',
  mascotName = 'Pythie'
}) {
  const [code, setCode] = useState(sandboxCode);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState(null);

  if (!isOpen) return null;

  const presets = PRESETS_BY_LANG[currentLanguageId] || PRESETS_BY_LANG.python;

  const handleRun = async () => {
    soundService.playClick();
    setIsRunning(true);
    try {
      const result = await runMultiLanguageCode(code, currentLanguageId, pyodideInstance);
      setOutputResult(result);
      if (result.success) soundService.playSuccess();
      else soundService.playError();
      onSaveSandboxCode(currentLanguageId, code);
    } catch (e) {
      setOutputResult({
        success: false,
        stdout: '',
        stderr: String(e),
        error: String(e),
        variables: []
      });
      soundService.playError();
    } finally {
      setIsRunning(false);
    }
  };

  const handleSelectPreset = (presetCode) => {
    soundService.playClick();
    setCode(presetCode);
    onSaveSandboxCode(currentLanguageId, presetCode);
    setOutputResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{languageName} Freeform Sandbox</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Unlimited Playground
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Experiment freely with zero tests or restrictions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 hover:opacity-90 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-amber-500/10"
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? "Running..." : "Run Code"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Selector Bar */}
        {presets && presets.length > 0 && (
          <div className="flex items-center gap-2 px-5 py-2 bg-slate-900/40 border-b border-slate-800/80 overflow-x-auto shrink-0">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p.code)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700/60 whitespace-nowrap"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Editor & Output Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden">
          {/* Left: Code Editor */}
          <div className="h-full flex flex-col min-h-0 border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/40">
            <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{languageName} Source Code</span>
              <span className="text-[10px] text-slate-500">{code.split('\n').length} lines</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={(val) => {
                  setCode(val);
                  onSaveSandboxCode(currentLanguageId, val);
                }}
                language={currentLanguageId}
              />
            </div>
          </div>

          {/* Right: Output Console */}
          <div className="h-full flex flex-col min-h-0">
            <OutputConsole
              outputResult={outputResult}
              testResults={null}
              onClearConsole={() => setOutputResult(null)}
              isTestingMode={false}
              isHeroMode={true}
              currentLanguageId={currentLanguageId}
              mascotName={mascotName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
