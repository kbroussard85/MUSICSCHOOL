'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IAMProfile } from '@/lib/iam';

interface SidebarProps {
  profile: IAMProfile;
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Practice Jam Room', path: '/practice-room', icon: 'fa-cubes', roles: ['STUDENT', 'DIRECTOR', 'INSTRUCTOR', 'ADMIN'] },
    { name: 'Instructional Lessons', path: '/lessons', icon: 'fa-graduation-cap', roles: ['STUDENT', 'DIRECTOR', 'INSTRUCTOR', 'ADMIN'] },
    { name: 'Schedule Slots', path: '/schedule', icon: 'fa-calendar-days', roles: ['STUDENT', 'DIRECTOR', 'INSTRUCTOR', 'ADMIN'] },
    { name: 'Admin Dashboard', path: '/admin', icon: 'fa-sliders', roles: ['ADMIN'] },
  ];

  // Add Admin-only tools if user is an ADMIN
  const activeNavItems = navItems.filter(item => item.roles.includes(profile.role));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-cyan-500/15 bg-[#0b0813] flex flex-col justify-between shrink-0 font-sans relative">
      {/* Top lightbar decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

      <div>
        {/* Logo / Brand Header */}
        <div className="p-6 border-b border-cyan-500/10 flex flex-col gap-1.5 justify-start">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-black tracking-widest text-[#f1ecff]">
            <i className="fa-solid fa-music text-pink-500 glow-pulse-pink"></i>
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">Stage Music</span>
          </Link>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest glow-pulse-cyan">Academy</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 font-extrabold uppercase tracking-widest">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Navigation Links with Neon Accents */}
        <nav className="p-4 flex flex-col gap-2">
          {activeNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-black transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-[#f1ecff] border-l-2 border-l-pink-500 shadow-md shadow-pink-500/10' 
                    : 'text-slate-400 hover:bg-[#120e24] hover:text-cyan-400 hover:border-l-2 hover:border-l-cyan-500'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-sm ${isActive ? 'text-pink-500' : 'text-slate-500'}`}></i>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Card footer */}
      <div className="p-4 border-t border-cyan-500/10 flex items-center justify-between bg-[#080610]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-xs border border-cyan-400/30">
            {getInitials(profile.name)}
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-200 truncate max-w-[110px]">{profile.name}</h4>
            <span className="text-[9px] text-slate-500 block truncate max-w-[110px]">{profile.email}</span>
          </div>
        </div>
        <Link href="/logout" className="p-2 text-slate-500 hover:text-pink-400 transition-colors" aria-label="Sign out">
          <i className="fa-solid fa-right-from-bracket"></i>
        </Link>
      </div>
    </aside>
  );
}
