import { useState } from "react";
import { verifyEmailApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyEmailApi({ email, code });
      alert("Email verified successfully. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleVerify}>
        <h2 className="title">Verify Your Email</h2>

        <p style={{ fontSize: "14px", opacity: 0.8 }}>
          Enter the verification code sent to your email.
        </p>

        <label>Email :</label>
        <input
          type="email"
          placeholder="Registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Verification Code :</label>
        <input
          type="text"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button className="btn-primary" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <p className="link-text">
          Already verified? <Link to="/">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
