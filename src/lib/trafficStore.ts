// ─────────────────────────────────────────────────────────────────────────────
// ListenInn Foundation — Traffic & Analytics Store
// Tracks real usage: page visits, chat events, FAQ queries, language usage.
// All data persists in localStorage under "listeninn_traffic".
// ─────────────────────────────────────────────────────────────────────────────

const TRAFFIC_KEY = "listeninn_traffic";

// ━━━━━━━━━━━━━━━━━━━ Interfaces ━━━━━━━━━━━━━━━━━━━

export interface PageVisit {
  route: string;
  timestamp: string;
}

export interface ChatEvent {
  mode: string;          // "open" | "faq" | "volunteer" | "donate" | "feedback" | "programs"
  timestamp: string;
}

export interface FaqQuery {
  query: string;
  timestamp: string;
}

export interface TrafficData {
  pageVisits: PageVisit[];
  chatEvents: ChatEvent[];
  faqQueries: FaqQuery[];
}

// ━━━━━━━━━━━━━━━━━━━ Loader ━━━━━━━━━━━━━━━━━━━

function loadTraffic(): TrafficData {
  try {
    const raw = localStorage.getItem(TRAFFIC_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<TrafficData>;
      if (typeof parsed !== "object" || Array.isArray(parsed)) return empty();
      return {
        pageVisits: Array.isArray(parsed.pageVisits) ? parsed.pageVisits : [],
        chatEvents: Array.isArray(parsed.chatEvents) ? parsed.chatEvents : [],
        faqQueries: Array.isArray(parsed.faqQueries) ? parsed.faqQueries : [],
      };
    }
  } catch { /* ignore */ }
  return empty();
}

function empty(): TrafficData {
  return { pageVisits: [], chatEvents: [], faqQueries: [] };
}

function saveTraffic(data: TrafficData) {
  try { localStorage.setItem(TRAFFIC_KEY, JSON.stringify(data)); } catch { /* quota */ }
}

// ━━━━━━━━━━━━━━━━━━━ Write Helpers ━━━━━━━━━━━━━━━━━━━

/** Record a page navigation event */
export function recordPageVisit(route: string): void {
  const data = loadTraffic();
  data.pageVisits.push({ route: String(route).slice(0, 100), timestamp: new Date().toISOString() });
  // Keep last 1000 entries to prevent unbounded growth
  if (data.pageVisits.length > 1000) data.pageVisits = data.pageVisits.slice(-1000);
  saveTraffic(data);
}

/** Record a chat widget interaction (open, mode change) */
export function recordChatEvent(mode: string): void {
  const data = loadTraffic();
  data.chatEvents.push({ mode: String(mode).slice(0, 50), timestamp: new Date().toISOString() });
  if (data.chatEvents.length > 1000) data.chatEvents = data.chatEvents.slice(-1000);
  saveTraffic(data);
}

/** Record an FAQ/chat query (for most-searched-terms analytics) */
export function recordFaqQuery(query: string): void {
  if (!query.trim()) return;
  const data = loadTraffic();
  // S4: max 200 chars per query
  data.faqQueries.push({ query: String(query).slice(0, 200).trim(), timestamp: new Date().toISOString() });
  if (data.faqQueries.length > 500) data.faqQueries = data.faqQueries.slice(-500);
  saveTraffic(data);
}

// ━━━━━━━━━━━━━━━━━━━ Read / Stats ━━━━━━━━━━━━━━━━━━━

export function getTrafficStats() {
  const data = loadTraffic();

  // Page visit counts by route
  const pageHits: Record<string, number> = {};
  for (const v of data.pageVisits) {
    pageHits[v.route] = (pageHits[v.route] || 0) + 1;
  }

  // Chat mode usage counts
  const chatModes: Record<string, number> = {};
  for (const e of data.chatEvents) {
    chatModes[e.mode] = (chatModes[e.mode] || 0) + 1;
  }

  // Top FAQ search terms
  const termCounts: Record<string, number> = {};
  for (const q of data.faqQueries) {
    const term = q.query.toLowerCase().trim();
    termCounts[term] = (termCounts[term] || 0) + 1;
  }
  const topFaqTerms = Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([term, count]) => ({ term, count }));

  // Page visits sorted
  const topPages = Object.entries(pageHits)
    .sort((a, b) => b[1] - a[1])
    .map(([route, count]) => ({ route, count }));

  // Chat mode chart data
  const chatModeChart = Object.entries(chatModes)
    .map(([mode, count]) => ({ mode, count }))
    .sort((a, b) => b.count - a.count);

  // Language distribution from chatEvents that include language (stored as "lang:English" etc.)
  const langCounts: Record<string, number> = {};
  for (const e of data.chatEvents) {
    if (e.mode.startsWith("lang:")) {
      const lang = e.mode.slice(5);
      langCounts[lang] = (langCounts[lang] || 0) + 1;
    }
  }
  const languageChart = Object.entries(langCounts).map(([lang, count]) => ({ lang, count }));

  return {
    totalPageVisits: data.pageVisits.length,
    totalChatOpens: data.chatEvents.filter(e => e.mode === "open").length,
    totalFaqQueries: data.faqQueries.length,
    topPages,
    chatModeChart,
    topFaqTerms,
    languageChart,
    raw: data,
  };
}

/** Clear all traffic data */
export function clearTrafficData(): void {
  localStorage.removeItem(TRAFFIC_KEY);
}

/** Export traffic data as CSV */
export function exportTrafficToCSV(): void {
  const data = loadTraffic();
  const rows = [
    ["Type", "Value", "Timestamp"],
    ...data.pageVisits.map(v => ["Page Visit", v.route, v.timestamp]),
    ...data.chatEvents.map(e => ["Chat Event", e.mode, e.timestamp]),
    ...data.faqQueries.map(q => ["FAQ Query", q.query.replace(/"/g, '""'), q.timestamp]),
  ];
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `listeninn-traffic-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
