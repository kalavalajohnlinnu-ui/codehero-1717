import React, { useState, useEffect } from 'react';

/**
 * FadeIn Component
 * Starts with opacity: 0 and transitions to opacity: 1 after configurable delay (ms).
 * Transition duration is configurable via inline transitionDuration style.
 */
export interface FadeInProps {
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export function FadeIn({
  delay = 0,
  duration = 1000,
  className = '',
  children
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * AnimatedHeading Component
 * Splits text by \n into lines, then each line into individual characters.
 * Each character is an inline-block <span> with CSS transitions on opacity and translateX.
 * Animation triggers via React state after 200ms initial delay.
 * Delay formula: (lineIndex * lineLength * charDelay) + (charIndex * charDelay) with charDelay = 30ms.
 * Each character transition is 500ms. Spaces render as \u00A0.
 */
export interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className = '' }: AnimatedHeadingProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');
  const charDelay = 30; // 30ms

  return (
    <h1
      className={`font-normal mb-4 text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white ${className}`}
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIndex) => {
        const lineLength = lines[0]?.length || line.length;
        return (
          <span key={lineIndex} className="block overflow-hidden">
            {line.split('').map((char, charIndex) => {
              const delay = (lineIndex * lineLength * charDelay) + (charIndex * charDelay);
              const isSpace = char === ' ';
              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: '500ms',
                    transitionDelay: `${delay}ms`
                  }}
                >
                  {isSpace ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}

export interface VexHeroProps {
  onStartChat?: () => void;
  onExplore?: () => void;
  children?: React.ReactNode;
}

/**
 * VEX Hero Section
 * Specifications:
 * - Full-screen background video (object-cover, raw, no dark/gradient overlay)
 * - Typography: Inter font-sans
 * - Navbar: wrapped in px-6 md:px-12 lg:px-16 pt-6, .liquid-glass rounded-xl px-4 py-2
 * - Left: Logo "VEX" (text-2xl font-semibold tracking-tight)
 * - Center: Links "Story", "Investing", "Building", "Advisory" (hidden on mobile, visible md+)
 * - Right: "Start a Chat" button (bg-white text-black px-6 py-2 rounded-lg text-sm font-medium)
 * - Hero content at bottom of viewport (pb-12 lg:pb-16)
 * - 2-column grid on large screens
 * - Left: AnimatedHeading, Subheading (FadeIn 800ms/1000ms), Buttons row (FadeIn 1200ms/1000ms)
 * - Right: Tag "Investing. Building. Advisory." inside .liquid-glass card (FadeIn 1400ms/1000ms)
 */
export function VexHero({ onStartChat, onExplore, children }: VexHeroProps) {
  const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

  return (
    <div className="relative w-full h-screen min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col select-none">
      {/* ── 1. Video Background (Raw with NO dimming or overlay) ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── 2. Foreground Container ── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between flex-1">
        {/* Navbar */}
        <header className="w-full px-6 md:px-12 lg:px-16 pt-6 shrink-0">
          <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="text-2xl font-semibold tracking-tight text-white">
              VEX
            </div>

            {/* Center: Navigation Links (hidden on mobile, visible md+) */}
            <div className="hidden md:flex items-center gap-8 text-sm text-white">
              {['Story', 'Investing', 'Building', 'Advisory'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="transition-colors hover:text-gray-300 cursor-pointer"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Right: CTA Button */}
            <button
              type="button"
              onClick={onStartChat}
              className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Start a Chat
            </button>
          </nav>
        </header>

        {/* Hero Content (Pushed to bottom of viewport) */}
        <main className="w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end gap-8">
            {/* Left Column: Main Content */}
            <div className="flex flex-col">
              {/* Heading */}
              <AnimatedHeading text={"Shaping tomorrow\nwith vision and action."} />

              {/* Subheading */}
              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-gray-300 mb-5 max-w-xl">
                  We back visionaries and craft ventures that define what comes next.
                </p>
              </FadeIn>

              {/* Buttons Row */}
              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={onStartChat}
                    className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer shadow-lg"
                  >
                    Start a Chat
                  </button>
                  <button
                    type="button"
                    onClick={onExplore}
                    className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
                  >
                    Explore Now
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Tag Card (Aligned to bottom-right on lg screens) */}
            <div className="mt-8 lg:mt-0 flex items-end justify-start lg:justify-end">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl shadow-xl">
                  <span className="text-lg md:text-xl lg:text-2xl font-light text-white tracking-wide">
                    Investing. Building. Advisory.
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </main>
      </div>

      {/* Optional Overlay Child Content (e.g. Login Modal / Drawer) */}
      {children}
    </div>
  );
}

export default VexHero;
