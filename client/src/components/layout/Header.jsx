import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { useAuthStore } from "../../features/auth/authStore.js";

export function Header({ onMenuClick }) {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-slate-900">
              Dayflow
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {user?.email || "—"}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={clear}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

