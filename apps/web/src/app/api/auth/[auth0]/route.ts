import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

// Export standard Next.js route handlers for Auth0 authentication actions
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      prompt: 'login',
    },
    returnTo: '/practice-room', // Redirect back to student portal on login success
  }),
});
