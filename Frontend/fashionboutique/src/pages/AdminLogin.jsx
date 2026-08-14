import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin-login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Admin Login Response:", data);

      if (response.ok && data.success) {
        // Save JWT tokens
        localStorage.setItem(
          "adminAccessToken",
          data.access
        );

        localStorage.setItem(
          "adminRefreshToken",
          data.refresh
        );

        // Save admin information
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

        alert("Admin Login Successful!");

        // Go to Admin Dashboard
        navigate("/admin-dashboard");
      } else {
        setError(
          data.message || "Admin login failed."
        );
      }
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        "Unable to connect to server. Please make sure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">

      <div className="admin-login-card">

        <h2>Admin Login</h2>

        <p>Fashion Boutique Administration</p>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="admin-input-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>

        </form>

        <p className="student-login-link">
          Student Login?{" "}
          <Link to="/login">
            Login here
          </Link>
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;