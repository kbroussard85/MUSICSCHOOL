'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SetlistSong {
  id: string;
  title: string;
  artist: string;
  progress: number;
}

interface Lesson {
  id: string;
  scheduledAt: Date | string;
  durationMinutes: number;
  type: string;
  instructor: {
    name: string;
    email: string;
  };
}

interface Masterclass {
  id: string;
  topic: string;
  scheduledAt: Date | string;
  durationMinutes: number;
  instructors: Array<{
    instructor: {
      name: string;
    };
  }>;
}

interface BulletinNote {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: Date | string;
}

interface DashboardClientProps {
  studentInfo: {
    id: string;
    name: string;
    instrument: string;
    director: string;
    directorEmail: string;
    showcase: string;
    venue: string;
    setlist: SetlistSong[];
    rehearsalDay: string;
    rehearsalSlot: string;
    lessons: Lesson[];
    masterclasses: Masterclass[];
    bulletinNotes: BulletinNote[];
  };
  profileName: string;
}

export default function DashboardClient({ studentInfo, profileName }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [bulletinNotes, setBulletinNotes] = useState<BulletinNote[]>(studentInfo.bulletinNotes);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vault?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNoteContent,
          authorName: profileName,
          authorRole: 'STUDENT'
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success' && result.data) {
          setBulletinNotes([result.data, ...bulletinNotes]);
          setNewNoteContent('');
        }
      } else {
        alert('Failed to post note. Please try again.');
      }
    } catch (err) {
      console.error('Error posting bulletin note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6">
        <div>
          <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-1">Student Portal</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            Welcome Back, <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">{profileName}</span>
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Focus: <span className="text-cyan-400 font-extrabold">{studentInfo.instrument}</span> &bull; Band: <span className="text-purple-400 font-extrabold">Next Stage Roster</span>
          </p>
        </div>

        {/* Global Search Bar linking to Vault */}
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-80 relative">
          <input 
            type="text" 
            placeholder="Search charts, tabs, lessons..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0813] border border-cyan-500/20 px-4 py-2.5 pl-10 text-xs text-[#f1ecff] placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-500"></i>
          <button type="submit" className="hidden" aria-label="Search" />
        </form>
      </div>

      {/* Roster & Showcase Setlist Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Showcase Progress Roster (2/3 Width) */}
        <div className="lg:col-span-2 cyber-card p-6 md:p-8 bg-[#0b0813]/80 border-cyan-500/15 relative">
          <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-pink-500/40 tracking-widest uppercase">
            Live Showcase Setlist
          </div>
          
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-1">
            Active Performance
          </span>
          <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-2">
            {studentInfo.showcase}
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-6">
            Showcase Venue: <span className="text-slate-200 font-bold">{studentInfo.venue}</span>
          </p>

          {/* Setlist Song List */}
          <div className="space-y-6">
            {studentInfo.setlist.length === 0 ? (
              <div className="p-6 border border-dashed border-cyan-500/10 text-center text-xs text-slate-500 uppercase tracking-wider">
                No songs assigned to your performance band yet.
              </div>
            ) : (
              studentInfo.setlist.map((song) => (
                <div key={song.id} className="p-4 bg-[#06040a]/80 border border-cyan-500/10 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">{song.title}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">{song.artist}</p>
                    
                    {/* Song progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full"
                          style={{ width: `${song.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-black">{song.progress}% Learned</span>
                    </div>
                  </div>

                  <Link 
                    href={`/vault?search=${encodeURIComponent(song.title)}`}
                    className="py-2 px-4 cyber-btn-cyan text-[10px] font-black uppercase tracking-widest text-center self-start md:self-auto"
                  >
                    Get Charts & Tabs
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Director Info & Rehearsal Card (1/3 Width) */}
        <div className="space-y-6">
          
          {/* Director assigned */}
          <div className="cyber-card p-6 bg-[#0b0813]/80 border-cyan-500/15 relative">
            <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">
              Assigned Coach
            </span>
            <h3 className="text-xl font-heading font-black uppercase text-slate-200 tracking-wide">
              Director: {studentInfo.director}
            </h3>
            {studentInfo.directorEmail && (
              <p className="text-[10px] text-slate-500 font-mono mt-1 lowercase">{studentInfo.directorEmail}</p>
            )}
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-4 leading-relaxed font-medium">
              Your director leads your weekly group band rehearsals and coordinates your live show setlists. Contact them for help with charts or audition checks.
            </p>
          </div>

          {/* Weekly rehearsal slot */}
          <div className="cyber-card p-6 bg-gradient-to-br from-[#0b0813] to-[#120c24] border-pink-500/20 relative">
            <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-pink-400/40">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-1">
              Group Rehearsal
            </span>
            <h3 className="text-xl font-heading font-black uppercase text-slate-100 tracking-wide mb-2">
              Weekly Band Slot
            </h3>
            <div className="font-mono text-xs uppercase text-slate-300 space-y-1.5 pt-2 border-t border-cyan-500/10">
              <p><span className="text-pink-500">Day:</span> {studentInfo.rehearsalDay}</p>
              <p><span className="text-pink-500">Slot:</span> {studentInfo.rehearsalSlot}</p>
              <p><span className="text-pink-500">Room:</span> Ensemble Backline Studio A</p>
            </div>
          </div>

        </div>
      </div>

      {/* Schedule Calendar Grid (Private Lessons & Masterclasses) */}
      <div className="cyber-card p-6 md:p-8 bg-[#0b0813]/80 border-cyan-500/15">
        <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-6">
          My Calendar Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Private Lessons */}
          <div>
            <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-2 border-b border-pink-500/10 pb-2">
              Private Lessons
            </span>
            {studentInfo.lessons.length === 0 ? (
              <div className="p-8 border border-dashed border-cyan-500/10 text-center text-xs text-slate-500 uppercase tracking-wider font-mono">
                No upcoming private lessons scheduled.
              </div>
            ) : (
              <div className="space-y-4">
                {studentInfo.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 bg-[#06040a]/80 border border-cyan-500/5 rounded-sm flex items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <p className="text-slate-300 uppercase font-black">{formatDate(lesson.scheduledAt)}</p>
                      <p className="text-slate-500 text-[10px] uppercase mt-1">Instructor: {lesson.instructor.name}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 uppercase tracking-widest font-extrabold">
                      {lesson.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Masterclass Releases */}
          <div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-2 border-b border-cyan-500/10 pb-2">
              Masterclass Release Schedule
            </span>
            {studentInfo.masterclasses.length === 0 ? (
              <div className="p-8 border border-dashed border-cyan-500/10 text-center text-xs text-slate-500 uppercase tracking-wider font-mono">
                No upcoming masterclasses.
              </div>
            ) : (
              <div className="space-y-4">
                {studentInfo.masterclasses.map((mc) => (
                  <div key={mc.id} className="p-4 bg-[#06040a]/80 border border-cyan-500/5 rounded-sm flex items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <p className="text-slate-300 uppercase font-black">{mc.topic}</p>
                      <p className="text-slate-500 text-[10px] uppercase mt-1">
                        Release: {formatDate(mc.scheduledAt)}
                      </p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase tracking-widest font-extrabold">
                      Masterclass
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Bulletin Board Section */}
      <div className="cyber-card p-6 md:p-8 bg-[#0b0813]/80 border-cyan-500/15 relative">
        <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-cyan-500/40 tracking-widest uppercase">
          Studio Bulletin
        </div>

        <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-2">
          Academy Bulletin Board
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">
          Leave notes, ask questions, or share tips with instructors and classmates.
        </p>

        {/* Note posting form */}
        <form onSubmit={handlePostNote} className="mb-8 p-4 bg-[#06040a]/85 border border-cyan-500/10 rounded-sm">
          <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-2">
            Leave a Note
          </span>
          <textarea
            required
            rows={2}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your note here..."
            className="w-full bg-[#0b0813] border border-cyan-500/15 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-cyan-400 font-mono mb-3 resize-none"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="py-2.5 px-6 cyber-btn-pink text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Posting Note...' : 'Pin Note to Board'}
          </button>
        </form>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bulletinNotes.length === 0 ? (
            <div className="md:col-span-3 p-8 border border-dashed border-cyan-500/10 text-center text-xs text-slate-500 uppercase tracking-wider font-mono">
              The bulletin board is empty. Be the first to pin a note!
            </div>
          ) : (
            bulletinNotes.map((note) => {
              const isInstructor = note.authorRole === 'INSTRUCTOR' || note.authorRole === 'DIRECTOR';
              return (
                <div 
                  key={note.id} 
                  className={`p-5 relative rounded-sm flex flex-col justify-between ${
                    isInstructor 
                      ? 'bg-gradient-to-br from-[#120e2e] to-[#0b0813] border border-pink-500/25 shadow-md shadow-pink-500/5' 
                      : 'bg-gradient-to-br from-[#080d1a] to-[#0b0813] border border-cyan-500/15'
                  }`}
                >
                  <p className="text-xs text-slate-300 font-mono leading-relaxed mb-6 whitespace-pre-wrap">
                    "{note.content}"
                  </p>
                  
                  <div className="border-t border-cyan-500/5 pt-3 flex items-center justify-between text-[9px] font-mono uppercase">
                    <span className={`font-black ${isInstructor ? 'text-pink-400' : 'text-cyan-400'}`}>
                      {note.authorName}
                    </span>
                    <span className="text-slate-600">
                      {note.authorRole}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
