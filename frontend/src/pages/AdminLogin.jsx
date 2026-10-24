
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import "../styles/AdminLogin.css";

const API_URL = "http://localhost:5000/api/auth/login";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Login failed. Please check your credentials."
        );
      }

      const token =
        result.data?.token ||
        result.token ||
        result.data?.accessToken;

      if (!token) {
        throw new Error(
          "Login response did not include an authentication token."
        );
      }

      localStorage.setItem("adminToken", token);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the backend. Please check that the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <Link to="/" className="admin-login__brand">
          BEST<span>X</span>WORST
        </Link>

        <div className="admin-login__icon">
          <LockKeyhole size={25} />
        </div>

        <p className="admin-login__eyebrow">ADMINISTRATION</p>
        <h1>Welcome back</h1>

        <p className="admin-login__description">
          Sign in to manage your editorial platform.
        </p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <label htmlFor="admin-email">Email address</label>

          <div className="admin-login__input-wrap">
            <Mail size={18} aria-hidden="true" />

            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <label htmlFor="admin-password">Password</label>

          <div className="admin-login__input-wrap">
            <LockKeyhole size={18} aria-hidden="true" />

            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />

            <button
              className="admin-login__toggle"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <p className="admin-login__error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-login__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to dashboard"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="admin-login__footer">
          Independent reviews. Editorial integrity.
        </p>
      </section>
    </main>
  );
}
