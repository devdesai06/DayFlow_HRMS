import { Users, UserCheck, CalendarX, DollarSign, Settings, FileCheck, BarChart2, CheckCircle, Shield } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-lg">
                Organization overview & daily operations
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value="128"
            hint="Active workforce"
            icon={<Users className="w-8 h-8" />}
          />
          <StatCard
            title="Present Today"
            value="112"
            hint="Attendance status"
            accent="success"
            icon={<UserCheck className="w-8 h-8" />}
          />
          <StatCard
            title="Pending Leaves"
            value="6"
            hint="Needs approval"
            accent="warning"
            icon={<CalendarX className="w-8 h-8" />}
          />
          <StatCard
            title="Monthly Payroll"
            value="₹18.4L"
            hint="Current cycle"
            accent="primary"
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        {/* Action Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-purple-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton label="Manage Employees" icon={<Users />} />
              <ActionButton label="Approve Leaves" icon={<FileCheck />} />
              <ActionButton label="View Attendance" icon={<UserCheck />} />
              <ActionButton label="Payroll Records" icon={<DollarSign />} />
            </div>
          </div>

          {/* System Insights */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-400" />
              System Insights
            </h3>
            <ul className="space-y-4">
              <InsightItem text="Attendance auto-tracking enabled" />
              <InsightItem text="Leave workflow active" />
              <InsightItem text="Payroll configured" />
              <InsightItem text="Role-based access enforced" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Reusable Components --- */

function StatCard({ title, value, hint, accent, icon }) {
  const accentStyles = {
    success: {
      bg: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30",
      icon: "text-green-400",
      value: "text-green-400"
    },
    warning: {
      bg: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/30",
      icon: "text-yellow-400",
      value: "text-yellow-400"
    },
    primary: {
      bg: "from-blue-500/20 to-purple-500/20",
      border: "border-blue-500/30",
      icon: "text-blue-400",
      value: "text-blue-400"
    }
  };

  const styles = accent ? accentStyles[accent] : {
    bg: "from-gray-700/20 to-gray-600/20",
    border: "border-gray-600/30",
    icon: "text-gray-400",
    value: "text-gray-300"
  };

  return (
    <div className={`bg-gradient-to-br ${styles.bg} backdrop-blur-xl rounded-2xl shadow-xl border ${styles.border} p-6 transform hover:scale-105 transition duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        <div className={styles.icon}>
          {icon}
        </div>
      </div>
      <h2 className={`text-3xl font-bold ${styles.value} mb-2`}>{value}</h2>
      <p className="text-gray-400 text-sm">{hint}</p>
    </div>
  );
}

function ActionButton({ label, icon }) {
  return (
    <button className="group relative bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-xl p-4 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="text-purple-400 group-hover:text-purple-300 transition duration-300">
          {icon}
        </div>
        <span className="text-white font-medium text-sm">{label}</span>
      </div>
    </button>
  );
}

function InsightItem({ text }) {
  return (
    <li className="flex items-start gap-3 text-gray-300">
      <span className="text-blue-400 mt-0.5 flex-shrink-0">
        <CheckCircle className="w-5 h-5" />
      </span>
      <span>{text}</span>
    </li>
  );
}