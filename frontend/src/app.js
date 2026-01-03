import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import VerifyEmail from "./auth/VerifyEmail";

import AdminDashboard from "./dashboard/AdminDashboard";
import EmployeeDashboard from "./dashboard/EmployeeDashboard";

import AttendancePage from "./pages/attendance/AttendancePage";
import ViewEmployeeProfile from "./pages/profile/ViewEmployeeProfile";
import LeavePage from "./pages/leaves/LeavePage";
// import PayrollPage from "./pages/payroll/PayrollPage";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ================= EMPLOYEE ================= */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN", "HR"]}>
            <ViewEmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/profile/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
            <ViewEmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/leaves"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <LeavePage />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN / HR ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Optional: redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
