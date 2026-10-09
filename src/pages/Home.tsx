import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Clock3,
  Headphones,
  Menu,
  Router,
  ShieldCheck,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCompanyPageTitle } from "../hooks/useCompanyPageTitle";

type Plan = {
  id: string | number;
  planCode: string;
  planName: string;
  downloadMbps: number;
  uploadMbps: number;
  monthlyPrice: number | string;
  billingType: string;
  validityDays?: number | null;
  isActive: boolean;
};

function Home() {
const [menuOpen, setMenuOpen] = useState(false);
const [plans, setPlans] = useState<Plan[]>([]);
const [plansLoading, setPlansLoading] = useState(true);
const [plansError, setPlansError] = useState("");
const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

const nextPlan = () => {
  setCurrentPlanIndex((index) =>
    plans.length ? (index + 1) % plans.length : 0
  );
};

const prevPlan = () => {
  setCurrentPlanIndex((index) =>
    plans.length ? (index - 1 + plans.length) % plans.length : 0
  );
};

useEffect(() => {
  const controller = new AbortController();

  async function loadPlans() {
    try {
      const apiBase = (
        import.meta.env.VITE_API_URL || ""
      ).replace(/\/$/, "");

      const response = await fetch(
        `${apiBase}/api/plans`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Failed to load internet plans.");
      }

      const result = await response.json();

      const items = Array.isArray(result)
        ? result
        : result.data ?? result.plans ?? [];

     
    setPlans(
      items.filter(
        (plan: Plan) =>
          plan.isActive !== false &&
          plan.billingType !== "FREE",
      ),
    );

    } catch (error) {
      if (controller.signal.aborted) return;

      setPlansError(
        error instanceof Error
          ? error.message
          : "Unable to load internet plans."
      );
    } finally {
      if (!controller.signal.aborted) {
        setPlansLoading(false);
      }
    }
  }

  void loadPlans();

  return () => controller.abort();
}, []);

useEffect(() => {
  setCurrentPlanIndex(0);
}, [plans.length]);



type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};

const API_URL = import.meta.env.VITE_API_URL || "";

const [branding, setBranding] = useState<CompanyBranding>({
  companyName: "BayanNet Telecom Corporation",
  tradeName: "BayanNet",
  logoUrl: null,
});
useCompanyPageTitle(branding);

useEffect(() => {
  const controller = new AbortController();

  async function loadBranding() {
    try {
      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/api/company/branding`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("Unable to load company branding.");
      }

      const result = await response.json();

      if (result.success && result.data) {
        setBranding({
          companyName:
            result.data.companyName || "BayanNet Telecom Corporation",
          tradeName: result.data.tradeName || null,
          logoUrl: result.data.logoUrl || null,
        });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Failed to load company branding:", error);
      }
    }
  }

  void loadBranding();

  return () => controller.abort();
}, []);


  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

         
          
{/* Logo and Company Branding */}
<Link to="/" className="flex items-center gap-3">
  <img
    src={
      branding.logoUrl
        ? branding.logoUrl.startsWith("http")
          ? branding.logoUrl
          : `${API_URL.replace(/\/$/, "")}${branding.logoUrl.startsWith("/") ? "" : "/"}${branding.logoUrl}`
        : "/new-logo.png"
    }
    alt={`${branding.tradeName || branding.companyName} logo`}
    className="h-10 w-10 shrink-0 object-contain"
    onError={(event) => {
      const img = event.currentTarget;

      if (!img.src.endsWith("/new-logo.png")) {
        img.onerror = null;
        img.src = "/new-logo.png";
      }
    }}
  />

  <div>
    <div className="text-xl font-extrabold tracking-tight text-slate-900">
      {branding.tradeName || branding.companyName}
    </div>

    {branding.tradeName &&
      branding.companyName &&
      branding.tradeName !== branding.companyName && (
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {branding.companyName}
        </div>
      )}
  </div>
</Link>


          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              className="text-sm font-semibold text-blue-600"
              href="#"
            >
              Home
            </a>

            <a
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              href="#plans"
            >
              Plans
            </a>

            <a
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              href="#coverage"
            >
              Coverage
            </a>

            <a
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              href="#about"
            >
              About Us
            </a>

            <a
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              href="#support"
            >
              Support
            </a>
          </nav>

          {/* Desktop Apply Button */}
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
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-4">

              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                Home
              </a>

              <a
                href="#plans"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                Plans
              </a>

              <a
                href="#coverage"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                Coverage
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                About Us
              </a>

              <a
                href="#support"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                Support
              </a>

                {/* Subscriber Login */}
      <Link
        to="/subscriber/login"
        onClick={() => setMenuOpen(false)}
        className="inline-flex items-center justify-center rounded-xl border border-blue-600 px-5 py-3 font-bold text-blue-600 transition hover:bg-blue-50"
      >
        Subscriber Login
      </Link>

              <Link
                to="/apply"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
              >
                Apply Now
                <ArrowRight size={17} />
              </Link>

            </div>
          </div>
        )}
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(37,99,235,0.35),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">

          {/* Hero Text */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Reliable Internet Connectivity
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Fast Internet.
              <span className="block text-blue-400">
                Better Connections.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Stay connected with reliable high-speed internet from 
              {branding.tradeName || branding.companyName}. Built for homes, families,
              businesses, and communities.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="#plans"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
              >
                View Internet Plans
                <ArrowRight size={18} />
              </a>

              <a
                href="#coverage"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Check Coverage
                <ChevronRight size={18} />
              </a>

            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-300">

              <div className="flex items-center gap-2">
                <Check className="text-blue-400" size={18} />
                Affordable Plans
              </div>

              <div className="flex items-center gap-2">
                <Check className="text-blue-400" size={18} />
                Reliable Connectivity
              </div>

              <div className="flex items-center gap-2">
                <Check className="text-blue-400" size={18} />
                Local Support
              </div>

            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative h-[440px] w-[440px]">

              <div className="absolute inset-10 rounded-full border border-blue-500/20" />
              <div className="absolute inset-20 rounded-full border border-blue-500/20" />
              <div className="absolute inset-32 rounded-full border border-blue-500/20" />

              <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-600/40">
                <Wifi
                  size={90}
                  className="text-white"
                  strokeWidth={1.5}
                />
              </div>

              <div className="absolute right-2 top-16 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                <div className="text-2xl font-black text-white">
                  100 Mbps
                </div>

                <div className="text-xs text-slate-300">
                  Up to speed
                </div>
              </div>

              <div className="absolute bottom-16 left-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                <div className="text-2xl font-black text-white">
                  24/7
                </div>

                <div className="text-xs text-slate-300">
                  Connected
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==================== PLANS ==================== */}
      <section
        id="plans"
        className="bg-slate-50 px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Internet Plans
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Choose the connection that fits you.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Simple and affordable plans designed for everyday connectivity.
            </p>

          </div>

         
          
<div className="mt-14">
  {plansLoading ? (
    <p className="py-10 text-center text-slate-500">
      Loading internet plans...
    </p>
  ) : plansError ? (
    <p className="py-10 text-center text-red-600">
      {plansError}
    </p>
  ) : plans.length === 0 ? (
    <p className="py-10 text-center text-slate-500">
      No internet plans are currently available.
    </p>
  ) : (
    <>
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={prevPlan}
          aria-label="Previous internet plan"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-blue-50 sm:h-12 sm:w-12"
        >
          <ChevronLeft size={22} />
        </button>

       
          
<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
  {plans
    .slice(currentPlanIndex, currentPlanIndex + 3)
    .concat(
      plans.slice(
        0,
        Math.max(0, currentPlanIndex + 3 - plans.length),
      ),
    )
    .map((plan) => (
      <div
        key={plan.id}
        className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
              {plan.planName}
            </p>

            <div className="mt-4 flex flex-wrap items-end gap-2">
              <span className="text-3xl font-black text-slate-900">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  maximumFractionDigits: 2,
                }).format(Number(plan.monthlyPrice))}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                {plan.billingType === "PREPAID"
                  ? `/ ${plan.validityDays ?? 30} days`
                  : "/ month"}
              </span>
            </div>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Router size={24} />
          </div>
        </div>

        <div className="mt-7 rounded-2xl bg-slate-950 p-5">
          <div className="text-2xl font-black text-white sm:text-3xl">
            Up to {plan.downloadMbps} Mbps
          </div>

          <div className="mt-2 text-sm text-slate-400">
            Download speed
          </div>

          <div className="mt-3 text-sm text-slate-300">
            Upload: up to {plan.uploadMbps} Mbps
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-600">
          {plan.billingType === "PREPAID"
            ? "Prepaid internet plan with a defined validity period."
            : "Monthly internet service for your home or business."}
        </p>

        <Link
          to={`/apply?plan=${encodeURIComponent(String(plan.id))}`}
          className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Get Started
          <ArrowRight size={17} />
        </Link>
      </div>
    ))}
</div>

    

        <button
          type="button"
          onClick={nextPlan}
          aria-label="Next internet plan"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-blue-50 sm:h-12 sm:w-12"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {plans.map((plan, index) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setCurrentPlanIndex(index)}
            aria-label={`Show ${plan.planName}`}
            aria-current={index === currentPlanIndex ? "true" : undefined}
            className={`h-2.5 rounded-full transition-all ${
              index === currentPlanIndex
                ? "w-8 bg-blue-600"
                : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-slate-500">
        Plan {currentPlanIndex + 1} of {plans.length}
      </p>
    </>
  )}
</div>

        </div>
      </section>

      {/* ==================== WHY BAYANNET ==================== */}
      <section
        id="about"
        className="px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Why {branding.companyName}
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Internet made for the way you live.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                {branding.companyName} is committed to bringing
                reliable, accessible, and affordable internet connectivity
                to the communities we serve.
              </p>

              <Link
                to="/apply"
                className="mt-8 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700"
              >
                Become a {branding.tradeName || branding.companyName} subscriber
                <ArrowRight size={18} />
              </Link>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {[
                {
                  icon: Wifi,
                  title: "Reliable Connectivity",
                  text: "Stay connected for work, school, entertainment, and everyday communication.",
                },
                {
                  icon: Router,
                  title: "Fiber Technology",
                  text: "Modern network infrastructure designed for fast and stable connectivity.",
                },
                {
                  icon: Headphones,
                  title: "Customer Support",
                  text: "Get assistance when you need help with your internet service.",
                },
                {
                  icon: ShieldCheck,
                  title: "Trusted Service",
                  text: "Professional internet service built around our customers and communities.",
                },
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>

                  </div>
                );

              })}

            </div>

          </div>
        </div>
      </section>

      {/* ==================== COVERAGE ==================== */}
      <section
        id="coverage"
        className="bg-slate-950 px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Coverage
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Connecting more communities.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Our network continues to grow as we bring reliable
                internet connectivity to more homes and businesses.
              </p>

              <div className="mt-8 flex items-center gap-3 text-slate-200">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                  <Wifi size={19} />
                </div>

                Check if {branding.tradeName || branding.companyName} is available in your area.

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                  <Clock3
                    size={27}
                    className="text-white"
                  />
                </div>

                <div>

                  <h3 className="font-bold text-white">
                    Coming to your area?
                  </h3>

                  <p className="text-sm text-slate-400">
                    Contact us to check availability.
                  </p>

                </div>

              </div>

              <Link
                to="/apply"
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Check Availability
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        id="apply"
        className="px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-blue-600 px-8 py-14 text-center shadow-2xl shadow-blue-600/20 sm:px-14">

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Ready to get connected?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Choose your {branding.tradeName || branding.companyName} plan and start enjoying reliable
            internet connectivity.
          </p>

          <Link
            to="/apply"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-600 shadow-lg transition hover:bg-blue-50"
          >
            Apply for Internet
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        id="support"
        className="border-t border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <div className="lg:col-span-2">

              <Link
                to="/"
                className="flex items-center gap-3"
              >

                <div className="flex h-11 w-11 items-center justify-center">
                  <img
                    src="/new-logo.png"
                    alt={branding.companyName}
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div>

                  <div className="text-xl font-extrabold">
                    {branding.tradeName || branding.companyName}
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {branding.companyName}
                  </div>

                </div>

              </Link>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
                Providing reliable and affordable internet connectivity
                for homes, families, businesses, and communities.
              </p>

            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Quick Links
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">

                <a
                  href="#plans"
                  className="hover:text-blue-600"
                >
                  Internet Plans
                </a>

                <a
                  href="#coverage"
                  className="hover:text-blue-600"
                >
                  Coverage
                </a>

                <a
                  href="#about"
                  className="hover:text-blue-600"
                >
                  About Us
                </a>

                <Link
                  to="/apply"
                  className="hover:text-blue-600"
                >
                  Apply Now
                </Link>

              </div>

            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Contact
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Customer Support</p>
                <p>Technical Support</p>
                <p>Billing Assistance</p>
                <p>Business Inquiries</p>
              </div>

            </div>

          </div>

          <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
            © {new Date().getFullYear()} {branding.companyName}.
            All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;
