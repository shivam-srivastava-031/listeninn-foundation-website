import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ListenInn Foundation" },
      {
        name: "description",
        content:
          "Frequently asked questions about ListenInn Foundation's services, helpline, donations, and mental health support.",
      },
    ],
  }),
  component: FAQPage,
});

const FAQS = [
  {
    q: "Is ListenInn really free and confidential?",
    a: "Yes. Our helpline and listening sessions are completely free, anonymous, and confidential. Counseling sessions are offered on a sliding scale, with fully free options for those who need them. We never share your information without your explicit consent.",
  },
  {
    q: "Who answers the helpline?",
    a: "Trained volunteer listeners and on-call mental health professionals. Every person on our team is thoroughly vetted, background-checked, and supervised by our clinical team. You're always in safe hands.",
  },
  {
    q: "I'm not in crisis — can I still reach out?",
    a: "Absolutely. You don't need a reason to call. If something feels heavy, confusing, or you just need to talk — that's reason enough. Our listeners are here for everyday struggles too.",
  },
  {
    q: "Do you offer help in multiple languages?",
    a: "We currently support English, Hindi, and Spanish, and are actively expanding language coverage through our volunteer network. Let us know your preferred language and we'll do our best to match you.",
  },
  {
    q: "What if I'm worried about someone else?",
    a: "Call our helpline — we'll guide you through how to support them and connect them to care safely. You can also share our helpline number with them directly. Caring enough to ask is already a powerful step.",
  },
  {
    q: "Where does my donation go?",
    a: "100% of donations fund direct services: free counseling sessions, helpline operations, listener training, and youth wellbeing workshops. We publish annual impact reports for full transparency.",
  },
  {
    q: "How quickly can I get help in a crisis?",
    a: "Our helpline is available 24/7 with no wait time for crisis calls. If you're in immediate danger, please also call your local emergency number. We'll stay with you until you're connected to the right support.",
  },
  {
    q: "Can I volunteer even without a psychology background?",
    a: "Yes! We provide a comprehensive 40-hour training program that covers active listening, empathy techniques, boundaries, and crisis protocols. All you need is a willingness to show up with compassion.",
  },
  {
    q: "How do I bring ListenInn to my school or workplace?",
    a: "Visit our Get Involved page or contact us directly. We offer customized workshops, listening booths for events, and ongoing partnership programs tailored to your community's needs.",
  },
];

function FAQPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-gradient-hero pt-20 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative space-y-4">
          <p className="font-script text-primary text-3xl">Questions</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Frequently asked
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We've gathered the most common questions. If yours isn't here, don't
            hesitate to reach out.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-6 shadow-card"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-6 text-center space-y-6 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Still have questions?
          </h2>
          <p className="text-muted-foreground text-lg">
            We're happy to help. Reach out and we'll get back to you within 24
            hours.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-gradient-brand text-primary-foreground shadow-soft hover:opacity-90 h-12 px-6"
          >
            <Link to="/contact">
              Contact us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
