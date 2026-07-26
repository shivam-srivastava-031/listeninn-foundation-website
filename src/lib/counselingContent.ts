// ─────────────────────────────────────────────────────────────────────────────
// Counseling content — editable by admins, shown to all visitors.
//
// The content is stored server-side (a hosted key-value store, read/written via
// /api/counseling) so that edits made in the admin panel are visible to EVERY
// visitor, not just the browser that made them. If the store isn't configured
// yet, the API returns these defaults, so the page always renders.
// ─────────────────────────────────────────────────────────────────────────────

/** One therapist's public profile. */
export interface Therapist {
  name: string; // e.g. "Dr. Jane Doe"
  title: string; // e.g. "Clinical Psychologist"
  credentials: string; // e.g. "M.Phil Clinical Psychology · RCI-registered (A-12345)"
  focus: string; // e.g. "anxiety, grief, trauma, relationships"
}

/** A sliding-scale pricing tier. */
export interface FeeTier {
  label: string; // e.g. "Standard" / "Reduced" / "Supported"
  amount: string; // e.g. "₹1,200 per 50-min session"
  note: string; // e.g. "for those who can pay the full rate"
}

export interface CounselingContent {
  /** Master switch: when false, the page shows the "coming soon" placeholder. */
  published: boolean;
  /** Short intro shown above the details. */
  intro: string;
  therapists: Therapist[];
  fees: FeeTier[];
  /** Free-text note under the fees (e.g. how to request a reduced rate). */
  slidingScaleNote: string;
}

/** Safe defaults — used before anything is published, and as an API fallback. */
export const DEFAULT_COUNSELING: CounselingContent = {
  published: false,
  intro:
    "We're finalising our counseling team and will publish full details here — each professional's credentials, session charges, and our sliding-scale brackets — so you know exactly what to expect before you ever book.",
  therapists: [],
  fees: [],
  slidingScaleNote:
    "Cost should never be the reason someone goes without support. When counseling launches, a sliding scale and a number of free places will be available — just ask.",
};

// ── Client helpers ───────────────────────────────────────────────────────────

const API = "/api/counseling";

/** Fetch the live counseling content. Falls back to defaults on any error. */
export async function fetchCounselingContent(): Promise<CounselingContent> {
  try {
    const res = await fetch(API, { headers: { Accept: "application/json" } });
    if (!res.ok) return DEFAULT_COUNSELING;
    const data = (await res.json()) as Partial<CounselingContent>;
    // Merge over defaults so a partial/old payload can't break the page.
    return {
      ...DEFAULT_COUNSELING,
      ...data,
      therapists: Array.isArray(data.therapists) ? data.therapists : [],
      fees: Array.isArray(data.fees) ? data.fees : [],
    };
  } catch {
    return DEFAULT_COUNSELING;
  }
}

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Save counseling content (admin only — requires the admin password). */
export async function saveCounselingContent(
  content: CounselingContent,
  password: string,
): Promise<SaveResult> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, content }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 401) return { ok: false, error: "Wrong admin password." };
    if (res.status === 503)
      return {
        ok: false,
        error:
          "Cloud storage isn't configured yet. Add the KV environment variables in Vercel (see setup notes), then redeploy.",
      };
    const detail = await res.text();
    return { ok: false, error: `Save failed (${res.status}). ${detail.slice(0, 140)}` };
  } catch (e) {
    return { ok: false, error: `Network error: ${String((e as Error)?.message ?? e).slice(0, 140)}` };
  }
}
