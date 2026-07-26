import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageShell, WaveBottom } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Send, Instagram, ArrowRight, ExternalLink } from "lucide-react";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/services";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ListenInn Foundation" },
      {
        name: "description",
        content:
          "Get in touch with ListenInn Foundation — share your story through our Connect form, email us, or message us on Instagram. We'll reply within 24 hours.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      {/* Contact hero band */}
      <section className="relative bg-gradient-brand pt-20 pb-24 text-primary-foreground overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="font-script text-3xl opacity-90">Reach out</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              We're here, whenever you're ready
            </h1>
            <p className="opacity-90 text-lg">
              One conversation can change everything. Start one with us.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Contact channels */}
            <div className="grid sm:grid-cols-1 gap-4">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: CONTACT_EMAIL,
                  sub: "Replies within 24 hours",
                },
                {
                  icon: MessageCircle,
                  title: "Share your story",
                  value: "Connect form",
                  sub: "The best way to reach us right now",
                },
                {
                  icon: Instagram,
                  title: "Instagram",
                  value: "@listeninnfoundation",
                  sub: "Send us a message",
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
                    <div className="text-xs uppercase tracking-widest opacity-80">{c.title}</div>
                    <div className="text-lg font-semibold">{c.value}</div>
                    <div className="text-sm opacity-80">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ways to get in touch (real, working actions) */}
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-8 flex flex-col justify-center space-y-5">
              <div>
                <h3 className="text-xl font-semibold mb-1">Send us a message</h3>
                <p className="text-sm opacity-80">
                  The surest way to be heard is our Connect form — it goes straight to our team, who
                  will read it with care and get back to you. Prefer email or social? Those work
                  too.
                </p>
              </div>

              <Button
                size="lg"
                asChild
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold h-12 shadow-soft"
              >
                <Link to="/connect">
                  <Send className="mr-2 h-4 w-4" /> Share your story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 h-12"
              >
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail className="mr-2 h-4 w-4" /> Email us
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 h-12"
              >
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-4 w-4" /> Message on Instagram
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                </a>
              </Button>

              <p className="text-xs opacity-70 text-center">
                In immediate danger? Please contact your local emergency services first — we are not
                an emergency service.
              </p>
            </div>
          </div>
        </div>
        <div className="text-background">
          <WaveBottom />
        </div>
      </section>
    </PageShell>
  );
}
