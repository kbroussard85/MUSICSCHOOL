export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'DIRECTOR' | 'INSTRUCTOR' | 'ADMIN';
  hubId: string;
}

export interface RehearsalSession {
  id: string;
  cohortId: string;
  startTime: string;
  endTime: string;
}

export interface AudioMetrics {
  latencyMs: number;
  jitterMs: number;
  packetLoss: number;
}
