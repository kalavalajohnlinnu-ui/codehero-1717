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
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';
import { GoogleSignInButton } from './GoogleSignInButton';
import { IngeniumLogoMark } from './IngeniumLogo';

const AVATARS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & AI Guardian' },
  { id: 'robot',  name: 'Cyber Sentinel', desc: 'Systems & Architecture' },
  { id: 'cat',   name: 'Byte Fox',        desc: 'Fast Logic & Web Apps' },
  { id: 'owl',   name: 'Wise Raven',      desc: 'Algorithms & Insight' }
];

const LANGUAGES_LIST = [
  'Python', 'JavaScript', 'HTML & CSS', 'SQL', 'Java', 'C & C++', 'Rust'
];

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

function StatBadge({ value, label, color = '#38BDF8' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono font-black text-2xl leading-none" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest font-mono text-white/70 font-semibold">
        {label}
      </span>
    </div>
  );
}

export function AuthGateScreen({ onAuthenticated, onBackToIntro }) {
  const [mode, setMode]                         = useState('signup'); // 'signup' | 'login'
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [avatar, setAvatar]                     = useState('dragon');
  const [error, setError]                       = useState(null);
  const [successMsg, setSuccessMsg]             = useState(null);

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
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden font-sans select-none flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      {/* ── 1. Full-Screen Raw Video Background (No dimming, no dark overlay) ── */}
      <video
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── 2. Two-Column Foreground Layout ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 lg:gap-12 min-h-[85vh]">

        {/* ── Left Column: Mission & Curriculum Details (Frosted Glass Panel) ── */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-7 sm:p-10 lg:p-12 rounded-3xl backdrop-blur-xl bg-black/45 border border-white/20 shadow-2xl text-white">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <IngeniumLogoMark size={38} />
                <div className="flex flex-col">
                  <span className="font-mono font-black text-sm tracking-[0.2em] text-white leading-tight">
                    INGENIUM 2.0
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-sky-400 uppercase font-bold">
                    ACADEMY PLATFORM
                  </span>
                </div>
              </div>

              {onBackToIntro && (
                <button
                  type="button"
                  onClick={onBackToIntro}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Intro</span>
                </button>
              )}
            </div>

            {/* Mission Eyebrow & Headline */}
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-sky-400 font-bold mb-3">
              01 // YOUR MISSION
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.12] tracking-tight mb-5">
              Become the<br />
              <span className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                Top 10–15%
              </span><br />
              Software Engineer
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-lg mb-8">
              631 structured lessons across 7 programming languages. Real coding tasks, diagnostic debugging cases, and a personalized study plan.
            </p>

            {/* 3 Stats Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6 border-t border-white/15">
              <StatBadge value="631" label="Lessons" color="#38BDF8" />
              <StatBadge value="7" label="Languages" color="#34D399" />
              <StatBadge value="100%" label="Free" color="#FBBF24" />
            </div>
          </div>

          {/* Languages Strip at Bottom */}
          <div className="pt-6 border-t border-white/15 mt-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-3 font-bold">
              LANGUAGES YOU'LL MASTER
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES_LIST.map(lang => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/10 border border-white/20 text-white/90 shadow-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: The Blurred Box for Account Creating (As shown in image) ── */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="w-full backdrop-blur-2xl bg-white/92 border border-white/80 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl shadow-black/40 text-slate-900 transition-all">

            {/* Header */}
            <div className="mb-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-sky-600 font-bold mb-1">
                {mode === 'signup' ? '02 // CREATE ACCOUNT' : '02 // SIGN IN'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                {mode === 'signup' ? 'Start your journey' : 'Welcome back'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'signup'
                  ? 'Your progress is saved permanently under your account.'
                  : 'Log in with your registered email and password.'}
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="mb-5">
              <GoogleSignInButton 
                onSuccess={handleGoogleSuccess}
                onAuthenticated={handleGoogleSuccess}
                onError={(err) => setError('Google sign-in error: ' + err.message)}
              />

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  OR USE EMAIL
                </span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>
            </div>

            {/* Tabs: Create Account / Log In */}
            <div className="flex p-1 mb-5 rounded-xl gap-1 bg-slate-100/90 border border-slate-200/80">
              {[
                { id: 'signup', label: 'Create Account' },
                { id: 'login',  label: 'Log In' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setMode(t.id); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    mode === t.id
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'signup' ? handleRegister : handleLogin} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                    YOUR FULL NAME
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  PASSWORD (COMPULSORY)
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Companion Selection in 2x2 Grid (As shown in screenshot) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                    CHOOSE YOUR CODING COMPANION
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVATARS.map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAvatar(a.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          avatar === a.id
                            ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                            : 'bg-slate-50/90 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <MascotAvatar mascotType={a.id} size={28} />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 leading-tight truncate">{a.name}</div>
                          <div className="text-[10px] text-slate-500 leading-tight truncate">{a.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.98]"
              >
                <span>
                  {mode === 'signup' ? 'Create Account & Enter Academy →' : 'Sign In & Enter Academy →'}
                </span>
              </button>
            </form>

            {/* Saved Profiles Section */}
            {existingStudents.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-200">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                  SAVED PROFILES ON THIS DEVICE
                </div>
                <div className="flex flex-wrap gap-2">
                  {existingStudents.map(s => (
                    <button
                      key={s.email}
                      type="button"
                      onClick={() => handleQuickSwitch(s.email)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-800 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <MascotAvatar mascotType={s.avatar || 'dragon'} size={16} />
                      <div className="text-left">
                        <div className="font-bold leading-none">{s.name}</div>
                        <div className="text-[9px] text-slate-400 truncate max-w-[120px]">{s.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer: Backup Restore & Demo Login */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="hover:text-sky-600 transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer"
              >
                <ShieldCheck size={14} className="text-amber-500" />
                <span>Instructor Demo</span>
              </button>

              <label className="hover:text-sky-600 transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer">
                <Upload size={13} />
                <span>Restore Backup</span>
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

      </div>
    </div>
  );
}

export default AuthGateScreen;
