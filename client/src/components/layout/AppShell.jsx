import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex relative">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 min-w-0 w-full">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="mx-auto max-w-6xl px-4 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

