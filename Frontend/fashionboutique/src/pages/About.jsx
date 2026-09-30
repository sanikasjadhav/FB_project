
import React, { useEffect, useState } from "react";
import "./About.css";

const API_URL = "http://127.0.0.1:8000/api";

function About() {
  const [feedback, setFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // =========================================
  // Fetch Student Feedback
  // =========================================
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoadingFeedback(true);

      const response = await fetch(`${API_URL}/feedback/`);

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await response.json();

      // Support normal array
      if (Array.isArray(data)) {
        setFeedback(data);
      }

      // Support DRF pagination
      else if (Array.isArray(data.results)) {
        setFeedback(data.results);
      }

      else {
        setFeedback([]);
      }

    } catch (error) {
      console.error("Feedback fetch error:", error);
      setFeedback([]);
    } finally {
      setLoadingFeedback(false);
    }
  };


  // =========================================
  // Get Student Name
  // =========================================
  const getStudentName = (item) => {

    if (item.student_name) {
      return item.student_name;
    }

    if (item.student_display) {
      return item.student_display;
    }

    if (
      item.student?.first_name ||
      item.student?.last_name
    ) {
      return `${item.student?.first_name || ""} ${
        item.student?.last_name || ""
      }`.trim();
    }

    return "Student";
  };


  // =========================================
  // Convert Rating to Stars
  // =========================================
  const getStars = (rating) => {

    switch (rating) {

      case "Excellent":
        return "★★★★★";

      case "Good":
        return "★★★★☆";

      case "Average":
        return "★★★☆☆";

      case "Poor":
        return "★★☆☆☆";

      default:
        return "☆☆☆☆☆";
    }
  };


  // =========================================
  // Get Course Name
  // =========================================
  const getCourseName = (item) => {

    return (
      item.course_name ||
      item.course_display ||
      item.course_title ||
      item.course?.course_name ||
      ""
    );
  };


  return (
    <div className="about-page">

      {/* =====================================
          HERO SECTION
      ====================================== */}
      <section className="about-hero">

        <h1>
          About Fashion Boutique
        </h1>

        <p>
          Learn Fashion Designing, Tailoring, Embroidery, and Boutique
          Management from industry experts.
        </p>

      </section>


      {/* =====================================
          ABOUT SECTION
      ====================================== */}
      <section className="about-section">

        <div className="about-image">

          <img
            src="/images/bg1.png"
            alt="Fashion"
          />

        </div>


        <div className="about-content">

          <h2>
            Who We Are
          </h2>

          <p>
            Fashion Boutique e-Learning Platform provides practical and
            professional fashion education. Our courses are designed to
            help students develop creative skills and start successful
            careers in the fashion industry.
          </p>


          <div className="about-boxes">

            <div className="box">

              <h3>
                🎯 Mission
              </h3>

              <p>
                To empower students through quality fashion education.
              </p>

            </div>


            <div className="box">

              <h3>
                🌍 Vision
              </h3>

              <p>
                To become India's leading online fashion learning
                platform.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          STATISTICS
      ====================================== */}
      <section className="stats">

        <div className="stat-box">

          <h1>
            50+
          </h1>

          <p>
            Students
          </p>

        </div>


        <div className="stat-box">

          <h1>
            10+
          </h1>

          <p>
            Courses
          </p>

        </div>


        <div className="stat-box">

          <h1>
            98%
          </h1>

          <p>
            Success Rate
          </p>

        </div>

      </section>


      {/* =====================================
          STUDENT REVIEWS
      ====================================== */}
      <section className="testimonial">

        <h2>
          Student Reviews
        </h2>


        {/* Loading */}
        {loadingFeedback && (

          <div className="feedback-loading">

            Loading student reviews...

          </div>

        )}


        {/* No Feedback */}
        {!loadingFeedback &&
          feedback.length === 0 && (

          <div className="feedback-empty">

            No student reviews available yet.

          </div>

        )}


        {/* Feedback */}
        {!loadingFeedback &&
          feedback.length > 0 && (

          <div className="review-grid">

            {feedback.map((item) => (

              <div
                className="review-card"
                key={item.id}
              >

                {/* ==========================
                    STAR RATING
                =========================== */}
                <div className="review-rating">

                  {getStars(item.rating)}

                </div>


                {/* ==========================
                    FEEDBACK
                =========================== */}
                <p>

                  {item.feedback ||
                    "No feedback provided."}

                </p>


                {/* ==========================
                    STUDENT NAME
                =========================== */}
                <h4>

                  - {getStudentName(item)}

                </h4>


                {/* ==========================
                    COURSE NAME
                =========================== */}
                {getCourseName(item) && (

                  <span className="review-course">

                    {getCourseName(item)}

                  </span>

                )}

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default About;
