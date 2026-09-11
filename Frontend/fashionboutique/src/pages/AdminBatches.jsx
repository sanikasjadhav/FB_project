import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes
} from "react-icons/fa";

import "./AdminBatches.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminBatches = () => {

  // =========================
  // STATES
  // =========================

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    course: "",
    batch_name: "",
    start_date: "",
    end_date: "",
    timing: "",
    status: "Upcoming"
  });


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

      console.log(
        "Batch API response:",
        data
      );

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

      setError(
        "Unable to load batch records."
      );

      setBatches([]);

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

      setCourses([]);

    }

  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchBatches(),
        fetchCourses()
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
  // ADD BATCH
  // =====================================================

  const handleAdd = () => {

    setEditingId(null);

    setFormData({
      course: "",
      batch_name: "",
      start_date: "",
      end_date: "",
      timing: "",
      status: "Upcoming"
    });

    setShowForm(true);

  };


  // =====================================================
  // EDIT BATCH
  // =====================================================

  const handleEdit = (batch) => {

    setEditingId(batch.id);

    setFormData({

      course:
        batch.course || "",

      batch_name:
        batch.batch_name || "",

      start_date:
        batch.start_date || "",

      end_date:
        batch.end_date || "",

      timing:
        batch.timing || "",

      status:
        batch.status || "Upcoming"

    });

    setShowForm(true);

  };


  // =====================================================
  // SAVE BATCH
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const url = editingId
        ? `${API_URL}/batches/${editingId}/`
        : `${API_URL}/batches/`;

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

            course:
              Number(formData.course),

            batch_name:
              formData.batch_name,

            start_date:
              formData.start_date,

            end_date:
              formData.end_date,

            timing:
              formData.timing,

            status:
              formData.status

          })

        }
      );


      const data =
        await response.json();


      console.log(
        "Save batch response:",
        data
      );


      if (!response.ok) {

        console.error(
          "Backend error:",
          data
        );

        alert(
          "Failed to save batch."
        );

        return;

      }


      alert(
        editingId
          ? "Batch updated successfully"
          : "Batch added successfully"
      );


      setShowForm(false);

      setEditingId(null);


      setFormData({

        course: "",
        batch_name: "",
        start_date: "",
        end_date: "",
        timing: "",
        status: "Upcoming"

      });


      fetchBatches();

    } catch (error) {

      console.error(
        "Error saving batch:",
        error
      );

      alert(
        "Unable to connect to Django server."
      );

    }

  };


  // =====================================================
  // DELETE BATCH
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this batch?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/batches/${id}/`,
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to delete batch"
        );

      }


      alert(
        "Batch deleted successfully"
      );


      fetchBatches();

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to delete batch."
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

      course: "",
      batch_name: "",
      start_date: "",
      end_date: "",
      timing: "",
      status: "Upcoming"

    });

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-page-loading">

        Loading batches...

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-batch-page">


      {/* =========================
          COMMON ADMIN SIDEBAR
      ========================= */}

      <AdminSidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="batch-main">


        {/* =========================
            HEADER
        ========================= */}

        <div className="batch-header">

          <div>

            <h1>
              Batches
            </h1>

            <p>
              Manage course batches
            </p>

          </div>


          <button
            className="add-batch-btn"
            onClick={handleAdd}
          >

            <FaPlus />

            <span>
              Add Batch
            </span>

          </button>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (

          <div className="batch-error">

            {error}

          </div>

        )}


        {/* =========================
            FORM
        ========================= */}

        {showForm && (

          <div className="batch-form-card">


            <div className="batch-form-title">

              <h2>

                {editingId
                  ? "Edit Batch"
                  : "Add New Batch"
                }

              </h2>

            </div>


            <form
              onSubmit={handleSubmit}
            >


              {/* =========================
                  COURSE
              ========================= */}

              <div className="batch-form-group">

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


              {/* =========================
                  BATCH NAME
              ========================= */}

              <div className="batch-form-group">

                <label>
                  Batch Name
                </label>


                <input
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleChange}
                  placeholder="Example: Fashion Designing - Batch A"
                  required
                />

              </div>


              {/* =========================
                  START DATE
              ========================= */}

              <div className="batch-form-group">

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


              {/* =========================
                  END DATE
              ========================= */}

              <div className="batch-form-group">

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


              {/* =========================
                  TIMING
              ========================= */}

              <div className="batch-form-group">

                <label>
                  Timing
                </label>


                <input
                  type="text"
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  placeholder="Example: 10:00 AM - 12:00 PM"
                  required
                />

              </div>


              {/* =========================
                  STATUS
              ========================= */}

              <div className="batch-form-group">

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


              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="batch-form-buttons">


                <button
                  type="submit"
                  className="batch-save-btn"
                >

                  <FaSave />

                  <span>

                    {editingId
                      ? "Update Batch"
                      : "Save Batch"
                    }

                  </span>

                </button>


                <button
                  type="button"
                  className="batch-cancel-btn"
                  onClick={handleCancel}
                >

                  <FaTimes />

                  <span>
                    Cancel
                  </span>

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =========================
            TABLE
        ========================= */}

        <div className="batch-table-card">


          <div className="batch-table-heading">

            <div>

              <h2>
                Batch List
              </h2>

              <p>
                View and manage all available batches
              </p>

            </div>


            <div className="batch-count">

              Total Batches:{" "}

              <strong>
                {batches.length}
              </strong>

            </div>

          </div>


          {batches.length === 0 ? (

            <div className="no-batches">

              <div>
                🗓️
              </div>

              <h3>
                No Batches Found
              </h3>

              <p>
                Add your first batch using
                the button above.
              </p>

            </div>

          ) : (

            <div className="batch-table-wrapper">

              <table className="batch-table">


                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Course
                    </th>

                    <th>
                      Batch Name
                    </th>

                    <th>
                      Start Date
                    </th>

                    <th>
                      End Date
                    </th>

                    <th>
                      Timing
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


                  {batches.map(
                    (batch) => (

                      <tr
                        key={batch.id}
                      >


                        {/* ID */}

                        <td>

                          #{batch.id}

                        </td>


                        {/* COURSE */}

                        <td>

                          <strong>

                            {batch.course_name ||
                              batch.course?.course_name ||
                              batch.course ||
                              "N/A"}

                          </strong>

                        </td>


                        {/* BATCH NAME */}

                        <td>

                          {batch.batch_name ||
                            "N/A"}

                        </td>


                        {/* START DATE */}

                        <td>

                          {batch.start_date ||
                            "N/A"}

                        </td>


                        {/* END DATE */}

                        <td>

                          {batch.end_date ||
                            "N/A"}

                        </td>


                        {/* TIMING */}

                        <td>

                          {batch.timing ||
                            "N/A"}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              `batch-status ${(
                                batch.status || ""
                              ).toLowerCase()}`
                            }
                          >

                            {batch.status ||
                              "N/A"}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="batch-actions">


                            <button
                              className="batch-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  batch
                                )
                              }
                            >

                              <FaEdit />

                              <span>
                                Edit
                              </span>

                            </button>


                            <button
                              className="batch-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  batch.id
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

export default AdminBatches;