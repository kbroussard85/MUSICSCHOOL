'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [instrument, setInstrument] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loc = params.get('location');
    if (loc && ['Thornton', 'Westminster', 'Broomfield'].includes(loc)) {
      setSelectedLocation(loc);
      document.cookie = `selected_hub_city=${loc}; path=/`;
    } else {
      // Check if location is already set in cookies
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('selected_hub_city='))
        ?.split('=')[1];
      if (cookieValue && ['Thornton', 'Westminster', 'Broomfield'].includes(cookieValue)) {
        setSelectedLocation(cookieValue);
      } else {
        setShowLocationPopup(true);
      }
    }
  }, []);

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    document.cookie = `selected_hub_city=${loc}; path=/`;
    setShowLocationPopup(false);
  };

  const handleOAuthSignup = (email: string) => {
    document.cookie = `mock_user_email=${email}; path=/`;
    if (selectedLocation) {
      document.cookie = `selected_hub_city=${selectedLocation}; path=/`;
    } else {
      document.cookie = `selected_hub_city=Thornton; path=/`;
    }
    window.location.href = '/dashboard';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('You must accept the monthly membership terms to enroll.');
      return;
    }
    const emailInput = (document.getElementById('email') as HTMLInputElement)?.value || 'alex@broussard.com';
    const nameInput = (document.getElementById('name') as HTMLInputElement)?.value || 'Alex Broussard';
    
    document.cookie = `mock_user_email=${emailInput}; path=/`;
    document.cookie = `mock_user_name=${nameInput}; path=/`;
    if (selectedLocation) {
      document.cookie = `selected_hub_city=${selectedLocation}; path=/`;
    } else {
      document.cookie = `selected_hub_city=Thornton; path=/`;
    }
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#06040a] text-slate-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent_60%)] pointer-events-none" />

      {/* Main Signup Form Container */}
      <div className="w-full max-w-lg p-8 cyber-card shadow-2xl relative bg-[#0b0813]/85">
        {/* Logo Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center gap-3">
            <img src="/logo.jpg" alt="Next Stage Logo" className="h-16 w-auto rounded-xl border border-pink-500/20 object-contain shadow-md shadow-pink-500/10 mb-1" />
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase text-2xl font-black tracking-widest leading-none">Next Stage</span>
          </Link>
          <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1.5 leading-none">Music Academy</div>
          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider">Create your student account & secure your roster spot</p>
        </div>

        {/* Selected Location Badge */}
        {selectedLocation && (
          <div className="mb-4 py-2 px-3 bg-[#120e24] border border-cyan-500/20 text-xs flex justify-between items-center uppercase font-mono">
            <span className="text-slate-400">Selected Studio: <span className="text-pink-500 font-black">{selectedLocation} Hub</span></span>
            <button 
              onClick={() => setShowLocationPopup(true)} 
              className="text-[9px] text-cyan-400 hover:text-white underline cursor-pointer"
            >
              Change
            </button>
          </div>
        )}

        {/* OAuth Registration */}
        <div className="flex flex-col gap-2.5 mb-6">
          <button 
            type="button"
            onClick={() => handleOAuthSignup('google-user@gmail.com')}
            className="w-full py-2.5 bg-[#120e24] border border-cyan-500/20 hover:border-cyan-500/40 text-slate-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <i className="fa-brands fa-google text-pink-500"></i> Register with Google
          </button>
          <button 
            type="button"
            onClick={() => handleOAuthSignup('facebook-user@facebook.com')}
            className="w-full py-2.5 bg-[#120e24] border border-cyan-500/20 hover:border-cyan-500/40 text-slate-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <i className="fa-brands fa-facebook text-cyan-400"></i> Register with Facebook
          </button>
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="h-[1px] bg-cyan-500/10 flex-1"></div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">or register via email</span>
          <div className="h-[1px] bg-cyan-500/10 flex-1"></div>
        </div>

        {/* Contract Notice Alert */}
        <div className="mb-6 p-4 border border-pink-500/25 bg-pink-500/10 text-xs text-pink-300">
          <h4 className="font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wide">
            <i className="fa-solid fa-file-contract"></i> Enrollment Contract Disclosure
          </h4>
          <p className="leading-relaxed">
            All active students are enrolled on a **cancel anytime, no obligation** monthly basis. Roster positions are capped at strictly **10 students per band** to ensure dedicated band rehearsals and professional coaching.
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
              I agree to the **monthly membership terms** ($299/mo) and understand that I can cancel anytime, no obligation.
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
      </div>

      {/* Location Selector Popup Modal (Stitch Glassmorphic Design) */}
      {showLocationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0c0e14] border border-pink-500/35 p-6 shadow-2xl flex flex-col relative text-center">
            
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-500 flex items-center justify-center text-xl mx-auto mb-4 glow-pulse-pink">
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            
            <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">Academy Enrollment</span>
            <h3 className="text-xl font-heading font-black uppercase text-slate-200 tracking-wider mb-2">
              Select Your Studio Hub
            </h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-wide max-w-xs mx-auto mb-6">
              Please choose your primary studio location. This ensures we query local band rehearsal schedules and live showcase availability for you.
            </p>

            <div className="space-y-3">
              {['Thornton', 'Westminster', 'Broomfield'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full py-3.5 bg-[#121722]/50 border border-white/10 hover:border-violet-500 text-[#f1ecff] hover:text-white text-xs font-black uppercase tracking-widest hover:bg-[#1b2234] transition-all cursor-pointer text-center block"
                >
                  {loc} Studio Hub
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
