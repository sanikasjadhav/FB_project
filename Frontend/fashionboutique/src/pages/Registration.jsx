import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";

function Registration() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setServerError("");
  };

  // Validate form
  const validate = () => {
    let newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First Name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter valid 10-digit mobile number";
    }

    if (!formData.gender) {
      newErrors.gender = "Select Gender";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    // Validate form
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            address: formData.address,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Registration response:", data);

      // Registration successful
      if (response.ok) {
        alert("Registration Successful!");

        // Clear form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          gender: "",
          address: "",
          password: "",
          confirmPassword: "",
        });

        setErrors({});

        // Go to Login page
        navigate("/login");
      }

      // Registration failed
      else {
        console.log("Registration failed:", data);

        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, message]) => {
              if (Array.isArray(message)) {
                return `${field}: ${message.join(", ")}`;
              }

              return `${field}: ${message}`;
            })
            .join(" ");

          setServerError(messages);
        } else {
          setServerError("Registration failed.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);

      setServerError(
        "Unable to connect to server. Please make sure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h2>Create Account</h2>

        <p>Join Fashion Boutique Today</p>

        {/* Django server error */}
        {serverError && (
          <p className="error-message">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* First Name + Last Name */}
          <div className="row">

            <div className="input-group">

              <label>First Name</label>

              <input
                type="text"
                name="first_name"
                placeholder="Enter First Name"
                value={formData.first_name}
                onChange={handleChange}
              />

              <span>
                {errors.first_name}
              </span>

            </div>

            <div className="input-group">

              <label>Last Name</label>

              <input
                type="text"
                name="last_name"
                placeholder="Enter Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />

              <span>
                {errors.last_name}
              </span>

            </div>

          </div>

          {/* Email */}
          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <span>
              {errors.email}
            </span>

          </div>

          {/* Phone */}
          <div className="input-group">

            <label>Phone</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
            />

            <span>
              {errors.phone}
            </span>

          </div>

          {/* Gender */}
          <div className="input-group">

            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >

              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>

            <span>
              {errors.gender}
            </span>

          </div>

          {/* Address */}
          <div className="input-group">

            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>

            <span>
              {errors.address}
            </span>

          </div>

          {/* Password + Confirm Password */}
          <div className="row">

            <div className="input-group">

              <label>Password</label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />

              <span>
                {errors.password}
              </span>

            </div>

            <div className="input-group">

              <label>Confirm Password</label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <span>
                {errors.confirmPassword}
              </span>

            </div>

          </div>

          {/* Show Password */}
          <div className="show-pass">

            <input
              type="checkbox"
              checked={showPassword}
              onChange={() =>
                setShowPassword(!showPassword)
              }
            />

            Show Password

          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>

        </form>

        {/* Login link */}
        <p>
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Registration;