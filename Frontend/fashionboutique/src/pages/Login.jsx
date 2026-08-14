import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
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

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
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

      console.log("Login response:", data);

      if (response.ok && data.success) {

        // Save JWT tokens
        localStorage.setItem(
          "access_token",
          data.access
        );

        localStorage.setItem(
          "refresh_token",
          data.refresh
        );

        // Save logged-in student
        localStorage.setItem(
          "student",
          JSON.stringify(data.student)
        );

        alert("Login Successful!");

        // Go to dashboard
        navigate("/dashboard");

      } else {
        setError(
          data.message || "Login failed."
        );
      }

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to server. Please make sure Django is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Student Login</h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p>
          Don't have an account?{" "}

          <Link to="/registration">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;