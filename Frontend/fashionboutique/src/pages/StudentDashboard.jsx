import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBookOpen,
  FaGraduationCap,
  FaVideo,
  FaCertificate,
  FaArrowRight,
} from "react-icons/fa";

import StudentSidebar from "../components/StudentSidebar";

import "./StudentDashboard.css";

function StudentDashboard() {
  const [student] = useState(() => {
    const savedStudent = localStorage.getItem("student");

    return savedStudent ? JSON.parse(savedStudent) : null;
  });

  const studentName = student?.first_name || "Student";

  return (
    <div className="student-dashboard">

      {/* ================= COMMON SIDEBAR ================= */}

      <StudentSidebar />


      {/* ================= MAIN CONTENT ================= */}

      <main className="student-main-content">

        {/* ================= WELCOME ================= */}

        <section className="student-welcome">

          <div className="welcome-text">

            <h1>
              Hello, {studentName} 👋
            </h1>

            <p>
              Welcome back to your Fashion Boutique
              Learning Dashboard.
            </p>

            <Link
              to="/categories"
              className="explore-btn"
            >
              Explore Courses
              <FaArrowRight />
            </Link>

          </div>


          

        </section>


        {/* ================= STATISTICS ================= */}

        <section className="student-statistics">

          {/* MY COURSES */}

          <div className="student-stat-card">

            <div className="stat-icon">
              <FaBookOpen />
            </div>

            <div>
              <h2>0</h2>
              <p>My Courses</p>
            </div>

          </div>


          {/* VIDEOS COMPLETED */}

          <div className="student-stat-card">

            <div className="stat-icon">
              <FaVideo />
            </div>

            <div>
              <h2>0</h2>
              <p>Videos Completed</p>
            </div>

          </div>


          {/* ACTIVE COURSES */}

          <div className="student-stat-card">

            <div className="stat-icon">
              <FaGraduationCap />
            </div>

            <div>
              <h2>0</h2>
              <p>Active Courses</p>
            </div>

          </div>


          {/* CERTIFICATES */}

          <div className="student-stat-card">

            <div className="stat-icon">
              <FaCertificate />
            </div>

            <div>
              <h2>0</h2>
              <p>Certificates</p>
            </div>

          </div>

        </section>


        {/* ================= EXPLORE COURSES ================= */}

        <section className="explore-section">

          <div className="section-heading">

            <div>

              <h2>
                Explore Courses
              </h2>

              <p>
                Choose a course and start your learning journey.
              </p>

            </div>


            <Link
              to="/categories"
              className="view-all-btn"
            >
              View All
              <FaArrowRight />
            </Link>

          </div>


          <div className="category-cards">


            {/* ================= FASHION DESIGNING ================= */}

            <div className="category-card">

              <img
                src="/images/course1.jpg"
                alt="Fashion Designing"
              />

              <div className="category-card-content">

                <h3>
                  Fashion Designing
                </h3>

                <p>
                  Learn fashion illustration,
                  pattern making, cutting and stitching.
                </p>

                <Link
                  to="/course-details"
                  className="category-btn"
                >
                  Explore
                  <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* ================= BOUTIQUE MANAGEMENT ================= */}

            <div className="category-card">

              <img
                src="/images/course1.jpg"
                alt="Boutique Management"
              />

              <div className="category-card-content">

                <h3>
                  Boutique Management
                </h3>

                <p>
                  Learn how to manage and
                  successfully run a fashion boutique.
                </p>

                <Link
                  to="/course-details"
                  className="category-btn"
                >
                  Explore
                  <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* ================= EMBROIDERY ================= */}

            <div className="category-card">

              <img
                src="/images/course1.jpg"
                alt="Embroidery"
              />

              <div className="category-card-content">

                <h3>
                  Embroidery
                </h3>

                <p>
                  Learn beautiful embroidery
                  techniques and creative designs.
                </p>

                <Link
                  to="/course-details"
                  className="category-btn"
                >
                  Explore
                  <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* ================= TAILORING ================= */}

            <div className="category-card">

              <img
                src="/images/course1.jpg"
                alt="Tailoring"
              />

              <div className="category-card-content">

                <h3>
                  Tailoring
                </h3>

                <p>
                  Learn professional tailoring,
                  measurements and garment construction.
                </p>

                <Link
                  to="/course-details"
                  className="category-btn"
                >
                  Explore
                  <FaArrowRight />
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* ================= CONTINUE LEARNING ================= */}

        <section className="continue-learning-section">

          <div className="section-heading">

            <div>

              <h2>
                Continue Learning
              </h2>

              <p>
                Your enrolled courses will appear here.
              </p>

            </div>


            <Link
              to="/my-courses"
              className="view-all-btn"
            >
              My Courses
              <FaArrowRight />
            </Link>

          </div>


          {/* ================= EMPTY STATE ================= */}

          <div className="empty-course-box">

            <FaGraduationCap
              className="empty-course-icon"
            />

            <h3>
              No Courses Yet
            </h3>

            <p>
              You have not enrolled in any course yet.
              Explore our courses and start learning.
            </p>

            <Link
              to="/categories"
              className="explore-btn"
            >
              Explore Courses
              <FaArrowRight />
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;