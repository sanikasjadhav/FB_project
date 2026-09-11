import React, { useEffect, useState } from "react";
import "./AdminStudents.css";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/students/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      console.log("Students API:", data);

      // ==============================
      // Django REST Framework pagination
      // ==============================

      if (Array.isArray(data)) {
        setStudents(data);
        setTotalStudents(data.length);
      } else if (data.results) {
        setStudents(data.results);
        setTotalStudents(data.count || data.results.length);
      } else {
        setStudents([]);
        setTotalStudents(0);
      }

      setLoading(false);

    } catch (err) {
      console.error("Student fetch error:", err);

      setError("Unable to load student records.");

      setStudents([]);
      setTotalStudents(0);

      setLoading(false);
    }
  };

  return (
    <div className="admin-students-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="students-sidebar">

        <div className="sidebar-logo">
          <h2>Fashion Boutique</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="students-nav">

          <a href="/admin-dashboard">
            🏠 Dashboard
          </a>

          <a href="/admin-students" className="active">
            👩‍🎓 Students
          </a>

          <a href="/admin-categories">
            📂 Categories
          </a>

          <a href="/admin-courses">
            📚 Courses
          </a>

          <a href="/admin-batches">
            🗓️ Batches
          </a>

          <a href="/admin-enrollment">
            📝 Enrollments
          </a>

          <a href="/admin-payments">
            💳 Payments
          </a>

          <a href="/admin-course-videos">
            🎥 Course Videos
          </a>

          <a href="/admin-study-materials">
            📖 Study Materials
          </a>

          <a href="/admin-certificates">
            🏆 Certificates
          </a>

          <a href="/admin-feedback">
            💬 Feedback
          </a>

          <a href="/admin-gallery">
            🖼️ Gallery
          </a>

          <a href="/admin-contacts">
            📩 Contact Messages
          </a>

          <a href="/admin-reports">
            📊 Reports
          </a>

        </nav>

        <button
          className="students-logout"
          onClick={() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            window.location.href = "/admin-login";
          }}
        >
          🚪 Logout
        </button>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="students-main">

        {/* HEADER */}

        <div className="students-header">

          <div>
            <h1>Students</h1>
            <p>Manage registered students</p>
          </div>

        </div>


        {/* ================= STAT CARD ================= */}

        <div className="student-stat-card">

          <div className="student-stat-icon">
            👩‍🎓
          </div>

          <div>
            <h3>Total Students</h3>

            <h2>
              {totalStudents}
            </h2>
          </div>

        </div>


        {/* ================= STUDENT RECORDS ================= */}

        <div className="students-container">

          <div className="students-title">

            <div>
              <h2>Student Records</h2>

              <p>
                Students registered on the Fashion Boutique website
              </p>
            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="students-error">
              {error}
            </div>
          )}


          {/* LOADING */}

          {loading ? (

            <div className="students-loading">
              Loading student records...
            </div>

          ) : students.length === 0 ? (

            /* NO STUDENTS */

            <div className="no-students">

              <div className="no-students-icon">
                👩‍🎓
              </div>

              <h3>
                No Students Found
              </h3>

              <p>
                No students have registered yet.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="students-table-wrapper">

              <table className="students-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Student Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Gender</th>

                    <th>Address</th>

                  </tr>

                </thead>


                <tbody>

                  {students.map((student) => (

                    <tr key={student.id}>

                      <td>

                        <span className="student-id">
                          #{student.id}
                        </span>

                      </td>


                      <td>

                        <div className="student-name">

                          {student.first_name || ""}{" "}

                          {student.last_name || ""}

                        </div>

                      </td>


                      <td>

                        <span className="student-email">

                          {student.email || "N/A"}

                        </span>

                      </td>


                      <td>
                        {student.phone || "N/A"}
                      </td>


                      <td>
                        {student.gender || "N/A"}
                      </td>


                      <td>

                        <span className="student-address">

                          {student.address || "N/A"}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default AdminStudents;