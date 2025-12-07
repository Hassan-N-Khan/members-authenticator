import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      navigate("/");   // Redirect in React
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label for="username">Username</label>
        <input id="username" name="username" placeholder="username" type="text" required/>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required/>
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate("/")}>Go to Login</button>
    </>
  );
}

export default SignUp;
