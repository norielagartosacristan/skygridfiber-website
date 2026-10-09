
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || '';

type LocationState = {
  firstLogin?: boolean;
};

type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};


export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  
const [branding, setBranding] = useState<CompanyBranding>({
  companyName: "",
  tradeName: null,
  logoUrl: null,
});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Current password, new password and confirmation are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/subscriber-auth/change-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        setError(
          "Your subscriber session has expired. Please log in again.",
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to change your password.",
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  function goToDashboard() {
    navigate("/subscriber/dashboard", {
      replace: true,
    });
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
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <div className="text-xl font-black text-white">
                  {branding.tradeName || branding.companyName}
                </div>

                <div className="text-xs font-medium text-slate-400">
                  Subscriber Portal
                </div>
              </div>
            </Link>

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Account Security
              </p>

              <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                Secure your subscriber account.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                For your security, please create a new password before
                continuing to your {branding.tradeName || branding.companyName} subscriber dashboard.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} {branding.companyName}.
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
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
                    Subscriber Portal
                  </div>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
              {success ? (
                <>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Password Changed
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your subscriber portal password has been changed
                    successfully.
                  </p>

                  <button
                    type="button"
                    onClick={goToDashboard}
                    className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    Continue to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <LockKeyhole className="h-7 w-7" />
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Change Password
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {state?.firstLogin
                        ? "For your security, please change your temporary password before accessing your account."
                        : "Enter your current password and choose a new password."}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700">
                      {error}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Current password */}
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="mb-2 block text-sm font-bold text-slate-700"
                      >
                        Current Password
                      </label>

                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="currentPassword"
                          type={
                            showCurrentPassword
                              ? "text"
                              : "password"
                          }
                          value={currentPassword}
                          onChange={(event) =>
                            setCurrentPassword(event.target.value)
                          }
                          placeholder="Enter current password"
                          autoComplete="current-password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(
                              (value) => !value,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New password */}
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="mb-2 block text-sm font-bold text-slate-700"
                      >
                        New Password
                      </label>

                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="newPassword"
                          type={
                            showNewPassword
                              ? "text"
                              : "password"
                          }
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowNewPassword(
                              (value) => !value,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Use at least 8 characters.
                      </p>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-bold text-slate-700"
                      >
                        Confirm New Password
                      </label>

                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          id="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (value) => !value,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Changing Password..."
                        : "Change Password"}
                    </button>
                  </form>

                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <Link
                      to="/subscriber/login"
                      className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Subscriber Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}