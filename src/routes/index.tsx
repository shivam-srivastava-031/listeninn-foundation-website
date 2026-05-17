import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import logo from "@/assets/listeninn-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  Ear,
  Users,
  Phone,
  Mail,
  MessageCircle,
  HandHeart,
  Shield,
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Clock,
  Globe,
  Send,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ListenInn Foundation — A safe place to talk" },
      {
        name: "description",
        content:
          "ListenInn Foundation: confidential mental health support, counseling, support groups and a 24/7 helpline. We listen. We care. We respect.",
      },
    ],
  }),
  component: Home,
});

function WaveTop() {
  return (
    <svg
      className="wave-divider -mb-px"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WaveBottom() {
  return (
    <svg
      className="wave-divider rotate-180 -mt-px"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#values", label: "Values" },
  { href: "#involved", label: "Get Involved" },
  { href: "#faq", label: "FAQ" },
  { href: "#helpline", label: "Helpline" },
  { href: "#contact", label: "Contact" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={logo}
            alt="ListenInn Foundation logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-lg text-accent">listeninn</span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground">
              FOUNDATION
            </span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <Button asChild size="sm" className="bg-gradient-brand hover:opacity-90 text-primary-foreground shadow-soft">
          <a href="#contact">
            <Phone className="mr-2 h-4 w-4" /> Helpline
          </a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-hero pt-20 pb-28"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Mental health support, with heart
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            <span className="font-script text-primary text-6xl md:text-7xl block mb-2">
              Welcome to
            </span>
            <span className="text-foreground">Listen</span>
            <span className="text-accent">Inn</span>
            <span className="text-foreground"> Foundation</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            A safe place to talk. A place to feel understood.{" "}
            <span className="text-foreground font-medium">
              You don't have to carry it alone.
            </span>
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              asChild
              className="bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12 px-6 text-base"
            >
              <a href="#services">
                Start Listening to Yourself
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-6 text-base border-primary/30 hover:bg-primary/5"
            >
              <a href="#involved">
                <HandHeart className="mr-2 h-4 w-4" /> Get Involved
              </a>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" /> Confidential
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" /> Free to talk
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" /> 24/7
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
          <div className="relative rounded-3xl bg-card/70 backdrop-blur border border-border/60 p-10 shadow-soft">
            <img
              src={logo}
              alt="ListenInn Foundation — ear with heart and sound waves"
              width={420}
              height={420}
              className="h-72 w-72 md:h-96 md:w-96 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="text-card mt-12">
        <WaveTop />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-card py-24">
      <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
        <p className="font-script text-primary text-3xl">About us</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Mental health support that begins with truly{" "}
          <span className="text-gradient-brand">listening</span>.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          ListenInn Foundation exists to make compassionate mental health care
          accessible to everyone. We believe that healing often starts with one
          honest conversation — without judgment, without pressure, and without
          cost. Our trained listeners, counselors and community partners are
          here for the quiet moments and the loud ones.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 pt-8">
          {[
            { n: "12k+", l: "Conversations held" },
            { n: "120+", l: "Trained listeners" },
            { n: "24/7", l: "Helpline availability" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-border bg-background p-6 shadow-card"
            >
              <div className="text-3xl font-bold text-gradient-brand">
                {s.n}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: Phone,
    title: "24/7 Helpline",
    desc: "Speak with a trained listener anytime, day or night. Free and confidential.",
  },
  {
    icon: MessageCircle,
    title: "1:1 Counseling",
    desc: "Connect with licensed therapists for one-on-one support tailored to you.",
  },
  {
    icon: Users,
    title: "Support Groups",
    desc: "Weekly peer circles for anxiety, grief, burnout and more — you're not alone.",
  },
  {
    icon: Ear,
    title: "Listening Sessions",
    desc: "Sometimes you just need to be heard. Drop-in sessions, no questions asked.",
  },
  {
    icon: Heart,
    title: "Youth Wellbeing",
    desc: "Safe spaces and workshops for young people navigating mental health.",
  },
  {
    icon: Shield,
    title: "Crisis Care",
    desc: "Immediate, confidential support when things feel overwhelming.",
  },
];

function Services() {
  return (
    <section id="services" className="relative bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="font-script text-primary text-3xl">Our services</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support, in the form{" "}
            <span className="text-gradient-brand">you need it</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whatever you're carrying, there's a way for us to walk with you.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-5 shadow-soft">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    {
      icon: Ear,
      title: "We listen",
      desc: "Without interrupting, fixing, or judging — fully present to your story.",
    },
    {
      icon: Heart,
      title: "We care",
      desc: "Your wellbeing comes first. Every conversation is held with warmth.",
    },
    {
      icon: Shield,
      title: "We respect",
      desc: "Your pace, your privacy, your identity — always honoured.",
    },
  ];
  return (
    <section id="values" className="relative bg-gradient-hero py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <p className="font-script text-primary text-3xl">Our values</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            We listen. We care. We respect.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((v) => (
            <div
              key={v.title}
              className="text-center rounded-3xl bg-card/80 backdrop-blur border border-border p-8 shadow-card"
            >
              <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-soft">
                <v.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{v.title}</h3>
              <p className="text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  return (
    <section id="involved" className="bg-card py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="font-script text-primary text-3xl">Get involved</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Together we make{" "}
            <span className="text-gradient-brand">listening louder</span>
          </h2>
        </div>

        {/* Donation CTA — prominent card */}
        <div className="max-w-3xl mx-auto mb-12 rounded-3xl bg-gradient-brand p-[2px] animate-pulse-glow">
          <div className="rounded-[calc(1.5rem-2px)] bg-card p-8 md:p-10 text-center space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft mx-auto">
              <DollarSign className="h-7 w-7" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              Fund a conversation that{" "}
              <span className="text-gradient-brand">changes a life</span>
            </h3>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Every ₹500 funds one free counseling session. Every ₹2,000 keeps
              our helpline running for a full day. Your generosity is someone's
              lifeline.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
              {[
                { amount: "₹500", impact: "1 free session" },
                { amount: "₹2,000", impact: "1 day helpline" },
                { amount: "₹10,000", impact: "10 sessions" },
              ].map((d) => (
                <div
                  key={d.amount}
                  className="rounded-xl border border-border bg-background p-3 animate-count-up"
                >
                  <div className="text-xl font-bold text-gradient-brand">
                    {d.amount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {d.impact}
                  </div>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              asChild
              className="bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-14 px-8 text-lg mt-2"
            >
              <a
                href="https://donate.stripe.com/test_listeninn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart className="mr-2 h-5 w-5" /> Donate Securely
                <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> 256-bit encrypted · Powered by
              Stripe · Tax-deductible
            </p>
          </div>
        </div>

        {/* Volunteer & Partner cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: HandHeart,
              title: "Volunteer",
              desc: "Train as a listener and give a few hours a week to someone who needs it.",
              cta: "Apply to volunteer",
            },
            {
              icon: Users,
              title: "Partner with us",
              desc: "Bring ListenInn to your school, workplace or community organisation.",
              cta: "Become a partner",
            },
          ].map((o) => (
            <div
              key={o.title}
              className="rounded-2xl border border-border bg-background p-8 shadow-card hover:shadow-soft transition-shadow"
            >
              <o.icon className="h-9 w-9 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">{o.title}</h3>
              <p className="text-muted-foreground mb-6">{o.desc}</p>
              <Button
                variant="outline"
                className="border-primary/30 hover:bg-primary/5"
                asChild
              >
                <a href="#contact">
                  {o.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Is ListenInn really free and confidential?",
    a: "Yes. Our helpline and listening sessions are completely free, anonymous, and confidential. Counseling sessions are offered on a sliding scale, with fully free options for those who need them. We never share your information without your explicit consent.",
  },
  {
    q: "Who answers the helpline?",
    a: "Trained volunteer listeners and on-call mental health professionals. Every person on our team is thoroughly vetted, background-checked, and supervised by our clinical team. You're always in safe hands.",
  },
  {
    q: "I'm not in crisis — can I still reach out?",
    a: "Absolutely. You don't need a reason to call. If something feels heavy, confusing, or you just need to talk — that's reason enough. Our listeners are here for everyday struggles too.",
  },
  {
    q: "Do you offer help in multiple languages?",
    a: "We currently support English, Hindi, and Spanish, and are actively expanding language coverage through our volunteer network. Let us know your preferred language and we'll do our best to match you.",
  },
  {
    q: "What if I'm worried about someone else?",
    a: "Call our helpline — we'll guide you through how to support them and connect them to care safely. You can also share our helpline number with them directly. Caring enough to ask is already a powerful step.",
  },
  {
    q: "Where does my donation go?",
    a: "100% of donations fund direct services: free counseling sessions, helpline operations, listener training, and youth wellbeing workshops. We publish annual impact reports for full transparency.",
  },
  {
    q: "How quickly can I get help in a crisis?",
    a: "Our helpline is available 24/7 with no wait time for crisis calls. If you're in immediate danger, please also call your local emergency number. We'll stay with you until you're connected to the right support.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="bg-background py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12 space-y-3">
          <p className="font-script text-primary text-3xl">Questions</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Frequently asked
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-6 shadow-card"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function HelplineResources() {
  const [copied, setCopied] = useState(false);
  const hotline = "1-800-LISTEN-IN";

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(hotline);
      setCopied(true);
      toast.success("Helpline number copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy — please select the number manually.");
    }
  };

  const resources = [
    {
      icon: Clock,
      title: "24/7 Helpline",
      desc: "Speak with a trained listener anytime. No wait, no judgment.",
      link: "tel:18005478364",
      linkText: "Call now",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      desc: "Text-based support from 8 AM – 11 PM, every day.",
      link: "#contact",
      linkText: "Start chatting",
    },
    {
      icon: Globe,
      title: "Online Resources",
      desc: "Self-help guides, breathing exercises, and coping toolkits.",
      link: "#faq",
      linkText: "Browse resources",
    },
    {
      icon: BookOpen,
      title: "Crisis Guides",
      desc: "Step-by-step guides for supporting yourself or someone you love.",
      link: "#faq",
      linkText: "Read guides",
    },
  ];

  return (
    <section
      id="helpline"
      className="relative bg-gradient-hero py-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="font-script text-primary text-3xl">Help & resources</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support is{" "}
            <span className="text-gradient-brand">one call away</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether it's 3 PM or 3 AM — we're here. Always.
          </p>
        </div>

        {/* Copyable hotline banner */}
        <div className="max-w-xl mx-auto mb-12 rounded-2xl bg-card border border-border p-6 shadow-soft text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-accent" />
            <span>24/7 Helpline — free & confidential</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl md:text-4xl font-bold tracking-wide text-gradient-brand">
              {hotline}
            </span>
            <button
              onClick={copyNumber}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              aria-label="Copy helpline number"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-accent animate-copy-pop" />{" "}
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            If you are in immediate danger, please call your local emergency
            number first.
          </p>
        </div>

        {/* Resource cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {resources.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl bg-card/80 backdrop-blur border border-border p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-4 shadow-soft">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
              <a
                href={r.link}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                {r.linkText}{" "}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (fd: FormData) => {
    const errs: Record<string, string> = {};
    const name = (fd.get("from_name") as string)?.trim();
    const email = (fd.get("reply_to") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();

    if (!name || name.length < 2) errs.from_name = "Please enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.reply_to = "Please enter a valid email.";
    if (!message || message.length < 10)
      errs.message = "Message must be at least 10 characters.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    try {
      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY",
      );
      toast.success("Message sent! We'll get back to you soon. 💜");
      formRef.current.reset();
      setErrors({});
    } catch {
      toast.error("Something went wrong. Please try again or call our helpline.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-8 space-y-5"
      noValidate
    >
      <h3 className="text-xl font-semibold mb-1">Send us a message</h3>
      <p className="text-sm opacity-80 mb-4">
        We'll reply within 24 hours. For urgent help, call our helpline.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="contact-name" className="text-primary-foreground/90">
          Your name
        </Label>
        <Input
          id="contact-name"
          name="from_name"
          placeholder="Jane Doe"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus-visible:ring-white/40"
        />
        {errors.from_name && (
          <p className="text-xs text-red-200">{errors.from_name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email" className="text-primary-foreground/90">
          Email address
        </Label>
        <Input
          id="contact-email"
          name="reply_to"
          type="email"
          placeholder="you@example.com"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus-visible:ring-white/40"
        />
        {errors.reply_to && (
          <p className="text-xs text-red-200">{errors.reply_to}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message" className="text-primary-foreground/90">
          Your message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="How can we help?"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus-visible:ring-white/40 resize-none"
        />
        {errors.message && (
          <p className="text-xs text-red-200">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={sending}
        size="lg"
        className="w-full bg-white text-primary hover:bg-white/90 font-semibold h-12 shadow-soft"
      >
        {sending ? (
          "Sending…"
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-gradient-brand py-24 text-primary-foreground overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="font-script text-3xl opacity-90">Reach out</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            We're here, whenever you're ready
          </h2>
          <p className="opacity-90 text-lg">
            One conversation can change everything. Start one with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Info cards */}
          <div className="grid sm:grid-cols-1 gap-4">
            {[
              {
                icon: Phone,
                title: "Helpline",
                value: "1-800-LISTEN-IN",
                sub: "Available 24 hours",
              },
              {
                icon: Mail,
                title: "Email",
                value: "hello@listeninn.org",
                sub: "Replies within 24 hours",
              },
              {
                icon: MessageCircle,
                title: "Chat",
                value: "Start a chat",
                sub: "Mon–Sun, 8am–11pm",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-5 flex items-center gap-4"
              >
                <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <c.icon className="h-6 w-6 opacity-90" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-80">
                    {c.title}
                  </div>
                  <div className="text-lg font-semibold">{c.value}</div>
                  <div className="text-sm opacity-80">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
      <div className="text-background">
        <WaveBottom />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <div className="font-bold text-accent">listeninn</div>
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground">
              FOUNDATION
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ListenInn Foundation · We listen. We care. We respect.
        </p>
        <div className="flex md:justify-end gap-4 text-muted-foreground">
          <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Values />
        <GetInvolved />
        <FAQ />
        <HelplineResources />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
