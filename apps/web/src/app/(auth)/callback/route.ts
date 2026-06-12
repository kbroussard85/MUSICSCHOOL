import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  // Delegate handling of callback to Auth0 client middleware route dispatcher
  return await auth0.middleware(request);
}
