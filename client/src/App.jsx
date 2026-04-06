import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ROUTES } from "./constants/routes.js";
import { AppShell } from "./components/layout/AppShell.jsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { useAuthStore } from "./features/auth/authStore.js";

import { Login } from "./features/auth/Login.jsx";
import { Register } from "./features/auth/Register.jsx";
import { ForgotPassword } from "./features/auth/ForgotPassword.jsx";
import { ResetPassword } from "./features/auth/ResetPassword.jsx";
import { VerifyEmail } from "./features/auth/VerifyEmail.jsx";

import { DashboardRouter } from "./features/dashboard/DashboardRouter.jsx";
import { EmployeeList } from "./features/employees/List.jsx";
import { EmployeeProfile } from "./features/employees/Profile.jsx";
import { AttendanceSummary } from "./features/attendance/Summary.jsx";
import { PayrollOverview } from "./features/payroll/Overview.jsx";
import { LeaveBalance } from "./features/leaves/Balance.jsx";
import { NotificationsPanel } from "./features/notifications/Panel.jsx";
import { SettingsPage } from "./pages/Settings.jsx";
import { AuditLogsPage } from "./pages/AuditLogs.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      gcTime: 300_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white border border-slate-200 shadow-card rounded-2xl",
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.APP} element={<AppShell />}>
            <Route
              path={ROUTES.DASHBOARD.replace("/app/", "")}
              element={<DashboardRouter />}
            />
            <Route
              path={ROUTES.EMPLOYEES.replace("/app/", "")}
              element={<EmployeeList />}
            />
            <Route path="employees/:id/*" element={<EmployeeProfile />} />
            <Route
              path={ROUTES.ATTENDANCE.replace("/app/", "")}
              element={<AttendanceSummary />}
            />
            <Route
              path={ROUTES.PAYROLL.replace("/app/", "")}
              element={<PayrollOverview />}
            />
            <Route
              path={ROUTES.LEAVES.replace("/app/", "")}
              element={<LeaveBalance />}
            />
            <Route
              path={ROUTES.NOTIFICATIONS.replace("/app/", "")}
              element={<NotificationsPanel />}
            />
            <Route
              path={ROUTES.SETTINGS.replace("/app/", "")}
              element={<SettingsPage />}
            />
            <Route
              path={ROUTES.AUDIT_LOGS.replace("/app/", "")}
              element={<AuditLogsPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

