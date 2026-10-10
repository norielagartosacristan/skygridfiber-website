import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

type Subscriber = {
  accountNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  mobileNumber?: string | null;
  email?: string | null;
  installationAddress?: string | null;
  status: string;
};

type MeResponse = {
  success: boolean;
  subscriber: Subscriber;
};


type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};


export default function Account() {
  const [subscriber, setSubscriber] =
    useState<Subscriber | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
const [branding, setBranding] = useState<CompanyBranding>({
  companyName: "My Internet Service Provider",
  tradeName: "MyCompany",
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
            companyName:
              result.data.companyName ||
              "BayanNet Telecom Corporation",
            tradeName: result.data.tradeName || null,
            logoUrl: result.data.logoUrl || null,
          });
        }
      } catch (err) {
        console.error("Failed to load company branding:", err);
      }
    }

    void loadBranding();
  }, []);


  useEffect(() => {
    async function loadAccount() {
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
            "Unable to load your account.",
          );
        }

        setSubscriber(data.subscriber);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your account.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  
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
          companyName:
            result.data.companyName ||
            "BayanNet Telecom Corporation",
          tradeName: result.data.tradeName || null,
          logoUrl: result.data.logoUrl || null,
        });
      }
    } catch (err) {
      console.error("Failed to load company branding:", err);
    }
  }

  void loadBranding();
}, []);


  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (error || !subscriber) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-bold text-red-800">
          Unable to load your account
        </p>

        <p className="mt-2 text-sm text-red-600">
          {error ||
            "Subscriber information is unavailable."}
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

  const fullName = [
    subscriber.firstName,
    subscriber.middleName,
    subscriber.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          My Account
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and view your {branding.companyName} subscriber information.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black">
            {subscriber.firstName?.charAt(0)}
            {subscriber.lastName?.charAt(0)}
          </div>

          <div>
            <p className="text-sm text-blue-100">
              Subscriber
            </p>

            <h2 className="text-2xl font-black">
              {fullName}
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              Account Number:{" "}
              <span className="font-bold text-white">
                {subscriber.accountNumber}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black text-slate-900">
              Personal Information
            </h2>

            <p className="text-xs text-slate-500">
              Your registered subscriber details
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Full Name
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {fullName}
            </p>
          </div>

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

            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" />
              {subscriber.email || "Not provided"}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Mobile Number
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Phone className="h-4 w-4 text-slate-400" />
              {subscriber.mobileNumber ||
                "Not provided"}
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Installation Address
            </p>

            <div className="mt-1 flex items-start gap-2 text-sm font-medium text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

              <span>
                {subscriber.installationAddress ||
                  "Not provided"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black text-slate-900">
              Account Status
            </h2>

            <p className="text-xs text-slate-500">
              Current subscriber account status
            </p>
          </div>
        </div>

        <div className="mt-5">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold capitalize text-blue-700">
            {subscriber.status
              .toLowerCase()
              .replaceAll("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}