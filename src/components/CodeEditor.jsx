import React, { useRef, useState } from 'react';
import { Play, RotateCcw, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

const LANG_METADATA = {
  python:     { heroFile: 'magic_spell.py',     proFile: 'main.py',    badge: 'Python 3.12',     indentChar: ':',  spaces: '    ' },
  javascript: { heroFile: 'lightning_spell.js', proFile: 'index.js',   badge: 'JavaScript ES2024', indentChar: '{', spaces: '  ' },
  typescript: { heroFile: 'lightning_spell.ts', proFile: 'index.ts',   badge: 'TypeScript 5.4',  indentChar: '{',  spaces: '  ' },
  html:       { heroFile: 'web_canvas.html',    proFile: 'index.html', badge: 'HTML5 & CSS3',    indentChar: '>',  spaces: '  ' },
  sql:        { heroFile: 'vault_query.sql',    proFile: 'query.sql',  badge: 'SQL',              indentChar: '',   spaces: '  ' },
  c:          { heroFile: 'clockwork_core.c',   proFile: 'main.c',     badge: 'C / C++',          indentChar: '{',  spaces: '    ' },
  cpp:        { heroFile: 'clockwork_core.cpp', proFile: 'main.cpp',   badge: 'C++20',            indentChar: '{',  spaces: '    ' },
  java:       { heroFile: 'HeroClass.java',     proFile: 'Main.java',  badge: 'Java 21',          indentChar: '{',  spaces: '    ' },
  rust:       { heroFile: 'fearless_hero.rs',   proFile: 'main.rs',    badge: 'Rust 1.78',        indentChar: '{',  spaces: '    ' }
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
    <div className="flex flex-col h-full overflow-hidden"
      style={{
        background: '#070911',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5) inset',
      }}>

      {/* ── Top Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2 shrink-0"
        style={{
          background: 'rgba(0,0,0,0.35)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        <div className="flex items-center gap-2.5">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,83,112,0.7)', boxShadow: '0 0 6px rgba(255,83,112,0.3)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(245,158,11,0.7)', boxShadow: '0 0 6px rgba(245,158,11,0.3)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,211,166,0.7)', boxShadow: '0 0 6px rgba(34,211,166,0.3)' }} />
          </div>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.06)' }} />
          {/* File name */}
          <span className="text-xs font-mono" style={{ color: '#C8D0E0' }}>
            {isHeroMode ? langMeta.heroFile : langMeta.proFile}
          </span>
          {/* Language badge */}
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
            style={{
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.15)',
              color: '#00E5FF'
            }}>
            {langMeta.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy */}
          <button onClick={handleCopy}
            className="p-1.5 rounded-md transition-all"
            style={{ color: '#4B5568' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#EEF0F8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5568'; }}
            title="Copy Code">
            {copied
              ? <Check className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />
              : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reset */}
          {onReset && (
            <button
              onClick={() => { soundService.playClick(); onReset(); }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-all font-mono"
              style={{ color: '#4B5568' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#EEF0F8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5568'; }}
              title="Reset to starter code">
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Run & Test CTA */}
          {onRun && (
            <button
              onClick={() => { soundService.playClick(); onRun(); }}
              disabled={isRunning}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all"
              style={isRunning ? {
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#F59E0B',
                cursor: 'wait',
                fontFamily: "'JetBrains Mono', monospace",
              } : {
                background: 'linear-gradient(135deg, #00E5FF 0%, #00B4CC 100%)',
                color: '#06080F',
                boxShadow: '0 2px 0 #005E70, 0 4px 16px rgba(0,229,255,0.2)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={e => {
                if (!isRunning) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 3px 0 #005E70, 0 6px 24px rgba(0,229,255,0.3)';
                }
              }}
              onMouseLeave={e => {
                if (!isRunning) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 0 #005E70, 0 4px 16px rgba(0,229,255,0.2)';
                }
              }}
              title="Run code (Ctrl+Enter)">
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run & Test</span>
                  <span className="hidden md:inline text-[9px] opacity-60 font-mono bg-black/20 px-1 py-0.5 rounded">
                    Ctrl+↵
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile shortcut keys ─────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto shrink-0 select-none"
        style={{ background: '#06070E', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="text-[9px] font-mono uppercase tracking-widest shrink-0 hidden sm:inline"
          style={{ color: '#2D3552' }}>Keys:</span>
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
            className="px-2 py-1 rounded-md text-xs font-mono font-semibold shrink-0 transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#6B7A96',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.08)'; e.currentTarget.style.color = '#00E5FF'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#6B7A96'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Code surface ─────────────────────────────── */}
      <div className="relative flex-1 flex overflow-hidden font-mono"
        style={{ background: '#07090F' }}>
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3 pl-2 pr-3 text-right overflow-hidden leading-[1.65] shrink-0"
          style={{
            width: '44px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#2D3552',
            borderRight: '1px solid rgba(255,255,255,0.04)',
          }}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} style={{ lineHeight: '1.65', height: '19.8px' }}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
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
          className="code-editor-textarea flex-1 w-full h-full p-3 bg-transparent resize-none focus:outline-none overflow-auto"
          style={{
            color: '#22D3A6',
            caretColor: '#00E5FF',
            lineHeight: '1.65',
            fontSize: '13px',
          }}
          placeholder={`# Start coding here…`}
        />
      </div>

      {/* ── Status bar ───────────────────────────────── */}
      <div className="px-3.5 py-1.5 flex items-center justify-between shrink-0"
        style={{
          background: 'rgba(0,0,0,0.4)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#2D3552',
        }}>
        <div className="flex items-center gap-3">
          <span>Ln {lines.length}</span>
          <span>Col {actualCode.length}</span>
          <span style={{ color: '#2D3552' }}>UTF-8</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22D3A6' }} />
          <span style={{ color: '#22D3A6' }}>Ready</span>
        </div>
      </div>
    </div>
  );
}
