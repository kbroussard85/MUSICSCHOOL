'use client';

import React, { useState } from 'react';
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

export default function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: ''
  });

  const handleNavClick = () => {
    playBeep(900, 0.1, 'sine');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playBeep(1200, 0.15, 'triangle');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsContactOpen(false);
      setIsSubmitted(false);
      setForm({ name: '', email: '', topic: 'General Inquiry', message: '' });
    }, 2500);
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 border-b border-cyan-500/15 bg-[#0b0813]/85 backdrop-blur-md relative"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 8, 19, 0.4), rgba(11, 8, 19, 0.55)), url('/stage_lights.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Top studio status bar */}
        <div className="w-full bg-[#06040a]/40 border-b border-cyan-500/5 px-6 py-1 flex justify-between text-[9px] font-mono tracking-widest text-slate-500">
          <span>ACADEMY STATUS: ENROLLMENT ACTIVE</span>
          <span className="flex items-center gap-1.5">
            <span className="indicator-dot"></span>
            ACTIVE REHEARSAL STUDIOS
          </span>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="shrink-0"
              onMouseEnter={() => playBeep(1000, 0.04)}
            >
              <img src="/logo.jpg" alt="Next Stage Logo" className="h-10 w-auto rounded-lg border border-pink-500/20 object-contain shadow-md shadow-pink-500/5" />
            </Link>
            <div className="flex flex-col gap-0.5 justify-start">
              <span className="text-sm font-black tracking-widest text-[#f1ecff] uppercase leading-none">Next Stage</span>
              <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest leading-none mt-0.5">Music Academy</span>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-300">
            {/* Lessons Dropdown */}
            <div className="relative group py-1 cursor-pointer select-none">
              <span className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                Lessons <i className="fa-solid fa-chevron-down text-[8px] transition-transform duration-200 group-hover:rotate-180"></i>
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/lessons/guitar" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Guitar</Link>
                <Link href="/lessons/bass" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Bass</Link>
                <Link href="/lessons/keys" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Keys</Link>
                <Link href="/lessons/drums" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Drums</Link>
                <Link href="/lessons/vocals" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Vocals</Link>
                <Link href="/lessons/brass" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Brass</Link>
              </div>
            </div>

            {/* Pricing Dropdown */}
            <div className="relative group py-1 cursor-pointer select-none">
              <span className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                Pricing <i className="fa-solid fa-chevron-down text-[8px] transition-transform duration-200 group-hover:rotate-180"></i>
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/pricing/basic-access" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Basic Access</Link>
                <Link href="/pricing/live-band" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Live Band</Link>
                <Link href="/pricing/online-lessons" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Online Lessons</Link>
                <Link href="/pricing/performance-pro" className="block px-4 py-2 text-[10px] text-slate-800 hover:text-pink-600 hover:bg-slate-50 transition-colors normal-case font-bold">Performance Pro</Link>
              </div>
            </div>

            <button 
              onClick={() => {
                playBeep(900, 0.1, 'sine');
                setIsContactOpen(true);
              }}
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer text-left"
              onMouseEnter={() => playBeep(1100, 0.03)}
            >
              Contact
            </button>
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

      {/* Modern Contact Modal Overlay */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-8 shadow-2xl relative text-slate-800 mx-4">
            {/* Close Button */}
            <button 
              onClick={() => {
                playBeep(900, 0.08, 'sine');
                setIsContactOpen(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="font-heading text-xl font-black text-slate-900 uppercase tracking-wide mb-2">
              Contact Us
            </h3>
            <p className="text-xs text-slate-500 font-semibold mb-6">
              Send us a message and our support team will get back to you shortly.
            </p>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-xl mx-auto">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h4 className="font-heading text-base font-black text-slate-900 uppercase tracking-wide">
                  Message Sent!
                </h4>
                <p className="text-xs text-slate-500 font-semibold">
                  Thank you for reaching out. We have received your inquiry and will be in touch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500/50"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500/50"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Topic</label>
                  <select 
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500/50"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Lesson Info">Lesson Info</option>
                    <option value="Band Registration">Band Registration</option>
                    <option value="Hardware Support">Hardware Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Message</label>
                  <textarea 
                    required 
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500/50 resize-none animate-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors mt-2"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
