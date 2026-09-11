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

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


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


      // Django REST Framework pagination
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
  // ADD COURSE
  // =====================================================

  const handleAdd = () => {

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

    setShowForm(true);

  };


  // =====================================================
  // EDIT COURSE
  // =====================================================

  const handleEdit = (course) => {

    setEditingId(course.id);

    setFormData({

      category:
        course.category || "",

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
            "Content-Type": "application/json"
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


      const data = await response.json();


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


      // Close form
      setShowForm(false);

      setEditingId(null);


      // Reset form
      setFormData({
        category: "",
        course_name: "",
        description: "",
        duration: "",
        fees: "",
        mode: "Online",
        status: "Active"
      });


      // Reload courses
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


      // Reload database records
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


      {/* =========================
          COMMON SIDEBAR
      ========================= */}

      <AdminSidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-courses-main">


        {/* =========================
            HEADER
        ========================= */}

        <div className="courses-header">

          <div>

            <h1>
              Courses
            </h1>

            <p>
              Manage fashion boutique courses
            </p>

          </div>


          <button
            className="add-course-btn"
            onClick={handleAdd}
          >

            <FaPlus />

            <span>
              Add Course
            </span>

          </button>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (

          <div className="course-error">

            {error}

          </div>

        )}


        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        {showForm && (

          <div className="course-form-card">


            <div className="course-form-title">

              <h2>

                {editingId
                  ? "Edit Course"
                  : "Add New Course"
                }

              </h2>

            </div>


            <form
              onSubmit={handleSubmit}
            >


              {/* =========================
                  CATEGORY
              ========================= */}

              <div className="form-group">

                <label>
                  Category
                </label>


                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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


              {/* =========================
                  COURSE NAME
              ========================= */}

              <div className="form-group">

                <label>
                  Course Name
                </label>


                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="Enter course name"
                  required
                />

              </div>


              {/* =========================
                  DESCRIPTION
              ========================= */}

              <div className="form-group">

                <label>
                  Description
                </label>


                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  rows="4"
                  required
                />

              </div>


              {/* =========================
                  DURATION
              ========================= */}

              <div className="form-group">

                <label>
                  Duration
                </label>


                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 3 Months"
                  required
                />

              </div>


              {/* =========================
                  FEES
              ========================= */}

              <div className="form-group">

                <label>
                  Fees
                </label>


                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  placeholder="Enter course fees"
                  min="0"
                  required
                />

              </div>


              {/* =========================
                  MODE
              ========================= */}

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

                </select>

              </div>


              {/* =========================
                  STATUS
              ========================= */}

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

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* =========================
                  FORM BUTTONS
              ========================= */}

              <div className="course-form-buttons">


                <button
                  type="submit"
                  className="save-course-btn"
                >

                  {editingId
                    ? "Update Course"
                    : "Save Course"
                  }

                </button>


                <button
                  type="button"
                  className="cancel-course-btn"
                  onClick={handleCancel}
                >

                  Cancel

                </button>


              </div>

            </form>

          </div>

        )}


        {/* =========================
            COURSE TABLE
        ========================= */}

        <div className="course-table-card">


          {/* TABLE HEADER */}

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

              Total Courses:{" "}

              <strong>
                {courses.length}
              </strong>

            </div>

          </div>


          {/* =========================
              TABLE
          ========================= */}

          {courses.length === 0 ? (

            <div className="no-courses">

              <div className="no-course-icon">
                📚
              </div>


              <h3>
                No Courses Found
              </h3>


              <p>
                Add your first course
                using the button above.
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


                  {courses.map(
                    (course) => (

                      <tr
                        key={course.id}
                      >


                        {/* ID */}

                        <td>

                          #{course.id}

                        </td>


                        {/* CATEGORY */}

                        <td>

                          {course.category_name ||
                            course.category?.category_name ||
                            "N/A"}

                        </td>


                        {/* COURSE NAME */}

                        <td>

                          <strong>

                            {course.course_name ||
                              "N/A"}

                          </strong>

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          {course.description ||
                            "N/A"}

                        </td>


                        {/* DURATION */}

                        <td>

                          {course.duration ||
                            "N/A"}

                        </td>


                        {/* FEES */}

                        <td>

                          ₹
                          {course.fees ||
                            "0.00"}

                        </td>


                        {/* MODE */}

                        <td>

                          {course.mode ||
                            "N/A"}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              course.status === "Active"
                                ? "course-status active"
                                : "course-status inactive"
                            }
                          >

                            {course.status ||
                              "N/A"}

                          </span>

                        </td>


                        {/* ACTIONS */}

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