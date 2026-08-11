import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (form.name.trim() === "") {
      err.name = "Name is required";
    } else if (!/^[A-Za-z ]+$/.test(form.name)) {
      err.name = "Only alphabets are allowed";
    }

    if (form.email.trim() === "") {
      err.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
    ) {
      err.email = "Invalid email address";
    }

    if (form.mobile.trim() === "") {
      err.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      err.mobile = "Enter valid 10-digit mobile number";
    }

    if (form.subject.trim() === "") {
      err.subject = "Subject is required";
    }

    if (form.message.trim() === "") {
      err.message = "Message is required";
    } else if (form.message.length < 10) {
      err.message = "Message should contain at least 10 characters";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSuccess("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });

      setErrors({});
    }
  };

  return (
    <div className="contact-container">

      <div className="contact-left">
        <h1>Contact Us</h1>

        <p>
          We'd love to hear from you. Send your query and our team will
          contact you shortly.
        </p>

        <div className="info">
          <h3>📍 Address</h3>
          <p>Vaduj, Satara, Maharashtra</p>

          <h3>📞 Phone</h3>
          <p>+91 7741851198</p>

          <h3>📧 Email</h3>
          <p>fashionboutique111@gmail.com</p>
        </div>
      </div>

      <div className="contact-right">

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <span>{errors.name}</span>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          <span>{errors.email}</span>

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />
          <span>{errors.mobile}</span>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />
          <span>{errors.subject}</span>

          <textarea
            rows="5"
            name="message"
            placeholder="Write your message..."
            value={form.message}
            onChange={handleChange}
          ></textarea>

          <span>{errors.message}</span>

          <button type="submit">
            Send Message
          </button>

          {success && <p className="success">{success}</p>}

        </form>

      </div>

    </div>
  );
}

export default Contact;