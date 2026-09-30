
import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import "./StudentFeedback.css";

const API_URL = "http://127.0.0.1:8000/api";

function StudentFeedback() {
  const [student, setStudent] = useState(null);
  const [studentId, setStudentId] = useState("");

  const [courses, setCourses] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  const [formData, setFormData] = useState({
    course: "",
    rating: "",
    feedback: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");

    if (!storedStudent) {
      setError("Student information not found. Please login again.");
      return;
    }

    try {
      const parsedStudent = JSON.parse(storedStudent);

      setStudent(parsedStudent);

      const id =
        parsedStudent.id ||
        parsedStudent.student_id ||
        parsedStudent.pk;

      if (!id) {
        setError("Student ID not found.");
        return;
      }

      setStudentId(id);

      fetchCourses(id);
      fetchFeedback(id);
    } catch (err) {
      console.error("Student data error:", err);
      setError("Invalid student information.");
    }
  }, []);

  // ---------------------------------------
  // Fetch enrolled courses
  // ---------------------------------------
  const fetchCourses = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/enrollments/?student_id=${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      const enrollments = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      const courseData = enrollments
        .map((item) => {
          const courseId =
            item.course_id ||
            item.course ||
            item.course?.id;

          const courseName =
            item.course_name ||
            item.course_display ||
            item.course_title ||
            item.course?.course_name ||
            item.course?.name;

          if (!courseId) {
            return null;
          }

          return {
            id: courseId,
            name: courseName || `Course ${courseId}`,
          };
        })
        .filter(Boolean);

      setCourses(courseData);
    } catch (err) {
      console.error("Course fetch error:", err);
      setError("Unable to load enrolled courses.");
    }
  };

  // ---------------------------------------
  // Fetch student's previous feedback
  // ---------------------------------------
  const fetchFeedback = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/feedback/?student_id=${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setFeedbackList(data);
      } else if (Array.isArray(data.results)) {
        setFeedbackList(data.results);
      } else {
        setFeedbackList([]);
      }
    } catch (err) {
      console.error("Feedback fetch error:", err);
    }
  };

  // ---------------------------------------
  // Handle form changes
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ---------------------------------------
  // Submit feedback
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!studentId) {
      setError("Student ID not found.");
      return;
    }

    if (!formData.course) {
      setError("Please select a course.");
      return;
    }

    if (!formData.rating) {
      setError("Please select a rating.");
      return;
    }

    if (!formData.feedback.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        student: Number(studentId),
        course: Number(formData.course),
        rating: formData.rating,
        feedback: formData.feedback.trim(),
      };

      console.log("Sending feedback:", payload);

      const response = await fetch(`${API_URL}/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      console.log("Feedback API response:", data);

      if (!response.ok) {
        console.error("Feedback error:", data);

        if (typeof data === "object") {
          const errorMessages = Object.entries(data)
            .map(([field, messages]) => {
              const messageText = Array.isArray(messages)
                ? messages.join(", ")
                : messages;

              return `${field}: ${messageText}`;
            })
            .join(" | ");

          throw new Error(errorMessages);
        }

        throw new Error(
          data || "Failed to submit feedback."
        );
      }

      setMessage("Feedback submitted successfully!");

      setFormData({
        course: "",
        rating: "",
        feedback: "",
      });

      // Refresh feedback list
      fetchFeedback(studentId);

    } catch (err) {
      console.error("Submit feedback error:", err);
      setError(err.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Display rating
  // ---------------------------------------
  const getStars = (rating) => {
    switch (rating) {
      case "Excellent":
        return "⭐⭐⭐⭐⭐";

      case "Good":
        return "⭐⭐⭐⭐";

      case "Average":
        return "⭐⭐⭐";

      case "Poor":
        return "⭐⭐";

      default:
        return "";
    }
  };

  // ---------------------------------------
  // Get course name
  // ---------------------------------------
  const getCourseName = (item) => {
    return (
      item.course_name ||
      item.course_display ||
      item.course_title ||
      item.course?.course_name ||
      `Course ${item.course}`
    );
  };

  // ---------------------------------------
  // Get student name
  // ---------------------------------------
  const getStudentName = () => {
    if (!student) {
      return "Student";
    }

    const name =
      `${student.first_name || ""} ${
        student.last_name || ""
      }`.trim();

    return name || student.name || "Student";
  };

  return (
    <div className="student-feedback-layout">

      <StudentSidebar />

      <main className="student-feedback-page">

        <div className="feedback-container">

          <h1>Student Feedback</h1>

          <p className="feedback-subtitle">
            Share your experience with our courses.
          </p>

          {/* Success */}
          {message && (
            <div className="feedback-success">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="feedback-error">
              {error}
            </div>
          )}

          {/* Feedback Form */}
          <div className="feedback-form-card">

            <h2>Give Your Feedback</h2>

            <form onSubmit={handleSubmit}>

              {/* Course */}
              <div className="form-group">

                <label htmlFor="course">
                  Select Course
                </label>

                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">
                    -- Select Course --
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* Rating */}
              <div className="form-group">

                <label htmlFor="rating">
                  Rating
                </label>

                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="">
                    -- Select Rating --
                  </option>

                  <option value="Excellent">
                    ⭐⭐⭐⭐⭐ Excellent
                  </option>

                  <option value="Good">
                    ⭐⭐⭐⭐ Good
                  </option>

                  <option value="Average">
                    ⭐⭐⭐ Average
                  </option>

                  <option value="Poor">
                    ⭐⭐ Poor
                  </option>
                </select>

              </div>

              {/* Feedback */}
              <div className="form-group">

                <label htmlFor="feedback">
                  Your Feedback
                </label>

                <textarea
                  id="feedback"
                  name="feedback"
                  rows="5"
                  placeholder="Write your feedback here..."
                  value={formData.feedback}
                  onChange={handleChange}
                />

              </div>

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>

            </form>

          </div>


          {/* Previous Feedback */}
          <div className="previous-feedback">

            <h2>My Previous Feedback</h2>

            {feedbackList.length === 0 ? (

              <div className="no-feedback">
                You have not submitted any feedback yet.
              </div>

            ) : (

              <div className="feedback-list">

                {feedbackList.map((item) => (

                  <div
                    className="feedback-card"
                    key={item.id}
                  >

                    <div className="feedback-card-header">

                      <h3>
                        {getCourseName(item)}
                      </h3>

                      <span className="feedback-rating">
                        {getStars(item.rating)}
                      </span>

                    </div>

                    <p>
                      {item.feedback}
                    </p>

                    <span className="rating-label">
                      {item.rating}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentFeedback;

