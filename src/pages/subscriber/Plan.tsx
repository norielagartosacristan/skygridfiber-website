import { useEffect, useState } from "react";
import {
  Wifi,
  Gauge,
  Upload,
  Download,
  CreditCard,
  CalendarDays,
  Loader2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

type Plan = {
  planName: string;
  downloadMbps: number;
  uploadMbps: number;
  monthlyPrice: string | number;
  billingType?: "PREPAID" | "POSTPAID";
  validityDays?: number | null;
};

type Service = {
  serviceStatus: string;
  startDate?: string | null;
  endDate?: string | null;
  validityStart?: string | null;
  validityEnd?: string | null;
  billingType?: "PREPAID" | "POSTPAID";
  plan?: Plan | null;
};

type Subscriber = {
  accountNumber: string;
  service?: Service | null;
};

type MeResponse = {
  success: boolean;
  subscriber: Subscriber;
  service?: Service | null;
};

type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};


function formatCurrency(value: string | number | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusLabel(status?: string) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Plan() {
  const [service, setService] = useState<Service | null>(null);
  const [subscriber, setSubscriber] =
    useState<Subscriber | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [branding, setBranding] = useState<CompanyBranding>({
  companyName: "",
  tradeName: null,
  logoUrl: null,
});

useEffect(() => {
    async function loadBranding() {
      try {
        const response = await fetch(
          `${API_URL.replace(/\/$/, "")}/api/company/branding`,
        );
  
        if (!response.ok) return;
  
        const result = await response.json();
  
        if (result.success && result.data) {
          setBranding({
            companyName: result.data.companyName || "",
            tradeName: result.data.tradeName || null,
            logoUrl: result.data.logoUrl || null,
          });
        }
      } catch (error) {
        console.error("Failed to load company branding:", error);
      }
    }
  
    void loadBranding();
  }, []);
  

  useEffect(() => {
    async function loadPlan() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/subscriber-portal-auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data: MeResponse =
          await response.json();

        if (response.status === 401) {
          window.location.href =
            "/subscriber/login";
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            "Unable to load your plan.",
          );
        }

        setSubscriber(data.subscriber);

        setService(
            data.subscriber.service ??
                data.service ??
                null,
            );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your plan.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your plan...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-bold text-red-800">
          Unable to load your plan
        </p>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const plan = service?.plan ?? null;

  const billingType =
    service?.billingType ||
    plan?.billingType ||
    "POSTPAID";

  const isPrepaid =
    billingType === "PREPAID";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          My Plan
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your current {branding.tradeName || branding.companyName} internet plan and service details.
        </p>
      </div>

      {!plan ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <Wifi className="mx-auto h-12 w-12 text-amber-500" />

          <h2 className="mt-4 text-xl font-black text-amber-900">
            No Active Plan
          </h2>

          <p className="mt-2 text-sm text-amber-700">
            There is currently no internet plan assigned to
            your account.
          </p>
        </div>
      ) : (
        <>
          {/* Plan Header */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <Wifi className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm text-blue-100">
                      Current Internet Plan
                    </p>

                    <h2 className="text-3xl font-black">
                      {plan.planName}
                    </h2>
                  </div>
                </div>

                {subscriber && (
                  <p className="mt-5 text-sm text-blue-100">
                    Account Number:{" "}
                    <span className="font-bold text-white">
                      {subscriber.accountNumber}
                    </span>
                  </p>
                )}
              </div>

              <div className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
                {getStatusLabel(
                  service?.serviceStatus,
                )}
              </div>
            </div>
          </div>

          {/* Speed */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Download className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Download Speed
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-900">
                    Up to {plan.downloadMbps} Mbps
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Upload className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Upload Speed
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-900">
                    Up to {plan.uploadMbps} Mbps
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Gauge className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Plan Details
                </h2>

                <p className="text-xs text-slate-500">
                  Your current subscription information
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Plan
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {plan.planName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Billing Type
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {isPrepaid
                    ? "Prepaid"
                    : "Postpaid"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Monthly Rate
                </p>

                <p className="mt-1 text-xl font-black text-slate-900">
                  {formatCurrency(
                    plan.monthlyPrice,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Service Status
                </p>

                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                  {getStatusLabel(
                    service?.serviceStatus,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Service Dates */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Service Period
                </h2>

                <p className="text-xs text-slate-500">
                  Your current service dates
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Start Date
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {formatDate(
                    service?.validityStart ||
                      service?.startDate,
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  End Date
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {formatDate(
                    service?.validityEnd ||
                      service?.endDate,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Billing
                </h2>

                <p className="text-xs text-slate-500">
                  Payment arrangement for your plan
                </p>
              </div>
            </div>

            <div className="mt-5">
              {isPrepaid ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-bold text-blue-800">
                    Prepaid Service
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    Your service is prepaid. Payment is
                    required to maintain your service validity.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-bold text-slate-800">
                    Postpaid Service
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your monthly service charge is{" "}
                    <span className="font-bold text-slate-900">
                      {formatCurrency(
                        plan.monthlyPrice,
                      )}
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}