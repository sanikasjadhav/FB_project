import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminPayments.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [formData, setFormData] = useState({
    enrollment: "",
    amount: "",
    method: "Cash",
    transaction_id: "",
    status: "Pending",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH PAYMENTS
  // =====================================================

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payments/`);

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      console.log("Payment API response:", data);

      if (Array.isArray(data)) {
        setPayments(data);
      } else if (data.results) {
        setPayments(data.results);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);

      setError("Unable to load payment records.");
      setPayments([]);
    }
  };

  // =====================================================
  // FETCH ENROLLMENTS
  // =====================================================

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_URL}/enrollments/`);

      if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      const data = await response.json();

      console.log("Enrollment API response:", data);

      if (Array.isArray(data)) {
        setEnrollments(data);
      } else if (data.results) {
        setEnrollments(data.results);
      } else {
        setEnrollments([]);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);

      setEnrollments([]);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchPayments(),
        fetchEnrollments(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // ADD / UPDATE PAYMENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.enrollment || !formData.amount) {
      setError(
        "Please select enrollment and enter amount."
      );
      return;
    }

    try {
      const paymentData = {
        enrollment: Number(formData.enrollment),
        amount: formData.amount,
        method: formData.method,
        transaction_id:
          formData.transaction_id || null,
        status: formData.status,
      };

      // =================================================
      // UPDATE PAYMENT
      // =================================================

      if (editingId) {
        const response = await fetch(
          `${API_URL}/payments/${editingId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          }
        );

        const data = await response.json();

        console.log("Payment update response:", data);

        if (!response.ok) {
          console.error(
            "Payment update error:",
            data
          );

          setError(JSON.stringify(data));
          return;
        }

        setMessage(
          "Payment updated successfully."
        );

        setEditingId(null);

        setFormData({
          enrollment: "",
          amount: "",
          method: "Cash",
          transaction_id: "",
          status: "Pending",
        });

        await fetchPayments();

        return;
      }

      // =================================================
      // ADD PAYMENT
      // =================================================

      const response = await fetch(
        `${API_URL}/payments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      console.log(
        "Payment save response:",
        data
      );

      if (!response.ok) {
        console.error(
          "Payment backend error:",
          data
        );

        setError(JSON.stringify(data));
        return;
      }

      setMessage(
        "Payment added successfully."
      );

      setFormData({
        enrollment: "",
        amount: "",
        method: "Cash",
        transaction_id: "",
        status: "Pending",
      });

      await fetchPayments();
    } catch (error) {
      console.error(
        "Error saving payment:",
        error
      );

      setError(
        "Unable to connect to backend."
      );
    }
  };

  // =====================================================
  // EDIT PAYMENT
  // =====================================================

  const handleEdit = (payment) => {
    setMessage("");
    setError("");

    setEditingId(payment.id);

    setFormData({
      enrollment:
        payment.enrollment ||
        payment.enrollment_id ||
        "",
      amount: payment.amount || "",
      method: payment.method || "Cash",
      transaction_id:
        payment.transaction_id || "",
      status: payment.status || "Pending",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      enrollment: "",
      amount: "",
      method: "Cash",
      transaction_id: "",
      status: "Pending",
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/payments/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete payment"
        );
      }

      setMessage(
        "Payment deleted successfully."
      );

      if (editingId === id) {
        handleCancelEdit();
      }

      fetchPayments();
    } catch (error) {
      console.error(
        "Delete payment error:",
        error
      );

      setError(
        "Unable to delete payment."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-page-loading">
        Loading payments...
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-payment-layout">

      <AdminSidebar />

      <div className="admin-payment-body">

        {/* ================= HEADER ================= */}

        <div className="payment-header">

          <div>
            <h1>
              Payment Management
            </h1>

            <p>
              Manage student course payments
            </p>
          </div>

          <div className="payment-total">
            Total Payments: {payments.length}
          </div>

        </div>

        {/* ================= MESSAGES ================= */}

        {message && (
          <div className="payment-alert success">
            {message}
          </div>
        )}

        {error && (
          <div className="payment-alert error">
            {error}
          </div>
        )}

        {/* ================= ADD / EDIT PAYMENT ================= */}

        <div className="payment-card">

          <div className="payment-card-title">

            <h2>
              {editingId
                ? "Edit Payment"
                : "Add Payment"}
            </h2>

            <p>
              {editingId
                ? "Update payment details below"
                : "Enter payment details below"}
            </p>

          </div>

          <form
            className="payment-form"
            onSubmit={handleSubmit}
          >

            {/* ENROLLMENT */}

            <div className="payment-input">

              <label>
                Enrollment <span>*</span>
              </label>

              <select
                name="enrollment"
                value={formData.enrollment}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Enrollment
                </option>

                {enrollments.map(
                  (enrollment) => (

                    <option
                      key={enrollment.id}
                      value={enrollment.id}
                    >

                      {enrollment.student_name ||
                        `Student ${
                          enrollment.student
                        }`}

                      {" - "}

                      {enrollment.course_name ||
                        `Course ${
                          enrollment.course
                        }`}

                      {" - "}

                      {enrollment.batch_name ||
                        `Batch ${
                          enrollment.batch ||
                          "No Batch"
                        }`}

                    </option>
                  )
                )}

              </select>

            </div>

            {/* AMOUNT */}

            <div className="payment-input">

              <label>
                Amount <span>*</span>
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                required
              />

            </div>

            {/* METHOD */}

            <div className="payment-input">

              <label>
                Payment Method
              </label>

              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
              >

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

              </select>

            </div>

            {/* TRANSACTION ID */}

            <div className="payment-input">

              <label>
                Transaction ID
              </label>

              <input
                type="text"
                name="transaction_id"
                value={
                  formData.transaction_id
                }
                onChange={handleChange}
                placeholder="Enter transaction ID"
              />

            </div>

            {/* STATUS */}

            <div className="payment-input">

              <label>
                Payment Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Successful">
                  Successful
                </option>

                <option value="Failed">
                  Failed
                </option>

              </select>

            </div>

            {/* BUTTONS */}

            <div className="payment-button-group">

              <button
                type="submit"
                className={
                  editingId
                    ? "payment-update-btn"
                    : "payment-add-btn"
                }
              >

                {editingId
                  ? "Update Payment"
                  : "Add Payment"}

              </button>

              {editingId && (
                <button
                  type="button"
                  className="payment-cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* ================= PAYMENT RECORDS ================= */}

        <div className="payment-card">

          <div className="payment-card-title">

            <h2>
              Payment Records
            </h2>

            <p>
              All student payment transactions
            </p>

          </div>

          <div className="payment-table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {payments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="payment-empty"
                    >
                      No payment records found.
                    </td>

                  </tr>

                ) : (

                  payments.map(
                    (payment) => (

                      <tr key={payment.id}>

                        <td>
                          #{payment.id}
                        </td>

                        <td>
                          {payment.student_name || "-"}
                        </td>

                        <td>
                          {payment.course_name || "-"}
                        </td>

                        <td>
                          {payment.batch_name || "-"}
                        </td>

                        <td className="payment-amount">
                          ₹{payment.amount}
                        </td>

                        <td>
                          {payment.method || "-"}
                        </td>

                        <td>
                          {payment.transaction_id || "-"}
                        </td>

                        <td>

                          <span
                            className={
                              `payment-status ${
                                (
                                  payment.status ||
                                  ""
                                ).toLowerCase()
                              }`
                            }
                          >
                            {payment.status || "-"}
                          </span>

                        </td>

                        <td>

                          {payment.date
                            ? new Date(
                                payment.date
                              ).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}

                        </td>

                        <td>

                          <div className="payment-action-buttons">

                            <button
                              type="button"
                              className="payment-edit-btn"
                              onClick={() =>
                                handleEdit(payment)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="payment-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  payment.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminPayment;