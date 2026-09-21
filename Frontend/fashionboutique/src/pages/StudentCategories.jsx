import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

      const response = await fetch(
        `${API_URL}/categories/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      /*
        Supports both:

        [
          {...},
          {...}
        ]

        and DRF pagination:

        {
          count: 4,
          results: [...]
        }
      */

      if (Array.isArray(data)) {

        setCategories(data);

      } else if (Array.isArray(data.results)) {

        setCategories(data.results);

      } else {

        setCategories([]);

      }

    } catch (error) {

      console.error(
        "Category error:",
        error
      );

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
          category: category
        }
      }
    );

  };


  return (

    <div className="student-category-page">

      {/* =================================================
          COMMON STUDENT SIDEBAR
      ================================================= */}

      <StudentSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="student-category-main">

        {/* PAGE HEADER */}

        <div className="category-page-header">

          <div>

            <h1>
              Explore Courses
            </h1>

            <p>
              Choose a category to explore available courses.
            </p>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="category-message">

            <p>
              Loading categories...
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
            EMPTY
        ================================================= */}

        {!loading &&
          !message &&
          categories.length === 0 && (

            <div className="category-empty">

              <h2>
                No Categories Available
              </h2>

              <p>
                There are currently no courses available.
                Please check again later.
              </p>

          </div>

        )}


        {/* =================================================
            CATEGORY CARDS
        ================================================= */}

        {!loading &&
          !message &&
          categories.length > 0 && (

            <div className="student-category-grid">

              {categories.map((category, index) => (

                <div
                  className="student-category-card"
                  key={category.id}
                >

                  {/* CARD HEADER */}

                  <div className="category-card-top">

                    <div className="category-number">

                      {String(index + 1).padStart(2, "0")}

                    </div>

                  </div>


                  {/* CARD CONTENT */}

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

          )}

      </main>

    </div>

  );
}

export default StudentCategories;