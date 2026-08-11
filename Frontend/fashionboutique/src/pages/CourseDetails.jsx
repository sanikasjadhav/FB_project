import { useLocation, Link } from "react-router-dom";
import "./CourseDetails.css";

function CourseDetails() {
  const location = useLocation();
  const course = location.state;

  if (!course) {
    return (
      <div className="details-container">
        <h2>Course Not Found</h2>
        <Link to="/courses" className="back-btn">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-card">

        <img
          src={course.image}
          alt={course.title}
          className="details-image"
        />

        <h1>{course.title}</h1>

        <p className="description">{course.description}</p>

        <div className="info">
          <h3>Course Duration</h3>
          <p>{course.duration}</p>
        </div>

        <div className="info">
          <h3>Course Fees</h3>
          <p>{course.fees}</p>
        </div>

        <div className="info">
          <h3>What You Will Learn</h3>

          <ul>
            <li>Professional Fashion Designing Skills</li>
            <li>Pattern Making & Garment Construction</li>
            <li>Practical Training</li>
            <li>Latest Boutique Techniques</li>
            <li>Certificate After Course Completion</li>
        </ul>

        </div>

        <Link to="/register" className="register-btn">
          Register Now
        </Link>

        <Link to="/courses" className="back-btn">
          Back
        </Link>

      </div>
    </div>
  );
}

export default CourseDetails;