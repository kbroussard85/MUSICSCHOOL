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
    window.location.href = '/dashboard'; // Redirect to student dashboard
  };

  return (
    <div className="min-h-screen bg-[#06040a] text-slate-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 cyber-card shadow-2xl relative bg-[#0b0813]/85">
        {/* Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center gap-3">
            <img src="/logo.jpg" alt="Next Stage Logo" className="h-16 w-auto rounded-xl border border-pink-500/20 object-contain shadow-md shadow-pink-500/10 mb-1" />
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase text-2xl font-black tracking-widest leading-none">Next Stage</span>
          </Link>
          <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1.5 leading-none">Music Academy</div>
          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider">Sign in to your learning dashboard portal</p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2.5 mb-6">
          <button 
            type="button"
            onClick={() => { document.cookie = `mock_user_email=google-user@gmail.com; path=/`; window.location.href = '/dashboard'; }}
            className="w-full py-2.5 bg-[#120e24] border border-cyan-500/20 hover:border-cyan-500/40 text-slate-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <i className="fa-brands fa-google text-pink-500"></i> Continue with Google
          </button>
          <button 
            type="button"
            onClick={() => { document.cookie = `mock_user_email=facebook-user@facebook.com; path=/`; window.location.href = '/dashboard'; }}
            className="w-full py-2.5 bg-[#120e24] border border-cyan-500/20 hover:border-cyan-500/40 text-slate-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <i className="fa-brands fa-facebook text-cyan-400"></i> Continue with Facebook
          </button>
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="h-[1px] bg-cyan-500/10 flex-1"></div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">or email credentials</span>
          <div className="h-[1px] bg-cyan-500/10 flex-1"></div>
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
