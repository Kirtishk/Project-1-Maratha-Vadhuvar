import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
const RESET_PATH = "/reset-password";
const TOKEN_TTL_MINUTES = 60 * 24 * 3; // 3 days
const DELAY_MS = 350;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildResetUrl(token, email) {
  const base = `${CLIENT_BASE_URL.replace(/\/+$/, "")}${RESET_PATH}`;
  return `${base}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
}

function emailHtml(name, resetUrl) {
  return `
    <p>Namaskar ${name || "Member"},</p>
    <p>We are very sorry for the inconvenience caused due to recent login and account migration issues.</p>
    <p>To keep your account secure, please reset your password using the link below:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link is valid for 3 days.</p>
    <p>We truly appreciate your patience and support while we improve the platform.</p>
    <p>Regards,<br/>Maratha Vadhuvar Team</p>
  `;
}

async function supabaseRequest(path, method = "GET", body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase request failed (${res.status}): ${text}`);
  }

  if (method === "GET") return res.json();
  return null;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  }
  if (!MAIL_USER || !MAIL_PASS) {
    throw new Error("Missing MAIL_USER or MAIL_PASS in backend/.env");
  }

  const users = await supabaseRequest("users?select=id,email,name&email=not.is.null");
  const targets = users.filter((u) => u?.id && u?.email);
  console.log(`Found ${targets.length} users with email`);

  let sent = 0;
  let failed = 0;

  for (const user of targets) {
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000).toISOString();

      await supabaseRequest(`users?id=eq.${encodeURIComponent(user.id)}`, "PATCH", {
        reset_token: token,
        reset_token_expires_at: expiresAt,
      });

      const resetUrl = buildResetUrl(token, user.email);
      await transporter.sendMail({
        from: `"Maratha Vadhuvar" <${MAIL_USER}>`,
        to: user.email,
        subject: "Important: Please reset your Maratha Vadhuvar password",
        html: emailHtml(user.name, resetUrl),
      });

      sent += 1;
      console.log(`Sent ${sent}/${targets.length}: ${user.email}`);
    } catch (err) {
      failed += 1;
      console.error(`Failed for ${user.email}: ${err.message || err}`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`Done. Sent: ${sent}, Failed: ${failed}, Total: ${targets.length}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

