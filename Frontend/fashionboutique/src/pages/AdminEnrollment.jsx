import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserGraduate
} from "react-icons/fa";

import "./AdminEnrollment.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminEnrollment = () => {

  // =========================
  // STATES
  // =========================

  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    batch: "",
    status: "Pending"
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
        fetchBatches()
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
  // ADD ENROLLMENT
  // =====================================================

  const handleAdd = () => {

    setEditingId(null);

    setFormData({
      student: "",
      course: "",
      batch: "",
      status: "Pending"
    });

    setShowForm(true);

  };


  // =====================================================
  // EDIT ENROLLMENT
  // =====================================================

  const handleEdit = (enrollment) => {

    setEditingId(enrollment.id);

    setFormData({
      student: enrollment.student || "",
      course: enrollment.course || "",
      batch: enrollment.batch || "",
      status: enrollment.status || "Pending"
    });

    setShowForm(true);

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
            "Content-Type": "application/json"
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
              formData.status

          })

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
        status: "Pending"
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
            method: "DELETE"
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
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    setShowForm(false);

    setEditingId(null);

    setFormData({
      student: "",
      course: "",
      batch: "",
      status: "Pending"
    });

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


      {/* =========================
          ADMIN SIDEBAR
      ========================= */}

      <AdminSidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="enrollment-main">


        {/* =========================
            HEADER
        ========================= */}

        <div className="enrollment-header">

          <div>

            <h1>
              Enrollments
            </h1>

            <p>
              Manage student course enrollments
            </p>

          </div>


          <button
            className="add-enrollment-btn"
            onClick={handleAdd}
          >

            <FaPlus />

            <span>
              Add Enrollment
            </span>

          </button>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (

          <div className="enrollment-error">

            {error}

          </div>

        )}


        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        {showForm && (

          <div className="enrollment-form-card">


            <div className="form-title">

              <h2>

                {editingId
                  ? "Edit Enrollment"
                  : "Add New Enrollment"
                }

              </h2>

            </div>


            <form
              onSubmit={handleSubmit}
            >


              {/* =========================
                  STUDENT
              ========================= */}

              <div className="form-group">

                <label>
                  Student
                </label>


                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
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
                          ? `${student.first_name} ${student.last_name || ""}`
                          : student.email}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* =========================
                  COURSE
              ========================= */}

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
                  BATCH
              ========================= */}

              <div className="form-group">

                <label>
                  Batch
                </label>


                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
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


              {/* =========================
                  STATUS
              ========================= */}

              <div className="form-group">

                <label>
                  Enrollment Status
                </label>


                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
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


              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="form-buttons">


                <button
                  type="submit"
                  className="save-btn"
                >

                  {editingId
                    ? "Update Enrollment"
                    : "Save Enrollment"
                  }

                </button>


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =========================
            TABLE
        ========================= */}

        <div className="enrollment-table-card">


          <div className="table-heading">

            <div>

              <h2>
                Enrollment List
              </h2>

              <p>
                View and manage student enrollments
              </p>

            </div>


            <div className="enrollment-count">

              <FaUserGraduate />

              <span>
                {enrollments.length}
              </span>

            </div>

          </div>


          {/* =========================
              TABLE
          ========================= */}

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


                {enrollments.length > 0 ? (

                  enrollments.map(
                    (enrollment) => (

                      <tr
                        key={enrollment.id}
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


                        {/* EMAIL */}

                        


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
                              `enrollment-status ${(
                                enrollment.status || ""
                              ).toLowerCase()}`
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
                      colSpan="8"
                      className="no-enrollment"
                    >

                      <div>
                        👩‍🎓
                      </div>

                      <h3>
                        No Enrollments Found
                      </h3>

                      <p>
                        Add your first student
                        enrollment using the
                        button above.
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