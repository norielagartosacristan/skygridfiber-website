import {
  Bell,
  CreditCard,
  FileText,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Wifi,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

type SubscriberLayoutProps = {
  children: ReactNode;
};

type Subscriber = {
  id: string;
  accountNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  status?: string;
};

type PortalAccount = {
  subscriberId: string;
  accountNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  status: string;
};

type MeResponse = {
  success: boolean;
  email: string;
  mustChangePassword: boolean;
  accounts: PortalAccount[];
  selectedSubscriberId: string | null;
  subscriber: Subscriber | null;
};
type CompanyBranding = {
  companyName: string;
  tradeName: string | null;
  logoUrl: string | null;
};



const API_URL = import.meta.env.VITE_API_URL || "";

const navigation = [
  {
    name: "Dashboard",
    path: "/subscriber/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Account",
    path: "/subscriber/account",
    icon: User,
  },
  {
    name: "My Plan",
    path: "/subscriber/plan",
    icon: Wifi,
  },
  {
    name: "Bills",
    path: "/subscriber/bills",
    icon: FileText,
  },
  {
    name: "Payments",
    path: "/subscriber/payments",
    icon: CreditCard,
  },
  {
    name: "Support",
    path: "/subscriber/support",
    icon: Headphones,
  },
  {
    name: "Settings",
    path: "/subscriber/settings",
    icon: Settings,
  },
];


export default function SubscriberLayout({
  children,
}: SubscriberLayoutProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/subscriber-portal-auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Portal logout request failed:", error);
    } finally {
      navigate("/subscriber/login", { replace: true });
    }
  };

  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [accounts, setAccounts] = useState<PortalAccount[]>([]);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string | null>(null);
  const [switchingAccount, setSwitchingAccount] = useState(false);
  const [switchError, setSwitchError] = useState("");


useEffect(() => {
  async function loadSubscriber() {
    try {
      const response = await fetch(
        `${API_URL}/api/subscriber-portal-auth/me`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        return;
      }

      const data: MeResponse =
        await response.json();

      if (data.success) {
        setSubscriber(data.subscriber ?? null);
        setAccounts(data.accounts ?? []);
        setSelectedSubscriberId(data.selectedSubscriberId ?? null);
      }
    } catch (error) {
      console.error(
        "Failed to load subscriber profile:",
        error,
      );
    }
  }

  loadSubscriber();
}, []);

const handleAccountChange = async (subscriberId: string) => {
    if (!subscriberId || subscriberId === selectedSubscriberId || switchingAccount) {
      return;
    }

    setSwitchingAccount(true);
    setSwitchError("");

    try {
      const response = await fetch(
        `${API_URL}/api/subscriber-portal-auth/select-account`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriberId }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to switch subscriber account.");
      }

      setSelectedSubscriberId(data.selectedSubscriberId ?? subscriberId);
      window.location.reload();
    } catch (error) {
      setSwitchError(
        error instanceof Error ? error.message : "Unable to switch account.",
      );
    } finally {
      setSwitchingAccount(false);
    }
  };

  const fullName = subscriber
  ? [
      subscriber.firstName,
      subscriber.middleName,
      subscriber.lastName,
    ]
      .filter(Boolean)
      .join(" ")
  : "Subscriber";

const initials = subscriber
  ? `${subscriber.firstName?.charAt(0) || ""}${subscriber.lastName?.charAt(0) || ""}`.toUpperCase()
  : "S";

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

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">

          <Link
            to="/subscriber/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Wifi size={22} />
            </div>

            <div>
              <div className="text-lg font-black text-slate-900">
                {branding.tradeName || branding.companyName}
              </div>

              <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Subscriber Portal
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 lg:hidden"
          >
            <X size={21} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            My Account
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}

          </div>

        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* Main */}
      <div className="lg:pl-72">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-bold text-slate-900">
              Subscriber Portal
            </p>

            <p className="text-xs text-slate-500">
              Manage your {branding.tradeName || branding.companyName} account
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">            {accounts.length > 1 && (
              <div className="flex min-w-0 flex-col gap-1">
                <label htmlFor="subscriber-account-selector" className="sr-only">
                  Select subscriber account
                </label>
                <select
                  id="subscriber-account-selector"
                  value={selectedSubscriberId ?? ""}
                  disabled={switchingAccount}
                  onChange={(event) => void handleAccountChange(event.target.value)}
                  className="max-w-[190px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 disabled:opacity-60 sm:max-w-[260px]"
                >
                  <option value="" disabled>Select account</option>
                  {accounts.map((account) => (
                    <option key={account.subscriberId} value={account.subscriberId}>
                      {account.accountNumber} — {account.firstName} {account.lastName}
                    </option>
                  ))}
                </select>
                {switchError && (
                  <span role="alert" className="max-w-[190px] text-xs text-red-600 sm:max-w-[260px]">
                    {switchError}
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-600">
              {initials}
            </div>

            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900">
                {fullName}
              </div>

              <div className="text-xs text-slate-500">
                Subscriber
              </div>
            </div>

          </div>

          </div>

        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
