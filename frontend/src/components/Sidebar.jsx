import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Dayflow</h3>

      <nav className="sidebar-nav">
        {/* Employee links */}
        <Link to="/employee" className="sidebar-link">
          Dashboard
        </Link>
        <Link to="/employee/profile" className="sidebar-link">
          Profile
        </Link>
        <Link to="/employee/attendance" className="sidebar-link">
          Attendance
        </Link>
        <Link to="/employee/leaves" className="sidebar-link">
          Leaves
        </Link>
        <Link to="/employee/payroll" className="sidebar-link">
          Payroll
        </Link>

        {/* Admin links */}
        {user?.role === "ADMIN" && (
          <>
            <hr className="sidebar-divider" />
            <Link to="/admin/employees" className="sidebar-link">
              Employees
            </Link>
            <Link to="/admin/attendance" className="sidebar-link">
              Attendance
            </Link>
            <Link to="/admin/leaves" className="sidebar-link">
              Leave Approvals
            </Link>
            <Link to="/admin/payroll" className="sidebar-link">
              Payroll
            </Link>
          </>
        )}

        <hr className="sidebar-divider" />
        <button className="sidebar-logout" onClick={logout}>
          Logout
        </button>
      </nav>
    </aside>
  );
}
