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
  Layers, 
  HelpCircle,
  Eye,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { getLanguageDetails } from '../data/languages/languageDetails';
import { soundService } from '../services/soundService';

export function DigitalNotesModal({ isOpen, onClose, currentLanguageId = 'python' }) {
  const [activeLangId, setActiveLangId] = useState(currentLanguageId);
  const [activeTab, setActiveTab] = useState('diagrams'); // 'diagrams' | 'curriculum' | 'pitfalls' | 'print'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const langDetails = getLanguageDetails(activeLangId);
  const langConfig = LANGUAGES.find(l => l.id === activeLangId) || LANGUAGES[0];

  const handlePrint = () => {
    soundService.playSuccess();
    window.print();
  };

  const handleCopyNotes = () => {
    soundService.playClick();
    const textToCopy = `CodeHero Master Notes: ${langDetails.name}\n\nCore Concepts, Memory Models, and All Lessons Handbook.\nAvailable online at CodeHero Universe.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div 
        className="bg-[#090C14] border border-sky-500/30 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-slate-200 print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Hidden in Print) */}
        <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-[#090C14] p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              📘
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                  ILLUSTRATED DIGITAL HANDBOOK
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {langDetails.name} Complete Edition
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Master Curriculum Notes, Visual Diagrams & PDF Book
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-sky-500/20 hover:opacity-90 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation & Language Switcher (Hidden in Print) */}
        <div className="px-4 py-2 border-b border-white/[0.06] bg-[#0A0D17] flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden">
          {/* Section Tabs */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveTab('diagrams')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'diagrams'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🖼️ Visual Diagrams (Pics)
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 All Lessons Handbook
            </button>
            <button
              onClick={() => setActiveTab('pitfalls')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'pitfalls'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚠️ Common Mistakes & Fixes
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400">Language:</span>
            <select
              value={activeLangId}
              onChange={e => setActiveLangId(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            >
              {LANGUAGES.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 font-sans print:overflow-visible print:p-0">
          {/* PRINT-ONLY COVER HEADER */}
          <div className="hidden print:block text-center border-b-2 border-slate-900 pb-6 mb-6">
            <div className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              CodeHero Academy // Master Engineering Notes
            </div>
            <div className="text-lg font-bold text-sky-700 mt-1">
              {langDetails.name} Complete Curriculum & Visual Architecture
            </div>
            <div className="text-xs text-slate-500 mt-2 font-mono">
              Printed on: {new Date().toLocaleDateString()} · Target Standard: Top 1% Competence
            </div>
          </div>

          {/* TAB 1: VISUAL DIAGRAMS (PICS) */}
          {(activeTab === 'diagrams' || activeTab === 'curriculum') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <span className="text-sky-400">01 //</span>
                  <span>Visual Architecture & Mental Models</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">High-Resolution Visual Guides</span>
              </div>

              {/* DIAGRAM 1: THE MEMORY MODEL (RAM ALLOCATION) */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3 print:border print:border-slate-300 print:text-black">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-amber-300 uppercase font-mono flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>Diagram 1: The Memory Model (How Variables Live in RAM)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">RAM Allocation</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  When you assign a variable like <code className="text-sky-300 font-mono">player_score = 100</code>, the computer creates a labelled memory box at a physical RAM address, stores the value, and tags it with a data type:
                </p>

                {/* SVG Visual Graphic for Memory Jars */}
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex items-center justify-center overflow-x-auto print:bg-slate-100 print:border-slate-300">
                  <svg viewBox="0 0 700 160" className="w-full max-w-2xl h-auto font-mono text-xs">
                    {/* Box 1: Integer */}
                    <g transform="translate(40, 20)">
                      <rect width="180" height="110" rx="14" fill="#0E1626" stroke="#0284C7" strokeWidth="2" />
                      <rect width="180" height="28" rx="14" fill="#0284C7" fillOpacity="0.2" />
                      <text x="90" y="19" fill="#38BDF8" textAnchor="middle" fontWeight="bold" fontSize="11">VARIABLE: hero_hp</text>
                      <text x="90" y="60" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="22">100</text>
                      <text x="90" y="85" fill="#94A3B8" textAnchor="middle" fontSize="10">Type: Integer (int)</text>
                      <text x="90" y="102" fill="#64748B" textAnchor="middle" fontSize="9">RAM Addr: 0x7FFE201A</text>
                    </g>

                    {/* Arrow 1 */}
                    <path d="M 230 75 L 260 75" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Box 2: String */}
                    <g transform="translate(270, 20)">
                      <rect width="180" height="110" rx="14" fill="#1C1427" stroke="#A855F7" strokeWidth="2" />
                      <rect width="180" height="28" rx="14" fill="#A855F7" fillOpacity="0.2" />
                      <text x="90" y="19" fill="#C084FC" textAnchor="middle" fontWeight="bold" fontSize="11">VARIABLE: hero_name</text>
                      <text x="90" y="60" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="18">"Aria Fox"</text>
                      <text x="90" y="85" fill="#94A3B8" textAnchor="middle" fontSize="10">Type: String (str)</text>
                      <text x="90" y="102" fill="#64748B" textAnchor="middle" fontSize="9">RAM Addr: 0x7FFE202B</text>
                    </g>

                    {/* Arrow 2 */}
                    <path d="M 460 75 L 490 75" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Box 3: Boolean */}
                    <g transform="translate(500, 20)">
                      <rect width="170" height="110" rx="14" fill="#0C2018" stroke="#10B981" strokeWidth="2" />
                      <rect width="170" height="28" rx="14" fill="#10B981" fillOpacity="0.2" />
                      <text x="85" y="19" fill="#34D399" textAnchor="middle" fontWeight="bold" fontSize="11">VARIABLE: is_alive</text>
                      <text x="85" y="60" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontSize="20">True</text>
                      <text x="85" y="85" fill="#94A3B8" textAnchor="middle" fontSize="10">Type: Boolean (bool)</text>
                      <text x="85" y="102" fill="#64748B" textAnchor="middle" fontSize="9">RAM Addr: 0x7FFE203C</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* DIAGRAM 2: CONTROL FLOW & DECISION TREE */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3 print:border print:border-slate-300 print:text-black">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-sky-300 uppercase font-mono flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Diagram 2: Decision Tree & Control Flow (If / Elif / Else)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Branching Logic</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  The CPU evaluates conditions as boolean gates. Only ONE matching branch executes:
                </p>

                {/* SVG Visual Graphic for If/Else Flow */}
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex items-center justify-center overflow-x-auto print:bg-slate-100 print:border-slate-300">
                  <svg viewBox="0 0 700 170" className="w-full max-w-2xl h-auto font-mono text-xs">
                    {/* Start Node */}
                    <circle cx="70" cy="85" r="28" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                    <text x="70" y="89" fill="#FFFFFF" textAnchor="middle" fontSize="10" fontWeight="bold">START</text>

                    {/* Line to Diamond */}
                    <line x1="98" y1="85" x2="160" y2="85" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Decision Diamond */}
                    <g transform="translate(230, 85)">
                      <polygon points="0,-40 70,0 0,40 -70,0" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
                      <text x="0" y="-5" fill="#A5B4FC" textAnchor="middle" fontSize="10" fontWeight="bold">if score &gt;= 50?</text>
                      <text x="0" y="12" fill="#E0E7FF" textAnchor="middle" fontSize="9">Condition Check</text>
                    </g>

                    {/* True Branch (Up) */}
                    <path d="M 230 45 L 230 25 L 360 25" fill="none" stroke="#10B981" strokeWidth="2" />
                    <text x="260" y="20" fill="#10B981" fontSize="10" fontWeight="bold">TRUE (Pass)</text>
                    <g transform="translate(360, 10)">
                      <rect width="170" height="36" rx="8" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
                      <text x="85" y="22" fill="#A7F3D0" textAnchor="middle" fontSize="10" fontWeight="bold">print("Mission Success! 🎉")</text>
                    </g>

                    {/* False Branch (Down) */}
                    <path d="M 230 125 L 230 145 L 360 145" fill="none" stroke="#F43F5E" strokeWidth="2" />
                    <text x="260" y="140" fill="#F43F5E" fontSize="10" fontWeight="bold">FALSE (Fail)</text>
                    <g transform="translate(360, 125)">
                      <rect width="170" height="36" rx="8" fill="#4C0519" stroke="#F43F5E" strokeWidth="1.5" />
                      <text x="85" y="22" fill="#FECDD3" textAnchor="middle" fontSize="10" fontWeight="bold">print("Try Again! 🔄")</text>
                    </g>

                    {/* Converge to End */}
                    <path d="M 530 28 L 590 85" fill="none" stroke="#94A3B8" strokeWidth="2" />
                    <path d="M 530 143 L 590 85" fill="none" stroke="#94A3B8" strokeWidth="2" />
                    <circle cx="620" cy="85" r="24" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                    <text x="620" y="89" fill="#38BDF8" textAnchor="middle" fontSize="9" fontWeight="bold">END</text>
                  </svg>
                </div>
              </div>

              {/* DIAGRAM 3: LOOP REPETITION CYCLE */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3 print:border print:border-slate-300 print:text-black">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                    <span>Diagram 3: Loop Repetition Cycle (for item in collection)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Cyclic Execution</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  A loop automates repetitive tasks by setting an iterator, executing code statements, and advancing automatically until the sequence ends:
                </p>

                {/* SVG Visual Graphic for Loop Cycle */}
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex items-center justify-center overflow-x-auto print:bg-slate-100 print:border-slate-300">
                  <svg viewBox="0 0 700 150" className="w-full max-w-2xl h-auto font-mono text-xs">
                    {/* 1. Initialize */}
                    <g transform="translate(30, 45)">
                      <rect width="140" height="60" rx="10" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                      <text x="70" y="25" fill="#94A3B8" textAnchor="middle" fontSize="10">1. INITIALIZE</text>
                      <text x="70" y="45" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">items = [1, 2, 3]</text>
                    </g>

                    <line x1="170" y1="75" x2="210" y2="75" stroke="#94A3B8" strokeWidth="2" />

                    {/* 2. Condition / Has Next */}
                    <g transform="translate(220, 45)">
                      <rect width="140" height="60" rx="10" fill="#1C1917" stroke="#EA580C" strokeWidth="1.5" />
                      <text x="70" y="25" fill="#FB923C" textAnchor="middle" fontSize="10">2. HAS NEXT?</text>
                      <text x="70" y="45" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">items left &gt; 0?</text>
                    </g>

                    <line x1="360" y1="75" x2="400" y2="75" stroke="#10B981" strokeWidth="2" />

                    {/* 3. Loop Body */}
                    <g transform="translate(410, 45)">
                      <rect width="150" height="60" rx="10" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
                      <text x="75" y="25" fill="#6EE7B7" textAnchor="middle" fontSize="10">3. EXECUTE BODY</text>
                      <text x="75" y="45" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">print(item * 2)</text>
                    </g>

                    {/* Return Loop Arc */}
                    <path d="M 485 45 C 485 10, 290 10, 290 45" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="390" y="20" fill="#38BDF8" textAnchor="middle" fontSize="9" fontWeight="bold">REPEAT NEXT ITEM</text>

                    {/* Exit Arc */}
                    <line x1="485" y1="105" x2="485" y2="135" stroke="#F43F5E" strokeWidth="2" />
                    <text x="540" y="125" fill="#F43F5E" fontSize="10" fontWeight="bold">No items left → EXIT</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETE CURRICULUM HANDBOOK */}
          {(activeTab === 'curriculum') && (
            <div className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <span className="text-sky-400">02 //</span>
                  <span>Complete Curriculum Lessons Handbook</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">Module by Module</span>
              </div>

              {/* MODULE 1 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 print:border print:border-slate-300">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white font-mono">
                    Module 1: Variables, Types & Memory Storage
                  </h5>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Lessons 1 - 5</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  • <strong>What is a variable?</strong> A named pointer to computer memory that stores data so you can use it later.<br/>
                  • <strong>Primitive Data Types</strong>: Numbers (Integers `42`, Floats `3.14`), Text (Strings `"Hello"`), and Truths (Booleans `True`/`False`).<br/>
                  • <strong>Pro-Tip</strong>: Variable names cannot begin with numbers or contain spaces. Use snake_case in Python or camelCase in JavaScript.
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-sky-200">
                  <code>
                    score = 100 # Integer<br/>
                    player_name = "Aria" # String<br/>
                    is_online = True # Boolean<br/>
                    print(f"Hero {player_name} has score {score}")
                  </code>
                </div>
              </div>

              {/* MODULE 2 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 print:border print:border-slate-300">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white font-mono">
                    Module 2: Decision Making & Branching Logic
                  </h5>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Lessons 6 - 12</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  • <strong>Comparisons</strong>: Equal `==`, Not equal `!=`, Greater than `&gt;`, Less than `&lt;`.<br/>
                  • <strong>Combined Conditions</strong>: `and` (both must be True), `or` (at least one is True), `not` (inverts Truth).<br/>
                  • <strong>Indentation Rule</strong>: Code inside an if block MUST be indented by 4 spaces.
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-sky-200">
                  <code>
                    if score &gt;= 90:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;print("Rank: Grandmaster S")<br/>
                    elif score &gt;= 60:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;print("Rank: Knight A")<br/>
                    else:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;print("Rank: Novice Apprentice")
                  </code>
                </div>
              </div>

              {/* MODULE 3 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 print:border print:border-slate-300">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white font-mono">
                    Module 3: Repetition & Loops
                  </h5>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Lessons 13 - 18</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  • <strong>For Loop</strong>: Used when you know how many times to repeat (e.g., iterating through a list or range).<br/>
                  • <strong>While Loop</strong>: Used when you want to repeat until a condition changes.<br/>
                  • <strong>Break & Continue</strong>: `break` exits the loop immediately; `continue` skips to the next repetition.
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-sky-200">
                  <code>
                    for i in range(1, 4):<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;print(f"Countdown: {i}")<br/>
                    print("Blast off! 🚀")
                  </code>
                </div>
              </div>

              {/* MODULE 4 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 print:border print:border-slate-300">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white font-mono">
                    Module 4: Functions & Code Reusability
                  </h5>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Lessons 19 - 25</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                  • <strong>What is a function?</strong> A reusable mini-machine that takes inputs (parameters), performs logic, and produces an output (`return`).<br/>
                  • <strong>Return vs Print</strong>: `print()` only displays text on the screen. `return` gives the value back so your code can use it in math or logic!
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-sky-200">
                  <code>
                    def calculate_damage(attack_power, defense):<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;net_damage = attack_power - defense<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;return max(0, net_damage)<br/>
                    <br/>
                    hit = calculate_damage(50, 20)<br/>
                    print(f"Damage dealt: {hit}") # 30
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMON MISTAKES & HOW TO AVOID THEM */}
          {(activeTab === 'pitfalls' || activeTab === 'curriculum') && (
            <div className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <span className="text-amber-400">03 //</span>
                  <span>Common Traps, Gotchas & Production Fixes</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">Top Bug Prevention</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {langDetails.commonPitfalls.map((pitfall, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 print:border print:border-slate-300">
                    <div className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center justify-center font-bold">
                        {pIdx + 1}
                      </span>
                      <span>{pitfall.title}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="text-rose-400 font-bold font-mono">The Trap: </span>
                      {pitfall.problem}
                    </div>
                    <div className="text-xs text-emerald-300">
                      <span className="text-emerald-400 font-bold font-mono">The Fix: </span>
                      {pitfall.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
