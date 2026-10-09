import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  User,
  Wifi,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

type Plan = {
  id: string;
  planCode: string;
  planName: string;
  downloadMbps: number;
  uploadMbps: number;
  monthlyPrice: string;
  billingType: "POSTPAID" | "PREPAID" | "FREE";
  validityDays: number | null;
};

type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Apply() {
  const [searchParams] = useSearchParams();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");

  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    birthDate: "",
    address: "",
    barangay: "",
    municipality: "",
    province: "",
    postalCode: "",
    installationNotes: "",
    validId: null as File | null,
    agree: false,
  });

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
    async function fetchPlans() {
      try {
        setPlansLoading(true);
        setPlansError("");

        const response = await fetch(`${API_URL}/api/plans`);

        const result: {
          success: boolean;
          data: Plan[];
        } = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Unable to load internet plans.");
        }

        const publicPlans = result.data.filter(
          (plan) => plan.billingType !== "FREE",
        );

        setPlans(publicPlans);

        /*
         * Preserve the existing ?plan= links from the website.
         *
         * Examples:
         * /apply?plan=prepaid
         * /apply?plan=50mbps
         * /apply?plan=100mbps
         */
        const planParam = searchParams.get("plan");

        let matchedPlan: Plan | undefined;

        if (planParam === "50mbps") {
          matchedPlan = result.data.find(
            (plan) =>
              plan.downloadMbps === 50 &&
              Number(plan.monthlyPrice) === 999 &&
              plan.billingType === "POSTPAID",
          );
        }

        if (planParam === "100mbps") {
          matchedPlan = result.data.find(
            (plan) =>
              plan.downloadMbps === 100 &&
              Number(plan.monthlyPrice) === 1299 &&
              plan.billingType === "POSTPAID",
          );
        }

        if (planParam === "prepaid") {
          matchedPlan = result.data.find(
            (plan) =>
              plan.billingType === "PREPAID" &&
              plan.downloadMbps === 35,
          );
        }

        setSelectedPlanId(
          matchedPlan?.id ?? result.data[0]?.id ?? "",
        );
      } catch (error) {
        console.error("Error fetching plans:", error);

        setPlansError(
          error instanceof Error
            ? error.message
            : "Unable to load internet plans.",
        );
      } finally {
        setPlansLoading(false);
      }
    }

    fetchPlans();
  }, [searchParams]);

  const updateField = (
    field: keyof typeof form,
    value: string | boolean | File | null,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const selectedPlan = plans.find(
    (plan) => plan.id === selectedPlanId,
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedPlanId) {
      setSubmitError("Please select an internet plan.");
      return;
    }

    if (!form.validId) {
      setSubmitError("Please upload a valid ID.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const installationAddress = [
        form.address,
        form.barangay,
        form.municipality,
        form.province,
        form.postalCode,
      ]
        .filter((value) => value.trim())
        .join(", ");

      const formData = new FormData();

      formData.append("firstName", form.firstName.trim());
      formData.append("middleName", form.middleName.trim());
      formData.append("lastName", form.lastName.trim());
      formData.append("email", form.email.trim());
      formData.append("mobileNumber", form.mobile.trim());
      formData.append("birthDate", form.birthDate);
      formData.append(
        "installationAddress",
        installationAddress,
      );
      formData.append(
        "installationNotes",
        form.installationNotes.trim(),
      );
      formData.append("planId", selectedPlanId);
      formData.append("validId", form.validId);

      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result: {
        success: boolean;
        message: string;
        data?: {
          applicationNumber: string;
          status: string;
          plan: {
            planCode: string;
            planName: string;
          };
        };
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to submit application.",
        );
      }

      setApplicationNumber(
        result.data?.applicationNumber ?? "",
      );

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error submitting application:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={42}
                className="text-green-600"
              />
            </div>

            <h1 className="mt-7 text-3xl font-black text-slate-900">
              Application Received!
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">
              Thank you for choosing {branding.companyName}.
              Your internet application has been received and will be
              reviewed by our team.
            </p>

            <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
              <div className="text-sm text-slate-500">
                Selected Plan
              </div>

              <div className="mt-1 text-lg font-bold text-slate-900">
                {selectedPlan?.planName ?? "Selected Plan"}
              </div>

              <div className="mt-1 text-sm text-blue-600">
                            {selectedPlan
              ? `Up to ${selectedPlan.downloadMbps} Mbps · ₱${Number(
                  selectedPlan.monthlyPrice,
                ).toLocaleString("en-PH")}`
              : ""}
              </div>
            </div>

            {applicationNumber && (
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-left">
                  <div className="text-sm font-semibold text-blue-700">
                    Application Number
                  </div>

                  <div className="mt-1 text-xl font-black tracking-wide text-blue-900">
                    {applicationNumber}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-blue-700">
                    Please keep this application number for your records.
                  </p>
                </div>
              )}

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
           <div className="flex h-11 w-11 items-center justify-center">
              <img
                src="/new-logo.png"
                alt="BayanNet"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <div className="text-xl font-black text-slate-900">
                {branding.tradeName || branding.companyName}
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {branding.tradeName ? "Subscriber Portal" : "My Account"}
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Website
          </Link>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-slate-950 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Internet Application
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Get Connected with {branding.tradeName || branding.companyName}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Fill out the application form below and our team will
            contact you regarding your internet installation.
          </p>
        </div>
      </section>

      {/* Form */}
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <form onSubmit={handleSubmit}>
          {/* Selected Plan */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Wifi size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Choose Your Plan
                </h2>

                <p className="text-sm text-slate-500">
                  Select the internet plan you want to apply for.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {plansLoading ? (
                  <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500 md:col-span-3">
                    Loading available plans...
                  </div>
                ) : plansError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 md:col-span-3">
                    {plansError}
                  </div>
                ) : (
                  plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        selectedPlanId === plan.id
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-500">
                          {plan.planName}
                        </span>

                        {selectedPlanId === plan.id && (
                          <CheckCircle2
                            size={20}
                            className="text-blue-600"
                          />
                        )}
                      </div>

                      <div className="mt-3 text-2xl font-black text-slate-900">
                        ₱{Number(plan.monthlyPrice).toLocaleString("en-PH")}
                      </div>

                      <div className="mt-1 text-sm font-semibold text-blue-600">
                        Up to {plan.downloadMbps} Mbps
                      </div>

                      <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                        {plan.billingType}
                      </div>
                    </button>
                  ))
                )}
            </div>
          </section>

          {/* Personal Information */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500">
                  Please provide your complete name and basic information.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <Input
                label="First Name"
                required
                value={form.firstName}
                onChange={(value) =>
                  updateField("firstName", value)
                }
              />

              <Input
                label="Middle Name"
                value={form.middleName}
                onChange={(value) =>
                  updateField("middleName", value)
                }
              />

              <Input
                label="Last Name"
                required
                value={form.lastName}
                onChange={(value) =>
                  updateField("lastName", value)
                }
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={form.email}
                onChange={(value) =>
                  updateField("email", value)
                }
              />

              <Input
                label="Mobile Number"
                type="tel"
                required
                value={form.mobile}
                onChange={(value) =>
                  updateField("mobile", value)
                }
              />

              <Input
                label="Birth Date"
                type="date"
                value={form.birthDate}
                onChange={(value) =>
                  updateField("birthDate", value)
                }
              />
            </div>
          </section>

          {/* Address */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Installation Address
                </h2>

                <p className="text-sm text-slate-500">
                  Where would you like {branding.tradeName || branding.companyName} to be installed?
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="House No. / Street / Sitio"
                  required
                  value={form.address}
                  onChange={(value) =>
                    updateField("address", value)
                  }
                />
              </div>

              <Input
                label="Barangay"
                required
                value={form.barangay}
                onChange={(value) =>
                  updateField("barangay", value)
                }
              />

              <Input
                label="Municipality / City"
                required
                value={form.municipality}
                onChange={(value) =>
                  updateField("municipality", value)
                }
              />

              <Input
                label="Province"
                required
                value={form.province}
                onChange={(value) =>
                  updateField("province", value)
                }
              />

              <Input
                label="Postal Code"
                value={form.postalCode}
                onChange={(value) =>
                  updateField("postalCode", value)
                }
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Installation Notes
                </label>

                <textarea
                  rows={4}
                  value={form.installationNotes}
                  onChange={(event) =>
                    updateField(
                      "installationNotes",
                      event.target.value,
                    )
                  }
                  placeholder="Landmark, preferred installation location, or other information..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Valid ID
                </h2>

                <p className="text-sm text-slate-500">
                  Upload a valid government-issued ID.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
                <FileText size={32} className="text-blue-600" />

                <span className="mt-4 font-bold text-slate-800">
                  Click to upload your ID
                </span>

                <span className="mt-1 text-sm text-slate-500">
                  JPG, PNG or PDF
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  required
                  onChange={(event) =>
                    updateField(
                      "validId",
                      event.target.files?.[0] ?? null,
                    )
                  }
                />
              </label>

              {form.validId && (
                <p className="mt-3 text-sm font-semibold text-green-600">
                  Selected: {form.validId.name}
                </p>
              )}
            </div>
          </section>

          {/* Terms */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                required
                checked={form.agree}
                onChange={(event) =>
                  updateField("agree", event.target.checked)
                }
                className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600"
              />

              <span className="text-sm leading-6 text-slate-600">
                I certify that the information I provided is true and
                correct. I agree to {branding.tradeName || branding.companyName}'s
                application requirements, terms and conditions, and
                privacy policy.
              </span>
            </label>
          </section>

          {submitError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Phone size={18} />
              Our team may contact you to verify your application.
            </div>

           <button
            type="submit"
            disabled={submitting || plansLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Submitting Application..." : "Submit Application"}

            {!submitting && <CheckCircle2 size={19} />}
          </button>
          </div>
        </form>
      </main>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
};

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}