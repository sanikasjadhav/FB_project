import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";


function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);


  /* =========================
     CHECK ADMIN LOGIN
  ========================= */

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    const adminData = localStorage.getItem("admin");

    if (!token || !adminData) {
      navigate("/admin-login");
      return;
    }

    try {
      setAdmin(JSON.parse(adminData));
    } catch (error) {
      console.error("Admin data error:", error);

      localStorage.removeItem("admin");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");

      navigate("/admin-login");
    }
  }, [navigate]);


  /* =========================
     NAVIGATION
  ========================= */

  const goTo = (path) => {
    navigate(path);
  };


  /* =========================
     LOADING
  ========================= */

  if (!admin) {
    return (
      <div className="admin-loading">
        Loading Admin Dashboard...
      </div>
    );
  }


  return (
    <div className="admin-dashboard">

      {/* =========================
          COMMON SIDEBAR
      ========================= */}

      <AdminSidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-main">


        {/* =========================
            HEADER
        ========================= */}

        <header className="admin-header">

          <div className="admin-header-left">

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome back,{" "}
              <strong>
                {admin.name}
              </strong>
            </p>

          </div>


          <div className="admin-profile">

            <div className="admin-avatar">

              {admin.name
                ? admin.name.charAt(0).toUpperCase()
                : "A"}

            </div>


            <div className="admin-profile-info">

              <strong>
                {admin.name}
              </strong>

              <span>
                {admin.email}
              </span>

            </div>

          </div>

        </header>



        {/* =========================
            WELCOME SECTION
        ========================= */}

        <section className="admin-welcome">

          <div>

            <h2>
              Welcome to Fashion Boutique
            </h2>

            <p>
              Manage your Fashion Boutique
              students, courses, batches,
              payments and learning resources
              from one place.
            </p>

          </div>


          <div className="welcome-icon">
            👗
          </div>

        </section>



        {/* =========================
            STAT CARDS
        ========================= */}

        <section className="admin-stats">


          {/* STUDENTS */}

          <div
            className="stat-card"
            onClick={() =>
              goTo("/admin-students")
            }
          >

            <div className="stat-icon">
              👩‍🎓
            </div>

            <div className="stat-content">

              <h3>
                Students
              </h3>

              <p>
                Manage student accounts
              </p>

            </div>

          </div>


          {/* COURSES */}

          <div
            className="stat-card"
            onClick={() =>
              goTo("/admin-courses")
            }
          >

            <div className="stat-icon">
              📚
            </div>

            <div className="stat-content">

              <h3>
                Courses
              </h3>

              <p>
                Manage courses
              </p>

            </div>

          </div>


          {/* BATCHES */}

          <div
            className="stat-card"
            onClick={() =>
              goTo("/admin-batches")
            }
          >

            <div className="stat-icon">
              🗓️
            </div>

            <div className="stat-content">

              <h3>
                Batches
              </h3>

              <p>
                Manage course batches
              </p>

            </div>

          </div>


          {/* PAYMENTS */}

          <div
            className="stat-card"
            onClick={() =>
              goTo("/admin-payments")
            }
          >

            <div className="stat-icon">
              💳
            </div>

            <div className="stat-content">

              <h3>
                Payments
              </h3>

              <p>
                Manage student payments
              </p>

            </div>

          </div>

        </section>



        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="quick-actions">

          <div className="section-title">

            <h2>
              Quick Actions
            </h2>

            <p>
              Quickly access your admin
              management sections.
            </p>

          </div>


          <div className="quick-grid">


            {/* STUDENTS */}

            <button
              onClick={() =>
                goTo("/admin-students")
              }
            >

              <span className="quick-icon">
                👩‍🎓
              </span>

              <strong>
                Manage Students
              </strong>

              <small>
                View and manage registered
                students.
              </small>

            </button>


            {/* CATEGORIES */}

            <button
              onClick={() =>
                goTo("/admin-categories")
              }
            >

              <span className="quick-icon">
                📂
              </span>

              <strong>
                Categories
              </strong>

              <small>
                Manage course categories.
              </small>

            </button>


            {/* COURSES */}

            <button
              onClick={() =>
                goTo("/admin-courses")
              }
            >

              <span className="quick-icon">
                📚
              </span>

              <strong>
                Courses
              </strong>

              <small>
                Add and manage courses.
              </small>

            </button>


            {/* BATCHES */}

            <button
              onClick={() =>
                goTo("/admin-batches")
              }
            >

              <span className="quick-icon">
                🗓️
              </span>

              <strong>
                Batches
              </strong>

              <small>
                Manage offline and online
                batches.
              </small>

            </button>


            {/* ENROLLMENTS */}

            <button
              onClick={() =>
                goTo("/admin-enrollments")
              }
            >

              <span className="quick-icon">
                📝
              </span>

              <strong>
                Enrollments
              </strong>

              <small>
                Manage student enrollments.
              </small>

            </button>


            {/* PAYMENTS */}

            <button
              onClick={() =>
                goTo("/admin-payments")
              }
            >

              <span className="quick-icon">
                💳
              </span>

              <strong>
                Payments
              </strong>

              <small>
                View payment information.
              </small>

            </button>


            {/* VIDEOS */}

            <button
              onClick={() =>
                goTo("/admin-videos")
              }
            >

              <span className="quick-icon">
                🎥
              </span>

              <strong>
                Course Videos
              </strong>

              <small>
                Manage online course videos.
              </small>

            </button>


            {/* MATERIALS */}

            <button
              onClick={() =>
                goTo("/admin-materials")
              }
            >

              <span className="quick-icon">
                📖
              </span>

              <strong>
                Study Materials
              </strong>

              <small>
                Manage course study materials.
              </small>

            </button>


            {/* CERTIFICATES */}

            <button
              onClick={() =>
                goTo("/admin-certificates")
              }
            >

              <span className="quick-icon">
                🏆
              </span>

              <strong>
                Certificates
              </strong>

              <small>
                Manage student certificates.
              </small>

            </button>


            {/* FEEDBACK */}

            <button
              onClick={() =>
                goTo("/admin-feedback")
              }
            >

              <span className="quick-icon">
                💬
              </span>

              <strong>
                Feedback
              </strong>

              <small>
                View student feedback.
              </small>

            </button>


            {/* GALLERY */}

            <button
              onClick={() =>
                goTo("/admin-gallery")
              }
            >

              <span className="quick-icon">
                🖼️
              </span>

              <strong>
                Gallery
              </strong>

              <small>
                Manage website gallery.
              </small>

            </button>


            {/* CONTACT */}

            <button
              onClick={() =>
                goTo("/admin-contacts")
              }
            >

              <span className="quick-icon">
                📩
              </span>

              <strong>
                Contact Messages
              </strong>

              <small>
                View customer contact messages.
              </small>

            </button>


            {/* REPORTS */}

            <button
              onClick={() =>
                goTo("/admin-reports")
              }
            >

              <span className="quick-icon">
                📊
              </span>

              <strong>
                Reports
              </strong>

              <small>
                View student, course and
                payment reports.
              </small>

            </button>

          </div>

        </section>



        {/* =========================
            ADMIN INFORMATION
        ========================= */}

        <section className="admin-information">

          <h2>
            Admin Information
          </h2>


          <div className="info-grid">


            {/* ADMIN ID */}

            <div className="info-item">

              <label>
                Admin ID
              </label>

              <p>
                {admin.id}
              </p>

            </div>


            {/* ADMIN NAME */}

            <div className="info-item">

              <label>
                Admin Name
              </label>

              <p>
                {admin.name}
              </p>

            </div>


            {/* EMAIL */}

            <div className="info-item">

              <label>
                Email
              </label>

              <p>
                {admin.email}
              </p>

            </div>


            {/* PHONE */}

            <div className="info-item">

              <label>
                Phone
              </label>

              <p>
                {admin.phone || "Not available"}
              </p>

            </div>

          </div>

        </section>


      </main>

    </div>
  );
}


export default AdminDashboard;