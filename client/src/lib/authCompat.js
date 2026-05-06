import { supabase } from "../config/firbase";
import { BACKEND_BASE_URL } from "../constants";

const SESSION_KEY = "mv_current_user";

function normalizeUser(row) {
  if (!row) return null;
  return {
    uid: row.uid || row.id,
    id: row.id,
    email: row.email,
    displayName: row.name || row.email,
    name: row.name || row.email,
    isNew: row.isNew,
    isPaid: row.isPaid,
  };
}

function readSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSessionUser(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event("mv-auth-changed"));
}

export async function createUserWithEmailAndPassword(_auth, email, password) {
  const { data: existing, error: existingError } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
  if (existingError) throw existingError;
  if (existing) throw new Error("User with this email already exists.");

  const uid = crypto?.randomUUID?.() || `u_${Date.now()}`;
  const baseName = email.split("@")[0];
  const row = {
    id: uid,
    uid,
    email,
    password,
    name: baseName,
    isNew: true,
    isPaid: false,
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("users").insert(row);
  if (error) throw error;

  const user = normalizeUser(row);
  writeSessionUser(user);
  return { user };
}

export async function signInWithEmailAndPassword(_auth, email, password) {
  const { data: row, error } = await supabase
    .from("users")
    .select("id, uid, email, name, isNew, isPaid, password")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  if (!row) throw new Error("No account found for this email.");
  if (!row.password || row.password !== password) throw new Error("Invalid email or password.");

  const user = normalizeUser(row);
  writeSessionUser(user);
  return { user };
}

export async function signOut(_auth) {
  writeSessionUser(null);
}

export async function sendPasswordResetEmail(_auth, email, options = {}) {
  const { data, error } = await supabase.from("users").select("id, email, name").eq("email", email).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No account found for this email.");

  const resetToken = crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const { error: tokenSaveError } = await supabase
    .from("users")
    .update({
      reset_token: resetToken,
      reset_token_expires_at: resetTokenExpiresAt,
    })
    .eq("id", data.id);

  if (tokenSaveError) {
    throw new Error("Reset token could not be saved. Add reset_token columns in Supabase.");
  }

  const resetBaseUrl = options.url || `${window.location.origin}/reset-password`;
  const separator = resetBaseUrl.includes("?") ? "&" : "?";
  const resetUrl = `${resetBaseUrl}${separator}token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(data.email)}`;
  const subject = "Reset your Maratha Vadhuvar password";
  const html = `
    <p>Namaskar ${data.name || "User"},</p>
    <p>Click the link below to reset your password. This link is valid for 30 minutes.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  const response = await fetch(`${BACKEND_BASE_URL}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: data.email, subject, html }),
  });

  if (!response.ok) {
    let message = "Failed to send reset email";
    try {
      const payload = await response.json();
      message = payload?.error || payload?.message || message;
    } catch {
      // Ignore JSON parse failures and keep generic message.
    }
    throw new Error(message);
  }
}

export async function updatePassword(_auth, newPassword, resetContext = null) {
  if (resetContext?.token && resetContext?.email) {
    const { data: row, error: findError } = await supabase
      .from("users")
      .select("id, reset_token, reset_token_expires_at")
      .eq("email", resetContext.email)
      .eq("reset_token", resetContext.token)
      .maybeSingle();

    if (findError) throw findError;
    if (!row) throw new Error("Invalid reset link.");

    const expiry = row.reset_token_expires_at ? new Date(row.reset_token_expires_at).getTime() : 0;
    if (!expiry || expiry < Date.now()) {
      throw new Error("Reset link expired. Please request a new one.");
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: newPassword,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq("id", row.id);

    if (updateError) throw updateError;
    return;
  }

  const user = readSessionUser();
  if (!user?.uid) throw new Error("No user session found.");
  const { error } = await supabase.from("users").update({ password: newPassword }).eq("id", user.uid);
  if (error) throw error;
}

export function onAuthStateChanged(_auth, callback) {
  const emit = () => callback(readSessionUser());
  emit();

  const onStorage = (event) => {
    if (!event.key || event.key === SESSION_KEY) emit();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("mv-auth-changed", emit);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("mv-auth-changed", emit);
  };
}

export { normalizeUser, supabase };
