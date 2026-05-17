import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Users, Ear, Heart, Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — ListenInn Foundation" },
      {
        name: "description",
        content:
          "ListenInn Foundation offers a 24/7 helpline, 1:1 counseling, support groups, listening sessions, youth wellbeing, and crisis care.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: Phone,
    title: "24/7 Helpline",
    desc: "Speak with a trained listener anytime, day or night. Free and confidential. No appointment needed — just call.",
    detail:
      "Our helpline is staffed around the clock by trained volunteers and supervised professionals. Whether it's 3 AM anxiety or a midday crisis, someone is always here.",
  },
  {
    icon: MessageCircle,
    title: "1:1 Counseling",
    desc: "Connect with licensed therapists for one-on-one support tailored to you.",
    detail:
      "Sessions are available in-person and online. We work on a sliding scale to ensure cost is never a barrier to getting help.",
  },
  {
    icon: Users,
    title: "Support Groups",
    desc: "Weekly peer circles for anxiety, grief, burnout and more — you're not alone.",
    detail:
      "Facilitated by trained group leaders, our circles create safe spaces for shared experience. Find strength in knowing others walk a similar path.",
  },
  {
    icon: Ear,
    title: "Listening Sessions",
    desc: "Sometimes you just need to be heard. Drop-in sessions, no questions asked.",
    detail:
      "No agenda, no diagnosis, no notes. Just a compassionate human giving you their full attention for as long as you need.",
  },
  {
    icon: Heart,
    title: "Youth Wellbeing",
    desc: "Safe spaces and workshops for young people navigating mental health.",
    detail:
      "Programs designed for ages 13–25 covering stress, identity, relationships, and self-care. Run in schools, colleges, and community centers.",
  },
  {
    icon: Shield,
    title: "Crisis Care",
    desc: "Immediate, confidential support when things feel overwhelming.",
    detail:
      "If you or someone you know is in acute distress, our crisis team provides immediate stabilization, safety planning, and warm referrals.",
  },
];

function ServicesPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative space-y-4">
          <p className="font-script text-primary text-3xl">Our services</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Support, in the form <span className="text-gradient-brand">you need it</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Whatever you're carrying, there's a way for us to walk with you.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-6 shadow-soft">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed border-t border-border pt-4">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 text-center space-y-6 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Not sure where to start?
          </h2>
          <p className="text-muted-foreground text-lg">
            That's okay. Reach out and we'll guide you to the right support.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12 px-6"
          >
            <Link to="/contact">
              Talk to us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
