import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { token, role } = await loginApi({
      email: email.trim(),        // 🔥 trim whitespace
      password: password,
    });

    if (!token || !role) {
      throw new Error("Invalid login response");
    }

    login(
      { email, role },
      token
    );

    // 🔁 redirect
    navigate(role === "ADMIN" || role === "HR" ? "/admin" : "/employee");

  } catch (err) {
    console.error("LOGIN ERROR:", err?.response?.data || err.message);

    setError(
      err?.response?.data?.message ||
      "Invalid email or password"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            DayFlow HRMS
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 rounded-xl text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 rounded-xl text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 rounded-xl text-white font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-400 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
