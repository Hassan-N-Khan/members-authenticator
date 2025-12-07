import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/");
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us today!</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="username" className="auth-label">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Choose a username"
              type="text"
              required
              className="auth-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              id="password"
              name="password"
              placeholder="Create a password"
              type="password"
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <button
            className="auth-link"
            onClick={() => navigate("/")}
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;