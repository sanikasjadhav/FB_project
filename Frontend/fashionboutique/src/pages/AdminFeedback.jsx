import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminFeedback.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminFeedback = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [feedbacks, setFeedbacks] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [showSearchForm, setShowSearchForm] =
    useState(false);

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    feedback: "",
    rating: "",
  });

  const [filters, setFilters] = useState({
    search: "",
    rating: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH FEEDBACK
  // =====================================================

  const fetchFeedbacks = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/feedback/`
      );

      const data = await response.json();

      console.log(
        "Feedback API response:",
        data
      );

      if (!response.ok) {

        setError(
          "Unable to load feedback."
        );

        setFeedbacks([]);

        return;
      }

      if (Array.isArray(data)) {

        setFeedbacks(data);

      } else if (data.results) {

        setFeedbacks(data.results);

      } else {

        setFeedbacks([]);
      }

    } catch (err) {

      console.error(
        "Feedback fetch error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );

      setFeedbacks([]);

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // LOAD FEEDBACK
  // =====================================================

  useEffect(() => {

    fetchFeedbacks();

  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // HANDLE SEARCH FILTER CHANGE
  // =====================================================

  const handleFilterChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // OPEN / CLOSE SEARCH FORM
  // =====================================================

  const openSearchForm = () => {

    // Close edit form
    setEditingId(null);

    setFormData({
      student: "",
      course: "",
      feedback: "",
      rating: "",
    });

    // Toggle search form
    setShowSearchForm(
      (previous) => !previous
    );
  };

  // =====================================================
  // RESET SEARCH
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      rating: "",
    });
  };

  // =====================================================
  // FILTER FEEDBACK
  // =====================================================

  const filteredFeedbacks =
    feedbacks.filter((feedback) => {

      const searchText =
        filters.search
          .trim()
          .toLowerCase();

      const studentName = (
        feedback.student_name ||
        feedback.student ||
        ""
      )
        .toString()
        .toLowerCase();

      const courseName = (
        feedback.course_name ||
        feedback.course ||
        ""
      )
        .toString()
        .toLowerCase();

      const feedbackText = (
        feedback.feedback ||
        ""
      )
        .toString()
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        courseName.includes(searchText) ||
        feedbackText.includes(searchText);

      const matchesRating =
        !filters.rating ||
        String(
          feedback.rating || ""
        ) === String(filters.rating);

      return (
        matchesSearch &&
        matchesRating
      );
    });

  // =====================================================
  // EDIT FEEDBACK
  // =====================================================

  const handleEdit = (feedback) => {

    // Close search form
    setShowSearchForm(false);

    setMessage("");
    setError("");

    setEditingId(feedback.id);

    setFormData({
      student:
        feedback.student !== undefined &&
        feedback.student !== null
          ? String(feedback.student)
          : "",

      course:
        feedback.course !== undefined &&
        feedback.course !== null
          ? String(feedback.course)
          : "",

      feedback:
        feedback.feedback || "",

      rating:
        feedback.rating !== undefined &&
        feedback.rating !== null
          ? String(feedback.rating)
          : "",
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
      student: "",
      course: "",
      feedback: "",
      rating: "",
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // UPDATE FEEDBACK
  // =====================================================

  const handleUpdate = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!editingId) {
      return;
    }

    if (
      !formData.feedback ||
      !formData.rating
    ) {

      setError(
        "Please enter feedback and rating."
      );

      return;
    }

    setSaving(true);

    try {

      const updateData = {
        feedback:
          formData.feedback,

        rating:
          Number(formData.rating),
      };

      /*
       * If your Django serializer allows
       * student and course updates, they
       * will also be sent.
       */

      if (formData.student) {

        updateData.student =
          Number(formData.student);
      }

      if (formData.course) {

        updateData.course =
          Number(formData.course);
      }

      const response = await fetch(
        `${API_URL}/feedback/${editingId}/`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              updateData
            ),
        }
      );

      const data =
        await response.json();

      console.log(
        "Feedback update response:",
        data
      );

      if (!response.ok) {

        console.error(
          "Feedback update error:",
          data
        );

        setError(
          JSON.stringify(data)
        );

        setSaving(false);

        return;
      }

      setMessage(
        "Feedback updated successfully."
      );

      setEditingId(null);

      setFormData({
        student: "",
        course: "",
        feedback: "",
        rating: "",
      });

      await fetchFeedbacks();

    } catch (err) {

      console.error(
        "Update feedback error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );
    }

    setSaving(false);
  };

  // =====================================================
  // DELETE FEEDBACK
  // =====================================================

  const deleteFeedback = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this feedback?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `${API_URL}/feedback/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {

        let data = {};

        try {

          data =
            await response.json();

        } catch {
          // DELETE may return empty response
        }

        console.error(
          "Delete feedback error:",
          data
        );

        setError(
          "Unable to delete feedback."
        );

        return;
      }

      setMessage(
        "Feedback deleted successfully."
      );

      if (editingId === id) {

        handleCancelEdit();
      }

      await fetchFeedbacks();

      setTimeout(() => {

        setMessage("");

      }, 3000);

    } catch (err) {

      console.error(
        "Delete feedback error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );
    }
  };

  // =====================================================
  // CSV HELPER
  // =====================================================

  const escapeCSV = (value) => {

    return `"${String(
      value ?? ""
    ).replace(/"/g, '""')}"`;
  };

  // =====================================================
  // DOWNLOAD FILTERED REPORT
  // =====================================================

  const downloadFeedbackReport = () => {

    if (
      filteredFeedbacks.length === 0
    ) {

      alert(
        "No feedback available to download."
      );

      return;
    }

    const headers = [
      "Feedback ID",
      "Student",
      "Course",
      "Feedback",
      "Rating",
    ];

    const rows =
      filteredFeedbacks.map(
        (feedback) => [

          feedback.id || "",

          feedback.student_name ||
            feedback.student ||
            "",

          feedback.course_name ||
            feedback.course ||
            "",

          feedback.feedback ||
            "",

          feedback.rating ||
            "",
        ]
      );

    const csv = [

      headers
        .map(escapeCSV)
        .join(","),

      ...rows.map((row) =>
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
      "filtered_feedback_report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-feedback-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN BODY
      ================================================= */}

      <div className="admin-feedback-body">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="feedback-header">

          <div>

            <h1>
              Feedback
            </h1>

            <p>
              Manage feedback submitted
              by students
            </p>

          </div>


          <div className="feedback-header-buttons">

            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="search-feedback-btn"
              onClick={openSearchForm}
            >

              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Feedback"}

            </button>


            {/* COUNT */}

            <div className="feedback-count">

              Total Feedback:{" "}

              {filteredFeedbacks.length}

            </div>

          </div>

        </div>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (

          <div className="feedback-alert success">

            {message}

          </div>

        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (

          <div className="feedback-alert error">

            {error}

          </div>

        )}


        {/* =================================================
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (

          <div className="feedback-search-card">

            <div className="feedback-search-title">

              <h2>
                Search Feedback
              </h2>

              <p>
                Filter feedback by student,
                course or rating
              </p>

            </div>


            <div className="feedback-search-form">

              {/* SEARCH */}

              <div className="feedback-search-field">

                <label>
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={
                    filters.search
                  }
                  onChange={
                    handleFilterChange
                  }
                  placeholder="Search student, course or feedback..."
                />

              </div>


              {/* RATING */}

              <div className="feedback-search-field">

                <label>
                  Rating
                </label>

                <select
                  name="rating"
                  value={
                    filters.rating
                  }
                  onChange={
                    handleFilterChange
                  }
                >

                  <option value="">
                    All Ratings
                  </option>

                  <option value="1">
                    1 Star
                  </option>

                  <option value="2">
                    2 Stars
                  </option>

                  <option value="3">
                    3 Stars
                  </option>

                  <option value="4">
                    4 Stars
                  </option>

                  <option value="5">
                    5 Stars
                  </option>

                </select>

              </div>


              {/* ACTIONS */}

              <div className="feedback-search-actions">

                <button
                  type="button"
                  className="reset-feedback-search-btn"
                  onClick={
                    resetFilters
                  }
                >
                  Reset
                </button>


                <button
                  type="button"
                  className="download-feedback-btn"
                  onClick={
                    downloadFeedbackReport
                  }
                  disabled={
                    filteredFeedbacks.length ===
                    0
                  }
                >
                  ↓ Download Report
                </button>

              </div>

            </div>


            {/* FILTER RESULT */}

            <div className="feedback-filter-result">

              Showing{" "}

              <strong>
                {filteredFeedbacks.length}
              </strong>

              {" "}of{" "}

              <strong>
                {feedbacks.length}
              </strong>

              {" "}feedback records

            </div>

          </div>

        )}


        {/* =================================================
            EDIT FEEDBACK FORM
        ================================================= */}

        {editingId && (

          <div className="feedback-card feedback-edit-card">

            <div className="feedback-card-title">

              <h2>
                Edit Feedback
              </h2>

              <p>
                Update the selected
                student feedback
              </p>

            </div>


            <form
              className="feedback-edit-form"
              onSubmit={handleUpdate}
            >

              {/* STUDENT */}

              <div className="feedback-input">

                <label>
                  Student
                </label>

                <input
                  type="text"
                  value={
                    formData.student
                  }
                  readOnly
                  placeholder="Student ID"
                />

              </div>


              {/* COURSE */}

              <div className="feedback-input">

                <label>
                  Course
                </label>

                <input
                  type="text"
                  value={
                    formData.course
                  }
                  readOnly
                  placeholder="Course ID"
                />

              </div>


              {/* RATING */}

              <div className="feedback-input">

                <label>
                  Rating <span>*</span>
                </label>

                <select
                  name="rating"
                  value={
                    formData.rating
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Rating
                  </option>

                  <option value="1">
                    1 Star
                  </option>

                  <option value="2">
                    2 Stars
                  </option>

                  <option value="3">
                    3 Stars
                  </option>

                  <option value="4">
                    4 Stars
                  </option>

                  <option value="5">
                    5 Stars
                  </option>

                </select>

              </div>


              {/* FEEDBACK */}

              <div className="feedback-input feedback-textarea">

                <label>
                  Feedback <span>*</span>
                </label>

                <textarea
                  name="feedback"
                  value={
                    formData.feedback
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter feedback"
                  rows="4"
                  required
                />

              </div>


              {/* BUTTONS */}

              <div className="feedback-edit-buttons">

                <button
                  type="submit"
                  className="update-feedback-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Updating..."
                    : "Update Feedback"}

                </button>


                <button
                  type="button"
                  className="cancel-feedback-btn"
                  onClick={
                    handleCancelEdit
                  }
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>
        )}


        {/* =================================================
            FEEDBACK CARD
        ================================================= */}

        <div className="feedback-card">

          <div className="feedback-card-title">

            <h2>
              Student Feedback
            </h2>

            <p>
              View feedback received
              from students
            </p>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          <div className="feedback-table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Feedback
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* LOADING */}

                {loading && (

                  <tr>

                    <td
                      colSpan="6"
                      className="feedback-empty"
                    >
                      Loading feedback...
                    </td>

                  </tr>
                )}


                {/* EMPTY */}

                {!loading &&
                  filteredFeedbacks.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="feedback-empty"
                      >

                        {feedbacks.length === 0
                          ? "No feedback found."
                          : "No matching feedback found."}

                      </td>

                    </tr>
                  )}


                {/* DATA */}

                {!loading &&
                  filteredFeedbacks.length >
                    0 &&
                  filteredFeedbacks.map(
                    (feedback) => (

                      <tr
                        key={
                          feedback.id
                        }
                      >

                        {/* ID */}

                        <td>
                          #{feedback.id}
                        </td>


                        {/* STUDENT */}

                        <td>

                          {feedback.student_name ||
                            "-"}

                        </td>


                        {/* COURSE */}

                        <td>

                          {feedback.course_name ||
                            "-"}

                        </td>


                        {/* FEEDBACK */}

                        <td className="feedback-message">

                          {feedback.feedback ||
                            "-"}

                        </td>


                        {/* RATING */}

                        <td>

                          <span className="feedback-rating">

                            {feedback.rating ||
                              "-"}

                            {feedback.rating &&
                              " / 5"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <div className="feedback-action-buttons">

                            {/* EDIT */}

                            <button
                              type="button"
                              className="edit-feedback-btn"
                              onClick={() =>
                                handleEdit(
                                  feedback
                                )
                              }
                            >

                              Edit

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-feedback-btn"
                              onClick={() =>
                                deleteFeedback(
                                  feedback.id
                                )
                              }
                            >

                              Delete

                            </button>

                          </div>

                        </td>

                      </tr>
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

export default AdminFeedback;