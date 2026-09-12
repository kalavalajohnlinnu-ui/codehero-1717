import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Printer, 
  X, 
  Check, 
  Copy, 
  FileText, 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { getLanguageDetails } from '../data/languages/languageDetails';
import { soundService } from '../services/soundService';

export function DigitalNotesModal({ isOpen, onClose, currentLanguageId = 'python' }) {
  const [activeLangId, setActiveLangId] = useState(currentLanguageId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const langDetails = getLanguageDetails(activeLangId);
  const langConfig = LANGUAGES.find(l => l.id === activeLangId) || LANGUAGES[0];

  // Generate full markdown text for export/download
  const generateMarkdownNotes = () => {
    return `# 📘 CodeHero Universe Master Study Notes: ${langDetails.name}
Generated on: ${new Date().toLocaleDateString()}
Target Standard: Production Grade & Top 1% Foundational Competence

---

## 1. Runtime Architecture & Execution Model
- **Language**: ${langDetails.name} (${langDetails.version})
- **Domain**: ${langDetails.badge}
- **Paradigms**: ${langDetails.paradigm}
- **Execution Model**: ${langDetails.executionModel}
- **Official Documentation**: ${langDetails.docsUrl}

---

## 2. Core Architectural Strengths
${langDetails.coreStrengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## 3. Standard Library Powerhouses
${langDetails.standardLibraryPowerTools.map(t => `- **${t.name}**: ${t.purpose}`).join('\n')}

---

## 4. Top 1% Engineering Mastery Skills
These are the exact low-level competencies that separate junior developers from the top 1% in ${langDetails.name}:
${langDetails.top1PercentSkills.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## 5. Architectural Traps & Gotchas
${langDetails.commonPitfalls.map((p, i) => `### Trap ${i + 1}: ${p.title}
- **Problem**: ${p.problem}
- **Production Solution**: ${p.solution}
`).join('\n')}

---

## 6. Senior Engineering Questions & Answers
${langDetails.curatedQuestions.map((q, i) => `### Q${i + 1}: ${q.q}
${q.a}
`).join('\n')}

---
*Created with CodeHero Universe 2.0 — The Honest Engineering Guild*
`;
  };

  const handleDownloadMarkdown = () => {
    soundService.playSuccess();
    const mdContent = generateMarkdownNotes();
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeLangId}_codehero_master_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyNotes = () => {
    const mdContent = generateMarkdownNotes();
    navigator.clipboard.writeText(mdContent);
    soundService.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    soundService.playClick();
    const mdContent = generateMarkdownNotes();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${langDetails.name} Study Notes - CodeHero Universe</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 800px; margin: auto; }
          h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
          h2 { color: #1e293b; margin-top: 24px; border-bottom: 1px solid #f1f5f9; }
          code, pre { background: #f8fafc; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
          pre { padding: 12px; border: 1px solid #e2e8f0; }
          .trap { background: #fff1f2; border-left: 4px solid #f43f5e; padding: 12px; margin: 12px 0; }
          .solution { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px; margin: 12px 0; }
        </style>
      </head>
      <body>
        <pre style="white-space: pre-wrap; font-family: inherit;">${mdContent}</pre>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0D15] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-8 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0D1019] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xl">
              {langConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Digital Master Notes: {langDetails.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase">
                  Exportable
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Downloadable study guides, architectural summaries, and senior gotchas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Tabs & Export Toolbar */}
        <div className="px-5 sm:px-8 py-2.5 border-b border-white/[0.06] bg-[#080A10] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* 7 Languages */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {LANGUAGES.map(l => (
              <button
                key={l.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveLangId(l.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all shrink-0 ${
                  l.id === activeLangId
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{l.icon}</span> <span className="hidden sm:inline">{l.name}</span>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotes}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors border border-white/10"
              title="Copy markdown text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors border border-white/10"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
              title="Download clean .md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>

        {/* Notes Preview Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1: Architecture Summary */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>1. Runtime & Execution Architecture</span>
            </div>
            <p className="text-slate-300">
              {langDetails.executionModel}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
              <div>Paradigms: <span className="text-white">{langDetails.paradigm}</span></div>
              <div>Standard Version: <span className="text-white">{langDetails.version}</span></div>
            </div>
          </div>

          {/* Section 2: Core Strengths */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>2. Core Strengths & Use Cases</span>
            </div>
            <ul className="space-y-1.5 list-disc ml-4 text-slate-300">
              {langDetails.coreStrengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: Standard Library Power Tools */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>3. Standard Library Cheat Sheet</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {langDetails.standardLibraryPowerTools.map((t, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
                  <div className="font-mono font-bold text-white text-[11px]">{t.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.purpose}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Traps & Production Fixes */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>4. Critical Traps & Senior Solutions</span>
            </div>
            {langDetails.commonPitfalls.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/[0.04] space-y-1.5">
                <div className="font-mono font-bold text-amber-300 text-xs">{p.title}</div>
                <div className="text-red-300 font-mono text-[11px]">⚠️ {p.problem}</div>
                <div className="text-emerald-300 font-mono text-[11px]">✅ {p.solution}</div>
              </div>
            ))}
          </div>

          {/* Section 5: Top 1% Interview Concepts */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>5. Top 1% Senior Interview Concepts</span>
            </div>
            {langDetails.curatedQuestions.map((q, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/[0.04] space-y-1.5">
                <div className="font-bold text-white text-xs">{q.q}</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">{q.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-8 py-4 border-t border-white/[0.08] bg-[#0D1019] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            {langDetails.name} Study Guide · CodeHero Universe 2.0
          </div>
          <button
            onClick={handleDownloadMarkdown}
            className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Notes (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
