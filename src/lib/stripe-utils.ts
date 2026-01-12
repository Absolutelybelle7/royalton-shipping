/**
 * Stripe Payment Integration for Royalton Logistics
 * 
 * This file contains utilities and documentation for Stripe integration
 */

import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

// Initialize Stripe (public key only - sensitive operations require backend)
let stripePromise: Promise<Stripe | null>;

export const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

/**
 * Create a payment intent on the backend
 * 
 * This should be called from a Cloud Function or backend server
 * IMPORTANT: Never handle payment intents client-side for production!
 */
export interface CreatePaymentIntentRequest {
  amount: number; // Amount in cents (e.g., 2099 = $20.99)
  currency: string; // e.g., 'usd'
  shipmentId?: string;
  userId: string;
  description?: string;
}

/**
 * Call backend to create payment intent
 * Backend endpoint: POST /api/payment/create-intent
 */
export const createPaymentIntent = async (data: CreatePaymentIntentRequest) => {
  try {
    const response = await fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Handle Stripe redirect after payment
 */
export const handleStripeRedirect = async (
  clientSecret: string,
  cardElement: StripeCardElement
) => {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe failed to load');

  return stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  });
};

/**
 * BACKEND IMPLEMENTATION GUIDE (Cloud Function or Express.js)
 * 
 * This code should run on your backend server or Cloud Function
 * 
 * Dependencies: npm install stripe
 * 
 * Example Node.js implementation:
 * 
 * ```javascript
 * import Stripe from 'stripe';
 * import * as admin from 'firebase-admin';
 * 
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 * const db = admin.firestore();
 * 
 * // Create Payment Intent
 * exports.createPaymentIntent = async (req, res) => {
 *   const { amount, currency, shipmentId, userId, description } = req.body;
 * 
 *   try {
 *     const paymentIntent = await stripe.paymentIntents.create({
 *       amount,
 *       currency,
 *       description: description || `Shipment ${shipmentId}`,
 *       metadata: {
 *         shipmentId,
 *         userId,
 *       },
 *     });
 * 
 *     // Store payment intent in Firestore
 *     await db.collection('payments').doc(paymentIntent.id).set({
 *       shipmentId,
 *       userId,
 *       amount,
 *       currency,
 *       status: 'pending',
 *       stripePaymentId: paymentIntent.id,
 *       createdAt: new Date().toISOString(),
 *     });
 * 
 *     res.json({
 *       clientSecret: paymentIntent.client_secret,
 *       paymentIntentId: paymentIntent.id,
 *     });
 *   } catch (error) {
 *     console.error('Error creating payment intent:', error);
 *     res.status(400).json({ error: error.message });
 *   }
 * };
 * 
 * // Handle Webhook
 * exports.stripeWebhook = async (req, res) => {
 *   const sig = req.headers['stripe-signature'];
 *   let event;
 * 
 *   try {
 *     event = stripe.webhooks.constructEvent(
 *       req.body,
 *       sig,
 *       process.env.STRIPE_WEBHOOK_SECRET
 *     );
 *   } catch (err) {
 *     return res.status(400).send(`Webhook Error: ${err.message}`);
 *   }
 * 
 *   if (event.type === 'payment_intent.succeeded') {
 *     const paymentIntent = event.data.object;
 * 
 *     // Update payment status in Firestore
 *     await db
 *       .collection('payments')
 *       .doc(paymentIntent.id)
 *       .update({
 *         status: 'completed',
 *         completedAt: new Date().toISOString(),
 *       });
 * 
 *     // Update shipment status
 *     if (paymentIntent.metadata.shipmentId) {
 *       await db
 *         .collection('shipments')
 *         .doc(paymentIntent.metadata.shipmentId)
 *         .update({
 *           paymentStatus: 'completed',
 *           paidAt: new Date().toISOString(),
 *         });
 *     }
 *   }
 * 
 *   if (event.type === 'payment_intent.payment_failed') {
 *     const paymentIntent = event.data.object;
 *     await db
 *       .collection('payments')
 *       .doc(paymentIntent.id)
 *       .update({
 *         status: 'failed',
 *         failedAt: new Date().toISOString(),
 *       });
 *   }
 * 
 *   res.json({ received: true });
 * };
 * ```
 * 
 * Environment Variables Required:
 * - VITE_STRIPE_PUBLIC_KEY: Your Stripe publishable key
 * - STRIPE_SECRET_KEY: Your Stripe secret key (backend only)
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret (backend only)
 */

/**
 * Payment Status in Firestore
 * 
 * Document structure in 'payments' collection:
 * {
 *   id: string (Stripe Payment Intent ID)
 *   shipmentId: string
 *   userId: string
 *   amount: number (cents)
 *   currency: string
 *   status: 'pending' | 'completed' | 'failed' | 'cancelled'
 *   paymentMethod: string (e.g., 'card')
 *   stripePaymentId: string
 *   createdAt: string (ISO)
 *   completedAt?: string (ISO)
 *   failedAt?: string (ISO)
 * }
 */

export default {
  getStripe,
  createPaymentIntent,
  handleStripeRedirect,
};
