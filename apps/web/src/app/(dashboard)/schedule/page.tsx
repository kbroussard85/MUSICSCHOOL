'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@harmony/ui';

interface CalendarEvent {
  id: string;
  type: 'COHORT' | 'LESSON' | 'MASTERCLASS';
  title: string;
  scheduleDay: string;
  scheduleSlot: string;
  instructorName: string;
  studentCount?: number;
  maxCap?: number;
  lessonType?: string;
  status?: string;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/admin/calendar/master');
        const data = await res.json();
        if (data.success) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error('[Schedule Page] Error fetching master calendar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    if (filterType === 'ALL') return true;
    return e.type === filterType;
  });

  const getEventsForDay = (day: string) => {
    return filteredEvents.filter(e => e.scheduleDay === day);
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-pink-500 glow-pulse-pink">Stage Control Telemetry</span>
          <h1 className="font-heading text-3xl md:text-5xl font-black mt-1 text-slate-100 uppercase tracking-wider">Master Calendar View</h1>
          <p className="text-sm text-slate-400 mt-2">
            Consolidated live timeline for Instructor schedules, Band Cohorts, and Masterclass clinics.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex gap-2">
          {['ALL', 'COHORT', 'LESSON', 'MASTERCLASS'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/20'
                  : 'border-cyan-500/15 bg-black/40 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
              }`}
            >
              {type === 'ALL' ? 'Show All' : type === 'COHORT' ? 'Rehearsals' : type === 'LESSON' ? 'Private' : 'Masterclasses'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">
          <i className="fa-solid fa-spinner fa-spin mr-2 text-cyan-400"></i> Loading master calendar schedule...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tuesday Matrix */}
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-[#0b0813] border border-cyan-500/20 text-center font-black text-xs text-cyan-400 uppercase tracking-widest">
              Tuesday Events
            </div>
            
            <div className="flex flex-col gap-4 min-h-[400px]">
              {getEventsForDay('Tuesday').map((event) => {
                const isCohort = event.type === 'COHORT';
                const isLesson = event.type === 'LESSON';
                const isMaster = event.type === 'MASTERCLASS';
                
                const typeLabel = isCohort ? 'Band Rehearsal' : isLesson ? 'Private Lesson' : 'Masterclass Clinic';
                const styleClass = isCohort
                  ? 'border-l-4 border-l-emerald-500'
                  : isLesson
                    ? 'border-l-4 border-l-pink-500'
                    : 'border-l-4 border-l-cyan-500';
                
                const badgeColor = isCohort 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : isLesson 
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' 
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';

                return (
                  <div key={event.id} className={`p-5 bg-[#0b0813]/85 border border-cyan-500/15 transition-all hover:border-cyan-500/35 hover:translate-x-1 ${styleClass}`}>
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${badgeColor}`}>
                        {typeLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{event.scheduleSlot}</span>
                    </div>

                    <h3 className="font-heading text-base font-extrabold text-slate-200 mt-2.5 uppercase tracking-wide">
                      {event.title}
                    </h3>
                    
                    <div className="mt-3 flex justify-between items-center text-xs border-t border-cyan-500/10 pt-3">
                      <span className="text-slate-400">
                        <i className="fa-solid fa-user-tie text-[10px] mr-1.5 text-slate-500"></i>
                        Coach: Prof. {event.instructorName}
                      </span>
                      {isCohort && (
                        <span className="text-[10px] text-slate-500">
                          Capacity: {event.studentCount || 0}/{event.maxCap || 10}
                        </span>
                      )}
                      {isMaster && (
                        <span className="text-[10px] text-slate-500">
                          Enrolled: {event.studentCount || 0}/{event.maxCap || 25}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {getEventsForDay('Tuesday').length === 0 && (
                <div className="text-center py-20 text-slate-500 italic text-xs border border-dashed border-cyan-500/10 bg-black/20">
                  No scheduled events found for this filter.
                </div>
              )}
            </div>
          </div>

          {/* Wednesday Matrix */}
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-[#0b0813] border border-cyan-500/20 text-center font-black text-xs text-cyan-400 uppercase tracking-widest">
              Wednesday Events
            </div>
            
            <div className="flex flex-col gap-4 min-h-[400px]">
              {getEventsForDay('Wednesday').map((event) => {
                const isCohort = event.type === 'COHORT';
                const isLesson = event.type === 'LESSON';
                const isMaster = event.type === 'MASTERCLASS';
                
                const typeLabel = isCohort ? 'Band Rehearsal' : isLesson ? 'Private Lesson' : 'Masterclass Clinic';
                const styleClass = isCohort
                  ? 'border-l-4 border-l-emerald-500'
                  : isLesson
                    ? 'border-l-4 border-l-pink-500'
                    : 'border-l-4 border-l-cyan-500';

                const badgeColor = isCohort 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : isLesson 
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' 
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';

                return (
                  <div key={event.id} className={`p-5 bg-[#0b0813]/85 border border-cyan-500/15 transition-all hover:border-cyan-500/35 hover:translate-x-1 ${styleClass}`}>
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${badgeColor}`}>
                        {typeLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{event.scheduleSlot}</span>
                    </div>

                    <h3 className="font-heading text-base font-extrabold text-slate-200 mt-2.5 uppercase tracking-wide">
                      {event.title}
                    </h3>
                    
                    <div className="mt-3 flex justify-between items-center text-xs border-t border-cyan-500/10 pt-3">
                      <span className="text-slate-400">
                        <i className="fa-solid fa-user-tie text-[10px] mr-1.5 text-slate-500"></i>
                        Coach: Prof. {event.instructorName}
                      </span>
                      {isCohort && (
                        <span className="text-[10px] text-slate-500">
                          Capacity: {event.studentCount || 0}/{event.maxCap || 10}
                        </span>
                      )}
                      {isMaster && (
                        <span className="text-[10px] text-slate-500">
                          Enrolled: {event.studentCount || 0}/{event.maxCap || 25}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {getEventsForDay('Wednesday').length === 0 && (
                <div className="text-center py-20 text-slate-500 italic text-xs border border-dashed border-cyan-500/10 bg-black/20">
                  No scheduled events found for this filter.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
