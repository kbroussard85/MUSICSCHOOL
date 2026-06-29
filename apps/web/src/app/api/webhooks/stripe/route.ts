import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') || '';

  let event;

  try {
    // Validate signature authenticity from webhook header
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'mock_webhook_secret'
    );
  } catch (err: any) {
    console.error(`[Webhook Signature Verification Failed]:`, err.message);
    // Gracefully handle local testing situations
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Webhook Local Fallback] Processing payload in bypass mode');
      try {
        event = JSON.parse(body);
      } catch (parseErr) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Signature Verification Error' }, { status: 400 });
    }
  }

  const { type, data } = event as any;

  try {
    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object;
        const studentId = session.metadata?.studentId;
        const stripeCustomerId = session.customer;
        const subscriptionId = session.subscription;

        if (studentId) {
          await prisma.student.update({
            where: { id: studentId },
            data: {
              stripeCustomerId,
              subscriptionStatus: 'active',
              commitmentEndDate: null, // Cancel anytime, no lock
            },
          });
          console.log(`[Webhook Completed] Securing student: ${studentId} with cancel-anytime active status.`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = data.object;
        const customerId = invoice.customer;
        
        await prisma.student.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'active' },
        });
        console.log(`[Webhook Payment Succeeded] Updated status for customer: ${customerId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = data.object;
        const customerId = invoice.customer;

        // Freeze dashboard access flags in database
        await prisma.student.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'past_due' },
        });
        console.warn(`[Webhook Payment Failed] Froze status for past_due customer: ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object;
        const customerId = subscription.customer;

        await prisma.student.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'canceled' },
        });
        console.log(`[Webhook Subscription Deleted] Canceled status for customer: ${customerId}`);
        break;
      }

      default:
        console.log(`[Webhook Event Skipped]: ${type}`);
    }

    return NextResponse.json({ status: 'success', data: { received: true }, error: null });
  } catch (dbErr: any) {
    console.error('[Webhook DB Sync Error]:', dbErr);
    return NextResponse.json({ error: 'Database Synchronization Failure' }, { status: 500 });
  }
}
