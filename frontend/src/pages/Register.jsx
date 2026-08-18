import GoogleAuthButton from "../components/GoogleAuthButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setMessageType("");

    // Password validation
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to create account."
        );
        setMessageType("error");
        return;
      }

      setMessage(
        data.message || "Account created successfully!"
      );
      setMessageType("success");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Register error:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      {/* Background */}
      <div className="register-background" />

      <div className="register-wrapper">

        {/* =================================================
            LEFT INFORMATION
        ================================================= */}

        <section className="register-info">
          <div className="brand-icon">
            <Utensils
              size={27}
              strokeWidth={2}
            />
          </div>

          <h1>
            Create
            <br />
            <span>Account!</span>
          </h1>

          <p>
            Join us and start ordering your favorite
            meals from our restaurant.
          </p>

          <div className="register-features">

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
            REGISTER CARD
        ================================================= */}

        <section className="register-card">

          {/* Header */}

          <div className="register-header">

            <div className="mobile-logo">
              <Utensils
                size={24}
                strokeWidth={2}
              />
            </div>

            <h2>Create Account</h2>

            <p>
              Register to start ordering
            </p>

          </div>


          {/* =================================================
              REGISTER FORM
          ================================================= */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  <User
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                  required
                />

              </div>
            </div>


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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
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


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
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
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner"
                    aria-hidden="true"
                  />

                  <span>
                    Creating Account...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Create Account
                  </span>

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
              className={`register-message ${messageType}`}
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

          <div className="register-footer">

            <span>
              Already have an account?
            </span>

            <a href="/login">
              Login
            </a>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Register;