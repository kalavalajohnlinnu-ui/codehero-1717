import React, { useState } from 'react';
import { CodeEditor } from '../CodeEditor';

export const ProjectWorkshop = ({ currentLanguageId, onXPEarned }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [code, setCode] = useState('# Let\'s build a Calculator\n\ndef add(a, b):\n    pass');

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
      onXPEarned(50);
    } else {
      onXPEarned(500); // Project complete
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-950 text-slate-100">
      <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
            <span>🏗️</span> Calculator App
          </h2>
          <div className="mt-4 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `\${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-slate-400 mt-1">Step {step} of {totalSteps}</div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-xl font-bold mb-4">
            {step === 1 && "Step 1: The Addition Function"}
            {step === 2 && "Step 2: Subtraction"}
            {step === 3 && "Step 3: Multiplication"}
            {step === 4 && "Step 4: Division"}
            {step === 5 && "Step 5: The Main Loop"}
          </h3>
          
          <p className="text-slate-300 leading-relaxed mb-6">
            In this step, implement the function to handle this part of the calculator logic.
            Make sure it handles basic edge cases.
          </p>
          
          <button 
            onClick={handleNext}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg transition-colors mt-auto"
          >
            {step === totalSteps ? 'COMPLETE PROJECT' : 'NEXT STEP'}
          </button>
        </div>
      </div>
      
      <div className="w-2/3 flex flex-col p-4">
        <div className="flex-1 bg-black rounded-xl border border-slate-800 overflow-hidden">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={currentLanguageId}
            onRun={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
