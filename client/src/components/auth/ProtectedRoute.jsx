import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "../../features/auth/authStore.js";

export function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  if (status !== "ready") return null;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;

  if (Array.isArray(allowedRoles) && allowedRoles.length) {
    if (!allowedRoles.includes(user.role)) {
      toast.error("You don’t have access to that page.");
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return <Outlet />;
}

