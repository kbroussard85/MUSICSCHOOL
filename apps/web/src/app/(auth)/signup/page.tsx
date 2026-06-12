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
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-lg p-8 rounded-2xl border border-white/5 bg-[#0b0e14]/60 backdrop-blur-md shadow-2xl relative">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-widest bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fa-solid fa-music"></i>
            <span>HARMONY</span>
          </Link>
          <p className="text-xs text-slate-400 mt-2">Create your student account & secure your roster spot</p>
        </div>

        {/* Contract Notice Alert */}
        <div className="mb-6 p-4 rounded-xl border border-violet-500/25 bg-violet-500/10 text-xs text-violet-300">
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
              <label htmlFor="name" className="text-xs font-semibold text-slate-400">Full Name</label>
              <input 
                id="name" 
                type="text" 
                placeholder="Alex Broussard" 
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:border-violet-500 focus:bg-black/50 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="instrument" className="text-xs font-semibold text-slate-400">Instrument Category</label>
              <select 
                id="instrument"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-slate-200 text-sm focus:border-violet-500 focus:bg-black/50 focus:outline-none transition-all"
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
            <label htmlFor="email" className="text-xs font-semibold text-slate-400">Email Address</label>
            <input 
              id="email" 
              type="email" 
              placeholder="alex@broussard.com" 
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:border-violet-500 focus:bg-black/50 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pass" className="text-xs font-semibold text-slate-400">Password</label>
            <input 
              id="pass" 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:border-violet-500 focus:bg-black/50 focus:outline-none transition-all"
            />
          </div>

          {/* Checkbox agreement */}
          <div className="flex gap-3 items-start mt-2">
            <input 
              id="agreeCheck"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-violet-600 rounded"
              required
            />
            <label htmlFor="agreeCheck" className="text-xs text-slate-400 leading-normal cursor-pointer select-none">
              I agree to the **90-day minimum commitment contract** ($299/mo) and understand that late cancellations trigger director compensation buffers.
            </label>
          </div>

          <button 
            type="submit"
            disabled={!agreed}
            className={`w-full py-3 font-bold text-sm rounded-xl transition-all mt-4 hover:-translate-y-0.5 ${
              agreed 
                ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/10 hover:from-violet-600 hover:to-violet-700' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            Authorize Membership Checkout
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          <span>Already registered? </span>
          <Link href="/login" className="text-violet-400 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
