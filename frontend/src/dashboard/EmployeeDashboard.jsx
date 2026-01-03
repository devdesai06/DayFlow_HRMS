import {
  CheckCircle,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  BarChart3,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ActionButton({ label, icon, to, disabled = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled && to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group rounded-xl p-4 transition
        border border-gray-600
        ${
          disabled
            ? "bg-gray-700/40 cursor-not-allowed opacity-50"
            : "bg-gray-700/50 hover:bg-gray-700 hover:-translate-y-1 hover:shadow-lg"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-400">{icon}</div>
        <span className="text-white font-medium">{label}</span>
      </div>
    </button>
  );
}

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Your attendance, leaves, and payroll overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Status"
            value="Present"
            accent="success"
            hint="Checked in"
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatCard
            title="Leaves Used"
            value="6 / 12"
            accent="warning"
            hint="This year"
            icon={<Calendar className="w-8 h-8" />}
          />
          <StatCard
            title="Payroll Status"
            value="Credited"
            accent="primary"
            hint="Current month"
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              label="Check In / Out"
              icon={<Clock />}
              to="/employee/attendance"
            />

            <ActionButton
              label="Apply Leave"
              icon={<Calendar />}
              to="/employee/leaves"
            />

            <ActionButton
              label="View Attendance"
              icon={<CheckCircle />}
              to="/employee/attendance"
            />

            <ActionButton label="View Payroll" icon={<FileText />} disabled />
          </div>
        </div>

        {/* System Notes */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/30 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-purple-400" />
            System Notes
          </h3>
          <ul className="space-y-3">
            <InfoItem text="Attendance auto-tracked daily" />
            <InfoItem text="Leave requests go through HR approval" />
            <InfoItem text="Payroll generated monthly" />
          </ul>
        </div>
      </div>
    </div>
  );
}

/* --- Reusable Components --- */

function StatCard({ title, value, hint, accent, icon }) {
  const accentColors = {
    success: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    warning: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
    primary: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
  };

  const iconColors = {
    success: "text-green-400",
    warning: "text-yellow-400",
    primary: "text-blue-400",
  };

  const valueColors = {
    success: "text-green-400",
    warning: "text-yellow-400",
    primary: "text-blue-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${accentColors[accent]} backdrop-blur-xl rounded-2xl shadow-xl border p-6 transform hover:scale-105 transition duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        <div className={iconColors[accent]}>{icon}</div>
      </div>
      <h2 className={`text-4xl font-bold ${valueColors[accent]} mb-2`}>
        {value}
      </h2>
      <p className="text-gray-400 text-sm">{hint}</p>
    </div>
  );
}

function InfoItem({ text }) {
  return (
    <li className="flex items-start gap-3 text-gray-300">
      <span className="text-purple-400 mt-0.5 flex-shrink-0">
        <CheckCircle className="w-5 h-5" />
      </span>
      <span>{text}</span>
    </li>
  );
}
