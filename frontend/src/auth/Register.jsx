import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeCode: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerApi(form);

      // ✅ Redirect to login after success
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Create Account
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          name="employeeCode"
          placeholder="Employee Code"
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-3 bg-gray-700 rounded-lg text-white"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-3 bg-gray-700 rounded-lg text-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-3 bg-gray-700 rounded-lg text-white"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 bg-gray-700 rounded-lg text-white"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
