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

export function getSubmissions(): ConnectSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConnectSubmission[]) : [];
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

// ── Excel export ───────────────────────────────────────────────────────────

export function exportSubmissionsToExcel(submissions: ConnectSubmission[]): void {
  const rows = submissions.map((s) => ({
    "Submission ID": s.id,
    "Date Submitted": new Date(s.submittedAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    "Preferred Name": s.preferredName,
    "Full Name": s.fullName || "—",
    "Age Group": s.ageGroup,
    "Email": s.email || "—",
    "Phone / WhatsApp": s.phone,
    "City": s.city,
    "State": s.state,
    "Topics to Discuss": s.topics.join(", ") + (s.otherTopic ? `, Other: ${s.otherTopic}` : ""),
    "Story / Message": s.story,
    "Support Needed": s.supportTypes.join(", "),
    "Preferred Reach Method": s.reachMethod,
    "Availability": s.availability,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto column widths
  const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
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

  const fileName = `listeninn_connect_submissions_${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
