import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminForgotPassword.css";

function AdminForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter admin email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin-forgot-password/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      console.log("Admin Forgot Password Response:", data);

      if (response.ok && data.success) {
        setMessage(
          "OTP sent successfully to your admin email."
        );

        // Save email for next page
        localStorage.setItem(
          "adminResetEmail",
          email
        );

        // Go to Admin OTP page
        setTimeout(() => {
          navigate("/admin-verify-otp");
        }, 1000);
      } else {
        setError(
          data.message ||
            "Unable to send OTP."
        );
      }
    } catch (error) {
      console.error(
        "Admin forgot password error:",
        error
      );

      setError(
        "Unable to connect to server. Please make sure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-forgot-container">

      <div className="admin-forgot-card">

        <h2>Admin Forgot Password</h2>

        <p>
          Enter your registered admin email
          to receive an OTP.
        </p>

        {/* Error */}
        {error && (
          <div className="admin-forgot-error">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="admin-forgot-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-forgot-input">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setMessage("");
              }}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

        </form>

        <p className="admin-back-login">

          <Link to="/admin-login">
            ← Back to Admin Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default AdminForgotPassword;