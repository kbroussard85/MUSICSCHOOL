import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  // Fallbacks for build and development if env variables are empty
  domain: process.env.AUTH0_DOMAIN || 'mock.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'mock_client_id',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'mock_client_secret',
  secret: process.env.AUTH0_SECRET || 'mock_secret_that_is_long_enough_to_satisfy_crypto_check_32_chars',
  appBaseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
});
