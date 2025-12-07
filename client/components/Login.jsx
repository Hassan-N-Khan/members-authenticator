import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/log-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
      credentials: "include"
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user);
      setError("");
      navigate("/message-board");
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username" className="auth-label">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Enter username"
            type="text"
            required
            className="auth-input"
          />

          <label htmlFor="password" className="auth-label">Password</label>
          <input
            id="password"
            name="password"
            placeholder="Enter password"
            type="password"
            required
            className="auth-input"
          />

          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?
          <button
            className="auth-link"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
