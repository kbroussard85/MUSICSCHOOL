'use client';

import React, { useState } from 'react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  instrument: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface AccountPageClientProps {
  initialData: StudentData;
}

export default function AccountPageClient({ initialData }: AccountPageClientProps) {
  const [name, setName] = useState(initialData.name);
  const [instrument, setInstrument] = useState(initialData.instrument);
  const [phone, setPhone] = useState(initialData.phone);
  
  // Address State
  const [address, setAddress] = useState(initialData.address);
  const [city, setCity] = useState(initialData.city);
  const [stateCode, setStateCode] = useState(initialData.state);
  const [zipCode, setZipCode] = useState(initialData.zip);

  // Billing card state (mock)
  const [cardNum, setCardNum] = useState('4111 2222 3333 4242');
  const [cardExp, setCardExp] = useState('12/28');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/student/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          instrument,
          phone,
          address,
          city,
          state: stateCode,
          zip: zipCode
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        } else {
          alert('Update failed: ' + result.error);
        }
      } else {
        alert('Server returned an error.');
      }
    } catch (err) {
      console.error('Error saving account settings:', err);
      alert('Network error while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setResetMessage(`A password reset link has been dispatched to ${initialData.email}. Please check your inbox.`);
    setTimeout(() => setResetMessage(''), 8000);
  };

  const instruments = ['Guitar', 'Bass', 'Keyboard', 'Drums', 'Vocals'];

  return (
    <div className="space-y-8 font-sans pb-10 max-w-3xl">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block mb-1">Configuration</span>
        <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
          Account Settings
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
          Manage your instrument profiles, contact numbers, address, and billing logs
        </p>
      </div>

      {/* Success Notification banner */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i>
          <span>Account credentials updated successfully.</span>
        </div>
      )}

      {/* Reset password notification */}
      {resetMessage && (
        <div className="p-4 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-2">
          <i className="fa-solid fa-envelope"></i>
          <span>{resetMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Personal Details */}
        <div className="stitch-card p-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-200 border-b border-white/5 pb-2 mb-2">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email (Read Only) */}
            <div>
              <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Email Address (Auth ID)</label>
              <input 
                type="text" 
                readOnly
                value={initialData.email}
                className="w-full bg-slate-900/50 border border-white/5 px-3 py-2.5 text-xs text-slate-500 font-mono focus:outline-none"
              />
            </div>

            {/* Username / Full Name */}
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Username / Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>

            {/* Instrument Selection */}
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Primary Instrument</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              >
                {instruments.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Contact Phone Number</label>
              <input 
                type="text" 
                required
                placeholder="(555) 555-5555"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="stitch-card p-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-200 border-b border-white/5 pb-2 mb-2">
            Billing & Mailing Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Street Address</label>
              <input 
                type="text" 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">City</label>
              <input 
                type="text" 
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">State</label>
                <input 
                  type="text" 
                  required
                  maxLength={2}
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">ZIP</label>
                <input 
                  type="text" 
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Credentials */}
        <div className="stitch-card p-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-200 border-b border-white/5 pb-2 mb-2">
            Active Payment Method
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Credit Card Number</label>
              <input 
                type="text" 
                value={cardNum}
                onChange={(e) => setCardNum(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Expiration Date</label>
              <input 
                type="text" 
                value={cardExp}
                onChange={(e) => setCardExp(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-4">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full sm:w-auto py-3 px-6 bg-slate-900 border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-colors"
          >
            Reset User Password
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto py-3 px-8 stitch-btn-violet text-xs font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>
        </div>

      </form>

    </div>
  );
}
