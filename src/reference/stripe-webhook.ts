/**
 * =====================================================
 * Stripe Webhook Handler Reference Implementation
 * =====================================================
 * 
 * This would be implemented as an API route in a Next.js App Router:
 * app/api/webhooks/stripe/route.ts
 * 
 * For Supabase Edge Functions:
 * supabase/functions/stripe-webhook/index.ts
 */

// ---- Next.js App Router Implementation ----

/*
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for admin operations
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // Verify webhook signature for security
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract reservation ID from metadata
      const reservationId = session.metadata?.reservation_id;
      
      if (!reservationId) {
        console.error('No reservation_id in session metadata');
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Update reservation status to 'paid' and 'confirmed'
      const { error } = await supabase
        .from('reservations')
        .update({
          payment_status: 'paid',
          reservation_status: 'confirmed',
          stripe_payment_intent: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reservationId)
        .eq('stripe_session_id', session.id); // Extra safety check

      if (error) {
        console.error('Failed to update reservation:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`Reservation ${reservationId} confirmed and paid`);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservationId = session.metadata?.reservation_id;

      if (reservationId) {
        // Cancel the unpaid reservation to free up the dates
        await supabase
          .from('reservations')
          .update({
            payment_status: 'cancelled',
            reservation_status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', reservationId)
          .eq('payment_status', 'unpaid');

        console.log(`Reservation ${reservationId} cancelled due to expired checkout`);
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntent = charge.payment_intent as string;

      // Find and update the reservation
      const { error } = await supabase
        .from('reservations')
        .update({
          payment_status: 'refunded',
          reservation_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_payment_intent', paymentIntent);

      if (error) {
        console.error('Failed to process refund:', error);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
*/

// ---- Stripe Checkout Session Creation ----

/*
// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { reservationId, vehicleName, totalPrice, customerEmail } = await request.json();

  try {
    // Verify reservation exists and is unpaid
    const { data: reservation, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .eq('payment_status', 'unpaid')
      .single();

    if (error || !reservation) {
      return NextResponse.json({ error: 'Reservation not found or already paid' }, { status: 404 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Car Rental: ${vehicleName}`,
              description: `${reservation.pickup_date} to ${reservation.return_date}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel?reservation_id=${reservationId}`,
      customer_email: customerEmail,
      metadata: {
        reservation_id: reservationId,
      },
      expires_after: 1800, // 30 minutes
    });

    // Store session ID on reservation
    await supabase
      .from('reservations')
      .update({ stripe_session_id: session.id })
      .eq('id', reservationId);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
*/

export {};
