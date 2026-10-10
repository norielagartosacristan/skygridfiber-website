import { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  Loader2,
  Printer,
  Receipt,
  X,
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


type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
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
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  
  const [branding, setBranding] = useState<CompanyBranding>({
    companyName: "My Internet Service Provider",
    tradeName: "MyCompany",
    logoUrl: null,
  });


  useEffect(() => {
    async function loadBills() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/subscriber-portal-auth/bills`,
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
                    onClick={() => setSelectedBill(bill)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                  >
                    View Bill
                    <FileText className="h-4 w-4" />
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBill && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 sm:p-6">
    <div className="mx-auto w-full max-w-3xl">
      {/* Modal Actions */}
      <div className="mb-3 flex justify-end gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Printer className="h-4 w-4" />
          Print Bill
        </button>

        <button
          type="button"
          onClick={() => setSelectedBill(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Close
        </button>
      </div>

      {/* Billing Statement */}
      <div
        id="billing-statement"
        className="rounded-2xl bg-white p-8 shadow-xl sm:p-10"
      >
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {branding.tradeName || branding.companyName}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {branding.companyName}
            </p>

            <p className="mt-3 text-xs text-slate-500">
              Billing Statement
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Invoice Number
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {selectedBill.invoiceNumber}
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusStyle(
                selectedBill.status,
              )}`}
            >
              {getStatusLabel(selectedBill.status)}
            </span>
          </div>
        </div>

        {/* Billing Information */}
        <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Billing Period
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {formatBillingPeriod(
                selectedBill.billingYear,
                selectedBill.billingMonth,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Billing Date
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {formatDate(selectedBill.billingDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Due Date
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {formatDate(selectedBill.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Service Status
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {selectedBill.service?.serviceStatus || "—"}
            </p>
          </div>
        </div>

        {/* Service Details */}
        <div className="py-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Service Details
          </h3>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="p-4">
                <p className="text-xs text-slate-500">
                  Internet Plan
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedBill.planName}
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-slate-500">
                  Download Speed
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  Up to {selectedBill.downloadMbps} Mbps
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-slate-500">
                  Upload Speed
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  Up to {selectedBill.uploadMbps} Mbps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="border-t border-slate-200 pt-6">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Billing Amount
              </span>

              <span className="font-medium text-slate-900">
                {formatCurrency(selectedBill.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Paid Amount
              </span>

              <span className="font-medium text-emerald-600">
                {formatCurrency(selectedBill.paidAmount)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  Remaining Balance
                </span>

                <span className="text-xl font-bold text-slate-900">
                  {formatCurrency(selectedBill.balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm font-medium text-slate-700">
            Thank you for choosing {branding.companyName}.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please settle your balance on or before the due date.
          </p>

          <p className="mt-4 text-[11px] text-slate-400">
            This is a computer-generated billing statement.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}