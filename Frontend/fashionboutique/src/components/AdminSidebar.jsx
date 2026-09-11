import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };

  // =========================
  // CHECK ACTIVE PAGE
  // =========================
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <aside className="admin-sidebar">

      {/* =========================
          LOGO
      ========================= */}
      <div className="admin-logo">

        <h2>
          Fashion Boutique
        </h2>

        <span>
          Admin Panel
        </span>

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}
      <nav className="admin-navigation">

        {/* DASHBOARD */}
        <button
          className={`sidebar-link ${isActive("/admin-dashboard")}`}
          onClick={() => navigate("/admin-dashboard")}
        >
          <span className="sidebar-icon">🏠</span>
          <span>Dashboard</span>
        </button>


        {/* STUDENTS */}
        <button
          className={`sidebar-link ${isActive("/admin-students")}`}
          onClick={() => navigate("/admin-students")}
        >
          <span className="sidebar-icon">👩‍🎓</span>
          <span>Students</span>
        </button>


        {/* CATEGORIES */}
        <button
          className={`sidebar-link ${isActive("/admin-categories")}`}
          onClick={() => navigate("/admin-categories")}
        >
          <span className="sidebar-icon">📂</span>
          <span>Categories</span>
        </button>


        {/* COURSES */}
        <button
          className={`sidebar-link ${isActive("/admin-courses")}`}
          onClick={() => navigate("/admin-courses")}
        >
          <span className="sidebar-icon">📚</span>
          <span>Courses</span>
        </button>


        {/* BATCHES */}
        <button
          className={`sidebar-link ${isActive("/admin-batches")}`}
          onClick={() => navigate("/admin-batches")}
        >
          <span className="sidebar-icon">🗓️</span>
          <span>Batches</span>
        </button>


        {/* ENROLLMENTS */}
        <button
          className={`sidebar-link ${isActive("/admin-enrollments")}`}
          onClick={() => navigate("/admin-enrollments")}
        >
          <span className="sidebar-icon">📝</span>
          <span>Enrollments</span>
        </button>


        {/* PAYMENTS */}
        <button
          className={`sidebar-link ${isActive("/admin-payments")}`}
          onClick={() => navigate("/admin-payments")}
        >
          <span className="sidebar-icon">💳</span>
          <span>Payments</span>
        </button>


        {/* COURSE VIDEOS */}
        <button
          className={`sidebar-link ${isActive("/admin-videos")}`}
          onClick={() => navigate("/admin-videos")}
        >
          <span className="sidebar-icon">🎥</span>
          <span>Course Videos</span>
        </button>


        {/* STUDY MATERIALS */}
        <button
          className={`sidebar-link ${isActive("/admin-materials")}`}
          onClick={() => navigate("/admin-materials")}
        >
          <span className="sidebar-icon">📖</span>
          <span>Study Materials</span>
        </button>


        {/* CERTIFICATES */}
        <button
          className={`sidebar-link ${isActive("/admin-certificates")}`}
          onClick={() => navigate("/admin-certificates")}
        >
          <span className="sidebar-icon">🏆</span>
          <span>Certificates</span>
        </button>


        {/* FEEDBACK */}
        <button
          className={`sidebar-link ${isActive("/admin-feedback")}`}
          onClick={() => navigate("/admin-feedback")}
        >
          <span className="sidebar-icon">💬</span>
          <span>Feedback</span>
        </button>


        {/* GALLERY */}
        <button
          className={`sidebar-link ${isActive("/admin-gallery")}`}
          onClick={() => navigate("/admin-gallery")}
        >
          <span className="sidebar-icon">🖼️</span>
          <span>Gallery</span>
        </button>


        {/* CONTACT MESSAGES */}
        <button
          className={`sidebar-link ${isActive("/admin-contacts")}`}
          onClick={() => navigate("/admin-contacts")}
        >
          <span className="sidebar-icon">📩</span>
          <span>Contact Messages</span>
        </button>


        {/* REPORTS */}
        <button
          className={`sidebar-link ${isActive("/admin-reports")}`}
          onClick={() => navigate("/admin-reports")}
        >
          <span className="sidebar-icon">📊</span>
          <span>Reports</span>
        </button>

      </nav>


      {/* =========================
          LOGOUT
      ========================= */}
      <div className="admin-sidebar-bottom">

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">🚪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;