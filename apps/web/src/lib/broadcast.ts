import { EventEmitter } from 'events';

class GlobalBroadcaster extends EventEmitter {
  broadcast(event: string, data: any) {
    this.emit(event, data);
  }
}

declare global {
  var globalBroadcaster: GlobalBroadcaster | undefined;
}

// Global singleton instance for server-side event broadcasting
export const globalBroadcaster = globalThis.globalBroadcaster ?? new GlobalBroadcaster();

if (process.env.NODE_ENV !== 'production') {
  globalThis.globalBroadcaster = globalBroadcaster;
}

