import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/listeninn-logo.png";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, Menu, X } from "lucide-react";
import { useState } from "react";

export function WaveTop() {
  return (
    <svg
      className="wave-divider -mb-px"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WaveBottom() {
  return (
    <svg
      className="wave-divider rotate-180 -mt-px"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

const NAV = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/values", label: "Values" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/faq", label: "FAQ" },
  { to: "/helpline", label: "Helpline" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="ListenInn Foundation logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-lg text-accent">listeninn</span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground">FOUNDATION</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === n.to
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-gradient-brand hover:opacity-90 text-primary-foreground shadow-soft"
          >
            <Link to="/helpline">
              <Phone className="mr-2 h-4 w-4" /> Helpline
            </Link>
          </Button>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === n.to
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-muted"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/60">
      {/* Tagline band */}
      <div className="bg-gradient-brand py-6 text-center text-primary-foreground">
        <p className="text-lg md:text-xl font-semibold tracking-wide">
          "Where every voice is heard with heart. <span className="text-red-200">❤️</span>"
        </p>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Main footer grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
              <div className="leading-tight">
                <div className="font-bold text-accent">listeninn</div>
                <div className="text-[10px] tracking-[0.25em] text-muted-foreground">FOUNDATION</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A safe place to talk. A place to feel understood.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Foundation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#mission" className="hover:text-primary transition-colors">Mission</a></li>
              <li><a href="/#vision" className="hover:text-primary transition-colors">Vision</a></li>
              <li><a href="/#our-work" className="hover:text-primary transition-colors">Our Work</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Get Involved</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#volunteer" className="hover:text-primary transition-colors">Volunteer</a></li>
              <li><a href="/#donate" className="hover:text-primary transition-colors">Donate</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/helpline" className="hover:text-primary transition-colors">Helpline</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Connect with us</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://x.com/ListeninnFDN"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* X icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/listeninn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* LinkedIn icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/listeninnfoundation/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@listeninn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* YouTube icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ListenInn Foundation · We listen. We care. We respect.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
