import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Gracefully fallback during development or build if key is missing
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_stripe_key', {
  apiVersion: '2023-10-16' as any, // standard api version fallback
  appInfo: {
    name: 'Harmony Music School CRM',
    version: '1.0.0',
  },
});
