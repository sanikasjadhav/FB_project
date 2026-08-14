import React from "react";
import { Link } from "react-router-dom";
import "./MyCourses.css";

function MyCourses() {
  const courses = [
    {
      title: "Fashion Designing",
      duration: "3 Months",
      progress: 65,
      image: "/images/bg1.png",
      status: "In Progress",
    },
    {
      title: "Boutique Management",
      duration: "2 Months",
      progress: 80,
      image: "/images/course2.jpg",
      status: "In Progress",
    },
    {
      title: "Embroidery",
      duration: "45 Days",
      progress: 100,
      image: "/images/course3.jpg",
      status: "Completed",
    },
  ];

  return (
    <div className="mycourses-page">

      {/* TOP HEADER */}
      <header className="courses-header">
        <div>
          <h1>My Courses</h1>
          <p>View and continue your enrolled courses.</p>
        </div>

        <Link to="/dashboard" className="dashboard-btn">
          ← Dashboard
        </Link>
      </header>

      {/* COURSE STATISTICS */}
      <div className="course-stats">

        <div className="course-stat-card">
          <h2>03</h2>
          <p>Enrolled Courses</p>
        </div>

        <div className="course-stat-card">
          <h2>02</h2>
          <p>Courses In Progress</p>
        </div>

        <div className="course-stat-card">
          <h2>01</h2>
          <p>Completed Courses</p>
        </div>

      </div>

      {/* COURSE LIST */}
      <section className="courses-section">

        <h2>My Enrolled Courses</h2>

        <div className="courses-grid">

          {courses.map((course, index) => (

            <div className="my-course-card" key={index}>

              <div className="course-image">
                <img
                  src={course.image}
                  alt={course.title}
                />

                <span className={course.progress === 100 ? "completed" : ""}>
                  {course.status}
                </span>
              </div>

              <div className="my-course-info">

                <h3>{course.title}</h3>

                <p className="duration">
                  Duration: {course.duration}
                </p>

                <div className="progress-heading">
                  <span>Progress</span>
                  <strong>{course.progress}%</strong>
                </div>

                <progress
                  value={course.progress}
                  max="100"
                ></progress>

                {course.progress === 100 ? (
                  <button className="certificate-btn">
                    View Certificate
                  </button>
                ) : (
                  <button className="continue-btn">
                    Continue Course
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default MyCourses;