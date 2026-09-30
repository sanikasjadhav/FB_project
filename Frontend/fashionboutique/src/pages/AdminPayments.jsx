import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminPayments.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminPayment = () => {

  // =====================================================
  // STATES
  // =====================================================

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
  // FORM / SEARCH STATES
  // =====================================================

  const [showForm, setShowForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  // =====================================================
  // SEARCH FILTERS
  // =====================================================

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    method: "",
    dateFrom: "",
    dateTo: "",
  });


  // =====================================================
  // FETCH PAYMENTS
  // =====================================================

  const fetchPayments = async () => {

    try {

      const response = await fetch(
        `${API_URL}/payments/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch payments"
        );
      }

      const data = await response.json();

      console.log(
        "Payment API response:",
        data
      );

      if (Array.isArray(data)) {

        setPayments(data);

      } else if (data.results) {

        setPayments(data.results);

      } else {

        setPayments([]);

      }

    } catch (error) {

      console.error(
        "Error fetching payments:",
        error
      );

      setError(
        "Unable to load payment records."
      );

      setPayments([]);

    }

  };


  // =====================================================
  // FETCH ENROLLMENTS
  // =====================================================

  const fetchEnrollments = async () => {

    try {

      const response = await fetch(
        `${API_URL}/enrollments/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch enrollments"
        );
      }

      const data = await response.json();

      console.log(
        "Enrollment API response:",
        data
      );

      if (Array.isArray(data)) {

        setEnrollments(data);

      } else if (data.results) {

        setEnrollments(data.results);

      } else {

        setEnrollments([]);

      }

    } catch (error) {

      console.error(
        "Error fetching enrollments:",
        error
      );

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
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================================
  // OPEN ADD PAYMENT FORM
  // =====================================================

  const openAddForm = () => {

    // Close search
    setShowSearchForm(false);

    // Clear editing
    setEditingId(null);

    // Reset form
    setFormData({
      enrollment: "",
      amount: "",
      method: "Cash",
      transaction_id: "",
      status: "Pending",
    });

    setMessage("");
    setError("");

    // Open form
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =====================================================
  // CLOSE PAYMENT FORM
  // =====================================================

  const closeForm = () => {

    setShowForm(false);

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
  // OPEN SEARCH FORM
  // =====================================================

  const openSearchForm = () => {

    // Close add/edit form
    setShowForm(false);

    // Clear editing
    setEditingId(null);

    // Clear form
    setFormData({
      enrollment: "",
      amount: "",
      method: "Cash",
      transaction_id: "",
      status: "Pending",
    });

    setMessage("");
    setError("");

    // Toggle search
    setShowSearchForm(
      (previous) => !previous
    );

  };


  // =====================================================
  // HANDLE SEARCH FILTER
  // =====================================================

  const handleFilterChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFilters({
      ...filters,
      [name]: value,
    });

  };


  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      status: "",
      method: "",
      dateFrom: "",
      dateTo: "",
    });

  };


  // =====================================================
  // GET PAYMENT DATE
  // =====================================================

  const getPaymentDate = (payment) => {

    return (
      payment.created_at ||
      payment.date ||
      payment.payment_date ||
      ""
    );

  };


  // =====================================================
  // GET STUDENT NAME
  // =====================================================

  const getStudentName = (payment) => {

    if (payment.student_name) {
      return payment.student_name;
    }

    if (
      payment.student &&
      typeof payment.student === "object"
    ) {

      const firstName =
        payment.student.first_name || "";

      const lastName =
        payment.student.last_name || "";

      return `${firstName} ${lastName}`.trim() || "-";

    }

    return "-";

  };


  // =====================================================
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (payment) => {

    if (payment.course_name) {
      return payment.course_name;
    }

    if (
      payment.course &&
      typeof payment.course === "object"
    ) {

      return (
        payment.course.course_name ||
        payment.course.name ||
        "-"
      );

    }

    return "-";

  };


  // =====================================================
  // GET BATCH NAME
  // =====================================================

  const getBatchName = (payment) => {

    if (payment.batch_name) {
      return payment.batch_name;
    }

    if (
      payment.batch &&
      typeof payment.batch === "object"
    ) {

      return (
        payment.batch.batch_name ||
        payment.batch.name ||
        "-"
      );

    }

    return "-";

  };


  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = payments.filter(
    (payment) => {

      const searchText =
        filters.search
          .trim()
          .toLowerCase();


      const studentName =
        getStudentName(payment)
          .toLowerCase();


      const courseName =
        getCourseName(payment)
          .toLowerCase();


      const batchName =
        getBatchName(payment)
          .toLowerCase();


      const transactionId =
        String(
          payment.transaction_id ||
          payment.razorpay_payment_id ||
          ""
        ).toLowerCase();


      const paymentStatus =
        String(
          payment.status || ""
        ).toLowerCase();


      const paymentMethod =
        String(
          payment.method || ""
        ).toLowerCase();


      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        courseName.includes(searchText) ||
        batchName.includes(searchText) ||
        transactionId.includes(searchText);


      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------

      const matchesStatus =
        !filters.status ||
        paymentStatus ===
          filters.status.toLowerCase();


      // -------------------------------------------------
      // METHOD
      // -------------------------------------------------

      const matchesMethod =
        !filters.method ||
        paymentMethod ===
          filters.method.toLowerCase();


      // -------------------------------------------------
      // DATE
      // -------------------------------------------------

      const paymentDate =
        getPaymentDate(payment);


      let matchesDate = true;


      if (paymentDate) {

        const dateOnly =
          new Date(paymentDate)
            .toISOString()
            .split("T")[0];


        if (
          filters.dateFrom &&
          dateOnly < filters.dateFrom
        ) {

          matchesDate = false;

        }


        if (
          filters.dateTo &&
          dateOnly > filters.dateTo
        ) {

          matchesDate = false;

        }

      } else if (
        filters.dateFrom ||
        filters.dateTo
      ) {

        matchesDate = false;

      }


      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesDate
      );

    }
  );


  // =====================================================
  // CSV ESCAPE
  // =====================================================

  const escapeCSV = (value) => {

    return `"${String(
      value ?? ""
    ).replace(/"/g, '""')}"`;

  };


  // =====================================================
  // DOWNLOAD PAYMENT REPORT
  // =====================================================

  const downloadPaymentReport = () => {

    if (
      filteredPayments.length === 0
    ) {

      alert(
        "No payment records available to download."
      );

      return;

    }


    const headers = [
      "Payment ID",
      "Student",
      "Course",
      "Batch",
      "Amount",
      "Method",
      "Transaction ID",
      "Status",
      "Date",
    ];


    const rows =
      filteredPayments.map(
        (payment) => {

          const paymentDate =
            getPaymentDate(payment);


          return [

            payment.id || "",

            getStudentName(payment),

            getCourseName(payment),

            getBatchName(payment),

            payment.amount || "",

            payment.method || "",

            payment.transaction_id ||
              payment.razorpay_payment_id ||
              "",

            payment.status || "",

            paymentDate
              ? new Date(
                  paymentDate
                ).toLocaleDateString(
                  "en-GB"
                )
              : "",

          ];

        }
      );


    const csv = [

      headers
        .map(escapeCSV)
        .join(","),

      ...rows.map(
        (row) =>
          row
            .map(escapeCSV)
            .join(",")
      ),

    ].join("\n");


    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "filtered_payments_report.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  // =====================================================
  // ADD / UPDATE PAYMENT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (
      !formData.enrollment ||
      !formData.amount
    ) {

      setError(
        "Please select enrollment and enter amount."
      );

      return;

    }


    try {

      const paymentData = {

        enrollment:
          Number(
            formData.enrollment
          ),

        amount:
          formData.amount,

        method:
          formData.method,

        transaction_id:
          formData.transaction_id ||
          null,

        status:
          formData.status,

      };


      // =================================================
      // UPDATE PAYMENT
      // =================================================

      if (editingId) {

        const response =
          await fetch(
            `${API_URL}/payments/${editingId}/`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  paymentData
                ),
            }
          );


        const data =
          await response.json();


        console.log(
          "Payment update response:",
          data
        );


        if (!response.ok) {

          console.error(
            "Payment update error:",
            data
          );

          setError(
            JSON.stringify(data)
          );

          return;

        }


        setMessage(
          "Payment updated successfully."
        );


        setEditingId(null);

        setShowForm(false);


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

      const response =
        await fetch(
          `${API_URL}/payments/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                paymentData
              ),
          }
        );


      const data =
        await response.json();


      console.log(
        "Payment save response:",
        data
      );


      if (!response.ok) {

        console.error(
          "Payment backend error:",
          data
        );

        setError(
          JSON.stringify(data)
        );

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


      setShowForm(false);


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


    // Close search
    setShowSearchForm(false);


    // Open form
    setShowForm(true);


    setEditingId(
      payment.id
    );


    setFormData({

      enrollment:
        payment.enrollment ||
        payment.enrollment_id ||
        "",

      amount:
        payment.amount ||
        "",

      method:
        payment.method ||
        "Cash",

      transaction_id:
        payment.transaction_id ||
        payment.razorpay_payment_id ||
        "",

      status:
        payment.status ||
        "Pending",

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

    setShowForm(false);


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

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this payment?"
      );


    if (!confirmed) {

      return;

    }


    try {

      const response =
        await fetch(
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


      await fetchPayments();

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


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="admin-payment-body">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="payment-header">


          <div>

            <h1>
              Payment Management
            </h1>

            <p>
              Manage student course payments
            </p>

          </div>


          <div className="payment-header-buttons">


            {/* SEARCH */}

            <button
              type="button"
              className="search-payment-btn"
              onClick={openSearchForm}
            >

              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Payments"}

            </button>


            {/* ADD */}

            <button
              type="button"
              className="add-payment-btn"
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
            >

              {showForm
                ? "✕ Close Form"
                : "+ Add Payment"}

            </button>


            {/* TOTAL */}

            <div className="payment-total">

              Total Payments:{" "}

              {payments.length}

            </div>

          </div>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

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


        {/* =================================================
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (

          <div className="payment-search-card">


            <div className="payment-search-title">

              <h2>
                Search Payments
              </h2>

              <p>
                Filter payment records by student, course, status or date
              </p>

            </div>


            <div className="payment-search-form">


              {/* SEARCH */}

              <div className="payment-search-field">

                <label>
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search student, course, batch or transaction..."
                />

              </div>


              {/* STATUS */}

              <div className="payment-search-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >

                  <option value="">
                    All Status
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Successful">
                    Successful
                  </option>

                  <option value="Failed">
                    Failed
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Created">
                    Created
                  </option>

                </select>

              </div>


              {/* METHOD */}

              <div className="payment-search-field">

                <label>
                  Payment Method
                </label>

                <select
                  name="method"
                  value={filters.method}
                  onChange={handleFilterChange}
                >

                  <option value="">
                    All Methods
                  </option>

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


              {/* DATE FROM */}

              <div className="payment-search-field">

                <label>
                  Date From
                </label>

                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />

              </div>


              {/* DATE TO */}

              <div className="payment-search-field">

                <label>
                  Date To
                </label>

                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />

              </div>


              {/* ACTIONS */}

              <div className="payment-search-actions">

                <button
                  type="button"
                  className="reset-payment-search-btn"
                  onClick={resetFilters}
                >

                  Reset

                </button>


                <button
                  type="button"
                  className="download-payment-btn"
                  onClick={downloadPaymentReport}
                  disabled={
                    filteredPayments.length === 0
                  }
                >

                  ↓ Download Report

                </button>

              </div>

            </div>


            {/* FILTER COUNT */}

            <div className="payment-filter-result">

              Showing{" "}

              <strong>
                {filteredPayments.length}
              </strong>{" "}

              of{" "}

              <strong>
                {payments.length}
              </strong>{" "}

              payment records

            </div>

          </div>

        )}


        {/* =================================================
            ADD / EDIT PAYMENT FORM
        ================================================= */}

        {showForm && (

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


                <button
                  type="button"
                  className="payment-cancel-btn"
                  onClick={
                    editingId
                      ? handleCancelEdit
                      : closeForm
                  }
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            PAYMENT RECORDS
        ================================================= */}

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


                {filteredPayments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="payment-empty"
                    >

                      {payments.length === 0
                        ? "No payment records found."
                        : "No matching payment records found."}

                    </td>

                  </tr>

                ) : (

                  filteredPayments.map(
                    (payment) => {

                      const paymentDate =
                        getPaymentDate(
                          payment
                        );


                      return (

                        <tr
                          key={
                            payment.id
                          }
                        >


                          {/* ID */}

                          <td>

                            #{payment.id}

                          </td>


                          {/* STUDENT */}

                          <td>

                            {getStudentName(
                              payment
                            )}

                          </td>


                          {/* COURSE */}

                          <td>

                            {getCourseName(
                              payment
                            )}

                          </td>


                          {/* BATCH */}

                          <td>

                            {getBatchName(
                              payment
                            )}

                          </td>


                          {/* AMOUNT */}

                          <td className="payment-amount">

                            ₹{payment.amount}

                          </td>


                          {/* METHOD */}

                          <td>

                            {payment.method ||
                              "-"}

                          </td>


                          {/* TRANSACTION */}

                          <td>

                            {payment.transaction_id ||
                              payment.razorpay_payment_id ||
                              "-"}

                          </td>


                          {/* STATUS */}

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

                              {payment.status ||
                                "-"}

                            </span>

                          </td>


                          {/* DATE */}

                          <td>

                            {paymentDate
                              ? new Date(
                                  paymentDate
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}

                          </td>


                          {/* ACTION */}

                          <td>

                            <div className="payment-action-buttons">


                              <button
                                type="button"
                                className="payment-edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    payment
                                  )
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

                      );

                    }
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