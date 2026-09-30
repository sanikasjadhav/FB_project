import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

import {
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import "./AdminCourses.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminCourses = () => {

  // =========================
  // STATES
  // =========================

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // SEARCH FILTERS
  // =========================

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    mode: "",
    status: ""
  });

  const [formData, setFormData] = useState({
    category: "",
    course_name: "",
    description: "",
    duration: "",
    fees: "",
    mode: "Online",
    status: "Active"
  });

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

      console.log(
        "Courses API response:",
        data
      );

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

      setError(
        "Unable to load course records."
      );

      setCourses([]);

    }

  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {

    try {

      const response = await fetch(
        `${API_URL}/categories/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch categories"
        );
      }

      const data = await response.json();

      console.log(
        "Categories API response:",
        data
      );

      if (Array.isArray(data)) {

        setCategories(data);

      } else if (data.results) {

        setCategories(data.results);

      } else {

        setCategories([]);

      }

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

      setCategories([]);

    }

  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchCourses(),
        fetchCategories()
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
      [e.target.name]: e.target.value
    });

  };

  // =====================================================
  // SEARCH FILTER CHANGE
  // =====================================================

  const handleFilterChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });

  };

  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  const getCategoryName = (course) => {

    if (course.category_name) {
      return course.category_name;
    }

    if (
      course.category &&
      typeof course.category === "object"
    ) {
      return (
        course.category.category_name ||
        course.category.name ||
        "N/A"
      );
    }

    const category = categories.find(
      (item) =>
        String(item.id) ===
        String(course.category)
    );

    return (
      category?.category_name ||
      category?.name ||
      "N/A"
    );

  };

  // =====================================================
  // FILTER COURSES
  // =====================================================

  const filteredCourses = courses.filter(
    (course) => {

      const searchText =
        filters.search
          .trim()
          .toLowerCase();

      const courseName = (
        course.course_name || ""
      ).toLowerCase();

      const description = (
        course.description || ""
      ).toLowerCase();

      const duration = (
        course.duration || ""
      ).toLowerCase();

      const mode = (
        course.mode || ""
      ).toLowerCase();

      const status = (
        course.status || ""
      ).toLowerCase();

      const categoryName = (
        getCategoryName(course) || ""
      ).toLowerCase();

      // General search

      const matchesSearch =
        !searchText ||
        courseName.includes(searchText) ||
        categoryName.includes(searchText) ||
        description.includes(searchText) ||
        duration.includes(searchText) ||
        mode.includes(searchText) ||
        status.includes(searchText);

      // Category filter

      const matchesCategory =
        !filters.category ||
        String(
          course.category
        ) === String(
          filters.category
        );

      // Mode filter

      const matchesMode =
        !filters.mode ||
        mode ===
          filters.mode.toLowerCase();

      // Status filter

      const matchesStatus =
        !filters.status ||
        status ===
          filters.status.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesStatus
      );

    }
  );

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      category: "",
      mode: "",
      status: ""
    });

  };

  // =====================================================
  // OPEN SEARCH FORM
  // =====================================================

  const openSearchForm = () => {

    setShowForm(false);
    setEditingId(null);

    setShowSearchForm(
      (previous) => !previous
    );

  };

  // =====================================================
  // ADD COURSE
  // =====================================================

  const handleAdd = () => {

    setEditingId(null);

    setShowSearchForm(false);

    setFormData({
      category: "",
      course_name: "",
      description: "",
      duration: "",
      fees: "",
      mode: "Online",
      status: "Active"
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  // =====================================================
  // EDIT COURSE
  // =====================================================

  const handleEdit = (course) => {

    setEditingId(course.id);

    setShowSearchForm(false);

    setFormData({

      category:
        typeof course.category === "object"
          ? course.category.id
          : course.category || "",

      course_name:
        course.course_name || "",

      description:
        course.description || "",

      duration:
        course.duration || "",

      fees:
        course.fees || "",

      mode:
        course.mode || "Online",

      status:
        course.status || "Active"

    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  // =====================================================
  // SAVE COURSE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const url = editingId
        ? `${API_URL}/courses/${editingId}/`
        : `${API_URL}/courses/`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method: method,

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            category:
              Number(formData.category),

            course_name:
              formData.course_name,

            description:
              formData.description,

            duration:
              formData.duration,

            fees:
              formData.fees,

            mode:
              formData.mode,

            status:
              formData.status

          })

        }
      );

      const data =
        await response.json();

      console.log(
        "Save course response:",
        data
      );

      if (!response.ok) {

        console.error(
          "Backend error:",
          data
        );

        alert(
          "Failed to save course."
        );

        return;

      }

      alert(
        editingId
          ? "Course updated successfully"
          : "Course added successfully"
      );

      setShowForm(false);
      setEditingId(null);

      setFormData({
        category: "",
        course_name: "",
        description: "",
        duration: "",
        fees: "",
        mode: "Online",
        status: "Active"
      });

      fetchCourses();

    } catch (error) {

      console.error(
        "Error saving course:",
        error
      );

      alert(
        "Unable to connect to Django server."
      );

    }

  };

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this course?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/courses/${id}/`,
          {
            method: "DELETE"
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to delete course"
        );

      }

      alert(
        "Course deleted successfully"
      );

      fetchCourses();

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to delete course."
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
      category: "",
      course_name: "",
      description: "",
      duration: "",
      fees: "",
      mode: "Online",
      status: "Active"
    });

  };

  // =====================================================
  // DOWNLOAD FILTERED REPORT
  // =====================================================

  const escapeCSV = (value) => {

    return `"${String(
      value ?? ""
    ).replace(
      /"/g,
      '""'
    )}"`;

  };

  const downloadCourseReport = () => {

    if (
      filteredCourses.length === 0
    ) {

      alert(
        "No courses available to download."
      );

      return;

    }

    const headers = [
      "Course ID",
      "Category",
      "Course Name",
      "Description",
      "Duration",
      "Fees",
      "Mode",
      "Status"
    ];

    const rows =
      filteredCourses.map(
        (course) => [

          course.id || "",

          getCategoryName(course),

          course.course_name || "",

          course.description || "",

          course.duration || "",

          course.fees || "",

          course.mode || "",

          course.status || ""

        ]
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
      )

    ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "filtered_courses_report.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-page-loading">

        Loading courses...

      </div>

    );

  }

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-courses-page">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <main className="admin-courses-main">

        {/* HEADER */}

        <div className="courses-header">

          <div>

            <h1>
              Courses
            </h1>

            <p>
              Manage fashion boutique courses
            </p>

          </div>

          <div className="courses-header-buttons">

            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="search-course-btn"
              onClick={
                openSearchForm
              }
            >

              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Courses"}

            </button>

            {/* ADD BUTTON */}

            <button
              className="add-course-btn"
              onClick={showForm
                ? handleCancel
                : handleAdd}
            >

              <FaPlus />

              <span>

                {showForm
                  ? "Close Form"
                  : "Add Course"}

              </span>

            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div className="course-error">

            {error}

          </div>

        )}

        {/* =================================================
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (

          <section className="course-search-card">

            <div className="course-search-title">

              <h2>
                Search Courses
              </h2>

              <p>
                Search and filter courses
                by name, category, mode
                or status.
              </p>

            </div>

            <div className="course-search-form">

              {/* SEARCH */}

              <div className="course-search-field">

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
                  placeholder="Course name, category, description..."
                />

              </div>

              {/* CATEGORY */}

              <div className="course-search-field">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={
                    filters.category
                  }
                  onChange={
                    handleFilterChange
                  }
                >

                  <option value="">
                    All Categories
                  </option>

                  {categories.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >

                        {category.category_name ||
                          category.name}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* MODE */}

              <div className="course-search-field">

                <label>
                  Mode
                </label>

                <select
                  name="mode"
                  value={
                    filters.mode
                  }
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

                </select>

              </div>

              {/* STATUS */}

              <div className="course-search-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    filters.status
                  }
                  onChange={
                    handleFilterChange
                  }
                >

                  <option value="">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

            {/* SEARCH ACTIONS */}

            <div className="course-search-actions">

              <button
                type="button"
                className="reset-course-search-btn"
                onClick={
                  resetFilters
                }
              >
                Reset
              </button>

              <button
                type="button"
                className="download-course-report-btn"
                onClick={
                  downloadCourseReport
                }
                disabled={
                  filteredCourses.length === 0
                }
              >
                ↓ Download Report
              </button>

            </div>

            {/* RESULT */}

            <div className="course-filter-result">

              Showing{" "}

              <strong>
                {filteredCourses.length}
              </strong>{" "}

              of{" "}

              <strong>
                {courses.length}
              </strong>{" "}

              courses

            </div>

          </section>

        )}

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (

          <div className="course-form-card">

            <div className="course-form-title">

              <h2>

                {editingId
                  ? "Edit Course"
                  : "Add New Course"}

              </h2>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >

                        {category.category_name}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* COURSE NAME */}

              <div className="form-group">

                <label>
                  Course Name
                </label>

                <input
                  type="text"
                  name="course_name"
                  value={
                    formData.course_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter course name"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter course description"
                  rows="4"
                  required
                />

              </div>

              {/* DURATION */}

              <div className="form-group">

                <label>
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  value={
                    formData.duration
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: 3 Months"
                  required
                />

              </div>

              {/* FEES */}

              <div className="form-group">

                <label>
                  Fees
                </label>

                <input
                  type="number"
                  name="fees"
                  value={
                    formData.fees
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter course fees"
                  min="0"
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
                  value={
                    formData.mode
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="Online">
                    Online
                  </option>

                  <option value="Offline">
                    Offline
                  </option>

                </select>

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
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

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

              {/* FORM BUTTONS */}

              <div className="course-form-buttons">

                <button
                  type="submit"
                  className="save-course-btn"
                >

                  {editingId
                    ? "Update Course"
                    : "Save Course"}

                </button>

                <button
                  type="button"
                  className="cancel-course-btn"
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
            COURSE TABLE
        ================================================= */}

        <div className="course-table-card">

          <div className="course-table-heading">

            <div>

              <h2>
                Course List
              </h2>

              <p>
                View and manage all available courses
              </p>

            </div>

            <div className="course-count">

              Showing{" "}

              <strong>
                {filteredCourses.length}
              </strong>

              {" "}of{" "}

              <strong>
                {courses.length}
              </strong>

            </div>

          </div>

          {/* TABLE */}

          {filteredCourses.length === 0 ? (

            <div className="no-courses">

              <div className="no-course-icon">
                📚
              </div>

              <h3>

                {courses.length === 0
                  ? "No Courses Found"
                  : "No Matching Courses"}

              </h3>

              <p>

                {courses.length === 0
                  ? "Add your first course using the button above."
                  : "Try changing your search or filters."}

              </p>

            </div>

          ) : (

            <div className="course-table-wrapper">

              <table className="course-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Course Name
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Duration
                    </th>

                    <th>
                      Fees
                    </th>

                    <th>
                      Mode
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

                  {filteredCourses.map(
                    (course) => (

                      <tr
                        key={course.id}
                      >

                        <td>
                          #{course.id}
                        </td>

                        <td>

                          {getCategoryName(
                            course
                          )}

                        </td>

                        <td>

                          <strong>

                            {course.course_name ||
                              "N/A"}

                          </strong>

                        </td>

                        <td>

                          {course.description ||
                            "N/A"}

                        </td>

                        <td>

                          {course.duration ||
                            "N/A"}

                        </td>

                        <td>

                          ₹
                          {course.fees ||
                            "0.00"}

                        </td>

                        <td>

                          {course.mode ||
                            "N/A"}

                        </td>

                        <td>

                          <span
                            className={
                              course.status ===
                              "Active"
                                ? "course-status active"
                                : "course-status inactive"
                            }
                          >

                            {course.status ||
                              "N/A"}

                          </span>

                        </td>

                        <td>

                          <div className="course-actions">

                            {/* EDIT */}

                            <button
                              className="edit-course-btn"
                              onClick={() =>
                                handleEdit(
                                  course
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
                              className="delete-course-btn"
                              onClick={() =>
                                handleDelete(
                                  course.id
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

export default AdminCourses;