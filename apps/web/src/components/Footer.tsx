'use client';

import React from 'react';
import Link from 'next/link';

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
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Next Stage Logo" className="h-10 w-auto rounded-lg border border-pink-500/15 object-contain shrink-0" />
          <div className="flex flex-col gap-0.5 justify-start">
            <span className="text-sm font-black tracking-widest text-[#f1ecff] uppercase leading-none">Next Stage</span>
            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest leading-none mt-0.5">Music Academy</span>
          </div>
        </div>
        <p>&copy; 2026 Next Stage Music Academy. Cancel anytime, no obligation.</p>
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
