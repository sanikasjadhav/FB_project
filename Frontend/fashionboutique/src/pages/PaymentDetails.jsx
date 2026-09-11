import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";
import "./PaymentDetails.css";

const API_URL = "http://127.0.0.1:8000/api";

const PaymentDetails = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const student = JSON.parse(
    localStorage.getItem("student")
  );

  useEffect(() => {
    const fetchPayments = async () => {
      if (!student?.id) {
        setError("Student information not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/student-payments/?student_id=${student.id}`
        );

        const data = await response.json();

        console.log("Student payments:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load payment details."
          );
        }

        setPayments(data.payments || []);
      } catch (error) {
        console.error("Payment details error:", error);

        setError(
          error.message || "Unable to load payment details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [student?.id]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="student-dashboard">
        <StudentSidebar />

        <main className="student-main-content">
          <div className="payment-details-page">

            <div className="payment-details-header">
              <div>
                <h1>Payment Details</h1>

                <p>
                  View your course payment history
                </p>
              </div>
            </div>

            <div className="payment-details-card loading-card">

              <div className="loading-spinner"></div>

              <h2>
                Loading payment details...
              </h2>

              <p>
                Please wait while we load your payment history.
              </p>

            </div>

          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="student-dashboard">

      <StudentSidebar />

      <main className="student-main-content">

        <div className="payment-details-page">

          {/* PAGE HEADER */}

          <div className="payment-details-header">

            <div>

              <h1>
                Payment Details
              </h1>

              <p>
                View your course payment history
              </p>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="payment-details-error">

              <span>⚠</span>

              {error}

            </div>
          )}


          {/* NO PAYMENTS */}

          {!error && payments.length === 0 && (

            <div className="payment-details-card no-payment-card">

              <div className="empty-icon">
                ₹
              </div>

              <h2>
                No Payments Found
              </h2>

              <p>
                You have not completed any course
                payments yet.
              </p>

              <button
                className="browse-course-btn"
                onClick={() =>
                  navigate("/student-courses")
                }
              >
                Browse Courses
              </button>

            </div>

          )}


          {/* PAYMENTS TABLE */}

          {payments.length > 0 && (

            <div className="payment-details-table-card">

              {/* TABLE HEADER */}

              <div className="payment-details-table-heading">

                <div>

                  <h2>
                    My Payments
                  </h2>

                  <p>
                    Your completed and pending payments
                  </p>

                </div>

                <span className="payment-count">

                  Total Payments: {payments.length}

                </span>

              </div>


              {/* TABLE */}

              <div className="payment-details-table-wrapper">

                <table className="payment-details-table">

                  <thead>

                    <tr>

                      <th>#</th>

                      <th>Course</th>

                      <th>Amount</th>

                      <th>Status</th>

                      <th>Payment Date</th>

                      <th>Action</th>

                    </tr>

                  </thead>


                  <tbody>

                    {payments.map((payment, index) => (

                      <tr key={payment.id}>

                        {/* NUMBER */}

                        <td className="payment-number">

                          {index + 1}

                        </td>


                        {/* COURSE */}

                        <td className="course-name-cell">

                          <strong>
                            {payment.course_name}
                          </strong>

                        </td>


                        {/* AMOUNT */}

                        <td className="amount-cell">

                          ₹
                          {Number(
                            payment.amount || 0
                          ).toLocaleString("en-IN")}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              payment.status?.toLowerCase() ===
                              "paid"
                                ? "payment-status paid"
                                : "payment-status pending"
                            }
                          >
                            {payment.status || "Pending"}
                          </span>

                        </td>


                        {/* DATE */}

                        <td className="date-cell">

                          {payment.created_at
                            ? new Date(
                                payment.created_at
                              ).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"
                          }

                        </td>


                        {/* ACTION */}

                        <td>

                          <div className="payment-actions">

                            <button
                              type="button"
                              className="view-payment-btn"
                              onClick={() =>
                                navigate(
                                  "/payment-details/receipt",
                                  {
                                    state: {
                                      payment: payment,
                                    },
                                  }
                                )
                              }
                            >
                              View Details
                            </button>


                            {payment.status?.toLowerCase() ===
                              "paid" && (

                              <button
                                type="button"
                                className="access-payment-course-btn"
                                onClick={() => {
                                  navigate(
                                    `/my-courses/${payment.enrollment_id}`
                                  );
                                }}
                              >
                                Access Course
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default PaymentDetails;