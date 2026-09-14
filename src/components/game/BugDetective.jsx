import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../CodeEditor';
import { soundService } from '../../services/soundService';
import { LanguageLogo } from '../LanguageLogo';

const BUG_CASES = [
  {
    id: 'case-001',
    caseNumber: '001',
    title: 'The Missing Accumulator',
    category: 'Logic Error',
    language: 'python',
    xpReward: 150,
    crimeReport: 'The calculate_total() function is supposed to sum all cart items, but the store is losing money! It keeps returning only the last item price.',
    buggyCode: 'def calculate_total(items):\n    total = 0\n    for item in items:\n        total = item  # BUG IS HERE\n    return total',
    fixedCode: 'def calculate_total(items):\n    total = 0\n    for item in items:\n        total += item\n    return total',
    testInput: '[10, 20, 30]',
    expectedOutput: '60',
    actualOutput: '30',
    diagnosis: 'The variable is being ASSIGNED (=) instead of ACCUMULATED (+=). The loop overwrites total each iteration instead of adding to it.',
    fixHint: 'Change `total = item` to `total += item` or `total = total + item`',
    verifyFix: (code) => code.includes('+=') || code.includes('total = total +')
  },
  {
    id: 'case-002',
    caseNumber: '002',
    title: 'Off By One Escape',
    category: 'Index Error',
    language: 'javascript',
    xpReward: 120,
    crimeReport: 'The pagination is crashing on the last page. It keeps trying to read a page that doesn\'t exist.',
    buggyCode: 'function getLastItem(arr) {\n    // Suspect seen escaping out of bounds\n    return arr[arr.length];\n}',
    fixedCode: 'function getLastItem(arr) {\n    return arr[arr.length - 1];\n}',
    testInput: '["A", "B", "C"]',
    expectedOutput: '"C"',
    actualOutput: 'undefined / IndexError',
    diagnosis: 'Arrays are 0-indexed. The last item is at length - 1, not length.',
    fixHint: 'Subtract 1 from arr.length',
    verifyFix: (code) => code.includes('- 1') || code.includes('-1')
  },
  {
    id: 'case-003',
    caseNumber: '003',
    title: 'The Infinite Loop Trap',
    category: 'Loop Error',
    language: 'python',
    xpReward: 180,
    crimeReport: 'The server crashed because a background worker got stuck forever and ate all the CPU.',
    buggyCode: 'def count_to_ten():\n    count = 1\n    while count < 10:\n        print(count)\n        # Something is missing here\n    return "Done"',
    fixedCode: 'def count_to_ten():\n    count = 1\n    while count < 10:\n        print(count)\n        count += 1\n    return "Done"',
    testInput: '()',
    expectedOutput: '1..9 then "Done"',
    actualOutput: '1, 1, 1, 1... (infinitely)',
    diagnosis: 'The loop condition never becomes false because the counter variable is never incremented.',
    fixHint: 'Increment the count variable inside the while loop.',
    verifyFix: (code) => code.includes('count += 1') || code.includes('count = count + 1')
  },
  {
    id: 'case-004',
    caseNumber: '004',
    title: 'Equality Deception',
    category: 'Type Error',
    language: 'javascript',
    xpReward: 140,
    crimeReport: 'Users with ID "123" are getting access to admin data intended only for the numeric ID 123!',
    buggyCode: 'function isAdmin(userId) {\n    const adminId = 123;\n    if (userId == adminId) {\n        return true;\n    }\n    return false;\n}',
    fixedCode: 'function isAdmin(userId) {\n    const adminId = 123;\n    if (userId === adminId) {\n        return true;\n    }\n    return false;\n}',
    testInput: 'isAdmin("123")',
    expectedOutput: 'false',
    actualOutput: 'true',
    diagnosis: 'Using == allows type coercion, so the string "123" equals the number 123. Use === for strict equality.',
    fixHint: 'Change == to === to check both value and type.',
    verifyFix: (code) => code.includes('===')
  },
  {
    id: 'case-005',
    caseNumber: '005',
    title: 'The Ghost Return',
    category: 'Syntax Error',
    language: 'javascript',
    xpReward: 130,
    crimeReport: 'The API is returning undefined instead of the user object, but the object is clearly defined!',
    buggyCode: 'function getUser() {\n    return \n    {\n        name: "Alice",\n        role: "Detective"\n    };\n}',
    fixedCode: 'function getUser() {\n    return {\n        name: "Alice",\n        role: "Detective"\n    };\n}',
    testInput: 'getUser()',
    expectedOutput: '{ name: "Alice", role: "Detective" }',
    actualOutput: 'undefined',
    diagnosis: 'Automatic Semicolon Insertion (ASI) in JavaScript places a semicolon after `return` if the next line starts with a new token.',
    fixHint: 'Move the opening brace `{` to the same line as the `return` keyword.',
    verifyFix: (code) => code.includes('return {')
  },
  {
    id: 'case-006',
    caseNumber: '006',
    title: 'Mutated State',
    category: 'Logic Error',
    language: 'python',
    xpReward: 160,
    crimeReport: 'Appending to a new list is somehow adding items to the previous list too. It\'s a cross-contamination!',
    buggyCode: 'def add_item(item, list=[]):\n    list.append(item)\n    return list',
    fixedCode: 'def add_item(item, list=None):\n    if list is None:\n        list = []\n    list.append(item)\n    return list',
    testInput: 'add_item(1); add_item(2)',
    expectedOutput: '[2]',
    actualOutput: '[1, 2]',
    diagnosis: 'Default arguments in Python are evaluated once when the function is defined. Mutable defaults persist across calls.',
    fixHint: 'Use None as the default argument, and assign a new list inside the function.',
    verifyFix: (code) => code.includes('None') && (code.includes('list = []') || code.includes('[]'))
  },
  {
    id: 'case-007',
    caseNumber: '007',
    title: 'Shadowed Variables',
    category: 'Scope Error',
    language: 'javascript',
    xpReward: 110,
    crimeReport: 'The global configuration is being overwritten locally, breaking the entire app routing.',
    buggyCode: 'let config = "prod";\nfunction setup() {\n    var config = "dev";\n    console.log("Setting up", config);\n}\nsetup();\n// global config is shadowed but not overwritten, wait the bug is actually a typo in usage',
    fixedCode: 'let config = "prod";\nfunction setup() {\n    config = "dev";\n    console.log("Setting up", config);\n}',
    testInput: 'Check global config after setup',
    expectedOutput: 'Global should be "dev" if intent was to overwrite',
    actualOutput: 'Global remains "prod" because it was re-declared locally',
    diagnosis: 'The variable was re-declared locally with `var` instead of updating the outer scoped variable.',
    fixHint: 'Remove `var` or `let` from the inner assignment to update the outer variable.',
    verifyFix: (code) => !code.includes('var config') && !code.includes('let config = "dev"') && code.includes('config =')
  },
  {
    id: 'case-008',
    caseNumber: '008',
    title: 'The Silent Fallthrough',
    category: 'Control Flow',
    language: 'javascript',
    xpReward: 130,
    crimeReport: 'Users who purchase basic tier are getting premium and enterprise features unlocked!',
    buggyCode: 'function getFeatures(tier) {\n    let features = [];\n    switch(tier) {\n        case "basic":\n            features.push("login");\n        case "premium":\n            features.push("analytics");\n        case "enterprise":\n            features.push("sso");\n    }\n    return features;\n}',
    fixedCode: 'function getFeatures(tier) {\n    let features = [];\n    switch(tier) {\n        case "basic":\n            features.push("login");\n            break;\n        case "premium":\n            features.push("analytics");\n            break;\n        case "enterprise":\n            features.push("sso");\n            break;\n    }\n    return features;\n}',
    testInput: 'getFeatures("basic")',
    expectedOutput: '["login"]',
    actualOutput: '["login", "analytics", "sso"]',
    diagnosis: 'Switch cases fall through to the next case if there is no `break` statement.',
    fixHint: 'Add `break;` at the end of each case block.',
    verifyFix: (code) => code.match(/break/g)?.length >= 2
  },
  {
    id: 'case-009',
    caseNumber: '009',
    title: 'Dictionary Key Error',
    category: 'Lookup Error',
    language: 'python',
    xpReward: 120,
    crimeReport: 'The system crashes when trying to look up a user who doesn\'t have a registered phone number.',
    buggyCode: 'def get_phone(user):\n    return user["phone"]',
    fixedCode: 'def get_phone(user):\n    return user.get("phone", "No phone")',
    testInput: 'get_phone({"name": "Bob"})',
    expectedOutput: '"No phone" or None',
    actualOutput: 'KeyError: "phone"',
    diagnosis: 'Directly accessing a missing key in a dictionary raises a KeyError. Use .get() for safer lookups.',
    fixHint: 'Use `user.get("phone")` instead of `user["phone"]`.',
    verifyFix: (code) => code.includes('.get(') || code.includes('in user')
  },
  {
    id: 'case-010',
    caseNumber: '010',
    title: 'String Immutability',
    category: 'Type Error',
    language: 'python',
    xpReward: 140,
    crimeReport: 'Trying to capitalize the first letter of a username is failing spectacularly.',
    buggyCode: 'def capitalize_first(word):\n    word[0] = word[0].upper()\n    return word',
    fixedCode: 'def capitalize_first(word):\n    return word[0].upper() + word[1:]',
    testInput: 'capitalize_first("hello")',
    expectedOutput: '"Hello"',
    actualOutput: 'TypeError: \'str\' object does not support item assignment',
    diagnosis: 'Strings in Python are immutable. You cannot assign characters directly via index.',
    fixHint: 'Create a new string by slicing and concatenating, e.g., `word[0].upper() + word[1:]`',
    verifyFix: (code) => code.includes('.upper()') && code.includes('+')
  }
];

export function BugDetective({ currentLanguageId = 'python', onXPEarned }) {
  const [activeCaseId, setActiveCaseId] = useState(BUG_CASES[0].id);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'fail'

  const activeCase = BUG_CASES.find(c => c.id === activeCaseId) || BUG_CASES[0];
  
  // Filter cases based on language (or show all if you want users to fix bugs in either)
  const availableCases = BUG_CASES;

  useEffect(() => {
    setCode(activeCase.buggyCode);
    setStatus('idle');
  }, [activeCaseId]);

  const handleRunDiagnostics = () => {
    const isFixed = activeCase.verifyFix(code);
    
    if (isFixed) {
      setStatus('success');
      soundService?.playSuccess?.();
      if (onXPEarned) onXPEarned(activeCase.xpReward);
    } else {
      setStatus('fail');
      soundService?.playFail?.();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans">
      {/* HEADER: Amber warning theme */}
      <header className="flex items-center justify-between p-4 bg-[#FFFBEB] border-b-4 border-[#F59E0B] shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-amber-900 tracking-tight flex items-center gap-2">
            <span>🕵️</span> Bug Detective <span className="font-light text-amber-700">| Case Files</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 rounded-lg font-bold text-xs border border-amber-300 shadow-2xs">
            <LanguageLogo languageId={activeCase.language} size={16} className="w-4 h-4 shrink-0" />
            <span className="capitalize">{activeCase.language}</span>
          </div>
          <div className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-md font-bold text-sm border border-amber-300 shadow-sm uppercase tracking-wide">
            Forensics Lab
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        
        {/* LEFT PANEL: Crime Scene Card (38%) */}
        <div className="w-full lg:w-[38%] flex flex-col border-r border-[#E2E8F0] bg-white overflow-y-auto">
          
          {/* Active Case Details */}
          <div className="p-6 border-b border-[#E2E8F0] relative overflow-hidden">
            {/* watermark */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 text-[120px] font-black text-amber-50 opacity-50 pointer-events-none select-none">
              #{activeCase.caseNumber}
            </div>

            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider rounded-md border border-amber-200">
                  Case #{activeCase.caseNumber}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {activeCase.category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{activeCase.title}</h2>
              
              <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg mb-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Crime Report
                </h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  "{activeCase.crimeReport}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
                  <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Expected Output</h4>
                  <code className="text-sm font-bold text-emerald-800 bg-white px-2 py-0.5 rounded shadow-sm">{activeCase.expectedOutput}</code>
                </div>
                <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg">
                  <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Actual Output</h4>
                  <code className="text-sm font-bold text-red-800 bg-white px-2 py-0.5 rounded shadow-sm">{activeCase.actualOutput}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Case List */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Open Cases</h3>
            <div className="space-y-2">
              {availableCases.map(bugCase => (
                <button
                  key={bugCase.id}
                  onClick={() => setActiveCaseId(bugCase.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.97] hover:-translate-y-0.5 flex gap-3 ${
                    activeCaseId === bugCase.id
                      ? 'bg-[#FFFBEB] border-amber-300 shadow-sm ring-1 ring-amber-200'
                      : 'bg-white border-[#E2E8F0] hover:border-amber-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs ${
                    activeCaseId === bugCase.id ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    #{bugCase.caseNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate text-sm">{bugCase.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex justify-between">
                      <span className="truncate">{bugCase.category}</span>
                      <span className="text-emerald-600 font-bold">+{bugCase.xpReward}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Editor & Diagnostics (62%) */}
        <div className="w-full lg:w-[62%] flex flex-col bg-[#F8FAFC]">
          
          <div className="px-6 pt-4 pb-2 flex justify-between items-end">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Evidence Source Code
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 shadow-2xs rounded-lg">
              <LanguageLogo languageId={activeCase.language} size={14} className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-700">
                {activeCase.language.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] px-4 pb-4">
            <div className="h-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner bg-white">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={activeCase.language}
                onRun={() => {}}
                isRunning={false}
              />
            </div>
          </div>

          {/* Diagnostics Panel */}
          <div className="p-4 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              
              <button
                onClick={handleRunDiagnostics}
                className="w-full md:w-auto md:min-w-[200px] shrink-0 px-6 py-4 bg-[#D97706] hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-[0.97] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Run Diagnostics
              </button>

              <div className="flex-1">
                {status === 'idle' && (
                  <div className="h-full flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 italic">
                    Fix the bug in the code editor, then run diagnostics to verify your solution.
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="h-full flex items-start gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg animate-in fade-in slide-in-from-right-2">
                    <div className="text-2xl shrink-0">🚨</div>
                    <div>
                      <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Case Closed!</h4>
                      <p className="text-emerald-700 text-sm font-medium mt-0.5">Bug squashed successfully. Excellent detective work.</p>
                    </div>
                  </div>
                )}

                {status === 'fail' && (
                  <div className="h-full flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in slide-in-from-right-2">
                    <div className="text-2xl shrink-0">💡</div>
                    <div>
                      <h4 className="font-bold text-amber-900 uppercase tracking-wider text-sm">Case Remains Open</h4>
                      <p className="text-amber-800 text-sm mt-1 mb-2 font-medium">{activeCase.diagnosis}</p>
                      <div className="inline-block bg-white px-2 py-1 rounded border border-amber-200 text-xs font-bold text-amber-700 shadow-sm">
                        Hint: {activeCase.fixHint}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
