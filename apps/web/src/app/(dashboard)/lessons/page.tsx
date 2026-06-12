'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TabLine {
  measure: number;
  notes: string[];
  time: number; // Video time mark in seconds
}

export default function LessonsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Mock music tablature lines mapped to video playback times (in seconds)
  const mockTablature: TabLine[] = [
    { measure: 1, notes: ['E|---0---2---4---5---|', 'B|---0---2---4---5---|', 'G|---1---2---4---6---|', 'D|---2---2---4---7---|', 'A|---2---0---2---7---|', 'E|---0---x---x---5---|'], time: 0 },
    { measure: 2, notes: ['E|---7---7---9---11---|', 'B|---7---9--10---12---|', 'G|---8---9---9---11---|', 'D|---9---9--11---13---|', 'A|---9---7---0----x---|', 'E|---7---x---x----x---|'], time: 4 },
    { measure: 3, notes: ['E|--12--12--14--16---|', 'B|--12--14--14--17---|', 'G|--13--14--14--16---|', 'D|--14--14--16--18---|', 'A|---0---0---0---x---|', 'E|---x---x---x---x---|'], time: 8 },
    { measure: 4, notes: ['E|---5---4---2---0---|', 'B|---5---4---2---0---|', 'G|---6---4---2---1---|', 'D|---7---4---2---2---|', 'A|---7---x---0---2---|', 'E|---5---4---x---0---|'], time: 12 }
  ];

  const [activeMeasure, setActiveMeasure] = useState(1);

  // Track video time progress and sync with active tablature measure
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Determine active measure based on current video time
      const match = mockTablature.reduce((acc, tab) => {
        if (time >= tab.time) return tab;
        return acc;
      }, mockTablature[0]);
      
      setActiveMeasure(match.measure);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Media Vault</span>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold mt-1 text-slate-100">Interactive Lessons</h1>
        <p className="text-sm text-slate-400 mt-2">
          Sync your training with licensed sheet music tablatures. Use the integrated media player to slow down tempos.
        </p>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Left: Video player */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 overflow-hidden relative shadow-lg aspect-video flex items-center justify-center">
            {/* HTML5 video referencing placeholder stream */}
            <video 
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            />
            
            {/* Play/Pause Overlay indicator */}
            {!isPlaying && (
              <div 
                onClick={handlePlayPause}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/55"
              >
                <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-white text-2xl shadow-xl shadow-violet-600/30 transition-all hover:scale-110">
                  <i className="fa-solid fa-play ml-1"></i>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 flex items-center justify-between gap-4">
            <button 
              onClick={handlePlayPause}
              className="p-3 bg-violet-600 hover:bg-violet-700 rounded-lg text-white font-bold transition-all text-xs"
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause mr-2' : 'fa-play mr-2'}`}></i>
              {isPlaying ? 'Pause' : 'Play Rehearsal'}
            </button>
            <span className="text-xs text-slate-400">
              Time: {Math.floor(currentTime)}s / 15s (Sample Loop)
            </span>
          </div>
        </div>

        {/* Right: Tablature syncer */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <h3 className="font-heading font-bold text-slate-100 text-lg">Licensed Tablature</h3>
              <span className="text-[10px] px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-semibold rounded uppercase tracking-wider">
                DRM Encrypted
              </span>
            </div>

            <div className="flex flex-col gap-4 font-mono text-sm tracking-wider">
              {mockTablature.map((tab) => {
                const isActive = activeMeasure === tab.measure;
                return (
                  <div 
                    key={tab.measure}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'border-violet-500/40 bg-violet-500/5 text-slate-100 shadow-md' 
                        : 'border-white/5 bg-black/10 text-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-semibold uppercase ${isActive ? 'text-violet-400' : 'text-slate-600'}`}>
                        Measure {tab.measure}
                      </span>
                      {isActive && <span className="text-[9px] animate-pulse text-violet-400">Active Playing</span>}
                    </div>
                    <div className="whitespace-pre overflow-x-auto text-xs flex flex-col gap-1 leading-relaxed">
                      {tab.notes.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-xs text-cyan-300 flex gap-2">
            <i className="fa-solid fa-lock text-cyan-400 text-sm"></i>
            <span>This sheet music is licensed via Hal Leonard. Digital rights management (DRM) enforces viewing limits to active cohort subscriptions.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
