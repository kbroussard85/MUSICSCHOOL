'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

const playBeep = (freq = 800, duration = 0.08, type: OscillatorType = 'sine') => {
  if (typeof window === 'undefined') return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
    setTimeout(() => {
      audioCtx.close();
    }, duration * 1000 + 100);
  } catch (e) {
    // Audio Context blocked
  }
};

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-[#06040a] py-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
        <BrandLogo size="sm" />
        <p>&copy; 2026 Nxt Stage Music. Cancel anytime, no obligation.</p>
        <div className="flex gap-6 font-bold">
          <Link 
            href="/signup?action=contact" 
            className="hover:text-cyan-400 transition-colors" 
            onMouseEnter={() => playBeep(1200, 0.02)}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
