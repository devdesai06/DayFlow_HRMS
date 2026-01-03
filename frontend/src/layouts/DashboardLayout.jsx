import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "open" : "collapsed"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
