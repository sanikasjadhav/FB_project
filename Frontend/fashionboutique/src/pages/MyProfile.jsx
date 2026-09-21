
import React, { useEffect, useState } from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import StudentSidebar from "../components/StudentSidebar";
import "./MyProfile.css";

const API_URL = "http://127.0.0.1:8000/api";

const MyProfile = () => {
  const [student, setStudent] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD STUDENT
  // =====================================================

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);

      setStudent(studentData);

      setFormData({
        first_name: studentData.first_name || "",
        last_name: studentData.last_name || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        gender: studentData.gender || "",
        address: studentData.address || "",
      });
    }
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEdit = () => {
    setMessage("");
    setError("");

    setFormData({
      first_name: student?.first_name || "",
      last_name: student?.last_name || "",
      email: student?.email || "",
      phone: student?.phone || "",
      gender: student?.gender || "",
      address: student?.address || "",
    });

    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setMessage("");
    setError("");

    setFormData({
      first_name: student?.first_name || "",
      last_name: student?.last_name || "",
      email: student?.email || "",
      phone: student?.phone || "",
      gender: student?.gender || "",
      address: student?.address || "",
    });

    setIsEditing(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    setMessage("");
    setError("");

    if (!student?.id) {
      setError("Student information not found.");
      return;
    }

    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError(
        "First name, last name, email and phone are required."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/students/${student.id}/`,
        {
          method: "PUT",
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
          }),
        }
      );

      const data = await response.json();

      console.log("Update profile response:", data);

      if (!response.ok) {
        setError(
          data.detail ||
            data.email?.[0] ||
            data.phone?.[0] ||
            "Unable to update profile."
        );

        setLoading(false);
        return;
      }

      // Save updated student information
      localStorage.setItem(
        "student",
        JSON.stringify(data)
      );

      setStudent(data);

      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        address: data.address || "",
      });

      setIsEditing(false);

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);

      setError(
        "Unable to connect to the backend."
      );
    }

    setLoading(false);
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="profile-layout">

      {/* COMMON STUDENT SIDEBAR */}
      <StudentSidebar />

      {/* PROFILE CONTENT */}
      <main className="profile-main">

        {/* HEADER */}
        <div className="profile-header">

          <div>
            <h1>My Profile</h1>
            <p>
              {isEditing
                ? "Update your personal information"
                : "View your personal information"}
            </p>
          </div>

          <FaUser className="profile-header-icon" />

        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="profile-message success">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="profile-message error">
            {error}
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="profile-card">

          {/* PROFILE TOP */}
          <div className="profile-top">

            <div className="profile-avatar">
              <FaUser />
            </div>

            <div className="profile-name">

              <h2>
                {student?.first_name
                  ? `${student.first_name} ${
                      student.last_name || ""
                    }`
                  : "Student"}
              </h2>

              <p>Fashion Boutique Student</p>

            </div>

          </div>

          {/* PROFILE DETAILS */}
          <div className="profile-details">

            {/* FIRST NAME */}
            <div className="profile-field">

              <div className="field-icon">
                <FaUser />
              </div>

              <div className="field-content">

                <span>First Name</span>

                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                ) : (
                  <strong>
                    {student?.first_name ||
                      "Not Available"}
                  </strong>
                )}

              </div>

            </div>

            {/* LAST NAME */}
            <div className="profile-field">

              <div className="field-icon">
                <FaUser />
              </div>

              <div className="field-content">

                <span>Last Name</span>

                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                ) : (
                  <strong>
                    {student?.last_name ||
                      "Not Available"}
                  </strong>
                )}

              </div>

            </div>

            {/* EMAIL */}
            <div className="profile-field">

              <div className="field-icon">
                <FaEnvelope />
              </div>

              <div className="field-content">

                <span>Email</span>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                ) : (
                  <strong>
                    {student?.email ||
                      "Not Available"}
                  </strong>
                )}

              </div>

            </div>

            {/* PHONE */}
            <div className="profile-field">

              <div className="field-icon">
                <FaPhone />
              </div>

              <div className="field-content">

                <span>Phone</span>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <strong>
                    {student?.phone ||
                      "Not Available"}
                  </strong>
                )}

              </div>

            </div>

            {/* GENDER */}
            <div className="profile-field">

              <div className="field-icon">
                <FaVenusMars />
              </div>

              <div className="field-content">

                <span>Gender</span>

                {isEditing ? (
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
                ) : (
                  <strong>
                    {student?.gender ||
                      "Not Available"}
                  </strong>
                )}

              </div>

            </div>

            {/* ADDRESS */}
            <div className="profile-field">

              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div className="field-content">

                <span>Address</span>

                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows="3"
                  />
                ) : (
                  <strong>
                    {student?.address ||
                      "Not Available"}
                  </strong>
                )}

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="profile-actions">

            {!isEditing ? (

              <button
                className="edit-profile-btn"
                onClick={handleEdit}
              >
                <FaEdit />
                Edit Profile
              </button>

            ) : (

              <>

                <button
                  className="save-profile-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FaSave />

                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FaTimes />
                  Cancel
                </button>

              </>

            )}

          </div>

        </div>

      </main>

    </div>
  );
};

export default MyProfile;
