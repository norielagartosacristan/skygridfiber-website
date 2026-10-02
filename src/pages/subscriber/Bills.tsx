import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Loader2,
  Receipt,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

type Bill = {
  id: string;
  invoiceNumber: string;
  billingYear: number;
  billingMonth: number;
  billingDate: string;
  dueDate: string;
  planName: string;
  downloadMbps: number;
  uploadMbps: number;
  amount: number;
  status: string;
  paidAmount: number;
  balance: number;
  service?: {
    id: string;
    billingType: string;
    serviceStatus: string;
  };
};

type BillsResponse = {
  success: boolean;
  data: Bill[];
  message?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBillingPeriod(
  year: number,
  month: number,
) {
  const date = new Date(
    year,
    month - 1,
    1,
  );

  return date.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "OVERDUE":
      return "bg-red-50 text-red-700 ring-red-200";

    case "PARTIALLY_PAID":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "UNPAID":
    default:
      return "bg-orange-50 text-orange-700 ring-orange-200";
  }
}

function getStatusLabel(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBills() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/subscriber-auth/bills`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data: BillsResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load your bills.",
          );
        }

        setBills(data.data || []);
      } catch (error) {
        console.error(
          "Load subscriber bills error:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your bills.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadBills();
  }, []);

  const totalOutstanding = bills.reduce(
    (total, bill) =>
      total + Number(bill.balance || 0),
    0,
  );

  const unpaidBills = bills.filter(
    (bill) =>
      Number(bill.balance || 0) > 0,
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Bills
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your billing statements, payments,
          and outstanding balances.
        </p>
      </div>

      {/* Summary */}
      {!loading && !error && bills.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                <CircleDollarSign className="h-5 w-5 text-orange-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Outstanding Balance
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(
                    totalOutstanding,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Unpaid Bills
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {unpaidBills}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your bills...
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        bills.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No bills yet
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Your billing statements will appear
              here once a bill has been generated
              for your account.
            </p>
          </div>
        )}

      {/* Bills */}
      {!loading &&
        !error &&
        bills.length > 0 && (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Main */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <FileText className="h-6 w-6 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-900">
                          {bill.invoiceNumber}
                        </h2>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusStyle(
                            bill.status,
                          )}`}
                        >
                          {getStatusLabel(
                            bill.status,
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatBillingPeriod(
                          bill.billingYear,
                          bill.billingMonth,
                        )}
                      </p>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {bill.planName}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:min-w-[430px]">
                    <div>
                      <p className="text-xs text-slate-500">
                        Amount
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatCurrency(
                          bill.amount,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Balance
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatCurrency(
                          bill.balance,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Due Date
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-700">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(
                          bill.dueDate,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      disabled
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400 sm:w-auto"
                      title="PDF feature coming next"
                    >
                      View Bill
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}