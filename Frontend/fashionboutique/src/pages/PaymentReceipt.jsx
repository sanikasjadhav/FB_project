import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";
import "./PaymentReceipt.css";

const PaymentReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const payment = location.state?.payment;

  // If payment data is not available
  if (!payment) {
    return (
      <div className="student-dashboard">
        <StudentSidebar />

        <main className="student-main-content">
          <div className="receipt-page">
            <div className="receipt-not-found">
              <h2>Payment Details Not Found</h2>

              <p>
                We could not find the payment information.
              </p>

              <button
                onClick={() => navigate("/payment-details")}
              >
                Back to Payment Details
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const student = JSON.parse(
    localStorage.getItem("student")
  );

  const paymentDate = payment.created_at
    ? new Date(payment.created_at).toLocaleString()
    : "-";

  const isPaid =
    payment.status?.toLowerCase() === "paid";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar />

      <main className="student-main-content">
        <div className="receipt-page">

          {/* Header */}
          <div className="receipt-header no-print">

            <div>
              <h1>Payment Receipt</h1>

              <p>
                View your complete course payment details
              </p>
            </div>

            <button
              className="back-payment-btn"
              onClick={() =>
                navigate("/payment-details")
              }
            >
              ← Back to Payments
            </button>

          </div>


          {/* Receipt */}
          <div className="receipt-container">

            {/* Receipt Top */}
            <div className="receipt-top">

              <div className="receipt-logo">
                <div className="logo-circle">
                  FB
                </div>

                <div>
                  <h2>Fashion Boutique</h2>

                  <p>Course Payment Receipt</p>
                </div>
              </div>

              <div className="receipt-status-box">

                <span
                  className={
                    isPaid
                      ? "receipt-status paid"
                      : "receipt-status pending"
                  }
                >
                  {payment.status || "Pending"}
                </span>

                {isPaid && (
                  <p>Payment Successful</p>
                )}

              </div>

            </div>


            {/* Receipt Divider */}
            <div className="receipt-divider"></div>


            {/* Receipt Information */}
            <div className="receipt-info">

              <div className="receipt-section">

                <h3>Student Information</h3>

                <div className="info-row">
                  <span>Name</span>

                  <strong>
                    {student
                      ? `${student.first_name || ""} ${
                          student.last_name || ""
                        }`.trim()
                      : payment.student_name || "-"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Email</span>

                  <strong>
                    {student?.email || "-"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Student ID</span>

                  <strong>
                    {payment.student || student?.id || "-"}
                  </strong>
                </div>

              </div>


              <div className="receipt-section">

                <h3>Payment Information</h3>

                <div className="info-row">
                  <span>Receipt No.</span>

                  <strong>
                    #{payment.id}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Payment Date</span>

                  <strong>
                    {paymentDate}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Payment Status</span>

                  <strong
                    className={
                      isPaid
                        ? "text-paid"
                        : "text-pending"
                    }
                  >
                    {payment.status || "Pending"}
                  </strong>
                </div>

              </div>

            </div>


            {/* Course Details */}
            <div className="course-payment-section">

              <h3>Course Details</h3>

              <div className="course-payment-card">

                <div>
                  <span className="course-label">
                    Course
                  </span>

                  <h2>
                    {payment.course_name || "-"}
                  </h2>
                </div>

                <div className="course-amount">

                  <span>Amount Paid</span>

                  <strong>
                    ₹
                    {Number(
                      payment.amount || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

            </div>


            {/* Razorpay Information */}
            <div className="razorpay-section">

              <h3>Transaction Information</h3>

              <div className="transaction-grid">

                <div className="transaction-item">
                  <span>Razorpay Order ID</span>

                  <strong>
                    {payment.razorpay_order_id ||
                      "-"}
                  </strong>
                </div>

                <div className="transaction-item">
                  <span>Razorpay Payment ID</span>

                  <strong>
                    {payment.razorpay_payment_id ||
                      "-"}
                  </strong>
                </div>

              </div>

            </div>


            {/* Total */}
            <div className="receipt-total">

              <span>Total Paid</span>

              <strong>
                ₹
                {Number(
                  payment.amount || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>


            {/* Footer */}
            <div className="receipt-footer">

              <p>
                Thank you for choosing Fashion Boutique.
              </p>

              <span>
                This is a computer-generated payment
                receipt.
              </span>

            </div>

          </div>


          {/* Buttons */}
          <div className="receipt-actions no-print">

            <button
              className="print-receipt-btn"
              onClick={handlePrint}
            >
              🖨 Print Receipt
            </button>

            <button
              className="my-courses-btn"
              onClick={() =>
                navigate("/my-courses")
              }
            >
              Go to My Courses
            </button>

          </div>

        </div>
      </main>
    </div>
  );
};

export default PaymentReceipt;