import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";

import "./Payment.css";

const API_URL = "http://127.0.0.1:8000/api";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Course selected by student
  const course = location.state?.course;

  // Student selected details from StudentEnrollment page
  const mode = location.state?.mode || "";
  const batch = location.state?.batch || null;
  const joiningDate = location.state?.joining_date || "";

  // Student from StudentEnrollment OR localStorage
  const storedStudent = localStorage.getItem("student");

  let student = location.state?.student || null;

  if (!student && storedStudent) {
    try {
      student = JSON.parse(storedStudent);
    } catch (error) {
      console.error("Error reading student data:", error);
    }
  }

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // CHECK COURSE
  // --------------------------------------------------
  if (!course) {
    return (
      <div className="student-layout">
        <StudentSidebar />

        <main className="payment-page">
          <div className="payment-container">
            <div className="payment-card not-found-card">
              <h2>Course Not Found</h2>

              <p>
                Please select a course again before making payment.
              </p>

              <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/student-categories")}
              >
                Select Course
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // OPEN RAZORPAY PAYMENT
  // --------------------------------------------------
  const openRazorpay = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Check student
      if (!student || !student.id) {
        setError("Student information not found. Please login again.");
        setLoading(false);
        return;
      }

      // Check course ID
      if (!course.id) {
        setError("Course ID is missing.");
        setLoading(false);
        return;
      }

      // Check fees
      if (!course.fees) {
        setError("Course fee is missing.");
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // CREATE RAZORPAY ORDER
      // --------------------------------------------------
      const response = await fetch(
        `${API_URL}/create-razorpay-order/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: course.fees,

            // Course information
            course_id: course.id,
            course_name: course.course_name,

            // Student information
            student_id: student.id,

            // Enrollment information
            mode: mode,
            batch_id: batch?.id || null,
            joining_date: joiningDate || null,
          }),
        }
      );

      const data = await response.json();

      console.log("Razorpay order response:", data);

      // --------------------------------------------------
      // ALREADY PAID
      // --------------------------------------------------
      if (data.already_paid) {
        setMessage(
          "You have already paid for this course."
        );

        setTimeout(() => {
          navigate("/my-courses");
        }, 2000);

        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // ORDER CREATION FAILED
      // --------------------------------------------------
      if (!response.ok || !data.success) {
        setError(
          data.error ||
            data.message ||
            "Unable to create payment order."
        );

        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // CHECK RAZORPAY
      // --------------------------------------------------
      if (!window.Razorpay) {
        setError(
          "Razorpay is not loaded. Please check your Razorpay script in index.html."
        );

        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // RAZORPAY OPTIONS
      // --------------------------------------------------
      const options = {
        key: data.key_id,

        amount: data.amount,

        currency: data.currency || "INR",

        name: "Fashion Boutique",

        description: `Payment for ${course.course_name}`,

        order_id: data.order_id,

        prefill: {
          name: `${student.first_name || ""} ${
            student.last_name || ""
          }`.trim(),

          email: student.email || "",

          contact: student.phone || "",
        },

        notes: {
          course_id: String(course.id),

          course_name: course.course_name,

          student_id: String(student.id),

          mode: mode,

          batch_id: batch?.id
            ? String(batch.id)
            : "",
        },

        theme: {
          color: "#F5B942",
        },

        // --------------------------------------------------
        // PAYMENT SUCCESS
        // --------------------------------------------------
        handler: async function (paymentResponse) {
          console.log(
            "Razorpay payment response:",
            paymentResponse
          );

          setMessage("Verifying payment...");
          setError("");

          try {
            // --------------------------------------------------
            // VERIFY PAYMENT
            // --------------------------------------------------
            const verifyResponse = await fetch(
              `${API_URL}/verify-razorpay-payment/`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            console.log(
              "Payment verification response:",
              verifyData
            );

            // --------------------------------------------------
            // VERIFY SUCCESS
            // --------------------------------------------------
            if (
              verifyResponse.ok &&
              verifyData.success
            ) {
              setMessage(
                "Payment successful! Redirecting to My Courses..."
              );

              // Give backend a moment to save enrollment
              setTimeout(() => {
                navigate("/my-courses");
              }, 2000);
            } else {
              setError(
                verifyData.error ||
                  verifyData.message ||
                  "Payment verification failed."
              );
            }
          } catch (verifyError) {
            console.error(
              "Payment verification error:",
              verifyError
            );

            setError(
              "Payment was completed, but verification failed. Please check My Payments."
            );
          } finally {
            setLoading(false);
          }
        },

        // --------------------------------------------------
        // PAYMENT MODAL CLOSED
        // --------------------------------------------------
        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment window closed."
            );

            setLoading(false);
          },
        },
      };

      // --------------------------------------------------
      // OPEN RAZORPAY
      // --------------------------------------------------
      const razorpay = new window.Razorpay(options);

      // Payment failed
      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (paymentError) {
      console.error(
        "Payment error:",
        paymentError
      );

      setError(
        "Something went wrong while starting payment."
      );

      setLoading(false);
    }
  };

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------
  const handleBack = () => {
    navigate(-1);
  };

  // --------------------------------------------------
  // PAGE UI
  // --------------------------------------------------
  return (
    <div className="student-layout">

      {/* STUDENT SIDEBAR */}
      <StudentSidebar />

      {/* PAYMENT CONTENT */}
      <main className="payment-page">
        <div className="payment-container">

          <div className="payment-card">

            <h1>Course Payment</h1>

            <p className="payment-subtitle">
              Complete your payment to enroll in the course.
            </p>

            {/* -------------------------------------------- */}
            {/* COURSE DETAILS */}
            {/* -------------------------------------------- */}

            <div className="course-details">

              <h2>
                {course.course_name}
              </h2>

              {course.description && (
                <p className="course-description">
                  {course.description}
                </p>
              )}

              <div className="detail-row">
                <span>Duration</span>

                <strong>
                  {course.duration || "N/A"}
                </strong>
              </div>

              <div className="detail-row">
                <span>Course Fee</span>

                <strong className="course-fee">
                  ₹
                  {Number(course.fees).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              {/* -------------------------------------------- */}
              {/* MODE */}
              {/* -------------------------------------------- */}

              {mode && (
                <div className="detail-row">
                  <span>Mode</span>

                  <strong>
                    {mode}
                  </strong>
                </div>
              )}

              {/* -------------------------------------------- */}
              {/* BATCH */}
              {/* -------------------------------------------- */}

              {batch && (
                <>
                  <div className="detail-row">
                    <span>Batch</span>

                    <strong>
                      {batch.batch_name}
                    </strong>
                  </div>

                  {batch.start_date && (
                    <div className="detail-row">
                      <span>Batch Start</span>

                      <strong>
                        {batch.start_date}
                      </strong>
                    </div>
                  )}

                  {batch.timing && (
                    <div className="detail-row">
                      <span>Timing</span>

                      <strong>
                        {batch.timing}
                      </strong>
                    </div>
                  )}
                </>
              )}

              {/* -------------------------------------------- */}
              {/* JOINING DATE */}
              {/* -------------------------------------------- */}

              {joiningDate && (
                <div className="detail-row">
                  <span>Joining Date</span>

                  <strong>
                    {joiningDate}
                  </strong>
                </div>
              )}

            </div>

            {/* -------------------------------------------- */}
            {/* STUDENT DETAILS */}
            {/* -------------------------------------------- */}

            {student && (
              <div className="student-details">

                <h3>Student Details</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {student.first_name || ""}{" "}
                  {student.last_name || ""}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {student.email || "N/A"}
                </p>

                {student.phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    {student.phone}
                  </p>
                )}

              </div>
            )}

            {/* -------------------------------------------- */}
            {/* PAYMENT MESSAGE */}
            {/* -------------------------------------------- */}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* -------------------------------------------- */}
            {/* TOTAL */}
            {/* -------------------------------------------- */}

            <div className="payment-total">

              <span>Total Amount</span>

              <strong>
                ₹
                {Number(course.fees).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* -------------------------------------------- */}
            {/* BUTTONS */}
            {/* -------------------------------------------- */}

            <div className="payment-buttons">

              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </button>

              <button
                type="button"
                className="pay-btn"
                onClick={openRazorpay}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${Number(
                      course.fees
                    ).toLocaleString("en-IN")}`}
              </button>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
};

export default Payment;