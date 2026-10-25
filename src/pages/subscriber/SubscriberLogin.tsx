import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  UserRound,
  Wifi,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || '';

type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};


export default function SubscriberLogin() {
  const navigate = useNavigate()

  const [email, setAccountNumber] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

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
  

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')

    const account = email.trim()

    if (!account || !password) {
      setError(
        'Please enter your email address and password.',
      )
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/subscriber-portal-auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: account,
            password,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            'Unable to sign in.',
        )
      }

      if (data.mustChangePassword) {
        navigate(
          '/subscriber/change-password',
          {
            replace: true,
            state: {
              firstLogin: true,
            },
          },
        )

        return
      }

      navigate(
        '/subscriber/dashboard',
        {
          replace: true,
        },
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
       
{/* Left side - Background Image */}
<div
  className="relative hidden overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat lg:flex"
  style={{
    backgroundImage: "url('/login-left.jpg')",
  }}
>
  {/* Dark overlay para readable ang text */}
  <div className="absolute inset-0 bg-slate-950/55" />

  <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-16">
    <Link
      to="/"
      className="inline-flex w-fit items-center gap-3"
    >
      
<div className="flex h-11 w-11 items-center justify-center">
  <img
    src="/logo.jpg"
    alt="Company Logo"
    className="h-full w-full rounded-xl object-contain"
  />
</div>


      <div>
        <div className="text-xl font-normal tracking-tight text-white">
          {branding.tradeName || branding.companyName}
        </div>

        <div className="text-xs font-normal text-slate-300">
          {branding.tradeName
            ? "Subscriber Portal"
            : "My Internet Service Provider"}
        </div>
      </div>
    </Link>

    <div className="max-w-xl">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-normal text-blue-200">
        <LockKeyhole size={16} />
        Secure Subscriber Portal
      </div>

      <h1 className="text-4xl font-normal leading-tight tracking-tight text-white xl:text-5xl">
        Manage your
        <span className="block text-blue-300">
          {branding.tradeName || branding.companyName} account.
        </span>
      </h1>

      <p className="mt-6 max-w-lg text-base font-normal leading-7 text-slate-200">
        View your internet plan, billing information, payment
        history, and service status from one secure portal.
      </p>
    </div>

    <div className="text-sm font-normal text-slate-300">
      © {new Date().getFullYear()}{" "}
      {branding.tradeName || branding.companyName}. All rights reserved.
    </div>
  </div>
</div>

        {/* Login */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Wifi size={23} />
                </div>

                <div>
                  <div className="text-xl font-black tracking-tight text-slate-900">
                    {branding.tradeName || branding.companyName}
                  </div>

                  <div className="text-xs font-medium text-slate-500">
                    {branding.tradeName ? "Subscriber Portal" : "My Internet Service Provider"}
                  </div>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <LogIn size={23} />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Subscriber Login
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in using your {branding.tradeName || branding.companyName} account
                  number and password.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Account number */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="text"
                      autoComplete="username"
                      value={email}
                      onChange={(event) =>
                        setAccountNumber(
                          event.target.value,
                        )
                      }
                      placeholder="you@example.com"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      placeholder="Enter your password"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value,
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/subscriber/forgot-password"
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have a {branding.tradeName || branding.companyName} account?
                </p>

                <Link
                  to="/apply"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Apply for internet service
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
              >
                ← Back to {branding.tradeName || branding.companyName} website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}