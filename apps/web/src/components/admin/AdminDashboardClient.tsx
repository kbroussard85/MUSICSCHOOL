'use client';

import React, { useState } from 'react';
import { Card } from '@harmony/ui';

export interface StudentData {
  id: string;
  name: string;
  email: string;
  age: number;
  instrument: string;
  cohortName: string;
  scheduleDay: string;
  scheduleSlot: string;
  directorName: string;
  directorEmail: string;
}

export interface LessonData {
  id: string;
  studentName: string;
  studentEmail: string;
  instructorName: string;
  instructorEmail: string;
  scheduledAt: string; // ISO date string
  type: string;
  status: string;
}

export interface CohortData {
  id: string;
  name: string;
  scheduleDay: string;
  scheduleSlot: string;
  directorName: string;
  directorEmail: string;
}

interface AdminDashboardClientProps {
  initialStudents: StudentData[];
  initialCohorts: CohortData[];
  initialLessons: LessonData[];
}

const cohortImages: Record<string, string> = {
  'Thornton Rockers': '/band_rockers.png',
  'Westminster Teens': '/band_teens.png',
  'Adult Ensemble': '/band_adults.png',
  'Broomfield Juniors': '/band_juniors.png',
  'Thornton Teens II': '/band_teens.png',
  'Adult Blues Hub': '/band_adults.png',
};

const getCohortImage = (name: string) => {
  return cohortImages[name] || '/band_rockers.png';
};

export default function AdminDashboardClient({
  initialStudents,
  initialCohorts,
  initialLessons
}: AdminDashboardClientProps) {
  const [students, setStudents] = useState<StudentData[]>(initialStudents);
  const [cohorts, setCohorts] = useState<CohortData[]>(initialCohorts);
  const [lessons, setLessons] = useState<LessonData[]>(initialLessons);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<{
    type: 'cohort' | 'lesson';
    id: string;
    name: string;
    currentSchedule: string;
    day?: string;
    slot?: string;
    dateTime?: string;
  } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Filter students by search query (sorted alphabetically by name)
  const filteredStudents = students
    .filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cohortName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Time Slots for weekly grid
  const cohortSlots = ['4:00 PM - 5:30 PM', '5:30 PM - 7:00 PM', '7:00 PM - 8:30 PM'];
  const lessonSlots = ['3:00 PM - 4:00 PM']; // Private lessons are scheduled before band rehearsals

  // Reschedule Form handler
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setIsSubmitting(true);
    setApiMessage(null);

    const payload = {
      type: editingEvent.type,
      id: editingEvent.id,
      newDay: editingEvent.day,
      newSlot: editingEvent.slot,
      newDateTime: editingEvent.dateTime
    };

    try {
      const response = await fetch('/api/admin/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setApiMessage({ text: data.message || 'Successfully rescheduled.', success: true });
        
        // Update local state to reflect change immediately
        if (editingEvent.type === 'cohort') {
          setCohorts(prev => prev.map(c => c.id === editingEvent.id ? { 
            ...c, 
            scheduleDay: editingEvent.day!, 
            scheduleSlot: editingEvent.slot! 
          } : c));

          setStudents(prev => prev.map(s => s.cohortName === editingEvent.name ? {
            ...s,
            scheduleDay: editingEvent.day!,
            scheduleSlot: editingEvent.slot!
          } : s));
        } else {
          setLessons(prev => prev.map(l => l.id === editingEvent.id ? { 
            ...l, 
            scheduledAt: new Date(editingEvent.dateTime!).toISOString() 
          } : l));
        }

        setTimeout(() => {
          setEditingEvent(null);
          setApiMessage(null);
        }, 1500);

      } else {
        setApiMessage({ text: data.error || 'Failed to reschedule.', success: false });
      }
    } catch (err) {
      console.error(err);
      setApiMessage({ text: 'Network connection error.', success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to match events for Calendar Grid rendering
  const getCohortForGrid = (day: string, slot: string) => {
    return cohorts.find(c => c.scheduleDay === day && c.scheduleSlot === slot);
  };

  const getLessonsForGrid = (day: string) => {
    return lessons.filter(l => {
      const d = new Date(l.scheduledAt);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      return dayName === day;
    });
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Administration Control Portal</span>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold mt-1 text-slate-100">Hub Master Dashboard</h1>
        <p className="text-sm text-slate-400 mt-2">
          Monitor enrolled students, manage cohort slots, and reschedule lessons. Updates trigger email dispatches.
        </p>
      </div>

      {/* Grid: Calendar & Student List */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left column (7 cols): Master Calendar Editor */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <Card title="Master Rehearsal Calendar" subtitle="Interactive calendar slot manager" badge="Tue/Wed Only" badgeColor="indigo">
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              
              {/* Tuesday Column */}
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/25 rounded-xl font-bold text-violet-400">
                  Tuesday Slot Allocations
                </div>

                 {/* Lesson Slots (3:00 - 4:00 PM) */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 text-left min-h-[100px]">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Private Lesson Block (3:00 - 4:00)</div>
                  <div className="flex flex-col gap-2">
                    {getLessonsForGrid('Tuesday').map(l => (
                      <div 
                        key={l.id} 
                        className="p-2.5 rounded-lg bg-slate-800/60 border border-white/5 flex flex-col justify-between transition-all duration-200"
                        style={{
                          backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.8), rgba(11, 14, 20, 0.85)), url('/lesson_private.png')`,
                          backgroundAttachment: 'fixed',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="text-xs font-bold text-slate-200">{l.studentName}</div>
                        <div className="text-[10px] text-slate-400">Instructor: {l.instructorName}</div>
                        <button 
                          onClick={() => setEditingEvent({
                            type: 'lesson',
                            id: l.id,
                            name: `Private Lesson for ${l.studentName}`,
                            currentSchedule: new Date(l.scheduledAt).toLocaleString(),
                            dateTime: l.scheduledAt
                          })}
                          className="mt-2 text-[10px] text-violet-400 hover:text-violet-300 font-semibold text-right"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1"></i> Reschedule
                        </button>
                      </div>
                    ))}
                    {getLessonsForGrid('Tuesday').length === 0 && (
                      <div className="text-xs text-slate-600 italic">No scheduled lessons</div>
                    )}
                  </div>
                </div>

                {/* Cohort Slots */}
                {cohortSlots.map(slot => {
                  const cohort = getCohortForGrid('Tuesday', slot);
                  return (
                    <div 
                      key={slot} 
                      onClick={cohort ? () => setEditingEvent({
                        type: 'cohort',
                        id: cohort.id,
                        name: cohort.name,
                        currentSchedule: `Tuesday @ ${slot}`,
                        day: 'Tuesday',
                        slot: slot
                      }) : undefined}
                      className={`p-4 rounded-xl border border-white/5 bg-slate-900/40 text-left h-[130px] flex flex-col justify-between transition-all duration-200 ${
                        cohort ? 'cursor-pointer hover:border-violet-500/30 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-violet-950/10' : ''
                      }`}
                      style={cohort ? {
                        backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.8), rgba(11, 14, 20, 0.85)), url(${getCohortImage(cohort.name)})`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">{slot}</div>
                        {cohort ? (
                          <>
                            <h4 className="text-sm font-bold text-slate-200 mt-1">{cohort.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Director: Prof. {cohort.directorName}</p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-600 italic mt-2">Vacant Slot</p>
                        )}
                      </div>
                      {cohort && (
                        <div className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold text-right flex items-center justify-end gap-1">
                          <i className="fa-solid fa-users text-[9px]"></i> View Roster & Edit
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Wednesday Column */}
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/25 rounded-xl font-bold text-violet-400">
                  Wednesday Slot Allocations
                </div>

                {/* Lesson Slots (3:00 - 4:00 PM) */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 text-left min-h-[100px]">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Private Lesson Block (3:00 - 4:00)</div>
                  <div className="flex flex-col gap-2">
                    {getLessonsForGrid('Wednesday').map(l => (
                      <div 
                        key={l.id} 
                        className="p-2.5 rounded-lg bg-slate-800/60 border border-white/5 flex flex-col justify-between transition-all duration-200"
                        style={{
                          backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.8), rgba(11, 14, 20, 0.85)), url('/lesson_private.png')`,
                          backgroundAttachment: 'fixed',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="text-xs font-bold text-slate-200">{l.studentName}</div>
                        <div className="text-[10px] text-slate-400">Instructor: {l.instructorName}</div>
                        <button 
                          onClick={() => setEditingEvent({
                            type: 'lesson',
                            id: l.id,
                            name: `Private Lesson for ${l.studentName}`,
                            currentSchedule: new Date(l.scheduledAt).toLocaleString(),
                            dateTime: l.scheduledAt
                          })}
                          className="mt-2 text-[10px] text-violet-400 hover:text-violet-300 font-semibold text-right"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1"></i> Reschedule
                        </button>
                      </div>
                    ))}
                    {getLessonsForGrid('Wednesday').length === 0 && (
                      <div className="text-xs text-slate-600 italic">No scheduled lessons</div>
                    )}
                  </div>
                </div>

                {/* Cohort Slots */}
                {cohortSlots.map(slot => {
                  const cohort = getCohortForGrid('Wednesday', slot);
                  return (
                    <div 
                      key={slot} 
                      onClick={cohort ? () => setEditingEvent({
                        type: 'cohort',
                        id: cohort.id,
                        name: cohort.name,
                        currentSchedule: `Wednesday @ ${slot}`,
                        day: 'Wednesday',
                        slot: slot
                      }) : undefined}
                      className={`p-4 rounded-xl border border-white/5 bg-slate-900/40 text-left h-[130px] flex flex-col justify-between transition-all duration-200 ${
                        cohort ? 'cursor-pointer hover:border-violet-500/30 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-violet-950/10' : ''
                      }`}
                      style={cohort ? {
                        backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.8), rgba(11, 14, 20, 0.85)), url(${getCohortImage(cohort.name)})`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">{slot}</div>
                        {cohort ? (
                          <>
                            <h4 className="text-sm font-bold text-slate-200 mt-1">{cohort.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Director: Prof. {cohort.directorName}</p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-600 italic mt-2">Vacant Slot</p>
                        )}
                      </div>
                      {cohort && (
                        <div className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold text-right flex items-center justify-end gap-1">
                          <i className="fa-solid fa-users text-[9px]"></i> View Roster & Edit
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </Card>
        </div>

        {/* Right column (5 cols): Alphabetical Student Roster */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <Card title="Student Roster" subtitle="All registered active candidates" badge={`${filteredStudents.length} Students`} badgeColor="emerald">
            
            {/* Search filter input */}
            <div className="relative mt-3 mb-4">
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, instrument, band..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:border-violet-500 focus:bg-black/55 focus:outline-none transition-all"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-600 text-xs"></i>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredStudents.map(student => (
                <div 
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="p-4 rounded-xl border border-white/5 bg-slate-900/30 hover:border-violet-500/20 hover:bg-slate-900/50 transition-all flex flex-col gap-1.5 duration-200 cursor-pointer"
                  style={{
                    backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.82), rgba(11, 14, 20, 0.88)), url(${getCohortImage(student.cohortName)})`,
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-100">{student.name}</h4>
                    <span className="text-[10px] text-slate-500">Age: {student.age}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-violet-400 font-semibold"><i className="fa-solid fa-guitar mr-1.5"></i> {student.instrument}</span>
                    <span className="text-slate-400 truncate max-w-[150px]"><i className="fa-solid fa-users mr-1.5 text-slate-500"></i> {student.cohortName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2 flex justify-between mt-1">
                    <span>Schedule: {student.scheduleDay}s</span>
                    <span>{student.scheduleSlot}</span>
                  </div>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-slate-600 text-xs italic">
                  No matching student records found.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Reschedule Overlay Modal */}
      {editingEvent && (() => {
        const cohortStudents = editingEvent.type === 'cohort'
          ? students
              .filter(s => s.cohortName === editingEvent.name)
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 rounded-2xl border border-white/5 bg-[#0b0e14] shadow-2xl relative animate-fade-in font-sans">
              <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
                {editingEvent.type === 'cohort' ? 'Cohort Roster & Reschedule' : 'Reschedule Event'}
              </h3>
              <p className="text-xs text-slate-400 mb-4 truncate">
                Target: {editingEvent.name}
              </p>

              {editingEvent.type === 'cohort' && (
                <div className="mb-4 p-4 rounded-xl border border-white/5 bg-slate-900/40">
                  <div className="flex justify-between items-center text-xs font-semibold text-violet-400 mb-2 border-b border-white/5 pb-1.5">
                    <span>Enrolled Cohort Members</span>
                    <span>{cohortStudents.length} Students</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {cohortStudents.map(student => (
                      <div key={student.id} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-b-0">
                        <div>
                          <span className="font-bold text-slate-200">{student.name}</span>
                          <span className="text-[10px] text-slate-400 block">{student.instrument}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Age: {student.age}</span>
                      </div>
                    ))}
                    {cohortStudents.length === 0 && (
                      <div className="text-xs text-slate-500 italic py-1">No students enrolled.</div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleRescheduleSubmit} className="flex flex-col gap-4">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400">
                <span className="font-bold block text-slate-300 mb-0.5">Current Slot:</span>
                {editingEvent.currentSchedule}
              </div>

              {editingEvent.type === 'cohort' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Target Rehearsal Day</label>
                    <select 
                      value={editingEvent.day}
                      onChange={e => setEditingEvent(prev => ({ ...prev!, day: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/30 border border-white/5 rounded-xl text-slate-200 text-sm focus:border-violet-500 focus:outline-none transition-all"
                    >
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Target Time Slot</label>
                    <select 
                      value={editingEvent.slot}
                      onChange={e => setEditingEvent(prev => ({ ...prev!, slot: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/30 border border-white/5 rounded-xl text-slate-200 text-sm focus:border-violet-500 focus:outline-none transition-all"
                    >
                      {cohortSlots.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Target Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={editingEvent.dateTime ? editingEvent.dateTime.slice(0, 16) : ''}
                    onChange={e => setEditingEvent(prev => ({ ...prev!, dateTime: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/5 rounded-xl text-slate-200 text-sm focus:border-violet-500 focus:outline-none transition-all"
                  />
                </div>
              )}

              {apiMessage && (
                <div className={`p-3 rounded-lg text-xs font-semibold ${
                  apiMessage.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {apiMessage.text}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-750 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/10 transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Reschedule'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border border-white/10 hover:bg-white/5 text-slate-400 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    })()}

      {/* Student Calendar View Modal */}
      {selectedStudent && (() => {
        const studentLessons = lessons.filter(l => l.studentEmail === selectedStudent.email);
        
        // Helper to check if a specific day and slot has an event for this student
        const getStudentEventForSlot = (day: string, slot: string) => {
          // Check if cohort rehearsal matches
          const studentCohort = cohorts.find(c => c.name === selectedStudent.cohortName);
          if (studentCohort && studentCohort.scheduleDay === day && studentCohort.scheduleSlot === slot) {
            return {
              type: 'cohort',
              name: studentCohort.name,
              detail: `Director: Prof. ${studentCohort.directorName}`,
              color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            };
          }
          return null;
        };

        // Check if there is a private lesson on a specific day
        const getStudentLessonForDay = (day: string) => {
          const lesson = studentLessons.find(l => {
            const d = new Date(l.scheduledAt);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
            return dayName === day;
          });
          if (lesson) {
            const timeStr = new Date(lesson.scheduledAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });
            return {
              type: 'lesson',
              name: `Private Lesson w/ ${lesson.instructorName}`,
              detail: `Time: ${timeStr} (${lesson.status})`,
              color: 'bg-violet-500/10 border-violet-500/30 text-violet-400'
            };
          }
          return null;
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div 
              className="w-full max-w-2xl p-6 border border-white/5 bg-[#0b0e14] shadow-2xl relative animate-fade-in font-sans"
              style={{
                backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.85), rgba(11, 14, 20, 0.92)), url(${getCohortImage(selectedStudent.cohortName)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Candidate Profile & Schedule</span>
                  <h3 className="font-heading text-2xl font-bold text-slate-100 mt-0.5">{selectedStudent.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1.5">
                    <span><i className="fa-solid fa-envelope mr-1.5 text-slate-500"></i>{selectedStudent.email}</span>
                    <span><i className="fa-solid fa-child mr-1.5 text-slate-500"></i>Age {selectedStudent.age}</span>
                    <span><i className="fa-solid fa-guitar mr-1.5 text-slate-500"></i>{selectedStudent.instrument}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 px-3 border border-white/10 hover:bg-white/5 text-slate-400 transition-all font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Weekly Schedule Grid */}
              <div className="grid grid-cols-2 gap-4">
                {['Tuesday', 'Wednesday'].map(day => {
                  const lesson = getStudentLessonForDay(day);

                  return (
                    <div key={day} className="flex flex-col gap-3">
                      <div className="p-2.5 bg-white/5 border border-white/5 font-bold text-xs text-slate-300 text-center uppercase tracking-wider">
                        {day} Schedule
                      </div>

                      {/* Private Lesson Block */}
                      <div className="p-3 border border-white/5 bg-slate-900/40 min-h-[72px] flex flex-col justify-center">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold mb-1">Private Lesson Slot (3:00 - 4:00)</div>
                        {lesson ? (
                          <div className={`p-2 border ${lesson.color} text-xs`}>
                            <div className="font-bold">{lesson.name}</div>
                            <div className="text-[10px] opacity-80 mt-0.5">{lesson.detail}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-600 italic">No lesson scheduled</div>
                        )}
                      </div>

                      {/* Cohort Slots */}
                      <div className="flex flex-col gap-2">
                        {cohortSlots.map(slot => {
                          const event = getStudentEventForSlot(day, slot);
                          return (
                            <div key={slot} className="p-3 border border-white/5 bg-slate-900/40 min-h-[72px] flex flex-col justify-center">
                              <div className="text-[9px] text-slate-500 uppercase font-semibold mb-1">{slot}</div>
                              {event ? (
                                <div className={`p-2 border ${event.color} text-xs`}>
                                  <div className="font-bold">{event.name} Rehearsal</div>
                                  <div className="text-[10px] opacity-80 mt-0.5">{event.detail}</div>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-600 italic">Unassigned / Free</div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom bar */}
              <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                <span>Band Cohort: {selectedStudent.cohortName}</span>
                <span>Instructor: {selectedStudent.directorName}</span>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
