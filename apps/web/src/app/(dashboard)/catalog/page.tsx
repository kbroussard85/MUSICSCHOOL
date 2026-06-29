'use client';

import React, { useState, useEffect } from 'react';

interface BandDetail {
  name: string;
  ageRange: string;
  tagline: string;
  image: string;
  coach: string;
  rosterCount: string;
  rehearsals: string;
  obligation: string;
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

interface InstructorDetail {
  name: string;
  role: string;
  bio: string;
  instrument: string;
  image: string;
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
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
    setTimeout(() => {
      audioCtx.close();
    }, duration * 1000 + 100);
  } catch (e) {
    // Ignore audio context block
  }
};

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'bands' | 'courses' | 'instructors'>('bands');
  const [activeBand, setActiveBand] = useState<string>('adults');
  const [activeCourse, setActiveCourse] = useState<string>('guitar');

  const bandPrograms: Record<string, BandDetail> = {
    teens: {
      name: 'TEENS PERFORMANCE BAND',
      ageRange: 'Ages 13 - 17',
      tagline: 'High-energy weekly rehearsals focusing on rock, pop, and modern ensembles. Students build stage confidence and prepare for real ticketed showcases at local music venues.',
      image: '/band_teens.png',
      coach: 'Prof. Marcus Vane (Lead Guitar)',
      rosterCount: '8 / 10 Musicians Assigned',
      rehearsals: 'Tuesdays & Wednesdays (2 hrs/wk)',
      obligation: 'Cancel Anytime, No Obligation',
      icon: 'fa-guitar',
      colorClass: 'text-pink-500 border-pink-500/35 bg-pink-500/10'
    },
    adults: {
      name: 'ADULTS PERFORMANCE BAND',
      ageRange: 'Ages 18+',
      tagline: 'Form active bands with local players, refine ensemble dynamics, and hit the stage. Designed for adult musicians of all skill levels ready to perform in public music showcases.',
      image: '/band_adults.png',
      coach: 'Dr. Evelyn Pierce (Piano & Keys)',
      rosterCount: '7 / 10 Musicians Assigned',
      rehearsals: 'Tuesdays & Wednesdays (2 hrs/wk)',
      obligation: 'Cancel Anytime, No Obligation',
      icon: 'fa-drum',
      colorClass: 'text-cyan-400 border-cyan-500/35 bg-cyan-500/10'
    }
  };

  const syllabus: Record<string, SyllabusDetail> = {
    piano: {
      title: 'Classical Piano Foundations',
      code: 'SYS_PRGM_CF_101',
      duration: '8 Weeks (Accelerated)',
      instructor: 'Dr. Evelyn Pierce',
      level: 'BEGINNER / GATEWAY',
      modules: [
        'Keyboard Geometry: Mastering keys, scales, and core playing posture.',
        'Harmonic Progressions: Building triads, primary inversions, and chord structures.',
        'Rhythmic Independence: Sight-reading, rhythmic timing, and two-hand synchronization.',
        'Seasonal Showcase: Preparing your first classical recital piece for live performance.'
      ]
    },
    guitar: {
      title: 'Electric Riffs & Improvisation',
      code: 'SYS_PRGM_ER_204',
      duration: '10 Weeks (Ensemble)',
      instructor: 'Prof. Marcus Vane',
      level: 'INTERMEDIATE / CORE',
      modules: [
        'Fretboard Mechanics: Navigating scale patterns, blues forms, and pentatonics.',
        'Ensemble Accompaniment: Power chord structures and syncopated rhythm loops.',
        'Improvisational Expression: Solo techniques, phrasing, and vibrato control.',
        'Stage Jam: Performing classic rock and pop tunes with a full live rhythm section.'
      ]
    },
    violin: {
      title: 'Virtuoso Violin Artistry',
      code: 'SYS_PRGM_VV_309',
      duration: '12 Weeks (Masterclass)',
      instructor: 'Prof. Clara Sterling',
      level: 'ADVANCED / CLINICAL',
      modules: [
        'Auditory Tuning: High-position intonation, scale shifts, and bowing dynamics.',
        'Articulated Phrasing: Speed runs, double stops, and microtonal phrasing.',
        'Solo Expression: Classical concertos, orchestral arrangements, and stage vibrato.',
        'Recital Audition: Showcasing advanced repertoire for live auditions and reviews.'
      ]
    }
  };

  const instructors: InstructorDetail[] = [
    {
      name: 'Prof. Marcus Vane',
      role: 'Lead Guitar Instructor & Ensemble Coach',
      bio: 'Marcus has spent over 15 years touring globally with prominent alternative rock outfits and holds a Master\'s in Music Performance from the Berklee College of Music. He specializes in improvisation, guitar mechanics, and stage chemistry.',
      instrument: 'Guitars (Electric & Acoustic)',
      image: '🎸'
    },
    {
      name: 'Dr. Evelyn Pierce',
      role: 'Head of Piano Studies & Director',
      bio: 'Evelyn is an award-winning classical pianist and chamber musician. She earned her Doctorate of Musical Arts from Juilliard and directs our classical foundations, keyboard sync configurations, and performance coaching.',
      instrument: 'Piano & Keyboards',
      image: '🎹'
    },
    {
      name: 'Prof. Clara Sterling',
      role: 'Violin Instructor & Chamber Director',
      bio: 'Clara has performed with major symphonies across the country and has recorded for numerous soundtracks. She focuses on bow control, precision scale shifts, and helping students transition from solo players to orchestral ensemble contributors.',
      instrument: 'Violin & Strings',
      image: '🎻'
    },
    {
      name: 'Prof. Cooper',
      role: 'Rhythm Section Coach & Percussion Head',
      bio: 'Cooper is a session drummer and percussion director who has recorded with top pop and rock artists. He specializes in groove alignment, timekeeping, and coaching performance bands to lock into sync during rehearsals.',
      instrument: 'Drums & Percussion',
      image: '🥁'
    }
  ];

  const handleTabChange = (tab: 'bands' | 'courses' | 'instructors') => {
    setActiveTab(tab);
    playBeep(800, 0.08, 'triangle');
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-pink-500 glow-pulse-pink">Academy Resource Center</span>
        <h1 className="font-heading text-3xl md:text-5xl font-black mt-1 text-slate-100 uppercase tracking-wider">Academy Catalog</h1>
        <p className="text-sm text-slate-400 mt-2">
          Explore detailed information regarding our band configurations, syllabus programs, and certified instructors.
        </p>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-cyan-500/15 gap-4">
        {(['bands', 'courses', 'instructors'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-3 px-6 text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 ${
              activeTab === tab
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'bands' ? 'Band Programs' : tab === 'courses' ? 'Syllabi Directory' : 'Instructors'}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'bands' && (
        <div className="flex flex-col gap-8">
          {/* Interactive Parallax Background Box */}
          <div 
            className="w-full min-h-[440px] border border-cyan-500/25 bg-black/80 relative flex flex-col justify-end p-8 md:p-12 parallax-bg-section"
            style={{ 
              backgroundImage: `linear-gradient(rgba(11, 8, 20, 0.45), rgba(6, 4, 10, 0.96)), url('${bandPrograms[activeBand].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-400/40 tracking-widest uppercase">
              STUDIO // ENSEMBLE_MATRIX_0{Object.keys(bandPrograms).indexOf(activeBand) + 1}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
              
              {/* Cohort Selector */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {Object.entries(bandPrograms).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => { setActiveBand(key); playBeep(900, 0.05); }}
                    className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                      activeBand === key 
                        ? 'border-pink-500 bg-pink-500/15 text-white shadow-lg shadow-pink-500/10' 
                        : 'border-cyan-500/15 bg-black/40 text-slate-400 hover:border-cyan-500/40 hover:bg-cyan-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <i className={`fa-solid ${item.icon} text-lg ${activeBand === key ? 'text-pink-400' : 'text-slate-500'}`}></i>
                      <div>
                        <h3 className="font-heading font-black text-xs uppercase tracking-widest leading-none">{item.name}</h3>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1 block">{item.ageRange}</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-angle-right text-xs text-slate-500"></i>
                  </button>
                ))}
              </div>

              {/* Roster details */}
              <div className="lg:col-span-7 p-6 cyber-card border-pink-500/25 bg-[#0b0813]/90 backdrop-blur-md">
                <div className="flex justify-between items-start border-b border-cyan-500/10 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider glow-pulse-pink">Program Ledger</span>
                    <h3 className="font-heading text-2xl font-black text-slate-100 uppercase tracking-wider mt-0.5">{bandPrograms[activeBand].name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[9px] font-black uppercase border ${bandPrograms[activeBand].colorClass}`}>
                    {bandPrograms[activeBand].ageRange}
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 font-medium mb-6 uppercase tracking-wider leading-relaxed">
                  {bandPrograms[activeBand].tagline}
                </p>

                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-400 border-t border-cyan-500/10 pt-4">
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Coaching Director</span>
                    <strong className="text-slate-200">{bandPrograms[activeBand].coach}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Musicians Assigned</span>
                    <strong className="text-cyan-400">{bandPrograms[activeBand].rosterCount}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Live Weekly Rehearsals</span>
                    <strong className="text-pink-400">{bandPrograms[activeBand].rehearsals}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase font-black">Contract Terms</span>
                    <strong className="text-slate-200">{bandPrograms[activeBand].obligation}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Courses selection list */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {Object.entries(syllabus).map(([key, item]) => (
              <button
                key={key}
                onClick={() => { setActiveCourse(key); playBeep(700, 0.1, 'triangle'); }}
                className={`w-full py-3.5 px-6 border text-xs font-black uppercase tracking-widest transition-all text-left cursor-pointer flex items-center justify-between ${
                  activeCourse === key
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                    : 'border-cyan-500/10 bg-slate-900/40 text-slate-500 hover:border-cyan-500/25 hover:text-slate-300'
                }`}
              >
                <span>{item.title}</span>
                <span className="font-mono text-[9px] opacity-65">{item.code}</span>
              </button>
            ))}
          </div>

          {/* Syllabus detail printout */}
          <div className="lg:col-span-7">
            <div className="border border-cyan-500/35 bg-[#07050e] shadow-2xl relative">
              <div className="px-4 py-2.5 bg-black border-b border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-cyan-500/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span>
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                  <span className="ml-1.5 uppercase font-bold text-cyan-400/80">Academy_Syllabus_Ledger.db</span>
                </div>
                <span>V1.0-READY</span>
              </div>

              <div className="p-6 md:p-8 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto min-h-[340px]">
                <div className="text-emerald-500/45 mb-4 border-b border-emerald-500/10 pb-2">
                  INITIALIZING SYLLABUS DIRECTORY... [OK]
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
                    <span className="text-emerald-500/45 text-[10px] uppercase font-black block mb-1">Weekly Training Modules</span>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'instructors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {instructors.map((ins, idx) => (
            <div key={idx} className="cyber-card p-6 bg-[#0b0813]/85 border-cyan-500/15 flex gap-5 items-start">
              <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-3xl shrink-0">
                {ins.image}
              </div>
              <div className="flex flex-col gap-1.5">
                <div>
                  <h3 className="font-heading font-black text-base text-slate-100 uppercase tracking-wide leading-none">{ins.name}</h3>
                  <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block mt-1">{ins.role}</span>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wide leading-relaxed mt-2 font-medium">
                  {ins.bio}
                </p>
                <div className="text-[10px] font-mono text-cyan-400 border-t border-cyan-500/10 pt-3 mt-1 flex justify-between">
                  <span>Specialization:</span>
                  <span>{ins.instrument.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
