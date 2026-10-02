import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Apply from "./pages/Apply";

import SubscriberLogin from "./pages/subscriber/SubscriberLogin";
import SubscriberDashboard from "./pages/subscriber/Dashboard";
import Account from "./pages/subscriber/Account";
import ForgotPassword from "./pages/subscriber/ForgotPassword";
import ResetPassword from "./pages/subscriber/ResetPassword";
import ChangePassword from "./pages/subscriber/ChangePassword";

import SubscriberLayout from "./components/subscriber/SubscriberLayout";

function SubscriberPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriberLayout>
      {children}
    </SubscriberLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />

        {/* Subscriber Authentication */}
        <Route
          path="/subscriber/login"
          element={<SubscriberLogin />}
        />
        <Route
  path="/subscriber/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/subscriber/reset-password"
  element={<ResetPassword />}
/>

<Route
  path="/subscriber/change-password"
  element={<ChangePassword />}
/>

        {/* Subscriber Portal */}
        <Route
          path="/subscriber"
          element={
            <Navigate
              to="/subscriber/dashboard"
              replace
            />
          }
        />

        <Route
          path="/subscriber/dashboard"
          element={
            <SubscriberPage>
              <SubscriberDashboard />
            </SubscriberPage>
          }
        />

        {/* Temporary placeholders */}
       <Route
          path="/subscriber/account"
          element={
            <SubscriberPage>
              <Account />
            </SubscriberPage>
          }
        />

        <Route
          path="/subscriber/plan"
          element={
            <SubscriberPage>
              <ComingSoon title="My Plan" />
            </SubscriberPage>
          }
        />

        <Route
          path="/subscriber/bills"
          element={
            <SubscriberPage>
              <ComingSoon title="Bills" />
            </SubscriberPage>
          }
        />

        <Route
          path="/subscriber/payments"
          element={
            <SubscriberPage>
              <ComingSoon title="Payments" />
            </SubscriberPage>
          }
        />

        <Route
          path="/subscriber/service"
          element={
            <SubscriberPage>
              <ComingSoon title="Service Status" />
            </SubscriberPage>
          }
        />

        <Route
          path="/subscriber/support"
          element={
            <SubscriberPage>
              <ComingSoon title="Support" />
            </SubscriberPage>
          }
        />

        <Route
          path="/subscriber/settings"
          element={
            <SubscriberPage>
              <ComingSoon title="Settings" />
            </SubscriberPage>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

function ComingSoon({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mx-auto max-w-7xl">

      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

        <h1 className="text-3xl font-black text-slate-900">
          {title}
        </h1>

        <p className="mt-3 text-slate-500">
          This subscriber portal section will be connected to
          your BayanNet billing system.
        </p>

      </div>

    </div>
  );
}

export default App;
