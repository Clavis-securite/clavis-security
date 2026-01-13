// netlify/functions/stripe-webhook.js
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { statusCode: 500, body: "Missing environment variables." };
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const sig = event.headers["stripe-signature"];
    const rawBody = event.body; // Netlify fournit un string brut ici

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );

    // 1) Paiement terminé (annual ou lifetime)
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;

      const user_id = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      const customerId = session.customer;

      if (user_id && (plan === "annual" || plan === "lifetime")) {
        // On passe le plan premium direct après checkout
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId || null
          })
          .eq("id", user_id);

        if (error) throw error;
      }
    }

    // 2) Abonnement annulé => retour FREE (si annual)
    if (stripeEvent.type === "customer.subscription.deleted") {
      const sub = stripeEvent.data.object;
      const customerId = sub.customer;

      // On repasse le plan en free pour ce customer
      if (customerId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);

        if (error) throw error;
      }
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
};
