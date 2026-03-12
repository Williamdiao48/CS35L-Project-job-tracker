import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)"
  },
  leftPanel: {
    flex: 1,
    background: "#000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    padding: "3rem",
    textAlign: "center"
  },
  brandArea: {
    marginBottom: "2rem"
  },
  brandTitle: {
    fontSize: "3em",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#ffffff"
  },
  brandDesc: {
    fontSize: "1.1em",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: "1.6",
    maxWidth: "400px"
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem"
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px"
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb"
  },
  title: {
    fontSize: "1.8em",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "0.5rem",
    textAlign: "center"
  },
  subtitle: {
    fontSize: "0.9em",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "2rem"
  },
  formGroup: {
    marginBottom: "1.5rem"
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "0.5rem",
    fontSize: "0.95em"
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1em",
    fontFamily: "inherit",
    transition: "all 0.25s ease",
    boxSizing: "border-box"
  },
  submitButton: {
    width: "100%",
    padding: "0.85rem",
    background: "#1a6ed6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1em",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1.5rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  errorMessage: {
    color: "#dc2626",
    padding: "0.85rem",
    marginBottom: "1.5rem",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    fontSize: "0.9em",
    textAlign: "center"
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "0.95em"
  },
  link: {
    color: "#1a6ed6",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s ease"
  }
};

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setErrorMessage("Username not found. Don't have an account? Create one below.");
          return;
        } else if (res.status === 401) {
          setErrorMessage("Incorrect password. Please try again.");
          return;
        } else {
          setErrorMessage(data.error || "Login failed");
          return;
        }
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandArea}>
          <div style={styles.brandTitle}>Job Tracker</div>
          <div style={styles.brandDesc}>
            Track your job applications, manage your career growth, and stay organized in your job search journey.
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.formContainer}>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Sign in to your account</p>

            {errorMessage && (
              <div style={styles.errorMessage}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.label}>Username</label>
                <input
                  id="username"
                  type="text"
                  style={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await fetch("/api/users/google-login", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      token: credentialResponse.credential
                    })
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    setErrorMessage(data.error || "Google login failed");
                    return;
                  }

                  localStorage.setItem("token", data.token);
                  localStorage.setItem("userId", data.user.id);
                  localStorage.setItem("username", data.user.username);

                  navigate("/dashboard");
                } catch (err) {
                  setErrorMessage("Google login error");
                }
              }}
              onError={() => {
                console.log("Google login failed");
              }}
            />
            </div>

            <div style={styles.footer}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={styles.link}
                onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                onMouseLeave={(e) => e.target.style.opacity = "1"}
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}