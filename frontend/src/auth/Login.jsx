import { useState, useContext } from "react";
import { loginApi } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  // MOCK LOGIN ONLY
  if (email === "admin@test.com") {
    login(
      {
        id: "1",
        name: "Admin User",
        role: "ADMIN",
      },
      "mock-token"
    );
    navigate("/admin");
    return;
  }

  if (email === "employee@test.com") {
    login(
      {
        id: "2",
        name: "Employee User",
        role: "EMPLOYEE",
      },
      "mock-token"
    );
    navigate("/employee");
    return;
  }

  alert("Invalid mock credentials");
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button>Sign In</button>
    </form>
  );
}
