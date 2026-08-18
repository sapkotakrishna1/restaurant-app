import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GoogleAuthButton() {
  const googleButtonRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = async (response) => {
    if (!response?.credential) {
      setError("Google authentication failed.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const serverResponse = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      );

      const data = await serverResponse.json();

      if (!serverResponse.ok) {
        setError(
          data.message || "Google authentication failed."
        );
        return;
      }

      if (!data.token || !data.user) {
        setError(
          "Google login response is missing user information."
        );
        return;
      }

      // Save JWT + user
      login(data.token, data.user);

      // Go to home
      navigate("/");
    } catch (error) {
      console.error(
        "Google authentication error:",
        error
      );

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const renderGoogleButton = () => {
      if (
        !window.google ||
        !window.google.accounts ||
        !googleButtonRef.current
      ) {
        return;
      }

      // Clear old button
      googleButtonRef.current.innerHTML = "";

      // Initialize Google
      window.google.accounts.id.initialize({
        client_id:
          import.meta.env.VITE_GOOGLE_CLIENT_ID,

        callback: handleGoogleResponse,

        auto_select: false,
      });

      // Render Google button
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 360,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        }
      );
    };

    // Check if Google script already exists
    if (window.google) {
      renderGoogleButton();
      return;
    }

    // Load Google Identity Services
    const script = document.createElement("script");

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = renderGoogleButton;

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="google-auth-container">

      {/* Google Button */}
      <div
        ref={googleButtonRef}
        className="google-button"
      />

      {/* Loading */}
      {loading && (
        <div className="google-loading">
          Signing in with Google...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="google-error">
          {error}
        </div>
      )}

    </div>
  );
}

export default GoogleAuthButton;