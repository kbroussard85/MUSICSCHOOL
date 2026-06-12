'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#f8fafc] font-sans antialiased overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0e14]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-extrabold tracking-wider bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fa-solid fa-music"></i>
            <span>HARMONY</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#seasons" className="hover:text-white transition-colors">Seasons</a>
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <Link href="/practice-room" className="hover:text-white transition-colors text-violet-400">Student Portal</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5">
              Enroll Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center relative">
        <span className="px-4 py-1.5 bg-violet-500/10 border border-violet-500/35 text-violet-400 text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
          Inspire. Learn. Perform.
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
          Where Music Comes <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">To Life</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
          This is not your standard bedroom music lesson. Join a real rock band, plug into professional backlines, and step onto the stage of live performance venues.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/25 transition-all hover:scale-105">
            Book Free Trial Lesson
          </Link>
          <a href="#seasons" className="px-8 py-4 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 text-white font-semibold rounded-2xl transition-all">
            View Program Seasons
          </a>
        </div>
      </section>

      {/* Roster & Commitment Lock Warnings */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/20 to-slate-900 border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 text-xl flex-shrink-0 border border-violet-500/20">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-base">Prerequisites & Gateways</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[500px]">
                To maintain band integrity and performance readiness, registrations carry a mandatory **90-day minimum commitment**. Roster spaces are capped at strictly **10 students per band**.
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-violet-500/15 border border-violet-500/30 text-violet-300 font-semibold text-xs rounded-full uppercase tracking-wider">
            90-Day Structural Moat
          </div>
        </div>
      </section>

      {/* Core Operational Matrix */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 text-2xl mb-6">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <h3 className="text-xl font-bold mb-4">Certified Instructors</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Learn from industry professors and touring musicians. Get 1-on-1 private attention and professional band directing.
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 text-2xl mb-6">
            <i className="fa-solid fa-sliders"></i>
          </div>
          <h3 className="text-xl font-bold mb-4">Tailored Curriculum</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Whether your focus is rock, jazz, or pop—our directed programs adjust to your goals and performance skills.
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
          <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 text-2xl mb-6">
            <i className="fa-solid fa-signal"></i>
          </div>
          <h3 className="text-xl font-bold mb-4">500-Mile Jam Moat</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Online practice rooms utilize regional edge signaling nodes to route audio under a strict sub-25ms network latency budget.
          </p>
        </div>
      </section>

      {/* 13-Week Performance Seasons */}
      <section id="seasons" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">Quarterly Cycles</span>
          <h2 className="text-4xl font-extrabold mt-4">13-Week Seasonal Calendars</h2>
          <p className="text-slate-400 mt-2">Every season culminates in a massive, ticketed live showcase at a premium physical venue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30">
            <span className="text-3xl block mb-4">🍂</span>
            <h4 className="font-bold text-lg mb-2">Fall Season</h4>
            <p className="text-xs text-slate-400">Sept 1st - Nov 30th</p>
            <span className="block mt-4 text-xs font-semibold text-pink-400 uppercase tracking-widest">Autumn Showcase</span>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30">
            <span className="text-3xl block mb-4">❄️</span>
            <h4 className="font-bold text-lg mb-2">Winter Season</h4>
            <p className="text-xs text-slate-400">Dec 1st - Feb 28th</p>
            <span className="block mt-4 text-xs font-semibold text-pink-400 uppercase tracking-widest">Mid-Winter Festival</span>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30">
            <span className="text-3xl block mb-4">🌱</span>
            <h4 className="font-bold text-lg mb-2">Spring Season</h4>
            <p className="text-xs text-slate-400">Mar 1st - May 31st</p>
            <span className="block mt-4 text-xs font-semibold text-pink-400 uppercase tracking-widest">Spring Meltdown</span>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30">
            <span className="text-3xl block mb-4">☀️</span>
            <h4 className="font-bold text-lg mb-2">Summer Season</h4>
            <p className="text-xs text-slate-400">June 1st - Aug 31st</p>
            <span className="block mt-4 text-xs font-semibold text-pink-400 uppercase tracking-widest">Summer Stage Finale</span>
          </div>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section id="courses" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">Masterclass Offerings</span>
          <h2 className="text-4xl font-extrabold mt-4">Professional Curriculums</h2>
          <p className="text-slate-400 mt-2">Tailored programs designed to get you stage-ready rapidly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-0.5 border border-cyan-400/20 text-cyan-400 bg-cyan-400/10 text-[10px] font-semibold uppercase tracking-widest rounded">Beginner</div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">Piano</span>
            <h3 className="font-bold text-xl mb-4">Classical Piano Foundations</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Master basic music theory, scales, sight-reading, and your first classical keyboard compositions.
            </p>
            <span className="text-xs text-slate-400"><i className="fa-solid fa-clock mr-1 text-violet-400"></i> 8 Weeks</span>
          </div>

          <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-0.5 border border-cyan-400/20 text-cyan-400 bg-cyan-400/10 text-[10px] font-semibold uppercase tracking-widest rounded">Intermediate</div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">Guitar</span>
            <h3 className="font-bold text-xl mb-4">Electric Riffs & Improvisation</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Unlock fretboard navigation, blues scales, lead solos, and dynamic rhythmic accompaniment.
            </p>
            <span className="text-xs text-slate-400"><i className="fa-solid fa-clock mr-1 text-violet-400"></i> 10 Weeks</span>
          </div>

          <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-0.5 border border-cyan-400/20 text-cyan-400 bg-cyan-400/10 text-[10px] font-semibold uppercase tracking-widest rounded">Advanced</div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">Violin</span>
            <h3 className="font-bold text-xl mb-4">Virtuoso Violin Artistry</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Focus on complex bowings, high positions, vibrato control, and sophisticated orchestral pieces.
            </p>
            <span className="text-xs text-slate-400"><i className="fa-solid fa-clock mr-1 text-violet-400"></i> 12 Weeks</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-extrabold tracking-widest bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fa-solid fa-music"></i>
            <span>HARMONY</span>
          </div>
          <p>&copy; 2026 Harmony Music School. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
