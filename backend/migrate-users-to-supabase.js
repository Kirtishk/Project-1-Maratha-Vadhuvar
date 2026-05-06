import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_FILE = "users.json";
const TABLE = "users";
const BATCH_SIZE = 200;

function isFirestoreTimestamp(value) {
  return value && typeof value === "object" && Number.isFinite(value._seconds);
}

function toIsoMaybe(value) {
  if (!value) return null;
  if (isFirestoreTimestamp(value)) {
    return new Date((value._seconds * 1000) + Math.floor((value._nanoseconds || 0) / 1e6)).toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
  }
  return null;
}

function toNullableInt(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function toNullableFloat(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

function toBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeRow(row) {
  const id = row.id || row.uid;
  if (!id) return null;

  const payment = row.payment && typeof row.payment === "object"
    ? {
        ...row.payment,
        submittedAt: toIsoMaybe(row.payment.submittedAt),
      }
    : {};

  return {
    id: String(id),
    uid: String(row.uid || id),
    name: row.name || row.email?.split("@")?.[0] || "Unknown",
    email: row.email || null,
    password: row.password || null,
    mobile: row.mobile || null,
    gender: row.gender || null,
    dob: row.dob || null,
    tob: row.tob || null,
    age: toNullableInt(row.age),
    address: row.address || null,
    district: row.district || null,
    taluka: row.taluka || null,
    village: row.village || null,
    nativePlace: row.nativePlace || null,
    jaat: row.jaat || null,
    bloodGroup: row.bloodGroup || null,
    color: row.color || null,
    education: row.education || null,
    profession: row.profession || null,
    fatherName: row.fatherName || null,
    motherName: row.motherName || null,
    fatherProfession: row.fatherProfession || null,
    parentsAddress: row.parentsAddress || null,
    workAddress: row.workAddress || null,
    ancestralSurname: row.ancestralSurname || null,
    annualIncome: toNullableFloat(row.annualIncome),
    monthlyIncome: toNullableFloat(row.monthlyIncome),
    heightFeet: toNullableFloat(row.heightFeet),
    heightInch: toNullableFloat(row.heightInch),
    brothers: toNullableInt(row.brothers),
    sisters: toNullableInt(row.sisters),
    hobbies: Array.isArray(row.hobbies) ? row.hobbies : [],
    photos: Array.isArray(row.photos) ? row.photos : [],
    profileImage: row.profileImage || null,
    specialNotes: row.specialNotes || null,
    dayOfWeek: row.dayOfWeek || null,
    gotra: row.gotra || null,
    astrology: row.astrology && typeof row.astrology === "object" ? row.astrology : {},
    payment,
    isNew: toBool(row.isNew, false),
    isPaid: toBool(row.isPaid, false),
    isRejected: toBool(row.isRejected, false),
    createdAt: toIsoMaybe(row.createdAt),
    submittedAt: toIsoMaybe(row.submittedAt),
  };
}

async function upsertBatch(rows) {
  const normalizedRows = await reconcileExistingEmails(rows);
  const dedupedRows = dedupeByEmail(normalizedRows);
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=id`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(dedupedRows),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upsert failed (${res.status}): ${text}`);
  }
}

function dedupeByEmail(rows) {
  const seen = new Set();
  const out = [];

  for (let i = rows.length - 1; i >= 0; i -= 1) {
    const row = rows[i];
    const emailKey = (row.email || "").trim().toLowerCase();
    if (emailKey) {
      if (seen.has(emailKey)) continue;
      seen.add(emailKey);
    }
    out.push(row);
  }

  return out.reverse();
}

async function reconcileExistingEmails(rows) {
  const emails = [...new Set(rows.map((r) => (r.email || "").trim().toLowerCase()).filter(Boolean))];
  if (!emails.length) return rows;

  const emailFilter = emails.map((e) => `"${e.replaceAll('"', '\\"')}"`).join(",");
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,email&email=in.(${emailFilter})`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase email lookup failed (${res.status}): ${text}`);
  }

  const existing = await res.json();
  const existingByEmail = new Map(
    existing
      .filter((r) => r?.email && r?.id)
      .map((r) => [String(r.email).trim().toLowerCase(), String(r.id)]),
  );

  return rows.map((row) => {
    const key = (row.email || "").trim().toLowerCase();
    const existingId = key ? existingByEmail.get(key) : null;
    if (!existingId) return row;
    return {
      ...row,
      id: existingId,
      uid: row.uid || existingId,
    };
  });
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL (or VITE_SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  }

  const inputArg = process.argv[2];
  const filePath = path.resolve(process.cwd(), inputArg || DEFAULT_FILE);

  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Input JSON must be an array of users");
  }

  const normalized = parsed.map(normalizeRow).filter(Boolean);
  console.log(`Loaded ${parsed.length} rows; ${normalized.length} valid rows to upsert`);

  let done = 0;
  for (let i = 0; i < normalized.length; i += BATCH_SIZE) {
    const batch = normalized.slice(i, i + BATCH_SIZE);
    await upsertBatch(batch);
    done += batch.length;
    console.log(`Upserted ${done}/${normalized.length}`);
  }

  console.log("Migration completed.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
