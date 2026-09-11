import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./StudentSidebar.css";

function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <aside className="student-sidebar">

      {/* ================= LOGO ================= */}

      <div className="student-logo">
        <img
          src="/images/logofbn.jpg"
          alt="Fashion Boutique"
        />

        <h2>Fashion Boutique</h2>
      </div>


      {/* ================= NAVIGATION ================= */}

      <nav className="student-sidebar-nav">

        {/* DASHBOARD */}
        <Link
          to="/student-dashboard"
          className={
            location.pathname === "/student-dashboard"
              ? "active"
              : ""
          }
        >
          Dashboard
        </Link>
        <Link
          to="/categories"
          className={
            location.pathname === "/categories"
              ? "active"
              : ""
          }
        >
          Courses
        </Link>


        {/* COURSE CATEGORIES */}
       


        {/* COURSE DETAILS */}
        
        
        {/* PAYMENT */}
        <Link
          to="/payment-details"
          className={
            location.pathname.startsWith("/payment")
              ? "active"
              : ""
          }
        >
          Payment
        </Link>


        {/* MY COURSES */}
        <Link
          to="/my-courses"
          className={
            location.pathname.startsWith("/my-courses")
              ? "active"
              : ""
          }
        >
          My Courses
        </Link>


        {/* CERTIFICATE */}
        <Link
          to="/certificate"
          className={
            location.pathname.startsWith("/certificate")
              ? "active"
              : ""
          }
        >
          Certificate
        </Link>


        {/* MY PROFILE */}
        <Link
          to="/my-profile"
          className={
            location.pathname.startsWith("/my-profile")
              ? "active"
              : ""
          }
        >
          My Profile
        </Link>


        {/* LOGOUT */}
        <button
          type="button"
          className="student-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

    </aside>
  );
}

export default StudentSidebar;