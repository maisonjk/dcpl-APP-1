import { Router } from "express";
import Stripe from "stripe";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { AuthRequest } from "../auth.js";
import type { DbUser } from "../db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const router = Router();

const PRICE_IDS: Record<string, string> = {
  disciple_monthly: process.env.STRIPE_PRICE_DISCIPLE_MONTHLY || "",
  disciple_yearly: process.env.STRIPE_PRICE_DISCIPLE_YEARLY || "",
  church_monthly: process.env.STRIPE_PRICE_CHURCH_MONTHLY || "",
  church_yearly: process.env.STRIPE_PRICE_CHURCH_YEARLY || "",
};

function buildTierByPrice(): Record<string, string> {
  return {
    [PRICE_IDS.disciple_monthly]: "disciple_plus",
    [PRICE_IDS.disciple_yearly]: "disciple_plus",
    [PRICE_IDS.church_monthly]: "church_leader",
    [PRICE_IDS.church_yearly]: "church_leader",
  };
}

router.post("/checkout", requireAuth as any, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { priceId } = req.body as { priceId?: string };

  if (!priceId || !Object.values(PRICE_IDS).includes(priceId)) {
    return res.status(400).json({ error: "Invalid price ID" });
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as DbUser;

  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      metadata: { userId: String(user.id) },
    });
    customerId = customer.id;
    db.prepare("UPDATE users SET stripe_customer_id = ? WHERE id = ?").run(customerId, userId);
  }

  const origin = req.headers.origin || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancel`,
    metadata: { userId: String(userId) },
  });

  return res.json({ url: session.url });
});

router.post("/portal", requireAuth as any, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as DbUser;

  if (!user.stripe_customer_id) {
    return res.status(400).json({ error: "No billing account found" });
  }

  const origin = req.headers.origin || "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${origin}/`,
  });

  return res.json({ url: session.url });
});

router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch {
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  const TIER_BY_PRICE = buildTierByPrice();

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id || "";
    const tier = TIER_BY_PRICE[priceId] || "free";
    const customerId = subscription.customer as string;
    db.prepare(
      "UPDATE users SET tier = ?, stripe_subscription_id = ? WHERE stripe_customer_id = ?"
    ).run(tier, subscription.id, customerId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    db.prepare(
      "UPDATE users SET tier = 'free', stripe_subscription_id = NULL WHERE stripe_customer_id = ?"
    ).run(customerId);
  }

  return res.json({ received: true });
});

export default router;
