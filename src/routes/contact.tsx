import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { PageShell, WaveBottom } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ListenInn Foundation" },
      {
        name: "description",
        content:
          "Get in touch with ListenInn Foundation. Call our 24/7 helpline, email us, or send a message — we'll reply within 24 hours.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (fd: FormData) => {
    const errs: Record<string, string> = {};
    const name = (fd.get("from_name") as string)?.trim();
    const email = (fd.get("reply_to") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();

    if (!name || name.length < 2) errs.from_name = "Please enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.reply_to = "Please enter a valid email.";
    if (!message || message.length < 10)
      errs.message = "Message must be at least 10 characters.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    try {
      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY",
      );
      toast.success("Message sent! We'll get back to you soon. 💜");
      formRef.current.reset();
      setErrors({});
    } catch {
      toast.error(
        "Something went wrong. Please try again or call our helpline.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-8 space-y-5"
      noValidate
    >
      <h3 className="text-xl font-semibold mb-1">Send us a message</h3>
      <p className="text-sm opacity-80 mb-4">
        We'll reply within 24 hours. For urgent help, call our helpline.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="contact-name" className="text-primary-foreground/90">
          Your name
        </Label>
        <Input
          id="contact-name"
          name="from_name"
          placeholder="Jane Doe"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus-visible:ring-white/40"
        />
        {errors.from_name && (
          <p className="text-xs text-red-200">{errors.from_name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email" className="text-primary-foreground/90">
          Email address
        </Label>
        <Input
          id="contact-email"
          name="reply_to"
          type="email"
          placeholder="you@example.com"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus-visible:ring-white/40"
        />
        {errors.reply_to && (
          <p className="text-xs text-red-200">{errors.reply_to}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message" className="text-primary-foreground/90">
          Your message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="How can we help?"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus-visible:ring-white/40 resize-none"
        />
        {errors.message && (
          <p className="text-xs text-red-200">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={sending}
        size="lg"
        className="w-full bg-white text-primary hover:bg-white/90 font-semibold h-12 shadow-soft"
      >
        {sending ? (
          "Sending…"
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}

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

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Info cards */}
            <div className="grid sm:grid-cols-1 gap-4">
              {[
                {
                  icon: Phone,
                  title: "Helpline",
                  value: "1-800-LISTEN-IN",
                  sub: "Available 24 hours",
                },
                {
                  icon: Mail,
                  title: "Email",
                  value: "hello@listeninn.org",
                  sub: "Replies within 24 hours",
                },
                {
                  icon: MessageCircle,
                  title: "Chat",
                  value: "Start a chat",
                  sub: "Mon–Sun, 8am–11pm",
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
                    <div className="text-xs uppercase tracking-widest opacity-80">
                      {c.title}
                    </div>
                    <div className="text-lg font-semibold">{c.value}</div>
                    <div className="text-sm opacity-80">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
        <div className="text-background">
          <WaveBottom />
        </div>
      </section>
    </PageShell>
  );
}
