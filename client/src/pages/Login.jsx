import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 404) {
          // Username not found
          const wantsToRegister = window.confirm(
            "Username not found. Would you like to register instead?"
          );
          if (wantsToRegister) {
            navigate("/register");
          }
          return;
        } else if (res.status === 401) {
          // Incorrect password
          setErrorMessage("Incorrect password. Please try again.");
          return;
        } else {
          setErrorMessage(data.error || "Login failed");
          return;
        }
      }

      // Login successful
      alert("Login successful!");
      
      // Store token (you can use localStorage or context)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      
      navigate("/dashboard");
      
    } catch (err) {
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>

      {errorMessage && (
        <div style={{ 
          color: "red", 
          padding: "0.5rem", 
          marginBottom: "1rem",
          border: "1px solid red",
          borderRadius: "4px",
          backgroundColor: "#ffebee"
        }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>Login</button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}