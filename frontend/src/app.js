import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import VerifyEmail from "./auth/VerifyEmail";
import ProtectedRoute from "./auth/ProtectedRoute";

import EmployeeDashboard from "./dashboard/EmployeeDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

import ViewEmployeeProfile from "./pages/profile/ViewEmployeeProfile";
import AttendancePage from "./pages/attendance/AttendancePage";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ================= EMPLOYEE ROUTES ================= */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute roles={["EMPLOYEE", "ADMIN", "HR"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute roles={["EMPLOYEE", "ADMIN", "HR"]}>
            <ViewEmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/profile/:id"
        element={
          <ProtectedRoute roles={["ADMIN", "HR"]}>
            <ViewEmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute roles={["EMPLOYEE", "ADMIN", "HR"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
