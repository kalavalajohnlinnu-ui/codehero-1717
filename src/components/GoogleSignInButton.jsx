import React, { useState } from 'react';
import { GoogleLogo, GoogleSignInModal } from './GoogleSignInModal';
import { soundService } from '../services/soundService';

export function GoogleSignInButton({ 
  onAuthenticated, 
  variant = 'light', // 'light' | 'dark'
  text = 'Continue with Google',
  className = ''
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    soundService.playClick();
    setIsModalOpen(true);
  };

  const isDark = variant === 'dark';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-xs font-mono transition-all shadow-sm ${
          isDark
            ? 'bg-[#131625] hover:bg-[#1A1E33] text-white border border-white/10 hover:border-white/20'
            : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-md hover:shadow'
        } ${className}`}
      >
        <GoogleLogo className="w-4 h-4 shrink-0" />
        <span>{text}</span>
      </button>

      <GoogleSignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuthenticated={onAuthenticated}
      />
    </>
  );
}
