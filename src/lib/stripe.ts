import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "dummy-stripe-secret-key";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27-previews.1" as any,
});
