import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  // Clear mock email cookie in development
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.set('mock_user_email', '', { maxAge: 0, path: '/' });
  
  try {
    // Attempt Auth0 logout middleware if configured
    const auth0Response = await auth0.middleware(request);
    if (auth0Response) {
      auth0Response.headers.append('Set-Cookie', 'mock_user_email=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return auth0Response;
    }
  } catch (err) {
    console.warn('[Logout] Auth0 logout failed or skipped, redirecting locally:', err);
  }

  return response;
}
