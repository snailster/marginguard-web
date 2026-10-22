import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    // Verify Webhook Signature if STRIPE_WEBHOOK_SECRET is defined
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log(`💰 Payment succeeded for Session: ${session.id}`);

    // Persist payment record to Supabase database
    const { error } = await supabase.from('payments').insert([
      {
        stripe_session_id: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        payment_status: session.payment_status,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Failed to log payment to Supabase:', error);
    }
  }

  return NextResponse.json({ received: true });
}