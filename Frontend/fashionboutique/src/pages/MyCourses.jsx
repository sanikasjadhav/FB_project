import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";
import "./MyCourses.css";

const API_URL = "http://127.0.0.1:8000/api";

const MyCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET JSON SAFELY
  // --------------------------------------------------
  const getJson = async (response) => {
    const contentType = response.headers.get("content-type");
    const text = await response.text();

    console.log("Response status:", response.status);
    console.log("Response type:", contentType);
    console.log("Response:", text);

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Server returned HTML instead of JSON. Status: ${response.status}`
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server returned invalid JSON.");
    }
  };

  // --------------------------------------------------
  // GET LOGGED-IN STUDENT
  // --------------------------------------------------
  const getStudent = () => {
    const studentData = localStorage.getItem("student");

    if (!studentData) {
      return null;
    }

    try {
      return JSON.parse(studentData);
    } catch (error) {
      console.error("Invalid student data:", error);
      return null;
    }
  };

  // --------------------------------------------------
  // FETCH MY COURSES
  // --------------------------------------------------
  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const student = getStudent();

      if (!student) {
        throw new Error("Student login information not found.");
      }

      console.log("Logged-in student:", student);

      const studentId = student.id;

      if (!studentId) {
        throw new Error("Student ID not found.");
      }

      // ------------------------------------------------
      // GET ALL ENROLLMENTS
      // ------------------------------------------------
      const response = await fetch(
        `${API_URL}/enrollments/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await getJson(response);

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to load enrollments."
        );
      }

      console.log("All enrollments:", data);

      // ------------------------------------------------
      // HANDLE PAGINATION
      // ------------------------------------------------
      const enrollmentList = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      console.log("Enrollment list:", enrollmentList);

      // ------------------------------------------------
      // FILTER CURRENT STUDENT
      // ------------------------------------------------
      const myEnrollments = enrollmentList.filter(
        (enrollment) => {
          const enrollmentStudentId =
            typeof enrollment.student === "object"
              ? enrollment.student?.id
              : enrollment.student;

          return (
            String(enrollmentStudentId) ===
            String(studentId)
          );
        }
      );

      console.log("My enrollments:", myEnrollments);

      // ------------------------------------------------
      // ONLY SHOW PAID / ENROLLED COURSES
      // ------------------------------------------------
      const enrolledCourses = myEnrollments.filter(
        (enrollment) =>
          enrollment.status === "Enrolled" ||
          enrollment.status === "Completed"
      );

      console.log(
        "My enrolled courses:",
        enrolledCourses
      );

      setCourses(enrolledCourses);

    } catch (err) {
      console.error("MyCourses error:", err);

      setError(
        err.message || "Unable to load your courses."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOAD COURSES
  // --------------------------------------------------
  useEffect(() => {
    fetchMyCourses();
  }, []);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="student-dashboard">
        <StudentSidebar />

        <main className="student-main-content">
          <div className="my-course-page">
            <h2>Loading your courses...</h2>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------
  if (error) {
    return (
      <div className="student-dashboard">
        <StudentSidebar />

        <main className="student-main-content">
          <div className="my-course-page">

            <div className="course-error">
              <h2>Unable to Load Courses</h2>

              <p>{error}</p>

              <button
                className="retry-button"
                onClick={fetchMyCourses}
              >
                Try Again
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------
  return (
    <div className="student-dashboard">

      <StudentSidebar />

      <main className="student-main-content">

        <div className="my-course-page">

          <div className="course-header">

            <h1>My Courses</h1>

            <p>
              Courses you have successfully enrolled in
            </p>

          </div>

          {/* ------------------------------------------
              NO COURSES
          ------------------------------------------ */}
          {courses.length === 0 ? (
            <div className="no-videos">

              <h3>No Courses Found</h3>

              <p>
                You have not purchased or enrolled in
                any course yet.
              </p>

              <button
                className="watch-video-button"
                onClick={() => navigate("/categories")}
              >
                Browse Courses
              </button>

            </div>
          ) : (

            /* ----------------------------------------
               COURSE CARDS
            ---------------------------------------- */
            <div className="my-courses-grid">

              {courses.map((course) => (

                <div
                  className="my-course-card"
                  key={course.id}
                >

                  <div className="course-card-content">

                    <h2>
                      {course.course_name ||
                        "Course"}
                    </h2>

                    <p>
                      <strong>Status:</strong>{" "}
                      {course.status}
                    </p>

                    <p>
                      <strong>Enrollment Date:</strong>{" "}
                      {course.enrollment_date
                        ? new Date(
                            course.enrollment_date
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                    {course.mode && (
                      <p>
                        <strong>Mode:</strong>{" "}
                        {course.mode}
                      </p>
                    )}

                    <button
                      className="watch-video-button"
                      onClick={() =>
                        navigate(
                          `/my-courses/${course.id}`
                        )
                      }
                    >
                      View Course
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default MyCourses;