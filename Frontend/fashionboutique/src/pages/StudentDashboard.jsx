import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaGraduationCap,
  FaCertificate,
  FaBookOpen,
  FaLayerGroup,
  FaUserGraduate
} from "react-icons/fa";

import StudentSidebar from "../components/StudentSidebar";
import "./StudentDashboard.css";

const API_URL = "http://127.0.0.1:8000/api";

const StudentDashboard = () => {

  // =====================================================
  // STUDENT
  // =====================================================

  const [student, setStudent] = useState(null);


  // =====================================================
  // CATEGORIES
  // =====================================================

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);


  // =====================================================
  // ENROLLMENTS
  // =====================================================

  const [myCourses, setMyCourses] = useState([]);

  const [loadingDashboard, setLoadingDashboard] =
    useState(true);


  // =====================================================
  // CERTIFICATES
  // =====================================================

  const [certificates, setCertificates] =
    useState([]);


  // =====================================================
  // LOAD STUDENT
  // =====================================================

  useEffect(() => {

    const storedStudent =
      localStorage.getItem("student");

    if (storedStudent) {

      try {

        const parsedStudent =
          JSON.parse(storedStudent);

        setStudent(parsedStudent);

      } catch (error) {

        console.error(
          "Error reading student:",
          error
        );

      }

    }

  }, []);


  // =====================================================
  // FETCH CATEGORIES
  // FROM ADMIN CATEGORIES
  // =====================================================

  useEffect(() => {

    fetchCategories();

  }, []);


  const fetchCategories = async () => {

    try {

      setLoadingCategories(true);

      const response =
        await fetch(
          `${API_URL}/categories/`
        );

      if (!response.ok) {

        throw new Error(
          "Failed to fetch categories"
        );

      }

      const data =
        await response.json();

      console.log(
        "Categories from Admin:",
        data
      );


      if (Array.isArray(data)) {

        setCategories(data);

      } else if (
        Array.isArray(data.results)
      ) {

        setCategories(
          data.results
        );

      } else {

        setCategories([]);

      }

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

      setCategories([]);

    } finally {

      setLoadingCategories(false);

    }

  };


  // =====================================================
  // FETCH STUDENT DATA
  // =====================================================

  useEffect(() => {

    if (!student) {
      return;
    }

    fetchStudentData();

  }, [student]);


  // =====================================================
  // FETCH ALL ENROLLMENTS
  // HANDLE DRF PAGINATION
  // =====================================================

  const fetchAllEnrollments = async () => {

    let allEnrollments = [];

    let nextUrl =
      `${API_URL}/enrollments/`;


    try {

      while (nextUrl) {

        const response =
          await fetch(nextUrl);

        if (!response.ok) {

          throw new Error(
            "Failed to fetch enrollments"
          );

        }

        const data =
          await response.json();


        // -------------------------------------------------
        // NON-PAGINATED RESPONSE
        // -------------------------------------------------

        if (Array.isArray(data)) {

          allEnrollments = [
            ...allEnrollments,
            ...data
          ];

          nextUrl = null;

        }

        // -------------------------------------------------
        // PAGINATED RESPONSE
        // -------------------------------------------------

        else {

          if (
            Array.isArray(data.results)
          ) {

            allEnrollments = [
              ...allEnrollments,
              ...data.results
            ];

          }

          nextUrl =
            data.next || null;

        }

      }


      console.log(
        "All enrollments:",
        allEnrollments
      );


      return allEnrollments;

    } catch (error) {

      console.error(
        "Error fetching enrollments:",
        error
      );

      throw error;

    }

  };


  // =====================================================
  // FETCH STUDENT DATA
  // =====================================================

  const fetchStudentData = async () => {

    try {

      setLoadingDashboard(true);


      // =================================================
      // CURRENT LOGGED-IN STUDENT
      // =================================================

      const studentId =
        student?.id ||
        student?.student_id ||
        student?.student?.id;


      const studentFirstName =
        student?.first_name ||
        student?.firstName ||
        student?.student?.first_name ||
        "";


      const studentLastName =
        student?.last_name ||
        student?.lastName ||
        student?.student?.last_name ||
        "";


      const loggedInStudentName =
        `${studentFirstName} ${studentLastName}`
          .trim()
          .toLowerCase();


      const studentEmail =
        student?.email ||
        student?.student?.email ||
        "";


      console.log(
        "================================="
      );

      console.log(
        "Logged in student:",
        student
      );

      console.log(
        "Student ID:",
        studentId
      );

      console.log(
        "Student Name:",
        loggedInStudentName
      );

      console.log(
        "Student Email:",
        studentEmail
      );

      console.log(
        "================================="
      );


      // =================================================
      // FETCH ALL ENROLLMENTS
      // =================================================

      const enrollmentList =
        await fetchAllEnrollments();


      // =================================================
      // FILTER LOGGED-IN STUDENT
      // =================================================

      const studentEnrollments =
        enrollmentList.filter(
          (enrollment) => {

            // ---------------------------------------------
            // STUDENT ID
            // ---------------------------------------------

            const enrollmentStudentId =
              enrollment.student;


            if (
              studentId &&
              enrollmentStudentId
            ) {

              if (
                String(
                  enrollmentStudentId
                ) ===
                String(
                  studentId
                )
              ) {

                return true;

              }

            }


            // ---------------------------------------------
            // STUDENT NAME
            // ---------------------------------------------

            const enrollmentStudentName =
              String(
                enrollment.student_name || ""
              )
                .trim()
                .toLowerCase();


            if (
              loggedInStudentName &&
              enrollmentStudentName
            ) {

              if (
                enrollmentStudentName ===
                loggedInStudentName
              ) {

                return true;

              }

            }


            // ---------------------------------------------
            // STUDENT EMAIL
            // ---------------------------------------------

            const enrollmentStudentEmail =
              String(
                enrollment.student_email || ""
              )
                .trim()
                .toLowerCase();


            if (
              studentEmail &&
              enrollmentStudentEmail
            ) {

              if (
                enrollmentStudentEmail ===
                String(
                  studentEmail
                )
                  .trim()
                  .toLowerCase()
              ) {

                return true;

              }

            }


            return false;

          }
        );


      console.log(
        "================================="
      );

      console.log(
        "Current student enrollments:",
        studentEnrollments
      );

      console.log(
        "Number of student enrollments:",
        studentEnrollments.length
      );

      console.log(
        "================================="
      );


      // =================================================
      // SAVE COURSES
      // =================================================

     // =================================================
// SAVE ONLY ENROLLED / COMPLETED COURSES
// =================================================
// Pending and Cancelled courses will NOT appear
// in Continue Learning or My Courses count.

const validStudentEnrollments =
  studentEnrollments.filter((enrollment) => {
    const status = String(
      enrollment.status || ""
    )
      .trim()
      .toLowerCase();

    return (
      status === "enrolled" ||
      status === "completed"
    );
  });

console.log(
  "Valid enrolled/completed courses:",
  validStudentEnrollments
);

setMyCourses(
  validStudentEnrollments
);


      // =================================================
      // FETCH CERTIFICATES
      // =================================================

      const certificateResponse =
        await fetch(
          `${API_URL}/certificates/`
        );


      if (certificateResponse.ok) {

        const certificateData =
          await certificateResponse.json();


        let certificateList = [];


        if (
          Array.isArray(
            certificateData
          )
        ) {

          certificateList =
            certificateData;

        } else if (
          Array.isArray(
            certificateData.results
          )
        ) {

          certificateList =
            certificateData.results;

        }


        // -------------------------------------------------
        // FILTER CERTIFICATES BY STUDENT
        // -------------------------------------------------

        const studentCertificates =
          certificateList.filter(
            (certificate) => {

              const certificateStudentId =
                certificate.student;


              if (
                studentId &&
                certificateStudentId
              ) {

                return (
                  String(
                    certificateStudentId
                  ) ===
                  String(
                    studentId
                  )
                );

              }


              return false;

            }
          );


        setCertificates(
          studentCertificates
        );

      }


    } catch (error) {

      console.error(
        "Error loading student dashboard:",
        error
      );

      setMyCourses([]);

    } finally {

      setLoadingDashboard(false);

    }

  };


  // =====================================================
  // STUDENT NAME
  // =====================================================

  const studentName =
    student?.first_name ||
    student?.firstName ||
    "Student";


  // =====================================================
  // ACTIVE COURSES
  //
  // ONLY STATUS = "Enrolled"
  // =====================================================

  const activeCourses =
    myCourses.filter(
      (enrollment) =>
        String(
          enrollment.status || ""
        )
          .trim()
          .toLowerCase() ===
        "enrolled"
    );


  // =====================================================
  // ACTIVE COURSE COUNT
  // =====================================================

  const activeCourseCount =
    activeCourses.length;


  // =====================================================
  // GET CATEGORY DESCRIPTION
  // =====================================================

  const getCategoryDescription =
    (category) => {

      return (
        category?.description ||
        "Explore professional fashion boutique courses and develop your skills."
      );

    };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="student-dashboard">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <StudentSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="student-dashboard-main">


        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="dashboard-welcome">

          <div className="welcome-content">

            <span className="welcome-small-text">
              Student Dashboard
            </span>


            <h1>

              Welcome back,{" "}

              <span>
                {studentName}
              </span>

            </h1>


            <p>
              Continue your learning journey
              and build your fashion boutique
              skills.
            </p>

          </div>


          <div className="welcome-icon">

            <FaGraduationCap />

          </div>

        </section>


        {/* =================================================
            STATISTICS
            3 CARDS ONLY
        ================================================= */}

        <section className="dashboard-stats">


          {/* =================================================
              MY COURSES
          ================================================= */}

          <Link
            to="/my-courses"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">

              <FaBookOpen />

            </div>


            <div className="stat-content">

              <h2>

                {loadingDashboard
                  ? "..."
                  : myCourses.length}

              </h2>

              <p>
                My Courses
              </p>

            </div>

          </Link>


          {/* =================================================
              ACTIVE COURSES
          ================================================= */}

          <Link
            to="/my-courses"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">

              <FaLayerGroup />

            </div>


            <div className="stat-content">

              <h2>

                {loadingDashboard
                  ? "..."
                  : activeCourseCount}

              </h2>

              <p>
                Active Courses
              </p>

            </div>

          </Link>


          {/* =================================================
              CERTIFICATES
          ================================================= */}

          <Link
            to="/certificate"
            className="dashboard-stat-card"
          >

            <div className="stat-icon">

              <FaCertificate />

            </div>


            <div className="stat-content">

              <h2>

                {loadingDashboard
                  ? "..."
                  : certificates.length}

              </h2>

              <p>
                Certificates
              </p>

            </div>

          </Link>


        </section>


        {/* =================================================
            CATEGORY COURSES
            CONNECTED TO ADMIN CATEGORIES
        ================================================= */}

        <section className="dashboard-category-section">


          <div className="dashboard-category-heading">

            <div>

              <h2>
                Explore Courses
              </h2>

              <p>
                Choose a category to explore
                available courses.
              </p>

            </div>


            <Link
              to="/categories"
              className="dashboard-category-view-all"
            >

              View All

              <FaArrowRight />

            </Link>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loadingCategories && (

            <div className="dashboard-category-loading">

              <FaGraduationCap />

              <p>
                Loading categories...
              </p>

            </div>

          )}


          {/* =================================================
              NO CATEGORIES
          ================================================= */}

          {!loadingCategories &&
            categories.length === 0 && (

              <div className="dashboard-no-categories">

                <FaGraduationCap />

                <h3>
                  No Categories Available
                </h3>

                <p>
                  Categories added by the
                  administrator will appear
                  here.
                </p>

              </div>

            )}


          {/* =================================================
              CATEGORY CARDS
          ================================================= */}

          {!loadingCategories &&
            categories.length > 0 && (

              <div className="dashboard-category-cards">

                {categories.map(
                  (category, index) => (

                    <div
                      className="dashboard-category-card"
                      key={category.id}
                    >


                      {/* NUMBER */}

                      <div className="category-number">

                        {String(
                          index + 1
                        ).padStart(2, "0")}

                      </div>


                      {/* CATEGORY CONTENT */}

                      <div className="dashboard-category-content">

                        <h3>

                          {
                            category.category_name ||
                            "Category"
                          }

                        </h3>


                        <p>

                          {
                            getCategoryDescription(
                              category
                            )
                          }

                        </p>


                        {/* VIEW COURSES */}

                        <Link
                          to={`/student-courses/category/${category.id}`}
                          className="dashboard-view-courses-btn"
                        >

                          View Courses

                          <FaArrowRight />

                        </Link>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>


        {/* =================================================
            CONTINUE LEARNING
            ORIGINAL LOGIC - NOT CHANGED
        ================================================= */}

        <section className="continue-section">


          <div className="section-heading">

            <div>

              <h2>
                Continue Learning
              </h2>

              <p>
                Pick up where you left off.
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


          {loadingDashboard ? (

            <div className="continue-empty">

              <p>
                Loading your courses...
              </p>

            </div>

          ) : myCourses.length === 0 ? (

            <div className="continue-empty">

              <FaUserGraduate />

              <h3>
                No Enrolled Courses
              </h3>

              <p>
                Explore our courses and
                start learning today.
              </p>

              <Link
                to="/categories"
                className="continue-btn"
              >

                Explore Courses

                <FaArrowRight />

              </Link>

            </div>

          ) : (

            <div className="dashboard-course-list">

              {myCourses.map(
                (enrollment, index) => (

                  <div
                    className="dashboard-course-card"
                    key={
                      enrollment.id ||
                      index
                    }
                  >

                    <div className="dashboard-course-icon">

                      <FaBookOpen />

                    </div>


                    <div className="dashboard-course-info">

                      <h3>

                        {
                          enrollment.course_name ||
                          enrollment.course?.course_name ||
                          "Course"
                        }

                      </h3>


                      <p>
                        Continue learning
                        this course.
                      </p>

                    </div>


                    <Link
                      to="/my-courses"
                      className="continue-btn"
                    >

                      Continue

                      <FaArrowRight />

                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* =================================================
            CERTIFICATE
        ================================================= */}

        {certificates.length > 0 && (

          <section className="dashboard-certificate-section">

            <div className="dashboard-certificate-card">

              <div className="certificate-icon">

                <FaCertificate />

              </div>


              <div>

                <h2>
                  Your Certificate
                </h2>

                <p>
                  You have completed a course
                  and earned a certificate.
                </p>

              </div>


              <Link
                to="/certificate"
                className="certificate-btn"
              >

                View Certificate

                <FaArrowRight />

              </Link>

            </div>

          </section>

        )}


      </main>

    </div>

  );

};

export default StudentDashboard;