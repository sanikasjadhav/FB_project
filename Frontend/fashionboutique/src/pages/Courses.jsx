import React from "react";
import { Link } from "react-router-dom";
import "./courses.css";

function Courses() {
  const courses = [
  { title: "Fashion Designing", image: "/images/bg1.png", duration: "3 Months", fees: "₹4,999", description: "Learn fashion design from basics.", link: "/courses/fashion" },
  { title: "Boutique Management", image: "/images/bg2.png", duration: "2 Months", fees: "₹3,999", description: "Start and manage your boutique.", link: "/courses/boutique" },
  { title: "Embroidery", image: "/images/emd2.jpg", duration: "45 Days", fees: "₹2,999", description: "Master embroidery techniques.", link: "/courses/embroidery" },
  { title: "Tailoring", image: "/images/tailor.avif", duration: "2 Months", fees: "₹3,499", description: "Professional tailoring course.", link: "/courses/tailoring" },
  { title: "Blouse Designing", image: "/images/course1.jpg", duration: "1 Month", fees: "₹2,499", description: "Modern blouse cutting and stitching.", link: "/courses/blouse" },
  { title: "Kids Wear", image: "/images/emd.jpg", duration: "1 Month", fees: "₹2,199", description: "Design and stitch kids' garments.", link: "/courses/kids" },
  { title: "Aari Work", image: "/images/about.avif", duration: "45 Days", fees: "₹3,299", description: "Traditional Aari embroidery course.", link: "/courses/aari" },
  { title: "Pattern Making", image: "/images/bg3.jpg", duration: "2 Months", fees: "₹4,299", description: "Create accurate garment patterns.", link: "/courses/pattern" },
];

  return (
    <div className="courses-page">
      <h1>Our Courses</h1>

      <div className="course-grid">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <img src={course.image} alt={course.title} />

            <div className="course-content">
              <h2>{course.title}</h2>

              <p className="description">{course.description}</p>

              <p>
                <strong>Duration:</strong> {course.duration}
              </p>

              <p>
                <strong>Fees:</strong> {course.fees}
              </p>

              <Link
                to="/course-details"
                state={course}
                className="details-btn"
              >
                View Details
              </Link>
               
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;