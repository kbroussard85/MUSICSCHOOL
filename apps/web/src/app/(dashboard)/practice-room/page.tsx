'use client';

import React from 'react';
import { AudioWorkspace } from '../../../components/jam/AudioWorkspace';

export default function PracticeRoomPage() {
  // Mock session data matching the logged-in student state
  const mockSession = {
    cohortId: 'cohort-thornton-piano-1',
    studentId: 'student-alex-broussard',
    userName: 'Alex Broussard',
    userRole: 'Lead Keyboardist'
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Collaborative Jam Space</span>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold mt-1 text-slate-100">Virtual Practice Room</h1>
        <p className="text-sm text-slate-400 mt-2">
          Online rehearsal is active. Standard browser audio channels are optimized for sub-25ms network propagation within a 500-mile geographic radius.
        </p>
      </div>

      {/* WebRTC Audio Grid Workspace */}
      <AudioWorkspace 
        cohortId={mockSession.cohortId}
        studentId={mockSession.studentId}
        userName={mockSession.userName}
        userRole={mockSession.userRole}
      />
    </div>
  );
}
