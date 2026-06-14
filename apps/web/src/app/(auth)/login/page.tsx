'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('alex@broussard.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In development mode, set a mock email cookie to simulate successful authentication
    document.cookie = `mock_user_email=${encodeURIComponent(email)}; path=/`;
    window.location.href = '/practice-room'; // Redirect to student dashboard
  };

  return (
    <div className="min-h-screen bg-[#06040a] text-slate-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 cyber-card shadow-2xl relative bg-[#0b0813]/85">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-widest text-[#f1ecff]">
            <i className="fa-solid fa-music text-pink-500 glow-pulse-pink"></i>
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase">Stage Music</span>
          </Link>
          <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1 glow-pulse-cyan leading-none">Academy</div>
          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider">Sign in to your learning dashboard portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 bg-black/40 border border-cyan-500/20 text-slate-200 placeholder-slate-700 text-xs focus:border-pink-500 focus:outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 cyber-btn-pink text-xs font-black tracking-widest shadow-lg mt-4 cursor-pointer"
          >
            Authenticate Portal
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 uppercase tracking-wider">
          <span>Don't have an account? </span>
          <Link href="/signup" className="text-cyan-400 font-bold hover:underline">Register cohort</Link>
        </div>
      </div>
    </div>
  );
}
