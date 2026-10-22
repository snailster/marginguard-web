import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Server-side Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle successful deposit payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const variationId = paymentIntent.metadata?.variationId;

    if (variationId) {
      const { error } = await supabase
        .from('variation_logs')
        .update({
          status: 'APPROVED',
          payment_status: 'PAID',
          stripe_payment_id: paymentIntent.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', variationId);

      if (error) {
        console.error('Database update error on payment success:', error);
        return NextResponse.json({ error: 'Failed to update variation status' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}