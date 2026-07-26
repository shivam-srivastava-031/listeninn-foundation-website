import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { LeafyVine } from "@/components/artwork";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { getService, SERVICES, type ServiceAction } from "@/lib/services";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ params }) => {
    const service = getService(params.serviceId);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.service.title} — ListenInn Foundation` },
          { name: "description", content: loaderData.service.summary },
        ]
      : [],
  }),
  component: ServiceDetailPage,
});

/** Renders an action as an internal Link, external anchor, or mailto/anchor. */
function ActionButton({ action }: { action: ServiceAction }) {
  const className = action.primary
    ? "bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12 px-6"
    : "border-primary/30 hover:bg-primary/5 h-12 px-6";
  const variant = action.primary ? "default" : "outline";

  const content = (
    <>
      {action.label}
      {action.external ? (
        <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
      ) : (
        <ArrowRight className="ml-2 h-4 w-4" />
      )}
    </>
  );

  if (action.to) {
    return (
      <Button size="lg" asChild variant={variant} className={className}>
        <Link to={action.to}>{content}</Link>
      </Button>
    );
  }
  return (
    <Button size="lg" asChild variant={variant} className={className}>
      <a
        href={action.href}
        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    </Button>
  );
}

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const Icon = service.icon;
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-16 pb-14 overflow-hidden">
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto px-6 max-w-3xl relative">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft">
              <Icon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground">{service.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6 max-w-3xl space-y-12">
          {/* Overview */}
          <div className="space-y-5">
            {service.overview.map((p, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* What to expect */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-5">What to expect</h2>
            <ul className="space-y-3">
              {service.whatToExpect.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How it differs (Listening Sessions) */}
          {service.howItDiffers && (
            <div className="rounded-2xl border border-primary/20 bg-gradient-hero p-8">
              <h2 className="text-2xl font-bold mb-6">{service.howItDiffers.heading}</h2>
              <div className="space-y-5">
                {service.howItDiffers.points.map((pt) => (
                  <div key={pt.term} className="flex flex-col sm:flex-row sm:gap-6">
                    <div className="sm:w-48 flex-shrink-0 font-semibold text-primary mb-1 sm:mb-0">
                      {pt.term}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder block (Counseling credentials/charges) */}
          {service.placeholder && (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-card p-8">
              <h2 className="text-2xl font-bold mb-2">{service.placeholder.heading}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {service.placeholder.intro}
              </p>
              <dl className="space-y-4">
                {service.placeholder.fields.map((f) => (
                  <div key={f.label} className="rounded-xl border border-border bg-background p-4">
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      {f.label}
                    </dt>
                    <dd className="text-foreground/70 italic">{f.placeholder}</dd>
                  </div>
                ))}
              </dl>
              {service.placeholder.note && (
                <p className="text-xs text-muted-foreground mt-4">{service.placeholder.note}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Take the next step</h2>
            <div className="flex flex-wrap gap-3">
              {service.actions.map((a) => (
                <ActionButton key={a.label} action={a} />
              ))}
            </div>
          </div>

          <div className="text-accent flex justify-center pt-4">
            <LeafyVine className="h-9 w-64 max-w-full" />
          </div>
        </div>
      </section>

      {/* Explore other services */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
            Explore other services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((s) => {
              const OtherIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  to="/services/$serviceId"
                  params={{ serviceId: s.slug }}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                    <OtherIcon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {s.title}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
