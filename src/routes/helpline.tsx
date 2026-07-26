import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LeafyVine } from "@/components/artwork";
import {
  MessageCircle,
  ArrowRight,
  Mail,
  Instagram,
  Globe,
  BookOpen,
  Heart,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/helpline")({
  head: () => ({
    meta: [
      { title: "Get Support & Resources — ListenInn Foundation" },
      {
        name: "description",
        content:
          "Reach a ListenInn listener through our Connect form or email, and explore free self-help resources and crisis guides. A safe space to talk.",
      },
    ],
  }),
  component: HelplinePage,
});

function HelplinePage() {
  const ways = [
    {
      icon: Heart,
      title: "Share your story",
      desc: "Tell us what's on your mind through our Connect form. A member of our team will read it with care and reach out to you.",
      to: "/connect",
      linkText: "Open the Connect form",
      highlight: true,
    },
    {
      icon: Mail,
      title: "Email us",
      desc: "Write to us anytime at listeninnfoundation@gmail.com. We aim to reply within 24 hours.",
      href: "mailto:listeninnfoundation@gmail.com",
      linkText: "Send an email",
    },
    {
      icon: MessageCircle,
      title: "Chat with our assistant",
      desc: "Use the chat button in the corner to ask questions, learn about our programs, or get pointed to the right support.",
      href: "#ai-chat-toggle",
      linkText: "Open the chat",
    },
    {
      icon: Instagram,
      title: "Message us on Instagram",
      desc: "Prefer social? Reach out to @listeninnfoundation and we'll respond as soon as we can.",
      href: "https://www.instagram.com/listeninnfoundation/",
      linkText: "Go to Instagram",
      external: true,
    },
  ];

  const resources = [
    {
      icon: Globe,
      title: "Online Resources",
      desc: "Self-help guides, breathing exercises, journaling prompts, and coping toolkits — available anytime.",
      to: "/faq",
      linkText: "Browse resources",
    },
    {
      icon: BookOpen,
      title: "Crisis Guides",
      desc: "Step-by-step guides for supporting yourself or someone you love through difficult moments.",
      to: "/faq",
      linkText: "Read guides",
    },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative space-y-4">
          <p className="font-script text-primary text-3xl">Get support</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            You don't have to <span className="text-gradient-brand">carry it alone</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Reaching out is the first step. Here's how to talk to us.
          </p>
          <div className="text-accent flex justify-center pt-2">
            <LeafyVine className="h-10 w-72 max-w-full" />
          </div>
        </div>
      </section>

      {/* Ways to reach us */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-4">
            Ways to reach us
          </h2>
          <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-12">
            We're setting up a dedicated helpline number — until it's live, these are the surest
            ways to be heard.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ways.map((w) => {
              const inner = (
                <>
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 shadow-soft ${
                      w.highlight
                        ? "bg-gradient-brand text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <w.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{w.desc}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                    {w.linkText} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </>
              );
              const cls = `group block rounded-2xl border p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 ${
                w.highlight ? "border-primary/40 bg-background" : "border-border bg-background"
              }`;
              return w.to ? (
                <Link key={w.title} to={w.to} className={cls}>
                  {inner}
                </Link>
              ) : (
                <a
                  key={w.title}
                  href={w.href}
                  className={cls}
                  {...(w.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {inner}
                </a>
              );
            })}
          </div>

          {/* Urgent-help note (replaces the old crisis-number banner) */}
          <div className="max-w-3xl mx-auto mt-10 rounded-2xl border border-border bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">In immediate danger or a medical emergency?</strong>{" "}
              Please contact your local emergency services right away. Our team responds as soon as
              possible, but we are not an emergency service.
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-10">
            Self-help resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {resources.map((r) => (
              <Link
                key={r.title}
                to={r.to}
                className="group rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-4 shadow-soft">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.desc}</p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                  {r.linkText} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grounding tips */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <Clock className="h-4 w-4 text-accent" /> A few things that can help right now
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              "Take 5 slow, deep breaths",
              "Drink water or hold something warm",
              "Write down one thought that weighs on you",
            ].map((tip) => (
              <div
                key={tip}
                className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground"
              >
                {tip}
              </div>
            ))}
          </div>
          <Button
            size="lg"
            asChild
            className="bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12 px-6"
          >
            <Link to="/connect">
              Reach out now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
