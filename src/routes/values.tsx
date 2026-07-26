import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Ear, Heart, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import balanceArt from "@/assets/artwork/balance-in-bloom.jpeg";

export const Route = createFileRoute("/values")({
  head: () => ({
    meta: [
      { title: "Our Values — ListenInn Foundation" },
      {
        name: "description",
        content:
          "At ListenInn Foundation we listen without judgment, care with warmth, and respect your pace, privacy, and identity — always.",
      },
    ],
  }),
  component: ValuesPage,
});

const VALUES = [
  {
    icon: Ear,
    title: "We listen",
    desc: "Without interrupting, fixing, or judging — fully present to your story.",
    detail:
      "Listening is the cornerstone of everything we do. Our listeners are trained in active, empathic listening — giving you space to express exactly what you need to, at your own pace.",
  },
  {
    icon: Heart,
    title: "We care",
    desc: "Your wellbeing comes first. Every conversation is held with warmth.",
    detail:
      "We believe that genuine care transforms lives. From the first call to ongoing support, every interaction is grounded in compassion, kindness, and a deep respect for your humanity.",
  },
  {
    icon: Shield,
    title: "We respect",
    desc: "Your pace, your privacy, your identity — always honoured.",
    detail:
      "Confidentiality is non-negotiable. We respect your boundaries, your culture, your identity, and your autonomy. You decide how much to share and when.",
  },
];

function ValuesPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative space-y-4">
          <p className="font-script text-primary text-3xl">Our values</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            We listen. We care. We respect.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            These aren't just words on a wall — they shape every conversation, every decision, every
            interaction.
          </p>
          <div className="flex justify-center pt-4">
            <img
              src={balanceArt}
              alt="Hand-drawn illustration of a vine-wrapped balance scale, symbolising fairness and care held in equilibrium"
              className="w-full max-w-sm h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Values detail */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6 max-w-5xl space-y-12">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <div className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-soft">
                  <v.icon className="h-12 w-12" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-3">
                <h2 className="text-3xl font-bold">{v.title}</h2>
                <p className="text-lg text-muted-foreground">{v.desc}</p>
                <p className="text-muted-foreground/80 leading-relaxed">{v.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles strip */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">Guiding Principles</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Compassion first",
              "Zero judgment",
              "Radical confidentiality",
              "Inclusive of all",
            ].map((p) => (
              <div
                key={p}
                className="rounded-2xl border border-border bg-background p-5 text-center shadow-card"
              >
                <p className="font-semibold text-gradient-brand">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-brand py-16 text-primary-foreground text-center">
        <div className="container mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Experience our values first-hand</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Reach out and feel the difference compassionate care makes.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-white/90 h-12 px-6 shadow-soft"
          >
            <Link to="/contact">
              Get in touch <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
