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
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-[#0b0e14] flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-widest bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
            <i className="fa-solid fa-music"></i>
            <span>HARMONY</span>
          </Link>
          <span className="text-[10px] px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold rounded uppercase tracking-wider">
            {profile.role.toLowerCase()}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex flex-col gap-2">
          {activeNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/15' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Card footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center font-bold text-white uppercase shadow-md shadow-violet-600/20 text-sm">
            {getInitials(profile.name)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 truncate max-w-[110px]">{profile.name}</h4>
            <span className="text-[9px] text-slate-500 block truncate max-w-[110px]">{profile.email}</span>
          </div>
        </div>
        <Link href="/logout" className="p-2 text-slate-400 hover:text-rose-400 transition-colors" aria-label="Sign out">
          <i className="fa-solid fa-right-from-bracket"></i>
        </Link>
      </div>
    </aside>
  );
}
