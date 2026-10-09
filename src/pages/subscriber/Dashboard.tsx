import { useEffect, useState } from "react";
import type { ElementType } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Gauge,
  Receipt,
  Wifi,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

type Plan = {
  planName: string;
  downloadMbps: number;
  uploadMbps: number;
  monthlyPrice: string | number;
  billingType?: "PREPAID" | "POSTPAID";
  validityDays?: number | null;
};

type Service = {
  id: string;
  serviceStatus: string;
  startDate?: string | null;
  endDate?: string | null;
  validityStart?: string | null;
  validityEnd?: string | null;
  billingType?: "PREPAID" | "POSTPAID";
  plan?: Plan | null;
};

type Subscriber = {
  id: string;
  accountNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  mobileNumber?: string | null;
  email?: string | null;
  installationAddress?: string | null;
  status: string;
  services?: Service[];
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

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: ElementType;
  iconClassName: string;
};

const [branding, setBranding] = useState<CompanyBranding>({
  companyName: "",
  tradeName: null,
  logoUrl: null,
});

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

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

function getFullName(subscriber: Subscriber) {
  return [
    subscriber.firstName,
    subscriber.middleName,
    subscriber.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

function getStatusLabel(status?: string) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

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

export default function SubscriberDashboard() {
  const [subscriber, setSubscriber] =
    useState<Subscriber | null>(null);

  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/subscriber-auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data: MeResponse = await response.json();

        if (response.status === 401) {
          window.location.href = "/subscriber/login";
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            "Unable to load your subscriber information.",
          );
        }

        setSubscriber(data.subscriber);
        setService(
          data.service ??
            data.subscriber.services?.[0] ??
            null,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subscriber) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-bold text-red-800">
            Unable to load your account
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error || "Subscriber information is unavailable."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const plan = service?.plan ?? null;

  const fullName = getFullName(subscriber);

  const serviceStatus =
    service?.serviceStatus || subscriber.status;

  const billingType =
    service?.billingType ||
    plan?.billingType ||
    "POSTPAID";

  const isPrepaid = billingType === "PREPAID";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-600/20 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-blue-100">
              Welcome back
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              {fullName}
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Account Number:{" "}
              <span className="font-bold text-white">
                {subscriber.accountNumber}
              </span>
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
              serviceStatus === "ACTIVE"
                ? "border-emerald-300/30 bg-emerald-400/20 text-white"
                : "border-white/20 bg-white/10 text-white"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                serviceStatus === "ACTIVE"
                  ? "bg-emerald-300"
                  : "bg-amber-300"
              }`}
            />

            {getStatusLabel(serviceStatus)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Current Plan"
          value={plan?.planName || "No Plan"}
          subtitle={
            plan
              ? `${plan.downloadMbps} Mbps download`
              : "No active service"
          }
          icon={Wifi}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Internet Speed"
          value={
            plan
              ? `Up to ${plan.downloadMbps} Mbps`
              : "—"
          }
          subtitle={
            plan
              ? `Upload up to ${plan.uploadMbps} Mbps`
              : "—"
          }
          icon={Gauge}
          iconClassName="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Monthly Rate"
          value={
            plan
              ? formatCurrency(plan.monthlyPrice)
              : "—"
          }
          subtitle={isPrepaid ? "Prepaid service" : "Postpaid service"}
          icon={CreditCard}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Service Status"
          value={getStatusLabel(serviceStatus)}
          subtitle={
            service?.startDate
              ? `Started ${formatDate(service.startDate)}`
              : "Service date unavailable"
          }
          icon={Activity}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Plan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                My Internet Service
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your current BayanNet service information.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Wifi className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Plan
              </p>

              <p className="mt-1 font-black text-slate-900">
                {plan?.planName || "—"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Billing Type
              </p>

              <p className="mt-1 font-black text-slate-900">
                {isPrepaid ? "Prepaid" : "Postpaid"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Download
              </p>

              <p className="mt-1 font-black text-slate-900">
                {plan
                  ? `Up to ${plan.downloadMbps} Mbps`
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Upload
              </p>

              <p className="mt-1 font-black text-slate-900">
                {plan
                  ? `Up to ${plan.uploadMbps} Mbps`
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Account
              </h2>

              <p className="text-xs text-slate-500">
                Subscriber information
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Account Number
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {subscriber.accountNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-700">
                {subscriber.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Mobile
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {subscriber.mobileNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service dates */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Service Dates
              </h2>

              <p className="text-xs text-slate-500">
                Your service period
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
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

            <div>
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
              <Receipt className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Billing
              </h2>

              <p className="text-xs text-slate-500">
                Current billing information
              </p>
            </div>
          </div>

          <div className="mt-6">
            {isPrepaid ? (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="font-bold text-blue-800">
                  Prepaid Service
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Your service is prepaid. Billing invoices are not
                  generated for this plan.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-bold text-slate-800">
                  Monthly Billing
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Your monthly service charge is{" "}
                  <span className="font-bold text-slate-900">
                    {plan
                      ? formatCurrency(plan.monthlyPrice)
                      : "—"}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`rounded-2xl border p-5 ${
          serviceStatus === "ACTIVE"
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              serviceStatus === "ACTIVE"
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          />

          <div>
            <p
              className={`font-bold ${
                serviceStatus === "ACTIVE"
                  ? "text-emerald-800"
                  : "text-amber-800"
              }`}
            >
              Service Status: {getStatusLabel(serviceStatus)}
            </p>

            <p
              className={`mt-1 text-sm ${
                serviceStatus === "ACTIVE"
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              {serviceStatus === "ACTIVE"
                ? `Your ${branding.companyName} internet service is currently active.`
                : "Please check your account or contact BayanNet support for assistance."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}