// netlify/functions/create-checkout-session.js
const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const PRICE_ANNUAL = process.env.STRIPE_PRICE_ANNUAL;
    const PRICE_LIFETIME = process.env.STRIPE_PRICE_LIFETIME;

    if (!STRIPE_SECRET_KEY || !PRICE_ANNUAL || !PRICE_LIFETIME) {
      return { statusCode: 500, body: "Missing Stripe environment variables." };
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const body = JSON.parse(event.body || "{}");
    const { plan, user_id, user_email, site_url } = body;

    if (!plan || !user_id || !user_email || !site_url) {
      return { statusCode: 400, body: "Missing required fields." };
    }

    const isAnnual = plan === "annual";
    const isLifetime = plan === "lifetime";

    if (!isAnnual && !isLifetime) {
      return { statusCode: 400, body: "Invalid plan." };
    }

    const priceId = isAnnual ? PRICE_ANNUAL : PRICE_LIFETIME;
    const mode = isAnnual ? "subscription" : "payment";

    const successUrl = `${site_url}/thankyou.html?success=1`;
    const cancelUrl = `${site_url}/offers.html?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: user_email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id,
        plan
      }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || String(err) })
    };
  }
};
