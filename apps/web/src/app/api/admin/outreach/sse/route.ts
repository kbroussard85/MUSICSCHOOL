import { NextRequest } from 'next/server';
import { globalBroadcaster } from '@/lib/broadcast';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const handleNewLead = (lead: any) => {
        try {
          controller.enqueue(encoder.encode(`event: new-lead\ndata: ${JSON.stringify(lead)}\n\n`));
        } catch (err) {
          console.error('[SSE Route] Error pushing to stream:', err);
        }
      };

      globalBroadcaster.on('new-lead', handleNewLead);

      request.signal.addEventListener('abort', () => {
        globalBroadcaster.off('new-lead', handleNewLead);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
