import {
  ChevronRight,
  ArrowRight,
  Check,
  Clock3,
  Headphones,
  Router,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCompanyPageTitle } from "../hooks/useCompanyPageTitle";
import Navbar from "../components/Navbar";

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
const [plans, setPlans] = useState<Plan[]>([]);
const [plansLoading, setPlansLoading] = useState(true);
const [plansError, setPlansError] = useState("");

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


type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};

const API_URL = import.meta.env.VITE_API_URL || "";

const [branding, setBranding] = useState<CompanyBranding>({
 companyName: "SkyGrid Tech Solutions Co.",
 tradeName: "SkyGrid Fiber",
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
          result.data.companyName || "SkyGrid Tech Solutions Co.",
          tradeName: result.data.tradeName || "SkyGrid Fiber",
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

     <Navbar
        branding={branding}
        apiUrl={API_URL}
      />
  
{/* ==================== HERO ==================== */}
<section className="relative isolate flex h-screen items-center overflow-hidden bg-slate-950">

  {/* Background Image */}
  <div
    className="absolute inset-0 -z-20 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('/hero-fiber.jpg')",
    }}
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/35" />

  {/* Subtle Blue Overlay */}
  <div className="absolute inset-0 -z-10 bg-blue-950/10" />

  {/* Hero Content */}
  <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
    <div className="max-w-3xl">

      {/* Label */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-blue-400" />
        Reliable Fiber Internet
      </div>

      {/* Heading */}
      <h1 className="text-2xl leading-tight tracking-tight text-white sm:text-4xl md:text-4xl">
       Power Your Home and Business with SkyGrid Fiber Internet
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
        Enjoy reliable, high-speed internet for your home,
        family, and business with{" "}
        {branding.tradeName || branding.companyName}.
        Stay connected to the things that matter most.
      </p>

      {/* Buttons */}
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <a
          href="#plans"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
        >
          Explore Internet Plans
          <ArrowRight size={19} />
        </a>

        <a
          href="#coverage"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          Check Coverage
          <ChevronRight size={19} />
        </a>
      </div>

      {/* Benefits */}
      <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/90">
        <div className="flex items-center gap-2">
          <Check size={17} className="text-blue-400" />
          Plans for Every Budget
        </div>

        <div className="flex items-center gap-2">
          <Check size={17} className="text-blue-400" />
          Reliable Connectivity
        </div>

        <div className="flex items-center gap-2">
          <Check size={17} className="text-blue-400" />
          Customer Support
        </div>
      </div>

    </div>
  </div>

</section>



{/* ==================== PLANS ==================== */}
<section
  id="plans"
  className="w-full bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
>
  <div className="mx-auto w-full max-w-[1600px]">

    {/* Section heading */}
    <div className="mb-12 max-w-2xl sm:mb-14">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
        Internet Plans
      </p>

      <h2 className="mt-4 text-3xl font-normal leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        The right connection for your everyday life.
      </h2>

      <p className="mt-5 max-w-xl text-base font-normal leading-7 text-slate-500 sm:text-lg">
        Reliable fiber internet for streaming, working, learning, and
        staying connected with the people who matter.
      </p>
    </div>

    {/* Plans */}
    <div>
      {plansLoading ? (
        <p className="py-12 text-center text-sm text-slate-500">
          Loading internet plans...
        </p>
      ) : plansError ? (
        <p className="py-12 text-center text-sm text-red-600">
          {plansError}
        </p>
      ) : plans.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          No internet plans are currently available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {plans.slice(0, 3).map((plan) => (
            <article
              key={plan.id}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:border-blue-200 hover:shadow-[0_16px_45px_rgba(15,23,42,0.07)] sm:p-8 lg:p-9"
            >
              {/* Plan name */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {plan.planName}
                  </p>

                  <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                        maximumFractionDigits: 2,
                      }).format(Number(plan.monthlyPrice))}
                    </span>

                    <span className="text-sm font-normal text-slate-500">
                      {plan.billingType === "PREPAID"
                        ? `/ ${plan.validityDays ?? 30} days`
                        : "/ month"}
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Router size={21} strokeWidth={1.5} />
                </div>
              </div>

              {/* Speed details */}
              <div className="mt-8 border-y border-slate-100 py-6">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  Download speed
                </p>

                <p className="mt-2 text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl">
                  Up to {plan.downloadMbps}
                  <span className="ml-2 text-base font-normal tracking-normal text-slate-500">
                    Mbps
                  </span>
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">Upload speed</span>
                  <span className="text-slate-700">
                    Up to {plan.uploadMbps} Mbps
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm font-normal leading-6 text-slate-500">
                {plan.billingType === "PREPAID"
                  ? "Prepaid fiber internet with a defined validity period."
                  : "Monthly fiber internet for your home or business."}
              </p>

              {/* CTA stays at the bottom */}
              <div className="mt-auto pt-8">
                <Link
                  to={`/apply?plan=${encodeURIComponent(String(plan.id))}`}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Get Started
                  <ArrowRight size={17} strokeWidth={1.7} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>

    {/* Footer note */}
    <p className="mt-8 text-center text-xs font-normal leading-5 text-slate-400">
      Speeds are advertised as up to the stated Mbps and may vary depending
      on network conditions and other factors.
    </p>

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
                    src="/logo.jpg"
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
