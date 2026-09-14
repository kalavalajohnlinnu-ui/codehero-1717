import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  BookOpen, 
  AlertCircle, 
  Code2, 
  HelpCircle, 
  Sparkles, 
  Cpu, 
  Terminal, 
  Layers, 
  Send, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { getLanguageDetails, generateExternalPrompt } from '../data/languages/languageDetails';
import { soundService } from '../services/soundService';
import { LanguageLogo } from './LanguageLogo';

export function LanguageOracle({ currentLanguageId, onSelectLanguage, onOpenRoadmap }) {
  const [activeLangId, setActiveLangId] = useState(currentLanguageId || 'python');
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'ask' | 'pitfalls' | 'interview'
  const [questionInput, setQuestionInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [inAppAnswer, setInAppAnswer] = useState(null);

  const langDetails = getLanguageDetails(activeLangId);
  const langConfig = LANGUAGES.find(l => l.id === activeLangId) || LANGUAGES[0];

  const handleSelectLang = (id) => {
    soundService.playClick();
    setActiveLangId(id);
    onSelectLanguage(id);
    setInAppAnswer(null);
    setGeneratedPrompt('');
  };

  const handleGeneratePrompt = () => {
    soundService.playClick();
    const prompt = generateExternalPrompt(activeLangId, questionInput, codeInput);
    setGeneratedPrompt(prompt);

    // Also synthesize in-app guidance if question matches common queries
    const match = langDetails.curatedQuestions?.find(
      q => q.q.toLowerCase().includes(questionInput.toLowerCase()) || questionInput.toLowerCase().includes(q.q.toLowerCase().slice(0, 15))
    );
    if (match) {
      setInAppAnswer(match.a);
    } else if (questionInput.trim()) {
      setInAppAnswer(`Here is expert guidance on ${langDetails.name} for "${questionInput}":\n\nIn modern ${langDetails.name} (${langDetails.version}), focus on leveraging idiomatic patterns: ${langDetails.top1PercentSkills[0]}. Ensure you avoid common traps like ${langDetails.commonPitfalls[0].title}. Copy the pre-engineered prompt below to query frontier AI models (Claude 3.5 Sonnet, GPT-4o, DeepSeek) for complete multi-page architectural implementation.`);
    }
  };

  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    soundService.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Banner: Language Selector & Mode Info */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1.5 shrink-0">
            <LanguageLogo languageId={activeLangId} size={24} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{langDetails.name}</span>
                <span className="text-slate-400 font-mono text-xs font-normal">Knowledge Vault</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-bold">
                {langDetails.version}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono hidden sm:block mt-0.5">
              {langDetails.executionModel}
            </p>
          </div>
        </div>

        {/* 7-Language Segmented Tabs with Official Logos */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          {LANGUAGES.map(l => (
            <button
              key={l.id}
              onClick={() => handleSelectLang(l.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                l.id === activeLangId 
                  ? 'bg-white text-sky-900 border border-slate-200 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
              }`}
            >
              <LanguageLogo languageId={l.id} size={16} className="w-4 h-4 shrink-0" />
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white/80 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dossier'
                ? 'bg-slate-100 text-slate-900 border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📋 Language Overview
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ask'
                ? 'bg-sky-50 text-sky-900 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>💬 Ask Any Question</span>
          </button>
          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pitfalls'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            ⚠️ Common Mistakes
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'interview'
                ? 'bg-purple-50 text-purple-900 border border-purple-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            🎯 Interview Questions
          </button>
        </div>

        <a
          href={langDetails.docsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1.5 hover:underline"
        >
          <span>Official Docs</span>
          <ExternalLink className="w-3 h-3 text-sky-600" />
        </a>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* DOSSIER TAB */}
        {activeTab === 'dossier' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
            {/* Paradigms & Architecture Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-mono text-slate-500 uppercase font-semibold">Paradigms</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{langDetails.paradigm}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-mono text-slate-500 uppercase font-semibold">Primary Domain</div>
                <div className="text-sm font-bold text-sky-700 mt-1">{langDetails.badge}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-mono text-slate-500 uppercase font-semibold">In-Browser Engine</div>
                <div className="text-sm font-bold text-emerald-700 mt-1">WebAssembly / V8 Sandbox</div>
              </div>
            </div>

            {/* Top 1% Engineering Mastery Skills */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  What Separates the Top 1% in {langDetails.name}
                </h3>
                <button
                  onClick={onOpenRoadmap}
                  className="text-xs font-mono text-slate-500 hover:text-slate-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Global 1% Blueprint</span>
                </button>
              </div>
              <div className="space-y-2">
                {langDetails.top1PercentSkills.map((skill, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-mono text-amber-600 font-bold shrink-0">{`0${i + 1}.`}</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Library Power Tools */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-sky-900 flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-sky-600" />
                Standard Library Power Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {langDetails.standardLibraryPowerTools.map((tool, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-mono font-bold text-xs text-slate-900">{tool.name}</div>
                    <div className="text-[11px] text-slate-600 mt-1">{tool.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ASK & EXTERNAL PROMPT FORGE TAB */}
        {activeTab === 'ask' && (
          <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 border border-sky-200">
              <h3 className="text-sm sm:text-base font-bold text-sky-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                External Question & Prompt Forge
              </h3>
              <p className="text-xs text-slate-700 mt-1">
                Ask any question or describe a bug in <strong>{langDetails.name}</strong>. We provide instant architecture guidance and format a pre-engineered prompt ready to paste into <strong>Claude 3.5 Sonnet, ChatGPT, DeepSeek, or StackOverflow</strong> with low-level constraints.
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-600 font-semibold mb-1">
                  YOUR QUESTION / OBJECTIVE
                </label>
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder={`e.g. How do I optimize high-throughput socket connections in ${langDetails.name}?`}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-mono shadow-2xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 font-semibold mb-1">
                  OPTIONAL CODE SNIPPET (PASTE TO REPRODUCE / DEBUG)
                </label>
                <textarea
                  rows={4}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={`// Paste your ${langDetails.name} code here...`}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono shadow-2xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGeneratePrompt}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Synthesize Answers & Prompt</span>
                </button>
              </div>
            </div>

            {/* In-App Answer Guidance */}
            {inAppAnswer && (
              <div className="p-4 rounded-2xl bg-white border-2 border-sky-200 space-y-2 shadow-2xs">
                <div className="text-xs font-mono font-bold text-sky-800 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>IN-APP ARCHITECTURAL GUIDANCE:</span>
                </div>
                <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                  {inAppAnswer}
                </div>
              </div>
            )}

            {/* Generated External Prompt Box */}
            {generatedPrompt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-600 uppercase font-bold">
                    Formatted External Prompt (Click Copy & Paste into Claude / ChatGPT / DeepSeek)
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 hover:bg-sky-100 text-xs font-mono font-bold text-sky-800 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sky-600" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-100 whitespace-pre-wrap select-all max-h-60 overflow-y-auto">
                  {generatedPrompt}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PITFALLS TAB */}
        {activeTab === 'pitfalls' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Common Architectural Traps in {langDetails.name}
            </h3>

            {langDetails.commonPitfalls.map((pitfall, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                <div className="text-xs font-bold text-amber-800 font-mono">{pitfall.title}</div>
                <div className="text-xs text-red-900 bg-red-50 p-3 rounded-xl border border-red-200 font-mono">
                  <strong>Trap:</strong> {pitfall.problem}
                </div>
                <div className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-mono">
                  <strong>Production Solution:</strong> {pitfall.solution}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INTERVIEW TAB */}
        {activeTab === 'interview' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              Top 1% Senior Engineering Questions ({langDetails.name})
            </h3>

            {langDetails.curatedQuestions.map((q, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                <div className="text-xs font-bold text-purple-900 flex items-start gap-2">
                  <span className="font-mono text-purple-600">Q{i + 1}:</span>
                  <span>{q.q}</span>
                </div>
                <div className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                  {q.a}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
