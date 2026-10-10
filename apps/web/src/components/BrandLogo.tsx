'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withLink?: boolean;
  className?: string;
  showEqualizer?: boolean;
}

const playBeep = (freq = 1000, duration = 0.04, type: OscillatorType = 'sine') => {
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

export default function BrandLogo({
  size = 'md',
  withLink = true,
  className = '',
  showEqualizer = true,
}: BrandLogoProps) {
  // Dimension and typography configs per size tier
  const sizeConfig = {
    sm: {
      img: 'h-8 w-8',
      title: 'text-base',
      sub: 'text-[8px] tracking-[0.28em]',
      gap: 'gap-2',
      equalizer: 'h-2',
    },
    md: {
      img: 'h-11 w-11',
      title: 'text-xl tracking-wider',
      sub: 'text-[9.5px] tracking-[0.32em]',
      gap: 'gap-3',
      equalizer: 'h-3',
    },
    lg: {
      img: 'h-16 w-16 md:h-20 md:w-20',
      title: 'text-3xl md:text-4xl tracking-wider',
      sub: 'text-xs md:text-sm tracking-[0.38em]',
      gap: 'gap-4',
      equalizer: 'h-4',
    },
  }[size];

  const content = (
    <div
      className={`group flex items-center ${sizeConfig.gap} select-none transition-transform duration-200 ${className}`}
      onMouseEnter={() => playBeep(1050, 0.04)}
    >
      {/* Illuminated Emblem Frame */}
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-pink-500/40 via-purple-500/30 to-cyan-400/40 blur-[6px] opacity-70 group-hover:opacity-100 group-hover:blur-[8px] transition-all duration-300" />
        <div className={`relative ${sizeConfig.img} rounded-xl p-[1.5px] bg-gradient-to-br from-pink-500 via-purple-500/60 to-cyan-400/80 shadow-md`}>
          <img
            src="/logo.jpg"
            alt="NXT STAGE MUSIC Logo"
            className="w-full h-full object-cover rounded-[10px] bg-[#0b0813]"
          />
        </div>
      </div>

      {/* High-Impact Wordmark Lockup */}
      <div className="flex flex-col justify-center leading-none">
        {/* Primary Line: NXT STAGE */}
        <div className={`font-heading font-black uppercase ${sizeConfig.title} flex items-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]`}>
          <span className="text-white tracking-tight">NXT</span>
          <span className="ml-1.5 bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(236,72,153,0.35)]">
            STAGE
          </span>
        </div>

        {/* Subtitle Line: MUSIC with Equalizer Rhythm Accent */}
        <div className="flex items-center gap-2 mt-1 leading-none">
          <span className={`font-mono font-black uppercase ${sizeConfig.sub} text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.45)]`}>
            MUSIC
          </span>
          {showEqualizer && (
            <span className="flex items-end gap-[2px] ml-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="w-[2px] h-2 bg-pink-500 rounded-full animate-pulse" />
              <span className="w-[2px] h-3 bg-purple-400 rounded-full animate-pulse [animation-delay:150ms]" />
              <span className="w-[2px] h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:300ms]" />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block shrink-0 focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
