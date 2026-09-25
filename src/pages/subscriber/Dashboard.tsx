import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Gauge,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">

      {/* Welcome */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Subscriber Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
          Good evening, Juan! 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here is the latest information about your BayanNet account.
        </p>
      </div>

      {/* Service Card */}
      <section className="overflow-hidden rounded-3xl bg-slate-950 shadow-xl">

        <div className="relative p-6 sm:p-8">

          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">

              <div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Wifi size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Internet Service
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      BayanNet 50
                    </h2>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-400" />

                  <span className="text-sm font-bold text-green-400">
                    ACTIVE
                  </span>
                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs text-slate-400">
                  Account Number
                </p>

                <p className="mt-1 font-bold text-white">
                  BN-000123
                </p>
              </div>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-400">
                  Speed
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  Up to 50 Mbps
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-400">
                  Monthly Rate
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  ₱999
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-400">
                  Billing Type
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  Postpaid
                </p>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Stats */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Current Bill"
          value="₱999"
          subtitle="Due October 10, 2026"
          icon={FileText}
          href="/subscriber/bills"
        />

        <StatCard
          title="Last Payment"
          value="₱999"
          subtitle="September 5, 2026"
          icon={CreditCard}
          href="/subscriber/payments"
        />

        <StatCard
          title="Service Status"
          value="Active"
          subtitle="Internet connected"
          icon={CheckCircle2}
          href="/subscriber/service"
        />

        <StatCard
          title="Plan Speed"
          value="50 Mbps"
          subtitle="BayanNet 50"
          icon={Gauge}
          href="/subscriber/plan"
        />

      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Billing */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-black text-slate-900">
                Billing Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your current billing details
              </p>
            </div>

            <FileText
              size={22}
              className="text-blue-600"
            />

          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Current Balance
              </span>

              <span className="text-2xl font-black text-slate-900">
                ₱999
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-orange-600">
              <CalendarDays size={16} />
              Due October 10, 2026
            </div>

          </div>

          <Link
            to="/subscriber/bills"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View bills
            <ArrowRight size={16} />
          </Link>

        </section>

        {/* Quick Actions */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-black text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account quickly
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            <QuickAction
              icon={CreditCard}
              title="View Payments"
              description="Check payment history"
              href="/subscriber/payments"
            />

            <QuickAction
              icon={FileText}
              title="View Bills"
              description="Check your invoices"
              href="/subscriber/bills"
            />

            <QuickAction
              icon={Wifi}
              title="Service Status"
              description="Check your connection"
              href="/subscriber/service"
            />

            <QuickAction
              icon={Gauge}
              title="My Plan"
              description="View your internet plan"
              href="/subscriber/plan"
            />

          </div>

        </section>

      </div>

    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  href: string;
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
}: StatCardProps) {
  return (
    <Link
      to={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={19} />
        </div>

      </div>

    </Link>
  );
}

type QuickActionProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
};

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: QuickActionProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-sm font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

    </Link>
  );
}
