import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
import {
  Utensils,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Invalid email or password."
        );
        setMessageType("error");
        return;
      }

      if (!data.token || !data.user) {
        setMessage(
          "Login response is missing user information."
        );
        setMessageType("error");
        return;
      }

      // Save JWT and user
      login(data.token, data.user);

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      console.log("JWT:", data.token);
      console.log("User:", data.user);

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Background */}
      <div className="login-background" />

      <div className="login-wrapper">

        {/* =================================================
            LEFT INFORMATION
        ================================================= */}

        <section className="login-info">
          <div className="brand-icon">
            <Utensils
              size={27}
              strokeWidth={2}
            />
          </div>

          <h1>
            Welcome
            <br />
            <span>Back!</span>
          </h1>

          <p>
            Login to continue ordering your favorite
            meals from our restaurant.
          </p>

          <div className="login-features">

            <div className="feature">
              <span className="feature-icon">
                <Check
                  size={14}
                  strokeWidth={2.5}
                />
              </span>

              <p>Fresh & delicious food</p>
            </div>

            <div className="feature">
              <span className="feature-icon">
                <Check
                  size={14}
                  strokeWidth={2.5}
                />
              </span>

              <p>Fast and easy ordering</p>
            </div>

            <div className="feature">
              <span className="feature-icon">
                <Check
                  size={14}
                  strokeWidth={2.5}
                />
              </span>

              <p>Secure account</p>
            </div>

          </div>
        </section>


        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <section className="login-card">

          {/* Header */}

          <div className="login-header">

            <div className="mobile-logo">
              <Utensils
                size={24}
                strokeWidth={2}
              />
            </div>

            <h2>Login</h2>

            <p>
              Sign in to your account to continue
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  <Mail
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>
            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  <Lock
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      size={18}
                      strokeWidth={1.8}
                    />
                  )}
                </button>

              </div>
            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner"
                    aria-hidden="true"
                  />

                  <span>
                    Logging in...
                  </span>
                </>
              ) : (
                <>
                  <span>Login</span>

                  <ArrowRight
                    className="button-arrow"
                    size={19}
                    strokeWidth={2}
                  />
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
  <span>OR</span>
</div>

<GoogleAuthButton />


          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div
              className={`login-message ${messageType}`}
              role="alert"
            >
              <span className="message-icon">
                {messageType === "success" ? (
                  <Check
                    size={13}
                    strokeWidth={2.5}
                  />
                ) : (
                  <AlertCircle
                    size={14}
                    strokeWidth={2.3}
                  />
                )}
              </span>

              <span className="message-text">
                {message}
              </span>
            </div>
          )}


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="login-footer">

            <span>
              Don't have an account?
            </span>

            <a href="/register">
              Create Account
            </a>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Login;