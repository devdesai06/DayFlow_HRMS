import { useEffect, useState } from "react";
import {
  checkInService,
  checkOutService,
  fetchMyAttendance,
} from "../../services/attendance.service";
import {
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      const data = await fetchMyAttendance();
      setAttendance(data);
    } catch {
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const today = attendance[0]; // latest record (API returns DESC)

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await checkInService();
      await loadAttendance();
    } catch {
      alert("Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await checkOutService();
      await loadAttendance();
    } catch {
      alert("Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  const formatTime = (time) => time || "-";

  const statusBadge = (status) => {
    switch (status) {
      case "PRESENT":
        return badge("Present", "green", <CheckCircle />);
      case "ABSENT":
        return badge("Absent", "red", <XCircle />);
      case "HALF_DAY":
        return badge("Half Day", "yellow", <Clock />);
      case "LEAVE":
        return badge("Leave", "blue", <Calendar />);
      default:
        return badge("Unknown", "gray", <Clock />);
    }
  };

  const badge = (label, color, icon) => (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}
    >
      {icon}
      {label}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-400 ml-3">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white">Attendance</h2>
            <p className="text-gray-400">
              Daily check-in / check-out & history
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || today?.check_in}
            className="btn-success"
          >
            {actionLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={actionLoading || !today?.check_in || today?.check_out}
            className="btn-danger"
          >
            {actionLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
            Check Out
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300">Date</th>
                <th className="px-6 py-4 text-left text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-gray-300">Check In</th>
                <th className="px-6 py-4 text-left text-gray-300">Check Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {attendance.map((row) => (
                <tr key={row.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-white">
                    {formatDate(row.attendance_date)}
                  </td>
                  <td className="px-6 py-4">
                    {statusBadge(row.status)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatTime(row.check_in)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatTime(row.check_out)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
