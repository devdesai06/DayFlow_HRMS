import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();              // clears token + user
    navigate("/");         // back to login
  };

  const handleProfile = () => {
    setOpen(false);
    navigate("/employee/profile");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          Welcome back{user?.email ? "," : ""}{" "}
          <span className="text-blue-400">
            {user?.email?.split("@")[0]}
          </span>
        </h3>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications (future) */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
          <Bell className="w-5 h-5" />
        </button>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition group"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-700 group-hover:border-gray-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-700 group-hover:border-gray-600">
                <User className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>

            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50">
              {/* Info */}
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-white">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Role: {user?.role}
                </p>
              </div>

              {/* Actions */}
              <div className="py-2">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-700 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
