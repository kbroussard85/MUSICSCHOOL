'use client';

import React, { useState } from 'react';

interface SetlistSong {
  id: string;
  title: string;
  artist: string;
  progress: number;
  cohortId: string;
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
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  instrument: string;
  phone: string;
  age: number;
  cohortId: string | null;
}

interface LessonData {
  id: string;
  studentId: string;
  studentName: string;
  instructorName: string;
  scheduledAt: string;
  type: string;
}

interface DirectorDashboardClientProps {
  allHubs: HubData[];
  allCohorts: CohortData[];
  allStudents: StudentData[];
  allLessons: LessonData[];
  allSongs: SetlistSong[];
  profileName: string;
  initialSelectedHubCity: string;
}

export default function DirectorDashboardClient({
  allHubs,
  allCohorts,
  allStudents,
  allLessons,
  allSongs,
  profileName,
  initialSelectedHubCity
}: DirectorDashboardClientProps) {
  // Selector Filters
  const [selectedHubCity, setSelectedHubCity] = useState(initialSelectedHubCity);
  const [selectedProgram, setSelectedProgram] = useState('13-17'); // default: Teen Rock age group

  // Active Cohort Resolver
  const activeHub = allHubs.find(h => h.city.toLowerCase() === selectedHubCity.toLowerCase()) || allHubs[0];
  const activeCohort = allCohorts.find(c => c.hubId === activeHub?.id && c.ageGroup === selectedProgram);

  // Setlist local state
  const [songs, setSongs] = useState<SetlistSong[]>(allSongs);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [updatingSongId, setUpdatingSongId] = useState<string | null>(null);

  // Roster Allocation state
  const [students, setStudents] = useState<StudentData[]>(allStudents);
  const [assignStudentId, setAssignStudentId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [presentMap, setPresentMap] = useState<{ [studentId: string]: boolean }>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceFeedback, setAttendanceFeedback] = useState('');

  // Private Lesson Rescheduling state
  const [lessons, setLessons] = useState<LessonData[]>(allLessons);
  const [rescheduleTimes, setRescheduleTimes] = useState<{ [lessonId: string]: string }>({});
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  // Filter cohorts matching active
  const cohortSongs = songs.filter(s => s.cohortId === activeCohort?.id);
  const enrolledStudents = students.filter(s => s.cohortId === activeCohort?.id);
  const unassignedStudents = students.filter(s => !s.cohortId);

  // Attendance Checkbox toggler
  const toggleAttendance = (studentId: string) => {
    setPresentMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === undefined ? false : !prev[studentId]
    }));
  };

  // Save Attendance to Database
  const handleSaveAttendance = async () => {
    if (!activeCohort) return;
    setIsSavingAttendance(true);
    setAttendanceFeedback('');

    const records = enrolledStudents.map(student => ({
      studentId: student.id,
      present: presentMap[student.id] !== false // Default to true if not explicitly checked false
    }));

    try {
      const res = await fetch('/api/student/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId: activeCohort.id,
          rehearsalDate: attendanceDate,
          records
        })
      });

      if (res.ok) {
        setAttendanceFeedback('Rehearsal attendance logged successfully.');
        setTimeout(() => setAttendanceFeedback(''), 4000);
      } else {
        alert('Error saving attendance.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setIsSavingAttendance(false);
    }
  };

  // Add a song to setlist
  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCohort || !newSongTitle.trim() || !newSongArtist.trim() || isAddingSong) return;

    setIsAddingSong(true);
    try {
      const res = await fetch('/api/admin/setlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId: activeCohort.id,
          title: newSongTitle,
          artist: newSongArtist
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setSongs([...songs, result.data]);
          setNewSongTitle('');
          setNewSongArtist('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingSong(false);
    }
  };

  // Update song progress value
  const handleUpdateProgress = async (songId: string, progressValue: number) => {
    setUpdatingSongId(songId);
    try {
      const res = await fetch('/api/admin/setlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: songId,
          progress: progressValue
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setSongs(songs.map(s => s.id === songId ? result.data : s));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingSongId(null);
    }
  };

  // Delete song from setlist
  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Remove song from the showcase setlist?')) return;
    try {
      const res = await fetch(`/api/admin/setlist?id=${songId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSongs(songs.filter(s => s.id !== songId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Unassign student (remove from cohort)
  const handleUnassignStudent = async (studentId: string) => {
    if (!confirm('Remove student from this band roster?')) return;
    try {
      const res = await fetch('/api/student/unassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      if (res.ok) {
        setStudents(students.map(s => s.id === studentId ? { ...s, cohortId: null } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Assign Student to current cohort
  const handleAssignStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCohort || !assignStudentId || isAssigning) return;

    setIsAssigning(true);
    try {
      const res = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: assignStudentId,
          cohortId: activeCohort.id
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setStudents(students.map(s => s.id === assignStudentId ? { ...s, cohortId: activeCohort.id } : s));
          setAssignStudentId('');
        } else {
          alert('Failed: ' + result.error);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  // Reschedule Private Lesson
  const handleRescheduleLesson = async (lessonId: string) => {
    const newTime = rescheduleTimes[lessonId];
    if (!newTime) {
      alert('Please select a new date and time.');
      return;
    }
    setReschedulingId(lessonId);

    try {
      const res = await fetch('/api/admin/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lesson',
          id: lessonId,
          newDateTime: new Date(newTime).toISOString()
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setLessons(lessons.map(l => l.id === lessonId ? { ...l, scheduledAt: new Date(newTime).toISOString() } : l));
          alert('Private lesson rescheduled successfully. Dispatch notification logged.');
        } else {
          alert('Error: ' + result.error);
        }
      } else {
        alert('Server communication error.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReschedulingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Director Control Portal</span>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-slate-100">
            Showcase & Roster Management
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Logged In: <span className="text-violet-400 font-extrabold">{profileName}</span> &bull; Role: <span className="text-pink-400 font-extrabold">Director</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Location Hub</label>
            <select
              value={selectedHubCity}
              onChange={(e) => setSelectedHubCity(e.target.value)}
              className="bg-[#121722]/50 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
            >
              {allHubs.map(h => (
                <option key={h.id} value={h.city}>{h.city} Hub</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Band Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="bg-[#121722]/50 border border-white/10 px-3 py-2 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
            >
              <option value="13-17">Teen Rock (13-17)</option>
              <option value="18+">Adult Jam (18+)</option>
            </select>
          </div>
        </div>
      </div>

      {activeCohort ? (
        <>
          {/* Showcase Details Header */}
          <div className="stitch-card p-6 md:p-8 relative">
            <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-1">Showcase Assignment</span>
            <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider">
              {activeCohort.showcaseTheme || 'No Theme Configured'}
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              Venue: <span className="text-slate-200 font-bold">{activeCohort.showcaseVenue || 'TBA'}</span> &bull; 
              Rehearsals: <span className="text-pink-400 font-bold">{activeCohort.scheduleDay}s @ {activeCohort.scheduleSlot}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Student Roster & Attendance Panel (2/3 Width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Roster & Attendance table */}
              <div className="stitch-card p-6 relative">
                <div className="absolute top-0 right-0 p-3 text-[8px] font-mono text-pink-500/40 uppercase tracking-widest">
                  Attendance & Assignment
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block mb-1">Roster Details</span>
                    <h3 className="text-lg font-heading font-black uppercase text-slate-100 tracking-wider">
                      Band Member List ({enrolledStudents.length} / 10)
                    </h3>
                  </div>

                  {/* Attendance Date Control */}
                  <div className="flex items-center gap-3 bg-[#121722]/50 border border-white/5 p-2 font-mono text-[10px]">
                    <span className="text-slate-400 uppercase font-bold">Attendance Date:</span>
                    <input 
                      type="date" 
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="bg-slate-950 border border-white/10 px-2 py-1 text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {attendanceFeedback && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase rounded-sm">
                    {attendanceFeedback}
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs uppercase tracking-wider">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 text-[10px]">
                        <th className="py-3 px-3">Student</th>
                        <th className="py-3 px-3">Instrument</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3 text-center">Present</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {enrolledStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500 uppercase tracking-widest">
                            No students enrolled in this location's cohort yet.
                          </td>
                        </tr>
                      ) : (
                        enrolledStudents.map((student) => {
                          const isPresent = presentMap[student.id] !== false;
                          return (
                            <tr key={student.id} className="hover:bg-white/2">
                              <td className="py-3 px-3 font-sans font-black text-slate-200">
                                {student.name}
                                <span className="block font-mono text-[9px] text-slate-500 lowercase mt-0.5">{student.email}</span>
                              </td>
                              <td className="py-3 px-3 text-violet-400 font-bold">{student.instrument}</td>
                              <td className="py-3 px-3 text-slate-400 text-[10px]">{student.phone || 'No phone'}</td>
                              <td className="py-3 px-3 text-center">
                                <input 
                                  type="checkbox" 
                                  checked={isPresent}
                                  onChange={() => toggleAttendance(student.id)}
                                  className="accent-pink-500 h-4 w-4 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleUnassignStudent(student.id)}
                                  className="py-1 px-2.5 border border-pink-500/35 hover:bg-pink-500/10 text-pink-400 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Save Attendance and Assign student block */}
                {enrolledStudents.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                    <button
                      onClick={handleSaveAttendance}
                      disabled={isSavingAttendance}
                      className="py-2.5 px-6 bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
                    >
                      {isSavingAttendance ? 'Saving logs...' : 'Save Rehearsal Attendance'}
                    </button>
                  </div>
                )}
              </div>

              {/* Add Student Section */}
              <div className="stitch-card p-6">
                <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-1">Roster Allocation</span>
                <h3 className="text-lg font-heading font-black uppercase text-slate-100 tracking-wider mb-4">
                  Add Student to {activeCohort.name}
                </h3>
                
                <form onSubmit={handleAssignStudentSubmit} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">Unassigned Students</label>
                    <select
                      value={assignStudentId}
                      onChange={(e) => setAssignStudentId(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-white/10 px-3 py-2.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
                    >
                      <option value="">Select an unassigned student...</option>
                      {unassignedStudents.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.instrument || 'Keyboard'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!assignStudentId || isAssigning}
                    className="py-2.5 px-6 stitch-btn-violet text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer"
                  >
                    {isAssigning ? 'Adding...' : 'Add Student to Band'}
                  </button>
                </form>
              </div>

            </div>

            {/* Setlist & Showcase Progress Panel (1/3 Width) */}
            <div className="space-y-6">
              
              {/* Showcase Setlist */}
              <div className="stitch-card p-6">
                <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">Setlist Management</span>
                <h3 className="text-lg font-heading font-black uppercase text-slate-100 tracking-wider mb-6">
                  Song Learning Tracker
                </h3>

                <div className="space-y-5">
                  {cohortSongs.length === 0 ? (
                    <div className="p-6 border border-dashed border-white/10 text-center text-xs text-slate-500 uppercase tracking-widest font-mono">
                      No songs assigned to this band.
                    </div>
                  ) : (
                    cohortSongs.map((song) => (
                      <div key={song.id} className="p-3 bg-[#121722]/45 border border-white/5 space-y-3 relative">
                        <button
                          onClick={() => handleDeleteSong(song.id)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-pink-400 text-[10px] font-bold"
                          title="Remove Song"
                        >
                          [X]
                        </button>
                        
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">{song.title}</h4>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">{song.artist}</p>
                        </div>

                        {/* Progress slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-violet-400">
                            <span>Progress:</span>
                            <span>{song.progress}%</span>
                          </div>
                          
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            disabled={updatingSongId === song.id}
                            value={song.progress}
                            onChange={(e) => handleUpdateProgress(song.id, parseInt(e.target.value))}
                            className="w-full accent-pink-500 cursor-pointer h-1 bg-slate-900 rounded-lg appearance-none"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Song Form */}
                <form onSubmit={handleAddSong} className="mt-6 pt-5 border-t border-white/5 space-y-3">
                  <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block">
                    Add Song to Setlist
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Song Title"
                      required
                      value={newSongTitle}
                      onChange={(e) => setNewSongTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
                    />
                    <input 
                      type="text" 
                      placeholder="Artist"
                      required
                      value={newSongArtist}
                      onChange={(e) => setNewSongArtist(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 px-2 py-1.5 text-xs text-[#f1ecff] focus:outline-none focus:border-violet-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingSong}
                    className="w-full py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-[#f1ecff] text-[9px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
                  >
                    {isAddingSong ? 'Adding...' : 'Add Song'}
                  </button>
                </form>
              </div>

            </div>

          </div>

          {/* Reschedule 1-on-1 Lessons HUD */}
          <div className="stitch-card p-6 md:p-8">
            <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block mb-1">One-on-One Lessons</span>
            <h2 className="text-2xl font-heading font-black uppercase text-slate-100 tracking-wider mb-2">
              Private Lesson Schedule Coordinator
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-6">
              Reschedule individual student 1-on-1 virtual sessions. Updates write to email dispatcher logs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.length === 0 ? (
                <div className="md:col-span-2 p-12 border border-dashed border-white/10 text-center text-xs text-slate-500 uppercase tracking-widest font-mono">
                  No private lessons scheduled for active students.
                </div>
              ) : (
                lessons.map((lesson) => {
                  const currentDateTimeLocal = lesson.scheduledAt 
                    ? new Date(new Date(lesson.scheduledAt).getTime() - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                    : '';
                  
                  return (
                    <div key={lesson.id} className="p-4 bg-[#121722]/45 border border-white/5 space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-sans font-black text-sm uppercase text-slate-200">{lesson.studentName}</h4>
                          <p className="text-slate-500 text-[10px] uppercase mt-0.5">Instructor: {lesson.instructorName}</p>
                          <p className="text-slate-400 text-[10px] uppercase mt-1">
                            Current: {new Date(lesson.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-[8px] px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 uppercase tracking-widest font-extrabold shrink-0">
                          {lesson.type}
                        </span>
                      </div>

                      {/* Reschedule input controls */}
                      <div className="flex gap-2 items-center border-t border-white/5 pt-3">
                        <input 
                          type="datetime-local" 
                          value={rescheduleTimes[lesson.id] || currentDateTimeLocal}
                          onChange={(e) => setRescheduleTimes(prev => ({ ...prev, [lesson.id]: e.target.value }))}
                          className="bg-slate-950 border border-white/10 px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-violet-400 flex-1"
                        />
                        <button
                          onClick={() => handleRescheduleLesson(lesson.id)}
                          disabled={reschedulingId === lesson.id}
                          className="py-1.5 px-3 bg-violet-600 hover:bg-violet-700 text-white font-sans text-[9px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {reschedulingId === lesson.id ? 'Saving...' : 'Reschedule'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-16 border border-dashed border-white/10 text-center bg-[#121722]/10 stitch-card">
          <i className="fa-solid fa-triangle-exclamation text-pink-500 text-3xl mb-4"></i>
          <p className="text-sm font-heading font-black uppercase text-slate-200">No Band Cohort Configured</p>
          <p className="text-xs text-slate-400 uppercase tracking-widest max-w-sm mx-auto mt-2 leading-relaxed">
            There is no matching cohort for {selectedHubCity} Hub and selected program group in the database.
          </p>
        </div>
      )}

    </div>
  );
}
