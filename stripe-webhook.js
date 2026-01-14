// netlify/functions/stripe-webhook.js
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");

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

  if (
    !STRIPE_SECRET_KEY ||
    !STRIPE_WEBHOOK_SECRET ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !BREVO_API_KEY
  ) {
    return { statusCode: 500, body: "Missing environment variables." };
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // --- helper Brevo ---
  async function sendBrevoEmail({ toEmail, templateId, params = {} }) {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          email: BREVO_SENDER_EMAIL,
          name: BREVO_SENDER_NAME
        },
        to: [{ email: toEmail }],
        templateId: Number(templateId),
        params
      })
    });
  }

  try {
    const sig = event.headers["stripe-signature"];
    const rawBody = event.body;

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );

    // ===============================
    // 1) Paiement terminé
    // ===============================
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;

      const user_id = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      const customerId = session.customer;
      const email = session.customer_details?.email;

      if (user_id && email && (plan === "annual" || plan === "lifetime")) {
        // Mise à jour du profil
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: customerId || null
          })
          .eq("id", user_id);

        if (error) throw error;

        // Envoi email Brevo (silencieux côté utilisateur)
        if (plan === "annual" && BREVO_TEMPLATE_PREMIUM_ANNUAL) {
          await sendBrevoEmail({
            toEmail: email,
            templateId: BREVO_TEMPLATE_PREMIUM_ANNUAL,
            params: {
              site_url: "https://clavis-security.netlify.app"
            }
          });
        }

        if (plan === "lifetime" && BREVO_TEMPLATE_PREMIUM_LIFETIME) {
          await sendBrevoEmail({
            toEmail: email,
            templateId: BREVO_TEMPLATE_PREMIUM_LIFETIME,
            params: {
              site_url: "https://clavis-security.netlify.app"
            }
          });
        }
      }
    }

    // ===============================
    // 2) Abonnement annulé → retour FREE
    // ===============================
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
