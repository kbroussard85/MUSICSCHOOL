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

interface HubData {
  id: string;
  name: string;
  city: string;
  address: string;
}

interface CohortData {
  id: string;
  name: string;
  ageGroup: string;
  scheduleDay: string;
  scheduleSlot: string;
  hubId: string;
  showcaseTheme: string | null;
  showcaseVenue: string | null;
  rosterCount: number;
}

interface DashboardClientProps {
  studentInfo: {
    id: string;
    name: string;
    instrument: string;
    cohortId: string | null;
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
  allHubs: HubData[];
  allCohorts: CohortData[];
  initialSelectedHubCity: string;
}

export default function DashboardClient({ 
  studentInfo, 
  profileName, 
  allHubs, 
  allCohorts, 
  initialSelectedHubCity 
}: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [bulletinNotes, setBulletinNotes] = useState<BulletinNote[]>(studentInfo.bulletinNotes);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Roster Enrollment Wizard States
  const [selectedHubCity, setSelectedHubCity] = useState(initialSelectedHubCity);
  const [selectedProgram, setSelectedProgram] = useState('13-17'); // defaults to Teen Rock age group
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolledCohort, setEnrolledCohort] = useState<CohortData | null>(null);

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

  const handleLocationHubChange = (city: string) => {
    setSelectedHubCity(city);
    document.cookie = `selected_hub_city=${city}; path=/`;
  };

  const handleRosterEnroll = async (cohort: CohortData) => {
    if (isEnrolling) return;
    setIsEnrolling(true);

    try {
      const res = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentInfo.id,
          cohortId: cohort.id
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setEnrolledCohort(cohort);
        } else {
          alert('Enrollment failed: ' + result.error);
        }
      } else {
        alert('Server returned an error during enrollment.');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Network error during enrollment.');
    } finally {
      setIsEnrolling(false);
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

  // ----------------------------------------------------
  // UNASSIGNED STATE: Roster Enrollment Wizard
  // ----------------------------------------------------
  if (!studentInfo.cohortId && !enrolledCohort) {
    const currentHub = allHubs.find(h => h.city.toLowerCase() === selectedHubCity.toLowerCase()) || allHubs[0];
    
    // Filter cohorts by location and program ageGroup
    const filteredCohorts = allCohorts.filter(c => 
      c.hubId === currentHub?.id && 
      c.ageGroup === selectedProgram
    );

    return (
      <div className="space-y-8 font-sans pb-10">
        {/* Wizard Header */}
        <div className="border-b border-white/5 pb-6">
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Roster Allocation Wizard</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            Secure Your Roster Spot
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Choose your studio location, band program, and select an open rehearsal slot below to complete enrollment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Panel (1/4 Width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Hub Selector */}
            <div className="stitch-card p-5">
              <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-3">
                1. Select Location Hub
              </span>
              <div className="flex flex-col gap-2">
                {allHubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => handleLocationHubChange(hub.city)}
                    className={`w-full py-2.5 px-3 border text-left text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      selectedHubCity.toLowerCase() === hub.city.toLowerCase()
                        ? 'bg-violet-500/10 border-violet-500 text-white'
                        : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <i className="fa-solid fa-location-dot mr-2"></i>
                    {hub.city} Hub
                  </button>
                ))}
              </div>
            </div>

            {/* Program Category Selector */}
            <div className="stitch-card p-5">
              <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-3">
                2. Band Program
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedProgram('13-17')}
                  className={`w-full py-2.5 px-3 border text-left text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedProgram === '13-17'
                      ? 'bg-pink-500/10 border-pink-500 text-white'
                      : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <i className="fa-solid fa-guitar mr-2"></i>
                  Teen Bands (13-17)
                </button>
                <button
                  onClick={() => setSelectedProgram('18+')}
                  className={`w-full py-2.5 px-3 border text-left text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedProgram === '18+'
                      ? 'bg-pink-500/10 border-pink-500 text-white'
                      : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <i className="fa-solid fa-drum mr-2"></i>
                  Adult Bands (18+)
                </button>
              </div>
            </div>

          </div>

          {/* Roster Slots Availability Chart (3/4 Width) */}
          <div className="lg:col-span-3 stitch-card p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-violet-400/40 uppercase tracking-widest">
              Live Slot Telemetry
            </div>

            <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-1">
              {currentHub?.name}
            </span>
            <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-2">
              Available Rehearsal Roster Slots
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-6">
              Roster positions are capped at 10. Once a slot is filled (10/10), it becomes locked.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs uppercase tracking-wider border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 text-[10px]">
                    <th className="py-3 px-4">Band Name</th>
                    <th className="py-3 px-4">Weekly Schedule</th>
                    <th className="py-3 px-4">Showcase Theme</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCohorts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 uppercase tracking-widest">
                        No band cohorts found for this hub selection.
                      </td>
                    </tr>
                  ) : (
                    filteredCohorts.map((cohort) => {
                      const isFull = cohort.rosterCount >= 10;
                      
                      return (
                        <tr key={cohort.id} className="hover:bg-white/2">
                          <td className="py-4 px-4 font-sans font-black text-slate-200">
                            {cohort.name}
                          </td>
                          <td className="py-4 px-4 text-slate-300">
                            {cohort.scheduleDay}s <br />
                            <span className="text-[10px] text-slate-500">{cohort.scheduleSlot}</span>
                          </td>
                          <td className="py-4 px-4 text-slate-400">
                            {cohort.showcaseTheme} <br />
                            <span className="text-[10px] text-slate-500">Venue: {cohort.showcaseVenue}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1.5 max-w-[120px]">
                              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                <span>{cohort.rosterCount} / 10 spots</span>
                                <span className={isFull ? 'text-red-400' : cohort.rosterCount >= 8 ? 'text-amber-400' : 'text-emerald-400'}>
                                  {isFull ? 'FULL' : 'OPEN'}
                                </span>
                              </div>
                              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    isFull 
                                      ? 'bg-red-500' 
                                      : cohort.rosterCount >= 8 
                                      ? 'bg-amber-500' 
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(cohort.rosterCount * 10, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {isFull ? (
                              <button 
                                disabled
                                className="py-1.5 px-3 bg-slate-800 border border-slate-700 text-slate-600 text-[10px] font-black uppercase tracking-widest cursor-not-allowed"
                              >
                                Capped
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRosterEnroll(cohort)}
                                disabled={isEnrolling}
                                className="py-1.5 px-3 border border-violet-500/30 hover:border-violet-500 text-violet-400 hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all disabled:opacity-50"
                              >
                                {isEnrolling ? 'Enrolling...' : 'Enroll in Band'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ENROLLMENT CONFIRMATION STATE
  // ----------------------------------------------------
  if (enrolledCohort) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg bg-[#0c0e14] border border-pink-500/35 p-8 shadow-2xl relative text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto glow-pulse-emerald">
            <i className="fa-solid fa-circle-check"></i>
          </div>

          <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-1">Roster Confirmed</span>
          <h2 className="text-2xl font-heading font-black uppercase text-slate-200 tracking-wider">
            Successfully Enrolled!
          </h2>

          <div className="p-5 bg-[#121722]/50 border border-white/5 font-mono text-xs uppercase text-slate-300 space-y-2 text-left">
            <p><span className="text-violet-400 font-bold">Band Roster:</span> {enrolledCohort.name}</p>
            <p><span className="text-violet-400 font-bold">Weekly Day:</span> {enrolledCohort.scheduleDay}s</p>
            <p><span className="text-violet-400 font-bold">Time Slot:</span> {enrolledCohort.scheduleSlot}</p>
            <p><span className="text-violet-400 font-bold">Rehearsal Hub:</span> {selectedHubCity} Studio Hub</p>
            <p><span className="text-violet-400 font-bold">Showcase Theme:</span> {enrolledCohort.showcaseTheme}</p>
          </div>

          <p className="text-[11px] text-slate-400 uppercase tracking-wide leading-relaxed max-w-xs mx-auto">
            Your roster reservation is locked. Weekly rehearsals start on the next scheduled rehearsal day. Access your dashboard now to view sheet music charts.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 stitch-btn-violet text-xs font-black uppercase tracking-widest cursor-pointer text-center"
          >
            Enter Student Portal
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STANDARD PORTAL DASHBOARD (ENROLLED STATE)
  // ----------------------------------------------------
  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Student Portal</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            Welcome Back, <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{profileName}</span>
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Focus: <span className="text-violet-400 font-extrabold">{studentInfo.instrument}</span> &bull; Band: <span className="text-pink-400 font-extrabold">Next Stage Roster</span>
          </p>
        </div>

        {/* Global Search Bar linking to Vault */}
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-80 relative">
          <input 
            type="text" 
            placeholder="Search charts, tabs, lessons..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121722]/50 border border-white/10 px-4 py-2.5 pl-10 text-xs text-[#f1ecff] placeholder-slate-500 focus:outline-none focus:border-violet-400 transition-all font-mono"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-500"></i>
          <button type="submit" className="hidden" aria-label="Search" />
        </form>
      </div>

      {/* Roster & Showcase Setlist Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Showcase Progress Roster (2/3 Width) */}
        <div className="lg:col-span-2 stitch-card p-6 md:p-8 relative">
          <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-pink-500/40 tracking-widest uppercase">
            Live Showcase Setlist
          </div>
          
          <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-1">
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
              <div className="p-6 border border-dashed border-white/10 text-center text-xs text-slate-500 uppercase tracking-wider">
                No songs assigned to your performance band yet.
              </div>
            ) : (
              studentInfo.setlist.map((song) => (
                <div key={song.id} className="p-4 bg-[#121722]/45 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">{song.title}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">{song.artist}</p>
                    
                    {/* Song progress bar using Stitch pink-violet gradient */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-pink-500 h-full rounded-full"
                          style={{ width: `${song.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-violet-400 font-black">{song.progress}% Learned</span>
                    </div>
                  </div>

                  <Link 
                    href={`/vault?search=${encodeURIComponent(song.title)}`}
                    className="py-2 px-4 border border-violet-500/30 hover:border-violet-500 text-violet-400 hover:text-white text-[10px] font-black uppercase tracking-widest text-center self-start md:self-auto transition-all"
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
          <div className="stitch-card p-6 relative">
            <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-1">
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

          {/* Weekly rehearsal slot using Stitch gradient tags */}
          <div className="stitch-card p-6 relative">
            <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-violet-400/40">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            
            <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">
              Group Rehearsal
            </span>
            <h3 className="text-xl font-heading font-black uppercase text-slate-100 tracking-wide mb-2">
              Weekly Band Slot
            </h3>
            <div className="font-mono text-xs uppercase text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
              <p><span className="text-violet-400 font-bold">Day:</span> {studentInfo.rehearsalDay}</p>
              <p><span className="text-violet-400 font-bold">Slot:</span> {studentInfo.rehearsalSlot}</p>
              <p><span className="text-violet-400 font-bold">Room:</span> Ensemble Backline Studio A</p>
            </div>
          </div>

        </div>
      </div>

      {/* Schedule Calendar Grid (Private Lessons & Masterclasses) */}
      <div className="stitch-card p-6 md:p-8">
        <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-6">
          My Calendar Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Private Lessons */}
          <div>
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block mb-2 border-b border-violet-500/10 pb-2">
              Private Lessons
            </span>
            {studentInfo.lessons.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 text-center text-xs text-slate-500 uppercase tracking-wider font-mono">
                No upcoming private lessons scheduled.
              </div>
            ) : (
              <div className="space-y-4">
                {studentInfo.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 bg-[#121722]/45 border border-white/5 flex items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <p className="text-slate-300 uppercase font-black">{formatDate(lesson.scheduledAt)}</p>
                      <p className="text-slate-500 text-[10px] uppercase mt-1">Instructor: {lesson.instructor.name}</p>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 uppercase tracking-widest font-extrabold">
                      {lesson.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Masterclass Releases */}
          <div>
            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block mb-2 border-b border-pink-500/10 pb-2">
              Masterclass Release Schedule
            </span>
            {studentInfo.masterclasses.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 text-center text-xs text-slate-500 uppercase tracking-wider font-mono">
                No upcoming masterclasses.
              </div>
            ) : (
              <div className="space-y-4">
                {studentInfo.masterclasses.map((mc) => (
                  <div key={mc.id} className="p-4 bg-[#121722]/45 border border-white/5 flex items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <p className="text-slate-300 uppercase font-black">{mc.topic}</p>
                      <p className="text-slate-500 text-[10px] uppercase mt-1">
                        Release: {formatDate(mc.scheduledAt)}
                      </p>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 uppercase tracking-widest font-extrabold">
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
      <div className="stitch-card p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-violet-400/40 tracking-widest uppercase">
          Studio Bulletin
        </div>

        <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-2">
          Academy Bulletin Board
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">
          Leave notes, ask questions, or share tips with instructors and classmates.
        </p>

        {/* Note posting form */}
        <form onSubmit={handlePostNote} className="mb-8 p-4 bg-[#121722]/45 border border-white/5">
          <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-2">
            Leave a Note
          </span>
          <textarea
            required
            rows={2}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your note here..."
            className="w-full bg-slate-950 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono mb-3 resize-none"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="py-2 px-5 stitch-btn-violet text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Posting Note...' : 'Pin Note to Board'}
          </button>
        </form>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bulletinNotes.length === 0 ? (
            <div className="md:col-span-3 p-8 border border-dashed border-white/10 text-center text-xs text-slate-500 uppercase tracking-wider font-mono">
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
                      ? 'bg-gradient-to-br from-[#2a1122]/40 to-[#121722]/45 border border-pink-500/20 shadow-md shadow-pink-500/5' 
                      : 'bg-gradient-to-br from-[#1b122e]/40 to-[#121722]/45 border border-violet-500/20'
                  }`}
                >
                  <p className="text-xs text-slate-300 font-mono leading-relaxed mb-6 whitespace-pre-wrap">
                    "{note.content}"
                  </p>
                  
                  <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[9px] font-mono uppercase">
                    <span className={`font-black ${isInstructor ? 'text-pink-400' : 'text-violet-400'}`}>
                      {note.authorName}
                    </span>
                    <span className="text-slate-600 font-bold">
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
