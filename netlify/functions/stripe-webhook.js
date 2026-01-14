// netlify/functions/stripe-webhook.js
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  const {
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,

    BREVO_API_KEY,
    BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME,
    BREVO_TEMPLATE_PREMIUM_ANNUAL,
    BREVO_TEMPLATE_PREMIUM_LIFETIME
  } = process.env;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { statusCode: 500, body: "Missing environment variables." };
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ✅ helper Brevo (sans node-fetch)
  async function sendBrevoEmail({ toEmail, templateId, params = {} }) {
    // Si Brevo pas configuré, on ne bloque pas le webhook
    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !BREVO_SENDER_NAME || !templateId) return;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
        to: [{ email: toEmail }],
        templateId: Number(templateId),
        params
      })
    });

    // On ne casse pas Stripe si Brevo a un souci
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.log("Brevo send failed:", res.status, txt);
    }
  }

  try {
    const sig = event.headers["stripe-signature"];
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );

    // 1) Paiement OK
    if (stripeEvent.type === "checkout.session.completed") {
      const s = stripeEvent.data.object;

      const user_id = s.metadata?.user_id;
      const plan = s.metadata?.plan; // annual | lifetime
      const customerId = s.customer;
      const email = s.customer_details?.email;

      if (user_id && email && (plan === "annual" || plan === "lifetime")) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId || null
          })
          .eq("id", user_id);

        if (error) throw error;

        const site_url = process.env.URL || "https://clavis-security.netlify.app";

        if (plan === "annual") {
          await sendBrevoEmail({
            toEmail: email,
            templateId: BREVO_TEMPLATE_PREMIUM_ANNUAL,
            params: { site_url }
          });
        }

        if (plan === "lifetime") {
          await sendBrevoEmail({
            toEmail: email,
            templateId: BREVO_TEMPLATE_PREMIUM_LIFETIME,
            params: { site_url }
          });
        }
      }
    }

    // 2) Abonnement annulé → retour free
    if (stripeEvent.type === "customer.subscription.deleted") {
      const sub = stripeEvent.data.object;
      const customerId = sub.customer;

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
