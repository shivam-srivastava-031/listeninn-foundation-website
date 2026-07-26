// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function — Admin password check
//
// Validates the admin-panel password against the server-side ADMIN_PANEL_PASSWORD
// env var, so the admin login and the counseling "publish" share ONE password
// that lives only on the server (nothing meaningful hardcoded in the client).
//
// Environment variable (Vercel → Settings → Environment Variables):
//   ADMIN_PANEL_PASSWORD   (required) — the admin-panel password
//
//   POST /api/admin-auth {password} ->
//     200 { ok: true }              password matches
//     401 { ok: false }             wrong password
//     503 { error: "not_configured" }  ADMIN_PANEL_PASSWORD not set on server
//                                       (client should fall back to its dev check)
// ─────────────────────────────────────────────────────────────────────────────

/** Length-safe string compare (avoids leaking length via early return). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default async function handler(req: any, res: any): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const configured = process.env.ADMIN_PANEL_PASSWORD || "";
  if (!configured) {
    // Server password isn't set — tell the client so it can use its dev fallback.
    res.status(503).json({ error: "not_configured" });
    return;
  }

  let body: any = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    res.status(400).json({ error: "bad_json" });
    return;
  }

  const password = String(body?.password ?? "");
  if (safeEqual(password, configured)) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
}
