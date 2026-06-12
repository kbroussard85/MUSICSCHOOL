'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Practice Jam Room', path: '/practice-room', icon: 'fa-cubes' },
    { name: 'Instructional Lessons', path: '/lessons', icon: 'fa-graduation-cap' },
    { name: 'Schedule Slots', path: '/schedule', icon: 'fa-calendar-days' },
  ];

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col md:flex-row">
      {/* Side Bar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-[#0b0e14] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-widest bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
              <i className="fa-solid fa-music"></i>
              <span>HARMONY</span>
            </Link>
            <span className="text-[10px] px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold rounded uppercase tracking-wider">
              Student
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2">
            {navItems.map((item) => {
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
            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center font-bold text-white uppercase shadow-md shadow-violet-600/20">
              AB
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Alex Broussard</h4>
              <span className="text-[9px] text-slate-500 block">ID: #HM-2490</span>
            </div>
          </div>
          <Link href="/" className="p-2 text-slate-400 hover:text-rose-400 transition-colors" aria-label="Sign out">
            <i className="fa-solid fa-right-from-bracket"></i>
          </Link>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
