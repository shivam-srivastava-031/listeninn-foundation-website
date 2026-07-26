import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { openChat } from "@/lib/chatBus";
import {
  Heart,
  HandHeart,
  Users,
  Shield,
  ArrowRight,
  ExternalLink,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — ListenInn Foundation" },
      {
        name: "description",
        content:
          "Support ListenInn Foundation through donations, volunteering, or partnerships. Every contribution funds free mental health services.",
      },
    ],
  }),
  component: GetInvolvedPage,
});

function GetInvolvedPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative space-y-4">
          <p className="font-script text-primary text-3xl">Get involved</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Together we make <span className="text-gradient-brand">listening louder</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your time, your generosity, your voice — they all make a difference.
          </p>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="bg-card py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-brand p-[2px] animate-pulse-glow">
            <div className="rounded-[calc(1.5rem-2px)] bg-card p-8 md:p-10 text-center space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft mx-auto">
                <DollarSign className="h-7 w-7" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Fund a conversation that <span className="text-gradient-brand">changes a life</span>
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
                    className="rounded-xl border border-border bg-background p-3 animate-count-up"
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

      {/* Volunteer & Partner */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
            Other ways to help
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: HandHeart,
                title: "Volunteer",
                desc: "Train as a listener and give a few hours a week to someone who needs it. Our 40-hour training program equips you with active listening skills, empathy techniques, and crisis protocols.",
                cta: "Apply to volunteer",
                onClick: () => openChat("volunteer"),
              },
              {
                icon: Users,
                title: "Partner with us",
                desc: "Bring ListenInn to your school, workplace, or community organisation. We offer customized mental health workshops, listening booths, and awareness campaigns.",
                cta: "Become a partner",
                to: "/connect" as const,
              },
            ].map((o) => (
              <div
                key={o.title}
                className="rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-soft transition-shadow"
              >
                <o.icon className="h-10 w-10 text-accent mb-5" />
                <h3 className="text-2xl font-semibold mb-3">{o.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{o.desc}</p>
                {o.onClick ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/30 hover:bg-primary/5"
                    onClick={o.onClick}
                  >
                    {o.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/30 hover:bg-primary/5"
                    asChild
                  >
                    <Link to={o.to}>
                      {o.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-gradient-brand py-16 text-primary-foreground text-center">
        <div className="container mx-auto px-6 max-w-3xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Your support in action</h2>
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { n: "₹12L+", l: "Raised this year" },
              { n: "2,400+", l: "Free sessions funded" },
              { n: "50+", l: "Partner organizations" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-bold">{s.n}</div>
                <div className="text-sm opacity-80 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
