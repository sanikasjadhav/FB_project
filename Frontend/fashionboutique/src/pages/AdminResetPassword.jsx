import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminResetPassword.css";

function AdminResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email saved during Admin Forgot Password
  const email = localStorage.getItem("adminResetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Check email
    if (!email) {
      setError(
        "Admin email not found. Please start the password reset process again."
      );
      return;
    }

    // Check password
    if (!newPassword) {
      setError("Please enter new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Check confirm password
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin-reset-password/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Admin Reset Password Response:",
        data
      );

      if (response.ok && data.success) {
        setMessage(
          "Password changed successfully."
        );

        // Remove reset information
        localStorage.removeItem("adminResetEmail");
        localStorage.removeItem("adminOTPVerified");

        // Go to Admin Login
        setTimeout(() => {
          navigate("/admin-login");
        }, 1500);
      } else {
        setError(
          data.message ||
            "Unable to change password."
        );
      }
    } catch (error) {
      console.error(
        "Admin Reset Password Error:",
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
    <div className="admin-reset-container">

      <div className="admin-reset-card">

        <h2>Reset Admin Password</h2>

        <p>
          Create a new password for:
        </p>

        <strong className="admin-email">
          {email || "Admin Email"}
        </strong>

        {/* Error */}
        {error && (
          <div className="admin-reset-error">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="admin-reset-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <div className="admin-input-group">

            <label>New Password</label>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
            />

          </div>

          {/* Confirm Password */}
          <div className="admin-input-group">

            <label>Confirm Password</label>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />

          </div>

          {/* Show Password */}
          <div className="show-password">

            <input
              type="checkbox"
              checked={showPassword}
              onChange={() =>
                setShowPassword(
                  !showPassword
                )
              }
            />

            <span>Show Password</span>

          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </button>

        </form>

        <p className="admin-login-link">

          <Link to="/admin-login">
            ← Back to Admin Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default AdminResetPassword;