import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface WebRTCPeer {
  socketId: string;
  studentId: string;
  name: string;
  role: string;
  stream?: MediaStream;
  latencyMs: number;
}

export const useWebRTC = (
  cohortId: string,
  studentId: string,
  userName: string,
  userRole: string
) => {
  const [peers, setPeers] = useState<WebRTCPeer[]>([]);
  const [latency, setLatency] = useState<number>(0);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isMicAllowed, setIsMicAllowed] = useState<boolean>(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map()); // key: socketId

  const SFU_URL = process.env.NEXT_PUBLIC_SFU_SERVER_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!cohortId) return;

    setStatus('connecting');
    let socket: Socket | null = null;
    let isCleanedUp = false;

    // 1. Setup Local Audio Stream first to avoid race conditions
    navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        sampleRate: 48000, // 48kHz Stereo requirement
        channelCount: 2,
      },
      video: false
    }).then((stream) => {
      if (isCleanedUp) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsMicAllowed(true);

      // 2. Establish Signaling Socket Connection
      socket = io(SFU_URL, { transports: ['websocket'] });
      socketRef.current = socket;

      // 3. Socket Listeners
      socket.on('connect', () => {
        setStatus('connected');
        // Once connected, join the cohort room
        socket?.emit('join-room', {
          cohortId,
          studentId,
          name: userName,
          role: userRole
        });
      });

      socket.on('room-joined', async ({ peers: roomPeers }: { peers: Omit<WebRTCPeer, 'stream'>[] }) => {
        console.log(`[WebRTC] Joined room. Found ${roomPeers.length} peers.`);
        
        const newPeers = roomPeers.map(p => ({ ...p, latencyMs: 0 }));
        setPeers(newPeers);

        // Create WebRTC connections for each existing peer
        for (const peer of newPeers) {
          await createPeerConnection(peer.socketId, true);
        }
      });

      socket.on('peer-joined', async (peer: Omit<WebRTCPeer, 'stream'>) => {
        console.log(`[WebRTC] Peer joined: ${peer.name}`);
        setPeers(prev => {
          if (prev.some(p => p.socketId === peer.socketId)) return prev;
          return [...prev, { ...peer, latencyMs: 0 }];
        });
        // Await their offer
      });

      socket.on('signal-offer', async ({ senderSocketId, offer }: { senderSocketId: string; offer: RTCSessionDescriptionInit }) => {
        console.log(`[WebRTC] Received offer from ${senderSocketId}`);
        let pc = peerConnectionsRef.current.get(senderSocketId);
        if (!pc) {
          pc = await createPeerConnection(senderSocketId, false);
        }
        
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        
        // Inject SDP parameters: Opus, 48kHz, FEC, CBR (Constant Bit Rate)
        const tunedSDP = tuneSDP(answer.sdp || '');
        const tunedAnswer = new RTCSessionDescription({ type: 'answer', sdp: tunedSDP });
        
        await pc.setLocalDescription(tunedAnswer);
        
        socket?.emit('signal-answer', {
          targetSocketId: senderSocketId,
          answer: tunedAnswer
        });
      });

      socket.on('signal-answer', async ({ senderSocketId, answer }: { senderSocketId: string; answer: RTCSessionDescriptionInit }) => {
        console.log(`[WebRTC] Received answer from ${senderSocketId}`);
        const pc = peerConnectionsRef.current.get(senderSocketId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on('ice-candidate', async ({ senderSocketId, candidate }: { senderSocketId: string; candidate: RTCIceCandidateInit }) => {
        const pc = peerConnectionsRef.current.get(senderSocketId);
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on('room-stats', ({ peers: roomStats }: { peers: WebRTCPeer[] }) => {
        setPeers(prev => {
          return prev.map(p => {
            const stat = roomStats.find(s => s.socketId === p.socketId);
            return stat ? { ...p, latencyMs: stat.latencyMs } : p;
          });
        });
      });

      socket.on('peer-left', ({ socketId }: { socketId: string }) => {
        console.log(`[WebRTC] Peer left: ${socketId}`);
        closePeerConnection(socketId);
        setPeers(prev => prev.filter(p => p.socketId !== socketId));
      });

      // 4. RTT Latency Diagnostic Loop
      const latencyInterval = setInterval(() => {
        if (socket?.connected) {
          const pingTime = Date.now();
          socket.emit('latency-ping', { cohortId, timestamp: pingTime });
        }
      }, 2000);

      socket.on('latency-pong', ({ timestamp }: { timestamp: number }) => {
        const rtt = Date.now() - timestamp;
        setLatency(rtt);
        socket?.emit('latency-report', { cohortId, latencyMs: rtt });
      });

      // Store interval on socket ref for cleanup
      (socket as any)._latencyInterval = latencyInterval;

    }).catch(err => {
      console.error('[WebRTC] Microphone access denied or dismissed', err);
      setStatus('disconnected');
      setIsMicAllowed(false);
    });

    // Cleanup
    return () => {
      isCleanedUp = true;
      if (socket) {
        if ((socket as any)._latencyInterval) {
          clearInterval((socket as any)._latencyInterval);
        }
        socket.disconnect();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      peerConnectionsRef.current.forEach((pc, id) => {
        closePeerConnection(id);
      });
    };
  }, [cohortId]);

  // Peer Connection Creator
  const createPeerConnection = async (targetSocketId: string, isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peerConnectionsRef.current.set(targetSocketId, pc);

    // Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Capture remote streams
    pc.ontrack = (event) => {
      console.log(`[WebRTC] Received remote stream track from ${targetSocketId}`);
      setPeers(prev => {
        return prev.map(p => {
          if (p.socketId === targetSocketId) {
            return { ...p, stream: event.streams[0] };
          }
          return p;
        });
      });
    };

    // Forward ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          targetSocketId,
          candidate: event.candidate
        });
      }
    };

    // If initiator, send offer
    if (isInitiator) {
      const offer = await pc.createOffer();
      const tunedSDP = tuneSDP(offer.sdp || '');
      const tunedOffer = new RTCSessionDescription({ type: 'offer', sdp: tunedSDP });
      await pc.setLocalDescription(tunedOffer);
      
      socketRef.current?.emit('signal-offer', {
        targetSocketId,
        offer: tunedOffer
      });
    }

    return pc;
  };

  const closePeerConnection = (socketId: string) => {
    const pc = peerConnectionsRef.current.get(socketId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(socketId);
    }
  };

  // Tune SDP to force Opus, Stereo, 48kHz, CBR, FEC
  const tuneSDP = (sdp: string): string => {
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('a=rtpmap:') && lines[i].includes('opus/48000')) {
        const payloadType = lines[i].split('a=rtpmap:')[1].split(' ')[0];
        const fmtpIndex = lines.findIndex(l => l.includes(`a=fmtp:${payloadType}`));
        if (fmtpIndex !== -1) {
          lines[fmtpIndex] = lines[fmtpIndex] + ';maxaveragebitrate=128000;useinbandfec=1;cbr=1';
        }
      }
    }
    return lines.join('\r\n');
  };

  return { peers, localLatency: latency, connectionStatus: status, isMicAllowed, localStream };
};
