import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};

type NavbarProps = {
  branding: CompanyBranding;
  apiUrl?: string;
};

export default function Navbar({
  branding,
  apiUrl = "",
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const companyName = branding.tradeName || branding.companyName;

  const logoSrc = branding.logoUrl
    ? /^https?:\/\//i.test(branding.logoUrl)
      ? branding.logoUrl
      : `${apiUrl.replace(/\/$/, "")}${
          branding.logoUrl.startsWith("/") ? "" : "/"
        }${branding.logoUrl}`
    : "/logo.jpg";

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Plans", href: "/#plans" },
    { label: "Coverage", href: "/#coverage" },
    { label: "About Us", href: "/#about" },
    { label: "Support", href: "/#support" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo and Company Branding */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-3"
        >
          <img
            src={logoSrc}
            alt={`${companyName} logo`}
            className="h-10 w-10 shrink-0 object-contain"
            onError={(event) => {
              const img = event.currentTarget;

              if (!img.src.endsWith("/logo.jpg")) {
                img.onerror = null;
                img.src = "/logo.jpg";
              }
            }}
          />

          <div className="min-w-0">
            <div className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {companyName}
            </div>

            {branding.tradeName &&
              branding.companyName &&
              branding.tradeName !== branding.companyName && (
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {branding.companyName}
                </div>
              )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/subscriber/login"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
          >
            Subscriber Login
          </Link>

          <Link
            to="/apply"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Apply Now
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="font-semibold text-slate-700 transition hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}

            <Link
              to="/subscriber/login"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center rounded-xl border border-blue-600 px-5 py-3 font-bold text-blue-600 transition hover:bg-blue-50"
            >
              Subscriber Login
            </Link>

            <Link
              to="/apply"
              onClick={closeMenu}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Apply Now
              <ArrowRight size={17} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}