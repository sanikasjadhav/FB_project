import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminBatches.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminBatches = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Search form
  const [showSearchForm, setShowSearchForm] = useState(false);

  // Search / Filter
  const [filters, setFilters] = useState({
    search: "",
    course: "",
    mode: "",
    status: "",
    startFrom: "",
    startTo: "",
  });

  // Form data
  const [formData, setFormData] = useState({
    course: "",
    batch_name: "",
    mode: "Online",
    start_date: "",
    end_date: "",
    timing: "",
    status: "Upcoming",
  });

  // =========================================================
  // FETCH BATCHES
  // =========================================================

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/batches/`);

      if (!response.ok) {
        throw new Error("Failed to fetch batches.");
      }

      const data = await response.json();

      const batchData = Array.isArray(data)
        ? data
        : data.results || [];

      setBatches(batchData);
    } catch (err) {
      console.error("Fetch batches error:", err);
      setError("Unable to load batches.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH COURSES
  // =========================================================

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses/`);

      if (!response.ok) {
        throw new Error("Failed to fetch courses.");
      }

      const data = await response.json();

      const courseData = Array.isArray(data)
        ? data
        : data.results || [];

      setCourses(courseData);
    } catch (err) {
      console.error("Fetch courses error:", err);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchBatches();
    fetchCourses();
  }, []);

  // =========================================================
  // COURSE ID
  // =========================================================

  const getCourseId = (batch) => {
    if (
      typeof batch.course === "object" &&
      batch.course !== null
    ) {
      return batch.course.id;
    }

    return batch.course;
  };

  // =========================================================
  // COURSE NAME
  // =========================================================

  const getCourseName = (batch) => {
    // Direct course_name from API
    if (batch.course_name) {
      return batch.course_name;
    }

    // Nested course object
    if (
      batch.course &&
      typeof batch.course === "object" &&
      batch.course.course_name
    ) {
      return batch.course.course_name;
    }

    // Find course using course ID
    const courseId = getCourseId(batch);

    const course = courses.find(
      (item) => String(item.id) === String(courseId)
    );

    if (course) {
      return course.course_name || course.name || "N/A";
    }

    // If API directly gives course as string
    if (typeof batch.course === "string") {
      return batch.course;
    }

    return "N/A";
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // =========================================================
  // FORM INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // FILTER INPUT CHANGE
  // =========================================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      course: "",
      batch_name: "",
      mode: "Online",
      start_date: "",
      end_date: "",
      timing: "",
      status: "Upcoming",
    });

    setEditingId(null);
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {
    resetForm();

    setShowSearchForm(false);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // =========================================================
  // OPEN SEARCH FORM
  // =========================================================

  const openSearchForm = () => {
    setShowForm(false);
    setShowSearchForm((prev) => !prev);
  };

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {
    setFilters({
      search: "",
      course: "",
      mode: "",
      status: "",
      startFrom: "",
      startTo: "",
    });
  };

  // =========================================================
  // FILTER BATCHES
  // =========================================================

  const filteredBatches = batches.filter((batch) => {
    const courseName = getCourseName(batch).toLowerCase();

    const batchName = (
      batch.batch_name || ""
    ).toLowerCase();

    const timing = (
      batch.timing || ""
    ).toLowerCase();

    const searchText = filters.search
      .trim()
      .toLowerCase();

    // Search
    const matchesSearch =
      !searchText ||
      batchName.includes(searchText) ||
      courseName.includes(searchText) ||
      timing.includes(searchText);

    // Course
    const matchesCourse =
      !filters.course ||
      String(getCourseId(batch)) ===
        String(filters.course);

    // Mode
    const matchesMode =
      !filters.mode ||
      batch.mode === filters.mode;

    // Status
    const matchesStatus =
      !filters.status ||
      batch.status === filters.status;

    // Start date From
    const matchesStartFrom =
      !filters.startFrom ||
      (
        batch.start_date &&
        batch.start_date >= filters.startFrom
      );

    // Start date To
    const matchesStartTo =
      !filters.startTo ||
      (
        batch.start_date &&
        batch.start_date <= filters.startTo
      );

    return (
      matchesSearch &&
      matchesCourse &&
      matchesMode &&
      matchesStatus &&
      matchesStartFrom &&
      matchesStartTo
    );
  });

  // =========================================================
  // SUBMIT ADD / EDIT FORM
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.course) {
      alert("Please select a course.");
      return;
    }

    if (!formData.batch_name.trim()) {
      alert("Please enter batch name.");
      return;
    }

    if (!formData.start_date) {
      alert("Please select start date.");
      return;
    }

    if (!formData.end_date) {
      alert("Please select end date.");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/batches/${editingId}/`
        : `${API_URL}/batches/`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: formData.course,
          batch_name: formData.batch_name,
          mode: formData.mode,
          start_date: formData.start_date,
          end_date: formData.end_date,
          timing: formData.timing,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Batch save error:", data);

        let errorMessage = "Unable to save batch.";

        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, message]) => {
              if (Array.isArray(message)) {
                return `${field}: ${message.join(", ")}`;
              }

              return `${field}: ${message}`;
            })
            .join("\n");

          if (messages) {
            errorMessage = messages;
          }
        }

        alert(errorMessage);
        return;
      }

      alert(
        editingId
          ? "Batch updated successfully."
          : "Batch added successfully."
      );

      resetForm();
      setShowForm(false);

      fetchBatches();
    } catch (err) {
      console.error("Save batch error:", err);
      alert("Something went wrong while saving the batch.");
    }
  };

  // =========================================================
  // EDIT BATCH
  // =========================================================

  const handleEdit = (batch) => {
    const courseId = getCourseId(batch);

    setFormData({
      course: courseId || "",
      batch_name: batch.batch_name || "",
      mode: batch.mode || "Online",
      start_date: batch.start_date || "",
      end_date: batch.end_date || "",
      timing: batch.timing || "",
      status: batch.status || "Upcoming",
    });

    setEditingId(batch.id);

    setShowSearchForm(false);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE BATCH
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/batches/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        console.error("Delete error:", data);

        alert(
          data.detail ||
            "Unable to delete batch."
        );

        return;
      }

      alert("Batch deleted successfully.");

      fetchBatches();
    } catch (err) {
      console.error("Delete batch error:", err);
      alert("Something went wrong while deleting.");
    }
  };

  // =========================================================
  // CSV ESCAPE
  // =========================================================

  const escapeCSV = (value) => {
    return `"${String(value ?? "").replace(
      /"/g,
      '""'
    )}"`;
  };

  // =========================================================
  // DOWNLOAD FILTERED REPORT
  // =========================================================

  const downloadBatchReport = () => {
    if (filteredBatches.length === 0) {
      alert("No batches available to download.");
      return;
    }

    const headers = [
      "B_ID",
      "Course",
      "Batch Name",
      "Mode",
      "Start Date",
      "End Date",
      "Timing",
      "Status",
    ];

    const rows = filteredBatches.map((batch) => [
      batch.id,
      getCourseName(batch),
      batch.batch_name || "",
      batch.mode || "",
      batch.start_date || "",
      batch.end_date || "",
      batch.timing || "",
      batch.status || "",
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "filtered_batches_report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-batch-page">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="batch-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="batch-header">

          <div>
            <h1>Manage Batches</h1>

            <p>
              Create and manage course batches
            </p>
          </div>

          <div className="batch-header-buttons">

            {/* SEARCH BUTTON */}
            <button
              className="search-batch-btn"
              onClick={openSearchForm}
            >
              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Batches"}
            </button>

            {/* ADD BUTTON */}
            <button
              className="add-batch-btn"
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
            >
              {showForm
                ? "✕ Close Form"
                : "+ Add Batch"}
            </button>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="batch-error">
            {error}
          </div>
        )}

        {/* =================================================
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (
          <div className="batch-search-card">

            <div className="batch-search-header">

              <div>
                <h2>Search Batches</h2>

                <p>
                  Filter batches to find the
                  required records
                </p>
              </div>

              <button
                className="close-search-btn"
                onClick={() =>
                  setShowSearchForm(false)
                }
              >
                ✕
              </button>

            </div>

            <div className="batch-search-form">

              {/* SEARCH */}
              <div className="search-field">

                <label>
                  Search Batch
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={
                    handleFilterChange
                  }
                  placeholder="Search batch name, course or timing..."
                />

              </div>

              {/* COURSE */}
              <div className="search-field">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={filters.course}
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All Courses
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.course_name ||
                        course.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* MODE */}
              <div className="search-field">

                <label>
                  Mode
                </label>

                <select
                  name="mode"
                  value={filters.mode}
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All Modes
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Offline">
                    Offline
                  </option>

                  <option value="Both">
                    Both
                  </option>
                </select>

              </div>

              {/* STATUS */}
              <div className="search-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={filters.status}
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="Upcoming">
                    Upcoming
                  </option>

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>

              </div>

              {/* START FROM */}
              <div className="search-field">

                <label>
                  Start Date From
                </label>

                <input
                  type="date"
                  name="startFrom"
                  value={filters.startFrom}
                  onChange={
                    handleFilterChange
                  }
                />

              </div>

              {/* START TO */}
              <div className="search-field">

                <label>
                  Start Date To
                </label>

                <input
                  type="date"
                  name="startTo"
                  value={filters.startTo}
                  onChange={
                    handleFilterChange
                  }
                />

              </div>

            </div>

            {/* SEARCH ACTIONS */}
            <div className="search-actions">

              <button
                className="reset-filter-btn"
                onClick={resetFilters}
              >
                Reset
              </button>

              <button
                className="download-report-btn"
                onClick={
                  downloadBatchReport
                }
                disabled={
                  filteredBatches.length === 0
                }
              >
                ↓ Download Report
              </button>

            </div>

            {/* RESULT COUNT */}
            <div className="filter-result">

              Showing{" "}
              <strong>
                {filteredBatches.length}
              </strong>{" "}
              of{" "}
              <strong>
                {batches.length}
              </strong>{" "}
              batches

            </div>

          </div>
        )}

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (
          <div className="batch-form-card">

            <div className="batch-form-heading">

              <div>
                <h2>
                  {editingId
                    ? "Edit Batch"
                    : "Add New Batch"}
                </h2>

                <p>
                  {editingId
                    ? "Update batch information"
                    : "Enter batch information"}
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="batch-form"
            >

              {/* COURSE */}
              <div className="form-group">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.course_name ||
                        course.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* BATCH NAME */}
              <div className="form-group">

                <label>
                  Batch Name
                </label>

                <input
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleChange}
                  placeholder="Enter batch name"
                  required
                />

              </div>

              {/* MODE */}
              <div className="form-group">

                <label>
                  Mode
                </label>

                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  required
                >
                  <option value="Online">
                    Online
                  </option>

                  <option value="Offline">
                    Offline
                  </option>

                  <option value="Both">
                    Both
                  </option>
                </select>

              </div>

              {/* START DATE */}
              <div className="form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* END DATE */}
              <div className="form-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* TIMING */}
              <div className="form-group">

                <label>
                  Timing
                </label>

                <input
                  type="text"
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  placeholder="Example: 10:00 AM - 12:00 PM"
                />

              </div>

              {/* STATUS */}
              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Upcoming">
                    Upcoming
                  </option>

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>

              </div>

              {/* FORM BUTTONS */}
              <div className="batch-form-actions">

                <button
                  type="button"
                  className="cancel-batch-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-batch-btn"
                >
                  {editingId
                    ? "Update Batch"
                    : "Add Batch"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="batch-table-card">

          <div className="batch-table-heading">

            <div>
              <h2>
                Batch List
              </h2>

              <p>
                View and manage all batches
              </p>
            </div>

            <div className="batch-count">
              {filteredBatches.length} Batches
            </div>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="batch-loading">
              Loading batches...
            </div>
          ) : (
            <div className="batch-table-wrapper">

              <table className="batch-table">

                <thead>
                  <tr>

                    <th>B_ID</th>

                    <th>Course</th>

                    <th>Batch Name</th>

                    <th>Mode</th>

                    <th>Start Date</th>

                    <th>End Date</th>

                    <th>Timing</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>
                </thead>

                <tbody>

                  {filteredBatches.length === 0 ? (
                    <tr>

                      <td
                        colSpan="9"
                        className="no-data"
                      >
                        No batches found.
                      </td>

                    </tr>
                  ) : (
                    filteredBatches.map(
                      (batch) => (
                        <tr
                          key={batch.id}
                        >

                          <td>
                            {batch.id}
                          </td>

                          <td>
                            {getCourseName(
                              batch
                            )}
                          </td>

                          <td>
                            {batch.batch_name ||
                              "-"}
                          </td>

                          <td>
                            <span
                              className={`mode-badge ${(
                                batch.mode ||
                                ""
                              ).toLowerCase()}`}
                            >
                              {batch.mode ||
                                "-"}
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              batch.start_date
                            )}
                          </td>

                          <td>
                            {formatDate(
                              batch.end_date
                            )}
                          </td>

                          <td>
                            {batch.timing ||
                              "-"}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${(
                                batch.status ||
                                ""
                              ).toLowerCase()}`}
                            >
                              {batch.status ||
                                "-"}
                            </span>
                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    batch
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    batch.id
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
          )}

        </div>

      </main>

    </div>
  );
};

export default AdminBatches;