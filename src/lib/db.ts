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
}

// ━━━━━━━━━━━━━━━━━━━ Helpers ━━━━━━━━━━━━━━━━━━━

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function daysAgo(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

// ━━━━━━━━━━━━━━━━━━━ Initial Mock Data ━━━━━━━━━━━━━━━━━━━

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-helpline",
    title: "24/7 Helpline Support",
    description: "Staff our crisis helpline, providing immediate emotional support to callers in distress.",
    requiredSkills: ["active listening", "empathy", "crisis management", "communication"],
    minHoursPerWeek: 8,
    currentVolunteers: 12,
    targetVolunteers: 20,
  },
  {
    id: "proj-youth",
    title: "Youth Wellbeing Workshops",
    description: "Facilitate interactive mental health workshops for teens and young adults in schools and community centres.",
    requiredSkills: ["public speaking", "youth engagement", "counseling", "creativity"],
    minHoursPerWeek: 5,
    currentVolunteers: 6,
    targetVolunteers: 10,
  },
  {
    id: "proj-support-groups",
    title: "Peer Support Groups",
    description: "Lead weekly peer support circles for people navigating grief, anxiety, and depression.",
    requiredSkills: ["facilitation", "empathy", "group dynamics", "patience"],
    minHoursPerWeek: 4,
    currentVolunteers: 8,
    targetVolunteers: 12,
  },
  {
    id: "proj-stigma",
    title: "Stigma Awareness Campaign",
    description: "Create and distribute content to normalise conversations about mental health across social media and public events.",
    requiredSkills: ["social media", "writing", "design", "community outreach"],
    minHoursPerWeek: 6,
    currentVolunteers: 4,
    targetVolunteers: 8,
  },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: "vol-001",
    name: "Ananya Sharma",
    email: "ananya@example.com",
    skills: ["active listening", "empathy", "communication"],
    availability: "10 hours/week",
    motivation: "I lost a close friend to depression and want to ensure no one else feels that alone. Listening is the most powerful thing we can do.",
    status: "approved",
    submittedAt: daysAgo(30),
    screening: { fitScore: 92, empathyRating: 95, insights: "Exceptionally motivated with personal experience that deepens empathy. Strong communicator.", risks: "May need emotional support given personal loss — recommend regular supervision.", recommendedProjects: ["24/7 Helpline Support", "Peer Support Groups"] },
    matchedProjectId: "proj-helpline",
  },
  {
    id: "vol-002",
    name: "Rahul Verma",
    email: "rahul.v@example.com",
    skills: ["public speaking", "youth engagement", "creativity"],
    availability: "6 hours/week",
    motivation: "I'm a teacher and I see students struggling silently every day. I want to help them open up and know it's okay to ask for help.",
    status: "approved",
    submittedAt: daysAgo(25),
    screening: { fitScore: 88, empathyRating: 82, insights: "Professional experience with youth gives strong foundation. Excellent presentation skills.", risks: "Limited crisis experience — ensure proper training completion.", recommendedProjects: ["Youth Wellbeing Workshops", "Stigma Awareness Campaign"] },
    matchedProjectId: "proj-youth",
  },
  {
    id: "vol-003",
    name: "Priya Nair",
    email: "priya.n@example.com",
    skills: ["social media", "writing", "design", "community outreach"],
    availability: "8 hours/week",
    motivation: "As a content creator, I want to use my skills for something meaningful. Mental health content can reach millions and change perspectives.",
    status: "approved",
    submittedAt: daysAgo(20),
    screening: { fitScore: 85, empathyRating: 78, insights: "Strong digital skills with genuine passion for social impact. Portfolio demonstrates compelling storytelling.", risks: "No direct counseling experience — best suited for awareness rather than direct support.", recommendedProjects: ["Stigma Awareness Campaign"] },
    matchedProjectId: "proj-stigma",
  },
  {
    id: "vol-004",
    name: "Meera Iyer",
    email: "meera.i@example.com",
    skills: ["empathy", "facilitation", "patience", "group dynamics"],
    availability: "5 hours/week",
    motivation: "I've attended therapy myself and it changed my life. I want to create safe spaces where people feel comfortable being vulnerable.",
    status: "pending",
    submittedAt: daysAgo(3),
    screening: null,
    matchedProjectId: null,
  },
  {
    id: "vol-005",
    name: "Arjun Patel",
    email: "arjun.p@example.com",
    skills: ["communication", "crisis management", "active listening"],
    availability: "12 hours/week",
    motivation: "I'm a retired social worker with 15 years of experience. I want to continue making a difference in my retirement.",
    status: "pending",
    submittedAt: daysAgo(1),
    screening: null,
    matchedProjectId: null,
  },
];

const INITIAL_PARTICIPATION: ParticipationLog[] = [
  { id: "p-001", volunteerId: "vol-001", date: daysAgo(2), hours: 4, description: "Helpline shift — handled 6 calls", status: "completed" },
  { id: "p-002", volunteerId: "vol-001", date: daysAgo(5), hours: 3, description: "Helpline evening shift", status: "completed" },
  { id: "p-003", volunteerId: "vol-002", date: daysAgo(3), hours: 2, description: "Youth workshop at Delhi Public School", status: "completed" },
  { id: "p-004", volunteerId: "vol-002", date: daysAgo(7), hours: 3, description: "Workshop preparation & material review", status: "completed" },
  { id: "p-005", volunteerId: "vol-003", date: daysAgo(1), hours: 5, description: "Social media content batch creation", status: "completed" },
  { id: "p-006", volunteerId: "vol-003", date: daysAgo(4), hours: 3, description: "Instagram Reels editing & scheduling", status: "completed" },
  { id: "p-007", volunteerId: "vol-001", date: daysAgo(9), hours: 4, description: "Helpline weekend shift", status: "completed" },
  { id: "p-008", volunteerId: "vol-002", date: daysAgo(10), hours: 2, description: "Teacher coordination meeting", status: "completed" },
];

const INITIAL_REMINDERS: Reminder[] = [
  { id: "r-001", volunteerId: "vol-001", volunteerName: "Ananya Sharma", type: "shift_reminder", message: "Your helpline shift starts tomorrow at 6 PM. Please review the crisis protocol sheet before starting.", date: daysAgo(-1), status: "scheduled" },
  { id: "r-002", volunteerId: "vol-002", volunteerName: "Rahul Verma", type: "training_notice", message: "Mandatory refresher training on youth engagement techniques this Saturday, 10 AM.", date: daysAgo(-3), status: "scheduled" },
  { id: "r-003", volunteerId: "vol-003", volunteerName: "Priya Nair", type: "check_in", message: "Monthly check-in: How are you feeling about your work? Any support needed?", date: daysAgo(1), status: "sent" },
];

const INITIAL_DONATIONS: Donation[] = [
  { id: "d-001", name: "Vikram Singh", email: "vikram@example.com", amount: 5000, timestamp: daysAgo(2) },
  { id: "d-002", name: "Sunita Reddy", email: "sunita@example.com", amount: 2000, timestamp: daysAgo(5) },
  { id: "d-003", name: "Anonymous", email: "", amount: 10000, timestamp: daysAgo(8) },
  { id: "d-004", name: "Ravi Kumar", email: "ravi.k@example.com", amount: 500, timestamp: daysAgo(12) },
  { id: "d-005", name: "Deepa Menon", email: "deepa@example.com", amount: 1000, timestamp: daysAgo(15) },
];

const INITIAL_FEEDBACKS: Feedback[] = [
  { id: "f-001", name: "Kavya R.", rating: 5, comment: "The helpline volunteer was incredibly patient. I felt truly heard for the first time in months. Thank you, ListenInn.", timestamp: daysAgo(3), aiSentiment: "Positive" },
  { id: "f-002", name: "Anonymous", rating: 4, comment: "Good service but the wait time on the helpline was a bit long. Once connected, the experience was great.", timestamp: daysAgo(6), aiSentiment: "Neutral" },
  { id: "f-003", name: "Sanjay M.", rating: 5, comment: "The youth workshop at our school was transformative. Students opened up in ways we've never seen before.", timestamp: daysAgo(10), aiSentiment: "Positive" },
  { id: "f-004", name: "Neha P.", rating: 3, comment: "I appreciated the effort but felt the counselor wasn't fully understanding my situation. Maybe more training needed.", timestamp: daysAgo(14), aiSentiment: "Negative" },
];

// ━━━━━━━━━━━━━━━━━━━ State Manager ━━━━━━━━━━━━━━━━━━━

const STORAGE_KEY = "listeninn-db";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch { /* ignore */ }
  return getDefaultState();
}

function getDefaultState(): AppState {
  return {
    volunteers: INITIAL_VOLUNTEERS,
    projects: INITIAL_PROJECTS,
    participationLogs: INITIAL_PARTICIPATION,
    reminders: INITIAL_REMINDERS,
    donations: INITIAL_DONATIONS,
    feedbacks: INITIAL_FEEDBACKS,
    settings: { geminiApiKey: "", useGemini: false },
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

  // Fit Score: based on motivation depth, skill breadth, and personal experience signals
  let fitScore = Math.min(100, 50 + posHits * 5 + skillCount * 6 + Math.floor(motivLen / 30) * 2);
  fitScore = Math.max(30, fitScore - negHits * 2); // slight negative adjustment

  // Empathy Rating: weighted towards emotional vocabulary and personal experience
  let empathyRating = Math.min(100, 40 + posHits * 8 + (vol.motivation.toLowerCase().includes("personal") ? 10 : 0) + (vol.motivation.toLowerCase().includes("experience") ? 8 : 0) + skillCount * 3);

  // Recommended projects based on skill overlap
  const projectScores = INITIAL_PROJECTS.map((p) => {
    const required = SKILL_MAP[p.id] || p.requiredSkills;
    const overlap = vol.skills.filter((s) => required.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))).length;
    return { title: p.title, score: overlap };
  }).sort((a, b) => b.score - a.score);
  const recommendedProjects = projectScores.filter((p) => p.score > 0).slice(0, 2).map((p) => p.title);
  if (recommendedProjects.length === 0) recommendedProjects.push(projectScores[0].title);

  // Generate insights paragraph
  const insights = `${vol.name} demonstrates ${empathyRating >= 80 ? "exceptional" : empathyRating >= 60 ? "strong" : "developing"} empathetic capacity with ${posHits > 3 ? "deeply personal and emotionally rich" : posHits > 1 ? "genuine and thoughtful" : "clear"} motivation. Their skill set in ${vol.skills.slice(0, 3).join(", ")} aligns well with ${recommendedProjects[0]}. ${motivLen > 100 ? "The detailed application shows strong commitment and self-awareness." : "A concise but sincere application."} Overall fit assessment: ${fitScore >= 85 ? "Excellent candidate — recommend fast-track approval." : fitScore >= 70 ? "Good candidate — standard onboarding recommended." : "Promising applicant — may benefit from additional training before placement."}`;

  // Risk assessment
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

export async function chatWithAI(userMessage: string, context: string): Promise<string> {
  if (!_state.settings.useGemini || !_state.settings.geminiApiKey) {
    return chatLocalFallback(userMessage);
  }
  try {
    const prompt = `You are the friendly AI assistant for ListenInn Foundation, an NGO that provides free, confidential mental health support including a 24/7 helpline, 1:1 counseling, support groups, listening sessions, youth wellbeing programs, and crisis care. You are warm, compassionate, and helpful.

Context of conversation so far: ${context}

User says: "${userMessage}"

Reply in a warm, concise manner (2-4 sentences max). If the user is in distress, gently guide them to the helpline (1-800-LISTEN-IN). Do not provide medical advice.`;
    return await callGemini(prompt);
  } catch {
    return chatLocalFallback(userMessage);
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
  [/(?:contact|reach|email|get in touch)/i, "You can reach us at hello@listeninn.org, call our helpline at 1-800-LISTEN-IN, or visit our Contact page on the website. We reply to emails within 24 hours. 📧"],
  [/(?:hi|hello|hey|good morning|good evening)/i, "Hello! 👋 Welcome to ListenInn Foundation. I'm here to help you learn about our programs, register as a volunteer, make a donation, or answer any questions. How can I assist you today?"],
  [/(?:thank|thanks|appreciate)/i, "You're so welcome! 💜 Remember, we're always here for you. Is there anything else I can help with?"],
  [/(?:sad|depressed|anxious|scared|lonely|hurt|pain|suicid)/i, "I hear you, and I want you to know that your feelings are valid. 💜 Please reach out to our 24/7 helpline at 1-800-LISTEN-IN — a trained listener is waiting to talk with you right now. You don't have to go through this alone."],
];

function chatLocalFallback(msg: string): string {
  for (const [regex, answer] of FAQ_MAP) {
    if (regex.test(msg)) return answer;
  }
  return "Thank you for reaching out! 💜 I can help you with information about our programs, volunteer registration, donations, or answer questions about ListenInn Foundation. What would you like to know?";
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
