// netlify/functions/send-contact.js
// Send contact email via Brevo Transactional API (Sendinblue)
//
// Env vars (Netlify > Site settings > Environment variables):
// - BREVO_API_KEY (required)
// - BREVO_SENDER_EMAIL (required: must be a verified sender in Brevo)
// - BREVO_SENDER_NAME (optional)
// - BREVO_TO_EMAIL (optional; defaults to clavis.service.client@gmail.com)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!email || !subject || !message) {
    return json(400, { error: "Missing fields" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Invalid email" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Clavis-security";
  const toEmail = process.env.BREVO_TO_EMAIL || "clavis.service.client@gmail.com";

  if (!apiKey || !senderEmail) {
    return json(500, { error: "Brevo not configured (missing env vars)" });
  }

  const now = new Date().toISOString();
  const htmlContent =
    '<div style="font-family:Arial,sans-serif; line-height:1.5;">' +
    "<h2>Nouveau message (Contact Clavis-security)</h2>" +
    "<p><strong>Date :</strong> " + escapeHtml(now) + "</p>" +
    "<p><strong>Email :</strong> " + escapeHtml(email) + "</p>" +
    "<p><strong>Sujet :</strong> " + escapeHtml(subject) + "</p>" +
    "<p><strong>Message :</strong></p>" +
    '<pre style="white-space:pre-wrap; background:#f4f4f4; padding:12px; border-radius:8px;">' +
    escapeHtml(message) +
    "</pre></div>";

  const payload = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: toEmail }],
    replyTo: { email: email, name: email },
    subject: "[Clavis Contact] " + subject,
    htmlContent,
  };

  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return json(502, { error: "Brevo error", details: text });
    }

    return json(200, { ok: true });
  } catch (e) {
    return json(502, { error: "Network error" });
  }
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
