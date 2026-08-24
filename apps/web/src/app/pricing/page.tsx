'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Define pricing tier overview details
const pricingTiers = [
  {
    id: 'basic-access',
    name: 'Basic Access',
    price: '$99',
    period: '/ month',
    tagline: 'Full entry to all digital training assets.',
    description: 'Get immediate 24/7 access to our extensive video library, sheet music vault, interactive tabs, scales, and pre-recorded clinics.',
    cta: 'Start Basic Access',
    color: 'border-slate-200 hover:border-slate-400',
    badge: null,
    features: [
      'Access to all video lesson materials in the vault',
      'Downloadable sheet music & instrument tabs',
      'Basic progress tracking tools',
      'Digital student forum access'
    ]
  },
  {
    id: 'online-lessons',
    name: 'Online Lessons',
    price: '$199',
    period: '/ month',
    tagline: 'Private virtual coaching from certified experts.',
    description: 'Perfect for remote students. Combines full vault access with weekly 1-on-1 private video lessons and personalized curriculum plans.',
    cta: 'Book Online Coach',
    color: 'border-cyan-500/30 hover:border-cyan-500',
    badge: 'Popular for Remote',
    features: [
      'Weekly 45-minute 1-on-1 private video lessons',
      'Personalized virtual dashboard & practice goals',
      'Full access to all lesson materials in the vault',
      'Monthly recorded video performance evaluations'
    ]
  },
  {
    id: 'live-band',
    name: 'Live Band',
    price: '$299',
    period: '/ month',
    tagline: 'Collaborate, rehearse, and play on stage.',
    description: 'The core Next Stage experience. Join a local rehearsing band cohort, jam once a week, and perform 2 live showcases per season.',
    cta: 'Claim Band Slot',
    color: 'border-pink-500/35 hover:border-pink-500 hover:shadow-pink-500/5',
    badge: 'Most Popular',
    features: [
      'Weekly 90-minute coached rehearsals at local studios',
      'Bi-monthly 1-on-1 online check-in checkups',
      'Access to paywalled live and recorded masterclasses',
      '2 ticketed showcase performances per season',
      'Full access to all lesson materials in the vault'
    ]
  },
  {
    id: 'performance-pro',
    name: 'Performance Pro',
    price: '$349',
    period: '/ month',
    tagline: 'Zero-latency jam hardware & elite touring program.',
    description: 'Our ultimate program. Adds premium Lutefish hardware, zero-latency jam subscriptions, and elite Allstar tour membership (4 shows/season).',
    note: '+ $448 one-time hardware fee',
    cta: 'Go Performance Pro',
    color: 'border-purple-500/40 hover:border-purple-500 hover:shadow-purple-500/5',
    badge: 'Elite Roster',
    features: [
      'Includes premium Lutefish zero-latency hardware setup',
      'Lutefish subscription for real-time remote jams',
      'Allstar Program entry (4 shows/season instead of 2)',
      'VIP event opportunities & local music festival gigs',
      'All features included in the Live Band tier'
    ]
  }
];

export default function PricingDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <Header />

      {/* Hero Intro */}
      <section className="bg-[#0b0813] text-white py-16 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url('/stage_lights.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/25 px-3 py-1 rounded-full w-fit block mx-auto mb-4">
            Membership Packages
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-wider mb-4">
            Select Your <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Academy Tier</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-medium uppercase tracking-wide leading-relaxed">
            Choose the program that fits your goals, whether you are seeking solo practice vault entry or elite showcase touring slots.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${tier.color}`}
            >
              <div>
                {/* Badge if active */}
                {tier.badge && (
                  <span className="absolute -top-3 left-6 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-slate-900 text-white shadow">
                    {tier.badge}
                  </span>
                )}

                <h3 className="font-heading text-lg font-black text-slate-900 uppercase tracking-wide mb-2 mt-2">
                  {tier.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mb-6">
                  {tier.tagline}
                </p>

                {/* Price block */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-black text-slate-900 tracking-tight">{tier.price}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{tier.period}</span>
                </div>

                {tier.note && (
                  <p className="text-[9px] font-bold text-pink-600 uppercase tracking-wider -mt-4 mb-6">
                    {tier.note}
                  </p>
                )}

                <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-8 border-t border-slate-100 pt-4">
                  {tier.description}
                </p>

                {/* Features */}
                <div className="space-y-3.5 mb-8">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">What's Included</span>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-[11px] font-semibold text-slate-600 leading-tight">
                      <span className="text-cyan-500 mt-0.5"><i className="fa-solid fa-circle-check"></i></span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Link 
                  href={`/signup?tier=${tier.id}`} 
                  className="block w-full py-2.5 text-center bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                >
                  {tier.cta}
                </Link>
                <Link 
                  href={`/pricing/${tier.id}`} 
                  className="block w-full py-2 text-center text-slate-500 hover:text-slate-900 text-[9px] font-bold uppercase tracking-wider"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
