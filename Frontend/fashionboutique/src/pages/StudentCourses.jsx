
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import "./StudentCourses.css";

const API_URL = "http://127.0.0.1:8000/api";

function StudentCourses() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(
    location.state?.category || null
  );

  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =====================================================
  // GET LOGGED-IN STUDENT
  // =====================================================

  const getLoggedInStudent = () => {
    try {
      const savedStudent = localStorage.getItem("student");

      if (!savedStudent) {
        return null;
      }

      const student = JSON.parse(savedStudent);

      console.log("LOGGED IN STUDENT:", student);

      return student;
    } catch (error) {
      console.error(
        "Unable to read student:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // LOAD COURSES
  // =====================================================

  const fetchCourses = async () => {
    const response = await fetch(
      `${API_URL}/courses/`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch courses"
      );
    }

    const data = await response.json();

    console.log(
      "COURSES API:",
      data
    );

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  };

  // =====================================================
  // LOAD STUDENT ENROLLMENTS
  // =====================================================

  const fetchStudentEnrollments = async (studentId) => {

    const response = await fetch(
      `${API_URL}/enrollments/?student_id=${studentId}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch enrollments"
      );
    }

    const data = await response.json();

    console.log(
      "ENROLLMENT API RESPONSE:",
      data
    );

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  };

  // =====================================================
  // GET COURSE ID FROM ENROLLMENT
  // =====================================================

  const getCourseIdFromEnrollment = (enrollment) => {

    // Example:
    // course: 6

    if (
      typeof enrollment.course === "number"
    ) {
      return Number(
        enrollment.course
      );
    }

    // Example:
    // course: { id: 6, course_name: "Advance Tailoring" }

    if (
      enrollment.course &&
      typeof enrollment.course === "object"
    ) {
      if (enrollment.course.id) {
        return Number(
          enrollment.course.id
        );
      }
    }

    // Example:
    // course_id: 6

    if (enrollment.course_id) {
      return Number(
        enrollment.course_id
      );
    }

    return null;
  };

  // =====================================================
  // FETCH EVERYTHING
  // =====================================================

  const fetchCoursesAndEnrollments = async () => {

    try {

      setLoading(true);
      setMessage("");

      // -----------------------------------------------
      // CURRENT STUDENT
      // -----------------------------------------------

      const student =
        getLoggedInStudent();

      if (!student) {

        setMessage(
          "Student information not found. Please login again."
        );

        return;
      }

      if (!student.id) {

        console.error(
          "Student ID is missing:",
          student
        );

        setMessage(
          "Student ID not found. Please login again."
        );

        return;
      }

      console.log(
        "CURRENT STUDENT ID:",
        student.id
      );

      // -----------------------------------------------
      // FETCH COURSES
      // -----------------------------------------------

      const allCourses =
        await fetchCourses();

      console.log(
        "ALL COURSES:",
        allCourses
      );

      // -----------------------------------------------
      // FILTER CATEGORY
      // -----------------------------------------------

      const filteredCourses =
        allCourses.filter((course) => {

          if (
            typeof course.category ===
            "number"
          ) {
            return (
              Number(course.category) ===
              Number(categoryId)
            );
          }

          if (
            course.category &&
            typeof course.category ===
              "object"
          ) {
            return (
              Number(
                course.category.id
              ) === Number(categoryId)
            );
          }

          if (course.category_id) {
            return (
              Number(
                course.category_id
              ) === Number(categoryId)
            );
          }

          return false;
        });

      console.log(
        "COURSES FOR CATEGORY:",
        filteredCourses
      );

      setCourses(
        filteredCourses
      );

      // -----------------------------------------------
      // SET CATEGORY
      // -----------------------------------------------

      if (
        !category &&
        filteredCourses.length > 0
      ) {

        const firstCourse =
          filteredCourses[0];

        if (
          firstCourse.category &&
          typeof firstCourse.category ===
            "object"
        ) {
          setCategory(
            firstCourse.category
          );
        }
      }

      // -----------------------------------------------
      // FETCH ONLY CURRENT STUDENT ENROLLMENTS
      // -----------------------------------------------

      const enrollments =
        await fetchStudentEnrollments(
          student.id
        );

      console.log(
        "CURRENT STUDENT ENROLLMENTS:",
        enrollments
      );

      // -----------------------------------------------
      // GET ENROLLED COURSE IDS
      // -----------------------------------------------

      const enrolledIds = [];

      enrollments.forEach(
        (enrollment) => {

          // Ignore cancelled enrollment
          if (
            String(
              enrollment.status
            ).toLowerCase() ===
            "cancelled"
          ) {
            return;
          }

          const courseId =
            getCourseIdFromEnrollment(
              enrollment
            );

          if (courseId !== null) {

            enrolledIds.push(
              Number(courseId)
            );

            console.log(
              "ENROLLED COURSE:",
              enrollment.course_name ||
                enrollment.course,
              "COURSE ID:",
              courseId
            );
          }
        }
      );

      // Remove duplicates
      const uniqueEnrolledIds =
        [...new Set(enrolledIds)];

      console.log(
        "FINAL ENROLLED COURSE IDS:",
        uniqueEnrolledIds
      );

      setEnrolledCourseIds(
        uniqueEnrolledIds
      );

    } catch (error) {

      console.error(
        "ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Unable to load courses."
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {

    fetchCoursesAndEnrollments();

  }, [categoryId]);

  // =====================================================
  // CHECK COURSE ENROLLMENT
  // =====================================================

  const isCourseEnrolled = (
    courseId
  ) => {

    const result =
      enrolledCourseIds.includes(
        Number(courseId)
      );

    console.log(
      "CHECK COURSE:",
      courseId,
      "ENROLLED:",
      result
    );

    return result;
  };

  // =====================================================
  // VIEW COURSE DETAILS
  // =====================================================

  const handleViewCourse = (
    course
  ) => {

    // Safety check
    if (
      isCourseEnrolled(
        course.id
      )
    ) {
      return;
    }

    navigate(
      `/course-details/${course.id}`,
      {
        state: {
          course: course,
          category: category,
        },
      }
    );
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/categories");
  };

  // =====================================================
  // FORMAT FEE
  // =====================================================

  const formatFee = (fee) => {

    return Number(
      fee || 0
    ).toLocaleString("en-IN");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="student-courses-page">

      <StudentSidebar />

      <main className="student-courses-main">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="student-courses-header">

          <div>

            <h1>
              {category?.category_name ||
                category?.name ||
                "Available Courses"}
            </h1>

            <p>
              Choose a course to start your
              learning journey.
            </p>

          </div>

          <button
            className="back-courses-btn"
            onClick={handleBack}
          >
            ← Back to Courses
          </button>

        </div>

        {/* ==========================================
            MESSAGE
        ========================================== */}

        {message && (
          <div className="student-course-error">
            {message}
          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="student-course-loading">
            Loading courses...
          </div>
        )}

        {/* ==========================================
            NO COURSES
        ========================================== */}

        {!loading &&
          !message &&
          courses.length === 0 && (

            <div className="student-course-empty">

              <h3>
                No Courses Available
              </h3>

              <p>
                There are currently no
                courses available in
                this category.
              </p>

            </div>
          )}

        {/* ==========================================
            COURSE GRID
        ========================================== */}

        {!loading &&
          courses.length > 0 && (

            <div className="student-courses-grid">

              {courses.map(
                (course) => {

                  const alreadyEnrolled =
                    isCourseEnrolled(
                      course.id
                    );

                  return (

                    <div
                      key={course.id}
                      className={
                        `student-course-card ${
                          alreadyEnrolled
                            ? "course-already-enrolled"
                            : ""
                        }`
                      }
                    >

                      {/* ================================
                          ICON
                      ================================= */}

                      <div className="course-icon-circle">

                        {course.course_name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "C"}

                      </div>

                      {/* ================================
                          NAME
                      ================================= */}

                      <h2>
                        {course.course_name}
                      </h2>

                      {/* ================================
                          DESCRIPTION
                      ================================= */}

                      <p className="course-description">

                        {course.description ||
                          "Learn professional fashion boutique skills with practical training."}

                      </p>

                      {/* ================================
                          DETAILS
                      ================================= */}

                      <div className="course-details">

                        <div className="course-detail-row">

                          <span>
                            <strong>
                              Duration
                            </strong>
                          </span>

                          <span>
                            {course.duration ||
                              "Not specified"}
                          </span>

                        </div>

                        <div className="course-detail-row">

                          <span>
                            <strong>
                              Course Fee
                            </strong>
                          </span>

                          <span className="course-fee">

                            ₹
                            {formatFee(
                              course.fees
                            )}

                          </span>

                        </div>

                        <div className="course-detail-row">

                          <span>
                            <strong>
                              Status
                            </strong>
                          </span>

                          <span
                            className={`course-status ${
                              String(
                                course.status ||
                                  "Active"
                              ).toLowerCase() ===
                              "active"
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {course.status ||
                              "Active"}
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          ONLY SHOW ONE OF THESE
                      ================================= */}

                      {alreadyEnrolled ? (

                        <div className="course-enrolled-message">

                          <span className="enrolled-check">
                            ✓
                          </span>

                          <span>
                            Enrolled Successfully
                          </span>

                        </div>

                      ) : (

                        <button
                          className="view-course-btn"
                          onClick={() =>
                            handleViewCourse(
                              course
                            )
                          }
                        >
                          View Course Details
                        </button>

                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}

      </main>
    </div>
  );
}

export default StudentCourses;
