
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";

import "./StudentEnrollment.css";

const API_URL = "http://127.0.0.1:8000/api";

function StudentEnrollment() {

  const location = useLocation();
  const navigate = useNavigate();

  // Course and mode coming from CourseDetails page
  const selectedCourse = location.state?.course || null;
  const selectedMode = location.state?.mode || "";

  const [student, setStudent] = useState(null);
  const [batches, setBatches] = useState([]);

  const [batch, setBatch] = useState("");

  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     CHECK COURSE AND MODE
  ===================================================== */

  useEffect(() => {
  fetchStudent();
}, []);

const fetchStudent = async () => {
  try {
    setLoadingStudent(true);
    setError("");

    // Get currently logged-in student
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {
      setError(
        "Student information not found. Please login again."
      );
      return;
    }

    const loggedInStudent = JSON.parse(savedStudent);

    console.log("Logged-in student:", loggedInStudent);

    // Display the logged-in student's details
    setStudent(loggedInStudent);

  } catch (error) {
    console.error(
      "Student loading error:",
      error
    );

    setError(
      error.message ||
      "Unable to load student information."
    );

  } finally {
    setLoadingStudent(false);
  }
};
  /* =====================================================
     GET OFFLINE BATCHES
  ===================================================== */

  useEffect(() => {

    if (
      selectedMode === "Offline" &&
      selectedCourse?.id
    ) {

      fetchBatches();

    }

  }, [selectedMode, selectedCourse]);


  const fetchBatches = async () => {

    try {

      setLoadingBatches(true);

      const response = await fetch(
        `${API_URL}/batches/?course=${selectedCourse.id}`
      );


      if (!response.ok) {

        throw new Error(
          "Unable to load batches."
        );

      }


      const data = await response.json();

      /*
        Support both:
        [...]
        and
        { results: [...] }
      */

      const batchData =
        Array.isArray(data)
          ? data
          : data.results || [];


      /*
        Only show batches which are upcoming.
        If your API already filters them,
        this is still safe.
      */

      const upcomingBatches =
        batchData.filter(
          (item) =>
            !item.status ||
            item.status === "Upcoming"
        );


      setBatches(upcomingBatches);

    }

    catch (error) {

      console.error(
        "Batch loading error:",
        error
      );

      setError(
        "Unable to load available batches."
      );

    }

    finally {

      setLoadingBatches(false);

    }

  };


  /* =====================================================
     CONTINUE TO PAYMENT
  ===================================================== */

  const handleContinue = (e) => {

    e.preventDefault();

    setError("");




    /* ---------------------------------------------
       Validate Offline Batch
    --------------------------------------------- */

    if (
      selectedMode === "Offline" &&
      !batch
    ) {

      setError(
        "Please select a batch."
      );

      return;

    }


    /*
      Find complete batch object.

      We send the batch ID to Payment page,
      because Enrollment model uses ForeignKey
      to Batch.
    */

    const selectedBatch =
      batches.find(
        (item) =>
          String(item.id) === String(batch)
      ) || null;


    /* ---------------------------------------------
       Go to Payment
    --------------------------------------------- */

    navigate("/payment", {

      state: {

        course: selectedCourse,

        mode: selectedMode,

        batch: selectedBatch,

       

        student: student

      }

    });

  };


  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {

    navigate(-1);

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loadingStudent) {

    return (

      <div className="student-enrollment-page">

        <StudentSidebar />

        <main className="student-enrollment-main">

          <div className="enrollment-loading">

            Loading student information...

          </div>

        </main>

      </div>

    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <div className="student-enrollment-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <StudentSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="student-enrollment-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="student-enrollment-header">

          <div>

            <h1>
              Student Enrollment
            </h1>

            <p>
              Complete your enrollment information
              before payment.
            </p>

          </div>


          <button
            type="button"
            className="enrollment-back-btn"
            onClick={handleBack}
          >
            Back
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="enrollment-error">

            {error}

          </div>

        )}


        {/* =================================================
            MAIN CARD
        ================================================= */}

        <form
          className="student-enrollment-card"
          onSubmit={handleContinue}
        >


          {/* =================================================
              STUDENT INFORMATION
          ================================================= */}

          <section className="enrollment-section">

            <div className="section-title">

              <h2>
                Student Information
              </h2>

              <p>
                Information from your registration
              </p>

            </div>


            <div className="enrollment-grid">


              {/* First Namej */}

              <div className="enrollment-field">

                <label>
                  First Name
                </label>

                <input
                  type="text"
                  value={
                    student?.first_name || ""
                  }
                  readOnly
                />

              </div>


              {/* Last Name */}

              <div className="enrollment-field">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  value={
                    student?.last_name || ""
                  }
                  readOnly
                />

              </div>


              {/* Email */}

              <div className="enrollment-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    student?.email || ""
                  }
                  readOnly
                />

              </div>


              {/* Phone */}

              <div className="enrollment-field">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  value={
                    student?.phone || ""
                  }
                  readOnly
                />

              </div>


              {/* Gender */}

              <div className="enrollment-field">

                <label>
                  Gender
                </label>

                <input
                  type="text"
                  value={
                    student?.gender || ""
                  }
                  readOnly
                />

              </div>


              {/* Address */}

              <div className="enrollment-field full-width">

                <label>
                  Address
                </label>

                <textarea
                  rows="3"
                  value={
                    student?.address || ""
                  }
                  readOnly
                />

              </div>

            </div>

          </section>


          {/* =================================================
              COURSE INFORMATION
          ================================================= */}

          <section className="enrollment-section">

            <div className="section-title">

              <h2>
                Course Information
              </h2>

              <p>
                Selected course details
              </p>

            </div>


            <div className="course-summary">


              <div className="summary-item">

                <span>
                  Course
                </span>

                <strong>
                  {selectedCourse?.course_name}
                </strong>

              </div>


              <div className="summary-item">

                <span>
                  Duration
                </span>

                <strong>
                  {selectedCourse?.duration || "N/A"}
                </strong>

              </div>


              <div className="summary-item">

                <span>
                  Course Fee
                </span>

                <strong className="summary-fee">

                  ₹
                  {Number(
                    selectedCourse?.fees || 0
                  ).toLocaleString("en-IN")}

                </strong>

              </div>

            </div>

          </section>


          {/* =================================================
              CLASS MODE
          ================================================= */}

          <section className="enrollment-section">

            <div className="section-title">

              <h2>
                Class Mode
              </h2>

              <p>
                Your selected learning mode
              </p>

            </div>


            <div className="selected-mode-box">

              <div
                className={
                  selectedMode === "Online"
                    ? "mode-icon online"
                    : "mode-icon offline"
                }
              >
                {selectedMode === "Online"
                  ? "🌐"
                  : "🏫"}
              </div>


              <div>

                <h3>
                  {selectedMode}
                </h3>

                <p>

                  {selectedMode === "Online"
                    ? "Attend classes online from anywhere."
                    : "Attend classes at the boutique."}

                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              OFFLINE BATCH
          ================================================= */}

          {selectedMode === "Offline" && (

            <section className="enrollment-section">

              <div className="section-title">

                <h2>
                  Select Batch
                </h2>

                <p>
                  Choose your preferred offline batch
                </p>

              </div>


              {loadingBatches ? (

                <div className="batch-loading">

                  Loading available batches...

                </div>

              ) : batches.length === 0 ? (

                <div className="no-batches">

                  No upcoming batches are available
                  for this course.

                </div>

              ) : (

                <div className="batch-options">

                  {batches.map((item) => (

                    <label
                      key={item.id}
                      className={
                        `batch-card ${
                          String(batch) ===
                          String(item.id)
                            ? "selected"
                            : ""
                        }`
                      }
                    >

                      <input
                        type="radio"
                        name="batch"
                        value={item.id}
                        checked={
                          String(batch) ===
                          String(item.id)
                        }
                        onChange={(e) =>
                          setBatch(
                            e.target.value
                          )
                        }
                      />


                      <div className="batch-content">

                        <h3>
                          {item.batch_name}
                        </h3>

                        <p>
                          <strong>
                            Timing:
                          </strong>{" "}
                          {item.timing}
                        </p>

                        <p>
                          <strong>
                            Start:
                          </strong>{" "}
                          {item.start_date}
                        </p>

                        <p>
                          <strong>
                            End:
                          </strong>{" "}
                          {item.end_date}
                        </p>

                      </div>

                    </label>

                  ))}

                </div>

              )}

            </section>

          )}


          {/* =================================================
              JOINING DATE
          ================================================= */}

          <section className="enrollment-section">

           


            
       

          </section>


          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

          <section className="payment-summary">

            <div>

              <span>
                Course Fee
              </span>

              <strong>

                ₹
                {Number(
                  selectedCourse?.fees || 0
                ).toLocaleString("en-IN")}

              </strong>

            </div>


            <div>

              <span>
                Payment Method
              </span>

              <strong>
                Online Payment
              </strong>

            </div>

          </section>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="enrollment-actions">

            <button
              type="button"
              className="cancel-enrollment-btn"
              onClick={handleBack}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="continue-payment-btn"
            >
              Continue to Payment →
            </button>

          </div>


        </form>

      </main>

    </div>

  );

}

export default StudentEnrollment;

