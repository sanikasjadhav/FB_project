import React from "react";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";
import { useState } from "react";

function StudentDashboard() {
  const [student, setStudent] = useState(() => {
            const savedStudent = localStorage.getItem("student");

            return savedStudent
              ? JSON.parse(savedStudent)
              : null;
            });
  return (

    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
 
        <div className="logo">
          <img src="/images/logofbn.jpg" alt="Logo" />
          <h2>Fashion Boutique</h2>
        </div>

        <nav className="sidebar-nav">

          <Link to="/dashboard"> Dashboard</Link>

          <Link to="/mycourses">My Courses</Link>

          <Link to="/online">Online Classes</Link>

          <Link to="/offline">Offline Batch</Link>

          <Link to="/payment">Payment</Link>

          <Link to="/quiz">Quiz</Link>

          <Link to="/certificate">Certificate</Link>

          <Link to="/profile"> My Profile</Link>

          <Link to="/login"> Logout</Link>

        </nav>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* WELCOME */}
        <div className="welcome">

          <div>
            
            <h1>Hello,{" "}
          {student?.first_name || "Student"} 👋</h1>

            <p>
              Welcome to your Fashion Boutique Learning Dashboard.
            </p>
          </div>

          <img
            src="/images/dashboard.png"
            alt="Dashboard"
          />

        </div>


        {/* STATISTICS */}
        <div className="cards">

          <div className="card">
            <h2>03</h2>
            <p>Enrolled Courses</p>
          </div>

          <div className="card">
            <h2>15</h2>
            <p>Videos Completed</p>
          </div>

          <div className="card">
            <h2>02</h2>
            <p>Certificates</p>
          </div>

          <div className="card">
            <h2>85%</h2>
            <p>Course Progress</p>
          </div>

        </div>


        {/* CONTINUE LEARNING */}
        <div className="course-box">

          <h2>Continue Learning</h2>

          <div className="course">

            <img
              src="/images/bg1.png"
              alt="Fashion Designing"
            />

            <div className="course-info">

              <h3>Fashion Designing</h3>

              <p>Progress : 65%</p>

              <progress
                value="65"
                max="100"
              ></progress>

              <br />

              <button>
                Continue Course
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;