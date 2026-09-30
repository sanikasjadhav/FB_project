
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./courses.css";

const API_URL = "http://127.0.0.1:8000/api";

function Courses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/courses/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      console.log(
        "Courses API response:",
        data
      );


      // DRF pagination
      if (Array.isArray(data)) {

        setCourses(data);

      } else if (Array.isArray(data.results)) {

        setCourses(data.results);

      } else {

        setCourses([]);

      }

    } catch (error) {

      console.error(
        "Error fetching courses:",
        error
      );

      setError(
        "Unable to load courses."
      );

      setCourses([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD COURSES
  // =====================================================

  useEffect(() => {

    fetchCourses();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="courses-page">

        <h1>Our Courses</h1>

        <div className="courses-message">

          Loading courses...

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="courses-page">

        <h1>Our Courses</h1>

        <div className="courses-message error">

          {error}

          <br />

          <button
            onClick={fetchCourses}
            className="retry-btn"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="courses-page">


      {/* =========================
          PAGE TITLE
      ========================= */}

      <h1>
        Our Courses
      </h1>


      {/* =========================
          NO COURSES
      ========================= */}

      {courses.length === 0 ? (

        <div className="courses-message">

          <h2>
            No Courses Available
          </h2>

          <p>
            Please check back later.
          </p>

        </div>

      ) : (

        <div className="course-grid">


          {courses.map((course) => (

            <div
              className="course-card"
              key={course.id}
            >

              <div className="course-content">


                {/* CATEGORY */}

                <p className="course-category">

                  {course.category_name ||
                    course.category?.category_name ||
                    "Fashion Boutique"}

                </p>


                {/* COURSE NAME */}

                <h2>

                  {course.course_name}

                </h2>


                {/* DESCRIPTION */}

                <p className="description">

                  {course.description ||
                    "Learn professional fashion and boutique skills."}

                </p>


                {/* DURATION */}

                <p>

                  <strong>
                    Duration:
                  </strong>{" "}

                  {course.duration || "N/A"}

                </p>


                {/* FEES */}

                <p>

                  <strong>
                    Fees:
                  </strong>{" "}

                  ₹
                  {course.fees
                    ? Number(course.fees).toLocaleString("en-IN")
                    : "0"}

                </p>


                {/* STATUS */}

                {course.status === "Active" && (

                  <p className="course-available">

                    Available

                  </p>

                )}


                {/* =========================
                    ENROLL NOW
                ========================= */}

                {course.status === "Active" && (

                  <Link
                    to="/registration"
                    state={{
                      course: course
                    }}
                    className="enroll-btn"
                  >

                    Enroll Now

                  </Link>

                )}


                {/* INACTIVE COURSE */}

                {course.status === "Inactive" && (

                  <button
                    className="enroll-btn disabled"
                    disabled
                  >

                    Currently Unavailable

                  </button>

                )}

              </div>

            </div>

          ))}


        </div>

      )}

    </div>

  );

}

export default Courses;
