'use client';

import React from 'react';

interface JitterBufferProps {
  latencyMs: number;
}

export const JitterBuffer: React.FC<JitterBufferProps> = ({ latencyMs }) => {
  // Simulate minor jitter and packet loss calculations for visualization based on latency
  const jitterVal = latencyMs > 0 ? Math.max((latencyMs * 0.1) + (Math.random() * 2 - 1), 0.5) : 0;
  const packetLossVal = latencyMs > 30 ? Math.min((latencyMs - 30) * 0.05, 2.5) : 0;

  // Latency Status threshold checks
  let statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
  let statusText = 'Optimal (Sub-25ms)';
  
  if (latencyMs > 25 && latencyMs <= 50) {
    statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    statusText = 'Warn (Minor Lag)';
  } else if (latencyMs > 50) {
    statusColor = 'text-rose-400 border-rose-500/20 bg-rose-500/10';
    statusText = 'Critical (Jamming Delayed)';
  } else if (latencyMs === 0) {
    statusColor = 'text-slate-400 border-slate-500/20 bg-slate-500/10';
    statusText = 'Offline';
  }

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-semibold text-slate-200 text-sm tracking-wider uppercase">
          <i className="fa-solid fa-gauge-high mr-2 text-violet-400"></i> Latency Diagnostics
        </h4>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Metric 1: Ping (RTT) */}
        <div className="p-4 rounded-xl border border-white/5 bg-black/20">
          <span className="block text-xs font-medium text-slate-400 mb-1">Ping (RTT)</span>
          <span className="font-heading text-xl font-bold text-slate-100">
            {latencyMs > 0 ? `${latencyMs} ms` : '--'}
          </span>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                latencyMs <= 25 ? 'bg-emerald-400' : latencyMs <= 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min((latencyMs / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Estimated Jitter */}
        <div className="p-4 rounded-xl border border-white/5 bg-black/20">
          <span className="block text-xs font-medium text-slate-400 mb-1">Est. Jitter</span>
          <span className="font-heading text-xl font-bold text-slate-100">
            {latencyMs > 0 ? `${jitterVal.toFixed(1)} ms` : '--'}
          </span>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full bg-cyan-400`}
              style={{ width: `${Math.min((jitterVal / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Packet Loss */}
        <div className="p-4 rounded-xl border border-white/5 bg-black/20">
          <span className="block text-xs font-medium text-slate-400 mb-1">Packet Loss</span>
          <span className="font-heading text-xl font-bold text-slate-100">
            {latencyMs > 0 ? `${packetLossVal.toFixed(2)}%` : '--'}
          </span>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${packetLossVal > 1.0 ? 'bg-rose-500' : 'bg-violet-400'}`}
              style={{ width: `${Math.min((packetLossVal / 3) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {latencyMs > 25 && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-rose-400 text-sm"></i>
          <span>Network latency is exceeding the 25ms threshold. Real-time audio synchronization may lag. Try closing other streaming apps.</span>
        </div>
      )}
    </div>
  );
};
