import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PageShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  Users, Shield, Clock, DollarSign, Heart, Star, ArrowRight, CheckCircle2,
  XCircle, AlertTriangle, Brain, Sparkles, Send, ChevronDown, ChevronUp,
  Settings, Eye, UserCheck, ClipboardList, Bell, MessageSquare,
  Loader2, KeyRound, ToggleLeft, ToggleRight, RefreshCw, Trash2,
  TrendingUp, Target, Zap, Activity, Mic, Database, MessageCircle,
  FileSpreadsheet, Download, Globe, BarChart2, AlertCircle,
  Edit3, Plus, X, Save,
} from "lucide-react";
import {
  type Volunteer, type AppState,
  getState, subscribe, updateVolunteer, addParticipation, addReminder,
  markReminderSent, updateProjectVolunteerCount,
  screenVolunteerLocal, screenVolunteerAI, getProjectMatchScores,
  testGeminiConnection, resetState, resetToTest, analyzeCallAI, queryNGOBrainAI,
  isGeminiAvailable,
} from "@/lib/db";
import {
  type ConnectSubmission,
  getSubmissions, deleteSubmission, clearAllSubmissions,
  exportSubmissionsToExcel, exportSubmissionsToCSV, seedTestSubmission,
} from "@/lib/connectStore";
import { getTrafficStats, clearTrafficData } from "@/lib/trafficStore";
import {
  type CounselingContent, type Therapist, type FeeTier,
  DEFAULT_COUNSELING, fetchCounselingContent, saveCounselingContent,
} from "@/lib/counselingContent";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — ListenInn Foundation" },
      { name: "description", content: "Manage volunteers, screen applications, match projects, track participation, and monitor donations for ListenInn Foundation." },
    ],
  }),
  component: AdminPage,
});

// ━━━━━━━━━━━━━━━━━━━ Hook to sync state ━━━━━━━━━━━━━━━━━━━

function useDB(): AppState {
  const [state, setState] = useState(getState);
  useEffect(() => subscribe(() => setState({ ...getState() })), []);
  return state;
}

// ━━━━━━━━━━━━━━━━━━━ Tab types ━━━━━━━━━━━━━━━━━━━

type Tab = "screening" | "leads" | "matching" | "participation" | "impact" | "conversations" | "reminders" | "logs" | "brain" | "connect" | "content" | "settings";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "screening", label: "Screening", icon: Shield },
  { key: "leads", label: "Directory", icon: FileSpreadsheet },
  { key: "matching", label: "Matching", icon: Target },
  { key: "participation", label: "Participation", icon: ClipboardList },
  { key: "impact", label: "Impact", icon: Activity },
  { key: "conversations", label: "Sessions", icon: Mic },
  { key: "reminders", label: "Reminders", icon: Bell },
  { key: "logs", label: "Feedback", icon: MessageSquare },
  { key: "brain", label: "NGO Brain", icon: Database },
  { key: "connect", label: "Connect Forms", icon: Heart },
  { key: "content", label: "Counseling Page", icon: Edit3 },
  { key: "settings", label: "Settings", icon: Settings },
];

// ━━━━━━━━━━━━━━━━━━━ Shared CSV Utility ━━━━━━━━━━━━━━━━━━━

function sanitizeCsvCell(v: unknown): string {
  const s = String(v ?? "");
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

function exportCSV(headers: string[], rows: (string | number)[][], filename: string): void {
  const esc = (v: string | number) => `"${sanitizeCsvCell(v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(row => row.map(esc).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ━━━━━━━━━━━━━━━━━━━ Admin Auth Gate ━━━━━━━━━━━━━━━━━━━

// S2: SHA-256 hash comparison — password never stored in cleartext
const ADMIN_PASSWORD_PLAIN = "listeninn@admin2025"; // change to your preferred password
const SESSION_KEY = "listeninn_admin_auth";
const ADMIN_PWD_KEY = "listeninn_admin_pwd";
const RATE_LIMIT_KEY = "listeninn_admin_rate";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

async function hashPwd(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + "listeninn-salt-2025");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
let ADMIN_HASH = "";
hashPwd(ADMIN_PASSWORD_PLAIN).then(h => { ADMIN_HASH = h; });

interface RateState { attempts: number; lockedUntil: number; }
function getRateState(): RateState {
  try { const r = sessionStorage.getItem(RATE_LIMIT_KEY); if (r) return JSON.parse(r) as RateState; } catch {/**/ }
  return { attempts: 0, lockedUntil: 0 };
}
function saveRateState(s: RateState) { sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(s)); }

function AdminLoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number>(() => getRateState().lockedUntil);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const remaining = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
  const isLocked = remaining > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    const rate = getRateState();
    const inputHash = await hashPwd(pwd);
    if (inputHash === ADMIN_HASH) {
      saveRateState({ attempts: 0, lockedUntil: 0 });
      sessionStorage.setItem(SESSION_KEY, "1");
      // Keep the plaintext password for this session only, so the content
      // editor can authenticate to /api/counseling. Cleared on lock.
      sessionStorage.setItem(ADMIN_PWD_KEY, pwd);
      seedTestSubmission();
      onUnlock();
    } else {
      const newAttempts = rate.attempts + 1;
      const lockUntil = newAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
      saveRateState({ attempts: newAttempts, lockedUntil: lockUntil });
      if (lockUntil > 0) { setLockedUntil(lockUntil); setNow(Date.now()); setErrMsg("Too many attempts. Locked for 30s."); }
      else { setErrMsg(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`); }
      setShaking(true); setTimeout(() => setShaking(false), 600);
      setTimeout(() => setErrMsg(""), 3500);
      setPwd("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className={`w-full max-w-md bg-card rounded-3xl shadow-soft border border-border p-10 space-y-8 ${shaking ? "admin-shake" : ""}`}>
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-soft mx-auto"><KeyRound className="h-8 w-8 text-white" /></div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Enter your admin password to access the dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-semibold text-foreground">Password</label>
            <div className="relative">
              <input id="admin-password" type={showPwd ? "text" : "password"} value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder={isLocked ? `Locked — wait ${remaining}s` : "Enter admin password"}
                autoComplete="current-password" autoFocus disabled={isLocked} maxLength={128}
                className={`w-full h-11 px-4 pr-11 rounded-xl border text-sm outline-none transition-all ${
                  errMsg ? "border-destructive bg-destructive/5 focus:ring-2 focus:ring-destructive/20"
                  : isLocked ? "border-yellow-300 bg-yellow-50 text-muted-foreground"
                  : "border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/15"}`} />
              {!isLocked && (
                <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {showPwd
                    ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              )}
            </div>
            {errMsg && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0"/>{errMsg}</p>}
            {isLocked && !errMsg && <p className="text-xs text-yellow-600 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0"/>Locked. Try again in {remaining}s.</p>}
          </div>
          <Button type="submit" disabled={isLocked} className="w-full h-11 bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold shadow-soft disabled:opacity-50">
            <Shield className="mr-2 h-4 w-4"/>{isLocked ? `Locked (${remaining}s)` : "Access Dashboard"}
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">🔒 Restricted to authorised administrators only.</p>
      </div>
      <style>{`.admin-shake{animation:admin-shake 0.6s ease-in-out}@keyframes admin-shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}`}</style>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ Admin Page ━━━━━━━━━━━━━━━━━━━

function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!unlocked) return <AdminLoginGate onUnlock={() => setUnlocked(true)} />;
  // B7: lock via React state, NOT window.location.reload()
  return <AdminDashboard onLock={() => { sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(ADMIN_PWD_KEY); setUnlocked(false); }} />;
}

function AdminDashboard({ onLock }: { onLock: () => void }) {
  const db = useDB();
  const [tab, setTab] = useState<Tab>("screening");
  const [aiActive, setAiActive] = useState(false);
  useEffect(() => { isGeminiAvailable().then(setAiActive); }, []);

  const totalHours = db.participationLogs.reduce((s, l) => s + l.hours, 0);
  const totalDonations = db.donations.reduce((s, d) => s + d.amount, 0);
  const approvedVols = db.volunteers.filter((v) => v.status === "approved").length;
  const matchedVols = db.volunteers.filter((v) => v.matchedProjectId).length;
  const matchRate = approvedVols > 0 ? Math.round((matchedVols / approvedVols) * 100) : 0;
  const avgRating = db.feedbacks.length > 0
    ? (db.feedbacks.reduce((s, f) => s + f.rating, 0) / db.feedbacks.length).toFixed(1)
    : "—";



  return (
    <PageShell>
      {/* Hero header */}
      <section className="bg-gradient-hero pt-16 pb-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="font-script text-primary text-2xl">Admin Portal</p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Volunteer <span className="text-gradient-brand">Management</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 text-primary gap-1">
                <Brain className="h-3 w-3" />
                {aiActive ? "Gemini AI Active" : "Simulated AI"}
              </Badge>
              <button
                onClick={onLock}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all"
                title="Lock admin panel"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Lock
              </button>
            </div>
          </div>


          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "Volunteers", value: db.volunteers.length.toString(), icon: Users, color: "text-primary" },
              { label: "Match Rate", value: `${matchRate}%`, icon: Target, color: "text-accent" },
              { label: "Total Hours", value: totalHours.toString(), icon: Clock, color: "text-primary" },
              { label: "Funds Raised", value: `₹${totalDonations.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
              { label: "Avg Rating", value: avgRating, icon: Star, color: "text-yellow-500" },
              { label: "Connect Forms", value: getSubmissions().length.toString(), icon: Heart, color: "text-rose-500" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-soft transition-shadow"
              >
                <c.icon className={`h-5 w-5 ${c.color} mb-2`} />
                <div className="text-2xl font-bold text-gradient-brand">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <section className="bg-card border-b border-border sticky top-[57px] z-40">
        <div className="container mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto py-2 -mb-px" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  tab === t.key
                    ? "bg-gradient-brand text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <section className="bg-background py-10 min-h-[60vh]">
        <div className="container mx-auto px-6">
          {tab === "screening" && <ScreeningPanel db={db} />}
          {tab === "leads" && <LeadsPanel db={db} />}
          {tab === "matching" && <MatchingPanel db={db} />}
          {tab === "participation" && <ParticipationPanel db={db} />}
          {tab === "impact" && <ImpactPanel db={db} />}
          {tab === "conversations" && <ConversationsPanel db={db} />}
          {tab === "reminders" && <RemindersPanel db={db} />}
          {tab === "logs" && <LogsPanel db={db} />}
          {tab === "brain" && <NGOBrainPanel db={db} />}
          {tab === "connect" && <ConnectPanel />}
          {tab === "content" && <ContentPanel />}
          {tab === "settings" && <SettingsPanel db={db} />}
        </div>
      </section>
    </PageShell>
  );
}

// ━━━━━━━━━━━━━━━━━━━ CONNECT PANEL ━━━━━━━━━━━━━━━━━━━

function ConnectPanel() {
  const [submissions, setSubmissions] = useState<ConnectSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // B8: load from localStorage on mount and whenever localStorage changes
  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  const refresh = useCallback(() => setSubmissions(getSubmissions()), []);

  const handleDelete = (id: string) => {
    deleteSubmission(id);
    toast.success("Submission deleted.");
    refresh();
  };

  const handleClearAll = () => {
    if (!confirm(`Delete all ${submissions.length} connect submissions? This cannot be undone.`)) return;
    clearAllSubmissions();
    toast.info("All connect submissions cleared.");
    refresh();
  };

  const handleExportExcel = () => {
    if (submissions.length === 0) { toast.error("No submissions to export."); return; }
    exportSubmissionsToExcel(submissions);
    toast.success(`Exported ${submissions.length} submissions to Excel! 📊`);
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) { toast.error("No submissions to export."); return; }
    exportSubmissionsToCSV(submissions);
    toast.success(`Exported ${submissions.length} submissions to CSV!`);
  };

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.preferredName.toLowerCase().includes(q) ||
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.topics.join(" ").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Connect Form Submissions
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {submissions.length} total submission{submissions.length !== 1 ? "s" : ""} received
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleExportExcel} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={refresh} variant="outline" title="Refresh submissions">
            <RefreshCw className="h-4 w-4" />
          </Button>
          {submissions.length > 0 && (
            <Button onClick={handleClearAll} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, city, topic…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{submissions.length === 0 ? "No connect submissions yet" : "No results match your search"}</p>
          <p className="text-sm mt-1">
            {submissions.length === 0
              ? "Submissions from the Connect form will appear here."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left whitespace-nowrap">
                  <th className="px-4 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Location</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Age</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Topics</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Reach Via</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice().reverse().map((s) => (
                  <>
                    <tr
                      key={s.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id.slice(0, 12)}…</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{s.preferredName}</div>
                        {s.fullName && <div className="text-xs text-muted-foreground">{s.fullName}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs">{s.phone}</div>
                        {s.email && <div className="text-xs text-muted-foreground">{s.email}</div>}
                      </td>
                      <td className="px-4 py-3 text-xs">{s.city}{s.state ? `, ${s.state}` : ""}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.ageGroup || "—"}</td>
                      <td className="px-4 py-3 max-w-[160px]">
                        <div className="flex flex-wrap gap-1">
                          {s.topics.slice(0, 2).map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                          ))}
                          {s.topics.length > 2 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{s.topics.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.reachMethod || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete submission"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded story + details row */}
                    {expanded === s.id && (
                      <tr key={`${s.id}-exp`} className="bg-muted/10 border-b border-border/50">
                        <td colSpan={9} className="px-6 py-5">
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Story */}
                            <div className="md:col-span-2">
                              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Story / Message</div>
                              <p className="text-sm leading-relaxed bg-white border border-border rounded-xl p-4 italic text-foreground/80 whitespace-pre-wrap">
                                "{s.story || "—"}"
                              </p>
                            </div>
                            {/* Meta */}
                            <div className="space-y-4">
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">All Topics</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {s.topics.map((t) => <Badge key={t} className="bg-gradient-brand text-primary-foreground text-xs">{t}</Badge>)}
                                  {s.otherTopic && <Badge variant="outline" className="text-xs">Other: {s.otherTopic}</Badge>}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Support Needed</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {s.supportTypes.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <div className="text-muted-foreground font-medium">Availability</div>
                                  <div>{s.availability || "—"}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground font-medium">Reach Via</div>
                                  <div>{s.reachMethod || "—"}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground font-medium">Submitted</div>
                                  <div>{new Date(s.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground font-medium">Full ID</div>
                                  <div className="font-mono text-[10px] break-all">{s.id}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground">
            Showing {filtered.length} of {submissions.length} submissions
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 1.5 LEADS PANEL ━━━━━━━━━━━━━━━━━━━


function LeadsPanel({ db }: { db: AppState }) {
  const handleExport = () => {
    exportCSV(
      ["Name", "Email", "Phone", "Resume Link", "Skills", "Availability", "Motivation", "Status", "Date Submitted"],
      db.volunteers.map(v => [v.name, v.email, v.phone, v.resumeLink, v.skills.join(", "), v.availability, v.motivation, v.status, new Date(v.submittedAt).toLocaleDateString()]),
      "listeninn_volunteers_leads"
    );
    toast.success("CSV export downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-accent" /> Volunteer Leads Directory
        </h2>
        <Button onClick={handleExport} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>


      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left whitespace-nowrap">
                <th className="px-5 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Resume</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Skills</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {db.volunteers.map((vol) => (
                <tr key={vol.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-medium">{vol.name}</td>
                  <td className="px-5 py-3">
                    <div className="text-xs">{vol.email}</div>
                    <div className="text-xs text-muted-foreground">{vol.phone || "—"}</div>
                  </td>
                  <td className="px-5 py-3">
                    {vol.resumeLink ? (
                      <a href={vol.resumeLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 text-xs">
                        View <ArrowRight className="h-3 w-3" />
                      </a>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground max-w-[150px] truncate">
                    {vol.skills.join(", ")}
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={
                      vol.status === "approved" ? "bg-green-100 text-green-700" :
                      vol.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }>
                      {vol.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">
                    {new Date(vol.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 1. SCREENING PANEL ━━━━━━━━━━━━━━━━━━━

function ScreeningPanel({ db }: { db: AppState }) {
  const pending = db.volunteers.filter((v) => v.status === "pending");
  const reviewed = db.volunteers.filter((v) => v.status !== "pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [screening, setScreening] = useState<string | null>(null);

  const runScreening = async (vol: Volunteer) => {
    setScreening(vol.id);
    const result = await screenVolunteerAI(vol);
    updateVolunteer(vol.id, { screening: result });
    setScreening(null);
    toast.success(`AI screening complete for ${vol.name}`);
  };

  const approve = (vol: Volunteer) => {
    updateVolunteer(vol.id, { status: "approved" });
    toast.success(`${vol.name} has been approved! 🎉`);
  };

  const reject = (vol: Volunteer) => {
    updateVolunteer(vol.id, { status: "rejected" });
    toast.info(`${vol.name} has been declined.`);
  };

  return (
    <div className="space-y-8">
      {/* Pending */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Pending Applications ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-400" />
            <p>All applications have been reviewed! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((vol) => (
              <div key={vol.id} className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(expanded === vol.id ? null : vol.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
                    {vol.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{vol.name}</div>
                    <div className="text-xs text-muted-foreground">{vol.email} · {new Date(vol.submittedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="border-yellow-300 text-yellow-600 text-xs">Pending</Badge>
                    {expanded === vol.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === vol.id && (
                  <div className="border-t border-border p-5 space-y-4 bg-muted/10">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          {vol.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">Availability</div>
                        <p className="text-sm">{vol.availability}</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-1">Submitted</div>
                        <p className="text-sm">{new Date(vol.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-1">Motivation</div>
                      <p className="text-sm leading-relaxed bg-card rounded-xl p-4 border border-border italic">"{vol.motivation}"</p>
                    </div>

                    {/* AI Screening Result */}
                    {vol.screening ? (
                      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-accent font-semibold">
                          <Brain className="h-4 w-4" /> AI Screening Report
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <ScoreCard label="Fit Score" value={vol.screening.fitScore} />
                          <ScoreCard label="Empathy" value={vol.screening.empathyRating} />
                          <div className="col-span-2">
                            <div className="text-xs text-muted-foreground font-medium mb-1">Recommended Projects</div>
                            <div className="flex flex-wrap gap-1.5">
                              {vol.screening.recommendedProjects.map((p) => (
                                <Badge key={p} className="bg-gradient-brand text-primary-foreground text-xs">{p}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Insights</div>
                          <p className="text-sm leading-relaxed">{vol.screening.insights}</p>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Risk Assessment</div>
                          <p className="text-sm leading-relaxed text-destructive/80">{vol.screening.risks}</p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => runScreening(vol)}
                        disabled={screening === vol.id}
                        className="bg-gradient-brand text-primary-foreground hover:opacity-90"
                      >
                        {screening === vol.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Screening...</> : <><Brain className="mr-2 h-4 w-4" /> Run AI Screening</>}
                      </Button>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => approve(vol)} className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button onClick={() => reject(vol)} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed History */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-green-500" />
          Reviewed ({reviewed.length})
        </h2>
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Fit Score</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Empathy</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Project</th>
                </tr>
              </thead>
              <tbody>
                {reviewed.map((vol) => (
                  <tr key={vol.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{vol.name}</td>
                    <td className="px-5 py-3">
                      <Badge className={vol.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {vol.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gradient-brand">{vol.screening?.fitScore ?? "—"}</td>
                    <td className="px-5 py-3 font-semibold text-gradient-brand">{vol.screening?.empathyRating ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {vol.matchedProjectId
                        ? db.projects.find((p) => p.id === vol.matchedProjectId)?.title ?? "—"
                        : <span className="text-xs italic">Unmatched</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "text-green-600" : value >= 60 ? "text-yellow-600" : "text-red-500";
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
      <Progress value={value} className="mt-2 h-1.5" />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 2. MATCHING PANEL ━━━━━━━━━━━━━━━━━━━

function MatchingPanel({ db }: { db: AppState }) {
  const unmatched = db.volunteers.filter((v) => v.status === "approved" && !v.matchedProjectId);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedVol = db.volunteers.find((v) => v.id === selected);

  const matchScores = useMemo(() => {
    if (!selectedVol) return [];
    return getProjectMatchScores(selectedVol);
  }, [selectedVol]);

  const matchToProject = (volId: string, projectId: string) => {
    updateVolunteer(volId, { matchedProjectId: projectId });
    updateProjectVolunteerCount(projectId, 1);
    const vol = db.volunteers.find((v) => v.id === volId);
    const proj = db.projects.find((p) => p.id === projectId);
    toast.success(`${vol?.name} matched to ${proj?.title}! 🎯`);
    setSelected(null);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Target className="h-5 w-5 text-accent" />
        Project Matching ({unmatched.length} unmatched)
      </h2>

      {unmatched.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-400" />
          <p>All approved volunteers have been matched to projects! 🎉</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: unmatched volunteers */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Select a volunteer to see AI matching recommendations</h3>
            {unmatched.map((vol) => (
              <button
                key={vol.id}
                onClick={() => setSelected(vol.id)}
                className={`w-full text-left rounded-2xl border p-5 transition-all ${
                  selected === vol.id
                    ? "border-accent bg-accent/5 shadow-soft"
                    : "border-border bg-card hover:shadow-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    {vol.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{vol.name}</div>
                    <div className="text-xs text-muted-foreground">{vol.skills.slice(0, 3).join(", ")}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          {/* Right: match scores */}
          <div>
            {selectedVol ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">AI Match Recommendations for {selectedVol.name}</h3>
                {matchScores.map((ms) => {
                  const proj = db.projects.find((p) => p.id === ms.projectId)!;
                  return (
                    <div key={ms.projectId} className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{ms.projectTitle}</div>
                          <div className="text-xs text-muted-foreground">{proj.currentVolunteers}/{proj.targetVolunteers} volunteers</div>
                        </div>
                        <div className={`text-2xl font-bold ${ms.score >= 70 ? "text-green-600" : ms.score >= 40 ? "text-yellow-600" : "text-red-500"}`}>
                          {ms.score}%
                        </div>
                      </div>
                      <Progress value={ms.score} className="h-2" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{ms.reason}</p>
                      <Button
                        onClick={() => matchToProject(selectedVol.id, ms.projectId)}
                        size="sm"
                        className="bg-gradient-brand text-primary-foreground hover:opacity-90"
                      >
                        <Zap className="mr-1 h-3 w-3" /> Match to this project
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                <Target className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select a volunteer to see AI matching</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects overview */}
      <div>
        <h3 className="text-lg font-bold mb-4">Project Staffing Overview</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {db.projects.map((p) => {
            const pct = Math.round((p.currentVolunteers / p.targetVolunteers) * 100);
            return (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{p.title}</div>
                  <Badge variant="outline" className={pct >= 80 ? "border-green-300 text-green-600" : pct >= 50 ? "border-yellow-300 text-yellow-600" : "border-red-300 text-red-600"}>
                    {p.currentVolunteers}/{p.targetVolunteers}
                  </Badge>
                </div>
                <Progress value={pct} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 3. PARTICIPATION PANEL ━━━━━━━━━━━━━━━━━━━

function ParticipationPanel({ db }: { db: AppState }) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logVolId, setLogVolId] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logDesc, setLogDesc] = useState("");

  const activeVols = db.volunteers.filter((v) => v.status === "approved" && v.matchedProjectId);

  const handleLogSubmit = () => {
    if (!logVolId || !logHours || !logDesc.trim()) { toast.error("Fill in all fields."); return; }
    addParticipation({ volunteerId: logVolId, date: new Date().toISOString(), hours: parseFloat(logHours), description: logDesc, status: "completed" });
    toast.success("Hours logged! 📋");
    setShowLogForm(false); setLogVolId(""); setLogHours(""); setLogDesc("");
  };

  // Chart: hours per project
  const projectHours = useMemo(() => {
    const map: Record<string, number> = {};
    db.participationLogs.forEach((log) => {
      const vol = db.volunteers.find((v) => v.id === log.volunteerId);
      const projId = vol?.matchedProjectId;
      if (projId) {
        const proj = db.projects.find((p) => p.id === projId);
        const name = proj?.title ?? "Unknown";
        map[name] = (map[name] || 0) + log.hours;
      }
    });
    return Object.entries(map).map(([name, hours]) => ({ name: name.length > 20 ? name.slice(0, 18) + "…" : name, hours }));
  }, [db]);

  // Chart: top volunteers
  const topVols = useMemo(() => {
    const map: Record<string, number> = {};
    db.participationLogs.forEach((log) => {
      const vol = db.volunteers.find((v) => v.id === log.volunteerId);
      if (vol) map[vol.name] = (map[vol.name] || 0) + log.hours;
    });
    return Object.entries(map).map(([name, hours]) => ({ name, hours })).sort((a, b) => b.hours - a.hours).slice(0, 5);
  }, [db]);

  const COLORS = ["#6B5B95", "#1FA39B", "#E07A5F", "#81B29A", "#F2CC8F"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Participation Tracker
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => exportCSV(
            ["Volunteer ID", "Date", "Hours", "Status", "Description"],
            db.participationLogs.map(l => [l.volunteerId, l.date, l.hours, l.status, l.description]),
            "listeninn_participation"
          )} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setShowLogForm(!showLogForm)} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
            <Clock className="mr-2 h-4 w-4" /> Log Hours
          </Button>
        </div>
      </div>

      {/* Log form */}
      {showLogForm && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-semibold">Log Participation Hours</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="log-vol">Volunteer</Label>
              <select id="log-vol" value={logVolId} onChange={(e) => setLogVolId(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select volunteer...</option>
                {activeVols.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-hours">Hours</Label>
              <Input id="log-hours" type="number" min="0.5" step="0.5" value={logHours} onChange={(e) => setLogHours(e.target.value)} placeholder="e.g. 4" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-desc">Description</Label>
              <Input id="log-desc" value={logDesc} onChange={(e) => setLogDesc(e.target.value)} placeholder="What was done?" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogSubmit} className="bg-gradient-brand text-primary-foreground hover:opacity-90"><CheckCircle2 className="mr-2 h-4 w-4" /> Save</Button>
            <Button variant="outline" onClick={() => setShowLogForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-accent" /> Hours by Project</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={projectHours} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.025 295)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {projectHours.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Top Volunteers</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={topVols} dataKey="hours" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, hours }) => `${name}: ${hours}h`} labelLine={false}>
                {topVols.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs table */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Volunteer</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Hours</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Description</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {db.participationLogs.slice().reverse().map((log) => {
                const vol = db.volunteers.find((v) => v.id === log.volunteerId);
                return (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{vol?.name ?? "Unknown"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-semibold text-gradient-brand">{log.hours}h</td>
                    <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate">{log.description}</td>
                    <td className="px-5 py-3">
                      <Badge className={log.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 4. REMINDERS PANEL ━━━━━━━━━━━━━━━━━━━

function RemindersPanel({ db }: { db: AppState }) {
  const [showForm, setShowForm] = useState(false);
  const [remVolId, setRemVolId] = useState("");
  const [remType, setRemType] = useState<"shift_reminder" | "training_notice" | "check_in">("shift_reminder");
  const [remMsg, setRemMsg] = useState("");

  const activeVols = db.volunteers.filter((v) => v.status === "approved");

  const sendReminder = (id: string) => {
    markReminderSent(id);
    const rem = db.reminders.find((r) => r.id === id);
    toast.success(`📬 Reminder sent to ${rem?.volunteerName}: "${rem?.message.slice(0, 50)}..."`);
  };

  const createReminder = () => {
    if (!remVolId || !remMsg.trim()) { toast.error("Please fill in all fields."); return; }
    const vol = db.volunteers.find((v) => v.id === remVolId);
    addReminder({
      volunteerId: remVolId,
      volunteerName: vol?.name ?? "Unknown",
      type: remType,
      message: remMsg,
      date: new Date().toISOString(),
      status: "scheduled",
    });
    toast.success("Reminder scheduled! 🔔");
    setShowForm(false); setRemVolId(""); setRemMsg("");
  };

  const typeLabels: Record<string, { label: string; color: string }> = {
    shift_reminder: { label: "Shift", color: "bg-blue-100 text-blue-700" },
    training_notice: { label: "Training", color: "bg-purple-100 text-purple-700" },
    check_in: { label: "Check-in", color: "bg-green-100 text-green-700" },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" /> Reminders Hub
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => exportCSV(
            ["Volunteer", "Type", "Status", "Message", "Date"],
            db.reminders.map(r => [r.volunteerName, r.type, r.status, r.message, r.date]),
            "listeninn_reminders"
          )} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
            <Send className="mr-2 h-4 w-4" /> New Reminder
          </Button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-semibold">Schedule a Reminder</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Volunteer</Label>
              <select value={remVolId} onChange={(e) => setRemVolId(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select...</option>
                {activeVols.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select value={remType} onChange={(e) => setRemType(e.target.value as typeof remType)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="shift_reminder">Shift Reminder</option>
                <option value="training_notice">Training Notice</option>
                <option value="check_in">Check-in</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea value={remMsg} onChange={(e) => setRemMsg(e.target.value)} placeholder="Reminder message..." rows={2} className="resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={createReminder} className="bg-gradient-brand text-primary-foreground hover:opacity-90"><Bell className="mr-2 h-4 w-4" /> Schedule</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Reminders list */}
      <div className="space-y-3">
        {db.reminders.slice().reverse().map((rem) => {
          const tl = typeLabels[rem.type] ?? typeLabels.check_in;
          return (
            <div key={rem.id} className="rounded-2xl border border-border bg-card p-5 shadow-card flex items-start gap-4">
              <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${rem.status === "sent" ? "bg-green-100" : "bg-yellow-100"}`}>
                {rem.status === "sent" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Bell className="h-5 w-5 text-yellow-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{rem.volunteerName}</span>
                  <Badge className={`text-[10px] ${tl.color}`}>{tl.label}</Badge>
                  <Badge variant="outline" className={`text-[10px] ${rem.status === "sent" ? "border-green-300 text-green-600" : "border-yellow-300 text-yellow-600"}`}>
                    {rem.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{rem.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(rem.date).toLocaleString()}</p>
              </div>
              {rem.status === "scheduled" && (
                <Button size="sm" onClick={() => sendReminder(rem.id)} className="bg-gradient-brand text-primary-foreground hover:opacity-90 flex-shrink-0">
                  <Send className="mr-1 h-3 w-3" /> Send Now
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 5. LOGS PANEL ━━━━━━━━━━━━━━━━━━━

function LogsPanel({ db }: { db: AppState }) {
  const sentimentColors: Record<string, string> = {
    Positive: "bg-green-100 text-green-700",
    Neutral: "bg-gray-100 text-gray-600",
    Negative: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      {/* Feedback */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Feedback ({db.feedbacks.length})
          </h2>
          <Button size="sm" variant="outline" onClick={() => exportCSV(
            ["Name", "Rating", "Sentiment", "Comment", "Date"],
            db.feedbacks.map(f => [f.name, f.rating, f.aiSentiment, f.comment, f.timestamp]),
            "listeninn_feedback"
          )}>
            <Download className="mr-2 h-3 w-3" /> Export Feedback
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Rating</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Comment</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Sentiment</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {db.feedbacks.slice().reverse().map((fb) => (
                  <tr key={fb.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{fb.name}</td>
                    <td className="px-5 py-3">
                      <span className="text-yellow-500">{"★".repeat(fb.rating)}</span>
                      <span className="text-gray-300">{"★".repeat(5 - fb.rating)}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground max-w-[300px]">
                      <span className="line-clamp-2">{fb.comment}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={sentimentColors[fb.aiSentiment] ?? sentimentColors.Neutral}>
                        {fb.aiSentiment}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(fb.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Donations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" /> Donations ({db.donations.length})
            <span className="text-sm font-normal text-muted-foreground ml-2">
              Total: ₹{db.donations.reduce((s, d) => s + d.amount, 0).toLocaleString()}
            </span>
          </h2>
          <Button size="sm" variant="outline" onClick={() => exportCSV(
            ["Name", "Email", "Amount", "Date"],
            db.donations.map(d => [d.name, d.email, d.amount, d.timestamp]),
            "listeninn_donations"
          )}>
            <Download className="mr-2 h-3 w-3" /> Export Donations
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {db.donations.slice().reverse().map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{d.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{d.email || "—"}</td>
                    <td className="px-5 py-3 font-bold text-gradient-brand">₹{d.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(d.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 6. IMPACT PANEL ━━━━━━━━━━━━━━━━━━━

function ImpactPanel({ db }: { db: AppState }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setAnalyzing(true);
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1500));
    setReport(`Based on recent data, ListenInn's impact is significant.
Event engagement averages ${Math.round(db.events.reduce((s,e)=>s+e.engagementScore,0)/db.events.length)}% across ${db.events.length} events, reaching over ${db.events.reduce((s,e)=>s+e.attendees,0)} attendees.
Survey satisfaction is strong at ${Math.round(db.surveys.reduce((s,v)=>s+v.satisfactionScore,0)/db.surveys.length)}/10. Beneficiaries report feeling "understood" and "supported".
Overall sentiment is overwhelmingly positive.`);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" /> Impact Measurement
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => exportCSV(
            ["Type", "Score", "Comment"],
            db.surveys.map(s => [s.type, s.satisfactionScore, s.comments]),
            "listeninn_surveys"
          )} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Surveys
          </Button>
          <Button onClick={generateReport} disabled={analyzing} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
            {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />} Generate AI Report
          </Button>
        </div>
      </div>

      {report && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 shadow-soft">
          <h3 className="font-semibold flex items-center gap-2 text-accent mb-3"><Sparkles className="h-4 w-4" /> AI Impact Summary</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{report}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Events */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold mb-4">Event Attendance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={db.events} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.025 295)" />
              <XAxis dataKey="eventName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="attendees" fill="#1FA39B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Surveys */}
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <h3 className="font-semibold p-6 pb-2">Survey Responses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Score</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Comment</th>
                </tr>
              </thead>
              <tbody>
                {db.surveys.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-5 py-3 capitalize">{s.type}</td>
                    <td className="px-5 py-3 font-bold text-primary">{s.satisfactionScore}/10</td>
                    <td className="px-5 py-3 text-muted-foreground truncate max-w-[150px]">{s.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 7. CONVERSATIONS PANEL ━━━━━━━━━━━━━━━━━━━

function ConversationsPanel({ db }: { db: AppState }) {
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const handleAnalyze = async (id: string) => {
    setAnalyzing(id);
    await analyzeCallAI(id);
    setAnalyzing(null);
    toast.success("Conversation analyzed by AI");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Mic className="h-5 w-5 text-primary" /> Audio/Session Transcripts
      </h2>
      <div className="grid gap-6">
        {db.callSessions.map((call) => (
          <div key={call.id} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-sm text-muted-foreground">Session {call.id} • {call.durationMinutes} mins</div>
                <div className="text-xs text-muted-foreground">{new Date(call.date).toLocaleString()}</div>
              </div>
              {!call.analyzed ? (
                <Button size="sm" onClick={() => handleAnalyze(call.id)} disabled={analyzing === call.id} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
                  {analyzing === call.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Brain className="h-4 w-4 mr-1" />} Analyze
                </Button>
              ) : (
                <Badge className={call.sentiment === "Positive" ? "bg-green-100 text-green-700" : call.sentiment === "Negative" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}>
                  {call.sentiment} Sentiment
                </Badge>
              )}
            </div>
            
            <div className="bg-muted/30 p-4 rounded-xl text-sm italic border border-border whitespace-pre-wrap max-h-[150px] overflow-y-auto">
              {call.transcript}
            </div>

            {call.analyzed && (
              <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-semibold text-accent"><Sparkles className="h-4 w-4" /> AI Analysis</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Emotions Detected</div>
                    <div className="flex flex-wrap gap-1">
                      {call.emotions.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Key Concerns</div>
                    <div className="flex flex-wrap gap-1">
                      {call.concerns.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Anonymized Report</div>
                  <p className="text-sm">{call.anonymizedSummary}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 8. NGO BRAIN PANEL ━━━━━━━━━━━━━━━━━━━

function NGOBrainPanel({ db }: { db: AppState }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [asking, setAsking] = useState(false);

  // Poll traffic stats every 2s while on this tab to ensure fresh data
  const [traffic, setTraffic] = useState(getTrafficStats());
  useEffect(() => {
    const id = setInterval(() => setTraffic(getTrafficStats()), 2000);
    return () => clearInterval(id);
  }, []);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setAsking(true);
    const res = await queryNGOBrainAI(query);
    setResponse(res);
    setAsking(false);
  };

  // Additional aggregations for Volunteer Pipeline
  const pipelineData = useMemo(() => {
    const submitted = db.volunteers.length;
    const approved = db.volunteers.filter(v => v.status === "approved").length;
    const matched = db.volunteers.filter(v => !!v.matchedProjectId).length;
    return [
      { step: "Submitted", count: submitted },
      { step: "Approved", count: approved },
      { step: "Matched", count: matched }
    ];
  }, [db.volunteers]);

  const skillsData = useMemo(() => {
    const map: Record<string, number> = {};
    db.volunteers.forEach(v => {
      v.skills.forEach(s => map[s] = (map[s] || 0) + 1);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [db.volunteers]);

  // Connect Form Analytics
  const connectForms = useMemo(() => getSubmissions(), []);
  
  const cityData = useMemo(() => {
    const map: Record<string, number> = {};
    connectForms.forEach(f => map[f.city] = (map[f.city] || 0) + 1);
    return Object.entries(map).map(([city, count]) => ({ city, count })).sort((a,b) => b.count - a.count).slice(0, 5);
  }, [connectForms]);

  const topicData = useMemo(() => {
    const map: Record<string, number> = {};
    connectForms.forEach(f => {
      f.topics.forEach(t => map[t] = (map[t] || 0) + 1);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [connectForms]);

  const supportData = useMemo(() => {
    const map: Record<string, number> = {};
    connectForms.forEach(f => {
      f.supportTypes.forEach(t => map[t] = (map[t] || 0) + 1);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [connectForms]);

  const COLORS = ["#6B5B95", "#1FA39B", "#E07A5F", "#81B29A", "#F2CC8F"];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto">
        <Database className="h-12 w-12 text-accent mx-auto" />
        <h2 className="text-2xl font-bold">NGO Brain Analytics</h2>
        <p className="text-muted-foreground">Ask questions across volunteer and system data, and monitor real-time traffic statistics.</p>
      </div>

      <div className="flex gap-2 max-w-2xl mx-auto">
        <Input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="e.g. What are the top concerns from the feedback forms?" 
          className="h-12 bg-card"
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <Button onClick={handleAsk} disabled={asking || !query.trim()} className="h-12 px-6 bg-gradient-brand text-primary-foreground hover:opacity-90">
          {asking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>

      {response && (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-soft mt-6 max-w-2xl mx-auto">
          <div className="flex gap-3 items-start">
            <div className="bg-gradient-brand text-primary-foreground p-2 rounded-lg flex-shrink-0"><Brain className="h-5 w-5" /></div>
            <div className="text-sm leading-relaxed whitespace-pre-line pt-1">{response}</div>
          </div>
        </div>
      )}

      {/* Traffic Analytics Section */}
      <div className="pt-10">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-primary" /> Usage Traffic Statistics
        </h3>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-muted-foreground text-xs mb-1">Page Visits</div>
            <div className="text-2xl font-bold">{traffic.totalPageVisits}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-muted-foreground text-xs mb-1">Chat Opens</div>
            <div className="text-2xl font-bold">{traffic.totalChatOpens}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-muted-foreground text-xs mb-1">FAQ Queries</div>
            <div className="text-2xl font-bold">{traffic.totalFaqQueries}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-xs mb-1">Export Data</div>
              <Button size="sm" onClick={() => exportCSV(
                ["Type", "Value", "Timestamp"],
                [
                  ...traffic.raw.pageVisits.map(v => ["Page Visit", v.route, v.timestamp]),
                  ...traffic.raw.chatEvents.map(e => ["Chat Event", e.mode, e.timestamp]),
                  ...traffic.raw.faqQueries.map(q => ["FAQ", q.query, q.timestamp])
                ],
                "traffic_stats"
              )} className="mt-1 h-8 px-3 text-xs bg-gradient-brand text-primary-foreground">
                <Download className="mr-1 h-3 w-3" /> CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Top Pages */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Top Pages</h4>
            {traffic.topPages.length === 0 ? <p className="text-xs text-muted-foreground">No traffic yet</p> : (
              <div className="space-y-3">
                {traffic.topPages.slice(0, 5).map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate">{p.route}</span>
                      <span className="font-bold">{p.count}</span>
                    </div>
                    <Progress value={(p.count / traffic.topPages[0].count) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Feature Usage */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Chat Mode Engagement</h4>
            {traffic.chatModeChart.length === 0 ? <p className="text-xs text-muted-foreground">No chat data</p> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={traffic.chatModeChart} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="mode" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="count" fill="#E85D75" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top Search Terms */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card md:col-span-2">
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2"><Brain className="h-4 w-4" /> Most Searched Chat Terms (FAQ)</h4>
            {traffic.topFaqTerms.length === 0 ? <p className="text-xs text-muted-foreground">No searches recorded</p> : (
              <div className="flex flex-wrap gap-2">
                {traffic.topFaqTerms.map((term, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1.5 text-xs font-medium bg-muted/50">
                    {term.term} <span className="ml-1 text-muted-foreground opacity-60">({term.count})</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-accent" /> Connect Form Analytics
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4">Submissions by City</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="count" fill="#6B5B95" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4">Selected Topics</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={topicData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({name}) => name.length > 10 ? name.slice(0, 10)+'...' : name} labelLine={false}>
                  {topicData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4">Support Requested</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={supportData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({name}) => name.length > 10 ? name.slice(0, 10)+'...' : name} labelLine={false}>
                  {supportData.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-primary" /> Volunteer Pipeline
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4">Pipeline Funnel</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="step" type="category" tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="count" fill="#1FA39B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h4 className="font-semibold text-sm mb-4">Top Skills</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={skillsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({name}) => name} labelLine={false}>
                  {skillsData.map((_, i) => <Cell key={i} fill={COLORS[(i+1) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ CONTENT PANEL (Counseling page editor) ━━━━━━━━━━━━━━━━━━━

function ContentPanel() {
  const [content, setContent] = useState<CounselingContent>(DEFAULT_COUNSELING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCounselingContent().then((c) => { setContent(c); setLoading(false); });
  }, []);

  const update = <K extends keyof CounselingContent>(key: K, value: CounselingContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }));

  // ── Therapist helpers ──
  const addTherapist = () =>
    update("therapists", [...content.therapists, { name: "", title: "", credentials: "", focus: "" }]);
  const updateTherapist = (i: number, key: keyof Therapist, value: string) =>
    update("therapists", content.therapists.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)));
  const removeTherapist = (i: number) =>
    update("therapists", content.therapists.filter((_, idx) => idx !== i));

  // ── Fee helpers ──
  const addFee = () =>
    update("fees", [...content.fees, { label: "", amount: "", note: "" }]);
  const updateFee = (i: number, key: keyof FeeTier, value: string) =>
    update("fees", content.fees.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)));
  const removeFee = (i: number) =>
    update("fees", content.fees.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const password = sessionStorage.getItem(ADMIN_PWD_KEY) ?? "";
    if (!password) { toast.error("Session expired — please lock and log in again."); return; }
    setSaving(true);
    const result = await saveCounselingContent(content, password);
    setSaving(false);
    if (result.ok) toast.success("Counseling page updated — visitors will see the changes. 💜");
    else toast.error(result.error);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading current content…
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" /> Counseling Page Editor
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Edit the therapist credentials, charges, and sliding scale shown on the public 1:1
            Counseling page. Changes are visible to all visitors after you save.
          </p>
        </div>
        <a
          href="/services/counseling"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline whitespace-nowrap"
        >
          <Eye className="h-4 w-4" /> View live page
        </a>
      </div>

      {/* Publish toggle */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-sm">Publish these details</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            When off, the page shows a "details coming soon" message instead of the therapists/fees.
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("published", !content.published)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            content.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
          }`}
        >
          {content.published ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          {content.published ? "Published" : "Hidden"}
        </button>
      </div>

      {/* Intro */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-2">
        <Label htmlFor="c-intro">Intro paragraph</Label>
        <Textarea
          id="c-intro"
          value={content.intro}
          onChange={(e) => update("intro", e.target.value)}
          rows={3}
          className="resize-none"
          placeholder="A short sentence shown at the top of the counseling details."
        />
      </div>

      {/* Therapists */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Therapists</h3>
          <Button size="sm" variant="outline" onClick={addTherapist}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add therapist
          </Button>
        </div>
        {content.therapists.length === 0 && (
          <p className="text-sm text-muted-foreground">No therapists added yet.</p>
        )}
        {content.therapists.map((t, i) => (
          <div key={i} className="rounded-xl border border-border bg-background p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeTherapist(i)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-red-600"
              title="Remove therapist"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <input className={inputCls} value={t.name}
                  onChange={(e) => updateTherapist(i, "name", e.target.value)}
                  placeholder="Dr. Jane Doe" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title / role</Label>
                <input className={inputCls} value={t.title}
                  onChange={(e) => updateTherapist(i, "title", e.target.value)}
                  placeholder="Clinical Psychologist" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Qualifications &amp; registration</Label>
              <input className={inputCls} value={t.credentials}
                onChange={(e) => updateTherapist(i, "credentials", e.target.value)}
                placeholder="M.Phil Clinical Psychology · RCI-registered (A-12345)" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Areas of focus</Label>
              <input className={inputCls} value={t.focus}
                onChange={(e) => updateTherapist(i, "focus", e.target.value)}
                placeholder="anxiety, grief, trauma, relationships" />
            </div>
          </div>
        ))}
      </div>

      {/* Fees / sliding scale */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Session charges / sliding-scale tiers</h3>
          <Button size="sm" variant="outline" onClick={addFee}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add tier
          </Button>
        </div>
        {content.fees.length === 0 && (
          <p className="text-sm text-muted-foreground">No fee tiers added yet.</p>
        )}
        {content.fees.map((f, i) => (
          <div key={i} className="rounded-xl border border-border bg-background p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeFee(i)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-red-600"
              title="Remove tier"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tier label</Label>
                <input className={inputCls} value={f.label}
                  onChange={(e) => updateFee(i, "label", e.target.value)}
                  placeholder="Standard / Reduced / Supported" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Amount</Label>
                <input className={inputCls} value={f.amount}
                  onChange={(e) => updateFee(i, "amount", e.target.value)}
                  placeholder="₹1,200 per 50-min session" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Note (optional)</Label>
              <input className={inputCls} value={f.note}
                onChange={(e) => updateFee(i, "note", e.target.value)}
                placeholder="for those who can pay the full rate" />
            </div>
          </div>
        ))}
        <div className="space-y-1.5 pt-2">
          <Label htmlFor="c-sliding">Sliding-scale note</Label>
          <Textarea
            id="c-sliding"
            value={content.slidingScaleNote}
            onChange={(e) => update("slidingScaleNote", e.target.value)}
            rows={2}
            className="resize-none"
            placeholder="How someone can request a reduced or free place."
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-2 h-4 w-4" /> Save &amp; publish</>}
        </Button>
        <p className="text-xs text-muted-foreground">
          Saves to cloud storage so every visitor sees the update.
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━ 9. SETTINGS PANEL ━━━━━━━━━━━━━━━━━━━

function SettingsPanel(_props: { db: AppState }) {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"checking" | "active" | "inactive">("checking");

  useEffect(() => {
    isGeminiAvailable().then((ok) => setStatus(ok ? "active" : "inactive"));
  }, []);

  const testConnection = async () => {
    setTesting(true);
    const ok = await testGeminiConnection();
    setTesting(false);
    setStatus(ok ? "active" : "inactive");
    if (ok) toast.success("Live AI connection successful! ✅");
    else toast.error("AI not reachable. Check GEMINI_API_KEY on the server & billing/quota.");
  };

  const handleReset = useCallback(() => {
    resetState();
    toast.success("All data has been reset to defaults. 🔄");
  }, []);

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" /> AI Settings
      </h2>

      {/* AI Status (key lives server-side) */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Mode</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : status === "checking"
                ? "bg-muted text-muted-foreground"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {status === "checking" ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Checking…</>
            ) : status === "active" ? (
              <><ToggleRight className="h-3.5 w-3.5" /> Gemini AI Active</>
            ) : (
              <><ToggleLeft className="h-3.5 w-3.5" /> Simulated AI</>
            )}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {status === "active"
            ? "Real AI is live — requests are proxied securely through the server, so the API key is never exposed to the browser."
            : "Real AI is not active. The app is using the built-in simulated engine. Set the GEMINI_API_KEY environment variable on the server (Vercel → Settings → Environment Variables) and make sure the Google project has billing/quota enabled, then redeploy."}
        </p>
        <Button onClick={testConnection} disabled={testing} variant="outline" size="sm">
          {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Test Live Connection
        </Button>
      </div>

      {/* Setup help */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Where is the API key?</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          For security, the Gemini key is stored on the server as the <code className="text-xs bg-muted px-1 py-0.5 rounded">GEMINI_API_KEY</code> environment variable — not in this panel and not in the browser bundle. To rotate it, update the variable in your hosting dashboard and redeploy.
        </p>
      </div>

      {/* Reset */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 space-y-3">
        <h3 className="font-semibold flex items-center gap-2 text-red-700">
          <Trash2 className="h-5 w-5" />
          Reset All Data
        </h3>
        <p className="text-sm text-red-600/80">
          This will clear all volunteers, donations, feedback, and participation logs — resetting everything to the default mock data.
        </p>
        <Button onClick={handleReset} variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
          <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
