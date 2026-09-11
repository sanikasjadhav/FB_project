import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

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

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");


  /* =====================================================
     FETCH COURSES
  ===================================================== */

  useEffect(() => {

    fetchCourses();

  }, [categoryId]);


  const fetchCourses = async () => {

    try {

      setLoading(true);

      setMessage("");

      /*
        We fetch all courses and filter by category.
        This works with your current Course API.
      */

      const response = await fetch(
        `${API_URL}/courses/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();


      let courseData = [];

      /*
        Support DRF pagination
      */

      if (Array.isArray(data)) {

        courseData = data;

      } else if (Array.isArray(data.results)) {

        courseData = data.results;

      }


      /*
        Filter courses according to category
      */

      const filteredCourses = courseData.filter(
        (course) => {

          /*
            If category is returned as ID
          */

          if (
            typeof course.category === "number"
          ) {
            return (
              course.category ===
              Number(categoryId)
            );
          }


          /*
            If category is returned as object
          */

          if (
            course.category &&
            typeof course.category === "object"
          ) {
            return (
              Number(course.category.id) ===
              Number(categoryId)
            );
          }


          return false;

        }
      );


      setCourses(filteredCourses);


      /*
        If category was not passed through
        location.state, create basic information
      */

      if (!category && filteredCourses.length > 0) {

        const firstCourse = filteredCourses[0];

        if (
          firstCourse.category &&
          typeof firstCourse.category === "object"
        ) {

          setCategory(
            firstCourse.category
          );

        }

      }

    } catch (error) {

      console.error(
        "Course error:",
        error
      );

      setMessage(
        "Unable to load courses. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     VIEW COURSE
  ===================================================== */

  const handleViewCourse = (course) => {

    navigate(
      `/course-details/${course.id}`,
      {
        state: {
          course: course,
          category: category
        }
      }
    );

  };


  /* =====================================================
     BACK TO CATEGORIES
  ===================================================== */

  const handleBack = () => {

    navigate("/categories");

  };


  return (

    <div className="student-courses-page">

      {/* =================================================
          COMMON SIDEBAR
      ================================================= */}

      <StudentSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="student-courses-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="student-courses-header">

          <div>

            <h1>
              {category?.category_name ||
                "Available Courses"}
            </h1>

            <p>
              Choose a course to start your learning journey.
            </p>

          </div>


          <button
            type="button"
            className="back-category-btn"
            onClick={handleBack}
          >
            Back to Courses
          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="student-course-message">

            <p>
              Loading courses...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && message && (

          <div className="student-course-message error">

            <p>
              {message}
            </p>

            <button
              onClick={fetchCourses}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =================================================
            NO COURSES
        ================================================= */}

        {!loading &&
          !message &&
          courses.length === 0 && (

            <div className="student-course-empty">

              <div className="empty-icon">
                📚
              </div>

              <h2>
                No Courses Available
              </h2>

              <p>
                There are currently no active courses
                available in this category.
              </p>


              <button
                type="button"
                onClick={handleBack}
              >
                Choose Another Category
              </button>

            </div>

          )}


        {/* =================================================
            COURSE GRID
        ================================================= */}

        {!loading &&
          !message &&
          courses.length > 0 && (

            <div className="student-course-grid">

              {courses.map((course) => (

                <div
                  className="student-course-card"
                  key={course.id}
                >


                  {/* COURSE TOP */}

                  <div className="student-course-card-top">

                    <div className="course-circle">

                      {course.course_name
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>

                  </div>


                  {/* COURSE CONTENT */}

                  <div className="student-course-card-content">

                    <h2>
                      {course.course_name}
                    </h2>


                    <p className="course-description">

                      {course.description ||
                        "Learn professional skills with our Fashion Boutique course."}

                    </p>


                    {/* COURSE DETAILS */}

                    <div className="course-details">


                      <div className="course-detail-row">

                        <span>
                          Duration
                        </span>

                        <strong>
                          {course.duration || "N/A"}
                        </strong>

                      </div>


                      <div className="course-detail-row">

                        <span>
                          Course Fee
                        </span>

                        <strong className="course-fee">

                          ₹
                          {Number(course.fees || 0).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </div>


                      <div className="course-detail-row">

                        <span>
                          Status
                        </span>

                        <strong className="course-status">

                          {course.status || "Active"}

                        </strong>

                      </div>

                    </div>


                    {/* VIEW COURSE BUTTON */}

                    <button
                      type="button"
                      className="view-course-btn"
                      onClick={() =>
                        handleViewCourse(course)
                      }
                    >
                      View Course Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>

  );

}

export default StudentCourses;