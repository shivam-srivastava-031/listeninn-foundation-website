import * as XLSX from "xlsx";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ConnectSubmission {
  id: string;
  submittedAt: string;
  // Section 01 – About You
  preferredName: string;
  fullName: string;
  ageGroup: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  // Section 02 – Topics
  topics: string[];
  otherTopic: string;
  // Section 03 – Story
  story: string;
  // Section 04 – Support
  supportTypes: string[];
  // Section 05 – Contact
  reachMethod: string;
  availability: string;
}

// ── Storage helpers ────────────────────────────────────────────────────────

const STORAGE_KEY = "listeninn_connect_submissions";

/** S5: validate shape of a stored submission */
function isValidSubmission(obj: unknown): obj is ConnectSubmission {
  if (typeof obj !== "object" || obj === null) return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.submittedAt === "string" &&
    typeof s.preferredName === "string" &&
    typeof s.phone === "string" &&
    Array.isArray(s.topics) &&
    Array.isArray(s.supportTypes)
  );
}

export function getSubmissions(): ConnectSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // S5: filter out any malformed records
    return parsed.filter(isValidSubmission);
  } catch {
    return [];
  }
}

export function saveSubmission(data: Omit<ConnectSubmission, "id" | "submittedAt">): ConnectSubmission {
  const submission: ConnectSubmission = {
    id: `CS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    ...data,
  };
  const all = getSubmissions();
  all.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return submission;
}

export function deleteSubmission(id: string): void {
  const all = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function clearAllSubmissions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Seeds a single "test" connect submission for verification purposes. */
export function seedTestSubmission(): void {
  const existing = getSubmissions();
  // Only seed if no submissions exist yet
  if (existing.length > 0) return;
  const testSub: ConnectSubmission = {
    id: "CS-TEST-00001",
    submittedAt: new Date().toISOString(),
    preferredName: "Test User",
    fullName: "Test User Full Name",
    ageGroup: "18–25",
    email: "test.connect@listeninn.org",
    phone: "+91 99999 00002",
    city: "Test City",
    state: "Test State",
    topics: ["Anxiety", "Depression"],
    otherTopic: "",
    story: "This is a test connect form submission. Created to verify that the admin panel correctly displays submissions and that CSV/Excel export works as expected.",
    supportTypes: ["Talk to someone", "Professional counseling"],
    reachMethod: "WhatsApp",
    availability: "Weekday evenings",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([testSub]));
}

// ── S8: CSV injection prevention ───────────────────────────────────────────

/** Prefix cells starting with formula characters to prevent CSV injection. */
function sanitizeCsvCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`;
  return value;
}

// ── CSV export ─────────────────────────────────────────────────────────────

export function exportSubmissionsToCSV(submissions: ConnectSubmission[]): void {
  if (submissions.length === 0) return;

  const headers = [
    "Submission ID", "Date Submitted", "Preferred Name", "Full Name",
    "Age Group", "Email", "Phone / WhatsApp", "City", "State",
    "Topics", "Story", "Support Needed", "Reach Method", "Availability",
  ];

  const rows = submissions.map((s) => [
    s.id,
    new Date(s.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    s.preferredName,
    s.fullName || "—",
    s.ageGroup,
    s.email || "—",
    s.phone,
    s.city,
    s.state,
    s.topics.join("; ") + (s.otherTopic ? `; Other: ${s.otherTopic}` : ""),
    s.story,
    s.supportTypes.join("; "),
    s.reachMethod,
    s.availability,
  ].map(sanitizeCsvCell));

  const csv = [headers, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `listeninn_connect_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Excel export ───────────────────────────────────────────────────────────

export function exportSubmissionsToExcel(submissions: ConnectSubmission[]): void {
  // B4: guard against empty array crash
  if (submissions.length === 0) return;

  const rows = submissions.map((s) => ({
    "Submission ID": sanitizeCsvCell(s.id),
    "Date Submitted": new Date(s.submittedAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    "Preferred Name": sanitizeCsvCell(s.preferredName),
    "Full Name": sanitizeCsvCell(s.fullName || "—"),
    "Age Group": s.ageGroup,
    "Email": sanitizeCsvCell(s.email || "—"),
    "Phone / WhatsApp": sanitizeCsvCell(s.phone),
    "City": sanitizeCsvCell(s.city),
    "State": sanitizeCsvCell(s.state),
    "Topics to Discuss": s.topics.join(", ") + (s.otherTopic ? `, Other: ${s.otherTopic}` : ""),
    "Story / Message": s.story,
    "Support Needed": s.supportTypes.join(", "),
    "Preferred Reach Method": s.reachMethod,
    "Availability": s.availability,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto column widths (B4 fix: safe because rows.length > 0 is guaranteed above)
  const firstRow = rows[0] as Record<string, string>;
  const colWidths = Object.keys(firstRow).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((r) => String((r as Record<string, string>)[key] ?? "").length)
    ) + 2,
  }));
  worksheet["!cols"] = colWidths;

  // Style header row (bold)
  const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1");
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellRef]) continue;
    worksheet[cellRef].s = { font: { bold: true } };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Connect Submissions");

  const fileName = `listeninn_connect_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
