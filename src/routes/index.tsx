import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/listeninn-logo.png";
import welcomeArt from "@/assets/listeninn-welcome.jpeg";
import { COMMUNITY_CARE_IMG } from "@/lib/artworkUrls";
import { PageShell, WaveTop } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/services";
import { LeafyVine } from "@/components/artwork";
import { openChat } from "@/lib/chatBus";
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
  Instagram,
} from "lucide-react";

/**
 * Large section title used for eye-mapping (#3): the section's category word
 * (e.g. "Our Work", "Our Vision", "Volunteer") is the biggest text in the
 * block, so a visitor grasps each section's context in the first seconds.
 */
function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] ${className}`}
    >
      {children}
    </h2>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ListenInn Foundation — A safe space to talk ❤️" },
      {
        content:
          "ListenInn Foundation: confidential mental health support, counseling, support groups and a 24/7 helpline. A safe space to talk.",
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
              "A safe space to talk.{" "}
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
          <div className="relative rounded-3xl bg-card/70 backdrop-blur border border-border/60 p-4 shadow-soft">
            <img
              src={welcomeArt}
              alt="Welcome to ListenInn Foundation — a safe place to talk. We listen, we care, we respect."
              width={560}
              height={700}
              className="w-64 md:w-80 lg:w-96 h-auto rounded-2xl object-contain"
            />
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              width={72}
              height={72}
              className="absolute -bottom-6 -left-6 h-16 w-16 md:h-20 md:w-20 object-contain rounded-2xl bg-card border border-border/60 p-2 shadow-soft"
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
              What drives us
            </div>
            <SectionTitle>Our Mission</SectionTitle>
            <p className="text-xl md:text-2xl font-semibold text-gradient-brand leading-snug">
              Compassionate care, accessible to all
            </p>
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
          Where we're headed
        </div>
        <SectionTitle>Our Vision</SectionTitle>
        <p className="text-xl md:text-2xl font-semibold text-gradient-brand">
          A world where seeking help is an act of courage
        </p>
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
function OurWorkSection() {
  return (
    <section id="our-work" className="bg-gradient-hero py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 px-4 py-1.5 text-xs font-medium text-primary mx-auto backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            What we do
          </div>
          <SectionTitle>Our Work</SectionTitle>
          <p className="text-xl md:text-2xl font-semibold text-gradient-brand">
            Support, in the form you need it
          </p>
          <p className="text-muted-foreground text-lg">
            From crisis intervention to everyday listening — we show up for every moment. Tap any
            service to see the details and how to reach us.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to="/services/$serviceId"
              params={{ serviceId: s.slug }}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-5 shadow-soft group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">{s.summary}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                Learn more <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
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
                  onClick={() => openChat("volunteer")}
                  className="w-full bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12"
                >
                  <HandHeart className="mr-2 h-5 w-5" /> Apply to Volunteer
                </Button>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-background px-4 py-1.5 text-xs font-medium text-accent">
              <HandHeart className="h-3.5 w-3.5" />
              Lend a hand
            </div>
            <SectionTitle>Volunteer</SectionTitle>
            <p className="text-xl md:text-2xl font-semibold text-gradient-brand">
              Lend your ears, change a life
            </p>
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
                { icon: Mail, label: "Email", value: "listeninnfoundation@gmail.com", sub: "Replies within 24 hours" },
                { icon: MessageCircle, label: "Share your story", value: "Connect form", sub: "The best way to reach us right now" },
                { icon: Instagram, label: "Instagram", value: "@listeninnfoundation", sub: "Message us anytime" },
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
                  <a href="mailto:listeninnfoundation@gmail.com">
                    <Mail className="mr-2 h-4 w-4" /> Email Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────── Community Care (artwork band) ─────────────────────── */
function CommunityCareBand() {
  return (
    <section className="bg-card py-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img
              src={COMMUNITY_CARE_IMG}
              alt="Hand-drawn illustration of three people holding hands beneath a banner reading 'Community care for all who need it'"
              loading="lazy"
              className="w-full max-w-md h-auto rounded-2xl"
            />
          </div>
          <div className="space-y-5 text-center md:text-left">
            <p className="font-script text-3xl text-primary">Community care</p>
            <SectionTitle className="text-4xl md:text-5xl lg:text-6xl">
              For all who need it
            </SectionTitle>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Care shouldn't depend on where you come from or what you can afford. We're building a
              community where being heard is something everyone can reach — held up by listeners,
              volunteers, and people who simply believe no one should struggle alone.
            </p>
            <div className="text-accent flex justify-center md:justify-start">
              <LeafyVine className="h-10 w-64 max-w-full" />
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
      <CommunityCareBand />
      <OurWorkSection />
      <VolunteerSection />
      <DonateSection />
      <ContactSection />
    </PageShell>
  );
}
