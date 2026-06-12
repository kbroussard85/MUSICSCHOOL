'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';
import { JitterBuffer } from './JitterBuffer';

// Dedicated Remote Audio Player component to resolve NotSupportedError
const AudioPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // Bind media stream source
    el.srcObject = stream;

    const playAudio = async () => {
      try {
        await el.play();
      } catch (err) {
        console.warn('[WebRTC] Autoplay or play blocked:', err);
      }
    };

    playAudio();

    return () => {
      if (el) {
        el.srcObject = null;
      }
    };
  }, [stream]);

  return <audio ref={audioRef} playsInline className="hidden" />;
};

interface AudioWorkspaceProps {
  cohortId: string;
  studentId: string;
  userName: string;
  userRole: string;
}

export const AudioWorkspace: React.FC<AudioWorkspaceProps> = ({
  cohortId,
  studentId,
  userName,
  userRole
}) => {
  const { peers, localLatency, connectionStatus, isMicAllowed, localStream } = useWebRTC(
    cohortId,
    studentId,
    userName,
    userRole
  );

  const [isMuted, setIsMuted] = useState(false);
  const [activeVolume, setActiveVolume] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Toggle local mute directly on active stream tracks (no duplicate getUserMedia prompt)
  const handleMuteToggle = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (localStream) {
        localStream.getAudioTracks().forEach(track => {
          track.enabled = !next;
        });
      }
      return next;
    });
  };

  // Local audio input volume levels analyzer consuming localStream directly
  useEffect(() => {
    if (localStream) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(localStream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      micSourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current || isMuted) {
          setActiveVolume(0);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
          return;
        }
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setActiveVolume(Math.min((average / 128) * 100, 100)); // Map to percentage scale
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [localStream, isMuted]);

  // Render glassmorphic banner if microphone permission is denied or dismissed
  if (!isMicAllowed) {
    return (
      <div className="p-8 rounded-2xl border border-rose-500/20 bg-[#0b0e14]/80 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center max-w-lg mx-auto my-12 font-sans">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4 animate-pulse">
          <i className="fa-solid fa-microphone-slash text-4xl"></i>
        </div>
        <h3 className="font-heading text-2xl font-bold text-slate-100 mb-2">Microphone Access Denied</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          To join the low-latency rehearsal room, you must allow access to your microphone.
          Please click the lock or settings icon in your browser's address bar, enable microphone permissions, and refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-rotate-right mr-2"></i> Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Latency Stats Overlay */}
      <JitterBuffer latencyMs={localLatency} />

      {/* Main Jam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Local Stream Card */}
        <div className="p-6 rounded-2xl border border-violet-500/20 bg-slate-900/60 backdrop-blur-md relative overflow-hidden shadow-lg flex flex-col justify-between h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Local Audio Node</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-100">{userName} (You)</h3>
            <p className="text-xs text-slate-400 mt-1">{userRole}</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleMuteToggle}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                  : 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20'
              }`}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </button>

            {/* Volume indicator waveform */}
            <div className="flex-1 flex gap-1 items-end h-[24px]">
              {[...Array(10)].map((_, i) => {
                const heightVal = activeVolume > (i * 10) ? Math.max(20 - (i * 1.5), 4) : 4;
                return (
                  <div 
                    key={i} 
                    className="flex-1 bg-violet-400 rounded-full transition-all duration-75"
                    style={{ height: `${heightVal}px`, opacity: isMuted ? 0.1 : 0.8 }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Remote Peers Cards */}
        {peers.map((peer) => {
          const isPeerMuted = peer.latencyMs === 0;
          return (
            <div 
              key={peer.socketId}
              className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md relative overflow-hidden shadow-lg flex flex-col justify-between h-[200px] transition-all hover:border-violet-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Remote Peer</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <i className="fa-solid fa-signal text-cyan-400"></i> {peer.latencyMs}ms
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-100">{peer.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{peer.role}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl border border-white/5 bg-slate-800/20 text-slate-400 flex items-center justify-center">
                  <i className={`fa-solid ${isPeerMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                </div>

                {/* Play remote peer stream programmatically */}
                {peer.stream && (
                  <AudioPlayer stream={peer.stream} />
                )}

                <div className="flex-1 text-xs text-slate-400 italic">
                  {isPeerMuted ? 'Muted / Connecting' : 'Active jamming stream connected'}
                </div>
              </div>
            </div>
          );
        })}

        {peers.length === 0 && (
          <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-slate-900/10 backdrop-blur-md shadow-lg flex flex-col items-center justify-center text-center h-[200px] col-span-1 md:col-span-2 lg:col-span-2">
            <i className="fa-solid fa-users text-slate-500 text-3xl mb-3"></i>
            <h4 className="font-heading font-semibold text-slate-300">Awaiting Bandmates</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Share your rehearsal link. Bandmates who join this cohort will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};
