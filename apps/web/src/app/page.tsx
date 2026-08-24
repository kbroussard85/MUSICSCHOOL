'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
      
      <div 
        className="absolute top-0 left-0 w-full h-[110vh] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 4, 10, 0.6), rgba(6, 4, 10, 0.95)), url('/logo.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center -1.0in',
          backgroundAttachment: 'fixed'
        }}
      />

      <Header />

      {/* Raised Main Splash / Hero Section - designed to be fully above the fold */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-8 flex flex-col items-center text-center justify-center min-h-[calc(100vh-80px)]">
        
        {/* Logo and Mission Statement Row */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between w-full mb-6 max-w-5xl text-left">
          {/* Logo Accent on the left */}
          <img src="/logo.jpg" alt="Next Stage Logo" className="h-28 w-auto rounded-xl border border-pink-500/20 object-contain shadow-xl shadow-pink-500/10 shrink-0" />

          {/* Motto Block - reduced padding for vertical space saving */}
          <div className="p-6 border-l-4 border-pink-500 bg-[#0b0813]/85 backdrop-blur-md shadow-2xl relative overflow-hidden flex-1 w-full">
            <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-cyan-400/35 tracking-widest uppercase">
              Academy Motto
            </div>
            <p className="text-base md:text-xl font-heading font-black italic text-[#f8fafc] leading-snug uppercase tracking-wide">
              "Anyone can learn how to play an instrument online, but you have to play with other musicians to learn how to jam!"
            </p>
          </div>
        </div>

        {/* Shortened Copy Update */}
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mb-8 uppercase tracking-wider font-extrabold">
          Bridging the gap between digital practice and physical performance. Next Stages Music Academy combines world-class technical instruction with professional stage experience.
        </p>

        {/* Access CTAs (Sign up for 3 day trial is highlighted, fully visible above fold) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href="/signup" 
            className="flex-1 py-3 text-center cyber-btn-pink text-xs font-black tracking-widest cursor-pointer shadow-lg shadow-pink-500/15"
            onMouseEnter={() => playBeep(1000, 0.04)}
            onClick={() => playBeep(850, 0.12, 'square')}
          >
            Sign up for your free trial
          </Link>
          <Link 
            href="/login" 
            className="flex-1 py-3 text-center cyber-btn-cyan text-xs font-black tracking-widest cursor-pointer bg-[#0b0813]/70"
            onMouseEnter={() => playBeep(1000, 0.04)}
            onClick={() => playBeep(850, 0.12, 'square')}
          >
            Log In
          </Link>
        </div>

      </section>

      {/* Choose your band Section with demographic appropriate images & clean light background */}
      <section className="relative z-10 py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 border border-pink-200/50 px-3 py-1 rounded-full">
              Performance Pathways
            </span>
            <h2 className="text-3xl font-heading font-black uppercase tracking-wider mt-4 text-slate-900">
              Choose Your Band
            </h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest mt-2 font-semibold">
              Select your track and register to claim your spot in rehearsals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Teen Rock (Ages 13-17) - with image */}
            <div 
              className="bg-white border border-slate-200 shadow-md hover:border-pink-500/30 transition-all cursor-pointer overflow-hidden flex flex-col justify-between rounded-xl"
              onMouseEnter={() => playBeep(1100, 0.04)}
            >
              <div className="h-48 w-full relative overflow-hidden shrink-0 border-b border-slate-200">
                <img 
                  src="/band_teens.png" 
                  alt="Teen Rock Band" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest block mb-1">Ages 13 - 17</span>
                  <h3 className="font-heading text-xl font-black text-slate-900 uppercase tracking-wide mb-3">Teen Rock</h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider leading-relaxed mb-6 font-semibold">
                    Plug in, turn up, and jam with players your age. Rehearse weekly, master classic riff-driven genres, and prepare for live venue showcases.
                  </p>
                </div>
                <Link 
                  href="/signup?program=teen-rock"
                  className="inline-block w-full py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                >
                  Claim Teen Roster Spot
                </Link>
              </div>
            </div>

            {/* All Stars (Audition Only) - with image */}
            <div 
              className="bg-white border border-slate-200 shadow-md hover:border-pink-500/30 transition-all cursor-pointer overflow-hidden flex flex-col justify-between rounded-xl"
              onMouseEnter={() => playBeep(1100, 0.04)}
            >
              <div className="h-48 w-full relative overflow-hidden shrink-0 border-b border-slate-200">
                <img 
                  src="/band_rockers.png" 
                  alt="All Stars Performance Band" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest block mb-1">Audition Only</span>
                  <h3 className="font-heading text-xl font-black text-slate-900 uppercase tracking-wide mb-3">All Stars</h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider leading-relaxed mb-6 font-semibold">
                    Our flagship touring group. Advanced players build stage presence, learn complex arrangements, and perform live at local music festivals.
                  </p>
                </div>
                <Link 
                  href="/signup?program=all-stars"
                  className="inline-block w-full py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                >
                  Inquire Audition
                </Link>
              </div>
            </div>

            {/* Adult Jam (Ages 18+) - with image */}
            <div 
              className="bg-white border border-slate-200 shadow-md hover:border-pink-500/30 transition-all cursor-pointer overflow-hidden flex flex-col justify-between rounded-xl"
              onMouseEnter={() => playBeep(1100, 0.04)}
            >
              <div className="h-48 w-full relative overflow-hidden shrink-0 border-b border-slate-200">
                <img 
                  src="/band_adults.png" 
                  alt="Adult Jam Band" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest block mb-1">Ages 18+</span>
                  <h3 className="font-heading text-xl font-black text-slate-900 uppercase tracking-wide mb-3">Adult Jam</h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider leading-relaxed mb-6 font-semibold">
                    Form bands with local musicians, master ensemble dynamics, and reconnect with your passion. Rehearse weekly and play real stage gigs.
                  </p>
                </div>
                <Link 
                  href="/signup?program=adult-jam"
                  className="inline-block w-full py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                >
                  Claim Adult Roster Spot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Locations Section with clean light background */}
      <section id="locations" className="relative z-10 py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-200/50 px-3 py-1 rounded-full">
              Studio Locations
            </span>
            <h2 className="text-3xl font-heading font-black uppercase tracking-wider mt-4 text-slate-900">
              Our Locations
            </h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest mt-2 font-semibold">
              Select your nearest studio hub to register for local bands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Thornton Studio */}
            <Link 
              href="/signup?location=Thornton"
              onClick={() => playBeep(900, 0.1, 'sine')}
              className="bg-slate-50 border border-slate-200 shadow-md hover:border-pink-500/30 transition-all flex flex-col justify-between rounded-xl p-6 relative group"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 text-sm mb-4">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h3 className="font-heading text-lg font-black text-slate-900 uppercase tracking-wide mb-2">Thornton Hub</h3>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mb-4">
                  1280 Civic Center Dr, Thornton, CO
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                  Equipped with premium backline amps, multi-instrument setups, and specialized drum tracking bays.
                </p>
              </div>
              <span className="py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest block rounded-lg transition-colors">
                Select Thornton Roster
              </span>
            </Link>

            {/* Westminster Studio */}
            <Link 
              href="/signup?location=Westminster"
              onClick={() => playBeep(900, 0.1, 'sine')}
              className="bg-slate-50 border border-slate-200 shadow-md hover:border-pink-500/30 transition-all flex flex-col justify-between rounded-xl p-6 relative group"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 text-sm mb-4">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h3 className="font-heading text-lg font-black text-slate-900 uppercase tracking-wide mb-2">Westminster Hub</h3>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mb-4">
                  8800 Sheridan Blvd, Westminster, CO
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                  Features acoustically-isolated rehearsal rooms, digital workstation bays, and vocal tracking studios.
                </p>
              </div>
              <span className="py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest block rounded-lg transition-colors">
                Select Westminster Roster
              </span>
            </Link>

            {/* Broomfield Studio */}
            <Link 
              href="/signup?location=Broomfield"
              onClick={() => playBeep(900, 0.1, 'sine')}
              className="bg-slate-50 border border-slate-200 shadow-md hover:border-pink-500/30 transition-all flex flex-col justify-between rounded-xl p-6 relative group"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 text-sm mb-4">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h3 className="font-heading text-lg font-black text-slate-900 uppercase tracking-wide mb-2">Broomfield Hub</h3>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mb-4">
                  3000 E 1st Ave, Broomfield, CO
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                  Equipped with a full live showcase performance stage, stage monitors, lighting rigs, and keyboard workstations.
                </p>
              </div>
              <span className="py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest block rounded-lg transition-colors">
                Select Broomfield Roster
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Ecosystem of Music Section */}
      <section className="relative z-10 py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="cyber-card p-8 md:p-12 border-pink-500/25 bg-[#0b0813]/95 shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 cyber-badge-pink px-3 py-1 block w-fit mb-6">
              Our Educational Method
            </span>
            
            <h3 className="font-heading text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wider mb-6 leading-tight">
              We don't just teach notes. <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                We teach the ecosystem of music.
              </span>
            </h3>

            <div className="space-y-4 mb-10 text-xs md:text-sm text-slate-300 leading-relaxed font-semibold uppercase tracking-wider">
              <p>
                Our three-pillar approach ensures you graduate from bedroom practice to center stage
              </p>
              <p className="text-slate-400 font-medium normal-case tracking-normal">
                Next Stages Music Academy focuses on the community experience and was specifically created to bring musicians together. We understand that the next stage of development in learning an instrument is playing and performing with other musicians. Our program is a hybrid-learning, performance-based system that provides coached rehearsals and multiple live performances, while also granting access to a massive vault of online lesson material, including videos, tabs, sheet music, masterclasses, and more. Our upgraded package includes online zero-latency one-on-one or group lessons and jam sessions using Lutefish hardware.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px] font-mono text-slate-400 border-t border-cyan-500/10 pt-8">
              <div>
                <span className="block text-pink-500 uppercase font-black mb-2 text-xs">Pillar 1: Private Instruction</span>
                <p className="leading-relaxed uppercase tracking-wide">
                  World-class technical instruction tailored to your goals. Learn scales, posture, and mechanics from certified coaches.
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

      <Footer />

    </div>
  );
}
