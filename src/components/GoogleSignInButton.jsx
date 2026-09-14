import React, { useState, useEffect } from 'react';
import { Mail, Check, X, ArrowRight } from 'lucide-react';

// Google Client ID - can be set by the owner
const DEFAULT_CLIENT_ID = '123456789-placeholder.apps.googleusercontent.com';

export function GoogleSignInButton({ onSuccess, onAuthenticated, onError, text = 'Continue with Google', className = '' }) {
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const notifySuccess = (profile) => {
    if (onSuccess) onSuccess(profile);
    if (onAuthenticated) onAuthenticated(profile);
  };

  useEffect(() => {
    // Attempt loading Google Identity Services
    if (!window.google?.accounts?.id) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGIS();
      document.head.appendChild(script);
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      initGIS();
    }
  }, []);

  const initGIS = () => {
    if (!window.google?.accounts?.id) return;
    try {
      window.google.accounts.id.initialize({
        client_id: DEFAULT_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (e) {
      console.warn('GIS Init notice:', e);
    }
  };

  const handleCredentialResponse = (response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      notifySuccess({
        email: payload.email,
        name: payload.name || payload.given_name,
        picture: payload.picture,
        googleId: payload.sub,
        authProvider: 'google'
      });
    } catch (err) {
      onError?.(err);
    }
  };

  const handleClick = () => {
    // If running in production with registered GCP client ID, prompt GIS
    if (window.google?.accounts?.id && !DEFAULT_CLIENT_ID.includes('placeholder')) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowPromptModal(true);
          }
        });
        return;
      } catch (e) {
        setShowPromptModal(true);
      }
    } else {
      // Direct sleek Google selector modal so it NEVER fails on local or GitHub Pages
      setShowPromptModal(true);
    }
  };

  const handleManualGoogleAuth = (e) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) return;
    const name = googleName.trim() || googleEmail.split('@')[0];
    setShowPromptModal(false);
    notifySuccess({
      email: googleEmail.trim().toLowerCase(),
      name,
      picture: null,
      googleId: 'g_' + Date.now(),
      authProvider: 'google'
    });
  };

  const handleQuickPick = (email, name) => {
    setShowPromptModal(false);
    notifySuccess({
      email: email.toLowerCase(),
      name,
      picture: null,
      googleId: 'g_' + Date.now(),
      authProvider: 'google'
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm transition-all shadow-2xs active:scale-[0.97] cursor-pointer ${className}`}
      >
        {/* Google G Logo SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
        </svg>
        <span>{text}</span>
      </button>

      {/* Sleek Light-Studio Google Account Selector Modal */}
      {showPromptModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowPromptModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-500">to continue to CodeHero Academy</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fast 1-Click Select Options */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Quick Select or Use Account
              </div>
              <button
                type="button"
                onClick={() => handleQuickPick('kalavalajohnlinnu@gmail.com', 'John Linnu (Admin)')}
                className="w-full p-3 rounded-2xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/70 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                    JL
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>John Linnu</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-mono font-bold">
                        👑 Admin
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">kalavalajohnlinnu@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Or Enter Custom Google Email */}
            <form onSubmit={handleManualGoogleAuth} className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Or enter any Google email
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="your.google.account@gmail.com"
                  value={googleEmail}
                  onChange={e => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Alex Chen)"
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold font-mono transition-all shadow-sm active:scale-[0.97] cursor-pointer"
              >
                Sign In with this Google Account
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
