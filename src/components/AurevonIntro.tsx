import React, { useState, useEffect } from 'react';
import { IngeniumLogoMark } from './IngeniumLogo';

interface AurevonIntroProps {
  onEnter?: () => void;
}

const EASING_ENTRANCE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4';

export function AurevonIntro({ onEnter }: AurevonIntroProps) {
  const [navMounted, setNavMounted] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Set document title to Ingenium
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Ingenium — Master the Craft of Code';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Navbar mounted delay: 100ms
  useEffect(() => {
    const timer = setTimeout(() => setNavMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Hero mounted delay: 300ms
  useEffect(() => {
    const timer = setTimeout(() => setHeroMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener: transparent until window.scrollY > 40
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black min-h-[100dvh] text-white relative w-full select-none overflow-x-hidden">
      {/* ── NAVBAR (fixed) ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          
          {/* Left — Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onEnter) onEnter();
            }}
            className={`text-white text-xl md:text-2xl font-semibold tracking-tight z-50 transition-all flex items-center gap-3 ${
              navMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDuration: '700ms',
              transitionDelay: navMounted ? '0ms' : '0ms'
            }}
          >
            <IngeniumLogoMark size={32} />
            <div className="flex items-center gap-2">
              <span className="font-mono tracking-[0.18em] font-black text-lg md:text-xl text-[#FCD34D]">INGENIUM</span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-white/20 text-white/70 font-normal hidden sm:inline-block">
                Academy
              </span>
            </div>
          </a>

          {/* Right — Clean Minimal Sign In Action */}
          <button
            type="button"
            onClick={() => { if (onEnter) onEnter(); }}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#FCD34D]/40 hover:border-[#FCD34D] text-[#FCD34D] hover:bg-[#FCD34D]/10 text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer touch-manipulation z-50 ${
              navMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDuration: '700ms',
              transitionDelay: navMounted ? '200ms' : '0ms'
            }}
          >
            Sign In →
          </button>

        </div>
      </header>

      {/* ── HERO (Full Viewport) ───────────────────────────────── */}
      <section className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden flex items-end justify-center">
        {/* Background video wrapper */}
        <div
          className={`absolute inset-0 transition-all duration-[1400ms] ${
            heroMounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
          style={{
            transitionTimingFunction: EASING_ENTRANCE
          }}
        >
          <video
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Foreground (bottom-centered) */}
        <div className="relative z-10 text-center px-4 sm:px-6 pb-8 sm:pb-14 md:pb-20 max-w-4xl mx-auto w-full">
          {/* H1 (Instrument Serif) */}
          <h1
            className={`font-instrument text-[#FCD34D] drop-shadow-[0_2px_30px_rgba(252,211,77,0.45)] text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-5 md:mb-6 transition-all duration-900 leading-[1.1] sm:leading-[0.95] ${
              heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDelay: heroMounted ? '400ms' : '0ms'
            }}
          >
            Master the craft of code<br className="hidden sm:block" /> beyond compare
          </h1>

          {/* Subcopy */}
          <p
            className={`text-amber-100 text-xs sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 drop-shadow-sm font-medium max-w-xl mx-auto transition-all duration-900 leading-relaxed px-2 ${
              heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDelay: heroMounted ? '600ms' : '0ms'
            }}
          >
            Seven programming languages. 631 interactive quests. Step inside the private academy of Ingenium and forge the craft of code.
          </p>

          {/* Supported Languages Ticker */}
          <div
            className={`flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-amber-300/85 mb-5 sm:mb-8 transition-all duration-900 font-semibold ${
              heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDelay: heroMounted ? '700ms' : '0ms'
            }}
          >
            <span>PYTHON</span>
            <span>·</span>
            <span>JAVASCRIPT</span>
            <span>·</span>
            <span>C / C++</span>
            <span>·</span>
            <span>SQL</span>
            <span>·</span>
            <span>JAVA</span>
            <span>·</span>
            <span>RUST</span>
          </div>

          {/* CTA: Word meaning welcome */}
          <div className="w-full flex justify-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onEnter) onEnter();
              }}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 bg-[#FCD34D] hover:bg-[#FACC15] text-slate-950 text-sm sm:text-base font-extrabold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-900 cursor-pointer shadow-xl shadow-amber-400/25 touch-manipulation ${
                heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionTimingFunction: EASING_ENTRANCE,
                transitionDelay: heroMounted ? '800ms' : '0ms'
              }}
            >
              Welcome Inside — Enter Ingenium →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AurevonIntro;
