import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageCircle,
  ArrowRight,
  Copy,
  Check,
  Clock,
  Globe,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/helpline")({
  head: () => ({
    meta: [
      { title: "Helpline & Resources — ListenInn Foundation" },
      {
        name: "description",
        content:
          "24/7 free and confidential mental health helpline, live chat, self-help resources, and crisis guides from ListenInn Foundation.",
      },
    ],
  }),
  component: HelplinePage,
});

function HelplinePage() {
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
      desc: "Speak with a trained listener anytime. No wait, no judgment. Calls are free and completely confidential.",
      link: "tel:18005478364",
      linkText: "Call now",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      desc: "Text-based support available 8 AM – 11 PM, every single day. Chat from anywhere, even at work or school.",
      link: "/contact",
      linkText: "Start chatting",
    },
    {
      icon: Globe,
      title: "Online Resources",
      desc: "Self-help guides, breathing exercises, journaling prompts, and coping toolkits — available anytime.",
      link: "/faq",
      linkText: "Browse resources",
    },
    {
      icon: BookOpen,
      title: "Crisis Guides",
      desc: "Step-by-step guides for supporting yourself or someone you love through difficult moments.",
      link: "/faq",
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
          <p className="font-script text-primary text-3xl">Help & resources</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Support is <span className="text-gradient-brand">one call away</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Whether it's 3 PM or 3 AM — we're here. Always.
          </p>
        </div>
      </section>

      {/* Copyable hotline banner */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto rounded-2xl bg-background border border-border p-8 shadow-soft text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-accent" />
              <span>24/7 Helpline — free & confidential</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl md:text-5xl font-bold tracking-wide text-gradient-brand">
                {hotline}
              </span>
              <button
                onClick={copyNumber}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                aria-label="Copy helpline number"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-accent animate-copy-pop" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              If you are in immediate danger, please call your local emergency number first.
            </p>
          </div>
        </div>
      </section>

      {/* Resource cards */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
            How we can help
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {resources.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-4 shadow-soft">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.desc}</p>
                {r.link.startsWith("/") ? (
                  <Link
                    to={r.link}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                  >
                    {r.linkText} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <a
                    href={r.link}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                  >
                    {r.linkText} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety tips */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center space-y-6">
          <h2 className="text-2xl font-bold">While you wait or after a call</h2>
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
            <Link to="/contact">
              Reach out now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
