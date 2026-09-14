import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Flame, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Layers, 
  GitBranch, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function Top1PercentRoadmapModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('reality');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0D14] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-8 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0E121B]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-base">
              1%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  The Top 1% Global Engineer Blueprint
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  Honest Assessment
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Foundation Rating: Top 10–15% · Uncapped Path to the Global 99th Percentile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-xs"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-8 pt-3 pb-2 border-b border-white/[0.06] bg-[#0C0F17] flex gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reality')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'reality' 
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            ⚖️ The Unfiltered Truth
          </button>
          <button
            onClick={() => setActiveTab('in-app')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'in-app' 
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            🎯 What This App Guarantees (Top 15%)
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'roadmap' 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            🚀 4-Stage Path to Top 1%
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'checklist' 
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            📋 The 1% Senior Checklist
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {activeTab === 'reality' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-red-500/5 to-transparent border border-amber-500/25">
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-amber-300">
                      Why No App On Earth Can Guarantee You "Top 1% in the World"
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      Anyone who promises that an app alone makes you a global top 1% programmer is deceptive. 
                      The top 1% of coders do not merely solve structured challenges inside a browser sandbox. 
                      They architect distributed systems with millions of daily users, debug production server deadlocks at 3 AM, write OS kernel drivers, and review thousands of lines of open-source software.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs font-mono uppercase text-sky-400 font-bold mb-1.5">
                    What In-Browser Apps Solve Perfectly
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Syntax mastery across 7 distinct paradigms without environment setup.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Algorithmic intuition, recursion, loops, and data structures.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Instant dopamine feedback, error diagnostics, and gamified consistency.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Taking a zero/kid and propelling them into the <strong>Top 10–15%</strong> of foundational learners.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs font-mono uppercase text-red-400 font-bold mb-1.5">
                    What Requires Real-World Crucible (Top 1%)
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-mono text-sm leading-none mt-0.5">•</span>
                      <span><strong>Uncapped Systems:</strong> Real Linux terminals, Docker containers, AWS/GCP clusters.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-mono text-sm leading-none mt-0.5">•</span>
                      <span><strong>Chaotic Outages:</strong> Network splits, memory leaks under load, corrupted database WALs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-mono text-sm leading-none mt-0.5">•</span>
                      <span><strong>Legacy Codebases:</strong> Navigating 500,000 lines of undocumented code written by 20 people.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-mono text-sm leading-none mt-0.5">•</span>
                      <span><strong>Human Engineering:</strong> Resolving architectural tradeoffs and running code reviews.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'in-app' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                <h3 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-400" />
                  Your Verified Milestone Upon Completing CodeHero Universe
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  By completing all <strong>631 lessons</strong>, <strong>80 algorithms</strong>, and <strong>15 guided projects</strong> in this platform, you will possess:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="text-lg mb-1">🌐</div>
                  <div className="text-xs font-bold text-white">Multiple Languages</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Strong hands-on practice in Python, JS, HTML/CSS, SQL, C/C++, Java, and Rust.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="text-lg mb-1">⚡</div>
                  <div className="text-xs font-bold text-white">Problem Solving & Logic</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ability to solve real coding challenges and algorithmic puzzles with confidence.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="text-lg mb-1">🔍</div>
                  <div className="text-xs font-bold text-white">Finding & Fixing Bugs</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sharp eye to spot errors, typos, and logic bugs in broken code quickly.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300">
                <span className="font-bold text-amber-400 font-mono">VERDICT:</span> You will be in the top <strong>10% to 15%</strong> of coding beginners/juniors globally. That is the ultimate launchpad. Now step into the roadmap below to cross the bridge into the 1%.
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-4">
                {/* Stage 1 */}
                <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                      STAGE 1 // FOUNDATION (IN THIS APP)
                    </span>
                    <span className="text-xs font-bold text-sky-400">Level: Top 15%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">Multi-Language Mechanics & DSA Fundamentals</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Master all 7 languages in CodeHero Universe. Complete the 631 interactive lessons, conquer the 80 Algorithm Arena quests, and finish the 15 mini-projects without looking at hints.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      STAGE 2 // NATIVE FORGE (LOCAL MACHINE)
                    </span>
                    <span className="text-xs font-bold text-indigo-400">Level: Top 10%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">The Raw Terminal & Real Developer Tooling</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Leave browser sandboxes behind. Install Linux (or WSL2/macOS), configure Git SSH, master terminal commands (grep, awk, curl, ssh), and build multi-file projects in VS Code or Neovim.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">Git rebase -i</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">Docker containerization</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">Makefiles / Cargo</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">GitHub Actions CI/CD</span>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                      STAGE 3 // UNCAPPED ARCHITECTURE
                    </span>
                    <span className="text-xs font-bold text-purple-400">Level: Top 5%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">Distributed Systems & High-Throughput Engineering</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Build a real service handling 10,000 concurrent requests. Design relational database schemas with B-Tree index optimization, configure Redis caching, set up message queues (Kafka/RabbitMQ), and manage state replication.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">ACID Isolation levels</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">EXPLAIN ANALYZE</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">Raft Consensus</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded">gRPC & Protobuf</span>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      STAGE 4 // THE GLOBAL CRUCIBLE
                    </span>
                    <span className="text-xs font-bold text-amber-400">Level: Global Top 1%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">Production at Scale & Open-Source Mastery</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Contribute to major open-source projects (Linux kernel, CPython, Node.js, or Rust crates). Profile memory leaks with eBPF/perf. Lead architecture for zero-downtime database migrations on terabyte datasets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-fade-in text-xs text-slate-300">
              <p className="text-slate-400">
                Check off these real-world engineering milestones as you transition from this app into native production environments:
              </p>

              <div className="space-y-2.5">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04]">
                  <input type="checkbox" className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500" />
                  <div>
                    <span className="font-bold text-white">Complete all 631 CodeHero Universe Lessons</span>
                    <div className="text-slate-400 text-[11px] mt-0.5">Foundational mastery across Python, JS, HTML/CSS, SQL, C/C++, Java, Rust.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04]">
                  <input type="checkbox" className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500" />
                  <div>
                    <span className="font-bold text-white">Build a Full-Stack Project from an Empty Folder (No Starter Code)</span>
                    <div className="text-slate-400 text-[11px] mt-0.5">Initialize your own git repo, configure your own build tools, and deploy to a real VPS.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04]">
                  <input type="checkbox" className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500" />
                  <div>
                    <span className="font-bold text-white">Diagnose a Memory Leak Using a Profiler</span>
                    <div className="text-slate-400 text-[11px] mt-0.5">Use Chrome DevTools heap snapshots, Python tracemalloc, or Valgrind in C++.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04]">
                  <input type="checkbox" className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500" />
                  <div>
                    <span className="font-bold text-white">Submit an Accepted Pull Request to a Public Open-Source Repo</span>
                    <div className="text-slate-400 text-[11px] mt-0.5">Have your code reviewed and merged by senior engineers you have never met.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04]">
                  <input type="checkbox" className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500" />
                  <div>
                    <span className="font-bold text-white">Design & Optimize a Database Query on 1,000,000+ Records</span>
                    <div className="text-slate-400 text-[11px] mt-0.5">Use EXPLAIN QUERY PLAN to turn a 12-second table scan into a 2ms index scan.</div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-8 py-4 border-t border-white/[0.08] bg-[#0E121B] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            CodeHero Universe · The Honest Engineering Guild
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-md"
          >
            Acknowledge & Continue Quest
          </button>
        </div>
      </div>
    </div>
  );
}
