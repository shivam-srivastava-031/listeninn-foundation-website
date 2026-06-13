import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { saveSubmission } from "@/lib/connectStore";
import { PageShell } from "@/components/layout";
import {
  User,
  Heart,
  BookOpen,
  Phone,
  Shield,
  MessageCircle,
  MapPin,
  Mail,
  ChevronDown,
  Users,
  Lightbulb,
  BookMarked,
  Briefcase,
  DollarSign,
  HeartHandshake,
  Globe,
  HelpCircle,
  Headphones,
  Info,
  MessageSquare,
  RefreshCw,
  Lock,
  Send,
} from "lucide-react";
import logo from "@/assets/listeninn-logo.png";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect With Listeninn Foundation" },
      {
        name: "description",
        content:
          "A safe space to share, connect, and be heard. Fill out this form and a member of our team will review your submission and get back to you.",
      },
    ],
  }),
  component: ConnectPage,
});

const DISCUSSION_TOPICS = [
  { label: "Personal Challenges", icon: User },
  { label: "Emotional Well-being", icon: Heart },
  { label: "Family Concerns", icon: Users },
  { label: "Education Guidance", icon: BookMarked },
  { label: "Career Guidance", icon: Briefcase },
  { label: "Financial Difficulties", icon: DollarSign },
  { label: "Relationship Concerns", icon: HeartHandshake },
  { label: "Community Support", icon: Globe },
  { label: "Social Issues", icon: MessageCircle },
];

const SUPPORT_TYPES = [
  { label: "Someone to listen", icon: Headphones },
  { label: "Guidance or suggestions", icon: Lightbulb },
  { label: "Information about resources", icon: Info },
  { label: "Community support", icon: Users },
  { label: "Follow-up conversation", icon: RefreshCw },
  { label: "Not sure yet", icon: HelpCircle },
];

const AGE_GROUPS = [
  "Under 13",
  "13–17",
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55–64",
  "65+",
  "Prefer not to say",
];

const REACH_OPTIONS = ["WhatsApp", "Phone Call", "Email", "Text Message", "No Preference"];
const AVAILABILITY_OPTIONS = ["Morning", "Afternoon", "Evening", "Flexible"];

const SECTION_STEPS = [
  {
    number: "01",
    label: "ABOUT YOU",
    desc: "Help us know you better.",
    icon: User,
    color: "from-purple-500 to-indigo-500",
  },
  {
    number: "02",
    label: "HOW CAN WE HELP?",
    desc: "Let us understand what you'd like to talk about.",
    icon: MessageCircle,
    color: "from-teal-500 to-cyan-500",
  },
  {
    number: "03",
    label: "SHARE YOUR STORY",
    desc: "We are here to listen with care and compassion.",
    icon: BookOpen,
    color: "from-rose-400 to-pink-500",
  },
  {
    number: "04",
    label: "WHAT ARE YOU LOOKING FOR?",
    desc: "Let us know how we can support you best.",
    icon: Heart,
    color: "from-amber-400 to-orange-500",
  },
  {
    number: "05",
    label: "LET'S STAY CONNECTED",
    desc: "Help us reach you in the best way possible.",
    icon: Phone,
    color: "from-blue-500 to-cyan-400",
  },
  {
    number: "06",
    label: "PRIVACY & CONSENT",
    desc: "Your privacy and trust are important to us.",
    icon: Shield,
    color: "from-purple-400 to-violet-600",
  },
];

function SectionSidebar({ index }: { index: number }) {
  const s = SECTION_STEPS[index];
  const Icon = s.icon;
  return (
    <div className="connect-sidebar-section">
      <div className={`connect-sidebar-icon bg-gradient-to-br ${s.color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="connect-sidebar-text">
        <span className="connect-sidebar-number">{s.number}</span>
        <span className="connect-sidebar-label">{s.label}</span>
        <span className="connect-sidebar-desc">{s.desc}</span>
      </div>
    </div>
  );
}

function ConnectPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [otherTopic, setOtherTopic] = useState("");
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [reachMethod, setReachMethod] = useState("");
  const [availability, setAvailability] = useState("");
  const [storyCharCount, setStoryCharCount] = useState(0);
  const [consents, setConsents] = useState({ c1: false, c2: false, c3: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTopic = (label: string) => {
    setSelectedTopics((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const toggleSupport = (label: string) => {
    setSelectedSupport((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consents.c1 || !consents.c2 || !consents.c3) {
      toast.error("Please accept all consent statements to proceed.");
      return;
    }
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const get = (key: string) => (fd.get(key) as string | null) ?? "";

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    saveSubmission({
      preferredName: get("preferred_name"),
      fullName: get("full_name"),
      ageGroup: get("age_group"),
      email: get("email"),
      phone: get("phone"),
      city: get("city"),
      state: get("state"),
      topics: selectedTopics,
      otherTopic,
      story: get("story"),
      supportTypes: selectedSupport,
      reachMethod,
      availability,
    });

    setSubmitting(false);
    setSubmitted(true);
    toast.success("Your story has been shared! We'll be in touch soon. 💜");
  };

  if (submitted) {
    return (
      <PageShell>
        <div className="connect-success-page">
          <div className="connect-success-card">
            <div className="connect-success-heart">💜</div>
            <h1 className="connect-success-title">Thank You for Reaching Out</h1>
            <p className="connect-success-tagline">Your voice matters.</p>
            <p className="connect-success-body">
              Thank you for taking the time to connect with Listeninn Foundation. We appreciate
              the trust you've placed in us by sharing your thoughts and experiences. Our team
              will review your submission and reach out as soon as possible.
            </p>
            <div className="connect-success-badges">
              <span className="connect-success-badge">
                <Lock className="h-4 w-4" />
                Your information is safe with us
              </span>
              <span className="connect-success-badge">
                <Shield className="h-4 w-4" />
                We respect your privacy
              </span>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* ── Hero Header ── */}
      <section className="connect-hero">
        <div className="connect-hero-blob connect-hero-blob-1" />
        <div className="connect-hero-blob connect-hero-blob-2" />
        <div className="connect-hero-inner">
          <div className="connect-hero-left">
            <div className="connect-hero-brand">
              <img src={logo} alt="Listeninn logo" className="connect-hero-logo" />
              <div>
                <div className="connect-hero-brand-name">LISTENINN</div>
                <div className="connect-hero-brand-sub">FOUNDATION</div>
                <div className="connect-hero-brand-tagline">Where Every Voice is Heard With Heart</div>
              </div>
            </div>
            <h1 className="connect-hero-title">
              Connect With{" "}
              <span className="connect-hero-title-accent">Listeninn Foundation</span>
            </h1>
            <p className="connect-hero-subtitle">A Safe Space to Share, Connect, and Be Heard</p>
            <p className="connect-hero-body">
              Whether you're facing a challenge, looking for guidance, seeking support, or simply
              want someone to listen, we're here to hear your story.
            </p>
            <div className="connect-hero-notice">
              <div className="connect-hero-notice-icon">
                <Shield className="h-4 w-4" />
              </div>
              <p>
                Please fill out this form, and a member of our team will review your submission
                and get back to you.
              </p>
            </div>
          </div>
          <div className="connect-hero-right">
            <div className="connect-hero-bubble connect-hero-bubble-left">
              <span>You matter.</span>
              <span>Your voice</span>
              <span>matters.</span>
            </div>
            <div className="connect-hero-bubble connect-hero-bubble-right">
              <span>We are</span>
              <span>listening.</span>
            </div>
            <div className="connect-hero-illustration">
              <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="connect-hero-svg">
                {/* Left hand reaching */}
                <ellipse cx="60" cy="110" rx="45" ry="20" fill="url(#handGrad1)" opacity="0.9" />
                <ellipse cx="55" cy="95" rx="12" ry="28" fill="url(#handGrad1)" opacity="0.85" rx-transform="rotate(-15)" />
                <rect x="38" y="72" width="10" height="32" rx="5" fill="url(#handGrad1)" transform="rotate(-10 43 88)" />
                <rect x="50" y="68" width="10" height="35" rx="5" fill="url(#handGrad1)" transform="rotate(-5 55 85)" />
                <rect x="62" y="70" width="10" height="33" rx="5" fill="url(#handGrad1)" transform="rotate(5 67 86)" />
                <rect x="73" y="75" width="9" height="28" rx="4.5" fill="url(#handGrad1)" transform="rotate(15 77 89)" />
                {/* Right hand reaching */}
                <ellipse cx="140" cy="110" rx="45" ry="20" fill="url(#handGrad2)" opacity="0.9" />
                <rect x="117" y="72" width="10" height="32" rx="5" fill="url(#handGrad2)" transform="rotate(-15 122 88)" />
                <rect x="129" y="68" width="10" height="35" rx="5" fill="url(#handGrad2)" transform="rotate(-5 134 85)" />
                <rect x="141" y="70" width="10" height="33" rx="5" fill="url(#handGrad2)" transform="rotate(5 146 86)" />
                <rect x="152" y="75" width="9" height="28" rx="4.5" fill="url(#handGrad2)" transform="rotate(15 156 89)" />
                {/* Leaves / accents */}
                <ellipse cx="30" cy="50" rx="8" ry="20" fill="#a78bfa" opacity="0.4" transform="rotate(-30 30 50)" />
                <ellipse cx="170" cy="45" rx="8" ry="20" fill="#34d399" opacity="0.35" transform="rotate(30 170 45)" />
                <defs>
                  <linearGradient id="handGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="handGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Form ── */}
      <section className="connect-form-section">
        <form ref={formRef} onSubmit={handleSubmit} className="connect-form-wrapper" noValidate>

          {/* ── SECTION 01 – About You ── */}
          <div className="connect-section-card">
            <SectionSidebar index={0} />
            <div className="connect-section-fields">
              <div className="connect-field-grid-2">
                <div className="connect-field">
                  <label htmlFor="cf-preferred-name" className="connect-label">
                    1. What should we call you? <span className="connect-required">*</span>
                  </label>
                  <div className="connect-input-wrap">
                    <User className="connect-input-icon" />
                    <input
                      id="cf-preferred-name"
                      name="preferred_name"
                      required
                      maxLength={100}
                      placeholder="Enter your preferred name"
                      className="connect-input connect-input-has-icon"
                    />
                  </div>
                </div>
                <div className="connect-field">
                  <label htmlFor="cf-full-name" className="connect-label">
                    2. Full Name <span className="connect-optional">(Optional)</span>
                  </label>
                  <input
                    id="cf-full-name"
                    name="full_name"
                    maxLength={100}
                    placeholder="Enter your full name"
                    className="connect-input"
                  />
                </div>
                <div className="connect-field">
                  <label htmlFor="cf-age-group" className="connect-label">
                    3. Age Group <span className="connect-required">*</span>
                  </label>
                  <div className="connect-select-wrap">
                    <select id="cf-age-group" name="age_group" required className="connect-select">
                      <option value="">Select your age group</option>
                      {AGE_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronDown className="connect-select-icon" />
                  </div>
                </div>
                <div className="connect-field">
                  <label htmlFor="cf-email" className="connect-label">
                    4. Email Address
                  </label>
                  <div className="connect-input-wrap">
                    <Mail className="connect-input-icon" />
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      maxLength={100}
                      placeholder="Enter your email"
                      className="connect-input connect-input-has-icon"
                    />
                  </div>
                </div>
                <div className="connect-field">
                  <label htmlFor="cf-phone" className="connect-label">
                    5. Phone / WhatsApp Number <span className="connect-required">*</span>
                  </label>
                  <div className="connect-input-wrap">
                    <Phone className="connect-input-icon" />
                    <input
                      id="cf-phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={20}
                      placeholder="Enter your number"
                      className="connect-input connect-input-has-icon"
                    />
                  </div>
                </div>
                <div className="connect-field">
                  <label htmlFor="cf-city" className="connect-label">
                    6. City <span className="connect-required">*</span>
                  </label>
                  <div className="connect-input-wrap">
                    <MapPin className="connect-input-icon" />
                    <input
                      id="cf-city"
                      name="city"
                      required
                      maxLength={50}
                      placeholder="Enter your city"
                      className="connect-input connect-input-has-icon"
                    />
                  </div>
                </div>
                <div className="connect-field connect-field-full">
                  <label htmlFor="cf-state" className="connect-label">
                    7. State <span className="connect-required">*</span>
                  </label>
                  <div className="connect-input-wrap">
                    <MapPin className="connect-input-icon" />
                    <input
                      id="cf-state"
                      name="state"
                      required
                      maxLength={50}
                      placeholder="Enter your state"
                      className="connect-input connect-input-has-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 02 – How can we help ── */}
          <div className="connect-section-card">
            <SectionSidebar index={1} />
            <div className="connect-section-fields">
              <div className="connect-field">
                <label className="connect-label">
                  8. What would you like to discuss?{" "}
                  <span className="connect-label-hint">(Select all that apply)</span>{" "}
                  <span className="connect-required">*</span>
                </label>
                <div className="connect-chip-grid">
                  {DISCUSSION_TOPICS.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      id={`cf-topic-${label.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => toggleTopic(label)}
                      className={`connect-chip ${selectedTopics.includes(label) ? "connect-chip-active" : ""}`}
                    >
                      <Icon className="connect-chip-icon" />
                      {label}
                    </button>
                  ))}
                  {/* Other chip with input */}
                  <div className={`connect-chip connect-chip-other ${selectedTopics.includes("Other") ? "connect-chip-active" : ""}`}
                    onClick={() => toggleTopic("Other")}>
                    <HelpCircle className="connect-chip-icon" />
                    <span>Other</span>
                    {selectedTopics.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={otherTopic}
                        maxLength={50}
                        onChange={(e) => { e.stopPropagation(); setOtherTopic(e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className="connect-chip-other-input"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 03 – Share Your Story ── */}
          <div className="connect-section-card">
            <SectionSidebar index={2} />
            <div className="connect-section-fields">
              <div className="connect-field">
                <label htmlFor="cf-story" className="connect-label">
                  9. Tell us what's on your mind. <span className="connect-required">*</span>
                </label>
                <p className="connect-field-hint">
                  Feel free to share as much or as little as you're comfortable with.
                  <br />
                  Our goal is simply to understand how we may be able to support you.
                </p>
                <div className="connect-textarea-wrap">
                  <textarea
                    id="cf-story"
                    name="story"
                    required
                    rows={6}
                    maxLength={2000}
                    placeholder="Share your thoughts here…"
                    className="connect-textarea"
                    onChange={(e) => setStoryCharCount(e.target.value.length)}
                  />
                  <span className="connect-char-count">{storyCharCount}/2000</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 04 – What are you looking for ── */}
          <div className="connect-section-card">
            <SectionSidebar index={3} />
            <div className="connect-section-fields">
              <div className="connect-field">
                <label className="connect-label">
                  10. What kind of support would be most helpful?{" "}
                  <span className="connect-required">*</span>
                </label>
                <div className="connect-chip-grid">
                  {SUPPORT_TYPES.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      id={`cf-support-${label.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => toggleSupport(label)}
                      className={`connect-chip ${selectedSupport.includes(label) ? "connect-chip-active" : ""}`}
                    >
                      <Icon className="connect-chip-icon" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 05 – Let's Stay Connected ── */}
          <div className="connect-section-card">
            <SectionSidebar index={4} />
            <div className="connect-section-fields">
              <div className="connect-field-grid-2">
                <div className="connect-field">
                  <label className="connect-label">
                    11. How would you like us to reach you?{" "}
                    <span className="connect-required">*</span>
                  </label>
                  <div className="connect-radio-group">
                    {REACH_OPTIONS.map((opt) => (
                      <label key={opt} className="connect-radio-label">
                        <input
                          type="radio"
                          name="reach_method"
                          value={opt}
                          checked={reachMethod === opt}
                          onChange={() => setReachMethod(opt)}
                          className="connect-radio"
                        />
                        <span className="connect-radio-custom" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="connect-field">
                  <label className="connect-label">
                    12. When are you generally available?{" "}
                    <span className="connect-required">*</span>
                  </label>
                  <div className="connect-radio-group">
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <label key={opt} className="connect-radio-label">
                        <input
                          type="radio"
                          name="availability"
                          value={opt}
                          checked={availability === opt}
                          onChange={() => setAvailability(opt)}
                          className="connect-radio"
                        />
                        <span className="connect-radio-custom" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 06 – Privacy & Consent ── */}
          <div className="connect-section-card">
            <SectionSidebar index={5} />
            <div className="connect-section-fields">
              <div className="connect-field">
                <label className="connect-label">
                  13. Consent <span className="connect-required">*</span>
                </label>
                <div className="connect-consent-group">
                  {(
                    [
                      {
                        key: "c1" as const,
                        text: "I consent to Listeninn Foundation contacting me regarding my submission.",
                      },
                      {
                        key: "c2" as const,
                        text: "I understand that responses may take some time and are not intended for emergency situations.",
                      },
                      {
                        key: "c3" as const,
                        text: "I agree to the respectful and confidential handling of the information I provide.",
                      },
                    ] as { key: "c1" | "c2" | "c3"; text: string }[]
                  ).map(({ key, text }) => (
                    <label key={key} className="connect-consent-label">
                      <input
                        type="checkbox"
                        id={`cf-consent-${key}`}
                        checked={consents[key]}
                        onChange={(e) =>
                          setConsents((prev) => ({ ...prev, [key]: e.target.checked }))
                        }
                        className="connect-checkbox"
                      />
                      <span className="connect-checkbox-custom" />
                      <span>{text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Thank You & Submit ── */}
          <div className="connect-submit-banner">
            <div className="connect-submit-banner-left">
              <div className="connect-submit-banner-title">
                Thank You for Reaching Out 💜
              </div>
              <p className="connect-submit-banner-body">
                Thank you for taking the time to connect with Listeninn Foundation. We appreciate
                the trust you've placed in us by sharing your thoughts and experiences. Our team
                will review your submission and reach out as soon as possible.
              </p>
            </div>
            <div className="connect-submit-banner-right">
              <button
                type="submit"
                id="cf-submit-btn"
                disabled={submitting}
                className="connect-submit-btn"
              >
                {submitting ? (
                  <span className="connect-submit-btn-inner">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  <span className="connect-submit-btn-inner">
                    <Send className="h-5 w-5" />
                    Share My Story
                  </span>
                )}
              </button>
              <div className="connect-submit-privacy">
                <Lock className="h-4 w-4" />
                <span>Your information is safe with us. We respect your privacy.</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="connect-form-footer">
            <span>© Listeninn Foundation. All rights reserved.</span>
            <span className="connect-footer-sep">·</span>
            <span>Where Every Voice Is Heard With Heart 💜</span>
          </div>
        </form>
      </section>

      {/* Inline page-specific styles */}
      <style>{`
        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */
        .connect-hero {
          position: relative;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #e0f2fe 100%);
          padding: 64px 24px 80px;
          overflow: hidden;
        }
        .connect-hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .connect-hero-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #c4b5fd55, transparent);
          top: -120px; right: -80px;
        }
        .connect-hero-blob-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #99f6e455, transparent);
          bottom: -80px; left: -60px;
        }
        .connect-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 48px;
          flex-wrap: wrap;
        }
        .connect-hero-left { flex: 1; min-width: 280px; }
        .connect-hero-right {
          flex: 0 0 320px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .connect-hero-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .connect-hero-logo {
          width: 48px; height: 48px;
          object-fit: contain;
        }
        .connect-hero-brand-name {
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.15em;
          color: #4f46e5;
        }
        .connect-hero-brand-sub {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: #7c3aed;
        }
        .connect-hero-brand-tagline {
          font-size: 9px;
          color: #6b7280;
          letter-spacing: 0.05em;
        }
        .connect-hero-title {
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 800;
          color: #1e1b4b;
          line-height: 1.15;
          margin: 0 0 12px;
        }
        .connect-hero-title-accent { color: #7c3aed; }
        .connect-hero-subtitle {
          font-size: 15px;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 12px;
        }
        .connect-hero-body {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 20px;
        }
        .connect-hero-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(124,58,237,0.06);
          border: 1px solid rgba(124,58,237,0.15);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #4b5563;
          line-height: 1.6;
        }
        .connect-hero-notice-icon {
          flex-shrink: 0;
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }

        /* Speech bubbles */
        .connect-hero-bubble {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 700;
          font-size: 15px;
          line-height: 1.4;
          border-radius: 20px;
          padding: 16px 22px;
          color: white;
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          animation: float 4s ease-in-out infinite;
        }
        .connect-hero-bubble-left {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          align-self: flex-start;
          animation-delay: 0s;
        }
        .connect-hero-bubble-right {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          align-self: flex-end;
          animation-delay: 1.5s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .connect-hero-illustration { width: 100%; }
        .connect-hero-svg { width: 100%; max-width: 240px; margin: 0 auto; display: block; }

        /* ═══════════════════════════════════════
           FORM SECTION
        ═══════════════════════════════════════ */
        .connect-form-section {
          background: #f8f7ff;
          padding: 48px 24px 64px;
        }
        .connect-form-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Section Cards ── */
        .connect-section-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #ede9fe;
          box-shadow: 0 4px 24px rgba(124,58,237,0.06);
          display: flex;
          gap: 0;
          overflow: hidden;
          transition: box-shadow 0.25s;
        }
        .connect-section-card:hover {
          box-shadow: 0 8px 40px rgba(124,58,237,0.11);
        }

        /* Sidebar */
        .connect-sidebar-section {
          width: 160px;
          flex-shrink: 0;
          padding: 28px 20px 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          border-right: 1px solid #ede9fe;
          background: linear-gradient(180deg, #faf9ff 0%, #f5f3ff 100%);
        }
        .connect-sidebar-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(124,58,237,0.2);
        }
        .connect-sidebar-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .connect-sidebar-number {
          font-size: 28px;
          font-weight: 800;
          color: #ede9fe;
          line-height: 1;
        }
        .connect-sidebar-label {
          font-size: 11px;
          font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.06em;
          line-height: 1.3;
        }
        .connect-sidebar-desc {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.5;
          margin-top: 4px;
        }

        /* Fields area */
        .connect-section-fields {
          flex: 1;
          padding: 28px 32px;
        }
        .connect-field-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 24px;
        }
        .connect-field { display: flex; flex-direction: column; gap: 6px; }
        .connect-field-full { grid-column: span 1; }

        /* Label */
        .connect-label {
          font-size: 13px;
          font-weight: 600;
          color: #1e1b4b;
        }
        .connect-required { color: #7c3aed; }
        .connect-optional { font-size: 11px; color: #9ca3af; font-weight: 400; }
        .connect-label-hint { font-size: 11px; color: #6b7280; font-weight: 400; }
        .connect-field-hint {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 8px;
        }

        /* Inputs */
        .connect-input-wrap { position: relative; }
        .connect-input-icon {
          position: absolute;
          left: 12px; top: 50%; transform: translateY(-50%);
          width: 15px; height: 15px;
          color: #a78bfa;
          pointer-events: none;
        }
        .connect-input {
          width: 100%;
          height: 42px;
          padding: 0 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13px;
          color: #1f2937;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .connect-input-has-icon { padding-left: 36px; }
        .connect-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
          background: white;
        }
        .connect-input::placeholder { color: #d1d5db; }

        /* Select */
        .connect-select-wrap { position: relative; }
        .connect-select {
          width: 100%;
          height: 42px;
          padding: 0 36px 0 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13px;
          color: #1f2937;
          background: #fafafa;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .connect-select:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
          background: white;
        }
        .connect-select-icon {
          position: absolute;
          right: 12px; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px;
          color: #a78bfa;
          pointer-events: none;
        }

        /* Textarea */
        .connect-textarea-wrap { position: relative; }
        .connect-textarea {
          width: 100%;
          padding: 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 13px;
          color: #1f2937;
          background: #fafafa;
          outline: none;
          resize: none;
          line-height: 1.6;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .connect-textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
          background: white;
        }
        .connect-textarea::placeholder { color: #d1d5db; }
        .connect-char-count {
          position: absolute;
          bottom: 10px; right: 14px;
          font-size: 11px;
          color: #9ca3af;
        }

        /* Chip grid */
        .connect-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }
        .connect-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 50px;
          font-size: 12.5px;
          font-weight: 500;
          color: #4b5563;
          background: white;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .connect-chip:hover {
          border-color: #a78bfa;
          color: #7c3aed;
          background: #faf5ff;
        }
        .connect-chip-active {
          border-color: #7c3aed;
          background: #f5f3ff;
          color: #7c3aed;
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(124,58,237,0.12);
        }
        .connect-chip-icon {
          width: 14px; height: 14px;
          flex-shrink: 0;
        }
        .connect-chip-other { cursor: pointer; }
        .connect-chip-other-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 12px;
          color: #7c3aed;
          width: 100px;
          padding: 0;
          margin-left: 4px;
        }
        .connect-chip-other-input::placeholder { color: #c4b5fd; }

        /* Radio buttons */
        .connect-radio-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }
        .connect-radio-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
        }
        .connect-radio { display: none; }
        .connect-radio-custom {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          flex-shrink: 0;
          transition: all 0.2s;
          position: relative;
        }
        .connect-radio:checked + .connect-radio-custom {
          border-color: #7c3aed;
          background: #7c3aed;
          box-shadow: inset 0 0 0 3px white;
        }

        /* Consent checkboxes */
        .connect-consent-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 4px;
        }
        .connect-consent-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          line-height: 1.5;
        }
        .connect-checkbox { display: none; }
        .connect-checkbox-custom {
          width: 18px; height: 18px;
          flex-shrink: 0;
          border-radius: 5px;
          border: 2px solid #d1d5db;
          transition: all 0.2s;
          margin-top: 1px;
          position: relative;
        }
        .connect-checkbox:checked + .connect-checkbox-custom {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-color: #7c3aed;
        }
        .connect-checkbox:checked + .connect-checkbox-custom::after {
          content: '';
          position: absolute;
          left: 4px; top: 1px;
          width: 5px; height: 9px;
          border: 2px solid white;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }

        /* ── Submit Banner ── */
        .connect-submit-banner {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
          border-radius: 20px;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
          box-shadow: 0 12px 48px rgba(67,56,202,0.3);
        }
        .connect-submit-banner-left { flex: 1; min-width: 240px; }
        .connect-submit-banner-title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
        }
        .connect-submit-banner-body {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
        }
        .connect-submit-banner-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .connect-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          color: white;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 32px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(124,58,237,0.4);
          white-space: nowrap;
        }
        .connect-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(124,58,237,0.5);
        }
        .connect-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .connect-submit-btn-inner {
          display: flex; align-items: center; gap: 8px;
        }
        .connect-submit-privacy {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-align: center;
        }

        /* Form footer */
        .connect-form-footer {
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
          padding: 8px 0 4px;
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .connect-footer-sep { color: #d1d5db; }

        /* ── Success Page ── */
        .connect-success-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
        }
        .connect-success-card {
          background: white;
          border-radius: 24px;
          padding: 56px 48px;
          max-width: 560px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 80px rgba(124,58,237,0.12);
          animation: scaleIn 0.4s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .connect-success-heart {
          font-size: 56px;
          margin-bottom: 20px;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        .connect-success-title {
          font-size: 26px;
          font-weight: 800;
          color: #1e1b4b;
          margin: 0 0 8px;
        }
        .connect-success-tagline {
          font-size: 14px;
          font-weight: 600;
          color: #7c3aed;
          margin-bottom: 16px;
        }
        .connect-success-body {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .connect-success-badges {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .connect-success-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #4b5563;
          background: #f5f3ff;
          border: 1px solid #e5e7eb;
          padding: 8px 14px;
          border-radius: 50px;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .connect-sidebar-section { display: none; }
          .connect-section-fields { padding: 20px 18px; }
          .connect-field-grid-2 { grid-template-columns: 1fr; }
          .connect-hero-right { display: none; }
          .connect-submit-banner { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
          .connect-success-card { padding: 36px 24px; }
        }
        @media (max-width: 900px) {
          .connect-sidebar-section { width: 130px; }
        }
      `}</style>
    </PageShell>
  );
}
