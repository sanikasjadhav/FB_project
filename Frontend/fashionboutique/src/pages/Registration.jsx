import { useState } from "react";
import "./Registration.css";

function Registration() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First Name is required";

    if (!formData.last_name.trim())
      newErrors.last_name = "Last Name is required";
    if (!formData.username.trim())
      newErrors.username = "Username is required";

    if (!formData.email)
      newErrors.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      newErrors.email = "Invalid email address";

    if (!formData.phone)
      newErrors.phone = "Phone Number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit mobile number";

    if (!formData.gender)
      newErrors.gender = "Select Gender";

    if (!formData.address.trim())
      newErrors.address = "Address is required";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      alert("Registration Successful!");

      console.log(formData);

      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h2>Create Account</h2>

        <p>Join Fashion Boutique Today</p>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <span>{errors.first_name}</span>
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <span>{errors.last_name}</span>
            </div>
            <div className="input-group">
              <label>Username</label>

              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
              />

              <span>{errors.username}</span>
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <span>{errors.email}</span>
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
            />
            <span>{errors.phone}</span>
          </div>

          <div className="input-group">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <span>{errors.gender}</span>
          </div>

          <div className="input-group">
            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>

            <span>{errors.address}</span>
          </div>

          <div className="row">

            <div className="input-group">
              <label>Password</label>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <span>{errors.password}</span>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <span>{errors.confirmPassword}</span>
            </div>

          </div>

          <div className="show-pass">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </div>

          <button type="submit">Register</button>

        </form>

      </div>

    </div>
  );
}

export default Registration;