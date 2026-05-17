import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/listeninn-logo.png";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, Facebook, Twitter, Menu, X } from "lucide-react";
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
    <footer className="bg-background py-12 border-t border-border/60">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <div className="font-bold text-accent">listeninn</div>
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground">FOUNDATION</div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ListenInn Foundation · We listen. We care. We respect.
        </p>
        <div className="flex md:justify-end gap-4 text-muted-foreground">
          <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
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
