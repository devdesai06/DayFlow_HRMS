import { ROLES } from "../../constants/roles.js";
import { useAuthStore } from "../auth/authStore.js";
import { AdminDash } from "./AdminDash.jsx";
import { HRDash } from "./HRDash.jsx";
import { EmployeeDash } from "./EmployeeDash.jsx";

export function DashboardRouter() {
  const role = useAuthStore((s) => s.user?.role);

  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) return <AdminDash />;
  if (role === ROLES.HR) return <HRDash />;
  return <EmployeeDash />;
}

