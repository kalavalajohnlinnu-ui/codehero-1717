// Web Audio API Synthesized Sound Effects for Python Hero
// Works entirely client-side without any external MP3 files!

class SoundService {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Play a single synthesized note
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, startTimeOffset = 0) {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime + startTimeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTimeOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTimeOffset);
      osc.stop(ctx.currentTime + startTimeOffset + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Tactile button click sound
  playClick() {
    this.playTone(600, 'sine', 0.05, 0.08);
  }

  // Success arpeggio chime (C5 -> E5 -> G5 -> C6)
  playSuccess() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, 0.12, idx * 0.09);
    });
  }

  // Gentle, friendly "Oops" boop (soft two-tone marimba, non-punishing)
  playFail() {
    if (this.muted) return;
    this.playTone(349.23, 'sine', 0.18, 0.12, 0); // F4
    this.playTone(293.66, 'sine', 0.25, 0.10, 0.12); // D4
  }

  // Triumphant Level Up / Quest Mastered Fanfare!
  playFanfare() {
    if (this.muted) return;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.14, t: 0.24 },
      { f: 1046.50, d: 0.4, t: 0.38 },
      { f: 880.00, d: 0.15, t: 0.55 },
      { f: 1046.50, d: 0.6, t: 0.7 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.15, n.t);
    });
  }

  // Magic spell chime (sparkles)
  playMagic() {
    if (this.muted) return;
    const freqs = [784, 880, 988, 1175, 1318, 1568];
    freqs.forEach((f, i) => {
      this.playTone(f, 'sine', 0.12, 0.08, i * 0.05);
    });
  }
}

export const soundService = new SoundService();
