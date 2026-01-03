import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyEmailApi } from "../api/auth.api";
import "../styles/auth.css";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyEmailApi({ email, code });

      navigate("/login", {
        state: { message: "Email verified successfully. Please login." }
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleVerify}>
        <h2 className="auth-title">Verify Your Email</h2>

        <p className="auth-subtext">
          Enter the verification code sent to your email.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="Registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="6-digit verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <p className="auth-link">
          Already verified? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
