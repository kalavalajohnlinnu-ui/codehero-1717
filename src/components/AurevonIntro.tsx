import React, { useState, useEffect } from 'react';
import { Flower2 } from 'lucide-react';
import { IngeniumLogoMark } from './IngeniumLogo';

interface AurevonIntroProps {
  onEnter?: () => void;
}

const EASING_ENTRANCE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASING_OVERLAY = 'cubic-bezier(0.76, 0, 0.24, 1)';
const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4';

const NAV_LINKS = ['The Academy', '7 Languages Track', 'Algorithm Arena', 'Student Sign In'];

export function AurevonIntro({ onEnter }: AurevonIntroProps) {
  const [navMounted, setNavMounted] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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

  // Overflow hidden on body when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOverlayOpen]);

  const handleLinkClick = (linkName: string) => {
    setIsOverlayOpen(false);
    if (linkName === 'Home' || linkName === 'Collection' || linkName === 'Story' || linkName === 'Inquire') {
      if (onEnter) onEnter();
    }
  };

  return (
    <div className="bg-black min-h-screen text-white relative w-full select-none overflow-x-hidden">
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
              <span className="font-mono tracking-[0.18em] font-black text-lg md:text-xl">INGENIUM</span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-white/20 text-white/70 font-normal hidden sm:inline-block">
                Academy
              </span>
            </div>
          </a>

          {/* Center — Desktop Only: Navigate Pill */}
          <button
            type="button"
            onClick={() => setIsOverlayOpen(prev => !prev)}
            className={`hidden md:flex px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 items-center gap-2 transition-all cursor-pointer z-50 ${
              navMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDuration: '700ms',
              transitionDelay: navMounted ? '200ms' : '0ms'
            }}
          >
            {isOverlayOpen ? 'Close' : 'Navigate'}
          </button>

          {/* Right — Desktop Only: Flower2 icon */}
          <div
            className={`hidden md:flex transition-all z-50 ${
              navMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDuration: '700ms',
              transitionDelay: navMounted ? '400ms' : '0ms'
            }}
          >
            <Flower2 className="w-7 h-7 text-white/90" />
          </div>

          {/* Right — Mobile: Hamburger (md:hidden) */}
          <button
            type="button"
            onClick={() => setIsOverlayOpen(prev => !prev)}
            aria-label="Toggle menu"
            className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer z-50 transition-all ${
              navMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: EASING_ENTRANCE,
              transitionDuration: '700ms',
              transitionDelay: navMounted ? '200ms' : '0ms'
            }}
          >
            {/* Top Bar */}
            <span
              className={`w-6 h-[2px] bg-white transition-transform ${
                isOverlayOpen ? 'rotate-45 translate-y-[4px]' : ''
              }`}
              style={{
                transitionTimingFunction: EASING_OVERLAY,
                transitionDuration: '500ms'
              }}
            />
            {/* Bottom Bar */}
            <span
              className={`w-6 h-[2px] bg-white transition-transform ${
                isOverlayOpen ? '-rotate-45 -translate-y-[4px]' : ''
              }`}
              style={{
                transitionTimingFunction: EASING_OVERLAY,
                transitionDuration: '500ms'
              }}
            />
          </button>

        </div>
      </header>

      {/* ── FULL-SCREEN OVERLAY MENU ────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-all flex flex-col items-center justify-center ${
          isOverlayOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{
          transitionTimingFunction: EASING_OVERLAY,
          transitionDuration: '700ms'
        }}
      >
        <nav className="flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((name, index) => (
            <a
              key={name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(name);
              }}
              className={`text-white font-instrument text-4xl md:text-6xl hover:opacity-60 transition-all cursor-pointer ${
                isOverlayOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionTimingFunction: EASING_OVERLAY,
                transitionDuration: '600ms',
                transitionDelay: isOverlayOpen ? `${150 + index * 80}ms` : '0ms'
              }}
            >
              {name}
            </a>
          ))}
        </nav>
      </div>

      {/* ── HERO (Full Viewport) ───────────────────────────────── */}
      <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
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
        <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
          {/* H1 (Instrument Serif) */}
          <h1
            className={`font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6 transition-all duration-900 ${
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
            className={`text-white/80 text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto transition-all duration-900 leading-relaxed ${
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
            className={`flex items-center justify-center flex-wrap gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-white/60 mb-8 transition-all duration-900 ${
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
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onEnter) onEnter();
              }}
              className={`inline-block px-9 py-4 bg-white text-black text-sm md:text-base font-semibold rounded-full hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-900 cursor-pointer shadow-xl shadow-white/10 ${
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
