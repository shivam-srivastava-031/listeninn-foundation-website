// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function — Counseling content store
//
// Lets admins edit the public "1:1 Counseling" details (therapists, credentials,
// charges, sliding scale) from the admin panel, and serves that content to all
// visitors. Backed by a hosted key-value store over its REST API, so there is no
// npm dependency (same dependency-free style as api/gemini.ts).
//
// Environment variables (set in Vercel → Settings → Environment Variables):
//   KV_REST_API_URL         (required for saving) — REST URL of the KV store
//   KV_REST_API_TOKEN       (required for saving) — REST token of the KV store
//   ADMIN_PANEL_PASSWORD    (required for saving) — must match what the admin types
//
// Compatible with Vercel KV / Upstash Redis (both expose KV_REST_API_URL &
// KV_REST_API_TOKEN). Also accepts UPSTASH_REDIS_REST_URL / _TOKEN as fallbacks.
//
//   GET  /api/counseling                     -> CounselingContent (public read)
//   POST /api/counseling {password, content} -> { ok: true }       (admin write)
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "counseling_content";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const DEFAULT_CONTENT = {
  published: false,
  intro:
    "We're finalising our counseling team and will publish full details here — each professional's credentials, session charges, and our sliding-scale brackets — so you know exactly what to expect before you ever book.",
  therapists: [],
  fees: [],
  slidingScaleNote:
    "Cost should never be the reason someone goes without support. When counseling launches, a sliding scale and a number of free places will be available — just ask.",
};

/** Read the stored value via the KV REST API. Returns null if unset/unavailable. */
async function kvGet(): Promise<any | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    // Upstash returns { result: "<stringified JSON>" | null }
    if (data?.result == null) return null;
    return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
  } catch {
    return null;
  }
}

/** Persist the value via the KV REST API. Returns true on success. */
async function kvSet(value: unknown): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/${KEY}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(JSON.stringify(value)),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any): Promise<void> {
  // ── Public read ──
  if (req.method === "GET") {
    const stored = await kvGet();
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=300");
    res.status(200).json(stored ?? DEFAULT_CONTENT);
    return;
  }

  // ── Admin write ──
  if (req.method === "POST") {
    const adminPwd = process.env.ADMIN_PANEL_PASSWORD || "";
    let body: any = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    } catch {
      res.status(400).json({ error: "bad_json" });
      return;
    }

    // Auth: the server password must be configured AND match.
    if (!adminPwd || String(body?.password ?? "") !== adminPwd) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    if (!KV_URL || !KV_TOKEN) {
      res.status(503).json({ error: "kv_not_configured" });
      return;
    }

    const content = body?.content;
    if (typeof content !== "object" || content === null) {
      res.status(400).json({ error: "missing_content" });
      return;
    }

    const ok = await kvSet(content);
    if (!ok) {
      res.status(502).json({ error: "kv_write_failed" });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "method_not_allowed" });
}
