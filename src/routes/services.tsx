import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";

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

function ServicesPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative space-y-4">
          <p className="font-script text-primary text-3xl">Our services</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Support, in the form <span className="text-gradient-brand">you need it</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Whatever you're carrying, there's a way for us to walk with you. Tap any service to see
            the details and how to reach us.
          </p>
        </div>
      </section>

      {/* Services grid — each card links to its own detail layer */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/services/$serviceId"
                params={{ serviceId: s.slug }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground mb-6 shadow-soft group-hover:scale-110 transition-transform">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 flex-1">{s.blurb}</p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                  Learn more &amp; get in touch
                  <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
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
            <Link to="/connect">
              Talk to us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
