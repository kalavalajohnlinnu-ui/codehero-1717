import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Printer, 
  X, 
  Search,
  Code2, 
  Check, 
  Copy,
  Cpu, 
  Layers, 
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Target,
  Clock,
  Tag,
  ShieldAlert,
  Sword,
  Hammer,
  Sparkles,
  Database,
  ExternalLink,
  Download
} from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { getLanguageDetails } from '../data/languages/languageDetails';
import { soundService } from '../services/soundService';
import algoChallenges from '../data/algorithms/challenges.json';
import bugChallenges from '../data/bugs/challenges.json';
import projectBuilds from '../data/projects/projects.json';

/* ── Print / PDF CSS Rules ─────────────────────────────────── */
const PDF_PRINT_CSS = `
@media print {
  @page {
    size: A4;
    margin: 16mm 14mm;
  }
  body * { visibility: hidden !important; }
  #notes-pdf-root, #notes-pdf-root * { visibility: visible !important; }
  #notes-pdf-root {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    background: white !important;
    color: #0F172A !important;
    font-family: 'Inter', system-ui, sans-serif !important;
    font-size: 11pt !important;
    line-height: 1.5 !important;
  }
  .print-hide { display: none !important; }
  .print-show { display: block !important; }
  .pdf-cover { 
    page-break-after: always !important; 
    break-after: page !important;
  }
  .pdf-chapter { 
    page-break-before: always !important; 
    break-before: page !important;
  }
  .pdf-item-block {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    margin-bottom: 16px !important;
  }
  .pdf-code-block {
    background: #F8FAFC !important;
    color: #0F172A !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 6px !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 9.5pt !important;
    padding: 10px 12px !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
  }
  .pdf-callout {
    border-left: 4px solid #0284C7 !important;
    background: #F0F9FF !important;
    padding: 10px 14px !important;
    border-radius: 4px !important;
    margin: 10px 0 !important;
  }
  h1, h2, h3, h4 { color: #0F172A !important; }
}
`;

export function DigitalNotesModal({ isOpen, onClose, currentLanguageId = 'python' }) {
  const [activeLangId, setActiveLangId] = useState(currentLanguageId);
  const [activeTab, setActiveTab]       = useState('curriculum'); // 'curriculum' | 'arena' | 'bugs' | 'projects' | 'diagrams' | 'pitfalls'
  const [searchTerm, setSearchTerm]     = useState('');
  const [openModules, setOpenModules]   = useState({
    'mod-1': true, 'js-mod-1': true, 'html-mod-1': true, 'sql-mod-1': true, 'c-mod-1': true, 'java-mod-1': true, 'rust-mod-1': true
  });
  const [expandAll, setExpandAll]       = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  useEffect(() => {
    if (currentLanguageId) {
      setActiveLangId(currentLanguageId);
    }
  }, [currentLanguageId]);

  const langDetails = getLanguageDetails(activeLangId);
  const langConfig  = LANGUAGES.find(l => l.id === activeLangId) || LANGUAGES[0];

  const generateHandbookHTML = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const curriculum = langConfig?.curriculum || [];

    // Build all lessons HTML
    const chaptersHTML = curriculum.map((mod, modIdx) => `
      <div class="chapter">
        <div class="chapter-header">
          <span class="chapter-num">Module ${String(modIdx + 1).padStart(2, '0')}</span>
          <span class="chapter-title">${mod.title}</span>
          <span class="chapter-count">${mod.lessons?.length || 0} lessons</span>
        </div>
        ${(mod.lessons || []).map((lesson, lIdx) => `
          <div class="lesson-block">
            <div class="lesson-title">
              <span class="lesson-num">${modIdx + 1}.${lIdx + 1}</span>
              ${lesson.title}
              <span class="lesson-badge">${lesson.badge || ''}</span>
              <span class="lesson-dur">${lesson.duration || ''}</span>
            </div>
            <div class="concept-box">
              <div class="box-label">📖 Concept &amp; Theory</div>
              <div class="concept-text">${(lesson.concept || '').replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</div>
            </div>
            <div class="task-box">
              <div class="box-label">🎯 Coding Mission</div>
              <div class="task-text">${(lesson.task || '').replace(/\n/g, '<br>')}</div>
            </div>
            ${lesson.solution ? `
            <div class="solution-box">
              <div class="box-label">✅ Solution Code</div>
              <pre class="code-block">${lesson.solution.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
            </div>` : ''}
            ${lesson.hints?.length ? `
            <div class="hints-box">
              <div class="box-label">💡 Hints</div>
              ${lesson.hints.map((h, hi) => `<div class="hint"><span class="hint-num">Clue ${hi + 1}</span> ${h}</div>`).join('')}
            </div>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>CodeHero Academy — ${langDetails.name} Complete Handbook</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #0F172A; background: #fff; font-size: 10.5pt; line-height: 1.6; }
    @page { size: A4; margin: 18mm 15mm 18mm 15mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }

    /* Cover */
    .cover { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 20px; border-bottom:4px solid #0284C7; margin-bottom:32px; page-break-after:always; }
    .cover-badge { font-family:'JetBrains Mono',monospace; font-size:8.5pt; background:#EFF6FF; color:#1D4ED8; padding:4px 14px; border-radius:99px; border:1px solid #BFDBFE; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; display:inline-block; }
    .cover-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:28pt; font-weight:800; color:#0F172A; letter-spacing:-0.03em; margin-bottom:8px; }
    .cover-sub { font-size:12pt; color:#475569; margin-bottom:20px; }
    .cover-stats { display:flex; gap:28px; justify-content:center; flex-wrap:wrap; }
    .stat { text-align:center; }
    .stat-num { font-family:'JetBrains Mono',monospace; font-size:18pt; font-weight:700; color:#0284C7; }
    .stat-lbl { font-size:7.5pt; color:#94A3B8; text-transform:uppercase; letter-spacing:0.08em; font-weight:600; }
    .cover-note { margin-top:18px; font-size:8pt; color:#94A3B8; }

    /* Chapter */
    .chapter { page-break-before:always; margin-bottom:24px; }
    .chapter-header { display:flex; align-items:center; gap:10px; padding:10px 14px; background:#F8FAFC; border-left:4px solid #0284C7; border-bottom:1px solid #E2E8F0; margin-bottom:12px; }
    .chapter-num { font-family:'JetBrains Mono',monospace; font-size:8pt; font-weight:700; color:#0284C7; background:#EFF6FF; padding:2px 8px; border-radius:4px; }
    .chapter-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:13pt; font-weight:700; color:#0F172A; flex:1; }
    .chapter-count { font-family:'JetBrains Mono',monospace; font-size:8pt; color:#94A3B8; }

    /* Lesson */
    .lesson-block { border:1px solid #E2E8F0; border-radius:8px; margin-bottom:14px; overflow:hidden; break-inside:avoid; page-break-inside:avoid; }
    .lesson-title { display:flex; align-items:center; gap:8px; padding:8px 12px; background:#F8FAFC; border-bottom:1px solid #E2E8F0; font-family:'Plus Jakarta Sans',sans-serif; font-size:11pt; font-weight:700; color:#0F172A; }
    .lesson-num { font-family:'JetBrains Mono',monospace; font-size:8pt; font-weight:700; color:#0284C7; background:#EFF6FF; padding:1px 6px; border-radius:3px; }
    .lesson-badge { font-family:'JetBrains Mono',monospace; font-size:7.5pt; color:#64748B; background:#F1F5F9; padding:1px 6px; border-radius:3px; margin-left:auto; }
    .lesson-dur { font-family:'JetBrains Mono',monospace; font-size:7.5pt; color:#94A3B8; }

    /* Content Boxes */
    .concept-box, .task-box, .solution-box, .hints-box { padding:9px 12px; border-bottom:1px solid #F1F5F9; }
    .solution-box:last-child, .hints-box:last-child { border-bottom:none; }
    .box-label { font-family:'JetBrains Mono',monospace; font-size:7.5pt; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#64748B; margin-bottom:5px; }
    .concept-text { font-size:9.5pt; color:#334155; line-height:1.65; }
    .task-text { font-size:9.5pt; color:#1E3A5F; background:#EFF6FF; padding:7px 9px; border-radius:5px; border-left:3px solid #0284C7; }
    code { font-family:'JetBrains Mono',monospace; font-size:8.5pt; background:#F1F5F9; padding:1px 5px; border-radius:3px; color:#0F172A; }
    .code-block { font-family:'JetBrains Mono',monospace; font-size:8.5pt; background:#F8FAFC; border:1px solid #CBD5E1; border-radius:5px; padding:9px 11px; white-space:pre-wrap; word-break:break-word; color:#1E293B; line-height:1.55; }
    .hint { font-size:9pt; color:#475569; margin-bottom:4px; }
    .hint-num { font-family:'JetBrains Mono',monospace; font-size:7.5pt; font-weight:700; color:#D97706; background:#FFFBEB; padding:1px 5px; border-radius:3px; margin-right:4px; }

    /* Footer */
    .footer { text-align:center; color:#CBD5E1; font-size:7.5pt; font-family:'JetBrains Mono',monospace; margin-top:24px; padding-top:10px; border-top:1px solid #F1F5F9; }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-badge">CodeHero Academy 2.0 · Complete Handbook</div>
    <div class="cover-title">${langDetails.name}<br>Complete Reference Manual</div>
    <div class="cover-sub">Every lesson, concept, mission, and verified solution — untruncated</div>
    <div class="cover-stats">
      <div class="stat"><div class="stat-num">${curriculum.length}</div><div class="stat-lbl">Modules</div></div>
      <div class="stat"><div class="stat-num">${curriculum.reduce((a, m) => a + (m.lessons?.length || 0), 0)}</div><div class="stat-lbl">Lessons</div></div>
      <div class="stat"><div class="stat-num">Top 15%</div><div class="stat-lbl">Engineer Track</div></div>
    </div>
    <div class="cover-note">Generated ${today} · CodeHero Academy · Use Destination &gt; Save as PDF</div>
  </div>

  ${chaptersHTML}

  <div class="footer">CodeHero Academy 2.0 · Top 10–15% Engineer Foundation Track · Your Personal Handbook</div>
</body>
</html>`;
  };

  const handlePrint = () => {
    soundService.playSuccess();
    const html = generateHandbookHTML();
    
    // In-page hidden iframe: NEVER blocked by popup blockers!
    try {
      const oldFrame = document.getElementById('notes-print-frame');
      if (oldFrame) oldFrame.remove();
      const iframe = document.createElement('iframe');
      iframe.id = 'notes-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow.document;
      frameDoc.open();
      frameDoc.write(html);
      frameDoc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          handleDownloadHTML();
        }
      }, 400);
    } catch (e) {
      handleDownloadHTML();
    }
  };

  const handleDownloadHTML = () => {
    soundService.playSuccess();
    const html = generateHandbookHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CodeHero_${langDetails.name}_Complete_Notes.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 200);
  };

  const handleCopyCode = (id, text) => {
    soundService.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const toggleModule = (id) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleExpandAll = () => {
    soundService.playClick();
    const nextState = !expandAll;
    setExpandAll(nextState);
    if (nextState && langConfig?.curriculum) {
      const allOpen = {};
      langConfig.curriculum.forEach(m => { allOpen[m.id] = true; });
      setOpenModules(allOpen);
    } else {
      setOpenModules({});
    }
  };

  // Filter lessons based on search query
  const filteredModules = useMemo(() => {
    if (!langConfig?.curriculum) return [];
    if (!searchTerm.trim()) return langConfig.curriculum;

    const term = searchTerm.toLowerCase();
    return langConfig.curriculum.map(mod => {
      const modMatches = mod.title.toLowerCase().includes(term);
      const matchingLessons = (mod.lessons || []).filter(l => 
        l.title.toLowerCase().includes(term) ||
        (l.concept && l.concept.toLowerCase().includes(term)) ||
        (l.task && l.task.toLowerCase().includes(term)) ||
        (l.solution && l.solution.toLowerCase().includes(term))
      );

      if (modMatches) return mod;
      if (matchingLessons.length > 0) return { ...mod, lessons: matchingLessons };
      return null;
    }).filter(Boolean);
  }, [langConfig, searchTerm]);

  // Filter Algorithm challenges
  const filteredAlgo = useMemo(() => {
    const list = algoChallenges || [];
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(c => 
      c.title.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Filter Bug cases
  const filteredBugs = useMemo(() => {
    const list = bugChallenges || [];
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(b => 
      b.caseTitle.toLowerCase().includes(term) ||
      b.description.toLowerCase().includes(term) ||
      b.bugDescription.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Filter Projects
  const filteredProjects = useMemo(() => {
    const list = projectBuilds || [];
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const totalLessonsInCurriculum = langConfig?.curriculum?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;

  const tabs = [
    { id: 'curriculum', label: `Core Lessons (${totalLessonsInCurriculum})`, icon: BookOpen, count: totalLessonsInCurriculum },
    { id: 'arena',      label: 'Algorithm Arena (80)', icon: Sword,    count: 80 },
    { id: 'bugs',       label: 'Bug Detective (40)',   icon: ShieldAlert, count: 40 },
    { id: 'projects',   label: 'Project Lab (15)',     icon: Hammer,   count: 15 },
    { id: 'diagrams',   label: 'Visual Diagrams',      icon: Cpu,      count: 'Pics' },
    { id: 'pitfalls',   label: 'Pitfalls & Interview', icon: AlertTriangle, count: 'Gotchas' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <style>{PDF_PRINT_CSS}</style>

      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 print:hidden bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      >

        <div className="w-full max-w-6xl flex flex-col overflow-hidden print:hidden bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl"
          style={{ height: '95vh' }}
          onClick={e => e.stopPropagation()}>

          {/* ── Top Header Strip (Light Theme) ─────────────────── */}
          <div className="flex items-center justify-between px-5 py-3.5 shrink-0 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm bg-sky-100 text-sky-700 border border-sky-300 shadow-sm">
                CH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-sky-700">
                    COMPLETE ACADEMY OMNIBUS & NOTES
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                    ALL WEB CONTENT INCLUDED
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {langDetails.name} Complete Handbook & Reference Manual
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Picker */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 font-semibold">Language:</span>
                <select
                  value={activeLangId}
                  onChange={e => setActiveLangId(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-none cursor-pointer">
                  {LANGUAGES.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Print / Save PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl font-bold text-xs font-mono transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 active:scale-95 touch-manipulation cursor-pointer shrink-0"
                title="Print or save as PDF">
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save as PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>

              {/* Download Notes HTML */}
              <button
                type="button"
                onClick={handleDownloadHTML}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl font-bold text-xs font-mono transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 touch-manipulation cursor-pointer shrink-0"
                title="Download complete offline handbook file">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Notes</span>
                <span className="sm:hidden">HTML</span>
              </button>

              {/* Close Button — 44px touch target */}
              <button
                type="button"
                onClick={() => { soundService.playClick(); onClose(); }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-all shadow-xs touch-manipulation cursor-pointer shrink-0"
                title="Close Notes (Esc)"
                aria-label="Close Notes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Tabs & Search Bar (Light Theme) ───────────────── */}
          <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-slate-200 bg-slate-50/40">
            
            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { soundService.playClick(); setActiveTab(t.id); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 ${
                      isActive
                        ? 'bg-white text-sky-800 border border-slate-200 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Filter / Search Box */}
            <div className="relative flex items-center min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes, syntax, code..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs font-mono pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          {/* ── Scrollable Tab Panels ─────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

            {/* ═══════════════════════════════════════════════════
                TAB 1: ALL CORE LESSONS (FULL CURRICULUM UNTRUNCATED)
            ═══════════════════════════════════════════════════ */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <span>{langDetails.name} — Complete Curriculum Lessons ({totalLessonsInCurriculum} Lessons)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Every single quest, concept explanation, mission challenge, starter code, and working solution.
                    </p>
                  </div>

                  <button
                    onClick={handleToggleExpandAll}
                    className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100 shadow-2xs active:scale-95 touch-manipulation cursor-pointer">
                    {expandAll ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>

                {filteredModules.map((module, modIdx) => {
                  const isOpen = expandAll || openModules[module.id];
                  const lessonCount = module.lessons?.length || 0;

                  return (
                    <div key={module.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left transition-colors cursor-pointer touch-manipulation">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center font-mono font-bold text-xs text-sky-700 shrink-0">
                            {String(modIdx + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{module.title}</div>
                            <div className="text-xs font-mono text-slate-500">{lessonCount} lessons in module</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500">
                          {isOpen ? <ChevronDown className="w-4 h-4 text-sky-600" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Every Single Lesson in this Module (Untruncated) */}
                      {isOpen && module.lessons && (
                        <div className="p-4 pt-0 space-y-4 border-t border-slate-100 bg-slate-50/30">
                          {module.lessons.map((lesson, lIdx) => (
                            <div key={lesson.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                              {/* Lesson Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                                    {modIdx + 1}.{lIdx + 1}
                                  </span>
                                  <span className="text-sm font-bold text-slate-900">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {lesson.duration}</span>
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{lesson.badge}</span>
                                </div>
                              </div>

                              {/* Concept Text */}
                              <div className="text-xs text-slate-700 leading-relaxed bg-sky-50/50 p-3.5 rounded-xl border border-sky-100">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-700 font-bold block mb-1">
                                  Core Concept & Logic
                                </span>
                                <p className="whitespace-pre-line font-normal">{lesson.concept}</p>
                              </div>

                              {/* Task Mission */}
                              <div className="text-xs text-amber-950 leading-relaxed bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold flex items-center gap-1 mb-1">
                                  <Target className="w-3 h-3 text-amber-600" /> Practice Mission / Task
                                </span>
                                <p className="whitespace-pre-line font-medium">{lesson.task}</p>
                              </div>

                              {/* Code Solution with Copy Button */}
                              {lesson.solution && (
                                <div>
                                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5 px-1">
                                    <span className="font-bold text-emerald-700">Verified Code Solution</span>
                                    <button
                                      onClick={() => handleCopyCode(lesson.id, lesson.solution)}
                                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors font-semibold active:scale-95 touch-manipulation cursor-pointer">
                                      {copiedCodeId === lesson.id ? (
                                        <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!</>
                                      ) : (
                                        <><Copy className="w-3.5 h-3.5 text-slate-500" /> Copy Code</>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                                    {lesson.solution}
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredModules.length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    No lessons matched your search "{searchTerm}".
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                TAB 2: ALGORITHM ARENA (ALL 80 CHALLENGES)
            ═══════════════════════════════════════════════════ */}
            {activeTab === 'arena' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sword className="w-4 h-4 text-indigo-600" />
                    <span>Algorithm Arena — All 80 Coding Challenges</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    LeetCode-style algorithmic puzzles covering Arrays, Strings, Math, Recursion, Sorting, and Data Structures with complete solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAlgo.map((c, idx) => (
                    <div key={c.id || idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-600">
                          #{idx + 1} · {c.category || 'General'}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase border ${
                          c.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          c.difficulty === 'medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {c.difficulty || 'easy'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                      {c.examples && c.examples[0] && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
                          <div>Input: {c.examples[0].input}</div>
                          <div>Output: {c.examples[0].output}</div>
                        </div>
                      )}

                      {c.solution && (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                            <span className="text-emerald-700 font-bold">Solution:</span>
                            <button
                              onClick={() => handleCopyCode(`algo-${idx}`, c.solution)}
                              className="hover:text-slate-900 text-slate-500 transition-colors flex items-center gap-1 active:scale-95 touch-manipulation cursor-pointer">
                              {copiedCodeId === `algo-${idx}` ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                          </div>
                          <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                            {c.solution}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                TAB 3: BUG DETECTIVE (ALL 40 FORENSIC CASES)
            ═══════════════════════════════════════════════════ */}
            {activeTab === 'bugs' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Bug Detective — All 40 Forensic Debugging Cases</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Broken code specimens and crime scene files. Study how to identify, explain, and repair real errors.
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredBugs.map((b, idx) => (
                    <div key={b.id || idx} className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-rose-700">
                          {b.caseTitle || `Case #${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          Diagnostic File
                        </span>
                      </div>

                      <p className="text-xs text-slate-700">{b.description}</p>
                      <div className="text-xs font-mono text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        ⚠️ Bug Root Cause: {b.bugDescription}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Broken Code */}
                        <div>
                          <div className="text-[10px] font-mono text-rose-700 font-bold mb-1">❌ Broken Code:</div>
                          <pre className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 font-mono text-xs overflow-x-auto leading-relaxed">
                            {b.brokenCode}
                          </pre>
                        </div>

                        {/* Fixed Code */}
                        <div>
                          <div className="text-[10px] font-mono text-emerald-700 font-bold mb-1">✅ Fixed Solution:</div>
                          <pre className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-mono text-xs overflow-x-auto leading-relaxed">
                            {b.fixedCode}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                TAB 4: PROJECT LAB (ALL 15 BUILDS)
            ═══════════════════════════════════════════════════ */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-amber-600" />
                    <span>Project Lab — All 15 Progressive Real-World Builds</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Multi-step hands-on software projects spanning calculators, games, databases, and web tools.
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredProjects.map((p, idx) => (
                    <div key={p.id || idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-700">
                          Project #{idx + 1} · {p.difficulty || 'beginner'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {p.steps?.length || 0} Progressive Steps
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-600">{p.description}</p>

                      {/* Project Steps */}
                      {p.steps && (
                        <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
                          {p.steps.map((s, sIdx) => (
                            <div key={sIdx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1.5">
                              <div className="text-xs font-bold text-slate-800">
                                Step {s.stepNumber || sIdx + 1}: {s.title}
                              </div>
                              <div className="text-xs text-slate-600">{s.description}</div>
                              {s.solution && (
                                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                                  {s.solution}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                TAB 5: VISUAL ARCHITECTURE DIAGRAMS
            ═══════════════════════════════════════════════════ */}
            {activeTab === 'diagrams' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-sky-600" />
                    <span>Visual Architecture & Mental Models</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Clear physical diagrams showing how computers execute logic, manage memory, and branch decisions.
                  </p>
                </div>

                {/* Diagram 1: Memory Model */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold font-mono text-sky-700 uppercase">
                      Diagram 1: The Computer RAM Memory Model
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Variables & Addresses</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Variables are labelled memory containers allocated in physical RAM. Each holds a typed value and memory address.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-center">
                    <svg viewBox="0 0 680 140" className="w-full max-w-2xl h-auto font-mono text-xs">
                      <g transform="translate(20, 15)">
                        <rect width="180" height="110" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
                        <rect width="180" height="26" rx="10" fill="rgba(2,132,199,0.1)" />
                        <text x="90" y="18" fill="#0284C7" textAnchor="middle" fontWeight="bold" fontSize="10">hero_hp</text>
                        <text x="90" y="65" fill="#0F172A" textAnchor="middle" fontWeight="bold" fontSize="24">100</text>
                        <text x="90" y="88" fill="#475569" textAnchor="middle" fontSize="10">Type: Integer</text>
                        <text x="90" y="104" fill="#94A3B8" textAnchor="middle" fontSize="9">Addr: 0x7FFE201A</text>
                      </g>
                      <path d="M 215 70 L 245 70" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
                      <g transform="translate(255, 15)">
                        <rect width="180" height="110" rx="10" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.5" />
                        <rect width="180" height="26" rx="10" fill="rgba(124,58,237,0.1)" />
                        <text x="90" y="18" fill="#7C3AED" textAnchor="middle" fontWeight="bold" fontSize="10">player_name</text>
                        <text x="90" y="65" fill="#0F172A" textAnchor="middle" fontWeight="bold" fontSize="20">"Alex"</text>
                        <text x="90" y="88" fill="#475569" textAnchor="middle" fontSize="10">Type: String</text>
                        <text x="90" y="104" fill="#94A3B8" textAnchor="middle" fontSize="9">Addr: 0x7FFE203B</text>
                      </g>
                      <path d="M 450 70 L 480 70" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
                      <g transform="translate(490, 15)">
                        <rect width="170" height="110" rx="10" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
                        <rect width="170" height="26" rx="10" fill="rgba(5,150,105,0.1)" />
                        <text x="85" y="18" fill="#059669" textAnchor="middle" fontWeight="bold" fontSize="10">is_active</text>
                        <text x="85" y="65" fill="#0F172A" textAnchor="middle" fontWeight="bold" fontSize="22">True</text>
                        <text x="85" y="88" fill="#475569" textAnchor="middle" fontSize="10">Type: Boolean</text>
                        <text x="85" y="104" fill="#94A3B8" textAnchor="middle" fontSize="9">Addr: 0x7FFE204C</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Diagram 2: Control Flow */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="text-xs font-bold font-mono text-amber-700 uppercase">
                    Diagram 2: Control Flow Decision Tree (If / Else Branching)
                  </div>
                  <p className="text-xs text-slate-600">
                    The CPU tests a boolean condition. When true, the left branch executes; when false, the right branch executes.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-center">
                    <svg viewBox="0 0 540 180" className="w-full max-w-xl h-auto font-mono text-xs">
                      <rect x="210" y="10" width="120" height="30" rx="6" fill="#0284C7" />
                      <text x="270" y="29" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="10">Start</text>
                      <line x1="270" y1="40" x2="270" y2="60" stroke="#94A3B8" strokeWidth="2" />
                      <polygon points="270,60 350,90 270,120 190,90" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
                      <text x="270" y="93" fill="#D97706" textAnchor="middle" fontWeight="bold" fontSize="10">Score &gt;= 50 ?</text>
                      <line x1="190" y1="90" x2="100" y2="90" stroke="#059669" strokeWidth="2" />
                      <text x="145" y="82" fill="#059669" fontSize="10" fontWeight="bold">TRUE</text>
                      <rect x="30" y="75" width="70" height="30" rx="6" fill="#059669" />
                      <text x="65" y="94" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="10">Pass</text>
                      <line x1="350" y1="90" x2="440" y2="90" stroke="#DC2626" strokeWidth="2" />
                      <text x="395" y="82" fill="#DC2626" fontSize="10" fontWeight="bold">FALSE</text>
                      <rect x="440" y="75" width="70" height="30" rx="6" fill="#DC2626" />
                      <text x="475" y="94" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="10">Retry</text>
                      <line x1="65" y1="105" x2="65" y2="150" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="475" y1="105" x2="475" y2="150" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="65" y1="150" x2="475" y2="150" stroke="#94A3B8" strokeWidth="1.5" />
                      <rect x="210" y="135" width="120" height="30" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                      <text x="270" y="154" fill="#475569" textAnchor="middle" fontSize="10">Continue</text>
                    </svg>
                  </div>
                </div>

                {/* Diagram 3: Loop Repetition Cycle */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="text-xs font-bold font-mono text-emerald-700 uppercase">
                    Diagram 3: Loop Repetition Mechanics (Iteration Cycle)
                  </div>
                  <p className="text-xs text-slate-600">
                    A loop cycles through initialization, test check, execution body, and step increment until the condition evaluates false.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-center">
                    <svg viewBox="0 0 540 140" className="w-full max-w-xl h-auto font-mono text-xs">
                      <rect x="20" y="55" width="80" height="30" rx="6" fill="#0284C7" />
                      <text x="60" y="74" fill="#FFFFFF" textAnchor="middle" fontSize="10">i = 0</text>
                      <line x1="100" y1="70" x2="140" y2="70" stroke="#94A3B8" strokeWidth="2" />
                      <polygon points="190,45 240,70 190,95 140,70" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
                      <text x="190" y="73" fill="#D97706" textAnchor="middle" fontSize="9">i &lt; 5 ?</text>
                      <line x1="240" y1="70" x2="280" y2="70" stroke="#059669" strokeWidth="2" />
                      <text x="260" y="62" fill="#059669" fontSize="9" fontWeight="bold">YES</text>
                      <rect x="280" y="55" width="110" height="30" rx="6" fill="#059669" />
                      <text x="335" y="74" fill="#FFFFFF" textAnchor="middle" fontSize="10">print(i); i++</text>
                      <path d="M 390 70 Q 430 70 430 25 Q 430 10 260 10 Q 190 10 190 45" stroke="#059669" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                      <line x1="190" y1="95" x2="190" y2="120" stroke="#DC2626" strokeWidth="2" />
                      <text x="205" y="112" fill="#DC2626" fontSize="9" fontWeight="bold">NO</text>
                      <rect x="150" y="120" width="80" height="20" rx="4" fill="#F1F5F9" stroke="#CBD5E1" />
                      <text x="190" y="134" fill="#475569" textAnchor="middle" fontSize="9">Exit Loop</text>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════
                TAB 6: PITFALLS & INTERVIEW Q&A
            ═══════════════════════════════════════════════════ */}
            {activeTab === 'pitfalls' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{langDetails.name} — Common Mistakes & Top 1% Interview Concepts</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Gotchas, memory traps, and senior architectural interview answers that separate novices from top engineers.
                  </p>
                </div>

                {/* Common Pitfalls */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-rose-700 font-bold">
                    Common Bugs & Pitfalls
                  </div>
                  {langDetails.commonPitfalls?.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-2">
                      <div className="text-xs font-bold text-rose-800">
                        #{idx + 1} {p.title || p}
                      </div>
                      {p.problem && (
                        <div className="text-xs text-rose-950 bg-rose-50 p-2.5 rounded-xl font-mono border border-rose-100">
                          ❌ Problem: {p.problem}
                        </div>
                      )}
                      {p.solution && (
                        <div className="text-xs text-emerald-950 bg-emerald-50 p-2.5 rounded-xl font-mono border border-emerald-100">
                          ✅ Safe Solution: {p.solution}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Senior Interview Questions & Answers */}
                {langDetails.curatedQuestions?.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold">
                      Top 1% Senior Interview Questions
                    </div>
                    {langDetails.curatedQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                          <span className="text-sky-700 font-mono">Q{idx + 1}:</span>
                          <span>{q.q}</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <span className="text-emerald-700 font-bold font-mono block mb-1">Architecture Answer:</span>
                          {q.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── HIGH-RESOLUTION PRINT / PDF EXPORT ENGINE ──────────────── */}
      <div id="notes-pdf-root" style={{ display: 'none' }} className="print-show">
        {/* Cover Page */}
        <div className="pdf-cover" style={{ minHeight: '98vh', padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', background: '#0F172A', color: 'white' }}>
          <div style={{ fontSize: '13pt', fontFamily: 'monospace', color: '#38BDF8', letterSpacing: '0.2em', marginBottom: '20px' }}>
            CODEHERO ACADEMY // MASTER REFERENCE MANUAL
          </div>
          <h1 style={{ fontSize: '38pt', fontWeight: '900', color: 'white', margin: '0 0 16px 0' }}>
            {langDetails.name} Complete Edition
          </h1>
          <h2 style={{ fontSize: '18pt', color: '#94A3B8', fontWeight: 'normal', margin: '0 0 32px 0' }}>
            All 631 Lessons, 80 Algorithm Puzzles, 40 Bug Cases & Real-World Projects
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '30px 0' }}>
            <div><div style={{ fontSize: '26pt', fontWeight: 'bold', color: '#38BDF8' }}>{totalLessonsInCurriculum}</div><div style={{ fontSize: '10pt', color: '#64748B' }}>Core Lessons</div></div>
            <div><div style={{ fontSize: '26pt', fontWeight: 'bold', color: '#A855F7' }}>80</div><div style={{ fontSize: '10pt', color: '#64748B' }}>Algorithms</div></div>
            <div><div style={{ fontSize: '26pt', fontWeight: 'bold', color: '#EF4444' }}>40</div><div style={{ fontSize: '10pt', color: '#64748B' }}>Forensic Cases</div></div>
            <div><div style={{ fontSize: '26pt', fontWeight: 'bold', color: '#22C55E' }}>15</div><div style={{ fontSize: '10pt', color: '#64748B' }}>Lab Builds</div></div>
          </div>
          <div style={{ marginTop: '50px', fontSize: '10pt', color: '#64748B', fontFamily: 'monospace' }}>
            Exported on: {new Date().toLocaleDateString()} · Target Standard: Top 10-15% Competence
          </div>
        </div>

        {/* Every Single Module & Lesson Printed without Truncation */}
        {langConfig?.curriculum?.map((module, modIdx) => (
          <div key={module.id} className="pdf-chapter" style={{ padding: '30px 20px' }}>
            <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '10pt', color: '#0284C7', fontWeight: 'bold', fontFamily: 'monospace' }}>
                MODULE {String(modIdx + 1).padStart(2, '0')}
              </span>
              <h2 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '4px 0 0 0', color: '#0F172A' }}>
                {module.title}
              </h2>
            </div>

            {module.lessons?.map((lesson, lIdx) => (
              <div key={lesson.id} className="pdf-item-block">
                <h3 style={{ fontSize: '13pt', fontWeight: 'bold', margin: '0 0 6px 0', color: '#1E293B' }}>
                  {modIdx + 1}.{lIdx + 1} {lesson.title} ({lesson.duration})
                </h3>
                <p style={{ fontSize: '10pt', color: '#334155', margin: '0 0 6px 0', whiteSpace: 'pre-line' }}>
                  {lesson.concept}
                </p>
                <div className="pdf-callout">
                  <strong>Task:</strong> {lesson.task}
                </div>
                {lesson.solution && (
                  <pre className="pdf-code-block">
                    {lesson.solution}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
