import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserGraduate,
} from "react-icons/fa";

import "./AdminEnrollment.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminEnrollment = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    batch: "",
    status: "Pending",
  });

  // =====================================================
  // SEARCH FILTERS
  // =====================================================

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

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

      setError("");

    } catch (error) {

      console.error(
        "Error fetching enrollments:",
        error
      );

      setError(
        "Unable to load enrollment records."
      );

      setEnrollments([]);
    }
  };

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${API_URL}/students/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch students"
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data.results) {
        setStudents(data.results);
      } else {
        setStudents([]);
      }

    } catch (error) {

      console.error(
        "Error fetching students:",
        error
      );

      setStudents([]);
    }
  };

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${API_URL}/courses/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch courses"
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data.results) {
        setCourses(data.results);
      } else {
        setCourses([]);
      }

    } catch (error) {

      console.error(
        "Error fetching courses:",
        error
      );

      setCourses([]);
    }
  };

  // =====================================================
  // FETCH BATCHES
  // =====================================================

  const fetchBatches = async () => {
    try {
      const response = await fetch(
        `${API_URL}/batches/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch batches"
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setBatches(data);
      } else if (data.results) {
        setBatches(data.results);
      } else {
        setBatches([]);
      }

    } catch (error) {

      console.error(
        "Error fetching batches:",
        error
      );

      setBatches([]);
    }
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchEnrollments(),
        fetchStudents(),
        fetchCourses(),
        fetchBatches(),
      ]);

      setLoading(false);
    };

    loadData();

  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // FILTER CHANGE
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

    // Close Add/Edit form
    setShowForm(false);
    setEditingId(null);

    // Toggle Search form
    setShowSearchForm(
      (previous) => !previous
    );
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // =====================================================
  // FILTER ENROLLMENTS
  // =====================================================

  const filteredEnrollments =
    enrollments.filter((enrollment) => {

      const searchText =
        filters.search
          .trim()
          .toLowerCase();

      const studentName = (
        enrollment.student_name ||
        enrollment.student_name_display ||
        enrollment.student ||
        ""
      )
        .toString()
        .toLowerCase();

      const courseName = (
        enrollment.course_name ||
        enrollment.course_name_display ||
        enrollment.course ||
        ""
      )
        .toString()
        .toLowerCase();

      const batchName = (
        enrollment.batch_name ||
        enrollment.batch ||
        ""
      )
        .toString()
        .toLowerCase();

      // Search student/course/batch
      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        courseName.includes(searchText) ||
        batchName.includes(searchText);

      // Status
      const matchesStatus =
        !filters.status ||
        String(
          enrollment.status || ""
        ).toLowerCase() ===
          filters.status.toLowerCase();

      // Enrollment date
      const enrollmentDate =
        enrollment.enrollment_date
          ? new Date(
              enrollment.enrollment_date
            )
          : null;

      // Date from
      const matchesDateFrom =
        !filters.dateFrom ||
        (
          enrollmentDate &&
          enrollmentDate >=
            new Date(
              `${filters.dateFrom}T00:00:00`
            )
        );

      // Date to
      const matchesDateTo =
        !filters.dateTo ||
        (
          enrollmentDate &&
          enrollmentDate <=
            new Date(
              `${filters.dateTo}T23:59:59`
            )
        );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

  // =====================================================
  // ADD ENROLLMENT
  // =====================================================

  const handleAdd = () => {

    setEditingId(null);

    // Close search form
    setShowSearchForm(false);

    setFormData({
      student: "",
      course: "",
      batch: "",
      status: "Pending",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // EDIT ENROLLMENT
  // =====================================================

  const handleEdit = (enrollment) => {

    // Close search form
    setShowSearchForm(false);

    setEditingId(enrollment.id);

    setFormData({
      student: enrollment.student || "",
      course: enrollment.course || "",
      batch: enrollment.batch || "",
      status:
        enrollment.status || "Pending",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SAVE ENROLLMENT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const url = editingId
        ? `${API_URL}/enrollments/${editingId}/`
        : `${API_URL}/enrollments/`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method: method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            student:
              Number(formData.student),

            course:
              Number(formData.course),

            batch:
              formData.batch
                ? Number(formData.batch)
                : null,

            status:
              formData.status,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Save enrollment response:",
        data
      );

      if (!response.ok) {

        console.error(
          "Enrollment backend error:",
          data
        );

        alert(
          "Failed to save enrollment."
        );

        return;
      }

      alert(
        editingId
          ? "Enrollment updated successfully"
          : "Enrollment added successfully"
      );

      setShowForm(false);
      setEditingId(null);

      setFormData({
        student: "",
        course: "",
        batch: "",
        status: "Pending",
      });

      fetchEnrollments();

    } catch (error) {

      console.error(
        "Error saving enrollment:",
        error
      );

      alert(
        "Unable to connect to Django server."
      );
    }
  };

  // =====================================================
  // DELETE ENROLLMENT
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this enrollment?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/enrollments/${id}/`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to delete enrollment"
        );
      }

      alert(
        "Enrollment deleted successfully"
      );

      fetchEnrollments();

    } catch (error) {

      console.error(
        "Delete enrollment error:",
        error
      );

      alert(
        "Unable to delete enrollment."
      );
    }
  };

  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {

    setShowForm(false);
    setEditingId(null);

    setFormData({
      student: "",
      course: "",
      batch: "",
      status: "Pending",
    });
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

  const downloadEnrollmentReport = () => {

    if (
      filteredEnrollments.length === 0
    ) {

      alert(
        "No enrollments available to download."
      );

      return;
    }

    const headers = [
      "Enrollment ID",
      "Student",
      "Course",
      "Batch",
      "Enrollment Date",
      "Status",
    ];

    const rows =
      filteredEnrollments.map(
        (enrollment) => [

          enrollment.id || "",

          enrollment.student_name ||
            enrollment.student ||
            "",

          enrollment.course_name ||
            enrollment.course ||
            "",

          enrollment.batch_name ||
            enrollment.batch ||
            "",

          enrollment.enrollment_date ||
            "",

          enrollment.status ||
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
      "filtered_enrollments_report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-page-loading">

        Loading enrollments...

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-enrollment-page">

      {/* =================================================
          ADMIN SIDEBAR
      ================================================= */}

      <AdminSidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="enrollment-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="enrollment-header">

          <div>

            <h1>
              Enrollments
            </h1>

            <p>
              Manage student course
              enrollments
            </p>

          </div>


          <div className="enrollment-header-buttons">

            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="search-enrollment-btn"
              onClick={openSearchForm}
            >

              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Enrollments"}

            </button>


            {/* ADD BUTTON */}

            <button
              type="button"
              className="add-enrollment-btn"
              onClick={
                showForm
                  ? handleCancel
                  : handleAdd
              }
            >

              <FaPlus />

              <span>

                {showForm
                  ? "Close Form"
                  : "Add Enrollment"}

              </span>

            </button>

          </div>

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
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (

          <div className="enrollment-search-card">

            <div className="enrollment-search-title">

              <h2>
                Search Enrollments
              </h2>

              <p>
                Filter student enrollment
                records
              </p>

            </div>


            <div className="enrollment-search-form">

              {/* SEARCH */}

              <div className="search-field">

                <label>
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={
                    handleFilterChange
                  }
                  placeholder="Search student, course or batch..."
                />

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

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Enrolled">
                    Enrolled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>


              {/* DATE FROM */}

              <div className="search-field">

                <label>
                  Enrollment Date From
                </label>

                <input
                  type="date"
                  name="dateFrom"
                  value={
                    filters.dateFrom
                  }
                  onChange={
                    handleFilterChange
                  }
                />

              </div>


              {/* DATE TO */}

              <div className="search-field">

                <label>
                  Enrollment Date To
                </label>

                <input
                  type="date"
                  name="dateTo"
                  value={
                    filters.dateTo
                  }
                  onChange={
                    handleFilterChange
                  }
                />

              </div>


              {/* SEARCH BUTTONS */}

              <div className="enrollment-search-actions">

                <button
                  type="button"
                  className="reset-enrollment-btn"
                  onClick={
                    resetFilters
                  }
                >

                  Reset

                </button>


                <button
                  type="button"
                  className="download-enrollment-btn"
                  onClick={
                    downloadEnrollmentReport
                  }
                  disabled={
                    filteredEnrollments.length ===
                    0
                  }
                >

                  ↓ Download Report

                </button>

              </div>

            </div>


            {/* RESULT COUNT */}

            <div className="enrollment-filter-result">

              Showing{" "}

              <strong>
                {filteredEnrollments.length}
              </strong>

              {" "}of{" "}

              <strong>
                {enrollments.length}
              </strong>

              {" "}enrollments

            </div>

          </div>

        )}


        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (

          <div className="enrollment-form-card">

            <div className="form-title">

              <h2>

                {editingId
                  ? "Edit Enrollment"
                  : "Add New Enrollment"}

              </h2>

            </div>


            <form
              onSubmit={handleSubmit}
            >

              {/* STUDENT */}

              <div className="form-group">

                <label>
                  Student
                </label>

                <select
                  name="student"
                  value={
                    formData.student
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Student
                  </option>


                  {students.map(
                    (student) => (

                      <option
                        key={student.id}
                        value={student.id}
                      >

                        {student.first_name
                          ? `${student.first_name} ${
                              student.last_name ||
                              ""
                            }`
                          : student.email}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* COURSE */}

              <div className="form-group">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={
                    formData.course
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Course
                  </option>


                  {courses.map(
                    (course) => (

                      <option
                        key={course.id}
                        value={course.id}
                      >

                        {course.course_name ||
                          course.name ||
                          "Course"}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* BATCH */}

              <div className="form-group">

                <label>
                  Batch
                </label>

                <select
                  name="batch"
                  value={
                    formData.batch
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Batch
                  </option>


                  {batches.map(
                    (batch) => (

                      <option
                        key={batch.id}
                        value={batch.id}
                      >

                        {batch.batch_name ||
                          `Batch ${batch.id}`}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* STATUS */}

              <div className="form-group">

                <label>
                  Enrollment Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Enrolled">
                    Enrolled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>


              {/* FORM BUTTONS */}

              <div className="form-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >

                  {editingId
                    ? "Update Enrollment"
                    : "Save Enrollment"}

                </button>


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCancel
                  }
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="enrollment-table-card">

          <div className="table-heading">

            <div>

              <h2>
                Enrollment List
              </h2>

              <p>
                View and manage student
                enrollments
              </p>

            </div>


            <div className="enrollment-count">

              <FaUserGraduate />

              <span>
                {filteredEnrollments.length}
              </span>

            </div>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          <div className="enrollment-table-wrapper">

            <table className="enrollment-table">

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
                    Batch
                  </th>

                  <th>
                    Enrollment Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredEnrollments.length >
                0 ? (

                  filteredEnrollments.map(
                    (enrollment) => (

                      <tr
                        key={
                          enrollment.id
                        }
                      >

                        {/* ID */}

                        <td>

                          #{enrollment.id}

                        </td>


                        {/* STUDENT */}

                        <td>

                          <strong>

                            {enrollment.student_name ||
                              enrollment.student ||
                              "N/A"}

                          </strong>

                        </td>


                        {/* COURSE */}

                        <td>

                          {enrollment.course_name ||
                            enrollment.course ||
                            "N/A"}

                        </td>


                        {/* BATCH */}

                        <td>

                          {enrollment.batch_name ||
                            enrollment.batch ||
                            "N/A"}

                        </td>


                        {/* DATE */}

                        <td>

                          {enrollment.enrollment_date ||
                            "N/A"}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              `enrollment-status ${
                                (
                                  enrollment.status ||
                                  ""
                                ).toLowerCase()
                              }`
                            }
                          >

                            {enrollment.status ||
                              "N/A"}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="enrollment-actions">

                            {/* EDIT */}

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  enrollment
                                )
                              }
                            >

                              <FaEdit />

                              <span>
                                Edit
                              </span>

                            </button>


                            {/* DELETE */}

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  enrollment.id
                                )
                              }
                            >

                              <FaTrash />

                              <span>
                                Delete
                              </span>

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-enrollment"
                    >

                      <div>
                        👩‍🎓
                      </div>

                      <h3>

                        {enrollments.length ===
                        0
                          ? "No Enrollments Found"
                          : "No Matching Enrollments"}

                      </h3>

                      <p>

                        {enrollments.length ===
                        0
                          ? "Add your first student enrollment using the button above."
                          : "Try changing your search or filter options."}

                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminEnrollment;