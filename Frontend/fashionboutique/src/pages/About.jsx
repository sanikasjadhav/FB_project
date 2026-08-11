import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Fashion Boutique</h1>
        <p>
          Learn Fashion Designing, Tailoring, Embroidery, and Boutique
          Management from industry experts.
        </p>
      </section>

      {/* About Section */}
      <section className="about-section">

        <div className="about-image">
          <img
            src="/images/bg1.png"
            alt="Fashion"
          />
        </div>

        <div className="about-content">

          <h2>Who We Are</h2>

          <p>
            Fashion Boutique e-Learning Platform provides practical and
            professional fashion education. Our courses are designed to
            help students develop creative skills and start successful
            careers in the fashion industry.
          </p>

          <div className="about-boxes">

            <div className="box">
              <h3>🎯 Mission</h3>
              <p>
                To empower students through quality fashion education.
              </p>
            </div>

            <div className="box">
              <h3>🌍 Vision</h3>
              <p>
                To become India's leading online fashion learning
                platform.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Statistics */}
      <section className="stats">

        <div className="stat-box">
          <h1>50+</h1>
          <p>Students</p>
        </div>

        <div className="stat-box">
          <h1>10+</h1>
          <p>Courses</p>
        </div>

        <div className="stat-box">
          <h1>98%</h1>
          <p>Success Rate</p>
        </div>

      </section>

      {/* Testimonials */}
      <section className="testimonial">

        <h2>Student Reviews</h2>

        <div className="review-grid">

          <div className="review-card">
            <h3>⭐⭐⭐⭐⭐</h3>
            <p>
              Amazing course with practical knowledge. Highly recommended.
            </p>
            <h4>- Priya</h4>
          </div>

          <div className="review-card">
            <h3>⭐⭐⭐⭐⭐</h3>
            <p>
              Excellent trainers and easy-to-understand lessons.
            </p>
            <h4>- Sneha</h4>
          </div>

          <div className="review-card">
            <h3>⭐⭐⭐⭐⭐</h3>
            <p>
              Best platform to learn fashion designing online.
            </p>
            <h4>- Anjali</h4>
          </div>

        </div>

      </section>

    </div>
  );
}

export default About;