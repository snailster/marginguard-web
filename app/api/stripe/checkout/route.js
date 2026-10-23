import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req) {
  try {
    const { amount, jobName, recordId, userEmail, contractorStripeAccountId } = await req.json();

    // Set your take-rate percentage (e.g., 1.0%)
    const TAKE_RATE_PERCENTAGE = 0.01; 
    const applicationFeeAmount = Math.round(amount * TAKE_RATE_PERCENTAGE); // Fee in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Variation Order #${recordId} - ${jobName}`,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // --- STRIPE CONNECT TRANSACTION SPLIT ---
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount, // Your platform fee profit
        transfer_data: {
          destination: contractorStripeAccountId, // Contractor's Stripe Account ID
        },
      },
      
      success_url: `https://marginguard-web-kappa.vercel.app/?payment=success&id=${recordId}`,
      cancel_url: `https://marginguard-web-kappa.vercel.app/?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}