import { useState } from "react";
import { registerApi } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerApi({
        companyName: form.companyName,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      alert("Registered successfully. Please verify your email.");
      navigate("/verify-email");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="title">Sign Up Page</h2>

        <div className="logo-box">App / Web Logo</div>

        <label>Company Name :</label>
        <input
          name="companyName"
          onChange={handleChange}
          required
        />

        <label>Name :</label>
        <input
          name="name"
          onChange={handleChange}
          required
        />

        <label>Email :</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          required
        />

        <label>Phone :</label>
        <input
          type="tel"
          name="phone"
          onChange={handleChange}
          required
        />

        <label>Password :</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            👁
          </span>
        </div>

        <label>Confirm Password :</label>
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          onChange={handleChange}
          required
        />

        <button className="btn-primary">Sign Up</button>

        <p className="link-text">
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
