import { useNavigate } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";

export default function EmployeeCard({ employee }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/employee/profile/${employee.id}`);
  };

  /**
   * Derive status safely
   * - Prefer employee.is_active (from users table)
   * - Fallback to ACTIVE
   */
  const status = employee.is_active === false ? "INACTIVE" : "ACTIVE";

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-400";
      case "INACTIVE":
        return "bg-gray-400";
      case "LEAVE":
        return "bg-yellow-400";
      default:
        return "bg-blue-400";
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700/50 p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800/70 hover:border-gray-600 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <span
          className={`w-3 h-3 rounded-full ${getStatusColor(status)} block`}
        />
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        {employee.profile_photo ? (
          <img
            src={employee.profile_photo}
            alt={employee.full_name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 group-hover:border-gray-600 transition"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-700 group-hover:border-gray-600 transition">
            <User className="w-12 h-12 text-white" />
          </div>
        )}
      </div>

      {/* Employee Info */}
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
          {employee.full_name}
        </h4>
        <p className="text-sm text-gray-400">
          {employee.designation || "Employee"}
        </p>
      </div>

      {/* View Profile */}
      <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm text-blue-400 flex items-center gap-1">
          View Profile
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
