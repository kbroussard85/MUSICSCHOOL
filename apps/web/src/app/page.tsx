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
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime); // Low volume so it's pleasant
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
    setTimeout(() => {
      audioCtx.close();
    }, duration * 1000 + 100);
  } catch (e) {
    // Audio context might be blocked initially
  }
};

export default function LandingPage() {
  const handleNavClick = () => {
    playBeep(900, 0.1, 'sine');
  };

  return (
    <div className="min-h-screen text-[#f1ecff] font-sans antialiased overflow-x-hidden relative bg-[#06040a]">
      
      {/* Background Hero Image with Parallax fixed attachment */}
      <div 
        className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 4, 10, 0.65), rgba(6, 4, 10, 0.98)), url('/band_adults.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/15 bg-[#0b0813]/90 backdrop-blur-md">
        {/* Top studio status bar */}
        <div className="w-full bg-[#06040a] border-b border-cyan-500/5 px-6 py-1 flex justify-between text-[9px] font-mono tracking-widest text-slate-500">
          <span>ACADEMY STATUS: ENROLLMENT ACTIVE</span>
          <span className="flex items-center gap-1.5">
            <span className="indicator-dot"></span>
            ACTIVE REHEARSAL STUDIOS
          </span>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5 justify-start">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-lg font-black tracking-widest text-[#f1ecff]"
              onMouseEnter={() => playBeep(1000, 0.04)}
            >
              <i className="fa-solid fa-music text-pink-500 glow-pulse-pink shrink-0"></i>
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">Next Stage</span>
            </Link>
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest leading-none glow-pulse-cyan">Music Academy</span>
          </div>

          <nav className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-300">
            <Link 
              href="/signup?action=contact" 
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
              onMouseEnter={() => playBeep(1100, 0.03)}
              onClick={handleNavClick}
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
              onMouseEnter={() => playBeep(1100, 0.03)}
              onClick={handleNavClick}
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 cyber-btn-pink text-xs font-black"
              onMouseEnter={() => playBeep(1200, 0.04)}
              onClick={handleNavClick}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Splash / Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center min-h-[85vh] justify-center">
        
        {/* Logo Icon Accent */}
        <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/35 flex items-center justify-center text-pink-500 text-2xl mb-8 glow-pulse-pink">
          <i className="fa-solid fa-music"></i>
        </div>

        {/* Motto Block */}
        <div className="p-8 border-l-4 border-pink-500 bg-[#0b0813]/85 backdrop-blur-md shadow-2xl mb-10 text-left relative overflow-hidden max-w-4xl">
          <div className="absolute top-0 right-0 p-2 text-[9px] font-mono text-cyan-400/35 tracking-widest uppercase">
            Academy Motto
          </div>
          <p className="text-xl md:text-3xl font-heading font-black italic text-[#f8fafc] leading-snug uppercase tracking-wide">
            "Anyone can learn how to play an instrument online, but you have to play with other musicians to learn how to jam!"
          </p>
        </div>

        {/* Copy Update */}
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mb-12 uppercase tracking-wide font-bold bg-black/40 p-4 border border-cyan-500/5 backdrop-blur-sm">
          Bridging the gap between digital practice and physical performance. Next Stages Music Academy combines world-class technical instruction with professional stage experience. Our goal is to get you out of the bedroom and into the jam session. Combining virtual lessons and masterclasses with in person live performance and preparing you for the stage and studio!
        </p>

        {/* Access CTAs (Only 2 buttons, 3-day trial highlighted) */}
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
          <Link 
            href="/signup" 
            className="flex-1 py-4 text-center cyber-btn-pink text-xs font-black tracking-widest cursor-pointer shadow-lg shadow-pink-500/15"
            onMouseEnter={() => playBeep(1000, 0.04)}
            onClick={() => playBeep(850, 0.12, 'square')}
          >
            Sign up for your 3 day trial
          </Link>
          <Link 
            href="/login" 
            className="flex-1 py-4 text-center cyber-btn-cyan text-xs font-black tracking-widest cursor-pointer bg-[#0b0813]/70"
            onMouseEnter={() => playBeep(1000, 0.04)}
            onClick={() => playBeep(850, 0.12, 'square')}
          >
            Log In
          </Link>
        </div>

      </section>

      {/* Choose your band Section */}
      <section className="relative z-10 py-24 border-t border-cyan-500/15 bg-black/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 cyber-badge-cyan px-3 py-1">
              Performance Pathways
            </span>
            <h2 className="text-4xl font-heading font-black uppercase tracking-wider mt-4">
              Choose Your Band
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">
              Select your track and register to claim your spot in rehearsals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Teen Rock */}
            <div 
              className="cyber-card p-8 bg-[#0b0813]/90 border-cyan-500/20 relative group hover:border-pink-500/40 transition-all cursor-pointer"
              onMouseEnter={() => playBeep(1100, 0.04)}
            >
              <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">Ages 13 - 17</span>
              <h3 className="font-heading text-2xl font-black text-slate-100 uppercase tracking-wide mb-4">Teen Rock</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider leading-relaxed mb-6 font-medium">
                Plug in, turn up, and jam with players your age. Rehearse weekly, master classic riff-driven genres, and prepare for live venue showcases.
              </p>
              <Link 
                href="/signup?program=teen-rock"
                className="inline-block w-full py-2.5 text-center cyber-btn-cyan text-[10px] font-black uppercase tracking-wider"
              >
                Claim Teen Roster Spot
              </Link>
            </div>

            {/* All Stars */}
            <div 
              className="cyber-card p-8 bg-[#0b0813]/90 border-cyan-500/20 relative group hover:border-pink-500/40 transition-all cursor-pointer"
              onMouseEnter={() => playBeep(1100, 0.04)}
            >
              <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">Audition Only</span>
              <h3 className="font-heading text-2xl font-black text-slate-100 uppercase tracking-wide mb-4">All Stars</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider leading-relaxed mb-6 font-medium">
                Our flagship touring group. Advanced players build stage presence, learn complex arrangements, and perform live at local music festivals.
              </p>
              <Link 
                href="/signup?program=all-stars"
                className="inline-block w-full py-2.5 text-center cyber-btn-cyan text-[10px] font-black uppercase tracking-wider"
              >
                Inquire Audition
              </Link>
            </div>

            {/* Adult Jam */}
            <div 
              className="cyber-card p-8 bg-[#0b0813]/90 border-cyan-500/20 relative group hover:border-pink-500/40 transition-all cursor-pointer"
              onMouseEnter={() => playBeep(1100, 0.04)}
            >
              <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">Ages 18+</span>
              <h3 className="font-heading text-2xl font-black text-slate-100 uppercase tracking-wide mb-4">Adult Jam</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider leading-relaxed mb-6 font-medium">
                Form bands with local musicians, master ensemble dynamics, and reconnect with your passion. Rehearse weekly and play real stage gigs.
              </p>
              <Link 
                href="/signup?program=adult-jam"
                className="inline-block w-full py-2.5 text-center cyber-btn-cyan text-[10px] font-black uppercase tracking-wider"
              >
                Claim Adult Roster Spot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Ecosystem of Music Section */}
      <section className="relative z-10 py-24 border-t border-cyan-500/15 bg-black/40">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="cyber-card p-8 md:p-12 border-pink-500/25 bg-[#0b0813]/95 shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 cyber-badge-pink px-3 py-1 block w-fit mb-6">
              Our Educational Method
            </span>
            
            <h3 className="font-heading text-2xl md:text-4xl font-black text-slate-100 uppercase tracking-wider mb-6 leading-tight">
              We don't just teach notes. <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                We teach the ecosystem of music.
              </span>
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wider font-semibold mb-10">
              Our three-pillar approach ensures you graduate from bedroom practice to center stage spotlight.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px] font-mono text-slate-400 border-t border-cyan-500/10 pt-8">
              <div>
                <span className="block text-pink-500 uppercase font-black mb-2 text-xs">Pillar 1: Private Instruction</span>
                <p className="leading-relaxed uppercase tracking-wide">
                  World-class technical instruction tailored to your goals. Learn scales, posture, and mechanics from certified directors.
                </p>
              </div>
              <div>
                <span className="block text-purple-400 uppercase font-black mb-2 text-xs">Pillar 2: Weekly Rehearsals</span>
                <p className="leading-relaxed uppercase tracking-wide">
                  Step out of the bedroom. Collaborate with other players to master band setups, timing, and dynamic chemistry.
                </p>
              </div>
              <div>
                <span className="block text-cyan-400 uppercase font-black mb-2 text-xs">Pillar 3: The Live Stage</span>
                <p className="leading-relaxed uppercase tracking-wide">
                  Culminate your training by performing real, ticketed showcases at local venues. Build stage confidence under spotlights.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/15 bg-[#06040a] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
          <div className="flex flex-col gap-0.5 justify-start">
            <div className="flex items-center gap-2 text-lg font-black tracking-widest text-[#f1ecff]">
              <i className="fa-solid fa-music text-pink-500 shrink-0"></i>
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Next Stage</span>
            </div>
            <span className="text-[9px] font-black text-cyan-400 tracking-widest leading-none">Music Academy</span>
          </div>
          <p>&copy; 2026 Next Stage Music Academy. Cancel anytime, no obligation.</p>
          <div className="flex gap-6 font-bold">
            <Link href="/signup?action=contact" className="hover:text-cyan-400 transition-colors" onMouseEnter={() => playBeep(1200, 0.02)}>Contact Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
