import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Bell } from "lucide-react";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Mock user data - replace with actual context
  const user = {
    name: "John Doe",
    email: "john@dayflow.com",
    role: "ADMIN",
    avatar: null
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // logout();
    // navigate("/login");
  };

  const handleProfile = () => {
    console.log("Navigate to profile");
    // navigate("/employee/profile");
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left side - can add breadcrumbs or search */}
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-white">Welcome back!</h3>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition duration-200 group"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-700 group-hover:border-gray-600 transition duration-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-700 group-hover:border-gray-600 transition duration-200">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>

            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition duration-150"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    console.log("Settings");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition duration-150"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-700 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


