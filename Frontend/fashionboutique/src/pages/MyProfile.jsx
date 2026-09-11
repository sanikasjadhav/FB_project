import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaEdit
} from "react-icons/fa";

import StudentSidebar from "../components/StudentSidebar";
import "./MyProfile.css";

const MyProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

  return (
    <div className="profile-layout">

      {/* COMMON STUDENT SIDEBAR */}
      <StudentSidebar />

      {/* PROFILE CONTENT */}
      <main className="profile-main">

        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>View your personal information</p>
          </div>

          <FaUser className="profile-header-icon" />
        </div>

        <div className="profile-card">

          <div className="profile-top">

            <div className="profile-avatar">
              <FaUser />
            </div>

            <div className="profile-name">
              <h2>
                {student?.first_name
                  ? `${student.first_name} ${student.last_name || ""}`
                  : "Student"}
              </h2>

              <p>Fashion Boutique Student</p>
            </div>

          </div>

          <div className="profile-details">

            <div className="profile-field">
              <div className="field-icon">
                <FaUser />
              </div>

              <div>
                <span>First Name</span>
                <strong>
                  {student?.first_name || "Not Available"}
                </strong>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <FaUser />
              </div>

              <div>
                <span>Last Name</span>
                <strong>
                  {student?.last_name || "Not Available"}
                </strong>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {student?.email || "Not Available"}
                </strong>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <FaPhone />
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {student?.phone || "Not Available"}
                </strong>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <FaVenusMars />
              </div>

              <div>
                <span>Gender</span>
                <strong>
                  {student?.gender || "Not Available"}
                </strong>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>Address</span>
                <strong>
                  {student?.address || "Not Available"}
                </strong>
              </div>
            </div>

          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn">
              <FaEdit />
              Edit Profile
            </button>
          </div>

        </div>

      </main>

    </div>
  );
};

export default MyProfile;