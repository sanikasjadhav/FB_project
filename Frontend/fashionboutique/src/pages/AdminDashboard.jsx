import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    const adminData = localStorage.getItem("admin");

    // Admin is not logged in
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
  // NAVIGATION
  // =========================

  const goTo = (path) => {
    navigate(path);
  };

  if (!admin) {
    return (
      <div className="admin-loading">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-logo">

          <h2>Fashion Boutique</h2>

          <span>Admin Panel</span>

        </div>

        {/* Navigation */}
        <nav className="admin-navigation">

          <button
            className="sidebar-link active"
            onClick={() =>
              goTo("/admin-dashboard")
            }
          >
            🏠
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-students")
            }
          >
            👩‍🎓
            <span>Students</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-categories")
            }
          >
            📂
            <span>Categories</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-courses")
            }
          >
            📚
            <span>Courses</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-batches")
            }
          >
            🗓️
            <span>Batches</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-enrollments")
            }
          >
            📝
            <span>Enrollments</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-payments")
            }
          >
            💳
            <span>Payments</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-videos")
            }
          >
            🎥
            <span>Course Videos</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-materials")
            }
          >
            📖
            <span>Study Materials</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-certificates")
            }
          >
            🏆
            <span>Certificates</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-feedback")
            }
          >
            💬
            <span>Feedback</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-gallery")
            }
          >
            🖼️
            <span>Gallery</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              goTo("/admin-contacts")
            }
          >
            📩
            <span>Contact Messages</span>
          </button>

        </nav>

        {/* Logout */}
        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            🚪
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="admin-main">

        {/* ================= HEADER ================= */}

        <header className="admin-header">

          <div className="admin-header-left">

            <h1>Admin Dashboard</h1>

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
                ? admin.name
                    .charAt(0)
                    .toUpperCase()
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

        {/* ================= WELCOME ================= */}

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

        {/* ================= STAT CARDS ================= */}

        <section className="admin-stats">

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

              <h3>Students</h3>

              <p>
                Manage student accounts
              </p>

            </div>

          </div>

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

              <h3>Courses</h3>

              <p>
                Manage courses
              </p>

            </div>

          </div>

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

              <h3>Batches</h3>

              <p>
                Manage course batches
              </p>

            </div>

          </div>

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

              <h3>Payments</h3>

              <p>
                Manage student payments
              </p>

            </div>

          </div>

        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="quick-actions">

          <div className="section-title">

            <h2>Quick Actions</h2>

            <p>
              Quickly access your admin
              management sections.
            </p>

          </div>

          <div className="quick-grid">

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

          </div>

        </section>

        {/* ================= ADMIN INFORMATION ================= */}

        <section className="admin-information">

          <h2>Admin Information</h2>

          <div className="info-grid">

            <div className="info-item">

              <label>
                Admin ID
              </label>

              <p>
                {admin.id}
              </p>

            </div>

            <div className="info-item">

              <label>
                Admin Name
              </label>

              <p>
                {admin.name}
              </p>

            </div>

            <div className="info-item">

              <label>
                Email
              </label>

              <p>
                {admin.email}
              </p>

            </div>

            <div className="info-item">

              <label>
                Phone
              </label>

              <p>
                {admin.phone}
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;