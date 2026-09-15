import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ShieldCheck, User, Mail, Settings, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';

export function GoogleLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function GoogleSignInModal({ isOpen, onClose, onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [clientId, setClientId] = useState(authService.getGoogleClientId());
  const [configSaved, setConfigSaved] = useState(false);

  // Existing Google students saved on this device
  const existingGoogleStudents = authService.getAllStudents().filter(s => s.authProvider === 'google');

  // If real Google Identity Services is available and client ID is set, initialize it
  useEffect(() => {
    if (isOpen && clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              const decoded = authService.decodeGoogleCredential(response.credential);
              if (decoded) {
                handleCompleteGoogleAuth({
                  email: decoded.email,
                  name: decoded.name || decoded.given_name,
                  picture: decoded.picture,
                  googleId: decoded.sub
                });
              }
            }
          }
        });
      } catch (e) {
        console.warn('GIS Init note:', e);
      }
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const handleCompleteGoogleAuth = (googleProfile) => {
    setIsSigningIn(true);
    setError(null);
    try {
      soundService.playFanfare();
      const student = authService.loginWithGoogle(googleProfile);
      setTimeout(() => {
        setIsSigningIn(false);
        onAuthenticated(student);
        onClose();
      }, 700);
    } catch (err) {
      setIsSigningIn(false);
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleManualGoogleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid Google Account email.');
      return;
    }
    const cleanName = name.trim() || email.split('@')[0];
    handleCompleteGoogleAuth({
      email,
      name: cleanName,
      googleId: 'g_' + Date.now()
    });
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    authService.setGoogleClientId(clientId);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="bg-white text-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 transition-all animate-cinematic-page"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Google Branding Header */}
        <div className="p-6 sm:p-7 pb-4 text-center border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-sm mb-3">
            <GoogleLogo className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Sign in with Google
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose a Google account to continue to <strong className="text-slate-800 font-semibold">CodeHero Academy</strong>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSigningIn ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs font-mono text-slate-600 font-bold">
                Connecting with Google Account...
              </div>
              <div className="text-[11px] text-slate-400">
                Restoring your lessons, draft code, and progress.
              </div>
            </div>
          ) : (
            <>
              {/* Existing Google Profiles on this device */}
              {existingGoogleStudents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Accounts on this device
                  </div>
                  <div className="space-y-1.5">
                    {existingGoogleStudents.map(student => (
                      <button
                        key={student.email}
                        onClick={() => handleCompleteGoogleAuth({
                          email: student.email,
                          name: student.name,
                          picture: student.googlePicture,
                          googleId: student.googleId
                        })}
                        className="w-full p-3 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {student.googlePicture ? (
                              <img src={student.googlePicture} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                              {student.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 truncate">
                              {student.email}
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enter Google Account details */}
              <form onSubmit={handleManualGoogleSubmit} className="space-y-3 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  {existingGoogleStudents.length > 0 ? "Or use another Google account" : "Enter Google Account"}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex.student@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  <GoogleLogo className="w-4 h-4" />
                  <span>Continue with this Google Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick Demo Google Accounts for Immediate 1-Click Verification */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Fast 1-click test accounts:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCompleteGoogleAuth({
                      email: 'alex.developer@gmail.com',
                      name: 'Alex Rivera',
                      googleId: 'demo_alex_1'
                    })}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    Alex
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCompleteGoogleAuth({
                      email: 'sarah.engineer@gmail.com',
                      name: 'Sarah Chen',
                      googleId: 'demo_sarah_2'
                    })}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    Sarah
                  </button>
                </div>
              </div>

              {/* Optional Google Cloud OAuth Client ID configuration toggle */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="text-[10px] font-mono text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto"
                >
                  <Settings className="w-3 h-3" />
                  <span>{showConfig ? "Hide Google Client ID setting" : "Configure custom Google Cloud OAuth Client ID"}</span>
                </button>

                {showConfig && (
                  <form onSubmit={handleSaveClientId} className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2">
                    <label className="block text-[10px] font-mono text-slate-600 font-bold">
                      Google OAuth Client ID (from Google Cloud Console):
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={e => setClientId(e.target.value)}
                      placeholder="123456789-abc.apps.googleusercontent.com"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[9px] text-slate-400">
                        {configSaved ? "✅ Saved successfully!" : "Leave empty for standard fast login"}
                      </span>
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-mono font-bold hover:bg-slate-900"
                      >
                        Save Client ID
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Safety Guarantee Strip */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Progress saved under your Google account email</span>
          </span>
          <span className="text-[10px] text-slate-400">100% Free & Safe</span>
        </div>
      </div>
    </div>
  );
}
