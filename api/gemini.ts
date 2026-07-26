// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function — Gemini proxy
// Keeps the Gemini API key server-side. The browser calls /api/gemini (same
// origin) and never sees the key. Configure with a NON-public env var in Vercel:
//   GEMINI_API_KEY   (required)  — your Gemini API key
//   GEMINI_MODEL     (optional)  — defaults to "gemini-2.0-flash"
//
//   GET  /api/gemini          -> { enabled: boolean }   (capability check, no secret)
//   POST /api/gemini {prompt}  -> { text: string }        (generate content)
// ─────────────────────────────────────────────────────────────────────────────

// Runs on Vercel's Node.js runtime (the default for /api functions).

const MAX_PROMPT_CHARS = 8000;

// Loosely typed to avoid a build-time dependency on @vercel/node types.
export default async function handler(req: any, res: any): Promise<void> {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  // Capability check — lets the client know if real AI is available, no secret leaked.
  if (req.method === "GET") {
    res.status(200).json({ enabled: Boolean(key), model });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!key) {
    res.status(503).json({ error: "not_configured" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const prompt = String(body?.prompt ?? "").slice(0, MAX_PROMPT_CHARS);
    if (!prompt.trim()) {
      res.status(400).json({ error: "missing_prompt" });
      return;
    }

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      },
    );

    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 500);
      res.status(upstream.status).json({ error: "upstream_error", status: upstream.status, detail });
      return;
    }

    const data: any = await upstream.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    res.status(200).json({ text });
  } catch (e: any) {
    res.status(500).json({ error: "proxy_exception", detail: String(e?.message ?? e).slice(0, 300) });
  }
}
