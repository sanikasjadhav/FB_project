
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";

import "./StudentCategories.css";

const API_URL = "http://127.0.0.1:8000/api";

function StudentCategories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/categories/`);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.results)) {
        setCategories(data.results);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Category error:", error);

      setMessage(
        "Unable to load categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SELECT CATEGORY
  ===================================================== */

  const handleCategory = (category) => {
    navigate(
      `/student-courses/category/${category.id}`,
      {
        state: {
          category: category,
        },
      }
    );
  };

  /* =====================================================
     COURSE CARDS
     These are displayed directly on this page.
  ===================================================== */

  const courseCards = [
    {
      id: 1,
      title: "Tailoring Class",
      description:
        "Learn basic and professional tailoring skills from measurements to stitching complete garments.",
      duration: "2 Months",
      fees: "₹3,499",
      icon: "✂️",
    },
    {
      id: 2,
      title: "Advance Tailoring",
      description:
        "Improve your tailoring skills with advanced cutting, stitching, fitting and professional garment making.",
      duration: "3 Months",
      fees: "₹5,999",
      icon: "🧵",
    },
    {
      id: 3,
      title: "Embroidery",
      description:
        "Learn beautiful embroidery techniques and create attractive traditional and modern designs.",
      duration: "45 Days",
      fees: "₹2,999",
      icon: "🪡",
    },
    {
      id: 4,
      title: "Dress Stitching",
      description:
        "Learn how to cut, stitch and design different types of dresses with professional finishing.",
      duration: "2 Months",
      fees: "₹4,499",
      icon: "👗",
    },
  ];

  /* =====================================================
     HANDLE COURSE CARD
  ===================================================== */

  const handleCourse = (course) => {
  navigate(
    `/student-courses/category/${course.id}`,
    {
      state: {
        category: course,
      },
    }
  );
};

  return (
    <div className="student-category-page">

      {/* =================================================
          STUDENT SIDEBAR
      ================================================= */}

      <StudentSidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="student-category-main">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="category-page-header">

          <div>

            <h1>
              Explore Courses
            </h1>

            <p>
              Choose a course and start your fashion learning journey.
            </p>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="category-message">

            <p>
              Loading courses...
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && message && (
          <div className="category-message error">

            <p>
              {message}
            </p>

            <button
              onClick={fetchCategories}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            COURSE CARDS
        ================================================= */}

        {!loading && !message && (

          <section className="course-class-section">

            <div className="section-heading">

              <h2>
                Our Courses
              </h2>

              <p>
                Select the course you want to learn.
              </p>

            </div>

            <div className="student-course-class-grid">

              {courseCards.map((course, index) => (

                <div
                  className="student-course-class-card"
                  key={course.id}
                >

                  {/* CARD TOP */}

                  <div className="course-class-top">

                    <span className="course-class-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="course-class-icon">
                      {course.icon}
                    </span>

                  </div>

                  {/* CARD CONTENT */}

                  <div className="course-class-content">

                    <h2>
                      {course.title}
                    </h2>

                    <p>
                      {course.description}
                    </p>

                    {/* COURSE DETAILS */}

                    <div className="course-class-details">

                      <div>
                        <span>
                          Duration
                        </span>

                        <strong>
                          {course.duration}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Fees
                        </span>

                        <strong>
                          {course.fees}
                        </strong>
                      </div>

                    </div>

                    {/* BUTTON */}

                    <button 
                      type="button" 
                      onClick={() => handleCourse(course)} 
                    >
                      View Course Categories
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

        {/* =================================================
            CATEGORIES
            Existing backend categories
        ================================================= */}

        {!loading &&
          !message &&
          categories.length > 0 && (

            <section className="categories-section">

              <div className="section-heading">

                <h2>
                  Course Categories
                </h2>

                <p>
                  Explore courses by category.
                </p>

              </div>

              <div className="student-category-grid">

                {categories.map((category, index) => (

                  <div
                    className="student-category-card"
                    key={category.id}
                  >

                    <div className="category-card-top">

                      <div className="category-number">

                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}

                      </div>

                    </div>

                    <div className="student-category-card-content">

                      <h2>
                        {category.category_name}
                      </h2>

                      <p>
                        {category.description ||
                          "Explore courses available in this category and start your learning journey."}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleCategory(category)
                        }
                      >
                        View Courses
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </section>

          )}

      </main>

    </div>
  );
}

export default StudentCategories;

