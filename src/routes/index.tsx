import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/listeninn-logo.png";
import { PageShell, WaveTop } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Ear,
  Users,
  Phone,
  MessageCircle,
  HandHeart,
  Shield,
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  DollarSign,
  ExternalLink,
  Mail,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ListenInn Foundation — Where every voice is heard with heart ❤️" },
      {
        name: "description",
        content:
          "ListenInn Foundation: confidential mental health support, counseling, support groups and a 24/7 helpline. Where every voice is heard with heart.",
      },
    ],
  }),
  component: Home,
});

/* ─────────────────────── Hero ─────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-20 pb-28">
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

          {/* ✨ Prominent Tagline */}
          <div className="relative">
            <p className="text-2xl md:text-3xl font-bold text-gradient-brand leading-snug">
              "Where every voice is heard with heart.{" "}
              <span className="text-red-500 animate-pulse inline-block">❤️</span>"
            </p>
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-brand" />
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            A safe place to talk. A place to feel understood.{" "}
            <span className="text-foreground font-medium">You don't have to carry it alone.</span>
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              asChild
              className="bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12 px-6 text-base"
            >
              <Link to="/connect">
                Connect With Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-6 text-base border-primary/30 hover:bg-primary/5"
            >
              <Link to="/get-involved">
                <HandHeart className="mr-2 h-4 w-4" /> Get Involved
              </Link>
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

/* ─────────────────────── Mission ─────────────────────── */
function MissionSection() {
  return (
    <section id="mission" className="bg-card py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-medium text-primary">
              <Target className="h-3.5 w-3.5" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Compassionate care,{" "}
              <span className="text-gradient-brand">accessible to all</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To ensure no one has to navigate their mental health journey alone. We provide{" "}
              <strong className="text-foreground">free, compassionate, and confidential</strong>{" "}
              support to anyone who needs it — regardless of background, income, or circumstance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We train listeners, empower communities, and break the stigma around mental health —
              one conversation at a time. Because healing starts with being heard.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "12k+", l: "Conversations held", icon: MessageCircle },
              { n: "120+", l: "Trained listeners", icon: Users },
              { n: "24/7", l: "Helpline availability", icon: Phone },
              { n: "100%", l: "Free & confidential", icon: Shield },
            ].map((s) => (
              <div
                key={s.l}
                className="group rounded-2xl border border-border bg-background p-5 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <s.icon className="h-6 w-6 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-gradient-brand">{s.n}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Vision ─────────────────────── */
function VisionSection() {
  return (
    <section id="vision" className="bg-background py-24">
      <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-card px-4 py-1.5 text-xs font-medium text-accent mx-auto">
          <Eye className="h-3.5 w-3.5" />
          Our Vision
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          A world where seeking help is{" "}
          <span className="text-gradient-brand">an act of courage</span>
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          We envision a future where mental health care is universally accessible, stigma-free, and
          rooted in empathy. A world where no one feels ashamed to say,{" "}
          <em className="text-foreground font-medium">"I need someone to talk to."</em>
        </p>
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          {[
            {
              icon: Ear,
              title: "Stigma-free",
              desc: "Normalizing conversations about mental health in every home, school, and workplace.",
            },
            {
              icon: Heart,
              title: "Empathy-first",
              desc: "Building a culture where compassion drives every interaction and policy decision.",
            },
            {
              icon: Users,
              title: "Universal access",
              desc: "Ensuring quality mental health support reaches every community, especially underserved ones.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-5 shadow-soft group-hover:scale-110 transition-transform">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Our Work ─────────────────────── */
const SERVICES_PREVIEW = [
  {
    icon: Phone,
    title: "24/7 Helpline",
    desc: "Speak with a trained listener anytime, day or night.",
  },
  {
    icon: MessageCircle,
    title: "1:1 Counseling",
    desc: "Connect with licensed therapists for tailored support.",
  },
  {
    icon: Users,
    title: "Support Groups",
    desc: "Weekly peer circles — you're not alone.",
  },
  {
    icon: Ear,
    title: "Listening Sessions",
    desc: "Sometimes you just need to be heard.",
  },
  {
    icon: Heart,
    title: "Youth Wellbeing",
    desc: "Safe spaces for young people navigating mental health.",
  },
  {
    icon: Shield,
    title: "Crisis Care",
    desc: "Immediate, confidential support when it's overwhelming.",
  },
];

function OurWorkSection() {
  return (
    <section id="our-work" className="bg-gradient-hero py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 px-4 py-1.5 text-xs font-medium text-primary mx-auto backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Our Work
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support, in the form <span className="text-gradient-brand">you need it</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From crisis intervention to everyday listening — we show up for every moment.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_PREVIEW.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-5 shadow-soft group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-primary/30 hover:bg-primary/5"
          >
            <Link to="/services">
              View all services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Volunteer ─────────────────────── */
function VolunteerSection() {
  return (
    <section id="volunteer" className="bg-card py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="rounded-3xl bg-gradient-brand p-[2px]">
              <div className="rounded-[calc(1.5rem-2px)] bg-card p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { n: "40hrs", l: "Training program" },
                    { n: "200+", l: "Active volunteers" },
                    { n: "5k+", l: "Lives touched" },
                    { n: "∞", l: "Impact potential" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-border bg-background p-4 text-center animate-count-up"
                    >
                      <div className="text-xl font-bold text-gradient-brand">{s.n}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  asChild
                  className="w-full bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12"
                >
                  <Link to="/contact">
                    <HandHeart className="mr-2 h-5 w-5" /> Apply to Volunteer
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-background px-4 py-1.5 text-xs font-medium text-accent">
              <HandHeart className="h-3.5 w-3.5" />
              Volunteer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Lend your ears,{" "}
              <span className="text-gradient-brand">change a life</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Train as a listener and give a few hours a week to someone who needs it. Our{" "}
              <strong className="text-foreground">40-hour training program</strong> equips you with
              active listening skills, empathy techniques, and crisis protocols.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Flexible scheduling — volunteer from anywhere",
                "Comprehensive training & ongoing mentorship",
                "Make a real, measurable difference",
                "Join a compassionate community of listeners",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Donate ─────────────────────── */
function DonateSection() {
  return (
    <section id="donate" className="bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-brand p-[2px] animate-pulse-glow">
          <div className="rounded-[calc(1.5rem-2px)] bg-card p-8 md:p-10 text-center space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft mx-auto">
              <DollarSign className="h-7 w-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Fund a conversation that{" "}
              <span className="text-gradient-brand">changes a life</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Every ₹500 funds one free counseling session. Every ₹2,000 keeps our helpline
              running for a full day. Your generosity is someone's lifeline.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
              {[
                { amount: "₹500", impact: "1 free session" },
                { amount: "₹2,000", impact: "1 day helpline" },
                { amount: "₹10,000", impact: "10 sessions" },
              ].map((d) => (
                <div
                  key={d.amount}
                  className="rounded-xl border border-border bg-background p-3 animate-count-up hover:shadow-card transition-shadow"
                >
                  <div className="text-xl font-bold text-gradient-brand">{d.amount}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{d.impact}</div>
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
              <Shield className="h-3.5 w-3.5" /> 256-bit encrypted · Powered by Stripe ·
              Tax-deductible
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Contact CTA ─────────────────────── */
function ContactSection() {
  return (
    <section id="contact" className="bg-gradient-brand py-20 text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="font-script text-3xl opacity-90">Reach out</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              We're here, whenever you're ready
            </h2>
            <p className="text-lg opacity-90">
              One conversation can change everything. Start one with us.
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Helpline", value: "1-800-LISTEN-IN", sub: "Available 24 hours" },
                { icon: Mail, label: "Email", value: "hello@listeninn.org", sub: "Replies within 24 hours" },
                { icon: MessageCircle, label: "Chat", value: "Start a chat", sub: "Mon–Sun, 8am–11pm" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 p-4"
                >
                  <div className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                    <c.icon className="h-5 w-5 opacity-90" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-80">{c.label}</div>
                    <div className="font-semibold">{c.value}</div>
                    <div className="text-sm opacity-80">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-8 text-center space-y-5">
              <Send className="h-10 w-10 mx-auto opacity-80" />
              <h3 className="text-2xl font-bold">Want to reach us?</h3>
              <p className="opacity-90">
                Visit our contact page to send us a message — we'll reply within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-primary hover:bg-white/90 h-12 px-6 shadow-soft"
                >
                  <Link to="/connect">
                    <Heart className="mr-2 h-4 w-4" /> Share Your Story
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent border-white/30 text-primary-foreground hover:bg-white/10 h-12 px-6"
                >
                  <Link to="/helpline">
                    <Phone className="mr-2 h-4 w-4" /> Call Helpline
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────── Home ─────────────────────── */
function Home() {
  return (
    <PageShell>
      <Hero />
      <MissionSection />
      <VisionSection />
      <OurWorkSection />
      <VolunteerSection />
      <DonateSection />
      <ContactSection />

    </PageShell>
  );
}
