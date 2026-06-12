export interface Peer {
  socketId: string;
  studentId: string;
  name: string;
  role: string;
  latencyMs: number;
}

export interface Room {
  cohortId: string;
  peers: Map<string, Peer>; // key: socketId
  createdAt: number;
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  public joinRoom(cohortId: string, socketId: string, studentId: string, name: string, role: string): Peer[] {
    if (!this.rooms.has(cohortId)) {
      this.rooms.set(cohortId, {
        cohortId,
        peers: new Map(),
        createdAt: Date.now(),
      });
    }

    const room = this.rooms.get(cohortId)!;
    const newPeer: Peer = {
      socketId,
      studentId,
      name,
      role,
      latencyMs: 0,
    };
    
    room.peers.set(socketId, newPeer);
    
    // Return all other peers in the room
    return Array.from(room.peers.values()).filter(p => p.socketId !== socketId);
  }

  public leaveRoom(cohortId: string, socketId: string): { leftPeer: Peer | null; isEmpty: boolean } {
    const room = this.rooms.get(cohortId);
    if (!room) return { leftPeer: null, isEmpty: true };

    const leftPeer = room.peers.get(socketId) || null;
    if (leftPeer) {
      room.peers.delete(socketId);
    }

    const isEmpty = room.peers.size === 0;
    if (isEmpty) {
      this.rooms.delete(cohortId);
    }

    return { leftPeer, isEmpty };
  }

  public getPeers(cohortId: string): Peer[] {
    const room = this.rooms.get(cohortId);
    if (!room) return [];
    return Array.from(room.peers.values());
  }

  public updateLatency(cohortId: string, socketId: string, latencyMs: number): void {
    const room = this.rooms.get(cohortId);
    if (room) {
      const peer = room.peers.get(socketId);
      if (peer) {
        peer.latencyMs = latencyMs;
      }
    }
  }

  public findRoomBySocketId(socketId: string): string | null {
    for (const [cohortId, room] of this.rooms.entries()) {
      if (room.peers.has(socketId)) {
        return cohortId;
      }
    }
    return null;
  }
}
