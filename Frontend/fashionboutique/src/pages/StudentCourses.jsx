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
      console.log("LOGGED IN STUDENT ID:", student?.id);

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
  // LOAD ALL STUDENT ENROLLMENTS
  // =====================================================

  const fetchStudentEnrollments = async (studentId) => {
    let url =
      `${API_URL}/enrollments/?student_id=${studentId}`;

    let allEnrollments = [];

    while (url) {
      console.log(
        "FETCHING ENROLLMENT URL:",
        url
      );

      const response = await fetch(url);

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

      // Non-paginated response
      if (Array.isArray(data)) {
        allEnrollments = [
          ...allEnrollments,
          ...data,
        ];

        break;
      }

      // Paginated DRF response
      if (Array.isArray(data.results)) {
        allEnrollments = [
          ...allEnrollments,
          ...data.results,
        ];

        url = data.next;
      } else {
        break;
      }
    }

    console.log(
      "ALL ENROLLMENTS:",
      allEnrollments
    );

    return allEnrollments;
  };

  // =====================================================
  // GET STUDENT ID FROM ENROLLMENT
  // =====================================================

  const getStudentIdFromEnrollment = (
    enrollment
  ) => {
    // Example:
    // student_id: 14

    if (
      enrollment.student_id !== undefined &&
      enrollment.student_id !== null
    ) {
      return Number(
        enrollment.student_id
      );
    }

    // Example:
    // student: 14

    if (
      typeof enrollment.student === "number" ||
      typeof enrollment.student === "string"
    ) {
      return Number(
        enrollment.student
      );
    }

    // Example:
    // student: { id: 14 }

    if (
      enrollment.student &&
      typeof enrollment.student === "object" &&
      enrollment.student.id !== undefined &&
      enrollment.student.id !== null
    ) {
      return Number(
        enrollment.student.id
      );
    }

    return null;
  };

  // =====================================================
  // GET COURSE ID FROM ENROLLMENT
  // =====================================================

  const getCourseIdFromEnrollment = (
    enrollment
  ) => {
    // Example:
    // course: 2

    if (
      enrollment.course !== undefined &&
      enrollment.course !== null &&
      (
        typeof enrollment.course === "number" ||
        typeof enrollment.course === "string"
      )
    ) {
      return Number(
        enrollment.course
      );
    }

    // Example:
    // course: { id: 2 }

    if (
      enrollment.course &&
      typeof enrollment.course === "object"
    ) {
      if (
        enrollment.course.id !== undefined &&
        enrollment.course.id !== null
      ) {
        return Number(
          enrollment.course.id
        );
      }
    }

    // Example:
    // course_id: 2

    if (
      enrollment.course_id !== undefined &&
      enrollment.course_id !== null
    ) {
      return Number(
        enrollment.course_id
      );
    }

    return null;
  };

  // =====================================================
  // CHECK WHETHER ENROLLMENT IS ACTIVE
  // =====================================================
  // Only Enrolled and Completed courses should show
  // "Enrolled Successfully".
  //
  // Pending      -> NOT enrolled for this page
  // Enrolled     -> enrolled
  // Completed    -> enrolled
  // Cancelled    -> NOT enrolled
  // =====================================================

  const isValidEnrollmentStatus = (status) => {
    const normalizedStatus = String(
      status || ""
    )
      .trim()
      .toLowerCase();

    return (
      normalizedStatus === "enrolled" ||
      normalizedStatus === "completed"
    );
  };

  // =====================================================
  // FETCH COURSES AND ENROLLMENTS
  // =====================================================

  const fetchCoursesAndEnrollments = async () => {
    try {
      setLoading(true);
      setMessage("");

      // =================================================
      // CURRENT STUDENT
      // =================================================

      const student =
        getLoggedInStudent();

      if (!student) {
        setMessage(
          "Student information not found. Please login again."
        );

        return;
      }

      if (
        student.id === undefined ||
        student.id === null
      ) {
        setMessage(
          "Student ID not found. Please login again."
        );

        return;
      }

      console.log(
        "CURRENT STUDENT ID:",
        student.id
      );

      // =================================================
      // FETCH COURSES
      // =================================================

      const allCourses =
        await fetchCourses();

      console.log(
        "ALL COURSES:",
        allCourses
      );

      // =================================================
      // FILTER COURSES BY CATEGORY
      // =================================================

      const filteredCourses =
        allCourses.filter(
          (course) => {

            // category = number
            if (
              typeof course.category ===
              "number"
            ) {
              return (
                Number(course.category) ===
                Number(categoryId)
              );
            }

            // category = object
            if (
              course.category &&
              typeof course.category ===
                "object"
            ) {
              return (
                Number(
                  course.category.id
                ) ===
                Number(categoryId)
              );
            }

            // category_id
            if (
              course.category_id !== undefined &&
              course.category_id !== null
            ) {
              return (
                Number(
                  course.category_id
                ) ===
                Number(categoryId)
              );
            }

            return false;
          }
        );

      console.log(
        "COURSES FOR CATEGORY:",
        filteredCourses
      );

      setCourses(
        filteredCourses
      );

      // =================================================
      // SET CATEGORY
      // =================================================

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

      // =================================================
      // FETCH CURRENT STUDENT ENROLLMENTS
      // =================================================

      const enrollments =
        await fetchStudentEnrollments(
          student.id
        );

      console.log(
        "ALL ENROLLMENTS RETURNED:",
        enrollments
      );

      // =================================================
      // FILTER ONLY LOGGED-IN STUDENT
      // =================================================

      const currentStudentEnrollments =
        enrollments.filter(
          (enrollment) => {

            const enrollmentStudentId =
              getStudentIdFromEnrollment(
                enrollment
              );

            return (
              enrollmentStudentId !== null &&
              Number(
                enrollmentStudentId
              ) ===
              Number(student.id)
            );
          }
        );

      console.log(
        "CURRENT STUDENT ENROLLMENTS:",
        currentStudentEnrollments
      );

      // =================================================
      // GET ONLY ENROLLED/COMPLETED COURSE IDS
      // =================================================

      const enrolledIds = [];

      currentStudentEnrollments.forEach(
        (enrollment) => {

          const status =
            String(
              enrollment.status || ""
            )
              .trim()
              .toLowerCase();

          // ---------------------------------------------
          // IMPORTANT:
          // Pending is NOT treated as enrolled.
          // Cancelled is NOT treated as enrolled.
          // Only Enrolled and Completed are accepted.
          // ---------------------------------------------

          if (
            !isValidEnrollmentStatus(
              enrollment.status
            )
          ) {
            console.log(
              "NOT COUNTING ENROLLMENT:",
              {
                course:
                  enrollment.course_name ||
                  enrollment.course,
                status: status,
              }
            );

            return;
          }

          // ---------------------------------------------
          // GET COURSE ID
          // ---------------------------------------------

          const courseId =
            getCourseIdFromEnrollment(
              enrollment
            );

          if (
            courseId !== null &&
            !Number.isNaN(courseId)
          ) {
            enrolledIds.push(
              Number(courseId)
            );

            console.log(
              "COUNTING ENROLLED COURSE:",
              {
                course:
                  enrollment.course_name ||
                  enrollment.course,
                courseId: courseId,
                status: status,
              }
            );
          }
        }
      );

      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      const uniqueEnrolledIds = [
        ...new Set(
          enrolledIds
        ),
      ];

      console.log(
        "======================================"
      );

      console.log(
        "FINAL ENROLLED COURSE IDS:",
        uniqueEnrolledIds
      );

      console.log(
        "======================================"
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
  // CHECK SPECIFIC COURSE
  // =====================================================

  const isCourseEnrolled = (
    courseId
  ) => {

    const result =
      enrolledCourseIds.some(
        (enrolledId) =>
          Number(enrolledId) ===
          Number(courseId)
      );

    console.log(
      "CHECK COURSE:",
      courseId,
      "ENROLLED COURSE IDS:",
      enrolledCourseIds,
      "RESULT:",
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
    navigate(
      "/categories"
    );
  };

  // =====================================================
  // FORMAT FEE
  // =====================================================

  const formatFee = (
    fee
  ) => {
    return Number(
      fee || 0
    ).toLocaleString(
      "en-IN"
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="student-courses-page">

      <StudentSidebar />

      <main className="student-courses-main">

        {/* ================================================
            HEADER
        ================================================= */}

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

        {/* ================================================
            ERROR MESSAGE
        ================================================= */}

        {message && (
          <div className="student-course-error">
            {message}
          </div>
        )}

        {/* ================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="student-course-loading">
            Loading courses...
          </div>
        )}

        {/* ================================================
            NO COURSES
        ================================================= */}

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

        {/* ================================================
            COURSE GRID
        ================================================= */}

        {!loading &&
          courses.length > 0 && (

            <div className="student-courses-grid">

              {courses.map(
                (course) => {

                  // ---------------------------------------
                  // CHECK ONLY THIS COURSE
                  // ---------------------------------------

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

                      {/* =================================
                          COURSE ICON
                      ================================= */}

                      <div className="course-icon-circle">

                        {course.course_name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "C"}

                      </div>

                      {/* =================================
                          COURSE NAME
                      ================================= */}

                      <h2>
                        {course.course_name}
                      </h2>

                      {/* =================================
                          DESCRIPTION
                      ================================= */}

                      <p className="course-description">

                        {course.description ||
                          "Learn professional fashion boutique skills with practical training."}

                      </p>

                      {/* =================================
                          COURSE DETAILS
                      ================================= */}

                      <div className="course-details">

                        {/* Duration */}

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

                        {/* Course Fee */}

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

                        {/* Status */}

                        <div className="course-detail-row">

                          <span>
                            <strong>
                              Status
                            </strong>
                          </span>

                          <span
                            className={
                              `course-status ${
                                String(
                                  course.status ||
                                    "Active"
                                ).toLowerCase() ===
                                "active"
                                  ? "status-active"
                                  : "status-inactive"
                              }`
                            }
                          >
                            {course.status ||
                              "Active"}
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          ENROLLED OR VIEW DETAILS
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