// ─────────────────────────────────────────────────────────────────────────────
// ListenInn Foundation — Volunteer Management Database & AI Engine
// ─────────────────────────────────────────────────────────────────────────────

// ━━━━━━━━━━━━━━━━━━━ Interfaces ━━━━━━━━━━━━━━━━━━━

export interface AIScreening {
  fitScore: number;        // 0–100
  empathyRating: number;   // 0–100
  insights: string;
  risks: string;
  recommendedProjects: string[];
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeLink: string;
  skills: string[];
  availability: string;      // e.g. "10 hours/week"
  motivation: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;       // ISO date
  screening: AIScreening | null;
  matchedProjectId: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  minHoursPerWeek: number;
  currentVolunteers: number;
  targetVolunteers: number;
}

export interface ParticipationLog {
  id: string;
  volunteerId: string;
  date: string;
  hours: number;
  description: string;
  status: "completed" | "missed";
}

export interface Reminder {
  id: string;
  volunteerId: string;
  volunteerName: string;
  type: "shift_reminder" | "training_notice" | "check_in";
  message: string;
  date: string;
  status: "scheduled" | "sent";
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  timestamp: string;
}

export type Sentiment = "Positive" | "Neutral" | "Negative";

export interface Feedback {
  id: string;
  name: string;
  rating: number;       // 1–5
  comment: string;
  timestamp: string;
  aiSentiment: Sentiment;
}

export interface CallSession {
  id: string;
  date: string;
  durationMinutes: number;
  transcript: string;
  analyzed: boolean;
  emotions: string[];
  concerns: string[];
  anonymizedSummary: string;
  sentiment: Sentiment | null;
}

export interface SurveyResponse {
  id: string;
  date: string;
  type: "volunteer" | "beneficiary";
  satisfactionScore: number;
  comments: string;
}

export interface EventAttendance {
  id: string;
  eventName: string;
  date: string;
  attendees: number;
  platform: "in-person" | "online" | "social-media";
  engagementScore: number;
}

export interface AppSettings {
  geminiApiKey: string;
  useGemini: boolean;
}

export interface AppState {
  volunteers: Volunteer[];
  projects: Project[];
  participationLogs: ParticipationLog[];
  reminders: Reminder[];
  donations: Donation[];
  feedbacks: Feedback[];
  settings: AppSettings;
  callSessions: CallSession[];
  surveys: SurveyResponse[];
  events: EventAttendance[];
}

// ━━━━━━━━━━━━━━━━━━━ Helpers ━━━━━━━━━━━━━━━━━━━

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ━━━━━━━━━━━━━━━━━━━ Seed Data (one "test" record per collection) ━━━━━━━━━━━━━━━━━━━
// Projects are kept intact since the AI matching engine needs them.

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-helpline",
    title: "24/7 Helpline Support",
    description: "Staff our crisis helpline, providing immediate emotional support to callers in distress.",
    requiredSkills: ["active listening", "empathy", "crisis management", "communication"],
    minHoursPerWeek: 8,
    currentVolunteers: 0,
    targetVolunteers: 20,
  },
  {
    id: "proj-youth",
    title: "Youth Wellbeing Workshops",
    description: "Facilitate interactive mental health workshops for teens and young adults.",
    requiredSkills: ["public speaking", "youth engagement", "counseling", "creativity"],
    minHoursPerWeek: 5,
    currentVolunteers: 0,
    targetVolunteers: 10,
  },
  {
    id: "proj-support-groups",
    title: "Peer Support Groups",
    description: "Lead weekly peer support circles for people navigating grief, anxiety, and depression.",
    requiredSkills: ["facilitation", "empathy", "group dynamics", "patience"],
    minHoursPerWeek: 4,
    currentVolunteers: 0,
    targetVolunteers: 12,
  },
  {
    id: "proj-stigma",
    title: "Stigma Awareness Campaign",
    description: "Create content to normalise conversations about mental health.",
    requiredSkills: ["social media", "writing", "design", "community outreach"],
    minHoursPerWeek: 6,
    currentVolunteers: 0,
    targetVolunteers: 8,
  },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: "vol-test-001",
    name: "Test Volunteer",
    email: "test.volunteer@listeninn.org",
    phone: "+91 99999 00001",
    resumeLink: "https://linkedin.com/in/test-volunteer",
    skills: ["active listening", "empathy", "communication"],
    availability: "10 hours/week",
    motivation: "This is a test volunteer record. Created to verify the volunteer screening, matching, and participation workflows.",
    status: "pending",
    submittedAt: new Date().toISOString(),
    screening: null,
    matchedProjectId: null,
  },
];

const INITIAL_PARTICIPATION: ParticipationLog[] = [
  {
    id: "p-test-001",
    volunteerId: "vol-test-001",
    date: new Date().toISOString(),
    hours: 2,
    description: "Test participation log — verify participation tracking workflow",
    status: "completed",
  },
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: "r-test-001",
    volunteerId: "vol-test-001",
    volunteerName: "Test Volunteer",
    type: "shift_reminder",
    message: "Test reminder — verify the reminders hub and send-now workflow.",
    date: new Date().toISOString(),
    status: "scheduled",
  },
];

const INITIAL_DONATIONS: Donation[] = [
  {
    id: "d-test-001",
    name: "Test Donor",
    email: "test.donor@listeninn.org",
    amount: 100,
    timestamp: new Date().toISOString(),
  },
];

const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: "f-test-001",
    name: "Test Feedback",
    rating: 5,
    comment: "This is a test feedback record. All features are working correctly. Used to verify the feedback panel and sentiment analysis.",
    timestamp: new Date().toISOString(),
    aiSentiment: "Positive",
  },
];

const INITIAL_CALLS: CallSession[] = [
  {
    id: "call-test-001",
    date: new Date().toISOString(),
    durationMinutes: 15,
    transcript: "User: Hello, this is a test session.\nVolunteer: Hi! This is a test session to verify the conversation analysis workflow.\nUser: Everything looks good.\nVolunteer: Great! The AI analysis can be triggered using the Analyze button.",
    analyzed: false,
    emotions: [],
    concerns: [],
    anonymizedSummary: "",
    sentiment: null,
  },
];

const INITIAL_SURVEYS: SurveyResponse[] = [
  {
    id: "srv-test-001",
    date: new Date().toISOString(),
    type: "beneficiary",
    satisfactionScore: 9,
    comments: "Test survey record — verify impact measurement panel.",
  },
];

const INITIAL_EVENTS: EventAttendance[] = [
  {
    id: "evt-test-001",
    eventName: "Test Event",
    date: new Date().toISOString(),
    attendees: 10,
    platform: "online",
    engagementScore: 90,
  },
];

// ━━━━━━━━━━━━━━━━━━━ State Manager ━━━━━━━━━━━━━━━━━━━

const STORAGE_KEY = "listeninn-db";

// Build-time Gemini key (set VITE_GEMINI_API_KEY in .env.local / deploy env).
// When present, real AI is enabled automatically without touching the admin panel.
const ENV_GEMINI_KEY = (import.meta.env.VITE_GEMINI_API_KEY ?? "").trim();

function loadState(): AppState {
  const defaults = getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      // Shape validation — ensure it's a non-array object
      if (typeof parsed !== "object" || Array.isArray(parsed)) return defaults;
      const merged = { ...defaults, ...parsed };
      // Deep-merge settings so a stale localStorage blob can't wipe out newer defaults.
      merged.settings = { ...defaults.settings, ...(parsed.settings ?? {}) };
      // A build-time env key wins over an empty stored key and auto-enables real AI.
      if (!merged.settings.geminiApiKey && ENV_GEMINI_KEY) {
        merged.settings.geminiApiKey = ENV_GEMINI_KEY;
        merged.settings.useGemini = true;
      }
      return merged;
    }
  } catch { /* ignore */ }
  return defaults;
}

function getDefaultState(): AppState {
  return {
    volunteers: INITIAL_VOLUNTEERS,
    projects: INITIAL_PROJECTS,
    participationLogs: INITIAL_PARTICIPATION,
    reminders: INITIAL_REMINDERS,
    donations: INITIAL_DONATIONS,
    feedbacks: INITIAL_FEEDBACKS,
    settings: { geminiApiKey: ENV_GEMINI_KEY, useGemini: ENV_GEMINI_KEY.length > 0 },
    callSessions: INITIAL_CALLS,
    surveys: INITIAL_SURVEYS,
    events: INITIAL_EVENTS,
  };
}

let _state: AppState = loadState();
const _listeners: Set<() => void> = new Set();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_state)); } catch { /* quota */ }
}

function notify() {
  _listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function getState(): AppState {
  return _state;
}

export function resetState(): void {
  _state = getDefaultState();
  persist();
  notify();
}

/** Clears ALL localStorage stores (db + connect submissions + traffic) and reseeds test data. */
export function resetToTest(): void {
  localStorage.removeItem("listeninn-db");
  localStorage.removeItem("listeninn_connect_submissions");
  localStorage.removeItem("listeninn_traffic");
  _state = getDefaultState();
  persist();
  notify();
}

// ━━━━━━━━━━━━━━━━━ Mutations ━━━━━━━━━━━━━━━━━

export function addVolunteer(v: Omit<Volunteer, "id" | "status" | "submittedAt" | "screening" | "matchedProjectId">): Volunteer {
  const vol: Volunteer = {
    ...v,
    id: "vol-" + uid(),
    status: "pending",
    submittedAt: new Date().toISOString(),
    screening: null,
    matchedProjectId: null,
  };
  _state = { ..._state, volunteers: [..._state.volunteers, vol] };
  persist(); notify();
  return vol;
}

export function updateVolunteer(id: string, updates: Partial<Volunteer>): void {
  _state = {
    ..._state,
    volunteers: _state.volunteers.map((v) => v.id === id ? { ...v, ...updates } : v),
  };
  persist(); notify();
}

export function addParticipation(log: Omit<ParticipationLog, "id">): void {
  _state = { ..._state, participationLogs: [..._state.participationLogs, { ...log, id: "p-" + uid() }] };
  persist(); notify();
}

export function addReminder(r: Omit<Reminder, "id">): void {
  _state = { ..._state, reminders: [..._state.reminders, { ...r, id: "r-" + uid() }] };
  persist(); notify();
}

export function markReminderSent(id: string): void {
  _state = {
    ..._state,
    reminders: _state.reminders.map((r) => r.id === id ? { ...r, status: "sent" as const } : r),
  };
  persist(); notify();
}

export function addDonation(d: Omit<Donation, "id" | "timestamp">): void {
  _state = { ..._state, donations: [..._state.donations, { ...d, id: "d-" + uid(), timestamp: new Date().toISOString() }] };
  persist(); notify();
}

export function addFeedback(f: Omit<Feedback, "id" | "timestamp" | "aiSentiment">): Feedback {
  const sentiment = analyzeSentimentLocal(f.comment, f.rating);
  const fb: Feedback = { ...f, id: "f-" + uid(), timestamp: new Date().toISOString(), aiSentiment: sentiment };
  _state = { ..._state, feedbacks: [..._state.feedbacks, fb] };
  persist(); notify();
  return fb;
}

export function updateSettings(s: Partial<AppSettings>): void {
  _state = { ..._state, settings: { ..._state.settings, ...s } };
  persist(); notify();
}

export function updateProjectVolunteerCount(projectId: string, delta: number): void {
  _state = {
    ..._state,
    projects: _state.projects.map((p) =>
      p.id === projectId ? { ...p, currentVolunteers: p.currentVolunteers + delta } : p
    ),
  };
  persist(); notify();
}

// ━━━━━━━━━━━━━━━━━ Local AI Engine (Simulated) ━━━━━━━━━━━━━━━━━

const POSITIVE_WORDS = ["love", "passionate", "care", "help", "empathy", "kind", "support", "listen", "understand", "heal", "transform", "impact", "volunteer", "heart", "grateful", "wonderful", "amazing", "great", "excellent", "safe", "comfort", "hope", "thank", "incredible", "inspired"];
const NEGATIVE_WORDS = ["struggle", "difficult", "alone", "depressed", "anxious", "afraid", "lost", "hurt", "pain", "worry", "stress", "overwhelm", "crisis", "sad", "frustrated", "angry"];
const SKILL_MAP: Record<string, string[]> = {
  "proj-helpline": ["active listening", "empathy", "crisis management", "communication", "patience", "counseling"],
  "proj-youth": ["public speaking", "youth engagement", "creativity", "counseling", "teaching", "facilitation"],
  "proj-support-groups": ["facilitation", "empathy", "group dynamics", "patience", "active listening", "counseling"],
  "proj-stigma": ["social media", "writing", "design", "community outreach", "communication", "creativity"],
};

function countKeywords(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
}

export function screenVolunteerLocal(vol: Volunteer): AIScreening {
  const motivLen = vol.motivation.length;
  const posHits = countKeywords(vol.motivation, POSITIVE_WORDS);
  const negHits = countKeywords(vol.motivation, NEGATIVE_WORDS);
  const skillCount = vol.skills.length;

  let fitScore = Math.min(100, 50 + posHits * 5 + skillCount * 6 + Math.floor(motivLen / 30) * 2);
  fitScore = Math.max(30, fitScore - negHits * 2);

  let empathyRating = Math.min(100, 40 + posHits * 8 + (vol.motivation.toLowerCase().includes("personal") ? 10 : 0) + (vol.motivation.toLowerCase().includes("experience") ? 8 : 0) + skillCount * 3);

  const projectScores = INITIAL_PROJECTS.map((p) => {
    const required = SKILL_MAP[p.id] || p.requiredSkills;
    const overlap = vol.skills.filter((s) => required.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))).length;
    return { title: p.title, score: overlap };
  }).sort((a, b) => b.score - a.score);
  const recommendedProjects = projectScores.filter((p) => p.score > 0).slice(0, 2).map((p) => p.title);
  if (recommendedProjects.length === 0) recommendedProjects.push(projectScores[0].title);

  const insights = `${vol.name} demonstrates ${empathyRating >= 80 ? "exceptional" : empathyRating >= 60 ? "strong" : "developing"} empathetic capacity with ${posHits > 3 ? "deeply personal and emotionally rich" : posHits > 1 ? "genuine and thoughtful" : "clear"} motivation. Their skill set in ${vol.skills.slice(0, 3).join(", ")} aligns well with ${recommendedProjects[0]}. ${motivLen > 100 ? "The detailed application shows strong commitment and self-awareness." : "A concise but sincere application."} Overall fit assessment: ${fitScore >= 85 ? "Excellent candidate — recommend fast-track approval." : fitScore >= 70 ? "Good candidate — standard onboarding recommended." : "Promising applicant — may benefit from additional training before placement."}`;

  const risks = negHits > 2
    ? "Application contains emotional vulnerability indicators. Recommend pairing with experienced mentor and regular supervisory check-ins."
    : negHits > 0
    ? "Minor emotional indicators detected. Standard supervision protocols should suffice."
    : "No significant risk factors identified. Standard onboarding appropriate.";

  return { fitScore, empathyRating, insights, risks, recommendedProjects };
}

export function getProjectMatchScores(vol: Volunteer): { projectId: string; projectTitle: string; score: number; reason: string }[] {
  return INITIAL_PROJECTS.map((p) => {
    const required = SKILL_MAP[p.id] || p.requiredSkills;
    const overlap = vol.skills.filter((s) => required.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())));
    const overlapCount = overlap.length;
    const needRatio = (p.targetVolunteers - p.currentVolunteers) / p.targetVolunteers;
    const score = Math.min(100, Math.round(overlapCount / required.length * 60 + needRatio * 30 + (vol.availability.includes("10") || vol.availability.includes("12") ? 10 : vol.availability.includes("8") ? 7 : 3)));
    const reason = overlapCount > 0
      ? `${vol.name}'s skills in ${overlap.join(", ")} directly match this project's needs. ${needRatio > 0.3 ? "This project also has high staffing need." : "Team is nearing full capacity but can accommodate."}`
      : `Limited direct skill overlap, but ${vol.name}'s motivation and availability could contribute to the ${p.title} team with additional training.`;
    return { projectId: p.id, projectTitle: p.title, score, reason };
  }).sort((a, b) => b.score - a.score);
}

export function analyzeSentimentLocal(text: string, rating: number): Sentiment {
  const posHits = countKeywords(text, POSITIVE_WORDS);
  const negHits = countKeywords(text, NEGATIVE_WORDS);
  if (rating >= 4 && posHits > negHits) return "Positive";
  if (rating <= 2 || negHits > posHits + 1) return "Negative";
  return "Neutral";
}

export function analyzeCallLocal(callId: string): void {
  const call = _state.callSessions.find(c => c.id === callId);
  if (!call) return;
  const negHits = countKeywords(call.transcript, NEGATIVE_WORDS);
  const posHits = countKeywords(call.transcript, POSITIVE_WORDS);
  
  const emotions: string[] = [];
  if (negHits > 2) emotions.push("Stress", "Anxiety");
  if (posHits > 2) emotions.push("Relief", "Gratitude");
  if (emotions.length === 0) emotions.push("Neutral");

  const concerns: string[] = [];
  if (call.transcript.toLowerCase().includes("job") || call.transcript.toLowerCase().includes("money")) concerns.push("Financial stress");
  if (call.transcript.toLowerCase().includes("school") || call.transcript.toLowerCase().includes("exam")) concerns.push("Academic pressure");
  if (concerns.length === 0) concerns.push("General wellbeing");

  const sentiment = posHits > negHits ? "Positive" : negHits > posHits ? "Negative" : "Neutral";
  
  const updates: Partial<CallSession> = {
    analyzed: true,
    emotions,
    concerns,
    anonymizedSummary: "User reached out discussing " + concerns.join(" and ") + ". Volunteer provided support and validated their feelings. Emotions detected: " + emotions.join(", ") + ".",
    sentiment
  };
  
  _state = {
    ..._state,
    callSessions: _state.callSessions.map(c => c.id === callId ? { ...c, ...updates } : c)
  };
  persist(); notify();
}

export function queryNGOBrainLocal(query: string): string {
  // B5: sanitize input — max 500 chars, strip potential injection chars
  const safe = String(query).slice(0, 500).replace(/[<>]/g, "");
  const lower = safe.toLowerCase();
  if (lower.includes("volunteer")) return `We currently have ${_state.volunteers.length} volunteers. ${_state.volunteers.filter(v => v.status === 'approved').length} are approved.`;
  if (lower.includes("project")) return `We run ${_state.projects.length} active projects including Helpline and Workshops.`;
  if (lower.includes("donat") || lower.includes("fund")) return `Total funds raised: ₹${_state.donations.reduce((s, d) => s + d.amount, 0)}.`;
  return "Based on our records, we are actively supporting mental health through helplines, workshops, and peer groups. Ask me specific questions about volunteers, projects, or donations!";
}

// ━━━━━━━━━━━━━━━━━ Gemini API Integration ━━━━━━━━━━━━━━━━━

async function callGemini(prompt: string): Promise<string> {
  const key = _state.settings.geminiApiKey;
  if (!key) throw new Error("No Gemini API key configured");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function screenVolunteerAI(vol: Volunteer): Promise<AIScreening> {
  if (!_state.settings.useGemini || !_state.settings.geminiApiKey) {
    return screenVolunteerLocal(vol);
  }
  try {
    const prompt = `You are an AI screening assistant for ListenInn Foundation, an NGO providing free mental health support. Evaluate this volunteer application and return ONLY valid JSON (no markdown, no code fences):

Applicant: ${vol.name}
Skills: ${vol.skills.join(", ")}
Availability: ${vol.availability}
Motivation: "${vol.motivation}"

Return JSON with these fields:
- fitScore (number 0-100)
- empathyRating (number 0-100)
- insights (string, 2-3 sentences)
- risks (string, 1-2 sentences)
- recommendedProjects (array of strings from: "24/7 Helpline Support", "Youth Wellbeing Workshops", "Peer Support Groups", "Stigma Awareness Campaign")`;
    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as AIScreening;
  } catch {
    return screenVolunteerLocal(vol);
  }
}

export async function analyzeCallAI(callId: string): Promise<void> {
  if (!_state.settings.useGemini || !_state.settings.geminiApiKey) {
    analyzeCallLocal(callId);
    return;
  }
  const call = _state.callSessions.find(c => c.id === callId);
  if (!call) return;

  try {
    const prompt = `Analyze this mental health helpline transcript. Return ONLY valid JSON (no markdown, no code fences):
Transcript: "${call.transcript}"

Return JSON with these fields:
- emotions (array of strings, e.g. ["Anxiety", "Fear", "Relief"])
- concerns (array of strings, e.g. ["Financial stress", "Relationship issues"])
- anonymizedSummary (string, 2-3 sentences summarizing the situation without PII)
- sentiment (string: "Positive", "Neutral", or "Negative")`;
    
    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    _state = {
      ..._state,
      callSessions: _state.callSessions.map(c => c.id === callId ? { 
        ...c, 
        analyzed: true,
        emotions: result.emotions || [],
        concerns: result.concerns || [],
        anonymizedSummary: result.anonymizedSummary || "",
        sentiment: result.sentiment || "Neutral"
      } : c)
    };
    persist(); notify();
  } catch {
    analyzeCallLocal(callId);
  }
}

export async function queryNGOBrainAI(query: string): Promise<string> {
  if (!_state.settings.useGemini || !_state.settings.geminiApiKey) {
    return queryNGOBrainLocal(query);
  }
  try {
    const dbDump = JSON.stringify({
      volunteers: _state.volunteers.length,
      approved: _state.volunteers.filter(v => v.status === 'approved').length,
      donations: _state.donations.reduce((s,d)=>s+d.amount, 0),
      projects: _state.projects,
      events: _state.events,
      surveys: _state.surveys,
    });
    
    const prompt = `You are the 'NGO Brain' AI for ListenInn Foundation. You have access to the entire NGO database. Answer the admin's query concisely and accurately using this data context:
${dbDump}

Admin Query: "${String(query).slice(0, 500)}"`;
    return await callGemini(prompt);
  } catch {
    return queryNGOBrainLocal(query);
  }
}

/**
 * Grounding facts about ListenInn Foundation, assembled from the site's own
 * content so the AI answers from a single source of truth. Keep this in sync
 * with PROGRAMS_INFO and the contact/helpline details shown across the site.
 */
function buildKnowledgeBase(): string {
  const programs = PROGRAMS_INFO.map((p) => `- ${p.title}: ${p.desc}`).join("\n");
  return `ABOUT LISTENINN FOUNDATION
ListenInn Foundation is a non-profit (NGO) dedicated to free, confidential mental health support. Every service is 100% free — funded by donations — and available regardless of a person's background, income, or circumstance. Our belief: healing starts with being heard.

PROGRAMS & SERVICES
${programs}

KEY FACTS
- Helpline: 1-800-LISTEN-IN, available 24/7 (trained listeners always on call).
- Chat support hours: Mon–Sun, 8am–11pm.
- All conversations are confidential; users may remain anonymous.
- Counseling is delivered by licensed therapists (in-person or virtual), free of charge.
- Volunteers complete a 40-hour training program (active listening, empathy techniques, crisis protocols, self-care) and are mentored by experienced listeners.
- Contact: email listeninnfoundation@gmail.com (replies within 24 hours), the 1-800-LISTEN-IN helpline, or the website Contact page.

WAYS TO HELP (all available inside this chat)
- Register as a Volunteer.
- Make a Donation — e.g. ₹500 funds one free counseling session, ₹2,000 keeps the helpline running for a full day, ₹10,000 funds 10 sessions.
- Give Feedback about your experience.`;
}

export async function chatWithAI(userMessage: string, context: string, language: string = "English"): Promise<string> {
  if (!_state.settings.useGemini || !_state.settings.geminiApiKey) {
    return chatLocalFallback(userMessage, language);
  }
  try {
    const prompt = `You are the official AI assistant for ListenInn Foundation, an NGO providing free, confidential mental health support. You are warm, compassionate, and concise.

SCOPE — READ CAREFULLY:
- You ONLY discuss ListenInn Foundation: its mission, programs/services, helpline, volunteering, donations, feedback, contact details, and general mental-health encouragement in the context of ListenInn's support.
- If the user asks about anything unrelated (general knowledge, trivia, coding, homework, news, math, other organisations, etc.), do NOT answer it. Politely decline in ONE sentence and steer them back — e.g. "I'm ListenInn's assistant, so I can only help with our foundation and mental-health support — is there something about that I can help with?"
- Never invent facts, phone numbers, prices, statistics, staff names, or policies. If something isn't in the knowledge base below, say you don't have that detail and point them to the helpline (1-800-LISTEN-IN) or listeninnfoundation@gmail.com.
- Do NOT provide medical diagnoses or medical advice. If the user seems in distress or at risk, gently and immediately guide them to the 24/7 helpline (1-800-LISTEN-IN).

KNOWLEDGE BASE (your only source of truth):
${buildKnowledgeBase()}

Conversation so far:
${context}

User says: "${userMessage}"

Reply warmly in 2-4 sentences max. Use only facts from the knowledge base.
CRITICAL: You MUST respond in ${language}.`;
    const reply = (await callGemini(prompt)).trim();
    // Gemini can return an empty string when content is blocked or no candidate
    // is produced — fall back so the user never sees a blank bubble.
    return reply || chatLocalFallback(userMessage, language);
  } catch {
    return chatLocalFallback(userMessage, language);
  }
}

export async function testGeminiConnection(key: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say hello in one word." }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// ━━━━━━━━━━━━━━━━━ Local Chatbot Fallback ━━━━━━━━━━━━━━━━━

const FAQ_MAP: [RegExp, string][] = [
  [/(?:what|tell).*(listeninn|listen inn|foundation)/i, "ListenInn Foundation is an NGO dedicated to providing free, confidential mental health support. We offer a 24/7 helpline, 1:1 counseling, peer support groups, youth wellbeing programs, and crisis care. Every service is completely free. 💜"],
  [/(?:helpline|phone|call|crisis)/i, "Our helpline is available 24/7 at 1-800-LISTEN-IN. Trained listeners are always ready to talk. You don't have to carry it alone. 📞"],
  [/(?:free|cost|charge|pay|price)/i, "All our services are 100% free. We believe mental health support should be accessible to everyone regardless of financial situation. Your generosity through donations helps us keep it that way. 💛"],
  [/(?:confidential|private|secret|anonymous)/i, "Absolutely. All conversations are completely confidential. We follow strict privacy protocols and you can remain anonymous if you prefer. Your trust means everything to us. 🔒"],
  [/(?:volunteer|join|sign up|apply)/i, "We'd love to have you! Our volunteer program includes a 40-hour training in active listening, empathy techniques, and crisis protocols. You can apply right here in this chat — just click 'Register as Volunteer' below! 🤝"],
  [/(?:donate|donation|money|fund|support financially)/i, "Every rupee makes a difference! ₹500 funds one free counseling session, ₹2,000 keeps our helpline running for a full day, and ₹10,000 funds 10 sessions. You can donate right here in this chat! 💝"],
  [/(?:counsel|therapy|therapist)/i, "We offer free 1:1 counseling sessions with licensed therapists. Sessions are confidential and tailored to your needs. Contact us through the helpline or our contact page to schedule. 🌿"],
  [/(?:support group|peer|circle)/i, "Our weekly peer support circles bring people together who share similar experiences — grief, anxiety, depression, and more. It's a safe space where you're never alone. 🤗"],
  [/(?:youth|teen|young|school|student)/i, "Our Youth Wellbeing program creates safe spaces for young people. We run workshops in schools and communities, teaching emotional resilience and breaking the stigma around mental health. 🌱"],
  [/(?:hour|when|time|available|open)/i, "Our helpline is available 24 hours a day, 7 days a week. Chat support runs Mon–Sun from 8am to 11pm. We're here whenever you need us. 🕐"],
  [/(?:train|learning|program)/i, "Our 40-hour volunteer training program covers active listening, empathy techniques, crisis protocols, and self-care. You'll be mentored by experienced listeners throughout. 📚"],
  [/(?:mission|purpose|goal|why)/i, "Our mission is to ensure no one navigates their mental health journey alone. We provide free, compassionate, confidential support regardless of background, income, or circumstance. Because healing starts with being heard. 🎯"],
  [/(?:contact|reach|email|get in touch)/i, "You can reach us at listeninnfoundation@gmail.com, call our helpline at 1-800-LISTEN-IN, or visit our Contact page on the website. We reply to emails within 24 hours. 📧"],
  [/(?:hi|hello|hey|good morning|good evening)/i, "Hello! 👋 Welcome to ListenInn Foundation. I'm here to help you learn about our programs, register as a volunteer, make a donation, or answer any questions. How can I assist you today?"],
  [/(?:thank|thanks|appreciate)/i, "You're so welcome! 💜 Remember, we're always here for you. Is there anything else I can help with?"],
  [/(?:sad|depressed|anxious|scared|lonely|hurt|pain|suicid)/i, "I hear you, and I want you to know that your feelings are valid. 💜 Please reach out to our 24/7 helpline at 1-800-LISTEN-IN — a trained listener is waiting to talk with you right now. You don't have to go through this alone."],
];

function chatLocalFallback(msg: string, language: string): string {
  let reply = "Thank you for reaching out! 💜 I can help you with information about our programs, volunteer registration, donations, or answer questions about ListenInn Foundation. What would you like to know?";
  for (const [regex, answer] of FAQ_MAP) {
    if (regex.test(msg)) {
      reply = answer;
      break;
    }
  }
  
  if (language !== "English") {
    reply = `[Simulated ${language} Translation] ` + reply;
  }
  
  return reply;
}

// ━━━━━━━━━━━━━━━━━ Programs Info ━━━━━━━━━━━━━━━━━

export const PROGRAMS_INFO = [
  { title: "24/7 Helpline", icon: "📞", desc: "Speak with a trained listener anytime, day or night. Our helpline is staffed by compassionate volunteers who have completed 40+ hours of active listening training. Completely confidential and free." },
  { title: "1:1 Counseling", icon: "💬", desc: "Connect with licensed therapists for personalised sessions tailored to your needs. We offer both in-person and virtual sessions. All counseling is free of charge." },
  { title: "Peer Support Groups", icon: "🤗", desc: "Weekly circles where people navigating similar challenges — grief, anxiety, depression — come together in a safe, judgment-free space. You're never alone." },
  { title: "Listening Sessions", icon: "👂", desc: "Sometimes you just need to be heard. Our one-on-one listening sessions provide a confidential space where you can express yourself freely without judgment." },
  { title: "Youth Wellbeing", icon: "🌱", desc: "Safe spaces for teens and young adults. We run interactive workshops in schools and communities, teaching emotional resilience, coping skills, and breaking the mental health stigma." },
  { title: "Crisis Care", icon: "🛡️", desc: "Immediate, confidential support when things feel overwhelming. Our crisis team is trained in de-escalation and can connect you with emergency resources if needed." },
];
