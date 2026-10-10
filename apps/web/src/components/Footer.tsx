'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-[#06040a] py-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
        <BrandLogo size="sm" />
        <p>&copy; 2026 Nxt Stage Music. Cancel anytime, no obligation.</p>
        <div className="flex gap-6 font-bold">
          <Link 
            href="/signup?action=contact" 
            className="hover:text-cyan-400 transition-colors" 
          >
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
