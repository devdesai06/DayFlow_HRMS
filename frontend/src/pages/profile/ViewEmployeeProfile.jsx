import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchEmployeeById,
  fetchMyProfile,
} from "../../services/employee.service";
import {
  User,
  Mail,
  Phone,
  Building,
  LucideUserCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ViewEmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = id
          ? await fetchEmployeeById(id)
          : await fetchMyProfile();
        setEmployee(data);
      } catch {
        setError("Failed to load employee profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

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

  const status = employee.is_active === false ? "INACTIVE" : "ACTIVE";

  const statusClass =
    status === "ACTIVE"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-gray-500/20 text-gray-400 border-gray-500/30";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-700/50 flex flex-col md:flex-row gap-6 items-center">
            {/* Avatar */}
            {employee.profile_photo ? (
              <img
                src={employee.profile_photo}
                alt="avatar"
                className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-700">
                <User className="w-16 h-16 text-white" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">
                {employee.full_name}
              </h2>
              <p className="text-gray-400 mt-1">
                {employee.designation || "Employee"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-gray-300">
                  ID: {employee.id}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold ${statusClass}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <LucideUserCircle className="w-6 h-6 text-blue-400" />
              Employee Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Email" value={employee.email} icon={<Mail />} />
              <Field label="Phone" value={employee.phone} icon={<Phone />} />
              <Field
                label="Department"
                value={employee.department}
                icon={<Building />}
              />
              <Field
                label="Role"
                value={employee.role}
                icon={<LucideUserCircle />}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, icon, highlight }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <span className="text-blue-400">{icon}</span>
        {label}
      </label>
      <div
        className={`px-4 py-3 rounded-xl border ${
          highlight
            ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
            : "bg-gray-700/30 border-gray-600 text-gray-300"
        }`}
      >
        {value || "-"}
      </div>
    </div>
  );
}
