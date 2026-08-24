'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Define pricing tier detailed descriptions
const pricingTierData: Record<string, {
  name: string;
  price: string;
  period: string;
  note?: string;
  tagline: string;
  extendedDescription: string;
  benefits: string[];
  specs: { label: string; value: string }[];
}> = {
  'basic-access': {
    name: 'Basic Access',
    price: '$99',
    period: '/ month',
    tagline: 'Entry level vault access for dedicated self-directed practice.',
    extendedDescription: 'The Basic Access membership is designed for self-directed musicians who want to learn at their own pace. This plan provides unlimited, 24/7 access to our comprehensive virtual database of training videos, drum tracks, scales, chord dictionaries, and masterclass logs. Ideal for backing up physical lessons or building foundational skills from home.',
    benefits: [
      'Access to all video lesson materials in the vault',
      'Downloadable sheet music libraries & instrument tab sheets',
      'Comprehensive scale, chord charts, and play-along files',
      'Standard digital student forum access for feedback',
      'Flexible cancel-anytime policy with no minimum contracts'
    ],
    specs: [
      { label: 'Rehearsals Included', value: 'None (Digital Only)' },
      { label: '1-on-1 Lessons', value: 'None' },
      { label: 'Vault Access', value: 'Full Library (24/7)' },
      { label: 'Live Showcases', value: 'Audience Entry Only' },
      { label: 'Contract Commitment', value: 'Month-to-month' }
    ]
  },
  'online-lessons': {
    name: 'Online Lessons',
    price: '$199',
    period: '/ month',
    tagline: 'Professional 1-on-1 coaching brought directly to your home.',
    extendedDescription: 'Perfect for remote learners or students with busy schedules. We match you with a certified instructor for weekly 1-on-1 private video lessons. Your teacher designs a customized curriculum tailored to your personal goals, holds weekly reviews, and updates your student dashboard with practice tasks. Includes full vault access.',
    benefits: [
      'Weekly 45-minute 1-on-1 private video lessons with certified coach',
      'Customized digital dashboard tracking goals and milestones',
      'Full 24/7 access to all video lessons and tabs in the vault',
      'Monthly recorded video reviews and scale feedback evaluations',
      'Flexible rescheduling options through our calendar app'
    ],
    specs: [
      { label: 'Rehearsals Included', value: 'None (Remote Only)' },
      { label: '1-on-1 Lessons', value: '1 / Week (45 mins)' },
      { label: 'Vault Access', value: 'Full Library (24/7)' },
      { label: 'Live Showcases', value: 'Audience Entry Only' },
      { label: 'Contract Commitment', value: 'Month-to-month' }
    ]
  },
  'live-band': {
    name: 'Live Band',
    price: '$299',
    period: '/ month',
    tagline: 'Our flagship group experience. Step out of the bedroom and onto the stage.',
    extendedDescription: 'We believe that playing music with other people is the single most powerful accelerator for learning. Under this tier, we place you in a local rehearsal band cohort matching your age and skill level. Rehearse weekly with a dedicated band coach, learn real setlists, and perform at least 2 ticketed live venue showcases per season under real stage spotlights.',
    benefits: [
      'Weekly 90-minute coached rehearsals at local music hubs',
      'Bi-monthly 1-on-1 private online check-in coaching lessons',
      'Access to paywalled live and recorded masterclass clinics',
      'Guaranteed 2 live venue showcase performances per season',
      'Full 24/7 access to all video training and tabs in the vault'
    ],
    specs: [
      { label: 'Rehearsals Included', value: '1 / Week (90 mins)' },
      { label: '1-on-1 Lessons', value: '2 / Month (Online)' },
      { label: 'Vault Access', value: 'Full Library (24/7)' },
      { label: 'Live Showcases', value: '2 / Season (Ticketed)' },
      { label: 'Contract Commitment', value: '90-day minimum lock' }
    ]
  },
  'performance-pro': {
    name: 'Performance Pro',
    price: '$349',
    period: '/ month',
    note: '+ $448 one-time Lutefish hardware fee',
    tagline: 'The ultimate package for advanced players and real-time remote jamming.',
    extendedDescription: 'Get the full Live Band package supercharged with premium hardware and membership in our elite Allstar touring group. Includes a high-end Lutefish zero-latency hardware box for remote real-time jams with other students. Members of this tier enter our Allstar Program, which performs 4 live showcases per season (instead of 2) and gets access to VIP showcases and festivals.',
    benefits: [
      'All features included in the Live Band tier',
      'High-end Lutefish zero-latency hardware box for home setup',
      'Paid Lutefish subscription for real-time remote jam sessions',
      'Allstar Program entry (performs 4 shows per season instead of 2)',
      'Special showcases, VIP event bookings, and local festival gigs',
      'Priority registration for studio space rentals'
    ],
    specs: [
      { label: 'Rehearsals Included', value: '1 / Week (90 mins) + Remote Jams' },
      { label: '1-on-1 Lessons', value: '2 / Month (Online)' },
      { label: 'Vault Access', value: 'Full Library (24/7)' },
      { label: 'Live Showcases', value: '4 / Season (Allstar Tour)' },
      { label: 'Included Hardware', value: 'Lutefish Box ($448 fee)' }
    ]
  }
};

export default function PricingDetailPage({ params }: { params: { tier: string } }) {
  const tier = params.tier?.toLowerCase() || 'basic-access';
  const data = pricingTierData[tier] || pricingTierData['basic-access'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <Header />

      {/* Hero Header Section */}
      <section className="bg-[#0b0813] text-white py-16 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url('/stage_lights.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/pricing" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 mb-6 w-fit">
            <i className="fa-solid fa-arrow-left"></i> Back to Pricing
          </Link>
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/25 px-3 py-1 rounded-full w-fit block mb-4">
              Tier Deep Dive
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-wider mb-4">
              {data.name} <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Details</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium uppercase tracking-wide leading-relaxed">
              {data.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Description & Benefits */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
            <h2 className="text-xl font-heading font-black text-slate-900 uppercase tracking-wide mb-4">
              Program Summary
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              {data.extendedDescription}
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
            <h2 className="text-xl font-heading font-black text-slate-900 uppercase tracking-wide mb-4">
              Plan Benefits & Inclusions
            </h2>
            <div className="space-y-4">
              {data.benefits.map((feat, idx) => (
                <div key={idx} className="flex gap-3 items-start text-xs font-semibold text-slate-600">
                  <span className="text-cyan-500 mt-0.5"><i className="fa-solid fa-circle-check"></i></span>
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Spec Sheet & Checkout */}
        <div className="space-y-8">
          {/* Spec Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="font-heading text-base font-black text-slate-900 uppercase tracking-wide mb-4 border-b border-slate-100 pb-3">
              Tier Specifications
            </h3>
            <div className="space-y-4 text-xs font-semibold">
              {data.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">{spec.label}</span>
                  <span className="text-slate-700">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#0b0813] text-white p-6 rounded-xl relative overflow-hidden shadow-lg shadow-pink-500/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Monthly Cost</span>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-heading font-black tracking-tight">{data.price}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-black">{data.period}</span>
            </div>

            {data.note && (
              <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-6">
                {data.note}
              </p>
            )}

            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-semibold border-t border-slate-800 pt-4">
              Get started with {data.name} today. Claim your spot instantly and start booking lessons.
            </p>
            
            <Link 
              href={`/signup?tier=${tier}`} 
              className="block w-full py-3.5 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-95 transition-opacity"
            >
              Sign Up & Get Started
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
