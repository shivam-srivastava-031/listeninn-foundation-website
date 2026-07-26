// ─────────────────────────────────────────────────────────────────────────────
// ListenInn Foundation — Services catalog (single source of truth)
//
// Used by:
//   • the homepage "Our Work" preview   (src/routes/index.tsx)
//   • the services grid                  (src/routes/services.tsx)
//   • the per-service detail layer       (src/routes/services.$serviceId.tsx)
//
// Each service has a `slug` that drives its detail-page URL: /services/<slug>.
// ─────────────────────────────────────────────────────────────────────────────

import { Phone, MessageCircle, Users, Ear, Heart, Shield, type LucideIcon } from "lucide-react";

/** How visitors can act on a service. `to` is an internal route; `href` is external/mailto/anchor. */
export interface ServiceAction {
  label: string;
  to?: string;
  href?: string;
  external?: boolean;
  primary?: boolean;
}

/** Optional placeholder block for details we can't publish yet (e.g. therapist credentials). */
export interface ServicePlaceholder {
  heading: string;
  intro: string;
  /** Labelled rows the foundation can fill in later. */
  fields: { label: string; placeholder: string }[];
  note?: string;
}

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  /** One-liner used on cards. */
  summary: string;
  /** Slightly longer line used on the services grid. */
  blurb: string;
  /** Full paragraphs for the detail layer. */
  overview: string[];
  /** "What to expect" bullets on the detail layer. */
  whatToExpect: string[];
  /** Optional "how this is different" contrast block (used by Listening Sessions). */
  howItDiffers?: { heading: string; points: { term: string; text: string }[] };
  /** Optional placeholder block (used by 1:1 Counseling for credentials/fees). */
  placeholder?: ServicePlaceholder;
  /** Ways to take the next step, shown on the detail layer. */
  actions: ServiceAction[];
}

export const CONTACT_EMAIL = "listeninnfoundation@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/listeninnfoundation/";

/** Actions most services share: share your story, or email us. */
const COMMON_ACTIONS: ServiceAction[] = [
  { label: "Share your story", to: "/connect", primary: true },
  { label: "Email us", href: `mailto:${CONTACT_EMAIL}` },
];

export const SERVICES: Service[] = [
  {
    slug: "helpline",
    icon: Phone,
    title: "24/7 Helpline",
    summary: "Speak with a trained listener anytime, day or night.",
    blurb:
      "Speak with a trained listener anytime, day or night. Free and confidential — no appointment needed.",
    overview: [
      "Our helpline is designed to be here for you around the clock — whether it's 3 AM anxiety, a midday crisis, or simply a heavy feeling you can't name. It is free, confidential, and you never need an appointment.",
      "We are currently setting up a dedicated helpline phone number. Until it goes live, the surest way to reach a listener is to share your story through our Connect form or email us — a real member of our team will read it with care and respond.",
    ],
    whatToExpect: [
      "A calm, non-judgmental listener who is fully present with you",
      "Complete confidentiality — you can stay anonymous",
      "No script and no rush — you set the pace",
      "A gentle pointer to further support if you'd find it helpful",
    ],
    actions: [
      { label: "Share your story", to: "/connect", primary: true },
      { label: "Email us", href: `mailto:${CONTACT_EMAIL}` },
      { label: "Message us on Instagram", href: INSTAGRAM_URL, external: true },
    ],
  },
  {
    slug: "counseling",
    icon: MessageCircle,
    title: "1:1 Counseling",
    summary: "One-on-one support with qualified professionals.",
    blurb: "Connect with qualified professionals for one-on-one support, tailored to you.",
    overview: [
      "Our 1:1 counseling connects you with a trained professional for private, focused sessions built around what you're going through. Sessions are planned both in-person and online.",
      "We want this to be fully transparent. As we finalise our counseling team, the section below will carry each professional's credentials, session charges, and our sliding-scale brackets so you know exactly what to expect before you ever book.",
    ],
    whatToExpect: [
      "A dedicated professional who works with you over time",
      "Sessions available in-person and online",
      "Clear, upfront information about credentials and any fees",
      "A sliding scale so cost is never the reason someone goes without support",
    ],
    // #5 — editable placeholders for credentials / charges / sliding scale.
    placeholder: {
      heading: "Therapists, credentials & charges",
      intro:
        "We're finalising these details and will publish them here in full. If you'd like this information as soon as it's available, register your interest through the Connect form and we'll be in touch.",
      fields: [
        {
          label: "Therapist name & title",
          placeholder: "[ e.g. Dr. Jane Doe — Clinical Psychologist ]",
        },
        {
          label: "Qualifications & registration",
          placeholder: "[ e.g. M.Phil Clinical Psychology · RCI-registered (Reg. no. …) ]",
        },
        {
          label: "Areas of focus",
          placeholder: "[ e.g. anxiety, grief, trauma, relationships ]",
        },
        {
          label: "Standard session charge",
          placeholder: "[ e.g. ₹— per 50-minute session ]",
        },
        {
          label: "Sliding-scale brackets",
          placeholder: "[ e.g. ₹—/₹—/₹— based on income · free places available ]",
        },
      ],
      note: "These are placeholders — replace them with your real details before publishing.",
    },
    actions: COMMON_ACTIONS,
  },
  {
    slug: "support-groups",
    icon: Users,
    title: "Support Groups",
    summary: "Weekly peer circles — you're not alone.",
    blurb: "Weekly peer circles for anxiety, grief, burnout and more — you're not alone.",
    overview: [
      "Our support groups are small, facilitated circles where people navigating similar experiences come together. Hearing 'me too' from someone who truly understands can be quietly powerful.",
      "Groups are led by trained facilitators who hold the space so it stays safe, respectful, and confidential. You're welcome to simply listen until you're ready to share.",
    ],
    whatToExpect: [
      "A trained facilitator guiding a safe, respectful space",
      "A small circle of people with shared experiences",
      "Freedom to listen quietly or share — always your choice",
      "Confidentiality agreed by everyone in the group",
    ],
    actions: COMMON_ACTIONS,
  },
  {
    slug: "listening-sessions",
    icon: Ear,
    title: "Listening Sessions",
    summary: "Sometimes you just need to be heard.",
    blurb: "Sometimes you just need to be heard. Drop-in, no questions asked.",
    overview: [
      "A listening session is exactly what it sounds like: unhurried time with a trained listener whose only job is to give you their full, warm attention. There's no agenda, no diagnosis, no notes, and no 'fixing' — just space for you to say whatever is on your mind and feel genuinely heard.",
      "For many people this is a completely new idea, so it's worth explaining plainly. You might use a session to think out loud after a hard week, to process something you're not ready to call a 'problem', or simply because carrying it alone has become heavy. You don't need a crisis or a reason. You can share as much or as little as you like, and you can stay anonymous.",
      "Being heard — without being judged, advised, or interrupted — is valuable on its own. It can lower the pressure in your chest, help you hear your own thoughts more clearly, and remind you that you matter. Think of it as a first, low-pressure step: some people find a listening session is all they needed, and others use it to work out whether counseling or a support group might help next.",
    ],
    whatToExpect: [
      "A listener who is fully present — no advice unless you ask",
      "No agenda, no diagnosis, no notes, no cost",
      "You choose what to talk about and for how long",
      "Complete confidentiality — you can remain anonymous",
    ],
    // #6 — explain clearly how this differs from counseling / therapy.
    howItDiffers: {
      heading: "How is this different from counseling or therapy?",
      points: [
        {
          term: "Listening session",
          text: "Being heard, in the moment. A trained (often peer) listener gives you their full attention with no goals, no assessment, and no treatment plan. Great when you mainly need to feel less alone and say things out loud.",
        },
        {
          term: "Counseling / therapy",
          text: "A structured, ongoing process with a qualified professional who helps you understand patterns and work toward specific goals over multiple sessions. It can involve assessment and clinical techniques.",
        },
        {
          term: "In short",
          text: "A listening session is a warm space to be heard right now; counseling is deeper, goal-oriented work over time. Many people start with a listening session and move to counseling only if and when they want to.",
        },
      ],
    },
    actions: COMMON_ACTIONS,
  },
  {
    slug: "youth-wellbeing",
    icon: Heart,
    title: "Youth Wellbeing",
    summary: "Safe spaces for young people.",
    blurb: "Safe spaces and workshops for young people navigating mental health.",
    overview: [
      "Growing up is hard, and the pressures young people carry — school, identity, relationships, the future — are real. Our youth wellbeing programs create safe, age-appropriate spaces to talk about all of it.",
      "We run interactive workshops and sessions designed for ages 13–25, in schools, colleges, and community centers, focused on stress, self-care, and breaking the stigma around asking for help.",
    ],
    whatToExpect: [
      "Programs designed specifically for ages 13–25",
      "Topics spanning stress, identity, relationships, and self-care",
      "Delivered in schools, colleges, and community centers",
      "A judgment-free space to talk and be heard",
    ],
    actions: [
      { label: "Bring us to your school or community", to: "/get-involved", primary: true },
      { label: "Share your story", to: "/connect" },
      { label: "Email us", href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
  {
    slug: "crisis-care",
    icon: Shield,
    title: "Crisis Care",
    summary: "Immediate, confidential support when it's overwhelming.",
    blurb: "Immediate, confidential support when things feel overwhelming.",
    overview: [
      "When things feel like too much, you deserve support that meets the moment. Our crisis care focuses on helping you feel steadier, thinking through immediate safety, and connecting you with the right next step.",
      "Please note: we are not an emergency service. If you or someone you know is in immediate danger, contact your local emergency services first. Then reach out to us and we'll stay alongside you.",
    ],
    whatToExpect: [
      "A calm, steady response focused on the here and now",
      "Help thinking through immediate safety",
      "Warm, confidential pointers to further support",
      "No judgment, whatever you're facing",
    ],
    actions: [
      { label: "Share your story", to: "/connect", primary: true },
      { label: "Email us", href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
