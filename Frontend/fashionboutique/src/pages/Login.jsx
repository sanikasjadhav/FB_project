import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.username === "" ||
      formData.password === ""
      ) {
        alert("Please fill all fields");
        return;
        }

    alert("Login Successful!");

    // Redirect to Courses page
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Student Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/registeration">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;