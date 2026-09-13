import React, { useRef, useState } from 'react';
import { Play, RotateCcw, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

const LANG_METADATA = {
  python:     { heroFile: 'magic_spell.py',     proFile: 'main.py',    badge: 'Python 3.12',       indentChar: ':',  spaces: '    ' },
  javascript: { heroFile: 'lightning_spell.js', proFile: 'index.js',   badge: 'JavaScript ES2024', indentChar: '{', spaces: '  ' },
  typescript: { heroFile: 'lightning_spell.ts', proFile: 'index.ts',   badge: 'TypeScript 5.4',    indentChar: '{',  spaces: '  ' },
  html:       { heroFile: 'web_canvas.html',    proFile: 'index.html', badge: 'HTML5 & CSS3',      indentChar: '>',  spaces: '  ' },
  sql:        { heroFile: 'vault_query.sql',    proFile: 'query.sql',  badge: 'SQL Relational',    indentChar: '',   spaces: '  ' },
  c:          { heroFile: 'clockwork_core.c',   proFile: 'main.c',     badge: 'C / C++',            indentChar: '{',  spaces: '    ' },
  cpp:        { heroFile: 'clockwork_core.cpp', proFile: 'main.cpp',   badge: 'C++20',              indentChar: '{',  spaces: '    ' },
  java:       { heroFile: 'HeroClass.java',     proFile: 'Main.java',  badge: 'Java 21',            indentChar: '{',  spaces: '    ' },
  rust:       { heroFile: 'fearless_hero.rs',   proFile: 'main.rs',    badge: 'Rust 1.78',          indentChar: '{',  spaces: '    ' }
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
  const actualCode     = code !== undefined ? code : (value || '');
  const textareaRef    = useRef(null);
  const lineNumbersRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const langMeta = LANG_METADATA[language] || LANG_METADATA.python;

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current)
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) { soundService.playClick(); onRun(); }
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const start  = textarea.selectionStart;
      const end    = textarea.selectionEnd;
      const spaces = langMeta.spaces;
      if (e.shiftKey) {
        const before      = actualCode.substring(0, start);
        const lastNewline = before.lastIndexOf('\n');
        const lineStart   = lastNewline === -1 ? 0 : lastNewline + 1;
        const currentLine = actualCode.substring(lineStart, start);
        if (currentLine.startsWith(spaces)) {
          const newCode = actualCode.substring(0, lineStart) + actualCode.substring(lineStart + spaces.length);
          onChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - spaces.length);
            textarea.selectionEnd   = Math.max(lineStart, end   - spaces.length);
          }, 0);
        }
      } else {
        const newCode = actualCode.substring(0, start) + spaces + actualCode.substring(end);
        onChange(newCode);
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + spaces.length; }, 0);
      }
      return;
    }

    if (e.key === 'Enter') {
      const start       = textarea.selectionStart;
      const before      = actualCode.substring(0, start);
      const lastNewline = before.lastIndexOf('\n');
      const currentLine = lastNewline === -1 ? before : before.substring(lastNewline + 1);
      const matchIndent = currentLine.match(/^(\s*)/);
      let   indent      = matchIndent ? matchIndent[1] : '';
      if (langMeta.indentChar && currentLine.trim().endsWith(langMeta.indentChar))
        indent += langMeta.spaces;
      e.preventDefault();
      const insertion = '\n' + indent;
      const newCode   = before + insertion + actualCode.substring(start);
      onChange(newCode);
      setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + insertion.length; }, 0);
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
    const start   = textarea.selectionStart;
    const end     = textarea.selectionEnd;
    const newCode = actualCode.substring(0, start) + textToInsert + actualCode.substring(end);
    onChange(newCode);
    setTimeout(() => {
      textarea.focus();
      if (textToInsert.length === 2 && ['()', '{}', '[]', '""', "''"].includes(textToInsert))
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      else
        textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    }, 0);
  };

  const lines     = actualCode.split('\n');
  const lineCount = Math.max(lines.length, 12);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">

      {/* ── Top Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2 shrink-0 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="w-[1px] h-3.5 bg-slate-200" />
          {/* File name */}
          <span className="text-xs font-mono font-bold text-slate-800">
            {isHeroMode ? langMeta.heroFile : langMeta.proFile}
          </span>
          {/* Language badge */}
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
            {langMeta.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy */}
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            title="Copy Code"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-600" />
              : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reset */}
          {onReset && (
            <button
              onClick={() => { soundService.playClick(); onReset(); }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-mono text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              title="Reset to starter code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Run & Test CTA */}
          {onRun && (
            <button
              onClick={() => { soundService.playClick(); onRun(); }}
              disabled={isRunning}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs font-mono transition-all shadow-sm
                ${isRunning 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-wait' 
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-95 text-white shadow-sky-600/20'
                }
              `}
              title="Run code (Ctrl+Enter)"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run & Test</span>
                  <span className="hidden md:inline text-[9px] opacity-75 font-mono bg-black/15 px-1 py-0.5 rounded">
                    Ctrl+↵
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile shortcut keys ─────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto shrink-0 select-none bg-slate-50/50 border-b border-slate-200">
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold shrink-0 hidden sm:inline">
          Keys:
        </span>
        {[
          { label: 'Tab', val: langMeta.spaces || '    ' },
          { label: '( )', val: '()' }, { label: '{ }', val: '{}' }, { label: '[ ]', val: '[]' },
          { label: '" "', val: '""' }, { label: "' '", val: "''" },
          { label: ':', val: ':' }, { label: ';', val: ';' },
          { label: '=', val: ' = ' }, { label: '==', val: ' == ' },
          { label: '+', val: ' + ' }, { label: '-', val: ' - ' },
          { label: '_', val: '_' }, { label: 'def', val: 'def ' },
          { label: 'return', val: 'return ' },
          { label: 'print', val: language === 'python' ? 'print()' : 'console.log()' }
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => insertTextAtCursor(item.val)}
            className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold shrink-0 transition-all bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Code surface (Clean Light IDE) ───────────── */}
      <div className="relative flex-1 flex overflow-hidden font-mono bg-white">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3 pl-2 pr-3 text-right overflow-hidden leading-[1.65] shrink-0 bg-slate-50/60 border-r border-slate-200 text-slate-400 text-xs w-11"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} style={{ lineHeight: '1.65', height: '19.8px' }}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={actualCode}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="code-editor-textarea flex-1 w-full h-full p-3 bg-transparent text-slate-900 placeholder-slate-400 resize-none focus:outline-none overflow-auto font-mono selection:bg-sky-100 text-xs sm:text-sm"
          style={{
            lineHeight: '1.65',
          }}
          placeholder={`# Start typing your code here...`}
        />
      </div>

      {/* ── Status bar ───────────────────────────────── */}
      <div className="px-3.5 py-1 flex items-center justify-between shrink-0 bg-slate-50 border-t border-slate-200 font-mono text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>Ln {lines.length}</span>
          <span>Col {actualCode.length}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
}
