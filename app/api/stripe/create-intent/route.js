import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, variationId, customerEmail } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'A valid dollar amount greater than 0 is required' },
        { status: 400 }
      );
    }

    // Create PaymentIntent (Stripe accepts amount in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        variationId: variationId || '',
      },
      receipt_email: customerEmail || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe Create Intent Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}