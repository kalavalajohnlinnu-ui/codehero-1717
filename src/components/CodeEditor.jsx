import React, { useRef, useState } from 'react';
import { Play, RotateCcw, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

const LANG_METADATA = {
  python: {
    heroFile: '✨ magic_spell.py',
    proFile: 'main.py',
    badge: 'Python 3.12',
    indentChar: ':',
    spaces: '    '
  },
  javascript: {
    heroFile: '⚡ lightning_spell.js',
    proFile: 'index.js',
    badge: 'JavaScript ES2024',
    indentChar: '{',
    spaces: '  '
  },
  typescript: {
    heroFile: '⚡ lightning_spell.ts',
    proFile: 'index.ts',
    badge: 'TypeScript 5.4',
    indentChar: '{',
    spaces: '  '
  },
  html: {
    heroFile: '🎨 web_canvas.html',
    proFile: 'index.html',
    badge: 'HTML5 & CSS3',
    indentChar: '>',
    spaces: '  '
  },
  sql: {
    heroFile: '🗝️ vault_query.sql',
    proFile: 'query.sql',
    badge: 'SQL Relational',
    indentChar: '',
    spaces: '  '
  },
  c: {
    heroFile: '⚙️ clockwork_core.c',
    proFile: 'main.c',
    badge: 'C / C++ Simulator',
    indentChar: '{',
    spaces: '    '
  },
  cpp: {
    heroFile: '⚙️ clockwork_core.cpp',
    proFile: 'main.cpp',
    badge: 'C++20 Engine',
    indentChar: '{',
    spaces: '    '
  },
  java: {
    heroFile: '☕ HeroClass.java',
    proFile: 'Main.java',
    badge: 'Java 21 JVM',
    indentChar: '{',
    spaces: '    '
  },
  rust: {
    heroFile: '🦀 fearless_hero.rs',
    proFile: 'main.rs',
    badge: 'Rust 1.78 Cargo',
    indentChar: '{',
    spaces: '    '
  }
};

export function CodeEditor({
  code,
  value,
  onChange,
  onRun,
  onReset,
  isRunning,
  wasmStatus,
  isHeroMode = true,
  language = 'python'
}) {
  const actualCode = code !== undefined ? code : (value || '');
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const langMeta = LANG_METADATA[language] || LANG_METADATA.python;

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) {
        soundService.playClick();
        onRun();
      }
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Tab key handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = langMeta.spaces;

      if (e.shiftKey) {
        // Outdent
        const before = actualCode.substring(0, start);
        const lastNewline = before.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        const currentLine = actualCode.substring(lineStart, start);

        if (currentLine.startsWith(spaces)) {
          const newCode = actualCode.substring(0, lineStart) + actualCode.substring(lineStart + spaces.length);
          onChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - spaces.length);
            textarea.selectionEnd = Math.max(lineStart, end - spaces.length);
          }, 0);
        }
      } else {
        // Indent
        const newCode = actualCode.substring(0, start) + spaces + actualCode.substring(end);
        onChange(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
        }, 0);
      }
      return;
    }

    // Smart Enter handling
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const before = actualCode.substring(0, start);
      const lastNewline = before.lastIndexOf('\n');
      const currentLine = lastNewline === -1 ? before : before.substring(lastNewline + 1);

      const matchIndent = currentLine.match(/^(\s*)/);
      let indent = matchIndent ? matchIndent[1] : "";

      if (langMeta.indentChar && currentLine.trim().endsWith(langMeta.indentChar)) {
        indent += langMeta.spaces;
      }

      e.preventDefault();
      const insertion = "\n" + indent;
      const after = actualCode.substring(start);
      const newCode = before + insertion + after;
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
      }, 0);
    }
  };

  const handleCopy = () => {
    soundService.playClick();
    navigator.clipboard.writeText(actualCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertTextAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = actualCode.substring(0, start);
    const after = actualCode.substring(end);
    const newCode = before + textToInsert + after;
    onChange(newCode);
    setTimeout(() => {
      textarea.focus();
      if (textToInsert.length === 2 && ['()', '{}', '[]', '""', "''"].includes(textToInsert)) {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      } else {
        textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
      }
    }, 0);
  };

  const lines = actualCode.split('\n');
  const lineCount = Math.max(lines.length, 12);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/30" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 pl-2">
            {isHeroMode ? langMeta.heroFile : langMeta.proFile}
          </span>
          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full font-semibold">
            {langMeta.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Starter Code */}
          {onReset && (
            <button
              onClick={() => {
                soundService.playClick();
                onReset();
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
              title="Reset code back to starter template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Run & Test Action Button */}
          {onRun && (
            <button
              onClick={() => {
                soundService.playClick();
                onRun();
              }}
              disabled={isRunning}
              className={`
                flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md
                ${isRunning 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait' 
                  : 'bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 hover:opacity-95 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
              title="Run code and verify quest tests (Ctrl+Enter)"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run & Test</span>
                  <span className="hidden md:inline text-[9px] font-mono opacity-70 bg-black/20 px-1 py-0.2 rounded font-normal">
                    Ctrl+↵
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Code Touch Helper Keys */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0D15] border-b border-slate-800/80 overflow-x-auto shrink-0 select-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 font-bold hidden sm:inline">Keys:</span>
        {[
          { label: 'Tab', val: langMeta.spaces || '    ' },
          { label: '( )', val: '()' },
          { label: '{ }', val: '{}' },
          { label: '[ ]', val: '[]' },
          { label: '" "', val: '""' },
          { label: "' '", val: "''" },
          { label: ':', val: ':' },
          { label: ';', val: ';' },
          { label: '=', val: ' = ' },
          { label: '==', val: ' == ' },
          { label: '+', val: ' + ' },
          { label: '-', val: ' - ' },
          { label: '_', val: '_' },
          { label: 'def', val: 'def ' },
          { label: 'return', val: 'return ' },
          { label: 'print', val: language === 'python' ? 'print()' : 'console.log()' }
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => insertTextAtCursor(item.val)}
            className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] active:bg-sky-500/30 active:text-sky-300 border border-white/[0.08] text-xs font-mono text-slate-300 font-semibold shrink-0 transition-colors shadow-sm"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor Main Surface (Line Numbers + Code Input) */}
      <div className="relative flex-1 flex overflow-hidden bg-slate-950 font-mono text-xs sm:text-sm">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3 pl-3 pr-2 text-right bg-slate-950/80 border-r border-slate-800/80 text-slate-600 font-mono text-xs overflow-hidden leading-relaxed shrink-0 w-10 sm:w-12"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-5 leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={actualCode}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full h-full p-3 bg-transparent text-emerald-300 placeholder-slate-600 font-mono resize-none focus:outline-none leading-5 overflow-auto selection:bg-sky-500/30 tab-size-4"
          placeholder="# Type your magic code here..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="px-3.5 py-1 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span>Lines: {lines.length}</span>
          <span>Chars: {actualCode.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
}
