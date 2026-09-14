import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Upload,
  Eye,
  EyeOff,
  Shield,
  X,
  Sparkles,
  LogIn
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';
import { GoogleSignInButton } from './GoogleSignInButton';
import { IngeniumLogoMark } from './IngeniumLogo';
import { VexHero } from './VexHero';

const AVATARS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & AI' },
  { id: 'robot',  name: 'Cyber Sentinel', desc: 'Systems' },
  { id: 'cat',   name: 'Byte Fox',        desc: 'Logic' },
  { id: 'owl',   name: 'Wise Raven',      desc: 'Algorithms' }
];

export function AuthGateScreen({ onAuthenticated, onBackToIntro }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mode, setMode]                     = useState('signup'); // 'signup' | 'login'
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [avatar, setAvatar]                 = useState('dragon');
  const [error, setError]                   = useState(null);
  const [successMsg, setSuccessMsg]         = useState(null);

  const existingStudents = authService.getAllStudents().filter(s => !s.isGuest);

  const handleGoogleSuccess = (profile) => {
    try {
      const student = authService.loginWithGoogle(profile);
      soundService.playFanfare();
      setSuccessMsg(`Welcome, ${student.name}! Authenticated with Google.`);
      setTimeout(() => onAuthenticated(student), 800);
    } catch (err) {
      setError('Google sign-in failed: ' + err.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    if (!password || password.trim().length < 6) {
      setError('Password is compulsory and must be at least 6 characters long.');
      soundService.playFail();
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      soundService.playFail();
      return;
    }
    try {
      const student = authService.registerStudent({ email, name, password, avatar });
      soundService.playFanfare();
      setSuccessMsg(`Welcome to Ingenium Academy, ${student.name}! Loading your workspace…`);
      setTimeout(() => onAuthenticated(student), 900);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('Password is compulsory. Please enter your account password.');
      soundService.playFail();
      return;
    }
    try {
      const student = authService.loginStudent({ email, password });
      soundService.playSuccess();
      setSuccessMsg(`Welcome back, ${student.name}! Restoring your progress…`);
      setTimeout(() => onAuthenticated(student), 900);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleQuickSwitch = (targetEmail) => {
    try {
      const switched = authService.switchStudent(targetEmail);
      if (switched) { soundService.playSuccess(); onAuthenticated(switched); }
    } catch (err) { setError(err.message); }
  };

  const handleDemoAdminLogin = () => {
    try {
      let student = authService.getAllStudents().find(s => s.email.toLowerCase() === 'kalavalajohnlinnu@gmail.com');
      if (!student) {
        authService.seedDemoStudents();
        student = authService.getAllStudents().find(s => s.email.toLowerCase() === 'kalavalajohnlinnu@gmail.com');
      }
      if (student) {
        authService.setCurrentStudent(student);
        soundService.playFanfare();
        setSuccessMsg(`Logged in as Administrator (${student.email})!`);
        setTimeout(() => onAuthenticated(student), 800);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData      = JSON.parse(event.target.result);
        const restoredStudent = authService.importStudentBackup(backupData);
        soundService.playFanfare();
        setSuccessMsg(`Backup restored for ${restoredStudent.name}!`);
        setTimeout(() => onAuthenticated(restoredStudent), 1000);
      } catch (err) {
        soundService.playFail();
        setError('Restore failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative w-full h-screen min-h-screen bg-black overflow-hidden font-sans">
      {/* ── Main Hero Section Background (100% specification compliant) ── */}
      <VexHero
        onStartChat={() => setIsAuthModalOpen(true)}
        onExplore={() => setIsAuthModalOpen(true)}
      >
        {/* Floating Quick Action Pill for Instant Student Access */}
        <div className="absolute top-24 right-6 md:right-12 lg:right-16 z-20">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="liquid-glass border border-white/20 text-white/90 hover:text-white px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-105 shadow-xl cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Student Portal</span>
            <LogIn size={14} className="text-white/70" />
          </button>
        </div>

        {/* ── Liquid Glass Authentication Modal ── */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md transition-all">
            <div className="relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto liquid-glass border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <IngeniumLogoMark size={24} />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-gray-400 uppercase font-semibold">
                    INGENIUM ACADEMY
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                  {mode === 'signup' ? 'Create Student Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  {mode === 'signup'
                    ? 'Your private student workspace keeps your code and progress secure.'
                    : 'Sign in with your registered email and compulsory password.'}
                </p>
              </div>

              {/* Prominent Google Sign-In */}
              <div className="mb-5">
                <GoogleSignInButton 
                  onSuccess={handleGoogleSuccess}
                  onAuthenticated={handleGoogleSuccess}
                  onError={(err) => setError('Google sign-in error: ' + err.message)}
                />

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-[1px] bg-white/15" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-semibold">
                    or email &amp; password
                  </span>
                  <div className="flex-1 h-[1px] bg-white/15" />
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1 mb-5 rounded-xl gap-1 bg-white/10 border border-white/15">
                {[
                  { id: 'signup', label: 'Create Account' },
                  { id: 'login',  label: 'Sign In' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setMode(t.id); setError(null); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      mode === t.id
                        ? 'bg-white text-black shadow-md'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Alerts */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2">
                  <span className="font-bold text-red-400">Error:</span>
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={mode === 'signup' ? handleRegister : handleLogin} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-300 mb-1 font-semibold">
                      Student Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-300 mb-1 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@ingenium.org"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-300 mb-1 font-semibold">
                    Password <span className="text-amber-400">* compulsory</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-300 mb-1 font-semibold">
                      Confirm Password <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Avatar Selection for Sign Up */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-300 mb-2 font-semibold">
                      Select Companion Avatar
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {AVATARS.map(a => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAvatar(a.id)}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            avatar === a.id
                              ? 'bg-white/20 border-white text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <MascotAvatar mascotType={a.id} size={28} />
                          <span className="text-[10px] font-mono truncate">{a.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
                >
                  <span>{mode === 'signup' ? 'Create Account & Enter' : 'Sign In to Workspace'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Quick Switch Existing Students */}
              {existingStudents.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/15">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                    Switch Registered Account
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {existingStudents.map(s => (
                      <button
                        key={s.email}
                        type="button"
                        onClick={() => handleQuickSwitch(s.email)}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/10 border border-white/15 hover:bg-white/20 text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <MascotAvatar mascotType={s.avatar || 'dragon'} size={14} />
                        <span>{s.name || s.email}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin & Backup Options */}
              <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-gray-400">
                <button
                  type="button"
                  onClick={handleDemoAdminLogin}
                  className="hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                >
                  <ShieldCheck size={13} className="text-amber-400" />
                  <span>Instructor Demo</span>
                </button>

                <label className="hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer">
                  <Upload size={13} />
                  <span>Restore .json</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileRestore}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </VexHero>
    </div>
  );
}

export default AuthGateScreen;
