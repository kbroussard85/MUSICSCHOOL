import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './rooms';

const app = express();
app.use(cors({ origin: '*' }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;
const roomManager = new RoomManager();

io.on('connection', (socket: Socket) => {
  console.log(`[Socket Connected] Socket ID: ${socket.id}`);

  // 1. Join Rehearsal Room
  socket.on('join-room', ({ cohortId, studentId, name, role }) => {
    console.log(`[Join Room] Student: ${name} (${role}) joining room: ${cohortId}`);
    
    // Join socket room
    socket.join(cohortId);
    
    // Add peer to manager and retrieve existing peers in the room
    const existingPeers = roomManager.joinRoom(cohortId, socket.id, studentId, name, role);
    
    // Send other peers' details back to the joining student
    socket.emit('room-joined', { peers: existingPeers });
    
    // Notify all existing peers in the room that a new peer joined
    socket.to(cohortId).emit('peer-joined', {
      socketId: socket.id,
      studentId,
      name,
      role,
      latencyMs: 0
    });
  });

  // 2. Relay SDP Signaling (Offer, Answer)
  socket.on('signal-offer', ({ targetSocketId, offer }) => {
    console.log(`[Signal] Relaying offer from ${socket.id} -> ${targetSocketId}`);
    io.to(targetSocketId).emit('signal-offer', {
      senderSocketId: socket.id,
      offer
    });
  });

  socket.on('signal-answer', ({ targetSocketId, answer }) => {
    console.log(`[Signal] Relaying answer from ${socket.id} -> ${targetSocketId}`);
    io.to(targetSocketId).emit('signal-answer', {
      senderSocketId: socket.id,
      answer
    });
  });

  // 3. Relay ICE Candidates
  socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('ice-candidate', {
      senderSocketId: socket.id,
      candidate
    });
  });

  // 4. Latency Diagnostics
  socket.on('latency-ping', ({ cohortId, timestamp }) => {
    // Reply back instantly to calculate Round Trip Time (RTT)
    socket.emit('latency-pong', { timestamp });
  });

  socket.on('latency-report', ({ cohortId, latencyMs }) => {
    roomManager.updateLatency(cohortId, socket.id, latencyMs);
    // Broadcast updated peer lists with latency stats
    io.to(cohortId).emit('room-stats', { peers: roomManager.getPeers(cohortId) });
  });

  // 5. Disconnect handling
  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] Socket ID: ${socket.id}`);
    
    const cohortId = roomManager.findRoomBySocketId(socket.id);
    if (cohortId) {
      const { leftPeer } = roomManager.leaveRoom(cohortId, socket.id);
      if (leftPeer) {
        console.log(`[Leave Room] Peer ${leftPeer.name} left room ${cohortId}`);
        socket.to(cohortId).emit('peer-left', { socketId: socket.id });
        io.to(cohortId).emit('room-stats', { peers: roomManager.getPeers(cohortId) });
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` HARMONY WEBRTC SIGNALING SERVER IS ONLINE`);
  console.log(` Port: ${PORT}`);
  console.log(` Latency Moat Radius: 500 Miles Target (<25ms RTT)`);
  console.log(`===================================================`);
});
