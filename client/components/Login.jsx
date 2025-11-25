import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);     // Store logged-in user
  const [error, setError] = useState("");     // Store login errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/log-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setUser({ username: e.target.username.value });
      setError("");
      navigate("/");  // Redirect to default page
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return user ? (
    <div>
      <h1>Welcome back, {user.username}!</h1>
      <a href="/">LOG OUT</a>
    </div>
  ) : (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" placeholder="Username" type="text" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" placeholder="Password" type="password" required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
