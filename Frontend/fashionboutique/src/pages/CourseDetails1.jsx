import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";

import "./CourseDetails1.css";

const API_URL = "http://127.0.0.1:8000/api";

function CourseDetails() {

  const { courseId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();


  const [course, setCourse] = useState(
    location.state?.course || null
  );

  const [loading, setLoading] = useState(
    !location.state?.course
  );

  const [message, setMessage] = useState("");

  const [selectedMode, setSelectedMode] = useState("");

  const [batches, setBatches] = useState([]);

  const [batchLoading, setBatchLoading] = useState(false);


  /* =====================================================
     FETCH COURSE
  ===================================================== */

  useEffect(() => {

    if (!course) {
      fetchCourse();
    }

  }, [courseId]);


  const fetchCourse = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/courses/${courseId}/`
      );

      if (!response.ok) {
        throw new Error("Course not found");
      }

      const data = await response.json();

      setCourse(data);

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to load course details."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     FETCH BATCHES FOR SELECTED MODE
  ===================================================== */

  useEffect(() => {

    if (
      course?.id &&
      selectedMode
    ) {

      fetchBatches();

    } else {

      setBatches([]);

    }

  }, [course, selectedMode]);


  const fetchBatches = async () => {

    try {

      setBatchLoading(true);

      const response = await fetch(
        `${API_URL}/batches/?course=${course.id}&mode=${selectedMode}`
      );

      if (!response.ok) {
        throw new Error("Unable to load batches");
      }

      const data = await response.json();

      const batchData = Array.isArray(data)
        ? data
        : data.results || [];

      setBatches(batchData);

    } catch (error) {

      console.error(
        "Batch fetch error:",
        error
      );

      setBatches([]);

    } finally {

      setBatchLoading(false);

    }

  };


  /* =====================================================
     SELECT FIRST UPCOMING BATCH
  ===================================================== */

  const upcomingBatch = batches.find(
    (item) =>
      !item.status ||
      item.status.toLowerCase() === "upcoming"
  ) || batches[0];


  /* =====================================================
     ENROLL NOW
  ===================================================== */

  const handleEnroll = () => {

    if (!selectedMode) {

      alert("Please select class mode.");

      return;

    }


    if (!upcomingBatch) {

      alert(
        `No ${selectedMode} batch is currently available for this course.`
      );

      return;

    }


    navigate("/student-enrollment", {

      state: {

        course: course,

        mode: selectedMode,

        batch: upcomingBatch

      }

    });

  };


  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {

    if (course?.category) {

      const categoryId =
        typeof course.category === "object"
          ? course.category.id
          : course.category;

      navigate(
        `/student-courses/category/${categoryId}`
      );

    } else {

      navigate("/categories");

    }

  };


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="course-details-page">

        <StudentSidebar />

        <main className="course-details-main">

          <div className="course-loading">

            Loading course details...

          </div>

        </main>

      </div>

    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (message || !course) {

    return (

      <div className="course-details-page">

        <StudentSidebar />

        <main className="course-details-main">

          <div className="course-error">

            <h2>
              Course Not Found
            </h2>

            <p>
              {message ||
                "This course is not available."}
            </p>

            <button
              onClick={() =>
                navigate("/categories")
              }
            >
              Back to Course Categories
            </button>

          </div>

        </main>

      </div>

    );

  }


  return (

    <div className="course-details-page">

      {/* SIDEBAR */}

      <StudentSidebar />


      {/* MAIN CONTENT */}

      <main className="course-details-main">


        {/* HEADER */}

        <div className="course-details-header">

          <div>

            <h1>
              Course Details
            </h1>

            <p>
              View course information and enroll.
            </p>

          </div>


          <button
            className="back-course-btn"
            onClick={handleBack}
          >
            Back to Course Categories
          </button>

        </div>


        {/* COURSE CARD */}

        <div className="course-details-card">


          {/* LEFT SIDE */}

          <div className="course-details-left">

            <div className="course-large-circle">

              {course.course_name
                ?.charAt(0)
                .toUpperCase()}

            </div>


            <h2>
              {course.course_name}
            </h2>


            <p className="course-full-description">

              {course.description ||
                "Learn professional fashion designing skills with our Fashion Boutique course."}

            </p>

          </div>


          {/* RIGHT SIDE */}

          <div className="course-details-right">


            {/* COURSE INFORMATION */}

            <div className="course-info-row">

              <span>
                Duration
              </span>

              <strong>
                {course.duration || "N/A"}
              </strong>

            </div>


            <div className="course-info-row">

              <span>
                Course Fee
              </span>

              <strong className="details-fee">

                ₹
                {Number(
                  course.fees || 0
                ).toLocaleString("en-IN")}

              </strong>

            </div>


            <div className="course-info-row">

              <span>
                Status
              </span>

              <strong className="details-status">

                {course.status || "Active"}

              </strong>

            </div>


            {/* =================================================
                CLASS MODE
            ================================================= */}

            <div className="mode-section">

              <h3>
                Choose Class Mode
              </h3>


              <div className="mode-options">


                {/* ONLINE */}

                <label
                  className={
                    `mode-card ${
                      selectedMode === "Online"
                        ? "selected"
                        : ""
                    }`
                  }
                >

                  <input
                    type="radio"
                    name="mode"
                    value="Online"
                    checked={
                      selectedMode === "Online"
                    }
                    onChange={(e) =>
                      setSelectedMode(
                        e.target.value
                      )
                    }
                  />


                  <div>

                    <h4>
                      Online
                    </h4>

                    <p>
                      Attend classes online.
                    </p>

                  </div>

                </label>


                {/* OFFLINE */}

                <label
                  className={
                    `mode-card ${
                      selectedMode === "Offline"
                        ? "selected"
                        : ""
                    }`
                  }
                >

                  <input
                    type="radio"
                    name="mode"
                    value="Offline"
                    checked={
                      selectedMode === "Offline"
                    }
                    onChange={(e) =>
                      setSelectedMode(
                        e.target.value
                      )
                    }
                  />


                  <div>

                    <h4>
                      Offline
                    </h4>

                    <p>
                      Attend classes at the boutique.
                    </p>

                  </div>

                </label>

              </div>

            </div>


            {/* =================================================
                START / END DATE
            ================================================= */}

            {selectedMode && (

              <div className="course-dates-section">

                <h3>
                  {selectedMode} Class Schedule
                </h3>


                {batchLoading ? (

                  <p>
                    Loading class dates...
                  </p>

                ) : upcomingBatch ? (

                  <>

                    <div className="course-info-row">

                      <span>
                        Starting Date
                      </span>

                      <strong>
                        {formatDate(
                          upcomingBatch.start_date
                        )}
                      </strong>

                    </div>


                    <div className="course-info-row">

                      <span>
                        Ending Date
                      </span>

                      <strong>
                        {formatDate(
                          upcomingBatch.end_date
                        )}
                      </strong>

                    </div>


                    <div className="course-info-row">

                      <span>
                        Batch
                      </span>

                      <strong>
                        {upcomingBatch.batch_name ||
                          "N/A"}
                      </strong>

                    </div>


                    <div className="course-info-row">

                      <span>
                        Class Timing
                      </span>

                      <strong>
                        {upcomingBatch.timing ||
                          "N/A"}
                      </strong>

                    </div>

                  </>

                ) : (

                  <p className="no-batch-message">

                    No upcoming {selectedMode.toLowerCase()} batch
                    is currently available.

                  </p>

                )}

              </div>

            )}


            {/* =================================================
                ENROLL BUTTON
            ================================================= */}

            <button
              className="enroll-course-btn"
              onClick={handleEnroll}
              disabled={
                !selectedMode ||
                !upcomingBatch
              }
            >
              Enroll Now
            </button>


          </div>

        </div>


        {/* LEARNING FLOW */}

        <div className="course-flow">

          <h2>
            Your Learning Journey
          </h2>


          <div className="flow-items">

            <div className="flow-item">

              <span>
                1
              </span>

              <p>
                Choose Course
              </p>

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>
                2
              </span>

              <p>
                Choose Mode
              </p>

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>
                3
              </span>

              <p>
                Make Payment
              </p>

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>
                4
              </span>

              <p>
                Start Learning
              </p>

            </div>

          </div>

        </div>


      </main>

    </div>

  );

}

export default CourseDetails;