'use client';

import React, { useState, useEffect } from 'react';
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
  scheduledAt: string;
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

export interface CRMLeadData {
  id: string;
  hubId: string;
  status: 'INQUIRY_RECEIVED' | 'TRIAL_SCHEDULED' | 'TRIED_NOT_ENROLLED' | 'CONVERTED_ACTIVE' | 'WAITLISTED';
  parentName: string;
  studentName: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  communications: {
    id: string;
    type: string;
    agentStaffId: string;
    summary: string;
    timestamp: string;
  }[];
}

interface AdminDashboardClientProps {
  initialStudents: StudentData[];
  initialCohorts: CohortData[];
  initialLessons: LessonData[];
}

// Play sound using Web Audio API to alert outreach coordinators of new web leads
const playAlertSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Play a distinct two-tone alert chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    osc.start();
    
    setTimeout(() => {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    }, 120);
    
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, 280);
  } catch (err) {
    console.warn('[Web Audio Alert] Blocked or unsupported:', err);
  }
};

// SLA Countdown timer component
const SLATimer = ({ createdAt, status }: { createdAt: string; status: string }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status !== 'INQUIRY_RECEIVED') return;

    setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, status]);

  if (status !== 'INQUIRY_RECEIVED') {
    return <span className="text-slate-500 font-semibold text-xs">Closed</span>;
  }

  const remaining = Math.max(0, 120 - elapsed);
  const isExpired = remaining === 0;

  return (
    <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold tracking-wider uppercase ${
      isExpired 
        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }`}>
      {isExpired ? '🚨 SLA EXPIRED!' : `⏱️ SLA: ${remaining}s`}
    </span>
  );
};

export default function AdminDashboardClient({
  initialStudents,
  initialCohorts,
  initialLessons
}: AdminDashboardClientProps) {
  const [students, setStudents] = useState<StudentData[]>(initialStudents);
  const [cohorts, setCohorts] = useState<CohortData[]>(initialCohorts);
  const [lessons, setLessons] = useState<LessonData[]>(initialLessons);
  const [leads, setLeads] = useState<CRMLeadData[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // UI state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [pulseActive, setPulseActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; success: boolean } | null>(null);
  
  // Modals / Drawer selections
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [selectedLead, setSelectedLead] = useState<CRMLeadData | null>(null);
  const [logNoteText, setLogNoteText] = useState('');
  const [rescheduleData, setRescheduleData] = useState<{
    id: string;
    type: 'cohort' | 'lesson';
    name: string;
    currentSchedule: string;
    day?: string;
    slot?: string;
    dateTime?: string;
  } | null>(null);

  // Load backend events and CRM leads concurrently
  const fetchDashboardData = async () => {
    try {
      const [calRes, crmRes] = await Promise.all([
        fetch('/api/admin/calendar/master'),
        fetch('/api/admin/outreach')
      ]);
      
      const calData = await calRes.json();
      const crmData = await crmRes.json();
      
      if (calData.success) {
        setEvents(calData.events);
      }
      if (crmData.success) {
        setLeads(crmData.leads);
      }
    } catch (err) {
      console.warn('[Dashboard Client] Fetch error, defaulting to seeding fallbacks:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Setup EventSource for real-time web lead pushes
    const eventSource = new EventSource('/api/admin/outreach/sse');
    
    eventSource.addEventListener('new-lead', (e: MessageEvent) => {
      try {
        const lead = JSON.parse(e.data);
        playAlertSound();
        setLeads(prev => [lead, ...prev]);
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 6000);
      } catch (err) {
        console.error('[SSE Client] Error parsing incoming stream:', err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // Filter student list
  const filteredStudents = students
    .filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cohortName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, studentId: string) => {
    e.dataTransfer.setData('studentId', studentId);
  };

  const handleDropLessonSlot = async (e: React.DragEvent, instructorId: string, day: 'Tuesday' | 'Wednesday') => {
    e.preventDefault();
    const studentId = e.dataTransfer.getData('studentId');
    if (!studentId) return;

    setIsSubmitting(true);
    setApiMessage(null);

    // Tuesday is June 16, Wednesday is June 17, 2026
    const dateStr = day === 'Tuesday' ? '2026-06-16T15:00:00' : '2026-06-17T15:00:00';

    try {
      const response = await fetch('/api/admin/calendar/assign-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          instructorId,
          scheduledAt: dateStr
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setApiMessage({ text: data.message || 'Private Lesson scheduled successfully.', success: true });
        fetchDashboardData();
        setTimeout(() => setApiMessage(null), 3000);
      } else {
        // Validation conflict / cap check errors
        setApiMessage({ text: data.error || 'Failed to assign lesson.', success: false });
      }
    } catch (err) {
      console.error(err);
      setApiMessage({ text: 'Network connection error.', success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reschedule submit handler
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleData) return;

    setIsSubmitting(true);
    setApiMessage(null);

    const payload = {
      type: rescheduleData.type,
      id: rescheduleData.id,
      newDay: rescheduleData.day,
      newSlot: rescheduleData.slot,
      newDateTime: rescheduleData.dateTime
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
        
        // Update local client states
        if (rescheduleData.type === 'cohort') {
          setCohorts(prev => prev.map(c => c.id === rescheduleData.id ? { 
            ...c, 
            scheduleDay: rescheduleData.day!, 
            scheduleSlot: rescheduleData.slot! 
          } : c));

          setStudents(prev => prev.map(s => s.cohortName === rescheduleData.name ? {
            ...s,
            scheduleDay: rescheduleData.day!,
            scheduleSlot: rescheduleData.slot!
          } : s));
        } else {
          setLessons(prev => prev.map(l => l.id === rescheduleData.id ? { 
            ...l, 
            scheduledAt: new Date(rescheduleData.dateTime!).toISOString() 
          } : l));
        }

        fetchDashboardData();

        setTimeout(() => {
          setRescheduleData(null);
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

  // Save CRM lead note handler
  const handleSaveLeadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !logNoteText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          action: 'LOG_NOTE',
          summary: logNoteText
        })
      });

      if (response.ok) {
        setLogNoteText('');
        fetchDashboardData();
        // Update selection reference to display note immediately
        const data = await response.json();
        if (data.log) {
          setSelectedLead(prev => prev ? {
            ...prev,
            notes: logNoteText,
            communications: [
              {
                id: data.log.id,
                type: data.log.type,
                agentStaffId: data.log.agentStaffId,
                summary: logNoteText,
                timestamp: new Date().toISOString()
              },
              ...prev.communications
            ]
          } : null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Schedule Trial Appointment Handler
  const handleScheduleTrial = async () => {
    if (!selectedLead) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          action: 'UPDATE_STATUS',
          status: 'TRIAL_SCHEDULED'
        })
      });

      if (response.ok) {
        fetchDashboardData();
        setSelectedLead(prev => prev ? { ...prev, status: 'TRIAL_SCHEDULED' } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper calendar mappings
  const getEventsForDay = (day: string) => {
    const list = events.filter(e => e.scheduleDay === day);
    // Sort cohorts/lessons chronologically
    return list.sort((a, b) => {
      const timeA = a.scheduledAt || '2026-06-16T16:00:00';
      const timeB = b.scheduledAt || '2026-06-16T16:00:00';
      return new Date(timeA).getTime() - new Date(timeB).getTime();
    });
  };

  const getTrialLeads = () => {
    return leads.filter(l => l.status === 'TRIAL_SCHEDULED');
  };

  // Check if a specific instructor has an active booking for a slot
  const getInstructorLesson = (instructorId: string, day: 'Tuesday' | 'Wednesday') => {
    return events.find(e => e.type === 'LESSON' && e.instructorId === instructorId && e.scheduleDay === day);
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Alert HUD for incoming web leads (Epic 8) */}
      {leads.some(l => l.status === 'INQUIRY_RECEIVED') && (
        <div className={`p-4 bg-rose-950/45 border border-rose-500/50 text-rose-200 flex items-center justify-between transition-all duration-300 ${pulseActive ? 'animate-pulse scale-102 border-rose-500 bg-rose-950/80' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-400">Campaign Alert HUD</span>
              <h4 className="text-sm font-bold mt-0.5">Incoming localized advertisement web lead captured!</h4>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={playAlertSound}
              className="px-3 py-1.5 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-extrabold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-volume-high"></i> Replay Chime
            </button>
            <span className="text-xs text-slate-400 font-semibold">Action window: Under 120s ideal</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-pink-500 glow-pulse-pink">Stage Control Telemetry</span>
          <h1 className="font-heading text-3xl md:text-5xl font-black mt-1 bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider glow-pulse-cyan">Stage Music Academy</h1>
          <p className="text-sm text-slate-400 mt-2">
            Secure client encryption stack enabled. Drag students to instructor slots to execute 1-on-1 private lesson assignments.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 border border-cyan-500/35 bg-[#120e24]/80 hover:bg-cyan-500/15 text-cyan-400 font-black text-xs transition-all tracking-wider uppercase cursor-pointer"
        >
          <i className="fa-solid fa-arrows-rotate mr-2"></i> Refresh Data
        </button>
      </div>

      {apiMessage && (
        <div className={`p-4 border text-sm font-bold flex items-center gap-3 transition-all ${
          apiMessage.success ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          <i className={`fa-solid ${apiMessage.success ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <span>{apiMessage.text}</span>
        </div>
      )}

      {/* Top Section: Master Calendar & Instructor Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Unified Master Calendar Layer (7 cols) (Epic 5) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card 
            title="Unified Master Calendar" 
            subtitle="Instructor Availability, Band Rehearsals, Private Lessons, & Masterclasses" 
            badge="Unified Layer" 
            badgeColor="indigo"
            className="cyber-card"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Tuesday Schedule */}
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/30 text-center font-black text-xs text-[#f1ecff] uppercase tracking-widest">
                  Tuesday Consolidated
                </div>
                <div className="flex flex-col gap-3 min-h-[300px]">
                  {getEventsForDay('Tuesday').map(e => {
                    const isCohort = e.type === 'COHORT';
                    const isLesson = e.type === 'LESSON';
                    const colorClass = isCohort 
                      ? 'border-l-4 border-l-emerald-500 bg-slate-950/40 hover:bg-slate-950/60' 
                      : isLesson 
                        ? 'border-l-4 border-l-violet-500 bg-slate-950/40 hover:bg-slate-950/60'
                        : 'border-l-4 border-l-amber-500 bg-slate-950/40 hover:bg-slate-950/60';
                    
                    const markerColor = isCohort ? 'bg-emerald-400' : isLesson ? 'bg-violet-400' : 'bg-amber-400';

                    return (
                      <div 
                        key={e.id}
                        className={`p-4 border border-white/5 transition-all ${colorClass}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 ${markerColor}`}></span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{e.type}</span>
                          </div>
                          <button 
                            onClick={() => setRescheduleData({
                              type: isCohort ? 'cohort' : 'lesson',
                              id: e.id,
                              name: e.title,
                              currentSchedule: e.scheduleSlot,
                              day: e.scheduleDay,
                              slot: isCohort ? e.scheduleSlot : undefined,
                              dateTime: isLesson ? e.scheduledAt : undefined
                            })}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold uppercase tracking-wider cursor-pointer"
                          >
                            Reschedule
                          </button>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-200 mt-1">{e.title}</h4>
                        <div className="text-xs text-slate-400 mt-1 flex justify-between">
                          <span>Time: {e.scheduleSlot}</span>
                          <span>Coach: {e.instructorName || 'Multiple'}</span>
                        </div>
                        {isCohort && (
                          <div className="mt-2 text-[10px] text-slate-500 flex justify-between border-t border-white/5 pt-2">
                            <span>Capacity: {e.studentCount}/{e.maxCap} Students</span>
                            <span>Standard Rehearsal</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {getEventsForDay('Tuesday').length === 0 && (
                    <div className="text-center py-12 text-slate-650 italic text-xs">No events scheduled.</div>
                  )}
                </div>
              </div>

              {/* Wednesday Schedule */}
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/30 text-center font-black text-xs text-[#f1ecff] uppercase tracking-widest">
                  Wednesday Consolidated
                </div>
                <div className="flex flex-col gap-3 min-h-[300px]">
                  {getEventsForDay('Wednesday').map(e => {
                    const isCohort = e.type === 'COHORT';
                    const isLesson = e.type === 'LESSON';
                    const colorClass = isCohort 
                      ? 'border-l-4 border-l-emerald-500 bg-slate-950/40 hover:bg-slate-950/60' 
                      : isLesson 
                        ? 'border-l-4 border-l-violet-500 bg-slate-950/40 hover:bg-slate-950/60'
                        : 'border-l-4 border-l-amber-500 bg-slate-950/40 hover:bg-slate-950/60';

                    const markerColor = isCohort ? 'bg-emerald-400' : isLesson ? 'bg-violet-400' : 'bg-amber-400';

                    return (
                      <div 
                        key={e.id}
                        className={`p-4 border border-white/5 transition-all ${colorClass}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 ${markerColor}`}></span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{e.type}</span>
                          </div>
                          <button 
                            onClick={() => setRescheduleData({
                              type: isCohort ? 'cohort' : 'lesson',
                              id: e.id,
                              name: e.title,
                              currentSchedule: e.scheduleSlot,
                              day: e.scheduleDay,
                              slot: isCohort ? e.scheduleSlot : undefined,
                              dateTime: isLesson ? e.scheduledAt : undefined
                            })}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold uppercase tracking-wider cursor-pointer"
                          >
                            Reschedule
                          </button>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-200 mt-1">{e.title}</h4>
                        <div className="text-xs text-slate-400 mt-1 flex justify-between">
                          <span>Time: {e.scheduleSlot}</span>
                          <span>Coach: {e.instructorName || 'Multiple'}</span>
                        </div>
                        {isCohort && (
                          <div className="mt-2 text-[10px] text-slate-500 flex justify-between border-t border-white/5 pt-2">
                            <span>Capacity: {e.studentCount}/{e.maxCap} Students</span>
                            <span>Standard Rehearsal</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {getEventsForDay('Wednesday').length === 0 && (
                    <div className="text-center py-12 text-slate-655 italic text-xs">No events scheduled.</div>
                  )}
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* Drag-and-Drop Private Lesson Assignment matrix (4 cols) (Epic 5) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card 
            title="1-on-1 Assign Engine" 
            subtitle="Drag students onto open slots to schedule private lessons" 
            badge="Drag & Drop Matrix" 
            badgeColor="indigo"
            className="cyber-card"
          >
            <div className="flex flex-col gap-5 mt-4">
              
              {/* Instructor 1: Sarah Jenkins */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Prof. Sarah Jenkins</h4>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Tue Slot */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropLessonSlot(e, 'inst-sarah', 'Tuesday')}
                    className={`p-3 border text-left h-[90px] flex flex-col justify-between transition-all ${
                      getInstructorLesson('inst-sarah', 'Tuesday')
                        ? 'border-violet-500/35 bg-violet-950/20'
                        : 'cyber-btn-border'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Tuesday 3:00 PM</div>
                    {(() => {
                      const lesson = getInstructorLesson('inst-sarah', 'Tuesday');
                      return lesson ? (
                        <div className="truncate text-xs font-bold text-violet-300">{lesson.studentName}</div>
                      ) : (
                        <div className="text-[10px] text-slate-600 italic">Open (Drop Student)</div>
                      );
                    })()}
                  </div>

                  {/* Wed Slot */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropLessonSlot(e, 'inst-sarah', 'Wednesday')}
                    className={`p-3 border text-left h-[90px] flex flex-col justify-between transition-all ${
                      getInstructorLesson('inst-sarah', 'Wednesday')
                        ? 'border-violet-500/35 bg-violet-950/20'
                        : 'cyber-btn-border'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Wednesday 3:00 PM</div>
                    {(() => {
                      const lesson = getInstructorLesson('inst-sarah', 'Wednesday');
                      return lesson ? (
                        <div className="truncate text-xs font-bold text-violet-300">{lesson.studentName}</div>
                      ) : (
                        <div className="text-[10px] text-slate-600 italic">Open (Drop Student)</div>
                      );
                    })()}
                  </div>

                </div>
              </div>

              {/* Instructor 2: Mike Tyson */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Prof. Mike Tyson</h4>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Tue Slot */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropLessonSlot(e, 'inst-mike', 'Tuesday')}
                    className={`p-3 border text-left h-[90px] flex flex-col justify-between transition-all ${
                      getInstructorLesson('inst-mike', 'Tuesday')
                        ? 'border-violet-500/35 bg-violet-950/20'
                        : 'cyber-btn-border'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Tuesday 3:00 PM</div>
                    {(() => {
                      const lesson = getInstructorLesson('inst-mike', 'Tuesday');
                      return lesson ? (
                        <div className="truncate text-xs font-bold text-violet-300">{lesson.studentName}</div>
                      ) : (
                        <div className="text-[10px] text-slate-600 italic">Open (Drop Student)</div>
                      );
                    })()}
                  </div>

                  {/* Wed Slot */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropLessonSlot(e, 'inst-mike', 'Wednesday')}
                    className={`p-3 border text-left h-[90px] flex flex-col justify-between transition-all ${
                      getInstructorLesson('inst-mike', 'Wednesday')
                        ? 'border-violet-500/35 bg-violet-950/20'
                        : 'cyber-btn-border'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Wednesday 3:00 PM</div>
                    {(() => {
                      const lesson = getInstructorLesson('inst-mike', 'Wednesday');
                      return lesson ? (
                        <div className="truncate text-xs font-bold text-violet-300">{lesson.studentName}</div>
                      ) : (
                        <div className="text-[10px] text-slate-600 italic">Open (Drop Student)</div>
                      );
                    })()}
                  </div>

                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>

      {/* Middle Section: CRM Outreach Queue & Student Roster */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* CRM Outreach Lead Queue (Epic 8) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card 
            title="CRM Outreach lead Queue" 
            subtitle="Ad campaign inbound leads requiring outreach response" 
            badge="120s SLA Funnel" 
            badgeColor="rose"
            className="cyber-card"
          >
            <div className="flex flex-col gap-3 mt-4">
              {leads.filter(l => l.status === 'INQUIRY_RECEIVED').map(lead => (
                <div 
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="p-4 border border-cyan-500/10 bg-[#120e24]/20 hover:border-pink-500/30 hover:bg-[#120e24]/40 transition-all cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-extrabold text-slate-100">{lead.studentName}</h4>
                      <span className="text-[10px] text-slate-500">Parent: {lead.parentName}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-[450px]">Notes: {lead.notes}</p>
                    <div className="text-[10px] text-slate-500 mt-2 flex gap-4">
                      <span>Phone: {lead.phone}</span>
                      <span>Received: {new Date(lead.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <SLATimer createdAt={lead.createdAt} status={lead.status} />
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase hover:underline">Log Note & Assign</span>
                  </div>
                </div>
              ))}
              {leads.filter(l => l.status === 'INQUIRY_RECEIVED').length === 0 && (
                <div className="text-center py-12 text-slate-600 italic text-xs border border-dashed border-cyan-500/15">
                  All outreach pipeline inquiries handled. Roster conversions complete.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Draggable Student Roster (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card 
            title="Draggable Student Roster" 
            subtitle="Drag student block onto matrix cell to book lesson" 
            badge={`${filteredStudents.length} Students`} 
            badgeColor="emerald"
            className="cyber-card"
          >
            {/* Search filter input */}
            <div className="relative mt-2 mb-4">
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, instrument, band..."
                className="w-full pl-9 pr-4 py-2.5 bg-black/50 border border-cyan-500/20 text-slate-200 placeholder-slate-650 text-xs focus:border-pink-500 focus:outline-none"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-600 text-[10px]"></i>
            </div>

            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {filteredStudents.map(student => (
                <div 
                  key={student.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, student.id)}
                  onClick={() => setSelectedStudent(student)}
                  className="p-3 border border-cyan-500/10 bg-[#120e24]/40 hover:border-pink-500/25 hover:bg-[#120e24]/60 cursor-grab active:cursor-grabbing transition-all flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{student.name}</h4>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{student.instrument} • Age {student.age}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                    <i className="fa-solid fa-grip-vertical mr-1"></i> Drag
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Bottom Section: In-Person Trial Scheduler Console (FR-3.2) */}
      <Card 
        title="In-Person Trial Scheduling Console" 
        subtitle="Physical trial appointments tracking ledger" 
        badge="Trial Schedule Console" 
        badgeColor="emerald"
        className="cyber-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {getTrialLeads().map(lead => (
            <div 
              key={lead.id}
              className="p-4 border border-emerald-500/25 bg-[#120e24]/30 text-left flex flex-col justify-between h-[150px]"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                    Trial Confirmed
                  </span>
                  <span className="text-[10px] text-slate-550">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-100 mt-2">{lead.studentName}</h4>
                <p className="text-xs text-slate-400 mt-1 truncate">Parent: {lead.parentName}</p>
                <p className="text-[10px] text-slate-500 mt-1">Phone: {lead.phone}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(lead)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold uppercase tracking-wider text-right cursor-pointer"
              >
                Log Response Note
              </button>
            </div>
          ))}
          {getTrialLeads().length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-600 italic text-xs border border-dashed border-cyan-500/15">
              No physical trials scheduled.
            </div>
          )}
        </div>
      </Card>

      {/* CRM Log Note Drawer & Trial Scheduler Modal (FR-3.3) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 border border-cyan-500/25 bg-[#0b0813] shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
            
            <div className="flex justify-between items-start border-b border-cyan-500/10 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-wider glow-pulse-pink">Outreach & Communications Log</span>
                <h3 className="font-heading text-xl font-bold text-[#f1ecff] mt-0.5">{selectedLead.studentName}</h3>
                <span className="text-[10px] text-slate-400 block mt-1">Status: {selectedLead.status.replace(/_/g, ' ')}</span>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-1 px-3 border border-cyan-500/30 hover:bg-cyan-500/15 text-cyan-400 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Log History */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-[#f1ecff] uppercase tracking-wider">Interaction History</h4>
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  <div className="p-3 bg-black/40 border border-cyan-500/10 text-xs text-slate-350">
                    <span className="font-black text-[9px] text-pink-500 block mb-1">INBOUND INQUIRY</span>
                    {selectedLead.notes}
                  </div>
                  {selectedLead.communications.map(c => (
                    <div key={c.id} className="p-3 bg-black/40 border border-cyan-500/10 text-xs text-slate-350">
                      <div className="flex justify-between text-[9px] text-slate-500 font-bold mb-1">
                        <span>{c.type}</span>
                        <span>{new Date(c.timestamp).toLocaleTimeString()}</span>
                      </div>
                      {c.summary}
                    </div>
                  ))}
                </div>
              </div>

              {/* Log Note Actions Form */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-black text-[#f1ecff] uppercase tracking-wider">Outreach Response</h4>
                <form onSubmit={handleSaveLeadNote} className="flex flex-col gap-3">
                  <textarea
                    value={logNoteText}
                    onChange={e => setLogNoteText(e.target.value)}
                    required
                    placeholder="Log customer responses, objections, scheduling callbacks..."
                    rows={4}
                    className="w-full p-3 bg-black/50 border border-cyan-500/20 text-slate-200 placeholder-slate-650 text-xs focus:border-pink-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 cyber-btn-pink text-white font-bold text-xs shadow-lg cursor-pointer"
                    >
                      {isSubmitting ? 'Saving...' : 'Log Note'}
                    </button>
                    {selectedLead.status !== 'TRIAL_SCHEDULED' && (
                      <button
                        type="button"
                        onClick={handleScheduleTrial}
                        disabled={isSubmitting}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
                      >
                        Schedule Trial
                      </button>
                    )}
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Reschedule Overlay Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 border border-cyan-500/25 bg-[#0b0813] shadow-2xl relative animate-fade-in font-sans">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
            
            <h3 className="font-heading text-lg font-bold text-[#f1ecff] mb-1">
              Reschedule Event
            </h3>
            <p className="text-xs text-slate-400 mb-4 truncate">
              Target: {rescheduleData.name}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="flex flex-col gap-4">
              <div className="p-3 bg-black/40 border border-cyan-500/10 text-xs text-slate-400">
                <span className="font-bold block text-slate-300 mb-0.5">Current Slot:</span>
                {rescheduleData.currentSchedule}
              </div>

              {rescheduleData.type === 'cohort' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Target Rehearsal Day</label>
                    <select 
                      value={rescheduleData.day}
                      onChange={e => setRescheduleData(prev => ({ ...prev!, day: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/55 border border-cyan-500/20 text-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    >
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Target Time Slot</label>
                    <select 
                      value={rescheduleData.slot}
                      onChange={e => setRescheduleData(prev => ({ ...prev!, slot: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/55 border border-cyan-500/20 text-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    >
                      <option value="4:00 PM - 5:30 PM">4:00 PM - 5:30 PM</option>
                      <option value="5:30 PM - 7:00 PM">5:30 PM - 7:00 PM</option>
                      <option value="7:00 PM - 8:30 PM">7:00 PM - 8:30 PM</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Target Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={rescheduleData.dateTime ? rescheduleData.dateTime.slice(0, 16) : ''}
                    onChange={e => setRescheduleData(prev => ({ ...prev!, dateTime: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 bg-black/55 border border-cyan-500/20 text-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 cyber-btn-pink text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Reschedule'}
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleData(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 cyber-btn-cyan text-cyan-400 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Card Popup Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 border border-cyan-500/25 bg-[#0b0813] shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
            
            <div className="flex justify-between items-start border-b border-cyan-500/10 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-wider glow-pulse-pink">Candidate Profile</span>
                <h3 className="font-heading text-xl font-bold text-[#f1ecff] mt-0.5">{selectedStudent.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 px-3 border border-cyan-500/30 hover:bg-cyan-500/15 text-cyan-400 font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs text-slate-300">
              <p><strong className="text-slate-400">Email:</strong> {selectedStudent.email}</p>
              <p><strong className="text-slate-400">Age:</strong> {selectedStudent.age}</p>
              <p><strong className="text-slate-400">Instrument:</strong> {selectedStudent.instrument}</p>
              <p><strong className="text-slate-400">Band Assignment:</strong> {selectedStudent.cohortName}</p>
              <p><strong className="text-slate-400">Weekly Schedule Slot:</strong> {selectedStudent.scheduleDay}s at {selectedStudent.scheduleSlot}</p>
              <p><strong className="text-slate-400">Director Coach:</strong> Prof. {selectedStudent.directorName}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
