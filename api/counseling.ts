// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function — Counseling content store (Supabase-backed)
//
// Lets admins edit the public "1:1 Counseling" details (therapists, credentials,
// charges, sliding scale) from the admin panel, and serves that content to all
// visitors. Backed by Supabase over its REST (PostgREST) API — no npm dependency
// (same dependency-free style as api/gemini.ts).
//
// The Supabase service-role key stays SERVER-SIDE only (never shipped to the
// browser), so writes are safe even with a single-row public table.
//
// Environment variables (Vercel → Settings → Environment Variables):
//   SUPABASE_URL                  (required) — e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY     (required) — service_role key (SECRET, server-only)
//   ADMIN_PANEL_PASSWORD          (required for saving) — must match admin login
//
// One-time table setup (run in Supabase → SQL editor):
//   create table if not exists site_content (
//     key   text primary key,
//     value jsonb not null,
//     updated_at timestamptz default now()
//   );
//   -- No RLS policy needed: only the server (service_role) touches this table.
//
//   GET  /api/counseling                     -> CounselingContent (public read)
//   POST /api/counseling {password, content} -> { ok: true }       (admin write)
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "counseling_content";
const TABLE = "site_content";

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
// Accept the canonical name, plus a couple of common alternates admins may use.
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  "";

const DEFAULT_CONTENT = {
  published: false,
  intro:
    "We're finalising our counseling team and will publish full details here — each professional's credentials, session charges, and our sliding-scale brackets — so you know exactly what to expect before you ever book.",
  therapists: [],
  fees: [],
  slidingScaleNote:
    "Cost should never be the reason someone goes without support. When counseling launches, a sliding scale and a number of free places will be available — just ask.",
};

const configured = () => Boolean(SUPABASE_URL && SERVICE_KEY);

const sbHeaders = () => ({
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
});

/** Read the single content row from Supabase. Returns null if unset/unavailable. */
async function sbGet(): Promise<any | null> {
  if (!configured()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?key=eq.${KEY}&select=value`,
      { headers: sbHeaders() },
    );
    if (!res.ok) return null;
    const rows: any = await res.json();
    if (Array.isArray(rows) && rows.length > 0) return rows[0]?.value ?? null;
    return null;
  } catch {
    return null;
  }
}

/** Upsert the content row into Supabase. Returns true on success. */
async function sbSet(value: unknown): Promise<boolean> {
  if (!configured()) return false;
  try {
    // on_conflict=key + merge-duplicates makes this an idempotent upsert.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=key`,
      {
        method: "POST",
        headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ key: KEY, value, updated_at: new Date().toISOString() }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any): Promise<void> {
  // ── Diagnostic capability check (no secrets leaked, booleans only) ──
  // GET /api/counseling?check=1 -> which env vars the server can see.
  const wantsCheck =
    (req.query?.check ?? "") === "1" || String(req.url ?? "").includes("check=1");
  if (req.method === "GET" && wantsCheck) {
    res.setHeader("Cache-Control", "no-store");
    // Report NAMES only (never values) of any SUPABASE_* / KV_* / ADMIN_* vars
    // the server can see, plus the length of the resolved key, to diagnose
    // naming/scoping issues without leaking secrets.
    const relatedNames = Object.keys(process.env)
      .filter((k) => /SUPABASE|KV_|ADMIN|SERVICE_ROLE|UPSTASH/i.test(k))
      .sort();

    // Probe the table directly (read-only) and surface Supabase's real status,
    // so a missing table / bad key shows up as a concrete error, not a blank 502.
    let tableProbe: any = "skipped (url or key missing)";
    if (configured()) {
      try {
        const probe = await fetch(
          `${SUPABASE_URL}/rest/v1/${TABLE}?select=key&limit=1`,
          { headers: sbHeaders() },
        );
        tableProbe = {
          status: probe.status,
          ok: probe.ok,
          detail: probe.ok ? "" : (await probe.text()).slice(0, 300),
        };
      } catch (e: any) {
        tableProbe = { error: String(e?.message ?? e).slice(0, 200) };
      }
    }

    res.status(200).json({
      supabaseUrlSet: Boolean(SUPABASE_URL),
      supabaseKeySet: Boolean(SERVICE_KEY),
      supabaseKeyLength: SERVICE_KEY.length,
      adminPasswordSet: Boolean(process.env.ADMIN_PANEL_PASSWORD),
      relatedEnvNames: relatedNames,
      tableProbe,
    });
    return;
  }

  // ── Public read ──
  if (req.method === "GET") {
    const stored = await sbGet();
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

    if (!configured()) {
      res.status(503).json({ error: "supabase_not_configured" });
      return;
    }

    const content = body?.content;
    if (typeof content !== "object" || content === null) {
      res.status(400).json({ error: "missing_content" });
      return;
    }

    const ok = await sbSet(content);
    if (!ok) {
      res.status(502).json({ error: "supabase_write_failed" });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "method_not_allowed" });
}
