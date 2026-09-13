import React, { useState } from 'react';
import { 
  BookOpen, 
  Printer, 
  X, 
  FileText, 
  Cpu, 
  Layers, 
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Code2,
  Check
} from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { getLanguageDetails } from '../data/languages/languageDetails';
import { soundService } from '../services/soundService';

/* ── Print/PDF Styles injected once ─────────────────────── */
const PDF_PRINT_CSS = `
@media print {
  @page {
    size: A4;
    margin: 18mm 16mm;
  }
  body * { visibility: hidden; }
  #notes-pdf-root, #notes-pdf-root * { visibility: visible; }
  #notes-pdf-root {
    position: absolute; left: 0; top: 0;
    width: 100%; background: white !important;
    color: #111 !important; font-family: 'Inter', sans-serif;
  }
  .print-hide { display: none !important; }
  .print-show { display: block !important; }
  .pdf-cover { page-break-after: always; }
  .pdf-chapter { page-break-before: always; }
  .pdf-code-block {
    background: #F1F5F9 !important; color: #1E293B !important;
    border: 1px solid #CBD5E1 !important; border-radius: 8px;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px !important;
  }
  .pdf-callout-tip    { background: #ECFDF5 !important; border-left-color: #22C55E !important; color: #14532D !important; }
  .pdf-callout-warn   { background: #FFFBEB !important; border-left-color: #F59E0B !important; color: #78350F !important; }
  .pdf-callout-danger { background: #FEF2F2 !important; border-left-color: #EF4444 !important; color: #7F1D1D !important; }
  .pdf-callout-info   { background: #EFF6FF !important; border-left-color: #3B82F6 !important; color: #1E3A5F !important; }
  h1, h2, h3, h4 { color: #0F172A !important; }
  p, li, span { color: #334155 !important; }
  .pdf-accent { color: #0284C7 !important; }
}
`;

export function DigitalNotesModal({ isOpen, onClose, currentLanguageId = 'python' }) {
  const [activeLangId, setActiveLangId] = useState(currentLanguageId);
  const [activeTab, setActiveTab]       = useState('diagrams');
  const [openModules, setOpenModules]   = useState({});

  if (!isOpen) return null;

  const langDetails = getLanguageDetails(activeLangId);
  const langConfig  = LANGUAGES.find(l => l.id === activeLangId) || LANGUAGES[0];

  const handlePrint = () => {
    soundService.playSuccess();
    window.print();
  };

  const toggleModule = (id) => setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

  const tabList = [
    { id: 'diagrams',   label: 'Visual Diagrams',     emoji: '🖼️' },
    { id: 'curriculum', label: 'Lessons Handbook',    emoji: '📖' },
    { id: 'pitfalls',   label: 'Common Mistakes',     emoji: '⚠️' },
  ];

  return (
    <>
      {/* Inject print CSS */}
      <style>{PDF_PRINT_CSS}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 print:hidden"
        style={{ background: 'rgba(6,8,15,0.95)', backdropFilter: 'blur(20px)' }}>

        <div className="w-full max-w-5xl flex flex-col overflow-hidden print:hidden"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '16px',
            maxHeight: '94vh',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          }}
          onClick={e => e.stopPropagation()}>

          {/* ── Header ────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(0,229,255,0.08)',
                  border: '1px solid rgba(0,229,255,0.2)',
                }}>
                <BookOpen className="w-5 h-5" style={{ color: '#00E5FF' }} />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#4B5568' }}>
                  Illustrated Digital Handbook
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {langDetails.name} — Master Notes & PDF
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs font-mono transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #00B4CC 100%)',
                  color: '#06080F',
                  boxShadow: '0 2px 0 #005E70, 0 4px 16px rgba(0,229,255,0.2)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Printer className="w-3.5 h-3.5" />
                Download / Print PDF
              </button>
              <button
                onClick={() => { soundService.playClick(); onClose(); }}
                className="p-2 rounded-xl transition-all"
                style={{ color: '#4B5568' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#EEF0F8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5568'; }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Nav bar ───────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex gap-1">
              {tabList.map(t => (
                <button key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all"
                  style={activeTab === t.id ? {
                    background: 'rgba(0,229,255,0.09)',
                    border: '1px solid rgba(0,229,255,0.25)',
                    color: '#00E5FF'
                  } : {
                    color: '#6B7A96',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#EEF0F8'; }}
                  onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#6B7A96'; }}>
                  <span>{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Language selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono" style={{ color: '#4B5568' }}>Language:</span>
              <select
                value={activeLangId}
                onChange={e => setActiveLangId(e.target.value)}
                className="text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#EEF0F8',
                }}>
                {LANGUAGES.map(l => (
                  <option key={l.id} value={l.id} style={{ background: '#0C0E18' }}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Tab Content ───────────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">

            {/* ═══════════════════════════════════
                TAB: Visual Diagrams
            ═══════════════════════════════════ */}
            {activeTab === 'diagrams' && (
              <div className="space-y-8">
                <SectionHeading index="01" title="Visual Architecture & Mental Models" />

                {/* Diagram 1: Memory Model */}
                <DiagramCard
                  title="The Memory Model — How Variables Live in RAM"
                  description={`When you write ${langDetails.name === 'Python' ? 'score = 100' : 'var score = 100'}, the computer allocates a labelled box in RAM, stores the value, and tags it with a data type. Understanding this is the foundation of all programming logic.`}>
                  <svg viewBox="0 0 700 170" className="w-full max-w-2xl h-auto mx-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {/* Box 1 */}
                    <g transform="translate(30, 20)">
                      <rect width="185" height="120" rx="12" fill="#090E1E" stroke="rgba(0,229,255,0.6)" strokeWidth="1.5" />
                      <rect width="185" height="30" rx="12" fill="rgba(0,229,255,0.15)" />
                      <text x="92" y="21" fill="#00E5FF" textAnchor="middle" fontWeight="700" fontSize="10">name = "hero"</text>
                      <text x="92" y="68" fill="#EEF0F8" textAnchor="middle" fontWeight="700" fontSize="20">"hero"</text>
                      <text x="92" y="92" fill="#6B7A96" textAnchor="middle" fontSize="10">Type: str (String)</text>
                      <text x="92" y="110" fill="#4B5568" textAnchor="middle" fontSize="9">RAM: 0x7FFE201A</text>
                    </g>
                    <path d="M 225 80 L 255 80" stroke="#2D3552" strokeWidth="1.5" strokeDasharray="4 3" />
                    {/* Box 2 */}
                    <g transform="translate(265, 20)">
                      <rect width="185" height="120" rx="12" fill="#0E0A1E" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" />
                      <rect width="185" height="30" rx="12" fill="rgba(139,92,246,0.15)" />
                      <text x="92" y="21" fill="#A78BFA" textAnchor="middle" fontWeight="700" fontSize="10">score = 100</text>
                      <text x="92" y="68" fill="#EEF0F8" textAnchor="middle" fontWeight="700" fontSize="26">100</text>
                      <text x="92" y="92" fill="#6B7A96" textAnchor="middle" fontSize="10">Type: int (Integer)</text>
                      <text x="92" y="110" fill="#4B5568" textAnchor="middle" fontSize="9">RAM: 0x7FFE202B</text>
                    </g>
                    <path d="M 460 80 L 490 80" stroke="#2D3552" strokeWidth="1.5" strokeDasharray="4 3" />
                    {/* Box 3 */}
                    <g transform="translate(500, 20)">
                      <rect width="170" height="120" rx="12" fill="#0E1A0A" stroke="rgba(34,211,166,0.6)" strokeWidth="1.5" />
                      <rect width="170" height="30" rx="12" fill="rgba(34,211,166,0.15)" />
                      <text x="85" y="21" fill="#22D3A6" textAnchor="middle" fontWeight="700" fontSize="10">alive = True</text>
                      <text x="85" y="68" fill="#EEF0F8" textAnchor="middle" fontWeight="700" fontSize="20">True</text>
                      <text x="85" y="92" fill="#6B7A96" textAnchor="middle" fontSize="10">Type: bool</text>
                      <text x="85" y="110" fill="#4B5568" textAnchor="middle" fontSize="9">RAM: 0x7FFE2040</text>
                    </g>
                    {/* Label */}
                    <text x="350" y="158" fill="#4B5568" textAnchor="middle" fontSize="9">Computer RAM Memory — Each variable occupies a named slot with a type and address</text>
                  </svg>
                </DiagramCard>

                {/* Diagram 2: Control Flow */}
                <DiagramCard
                  title="Control Flow — How Your Code Makes Decisions"
                  description="Every program is a series of decisions and loops. The flowchart below shows how an if/else statement evaluates a condition and routes execution one of two ways.">
                  <svg viewBox="0 0 620 260" className="w-full max-w-2xl h-auto mx-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {/* Start */}
                    <rect x="235" y="10" width="150" height="36" rx="18" fill="rgba(0,229,255,0.15)" stroke="rgba(0,229,255,0.5)" strokeWidth="1.5" />
                    <text x="310" y="33" fill="#00E5FF" textAnchor="middle" fontSize="11" fontWeight="700">Program Starts</text>
                    {/* Arrow */}
                    <line x1="310" y1="46" x2="310" y2="72" stroke="#2D3552" strokeWidth="1.5" />
                    <polygon points="305,70 315,70 310,78" fill="#2D3552" />
                    {/* Diamond decision */}
                    <polygon points="310,80 420,130 310,180 200,130" fill="#0C0E18" stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" />
                    <text x="310" y="127" fill="#F59E0B" textAnchor="middle" fontSize="11" fontWeight="700">condition</text>
                    <text x="310" y="141" fill="#F59E0B" textAnchor="middle" fontSize="11" fontWeight="700">True?</text>
                    {/* YES branch */}
                    <line x1="200" y1="130" x2="80" y2="130" stroke="#22D3A6" strokeWidth="1.5" />
                    <text x="138" y="122" fill="#22D3A6" fontSize="10" fontWeight="700">YES</text>
                    <rect x="15" y="108" width="120" height="44" rx="10" fill="rgba(34,211,166,0.08)" stroke="rgba(34,211,166,0.4)" strokeWidth="1.5" />
                    <text x="75" y="131" fill="#22D3A6" textAnchor="middle" fontSize="11" fontWeight="700">Do A</text>
                    <text x="75" y="146" fill="#6B7A96" textAnchor="middle" fontSize="9">if block runs</text>
                    {/* NO branch */}
                    <line x1="420" y1="130" x2="540" y2="130" stroke="#FF5370" strokeWidth="1.5" />
                    <text x="476" y="122" fill="#FF5370" fontSize="10" fontWeight="700">NO</text>
                    <rect x="484" y="108" width="120" height="44" rx="10" fill="rgba(255,83,112,0.08)" stroke="rgba(255,83,112,0.4)" strokeWidth="1.5" />
                    <text x="544" y="131" fill="#FF5370" textAnchor="middle" fontSize="11" fontWeight="700">Do B</text>
                    <text x="544" y="146" fill="#6B7A96" textAnchor="middle" fontSize="9">else block runs</text>
                    {/* Merge & end */}
                    <line x1="75" y1="152" x2="75" y2="220" stroke="#22D3A6" strokeWidth="1.5" />
                    <line x1="544" y1="152" x2="544" y2="220" stroke="#FF5370" strokeWidth="1.5" />
                    <line x1="75" y1="220" x2="544" y2="220" stroke="#2D3552" strokeWidth="1.5" />
                    <polygon points="308,218 312,218 310,226" fill="#2D3552" />
                    <rect x="235" y="226" width="150" height="30" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <text x="310" y="246" fill="#6B7A96" textAnchor="middle" fontSize="11">Continue →</text>
                  </svg>
                </DiagramCard>

                {/* Diagram 3: Loop Cycle */}
                <DiagramCard
                  title="Loop Mechanics — How Loops Repeat Until Done"
                  description="A loop keeps executing a block of code until a condition becomes false. Each pass through is called an iteration. Loops power everything from processing lists to game update cycles.">
                  <svg viewBox="0 0 600 200" className="w-full max-w-2xl h-auto mx-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {/* Init */}
                    <rect x="30" y="80" width="100" height="40" rx="8" fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.4)" strokeWidth="1.5" />
                    <text x="80" y="97" fill="#00E5FF" textAnchor="middle" fontSize="10" fontWeight="700">Initialize</text>
                    <text x="80" y="112" fill="#6B7A96" textAnchor="middle" fontSize="9">i = 0</text>
                    <line x1="130" y1="100" x2="155" y2="100" stroke="#2D3552" strokeWidth="1.5" />
                    <polygon points="153,96 161,100 153,104" fill="#2D3552" />
                    {/* Check */}
                    <polygon points="200,60 280,100 200,140 120,100" transform="translate(40,0)" fill="#0C0E18" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
                    <text x="240" y="97" fill="#F59E0B" textAnchor="middle" fontSize="10" fontWeight="700">i &lt; 5 ?</text>
                    <text x="240" y="111" fill="#6B7A96" textAnchor="middle" fontSize="9">condition</text>
                    {/* YES → body */}
                    <line x1="320" y1="100" x2="350" y2="100" stroke="#22D3A6" strokeWidth="1.5" />
                    <text x="334" y="92" fill="#22D3A6" fontSize="9" fontWeight="700">YES</text>
                    <polygon points="348,96 356,100 348,104" fill="#22D3A6" />
                    <rect x="356" y="78" width="110" height="44" rx="8" fill="rgba(34,211,166,0.08)" stroke="rgba(34,211,166,0.4)" strokeWidth="1.5" />
                    <text x="411" y="97" fill="#22D3A6" textAnchor="middle" fontSize="10" fontWeight="700">Run Body</text>
                    <text x="411" y="112" fill="#6B7A96" textAnchor="middle" fontSize="9">print(i); i += 1</text>
                    {/* Loop back arrow */}
                    <path d="M 466,100 Q 520,100 520,40 Q 520,10 411,10 Q 280,10 240,60" stroke="#22D3A6" strokeWidth="1.5" fill="none" strokeDasharray="5 3" />
                    <polygon points="237,56 243,56 240,64" fill="#22D3A6" />
                    <text x="500" y="35" fill="#22D3A6" fontSize="9" fontWeight="700">loop back</text>
                    {/* NO → end */}
                    <line x1="240" y1="140" x2="240" y2="172" stroke="#FF5370" strokeWidth="1.5" />
                    <text x="252" y="160" fill="#FF5370" fontSize="9" fontWeight="700">NO</text>
                    <rect x="168" y="172" width="144" height="24" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <text x="240" y="189" fill="#6B7A96" textAnchor="middle" fontSize="10">Loop ends → continue</text>
                  </svg>
                </DiagramCard>

                {/* Callout tips */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Callout type="tip" title="Top 1% Insight">
                    Understanding memory allocation means you can predict where bugs come from — 
                    most crashes are caused by accessing memory that doesn't belong to your program.
                  </Callout>
                  <Callout type="info" title="Why This Matters">
                    These three mental models (memory, control flow, loops) apply to ALL 7 languages. 
                    Master them once and they transfer everywhere.
                  </Callout>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════
                TAB: Curriculum Handbook
            ═══════════════════════════════════ */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <SectionHeading index="02" title={`${langDetails.name} — All Lessons Handbook`} />
                <p className="text-xs leading-relaxed" style={{ color: '#6B7A96' }}>
                  Every module and lesson in the {langDetails.name} curriculum. Click a module to expand its lessons.
                </p>

                {langConfig?.curriculum?.map((module, modIdx) => {
                  const isOpen = openModules[module.id];
                  return (
                    <div key={module.id} className="rounded-xl overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center gap-3 p-4 text-left transition-all"
                        style={{ background: isOpen ? 'rgba(0,229,255,0.04)' : 'rgba(255,255,255,0.02)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = isOpen ? 'rgba(0,229,255,0.04)' : 'rgba(255,255,255,0.02)'}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs"
                          style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)' }}>
                          {String(modIdx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">{module.title}</div>
                          <div className="text-[11px] font-mono mt-0.5" style={{ color: '#4B5568' }}>
                            {module.lessons?.length || 0} lessons
                          </div>
                        </div>
                        {isOpen
                          ? <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#00E5FF' }} />
                          : <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#4B5568' }} />}
                      </button>

                      {isOpen && module.lessons?.length > 0 && (
                        <div className="px-4 pb-4 pt-2 space-y-2"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          {module.lessons.slice(0, 4).map((lesson, lIdx) => (
                            <div key={lesson.id} className="rounded-lg p-3"
                              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] font-mono mt-0.5 shrink-0 font-bold"
                                  style={{ color: '#4B5568' }}>
                                  {String(modIdx + 1)}.{lIdx + 1}
                                </span>
                                <div>
                                  <div className="text-xs font-semibold text-white">{lesson.title}</div>
                                  <p className="text-[11px] leading-relaxed mt-1"
                                    style={{ color: '#6B7A96' }}>
                                    {lesson.concept?.split('\n')[0]?.substring(0, 140)}…
                                  </p>
                                  {lesson.solution && (
                                    <div className="mt-2 p-2.5 rounded-lg overflow-x-auto text-[11px] leading-relaxed"
                                      style={{
                                        background: '#07090F',
                                        border: '1px solid rgba(0,229,255,0.1)',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        color: '#22D3A6',
                                      }}>
                                      <pre>{lesson.solution.substring(0, 200)}</pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {module.lessons.length > 4 && (
                            <div className="text-[11px] font-mono text-center py-1" style={{ color: '#4B5568' }}>
                              + {module.lessons.length - 4} more lessons in this module…
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ═══════════════════════════════════
                TAB: Common Mistakes
            ═══════════════════════════════════ */}
            {activeTab === 'pitfalls' && (
              <div className="space-y-6">
                <SectionHeading index="03" title={`${langDetails.name} — Common Mistakes & How to Fix Them`} />
                <p className="text-xs leading-relaxed" style={{ color: '#6B7A96' }}>
                  These are the exact errors that separate beginners from expert {langDetails.name} programmers. 
                  Study each one carefully.
                </p>

                {langDetails.commonPitfalls?.map((pitfall, idx) => (
                  <PitfallCard key={idx} index={idx + 1} pitfall={pitfall} />
                ))}

                {(!langDetails.commonPitfalls || langDetails.commonPitfalls.length === 0) && (
                  <div className="p-6 rounded-xl text-center"
                    style={{ border: '1px solid rgba(255,255,255,0.06)', color: '#4B5568' }}>
                    <span className="text-3xl block mb-2">📚</span>
                    <p className="text-xs font-mono">Common mistakes data for {langDetails.name} is being compiled.</p>
                  </div>
                )}

                {/* Universal pitfalls */}
                <div className="mt-8">
                  <SectionHeading index="03B" title="Universal Rules (Every Language)" />
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      { title: 'Off-by-one errors', desc: 'Loops that go one step too far or stop one step too early. Always double-check loop boundaries.' },
                      { title: 'Undefined variable', desc: 'Using a variable before you assign it a value. Always initialize variables before use.' },
                      { title: 'Wrong data type', desc: 'Mixing strings and numbers without conversion. Use int(), str(), or parseFloat() to convert.' },
                      { title: 'Infinite loop', desc: 'A loop whose condition never becomes false. Always make sure your loop variable changes each iteration.' },
                    ].map((rule, i) => (
                      <Callout key={i} type="warn" title={rule.title}>
                        {rule.desc}
                      </Callout>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PRINT / PDF OUTPUT ROOT (invisible on screen, visible when printed) ── */}
      <div id="notes-pdf-root" style={{ display: 'none' }} className="print-show">
        <PDFDocument langDetails={langDetails} langConfig={langConfig} />
      </div>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function SectionHeading({ index, title }) {
  return (
    <div className="flex items-center gap-3 pb-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xs font-mono font-bold" style={{ color: '#00E5FF' }}>{index} //</span>
      <h3 className="text-sm font-bold text-white">{title}</h3>
    </div>
  );
}

function DiagramCard({ title, description, children }) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4" style={{ color: '#F59E0B' }} />
          <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>{title}</span>
        </div>
        <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: '#6B7A96' }}>{description}</p>
      </div>
      <div className="p-5"
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        {children}
      </div>
    </div>
  );
}

function Callout({ type, title, children }) {
  const styles = {
    tip:    { bg: 'rgba(34,211,166,0.06)',  border: '#22D3A6', color: '#22D3A6' },
    info:   { bg: 'rgba(0,229,255,0.05)',   border: '#00E5FF', color: '#00E5FF' },
    warn:   { bg: 'rgba(245,158,11,0.06)',  border: '#F59E0B', color: '#F59E0B' },
    danger: { bg: 'rgba(255,83,112,0.06)',  border: '#FF5370', color: '#FF5370' },
  };
  const s = styles[type] || styles.info;
  return (
    <div className="p-4 rounded-xl text-xs leading-relaxed"
      style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}>
      <div className="font-bold mb-1.5" style={{ color: s.color }}>{title}</div>
      <div style={{ color: '#8892AA' }}>{children}</div>
    </div>
  );
}

function PitfallCard({ index, pitfall }) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,83,112,0.2)', background: 'rgba(255,83,112,0.03)' }}>
      <div className="flex items-center gap-2.5 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,83,112,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-black text-xs shrink-0"
          style={{ background: 'rgba(255,83,112,0.15)', border: '1px solid rgba(255,83,112,0.3)', color: '#FF5370' }}>
          {index}
        </div>
        <span className="text-xs font-bold" style={{ color: '#FF5370' }}>
          {typeof pitfall === 'string' ? pitfall.split(':')[0] : pitfall.title || `Pitfall ${index}`}
        </span>
        <AlertTriangle className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: '#FF5370' }} />
      </div>
      <div className="px-4 py-3 text-xs leading-relaxed" style={{ color: '#8892AA' }}>
        {typeof pitfall === 'string' ? pitfall : (pitfall.explanation || pitfall.fix || String(pitfall))}
      </div>
    </div>
  );
}

/* ─── PDF Print Document ─────────────────────────────────── */
function PDFDocument({ langDetails, langConfig }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#0F172A', background: 'white' }}>
      {/* Cover page */}
      <div className="pdf-cover" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '60px 40px',
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)'
      }}>
        <div style={{
          background: 'rgba(0,229,255,0.1)', border: '2px solid rgba(0,229,255,0.4)',
          borderRadius: '20px', padding: '16px 24px', marginBottom: '32px',
          color: '#00E5FF', fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px', fontWeight: '700', letterSpacing: '0.2em'
        }}>
          CODEHERO ACADEMY — MASTER NOTES
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
          {langDetails.name}
        </h1>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'rgba(0,229,255,0.8)', marginBottom: '24px' }}>
          Complete Curriculum & Visual Handbook
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', maxWidth: '480px', lineHeight: 1.6, marginBottom: '48px' }}>
          A comprehensive reference covering all modules, visual architecture diagrams, 
          code examples, and expert-level pitfall guides. 
          Designed to bring you to the Top 1% of {langDetails.name} engineers.
        </p>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
          {[
            { v: langConfig?.curriculum?.length || 0, l: 'Modules' },
            { v: langConfig?.curriculum?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0, l: 'Lessons' },
            { v: '100%', l: 'Free' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#00E5FF' }}>{s.v}</div>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '60px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
          Printed: {new Date().toLocaleDateString()} · codehero-academy.github.io
        </div>
      </div>

      {/* Chapter pages */}
      {langConfig?.curriculum?.map((module, modIdx) => (
        <div key={module.id} className="pdf-chapter" style={{ padding: '48px 40px', pageBreakBefore: 'always' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E2E8F0' }}>
            <div style={{
              background: '#0F172A', color: '#00E5FF', borderRadius: '12px',
              padding: '12px 16px', fontSize: '20px', fontWeight: '900',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              {String(modIdx + 1).padStart(2, '0')}
            </div>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#94A3B8', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                Module {modIdx + 1} of {langConfig.curriculum.length}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                {module.title}
              </h2>
            </div>
          </div>

          {module.lessons?.slice(0, 5).map((lesson, lIdx) => (
            <div key={lesson.id} style={{ marginBottom: '20px', breakInside: 'avoid' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', color: '#1D4ED8', fontFamily: "'JetBrains Mono', monospace", fontWeight: '700' }}>
                  {modIdx + 1}.{lIdx + 1}
                </span>
                {lesson.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7, marginBottom: '8px' }}>
                {lesson.concept?.split('\n')[0]?.substring(0, 200)}
              </p>
              {lesson.solution && (
                <pre style={{
                  background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px',
                  padding: '12px 16px', fontSize: '11px', color: '#0F172A',
                  fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
                  overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  marginBottom: 0,
                }}>
                  {lesson.solution.substring(0, 300)}
                </pre>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
