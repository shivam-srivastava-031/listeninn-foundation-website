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
              <Link to="/services">
                Start Listening to Yourself
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

function Home() {
  return (
    <PageShell>
      <Hero />

      {/* About preview */}
      <section className="bg-card py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
          <p className="font-script text-primary text-3xl">About us</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Mental health support that begins with truly{" "}
            <span className="text-gradient-brand">listening</span>.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ListenInn Foundation exists to make compassionate mental health care accessible to
            everyone. Healing starts with one honest conversation.
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
                <div className="text-3xl font-bold text-gradient-brand">{s.n}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-primary/30 hover:bg-primary/5 mt-4"
          >
            <Link to="/about">
              Learn more about us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="font-script text-primary text-3xl">Our services</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Support, in the form <span className="text-gradient-brand">you need it</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_PREVIEW.map((s) => (
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

      {/* Values preview */}
      <section className="bg-gradient-hero py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <p className="font-script text-primary text-3xl">Our values</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              We listen. We care. We respect.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
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
            ].map((v) => (
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
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-primary/30 hover:bg-primary/5"
            >
              <Link to="/values">
                Explore our values <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-gradient-brand py-20 text-primary-foreground text-center">
        <div className="container mx-auto px-6 space-y-6 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to take the first step?</h2>
          <p className="text-lg opacity-90">
            Whether you need someone to talk to or want to help others — we're here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-white/90 h-12 px-6 shadow-soft"
            >
              <Link to="/helpline">
                <Phone className="mr-2 h-4 w-4" /> Call the Helpline
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-white/30 text-primary-foreground hover:bg-white/10 h-12 px-6"
            >
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
