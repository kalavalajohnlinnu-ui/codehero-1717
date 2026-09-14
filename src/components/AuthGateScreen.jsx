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
    <div className="flex flex-col">
      <span className="font-mono font-black text-2xl sm:text-3xl leading-none" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest font-mono text-white font-bold mt-1">
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
  // Strictly ONE saved profile only
  const savedProfile = existingStudents[0] || null;

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
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden font-sans select-none flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* ── 1. Full-Screen Raw Video Background ── */}
      <video
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── 2. Full-Width Split Layout (Anchored Left & Right, Maximum Contrast) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 min-h-[88vh] py-6">

        {/* ── Left Column: Mission (Solid dark high-contrast panel) ── */}
        <div className="w-full lg:max-w-[520px] h-fit p-7 sm:p-9 rounded-3xl backdrop-blur-2xl bg-black/75 border border-white/20 shadow-2xl text-white">
          {/* Brand Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <IngeniumLogoMark size={34} />
              <div className="flex flex-col">
                <span className="font-mono font-black text-sm tracking-[0.2em] text-white leading-tight">
                  INGENIUM 2.0
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#FCD34D] uppercase font-bold">
                  ACADEMY PLATFORM
                </span>
              </div>
            </div>

            {onBackToIntro && (
              <button
                type="button"
                onClick={onBackToIntro}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-white hover:text-[#FCD34D] bg-white/15 hover:bg-white/25 border border-white/20 transition-all cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Intro</span>
              </button>
            )}
          </div>

          {/* Mission Eyebrow & Headline */}
          <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#FCD34D] font-extrabold mb-2.5">
            01 // YOUR MISSION
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.15] tracking-tight mb-4 drop-shadow-md">
            Become the<br />
            <span className="text-[#FCD34D] drop-shadow-[0_0_20px_rgba(252,211,77,0.55)]">
              Top 10–15%
            </span><br />
            Software Engineer
          </h1>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-lg mb-6 font-medium drop-shadow-xs">
            631 structured lessons across 7 programming languages. Real coding tasks, diagnostic debugging cases, and a personalized study plan.
          </p>

          {/* 3 Stats Grid */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-white/20 mb-5">
            <StatBadge value="631" label="Lessons" color="#38BDF8" />
            <StatBadge value="7" label="Languages" color="#FCD34D" />
            <StatBadge value="100%" label="Free" color="#34D399" />
          </div>

          {/* Languages Strip (High-contrast badges) */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#FCD34D] mb-2.5 font-extrabold">
              LANGUAGES YOU'LL MASTER
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES_LIST.map(lang => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/20 border border-white/30 text-white shadow-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: The Account Creation Card (Ultra-Visible High-Contrast Typography) ── */}
        <div className="w-full lg:w-[430px] shrink-0 h-fit">
          <div className="w-full backdrop-blur-2xl bg-white/96 border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/50 text-slate-950 transition-all">

            {/* Header */}
            <div className="mb-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-sky-700 font-extrabold mb-1">
                {mode === 'signup' ? '02 // CREATE ACCOUNT' : '02 // SIGN IN'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
                {mode === 'signup' ? 'Start your journey' : 'Welcome back'}
              </h2>
              <p className="text-xs text-slate-700 mt-1 font-medium">
                {mode === 'signup'
                  ? 'Your progress is saved permanently under your account.'
                  : 'Log in with your registered email and password.'}
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="mb-3.5">
              <GoogleSignInButton 
                onSuccess={handleGoogleSuccess}
                onAuthenticated={handleGoogleSuccess}
                onError={(err) => setError('Google sign-in error: ' + err.message)}
              />

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-[1.5px] bg-slate-300" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-700 font-bold">
                  OR USE EMAIL
                </span>
                <div className="flex-1 h-[1.5px] bg-slate-300" />
              </div>
            </div>

            {/* Tabs: Create Account / Log In */}
            <div className="flex p-1 mb-3.5 rounded-xl gap-1 bg-slate-100 border border-slate-300">
              {[
                { id: 'signup', label: 'Create Account' },
                { id: 'login',  label: 'Log In' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setMode(t.id); setError(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-all cursor-pointer ${
                    mode === t.id
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300 font-black'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 text-xs font-semibold flex items-start gap-2">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* High-Contrast Form Fields */}
            <form onSubmit={mode === 'signup' ? handleRegister : handleLogin} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-900 font-black mb-1">
                    YOUR FULL NAME
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-950 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-900 font-black mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-950 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-900 font-black mb-1">
                  PASSWORD (COMPULSORY)
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-950 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-900 font-black mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-950 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Companion Selection: Compact 2x2 Grid with Bold Labels */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-900 font-black mb-1.5">
                    CHOOSE YOUR CODING COMPANION
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVATARS.map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAvatar(a.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          avatar === a.id
                            ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/20 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <MascotAvatar mascotType={a.id} size={22} />
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-950 leading-tight truncate">{a.name}</div>
                          <div className="text-[9px] text-slate-600 font-medium leading-tight truncate">{a.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-[0.98]"
              >
                <span>
                  {mode === 'signup' ? 'Create Account & Enter Academy →' : 'Sign In & Enter Academy →'}
                </span>
              </button>
            </form>

            {/* ── ONE PROFILE ONLY: Saved Profile on This Device ── */}
            {savedProfile && (
              <div className="mt-3.5 pt-3 border-t-2 border-slate-200">
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-800 mb-1.5 font-extrabold">
                  SAVED PROFILE ON THIS DEVICE
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSwitch(savedProfile.email)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-100 border-2 border-slate-300 hover:border-sky-500 hover:bg-sky-50 text-slate-950 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <MascotAvatar mascotType={savedProfile.avatar || 'dragon'} size={20} />
                    <div className="text-left">
                      <div className="font-black text-slate-950 leading-tight">{savedProfile.name}</div>
                      <div className="text-[10px] text-slate-600 font-medium truncate max-w-[170px]">{savedProfile.email}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-sky-700 font-black group-hover:underline">
                    Sign in →
                  </span>
                </button>
              </div>
            )}

            {/* Footer: Backup Restore & Demo Login */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-bold">
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="hover:text-sky-700 transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer"
              >
                <ShieldCheck size={14} className="text-amber-600" />
                <span>Instructor Demo</span>
              </button>

              <label className="hover:text-sky-700 transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer">
                <Upload size={12} />
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
