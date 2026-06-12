/**
 * Audio Engine Utilities for Harmony Rehearsal App
 */

// Force strict Opus profile constraint: 48kHz, 2 channels (stereo), 128kbps target
export interface AudioConstraints {
  sampleRate: 48000;
  channelCount: 2;
  echoCancellation: boolean;
  noiseSuppression: boolean;
}

export const getOpusConstraints = (): AudioConstraints => ({
  sampleRate: 48000,
  channelCount: 2,
  echoCancellation: true,
  noiseSuppression: true,
});

// Latency & Jitter Calculations
export function calculateJitter(latencies: number[]): number {
  if (latencies.length < 2) return 0;
  let sumDiff = 0;
  for (let i = 1; i < latencies.length; i++) {
    sumDiff += Math.abs(latencies[i] - latencies[i - 1]);
  }
  return sumDiff / (latencies.length - 1);
}

// Check if regional latency satisfies the sub-25ms SLA
export function satisfiesLatencySLA(latencyMs: number): boolean {
  return latencyMs <= 25;
}
