import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import VerifyEmail from "./auth/VerifyEmail";
import ProtectedRoute from "./auth/ProtectedRoute";

import EmployeeDashboard from "./dashboard/EmployeeDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import ViewEmployeeProfile from "./pages/profile/ViewEmployeeProfile";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* EMPLOYEE ROUTES */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute>
            <ViewEmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/profile/:id"
        element={
          <ProtectedRoute>
            <ViewEmployeeProfile />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
