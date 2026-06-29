import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';

export async function POST(req: Request) {
  try {
    const { studentId, email, name, instrument } = await req.json();

    if (!email || !studentId) {
      return NextResponse.json(
        { status: 'error', error: 'Missing email or student identifier', data: null },
        { status: 400 }
      );
    }

    // 1. Setup Stripe Subscription Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          // Music School Subscription Price: $299/month
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: {
              name: 'Stage Music Academy Enrollment',
              description: 'Cancel anytime. Access to live rehearsals, 1-on-1 private lessons, and masterclasses.',
            },
            unit_amount: 29900, // $299.00
          },
          quantity: 1,
        },
      ],
      // Cancel anytime, no obligation contract metadata
      metadata: {
        studentId,
        studentName: name,
        instrumentChoice: instrument,
        commitmentType: 'no-obligation-cancel-anytime',
        contractStartDate: new Date().toISOString(),
      },
      success_url: `${req.headers.get('origin')}/practice-room?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/signup`,
    });

    return NextResponse.json({
      status: 'success',
      data: { sessionId: session.id, url: session.url },
      error: null
    });
  } catch (error: any) {
    console.error('[Stripe Checkout Session Error]:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Gateway communication failed', data: null },
      { status: 500 }
    );
  }
}
