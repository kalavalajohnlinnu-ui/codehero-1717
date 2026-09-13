import React, { useState, useMemo } from 'react';
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
  ExternalLink
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
  const [openModules, setOpenModules]   = useState({});
  const [expandAll, setExpandAll]       = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  if (!isOpen) return null;

  const langDetails = getLanguageDetails(activeLangId);
  const langConfig  = LANGUAGES.find(l => l.id === activeLangId) || LANGUAGES[0];

  const handlePrint = () => {
    soundService.playSuccess();
    window.print();
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

  return (
    <>
      <style>{PDF_PRINT_CSS}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 print:hidden"
        style={{ background: 'rgba(4,6,12,0.96)', backdropFilter: 'blur(20px)' }}>

        <div className="w-full max-w-6xl flex flex-col overflow-hidden print:hidden"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '16px',
            height: '95vh',
            boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
          }}
          onClick={e => e.stopPropagation()}>

          {/* ── Top Header Strip ───────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-3.5 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm"
                style={{
                  background: 'rgba(0,229,255,0.1)',
                  border: '1px solid rgba(0,229,255,0.25)',
                  color: '#00E5FF',
                }}>
                CH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: '#00E5FF' }}>
                    COMPLETE ACADEMY OMNIBUS & NOTES
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,211,166,0.15)', color: '#22D3A6', border: '1px solid rgba(34,211,166,0.25)' }}>
                    ALL WEB CONTENT INCLUDED
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {langDetails.name} Complete Handbook & Reference Manual
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Picker */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-[10px] font-mono text-slate-400">Language:</span>
                <select
                  value={activeLangId}
                  onChange={e => setActiveLangId(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer">
                  {LANGUAGES.map(l => (
                    <option key={l.id} value={l.id} style={{ background: '#0C0E18' }}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Print / Download Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs font-mono transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #00B4CC 100%)',
                  color: '#06080F',
                  boxShadow: '0 2px 0 #005E70, 0 4px 16px rgba(0,229,255,0.2)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                title="Print or export as high-resolution PDF document">
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              {/* Close */}
              <button
                onClick={() => { soundService.playClick(); onClose(); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Tabs & Search Bar ─────────────────────────────── */}
          <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
            
            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { soundService.playClick(); setActiveTab(t.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0"
                    style={isActive ? {
                      background: 'rgba(0,229,255,0.1)',
                      border: '1px solid rgba(0,229,255,0.28)',
                      color: '#00E5FF'
                    } : {
                      color: '#6B7A96',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#EEF0F8'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6B7A96'; }}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Filter / Search Box */}
            <div className="relative flex items-center min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes, syntax, code..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs font-mono pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
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
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>{langDetails.name} — Complete Curriculum Lessons ({totalLessonsInCurriculum} Lessons)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Every single quest, concept explanation, mission challenge, starter code, and working solution.
                    </p>
                  </div>

                  <button
                    onClick={handleToggleExpandAll}
                    className="px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20">
                    {expandAll ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>

                {filteredModules.map((module, modIdx) => {
                  const isOpen = expandAll || openModules[module.id];
                  const lessonCount = module.lessons?.length || 0;

                  return (
                    <div key={module.id} className="rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.01]">
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-white/[0.03] text-left transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-mono font-bold text-xs text-sky-400">
                            {String(modIdx + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{module.title}</div>
                            <div className="text-xs font-mono text-slate-400">{lessonCount} lessons in module</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          {isOpen ? <ChevronDown className="w-4 h-4 text-sky-400" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Every Single Lesson in this Module (Untruncated) */}
                      {isOpen && module.lessons && (
                        <div className="p-3.5 pt-0 space-y-4 border-t border-white/[0.04]">
                          {module.lessons.map((lesson, lIdx) => (
                            <div key={lesson.id} className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
                              {/* Lesson Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                    {modIdx + 1}.{lIdx + 1}
                                  </span>
                                  <span className="text-sm font-bold text-white">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</span>
                                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">{lesson.badge}</span>
                                </div>
                              </div>

                              {/* Concept Text */}
                              <div className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block mb-1">
                                  Core Concept & Logic
                                </span>
                                <p className="whitespace-pre-line">{lesson.concept}</p>
                              </div>

                              {/* Task Mission */}
                              <div className="text-xs text-amber-200 leading-relaxed bg-amber-500/[0.06] p-3 rounded-lg border border-amber-500/20">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1 mb-1">
                                  <Target className="w-3 h-3" /> Practice Mission / Task
                                </span>
                                <p className="whitespace-pre-line font-medium">{lesson.task}</p>
                              </div>

                              {/* Code Solution with Copy Button */}
                              {lesson.solution && (
                                <div>
                                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 px-1">
                                    <span className="font-bold text-emerald-400">Verified Code Solution</span>
                                    <button
                                      onClick={() => handleCopyCode(lesson.id, lesson.solution)}
                                      className="flex items-center gap-1 hover:text-white transition-colors">
                                      {copiedCodeId === lesson.id ? (
                                        <><Check className="w-3 h-3 text-emerald-400" /> Copied!</>
                                      ) : (
                                        <><Copy className="w-3 h-3" /> Copy Code</>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3 rounded-lg bg-[#070911] border border-emerald-500/20 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
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
                <div className="pb-3 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sword className="w-4 h-4 text-indigo-400" />
                    <span>Algorithm Arena — All 80 Coding Challenges</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    LeetCode-style algorithmic puzzles covering Arrays, Strings, Math, Recursion, Sorting, and Data Structures with complete solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAlgo.map((c, idx) => (
                    <div key={c.id || idx} className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          #{idx + 1} · {c.category || 'General'}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          c.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-300' :
                          c.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {c.difficulty || 'easy'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{c.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                      {c.examples && c.examples[0] && (
                        <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05] font-mono text-[11px] text-slate-400">
                          <div>Input: {c.examples[0].input}</div>
                          <div>Output: {c.examples[0].output}</div>
                        </div>
                      )}

                      {c.solution && (
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span className="text-emerald-400 font-bold">Solution:</span>
                            <button
                              onClick={() => handleCopyCode(`algo-${idx}`, c.solution)}
                              className="hover:text-white transition-colors flex items-center gap-1">
                              {copiedCodeId === `algo-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              Copy
                            </button>
                          </div>
                          <pre className="p-2.5 rounded bg-[#070911] border border-white/[0.06] text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
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
                <div className="pb-3 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Bug Detective — All 40 Forensic Debugging Cases</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Broken code specimens and crime scene files. Study how to identify, explain, and repair real errors.
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredBugs.map((b, idx) => (
                    <div key={b.id || idx} className="p-4 rounded-xl bg-black/40 border border-rose-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-rose-400">
                          {b.caseTitle || `Case #${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          Diagnostic File
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">{b.description}</p>
                      <div className="text-xs font-mono text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        ⚠️ Bug Root Cause: {b.bugDescription}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Broken Code */}
                        <div>
                          <div className="text-[10px] font-mono text-rose-400 font-bold mb-1">❌ Broken Code:</div>
                          <pre className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 text-rose-300 font-mono text-xs overflow-x-auto leading-relaxed">
                            {b.brokenCode}
                          </pre>
                        </div>

                        {/* Fixed Code */}
                        <div>
                          <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">✅ Fixed Solution:</div>
                          <pre className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
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
                <div className="pb-3 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-amber-400" />
                    <span>Project Lab — All 15 Progressive Real-World Builds</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-step hands-on software projects spanning calculators, games, databases, and web tools.
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredProjects.map((p, idx) => (
                    <div key={p.id || idx} className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          Project #{idx + 1} · {p.difficulty || 'beginner'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {p.steps?.length || 0} Progressive Steps
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-slate-300">{p.description}</p>

                      {/* Project Steps */}
                      {p.steps && (
                        <div className="space-y-2 mt-2 pt-2 border-t border-white/[0.05]">
                          {p.steps.map((s, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                              <div className="text-xs font-bold text-slate-200">
                                Step {s.stepNumber || sIdx + 1}: {s.title}
                              </div>
                              <div className="text-xs text-slate-400">{s.description}</div>
                              {s.solution && (
                                <pre className="p-2 rounded bg-[#070911] border border-white/[0.05] text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
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
                <div className="pb-3 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    <span>Visual Architecture & Mental Models</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Clear physical diagrams showing how computers execute logic, manage memory, and branch decisions.
                  </p>
                </div>

                {/* Diagram 1: Memory Model */}
                <div className="p-5 rounded-xl border border-white/[0.08] bg-black/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold font-mono text-sky-400 uppercase">
                      Diagram 1: The Computer RAM Memory Model
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Variables & Addresses</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Variables are labelled memory containers allocated in physical RAM. Each holds a typed value and memory address.
                  </p>

                  <div className="p-4 rounded-xl bg-[#060810] border border-white/10 flex justify-center">
                    <svg viewBox="0 0 680 140" className="w-full max-w-2xl h-auto font-mono text-xs">
                      <g transform="translate(20, 15)">
                        <rect width="180" height="110" rx="10" fill="#090E1E" stroke="#00E5FF" strokeWidth="1.5" />
                        <rect width="180" height="26" rx="10" fill="rgba(0,229,255,0.15)" />
                        <text x="90" y="18" fill="#00E5FF" textAnchor="middle" fontWeight="bold" fontSize="10">hero_hp</text>
                        <text x="90" y="65" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="24">100</text>
                        <text x="90" y="88" fill="#94A3B8" textAnchor="middle" fontSize="10">Type: Integer</text>
                        <text x="90" y="104" fill="#64748B" textAnchor="middle" fontSize="9">Addr: 0x7FFE201A</text>
                      </g>
                      <path d="M 215 70 L 245 70" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                      <g transform="translate(255, 15)">
                        <rect width="180" height="110" rx="10" fill="#1C1427" stroke="#A855F7" strokeWidth="1.5" />
                        <rect width="180" height="26" rx="10" fill="rgba(168,85,247,0.15)" />
                        <text x="90" y="18" fill="#A855F7" textAnchor="middle" fontWeight="bold" fontSize="10">player_name</text>
                        <text x="90" y="65" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="20">"Alex"</text>
                        <text x="90" y="88" fill="#94A3B8" textAnchor="middle" fontSize="10">Type: String</text>
                        <text x="90" y="104" fill="#64748B" textAnchor="middle" fontSize="9">Addr: 0x7FFE203B</text>
                      </g>
                      <path d="M 450 70 L 480 70" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                      <g transform="translate(490, 15)">
                        <rect width="170" height="110" rx="10" fill="#0A1D1A" stroke="#22D3A6" strokeWidth="1.5" />
                        <rect width="170" height="26" rx="10" fill="rgba(34,211,166,0.15)" />
                        <text x="85" y="18" fill="#22D3A6" textAnchor="middle" fontWeight="bold" fontSize="10">is_active</text>
                        <text x="85" y="65" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="22">True</text>
                        <text x="85" y="88" fill="#94A3B8" textAnchor="middle" fontSize="10">Type: Boolean</text>
                        <text x="85" y="104" fill="#64748B" textAnchor="middle" fontSize="9">Addr: 0x7FFE204C</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Diagram 2: Control Flow */}
                <div className="p-5 rounded-xl border border-white/[0.08] bg-black/40 space-y-3">
                  <div className="text-xs font-bold font-mono text-amber-400 uppercase">
                    Diagram 2: Control Flow Decision Tree (If / Else Branching)
                  </div>
                  <p className="text-xs text-slate-300">
                    The CPU tests a boolean condition. When true, the left branch executes; when false, the right branch executes.
                  </p>

                  <div className="p-4 rounded-xl bg-[#060810] border border-white/10 flex justify-center">
                    <svg viewBox="0 0 540 180" className="w-full max-w-xl h-auto font-mono text-xs">
                      <rect x="210" y="10" width="120" height="30" rx="6" fill="#0284C7" />
                      <text x="270" y="29" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="10">Start</text>
                      <line x1="270" y1="40" x2="270" y2="60" stroke="#64748B" strokeWidth="2" />
                      <polygon points="270,60 350,90 270,120 190,90" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                      <text x="270" y="93" fill="#F59E0B" textAnchor="middle" fontWeight="bold" fontSize="10">Score &gt;= 50 ?</text>
                      <line x1="190" y1="90" x2="100" y2="90" stroke="#22D3A6" strokeWidth="2" />
                      <text x="145" y="82" fill="#22D3A6" fontSize="10" fontWeight="bold">TRUE</text>
                      <rect x="30" y="75" width="70" height="30" rx="6" fill="#065F46" />
                      <text x="65" y="94" fill="#A7F3D0" textAnchor="middle" fontWeight="bold" fontSize="10">Pass</text>
                      <line x1="350" y1="90" x2="440" y2="90" stroke="#EF4444" strokeWidth="2" />
                      <text x="395" y="82" fill="#EF4444" fontSize="10" fontWeight="bold">FALSE</text>
                      <rect x="440" y="75" width="70" height="30" rx="6" fill="#991B1B" />
                      <text x="475" y="94" fill="#FECACA" textAnchor="middle" fontWeight="bold" fontSize="10">Retry</text>
                      <line x1="65" y1="105" x2="65" y2="150" stroke="#64748B" strokeWidth="1.5" />
                      <line x1="475" y1="105" x2="475" y2="150" stroke="#64748B" strokeWidth="1.5" />
                      <line x1="65" y1="150" x2="475" y2="150" stroke="#64748B" strokeWidth="1.5" />
                      <rect x="210" y="135" width="120" height="30" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                      <text x="270" y="154" fill="#94A3B8" textAnchor="middle" fontSize="10">Continue</text>
                    </svg>
                  </div>
                </div>

                {/* Diagram 3: Loop Repetition Cycle */}
                <div className="p-5 rounded-xl border border-white/[0.08] bg-black/40 space-y-3">
                  <div className="text-xs font-bold font-mono text-emerald-400 uppercase">
                    Diagram 3: Loop Repetition Mechanics (Iteration Cycle)
                  </div>
                  <p className="text-xs text-slate-300">
                    A loop cycles through initialization, test check, execution body, and step increment until the condition evaluates false.
                  </p>

                  <div className="p-4 rounded-xl bg-[#060810] border border-white/10 flex justify-center">
                    <svg viewBox="0 0 540 140" className="w-full max-w-xl h-auto font-mono text-xs">
                      <rect x="20" y="55" width="80" height="30" rx="6" fill="#0284C7" />
                      <text x="60" y="74" fill="#FFFFFF" textAnchor="middle" fontSize="10">i = 0</text>
                      <line x1="100" y1="70" x2="140" y2="70" stroke="#64748B" strokeWidth="2" />
                      <polygon points="190,45 240,70 190,95 140,70" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                      <text x="190" y="73" fill="#F59E0B" textAnchor="middle" fontSize="9">i &lt; 5 ?</text>
                      <line x1="240" y1="70" x2="280" y2="70" stroke="#22D3A6" strokeWidth="2" />
                      <text x="260" y="62" fill="#22D3A6" fontSize="9" fontWeight="bold">YES</text>
                      <rect x="280" y="55" width="110" height="30" rx="6" fill="#065F46" />
                      <text x="335" y="74" fill="#A7F3D0" textAnchor="middle" fontSize="10">print(i); i++</text>
                      <path d="M 390 70 Q 430 70 430 25 Q 430 10 260 10 Q 190 10 190 45" stroke="#22D3A6" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                      <line x1="190" y1="95" x2="190" y2="120" stroke="#EF4444" strokeWidth="2" />
                      <text x="205" y="112" fill="#EF4444" fontSize="9" fontWeight="bold">NO</text>
                      <rect x="150" y="120" width="80" height="20" rx="4" fill="#1E293B" />
                      <text x="190" y="134" fill="#94A3B8" textAnchor="middle" fontSize="9">Exit Loop</text>
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
                <div className="pb-3 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{langDetails.name} — Common Mistakes & Top 1% Interview Concepts</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Gotchas, memory traps, and senior architectural interview answers that separate novices from top engineers.
                  </p>
                </div>

                {/* Common Pitfalls */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                    Common Bugs & Pitfalls
                  </div>
                  {langDetails.commonPitfalls?.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-black/40 border border-rose-500/20 space-y-2">
                      <div className="text-xs font-bold text-rose-300">
                        #{idx + 1} {p.title || p}
                      </div>
                      {p.problem && (
                        <div className="text-xs text-slate-300 bg-rose-950/20 p-2.5 rounded font-mono">
                          ❌ Problem: {p.problem}
                        </div>
                      )}
                      {p.solution && (
                        <div className="text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded font-mono">
                          ✅ Safe Solution: {p.solution}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Senior Interview Questions & Answers */}
                {langDetails.curatedQuestions?.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                    <div className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
                      Top 1% Senior Interview Questions
                    </div>
                    {langDetails.curatedQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                        <div className="text-xs font-bold text-white flex items-start gap-2">
                          <span className="text-sky-400 font-mono">Q{idx + 1}:</span>
                          <span>{q.q}</span>
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                          <span className="text-emerald-400 font-bold font-mono block mb-1">Architecture Answer:</span>
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
