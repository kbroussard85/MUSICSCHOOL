'use client';

import React, { useState } from 'react';

interface Slot {
  id: string;
  day: 'Tuesday' | 'Wednesday';
  time: string;
  cohortName: string;
  ageGroup: '9-12' | '13-17' | '18+';
  currentStudents: number;
  maxStudents: number;
  director: string;
}

export default function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([
    { id: '1', day: 'Tuesday', time: '4:00 PM - 5:30 PM', cohortName: 'Thornton Rockers', ageGroup: '9-12', currentStudents: 8, maxStudents: 10, director: 'Sarah Jenkins' },
    { id: '2', day: 'Tuesday', time: '5:30 PM - 7:00 PM', cohortName: 'Westminster Teens', ageGroup: '13-17', currentStudents: 10, maxStudents: 10, director: 'Sarah Jenkins' }, // Capped
    { id: '3', day: 'Tuesday', time: '7:00 PM - 8:30 PM', cohortName: 'Adult Ensemble', ageGroup: '18+', currentStudents: 5, maxStudents: 10, director: 'Sarah Jenkins' },
    { id: '4', day: 'Wednesday', time: '4:00 PM - 5:30 PM', cohortName: 'Broomfield Juniors', ageGroup: '9-12', currentStudents: 4, maxStudents: 10, director: 'Mike Tyson' },
    { id: '5', day: 'Wednesday', time: '5:30 PM - 7:00 PM', cohortName: 'Thornton Teens II', ageGroup: '13-17', currentStudents: 9, maxStudents: 10, director: 'Mike Tyson' },
    { id: '6', day: 'Wednesday', time: '7:00 PM - 8:30 PM', cohortName: 'Adult Blues Hub', ageGroup: '18+', currentStudents: 10, maxStudents: 10, director: 'Mike Tyson' } // Capped
  ]);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEnroll = (slotId: string) => {
    const slotIndex = slots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) return;

    const slot = slots[slotIndex];
    if (slot.currentStudents >= slot.maxStudents) {
      alert('This slot cohort is fully capped at 10 students. Redirecting to waitlist...');
      return;
    }

    // Update state to simulate student enrollment
    const updated = [...slots];
    updated[slotIndex].currentStudents += 1;
    setSlots(updated);
    setSelectedSlot(null);
    setSuccessMsg(`Successfully registered for the "${slot.cohortName}" cohort! Rehearsals schedule is ${slot.day}s @ ${slot.time}.`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Class Matrix</span>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold mt-1 text-slate-100">Rehearsal Roster Slots</h1>
        <p className="text-sm text-slate-400 mt-2">
          View available weekly cohort sessions. All schedules enforce a strict Tuesday/Wednesday operational window.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid of Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {slots.map((slot) => {
          const isFull = slot.currentStudents >= slot.maxStudents;
          const isSelectable = !isFull && selectedSlot !== slot.id;
          
          return (
            <div 
              key={slot.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between h-[280px] shadow-lg ${
                isFull 
                  ? 'border-white/5 bg-slate-900/25 opacity-60' 
                  : selectedSlot === slot.id 
                    ? 'border-violet-500 bg-violet-950/20 shadow-violet-500/5' 
                    : 'border-white/5 bg-slate-900/60 hover:border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
                    {slot.day}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isFull ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {isFull ? 'CAPPED' : `${slot.maxStudents - slot.currentStudents} SLOTS LEFT`}
                  </span>
                </div>
                
                <h3 className="font-heading text-xl font-bold text-slate-100">{slot.cohortName}</h3>
                <p className="text-xs text-slate-400 mt-1"><i className="fa-solid fa-clock mr-1 text-violet-400"></i> {slot.time}</p>
                <p className="text-xs text-slate-500 mt-2">Director: Prof. {slot.director}</p>
                <p className="text-xs text-slate-500 mt-1">Age group: {slot.ageGroup}</p>
              </div>

              <div className="mt-6">
                {/* Roster Progress Bar */}
                <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-semibold">
                  <span>Roster Capacity</span>
                  <span>{slot.currentStudents}/{slot.maxStudents} Students</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                  <div 
                    className={`h-full rounded-full transition-all ${isFull ? 'bg-rose-500' : 'bg-violet-400'}`}
                    style={{ width: `${(slot.currentStudents / slot.maxStudents) * 100}%` }}
                  />
                </div>

                {isFull ? (
                  <button 
                    onClick={() => alert('Adding to waiting list...')}
                    className="w-full py-2.5 border border-white/10 hover:border-slate-500/30 text-xs font-semibold rounded-xl transition-colors text-slate-400 hover:text-white"
                  >
                    Join Waitlist
                  </button>
                ) : selectedSlot === slot.id ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEnroll(slot.id)}
                      className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-600/10 transition-colors"
                    >
                      Confirm Slot
                    </button>
                    <button 
                      onClick={() => setSelectedSlot(null)}
                      className="px-3 py-2.5 border border-white/10 hover:bg-white/5 text-slate-400 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedSlot(slot.id)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-xl border border-white/5 transition-all hover:-translate-y-0.5"
                  >
                    Select Roster Slot
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
