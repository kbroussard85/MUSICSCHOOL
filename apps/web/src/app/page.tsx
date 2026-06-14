'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CohortDetail {
  name: string;
  ageRange: string;
  tagline: string;
  image: string;
  coach: string;
  roster: string;
  latency: string;
  commitment: string;
  icon: string;
  colorClass: string;
}

interface SyllabusDetail {
  title: string;
  code: string;
  duration: string;
  instructor: string;
  level: string;
  modules: string[];
}

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
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); // Low volume so it's pleasant
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
  // 1. Dynamic Cohort Selector State
  const [activeCohort, setActiveCohort] = useState<string>('adults');
  
  const cohorts: Record<string, CohortDetail> = {
    rockers: {
      name: 'NEON ROCKERS',
      ageRange: 'Ages 7 - 10',
      tagline: 'Neon rock starters plugging into their first stage rehearsal.',
      image: '/band_rockers.png',
      coach: 'Prof. Cooper (Rhythm Sec)',
      roster: '6 / 10 Active',
      latency: '21.4 ms (Est)',
      commitment: '90-Day Structural Moat',
      icon: 'fa-child-reaching',
      colorClass: 'text-pink-500 border-pink-500/35 bg-pink-500/10'
    },
    teens: {
      name: 'HIGH VOLTAGE TEENS',
      ageRange: 'Ages 11 - 14',
      tagline: 'High voltage riffs and garage band fundamentals.',
      image: '/band_teens.png',
      coach: 'Prof. Chen (Lead Guitar)',
      roster: '8 / 10 Active',
      latency: '18.1 ms (Est)',
      commitment: '90-Day Structural Moat',
      icon: 'fa-guitar',
      colorClass: 'text-purple-400 border-purple-500/35 bg-purple-500/10'
    },
    juniors: {
      name: 'CYBER JUNIORS',
      ageRange: 'Ages 15 - 18',
      tagline: 'Advanced rehearsal blocks preparing for live festival debuts.',
      image: '/band_juniors.png',
      coach: 'Prof. Harrison (Percussion)',
      roster: '9 / 10 Active',
      latency: '20.2 ms (Est)',
      commitment: '90-Day Structural Moat',
      icon: 'fa-drum',
      colorClass: 'text-cyan-400 border-cyan-500/35 bg-cyan-500/10'
    },
    adults: {
      name: 'BACKLINE ADULTS',
      ageRange: 'Ages 18+',
      tagline: 'Classic backline giants re-entering the live music circuit.',
      image: '/band_adults.png',
      coach: 'Prof. Miller (Synthesizers)',
      roster: '7 / 10 Active',
      latency: '22.6 ms (Est)',
      commitment: '90-Day Structural Moat',
      icon: 'fa-plug',
      colorClass: 'text-yellow-400 border-yellow-500/35 bg-yellow-500/10'
    }
  };

  // 2. Interactive Terminal Syllabus State
  const [activeCourse, setActiveCourse] = useState<string>('guitar');
  const syllabus: Record<string, SyllabusDetail> = {
    piano: {
      title: 'Classical Piano Foundations',
      code: 'SYS_PRGM_CF_101',
      duration: '8 Weeks (Accelerated)',
      instructor: 'Dr. Evelyn Pierce',
      level: 'BEGINNER / GATEWAY',
      modules: [
        'Initialize: Keyboard geometry, scales and proper core posture.',
        'Sequence: Triads, primary inversions and basic music theory.',
        'Articulate: Sight-reading, rhythm cadences and finger independence.',
        'Compile: Mid-term classical repertoire recital showcase.'
      ]
    },
    guitar: {
      title: 'Electric Riffs & Improvisation',
      code: 'SYS_PRGM_ER_204',
      duration: '10 Weeks (Ensemble)',
      instructor: 'Prof. Marcus Vane',
      level: 'INTERMEDIATE / CORE',
      modules: [
        'Initialize: Fretboard navigation, blues scales and pentatonics.',
        'Sequence: Power chord progressions and syncopated rhythm loops.',
        'Articulate: Lead solo expressions, vibrato and hammer-on techniques.',
        'Compile: Live rock ensemble jamming under edge signaling.'
      ]
    },
    violin: {
      title: 'Virtuoso Violin Artistry',
      code: 'SYS_PRGM_VV_309',
      duration: '12 Weeks (Masterclass)',
      instructor: 'Prof. Clara Sterling',
      level: 'ADVANCED / CLINICAL',
      modules: [
        'Initialize: High position intonation tuning and microtonal bowing.',
        'Sequence: Complex bowing articulations and cross-string speed runs.',
        'Articulate: Double stop harmonics, shifts and performance vibrato.',
        'Compile: Regional orchestral masterclass clinic and live recording.'
      ]
    }
  };

  // 3. Live Telemetry State
  const [pings, setPings] = useState({
    denver: 18.4,
    westminster: 12.1,
    boulder: 15.2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPings(prev => ({
        denver: +(prev.denver + (Math.random() - 0.5) * 0.6).toFixed(1),
        westminster: +(prev.westminster + (Math.random() - 0.5) * 0.4).toFixed(1),
        boulder: +(prev.boulder + (Math.random() - 0.5) * 0.5).toFixed(1),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // 4. Band Roster Scanner Modal State
  const [scannedBand, setScannedBand] = useState<string | null>(null);
  
  const bandRosters: Record<string, { name: string; coach: string; members: { name: string; role: string; age: number }[] }> = {
    cyberpunks: {
      name: 'THE CYBER PUNKS',
      coach: 'Prof. Marcus Vane',
      members: [
        { name: 'Leo Alvarez', role: 'Lead Guitar', age: 16 },
        { name: 'Maya Sterling', role: 'Drums', age: 15 },
        { name: 'Noah Vance', role: 'Synthesizers', age: 17 }
      ]
    },
    siliconsynths: {
      name: 'SILICON VALLEY SYNTHS',
      coach: 'Dr. Evelyn Pierce',
      members: [
        { name: 'Kenzo Hayashi', role: 'Keyboards', age: 22 },
        { name: 'Elena Rostova', role: 'Lead Vocals', age: 24 },
        { name: 'Chris O\'Connor', role: 'Bass Guitar', age: 21 }
      ]
    },
    binarybeats: {
      name: 'BINARY BEATS',
      coach: 'Prof. Cooper',
      members: [
        { name: 'Sophia Lin', role: 'Violin / Synth', age: 11 },
        { name: 'Lucas Brooks', role: 'Rhythm Guitar', age: 12 },
        { name: 'Zoe Henderson', role: 'Percussion', age: 10 }
      ]
    }
  };

  const handleCohortHover = (key: string) => {
    if (activeCohort !== key) {
      setActiveCohort(key);
      playBeep(900, 0.05);
    }
  };

  const handleCourseClick = (key: string) => {
    setActiveCourse(key);
    playBeep(700, 0.1, 'triangle');
  };

  const openScannerModal = (key: string) => {
    setScannedBand(key);
    playBeep(600, 0.15, 'sawtooth');
  };

  const closeScannerModal = () => {
    setScannedBand(null);
    playBeep(500, 0.1);
  };

  return (
    <div className="min-h-screen text-[#f1ecff] font-sans antialiased overflow-x-hidden relative">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/15 bg-[#0b0813]/90 backdrop-blur-md">
        {/* Top telemetry status line */}
        <div className="w-full bg-[#06040a] border-b border-cyan-500/5 px-6 py-1 flex justify-between text-[9px] font-mono tracking-widest text-slate-500">
          <span>SECURE NETWORK ENCRYPTION: ACTIVE</span>
          <span className="flex items-center gap-1.5">
            <span className="indicator-dot"></span>
            LATENCY MONITOR: ON-GRID
          </span>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5 justify-start">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 text-xl font-black tracking-widest text-[#f1ecff]"
              onMouseEnter={() => playBeep(1000, 0.04)}
            >
              <i className="fa-solid fa-music text-pink-500 glow-pulse-pink"></i>
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">Stage Music</span>
            </Link>
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest leading-none glow-pulse-cyan">Academy</span>
          </div>

          <nav className="hidden md:flex gap-8 text-xs font-black uppercase tracking-widest text-slate-300">
            <a 
              href="#cohorts" 
              className="hover:text-cyan-400 transition-colors py-1 hover:border-b hover:border-cyan-500"
              onMouseEnter={() => playBeep(1100, 0.03)}
            >
              Squad Levels
            </a>
            <a 
              href="#syllabus" 
              className="hover:text-cyan-400 transition-colors py-1 hover:border-b hover:border-cyan-500"
              onMouseEnter={() => playBeep(1100, 0.03)}
            >
              Terminal Syllabus
            </a>
            <a 
              href="#live-status" 
              className="hover:text-cyan-400 transition-colors py-1 hover:border-b hover:border-cyan-500"
              onMouseEnter={() => playBeep(1100, 0.03)}
            >
              Node Telemetry
            </a>
            <Link 
              href="/practice-room" 
              className="hover:text-pink-500 text-pink-400 transition-colors py-1 hover:border-b hover:border-pink-500"
              onMouseEnter={() => playBeep(1100, 0.03)}
            >
              Student Portal
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-black uppercase tracking-widest hover:text-cyan-400 transition-colors"
              onMouseEnter={() => playBeep(1200, 0.03)}
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 cyber-btn-pink text-xs font-black"
              onMouseEnter={() => playBeep(1200, 0.04)}
              onClick={() => playBeep(900, 0.1, 'sawtooth')}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        <span className="px-4 py-1.5 bg-pink-500/10 border border-pink-500/35 text-pink-400 text-[10px] font-black uppercase tracking-widest mb-6 glow-pulse-pink">
          PLUG IN • TURN UP • STAND OUT
        </span>
        <h1 className="text-5xl md:text-8xl font-heading font-black tracking-tighter max-w-5xl leading-none mb-8 uppercase">
          WHERE MUSIC MEETS <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-pulse-cyan">
            THE FUTURE
          </span>
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed mb-12 uppercase tracking-wide font-medium">
          Not your standard bedroom music lesson. Join a real rock band, plug into high-end professional backlines, and step onto the stage of live performance venues. Secured by edge-latency networks.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <Link 
            href="/signup" 
            className="px-8 py-4 cyber-btn-pink text-xs font-black tracking-widest"
            onMouseEnter={() => playBeep(1000, 0.04)}
            onClick={() => playBeep(850, 0.12, 'square')}
          >
            Book Free Trial Lesson
          </Link>
          <a 
            href="#cohorts" 
            className="px-8 py-4 cyber-btn-cyan text-xs font-black tracking-widest"
            onMouseEnter={() => playBeep(1000, 0.04)}
            onClick={() => playBeep(850, 0.12, 'square')}
          >
            Explore Squads
          </a>
        </div>
      </section>

      {/* Moat & SLA Grid Panel */}
      <section className="max-w-5xl mx-auto px-6 py-4">
        <div className="cyber-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-cyan-500/20 bg-[#0b0813]/80">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 text-xl flex-shrink-0">
              <i className="fa-solid fa-shield-halved glow-pulse-pink"></i>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm uppercase tracking-widest text-slate-200">Prerequisites & Gateways</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[520px] leading-relaxed uppercase tracking-wider">
                To maintain band integrity and performance readiness, registrations carry a mandatory <strong className="text-pink-400">90-day minimum commitment</strong>. Roster spaces are capped at strictly <strong className="text-cyan-400">10 students per band</strong>.
              </p>
            </div>
          </div>
          <div className="px-4 py-2 cyber-badge-pink text-[10px] font-black uppercase tracking-wider">
            90-Day Structural Moat
          </div>
        </div>
      </section>

      {/* Dynamic Parallax Cohort Selector Section */}
      <section id="cohorts" className="py-24 border-t border-cyan-500/15 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 cyber-badge-cyan px-3 py-1">
              Band Cohort Sub-Systems
            </span>
            <h2 className="text-4xl font-heading font-black uppercase tracking-wider mt-4">
              Select Your Squad Level
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">
              Hover over the cohorts to engage different localized band soundscapes.
            </p>
          </div>

          {/* Interactive Parallax Background Box */}
          <div 
            className="w-full min-h-[480px] border border-cyan-500/25 bg-black/80 relative flex flex-col justify-end p-8 md:p-12 parallax-bg-section"
            style={{ 
              backgroundImage: `linear-gradient(rgba(11, 8, 20, 0.45), rgba(6, 4, 10, 0.96)), url('${cohorts[activeCohort].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Corner styling lines for high-tech grid look */}
            <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-400/40 tracking-widest uppercase">
              GRID // COHORT_SCANNER_0{Object.keys(cohorts).indexOf(activeCohort) + 1}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
              
              {/* Cohort Buttons */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {Object.entries(cohorts).map(([key, item]) => (
                  <button
                    key={key}
                    onMouseEnter={() => handleCohortHover(key)}
                    className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                      activeCohort === key 
                        ? 'border-pink-500 bg-pink-500/15 text-white shadow-lg shadow-pink-500/10' 
                        : 'border-cyan-500/15 bg-black/40 text-slate-400 hover:border-cyan-500/40 hover:bg-cyan-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <i className={`fa-solid ${item.icon} text-lg ${activeCohort === key ? 'text-pink-400' : 'text-slate-500'}`}></i>
                      <div>
                        <h3 className="font-heading font-black text-xs uppercase tracking-widest leading-none">{item.name}</h3>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1 block">{item.ageRange}</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-angle-right text-xs text-slate-500"></i>
                  </button>
                ))}
              </div>

              {/* Roster Scanner details */}
              <div className="lg:col-span-7 p-6 cyber-card border-pink-500/25 bg-[#0b0813]/90 backdrop-blur-md">
                <div className="flex justify-between items-start border-b border-cyan-500/10 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider glow-pulse-pink">Telemetry Spec</span>
                    <h3 className="font-heading text-2xl font-black text-slate-100 uppercase tracking-wider mt-0.5">{cohorts[activeCohort].name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[9px] font-black uppercase border ${cohorts[activeCohort].colorClass}`}>
                    {cohorts[activeCohort].ageRange}
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 font-medium mb-6 uppercase tracking-wider leading-relaxed">
                  {cohorts[activeCohort].tagline}
                </p>

                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-400 border-t border-cyan-500/10 pt-4">
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Coaching Director</span>
                    <strong className="text-slate-200">{cohorts[activeCohort].coach}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Roster Capacity</span>
                    <strong className="text-cyan-400">{cohorts[activeCohort].roster}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Ping Latency</span>
                    <strong className="text-pink-400">{cohorts[activeCohort].latency}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Commitment Guarantee</span>
                    <strong className="text-slate-200">{cohorts[activeCohort].commitment}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Interactive Terminal Syllabus Section */}
      <section id="syllabus" className="py-24 border-t border-cyan-500/15 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text description */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 cyber-badge-pink w-fit px-3 py-1">
                Syllabus Database
              </span>
              <h2 className="text-4xl font-heading font-black uppercase tracking-wider">
                Interactive Program Curriculums
              </h2>
              <p className="text-slate-400 text-xs uppercase tracking-widest leading-relaxed">
                Click on the core instruments to load syllabus specifications from our localized database console.
              </p>
              
              <div className="flex flex-col gap-2 mt-4">
                {Object.entries(syllabus).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => handleCourseClick(key)}
                    className={`w-full py-3.5 px-6 border text-xs font-black uppercase tracking-widest transition-all text-left cursor-pointer flex items-center justify-between ${
                      activeCourse === key
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                        : 'border-white/5 bg-slate-900/40 text-slate-500 hover:border-cyan-500/20 hover:text-slate-300'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className="font-mono text-[9px] opacity-65">{item.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CRT Terminal Screen */}
            <div className="lg:col-span-7">
              <div className="border border-cyan-500/35 bg-[#07050e] shadow-2xl relative">
                
                {/* Terminal Header */}
                <div className="px-4 py-2.5 bg-black border-b border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-cyan-500/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span>
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                    <span className="ml-1.5 uppercase font-bold text-cyan-400/80">Syllabus-Telemetry-Terminal.sh</span>
                  </div>
                  <span>V1.04-SECURE</span>
                </div>

                {/* CRT Terminal Screen Content */}
                <div className="p-6 md:p-8 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto min-h-[340px]">
                  <div className="text-emerald-500/45 mb-4 border-b border-emerald-500/10 pb-2">
                    SYS_CMD: load -p {activeCourse.toUpperCase()} --full-spec
                    <br />
                    LOADING RESOURCE SCHEMA DIRECTIVES... [OK]
                  </div>

                  <div className="flex flex-col gap-4 text-emerald-400">
                    <div>
                      <span className="text-emerald-500/45 text-[10px] uppercase font-black block">Course Title</span>
                      <strong className="text-slate-200 text-sm uppercase font-bold">{syllabus[activeCourse].title}</strong>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-y border-emerald-500/10 py-3 my-2 text-[10px]">
                      <div>
                        <span className="text-emerald-500/45 block uppercase font-bold">Class Code</span>
                        <span className="text-slate-300">{syllabus[activeCourse].code}</span>
                      </div>
                      <div>
                        <span className="text-emerald-500/45 block uppercase font-bold">Duration</span>
                        <span className="text-slate-300">{syllabus[activeCourse].duration}</span>
                      </div>
                      <div>
                        <span className="text-emerald-500/45 block uppercase font-bold">Instructor</span>
                        <span className="text-slate-300">{syllabus[activeCourse].instructor}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-emerald-500/45 text-[10px] uppercase font-black block mb-1">Weekly Syllabus Matrix</span>
                      <ul className="flex flex-col gap-2">
                        {syllabus[activeCourse].modules.map((mod, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <span className="text-emerald-500/45">[{idx + 1}]</span>
                            <span className="text-emerald-300">{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-emerald-500/60 flex items-center gap-1">
                    <span>STAGE_ACADEMY_CONSOLE:~ $ </span>
                    <span className="w-1.5 h-3 bg-emerald-400 terminal-cursor inline-block"></span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Network Telemetry & Live Map Section */}
      <section id="live-status" className="py-24 border-t border-cyan-500/15 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 cyber-badge-pink px-3 py-1">
              Active Server Hub Status
            </span>
            <h2 className="text-4xl font-heading font-black uppercase tracking-wider mt-4">
              Edge Signaling Telemetry
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">
              Real-time regional jam matrix tracking regional pings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Denver North Hub */}
            <div className="cyber-card p-6 bg-[#0b0813]/80 border-cyan-500/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Denver North Hub</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                  ONLINE
                </span>
              </div>
              <div className="flex flex-col gap-1 my-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Signal Latency</span>
                <div className="text-3xl font-heading font-black text-slate-100 flex items-baseline gap-1.5">
                  {pings.denver} <span className="text-xs text-slate-500 font-mono">ms</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono border-t border-cyan-500/10 pt-4 flex items-center justify-between">
                <span>PORT: 8081</span>
                <span>REGIONAL CORE</span>
              </div>
            </div>

            {/* Westminster Core */}
            <div className="cyber-card p-6 bg-[#0b0813]/80 border-cyan-500/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Westminster Core</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                  ONLINE
                </span>
              </div>
              <div className="flex flex-col gap-1 my-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Signal Latency</span>
                <div className="text-3xl font-heading font-black text-cyan-400 glow-pulse-cyan flex items-baseline gap-1.5">
                  {pings.westminster} <span className="text-xs text-slate-500 font-mono">ms</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono border-t border-cyan-500/10 pt-4 flex items-center justify-between">
                <span>PORT: 8082</span>
                <span>GATEWAY SYNC</span>
              </div>
            </div>

            {/* Boulder Gateway */}
            <div className="cyber-card p-6 bg-[#0b0813]/80 border-cyan-500/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Boulder Gateway</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                  ONLINE
                </span>
              </div>
              <div className="flex flex-col gap-1 my-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Signal Latency</span>
                <div className="text-3xl font-heading font-black text-slate-100 flex items-baseline gap-1.5">
                  {pings.boulder} <span className="text-xs text-slate-500 font-mono">ms</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono border-t border-cyan-500/10 pt-4 flex items-center justify-between">
                <span>PORT: 8083</span>
                <span>EDGE HYBRID</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-xs text-slate-500 uppercase tracking-widest font-bold">
            <span className="indicator-dot mr-2"></span>
            ALL NODES ROUTING UNDER STRICT SUB-25MS JAM PLATFORM BUDGET
          </div>
        </div>
      </section>

      {/* Active Bands Scanner Section */}
      <section className="py-24 border-t border-cyan-500/15 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 cyber-badge-cyan px-3 py-1">
              Student Rosters
            </span>
            <h2 className="text-4xl font-heading font-black uppercase tracking-wider mt-4">
              Active Student Bands
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">
              Select a band to initialize telemetry scans of active student profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(bandRosters).map((key) => (
              <div key={key} className="cyber-card p-6 bg-[#0b0813]/85 relative">
                <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider block mb-1">
                  Active Cohort Roster
                </span>
                <h3 className="font-heading text-lg font-black text-[#f1ecff] uppercase tracking-wide">
                  {bandRosters[key].name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 mb-6 font-mono">
                  Coach: {bandRosters[key].coach}
                </p>
                <button
                  onClick={() => openScannerModal(key)}
                  className="w-full py-2.5 cyber-btn-cyan text-xs font-black uppercase tracking-widest cursor-pointer"
                  onMouseEnter={() => playBeep(1100, 0.03)}
                >
                  Scan Band Members
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/15 bg-[#06040a] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 uppercase tracking-widest">
          <div className="flex flex-col gap-0.5 justify-start">
            <div className="flex items-center gap-2.5 text-lg font-black tracking-widest text-[#f1ecff]">
              <i className="fa-solid fa-music text-pink-500"></i>
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Stage Music</span>
            </div>
            <span className="text-[9px] font-black text-cyan-400 tracking-widest leading-none">Academy</span>
          </div>
          <p>&copy; 2026 Stage Music Academy. All rights reserved.</p>
          <div className="flex gap-6 font-bold">
            <a href="#" className="hover:text-cyan-400 transition-colors" onMouseEnter={() => playBeep(1200, 0.02)}>Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors" onMouseEnter={() => playBeep(1200, 0.02)}>Privacy</a>
          </div>
        </div>
      </footer>

      {/* Scanner Modal Popup */}
      {scannedBand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-lg p-8 border border-pink-500 bg-[#0b0813] shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
            
            <div className="flex justify-between items-start border-b border-cyan-500/10 pb-4 mb-6">
              <div>
                <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest glow-pulse-pink">Telemetry Scanner</span>
                <h3 className="font-heading text-2xl font-black text-[#f1ecff] mt-0.5 uppercase tracking-wide">
                  {bandRosters[scannedBand].name}
                </h3>
              </div>
              <button 
                onClick={closeScannerModal}
                className="py-1.5 px-4 border border-cyan-500/30 hover:bg-cyan-500/15 text-cyan-400 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Terminate Scan
              </button>
            </div>
            
            <div className="mb-6 font-mono text-[10px] text-cyan-400">
              SCANNING COHORT DIRECTIVES... DONE
              <br />
              COACH LINK: {bandRosters[scannedBand].coach.toUpperCase()}
            </div>

            <table className="w-full text-left text-xs border border-cyan-500/10">
              <thead>
                <tr className="bg-cyan-500/5 text-slate-400 border-b border-cyan-500/15 text-[10px] font-mono tracking-widest uppercase">
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Instrument Role</th>
                  <th className="p-3">Age</th>
                </tr>
              </thead>
              <tbody>
                {bandRosters[scannedBand].members.map((member, idx) => (
                  <tr key={idx} className="border-b border-cyan-500/10 text-slate-200">
                    <td className="p-3 font-semibold uppercase">{member.name}</td>
                    <td className="p-3 text-cyan-400 font-semibold">{member.role}</td>
                    <td className="p-3 text-slate-400 font-mono">{member.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
