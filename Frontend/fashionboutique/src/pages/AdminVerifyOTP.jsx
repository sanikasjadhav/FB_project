import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminVerifyOTP.css";

function AdminVerifyOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get Admin email saved from AdminForgotPassword page
  const email = localStorage.getItem("adminResetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError(
        "Admin email not found. Please request OTP again."
      );
      return;
    }

    if (!otp) {
      setError("Please enter OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin-verify-otp/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Admin Verify OTP Response:",
        data
      );

      if (response.ok && data.success) {
        setMessage(
          "OTP verified successfully."
        );

        // Save verified status locally
        localStorage.setItem(
          "adminOTPVerified",
          "true"
        );

        // Go to reset password page
        setTimeout(() => {
          navigate("/admin-reset-password");
        }, 1000);
      } else {
        setError(
          data.message ||
            "Invalid OTP."
        );
      }

    } catch (error) {
      console.error(
        "Admin Verify OTP Error:",
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
    <div className="admin-verify-container">

      <div className="admin-verify-card">

        <h2>Verify Admin OTP</h2>

        <p>
          Enter the 6-digit OTP sent to:
        </p>

        <strong className="admin-email">
          {email || "Admin Email"}
        </strong>

        {/* Error */}
        {error && (
          <div className="admin-verify-error">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="admin-verify-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-otp-input">

            <label>Enter OTP</label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setOtp(value);
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
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <p className="admin-back-link">

          <Link to="/admin-forgot-password">
            ← Request New OTP
          </Link>

        </p>

        <p className="admin-back-link">

          <Link to="/admin-login">
            ← Back to Admin Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default AdminVerifyOTP;