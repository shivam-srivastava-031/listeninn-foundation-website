import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Heart, Ear, Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ReadingCircleArt, LeafyVine } from "@/components/artwork";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ListenInn Foundation" },
      {
        name: "description",
        content:
          "Learn about ListenInn Foundation's mission — making compassionate mental health care accessible through listening, counseling, and community.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-6 relative">
          <p className="font-script text-primary text-3xl">About us</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Mental health support that begins with truly{" "}
            <span className="text-gradient-brand">listening</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ListenInn Foundation exists to make compassionate mental health care accessible to
            everyone. We believe that healing often starts with one honest conversation — without
            judgment, without pressure, and without cost.
          </p>
          <div className="text-accent flex justify-center pt-2">
            <LeafyVine className="h-10 w-72 max-w-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: "12k+", l: "Conversations held" },
              { n: "120+", l: "Trained listeners" },
              { n: "24/7", l: "Helpline availability" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-border bg-background p-6 shadow-card text-center"
              >
                <div className="text-3xl font-bold text-gradient-brand">{s.n}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <div className="text-center space-y-3">
            <p className="font-script text-primary text-3xl">Our story</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              From a single conversation to a movement
            </h2>
            <div className="text-accent flex justify-center pt-2">
              <ReadingCircleArt className="w-full max-w-sm h-auto" />
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="leading-relaxed">
              ListenInn was born from one realization:{" "}
              <strong className="text-foreground">
                too many people suffer in silence because they don't have a safe space to speak
              </strong>
              . Our founders — a group of counselors, community organizers, and mental health
              advocates — came together to build a foundation where every person, regardless of
              background or income, could access the power of being truly heard.
            </p>
            <p className="leading-relaxed">
              What started as a small listening service is growing into a comprehensive support
              network spanning trained volunteer listeners, qualified counseling professionals, peer
              support groups, and youth wellbeing programs. Every day, we show up for the quiet
              moments and the loud ones.
            </p>
          </div>

          {/* Mission cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              {
                icon: Ear,
                title: "Our Mission",
                desc: "To ensure no one has to navigate their mental health journey alone. We provide free, compassionate, confidential support to anyone who needs it.",
              },
              {
                icon: Heart,
                title: "Our Vision",
                desc: "A world where mental health care is accessible, stigma-free, and rooted in empathy. Where asking for help is seen as an act of courage.",
              },
              {
                icon: Users,
                title: "Our Community",
                desc: "Trained listeners, qualified counseling professionals, and a growing community of people who believe in the power of connection.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-5 shadow-soft">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-brand py-16 text-primary-foreground text-center">
        <div className="container mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to take the first step?</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Whether you need someone to talk to or want to help others — we're here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-white/90 h-12 px-6 shadow-soft"
            >
              <Link to="/contact">
                Reach out <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-white/30 text-primary-foreground hover:bg-white/10 h-12 px-6"
            >
              <Link to="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
