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
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/5 bg-[#0b0e14]/60 backdrop-blur-md shadow-2xl relative">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-widest bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fa-solid fa-music"></i>
            <span>HARMONY</span>
          </Link>
          <p className="text-xs text-slate-400 mt-2">Sign in to your learning dashboard portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-400">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:border-violet-500 focus:bg-black/50 focus:outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-500/10 transition-all mt-4 hover:-translate-y-0.5"
          >
            Authenticate Portal
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          <span>Don't have an account? </span>
          <Link href="/signup" className="text-violet-400 font-semibold hover:underline">Register cohort</Link>
        </div>
      </div>
    </div>
  );
}
