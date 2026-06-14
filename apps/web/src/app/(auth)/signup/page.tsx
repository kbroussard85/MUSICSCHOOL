'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [instrument, setInstrument] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('You must accept the 90-day minimum commitment contract to enroll.');
      return;
    }
    // Simulate payment checkout redirect
    window.location.href = '/practice-room';
  };

  return (
    <div className="min-h-screen bg-[#06040a] text-slate-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-lg p-8 cyber-card shadow-2xl relative bg-[#0b0813]/85">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-widest text-[#f1ecff]">
            <i className="fa-solid fa-music text-pink-500 glow-pulse-pink"></i>
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase">Stage Music</span>
          </Link>
          <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1 glow-pulse-cyan leading-none">Academy</div>
          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider">Create your student account & secure your roster spot</p>
        </div>

        {/* Contract Notice Alert */}
        <div className="mb-6 p-4 border border-pink-500/25 bg-pink-500/10 text-xs text-pink-300">
          <h4 className="font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wide">
            <i className="fa-solid fa-shield-halved"></i> Commitment contract disclosure
          </h4>
          <p className="leading-relaxed">
            All active students are enrolled in **13-week performance seasons** and agree to a mandatory **90-day minimum commitment**. Roster positions are capped at **10 students per band** to ensure professional directing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-slate-400">Full Name</label>
              <input 
                id="name" 
                type="text" 
                placeholder="Alex Broussard" 
                required
                className="w-full px-4 py-3 bg-black/40 border border-cyan-500/20 text-slate-200 placeholder-slate-700 text-xs focus:border-pink-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="instrument" className="text-xs font-black uppercase tracking-wider text-slate-400">Instrument Category</label>
              <select 
                id="instrument"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 border border-cyan-500/20 text-slate-200 text-xs focus:border-pink-500 focus:outline-none transition-all"
              >
                <option value="" disabled>Select...</option>
                <option value="piano">Piano</option>
                <option value="guitar">Guitar</option>
                <option value="violin">Violin</option>
                <option value="voice">Voice</option>
                <option value="drums">Drums</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
            <input 
              id="email" 
              type="email" 
              placeholder="alex@broussard.com" 
              required
              className="w-full px-4 py-3 bg-black/40 border border-cyan-500/20 text-slate-200 placeholder-slate-700 text-xs focus:border-pink-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pass" className="text-xs font-black uppercase tracking-wider text-slate-400">Password</label>
            <input 
              id="pass" 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 bg-black/40 border border-cyan-500/20 text-slate-200 placeholder-slate-700 text-xs focus:border-pink-500 focus:outline-none transition-all"
            />
          </div>

          {/* Checkbox agreement */}
          <div className="flex gap-3 items-start mt-2">
            <input 
              id="agreeCheck"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-pink-500 rounded"
              required
            />
            <label htmlFor="agreeCheck" className="text-xs text-slate-400 leading-normal cursor-pointer select-none">
              I agree to the **90-day minimum commitment contract** ($299/mo) and understand that late cancellations trigger director compensation buffers.
            </label>
          </div>

          <button 
            type="submit"
            disabled={!agreed}
            className={`w-full py-3 font-black text-xs uppercase tracking-widest transition-all mt-4 cursor-pointer ${
              agreed 
                ? 'cyber-btn-pink shadow-lg' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-cyan-500/5'
            }`}
          >
            Authorize Membership Checkout
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 uppercase tracking-wider">
          <span>Already registered? </span>
          <Link href="/login" className="text-cyan-400 font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
