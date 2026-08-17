import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();

  // 1 = email
  // 2 = OTP
  // 3 = new password
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // STEP 1 - SEND OTP
  // =====================================================

  const handleSendOTP = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your registered email.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/forgot-password/",
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

      if (response.ok && data.success) {

        setMessage("OTP has been sent to your email.");

        // Open OTP screen
        setStep(2);

      } else {

        setError(
          data.message || "Unable to send OTP."
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // STEP 2 - VERIFY OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!otp) {

      setError("Please enter the OTP.");

      return;
    }

    if (otp.length !== 6) {

      setError("OTP must contain 6 digits.");

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/verify-otp/",
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

      if (response.ok && data.success) {

        setMessage(
          "OTP verified successfully."
        );

        // Open password screen
        setStep(3);

      } else {

        setError(
          data.message || "Invalid OTP."
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // STEP 3 - CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword) {

      setError("Please enter a new password.");

      return;
    }

    if (newPassword.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (newPassword !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/reset-password/",
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

      if (response.ok && data.success) {

        setMessage(
          "Password changed successfully!"
        );

        setTimeout(() => {

          navigate("/login");

        }, 1500);

      } else {

        setError(
          data.message || "Unable to change password."
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="forgot-container">

      <div className="forgot-box">

        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (

          <>

            <h2>Forgot Password</h2>

            <p className="description">
              Enter your registered email address.
            </p>

            <form onSubmit={handleSendOTP}>

              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}

              </button>

            </form>

          </>

        )}


        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (

          <>

            <h2>Verify OTP</h2>

            <p className="description">

              Enter the 6-digit OTP sent to:

            </p>

            <p className="email-text">
              {email}
            </p>

            <form onSubmit={handleVerifyOTP}>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={6}
                required
              />

              <button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Verifying..."
                  : "Verify OTP"}

              </button>

            </form>

          </>

        )}


        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (

          <>

            <h2>Change Password</h2>

            <p className="description">
              Enter your new password.
            </p>

            <form onSubmit={handleChangePassword}>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Changing Password..."
                  : "Change Password"}

              </button>

            </form>

          </>

        )}


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (

          <p className="success-message">
            {message}
          </p>

        )}

        {error && (

          <p className="error-message">
            {error}
          </p>

        )}


        {/* LOGIN */}
        <p className="login-text">

          Remember your password?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>

        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;