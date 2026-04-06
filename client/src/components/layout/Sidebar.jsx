import { NavLink } from "react-router-dom";
import {
  Bell,
  Building2,
  CalendarCheck2,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "../../utils/cn.js";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "../../features/auth/authStore.js";

const items = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.EMPLOYEES, label: "Employees", icon: Users },
  { to: ROUTES.ATTENDANCE, label: "Attendance", icon: CalendarCheck2 },
  { to: ROUTES.PAYROLL, label: "Payroll", icon: FileText },
  { to: ROUTES.LEAVES, label: "Leaves", icon: Building2 },
  { to: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Bell },
  { to: ROUTES.AUDIT_LOGS, label: "Audit Logs", icon: Shield },
  { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

export function Sidebar({ mobileOpen, onClose }) {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-6 bg-navy text-white px-4 py-5 transition-transform duration-300 md:static md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo/20 border border-white/10 grid place-items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo" />
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight">
                  {import.meta.env.VITE_APP_NAME || "Dayflow"}
                </div>
                <div className="text-xs text-white/60 font-mono">
                  {user?.role || "GUEST"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2">
          <ul className="flex flex-col gap-1.5">
            {items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition-premium",
                      "hover:text-white hover:bg-white/8",
                      isActive ? "bg-white/10 text-white" : ""
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo transition-premium",
                          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                        )}
                      />
                      <it.icon className="h-4.5 w-4.5" />
                      <span className="transition-premium group-hover:translate-x-0.5">
                        {it.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-white/70">
              Signed in as
            </div>
            <div className="mt-1 text-sm font-semibold truncate">
              {user?.email || "—"}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" 
          onClick={onClose} 
        />
      )}
    </>
  );
}

