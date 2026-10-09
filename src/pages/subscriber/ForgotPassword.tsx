import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Send, ShieldCheck } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};



export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [branding, setBranding] = useState<CompanyBranding>({
  companyName: "",
  tradeName: null,
  logoUrl: null,
});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/subscriber-auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process your request.",
        );
      }

      setMessage(
        data.message ||
          "If the email is registered, password reset instructions have been sent.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process your request.",
      );
    } finally {
      setLoading(false);
    }
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
  

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left panel */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.25),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <div className="text-xl font-black tracking-tight text-white">
                    {branding.tradeName || branding.companyName}
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    {branding.tradeName ? "Subscriber Portal" : "Telecom Corporation"}
                  </div>
                </div>
              </Link>
            </div>

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Subscriber Portal
              </p>

              <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                Reset your password securely.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Enter the email address registered to your {branding.tradeName || branding.companyName} subscriber account and we'll send you instructions to create a new password.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} {branding.tradeName || branding.companyName} Telecom Corporation.
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <div className="font-black text-slate-900">
                    {branding.tradeName || branding.companyName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {branding.tradeName ? "Subscriber Portal" : "My Internet Service Provider"}
                  </div>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Mail className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Forgot Password?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your registered email address and we'll send
                  you a password reset link.
                </p>
              </div>

              {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>
                      <p className="font-bold text-emerald-800">
                        Request submitted
                      </p>

                      <p className="mt-1 text-sm leading-6 text-emerald-700">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Registered Email Address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />

                    {loading
                      ? "Sending..."
                      : "Send Reset Link"}
                  </button>
                </form>
              )}

              <div className="mt-7 border-t border-slate-100 pt-6">
                <Link
                  to="/subscriber/login"
                  className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Subscriber Login
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              For security, we do not disclose whether an email address
              is registered with BayanNet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}