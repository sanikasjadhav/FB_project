import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminStudents.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminStudents = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Edit
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminAccessToken") ||
        localStorage.getItem("adminAccess");

      const response = await fetch(`${API_URL}/students/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setStudents(data);
        setTotalStudents(data.length);
      } else if (data.results) {
        setStudents(data.results);
        setTotalStudents(data.count || data.results.length);
      } else {
        setStudents([]);
        setTotalStudents(0);
      }
    } catch (err) {
      console.error("Fetch students error:", err);
      setError("Unable to load student records.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = students.filter((student) => {
    const fullName =
      `${student.first_name || ""} ${student.last_name || ""}`.toLowerCase();

    const email = student.email?.toLowerCase() || "";
    const phone = student.phone?.toString().toLowerCase() || "";
    const gender = student.gender?.toLowerCase() || "";
    const address = student.address?.toLowerCase() || "";

    const search = searchText.toLowerCase().trim();

    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search) ||
      gender.includes(search) ||
      address.includes(search);

    const matchesGender =
      !genderFilter ||
      gender === genderFilter.toLowerCase();

    return matchesSearch && matchesGender;
  });

  // =====================================================
  // CLEAR FILTER
  // =====================================================

  const clearFilters = () => {
    setSearchText("");
    setGenderFilter("");
  };

  // =====================================================
  // EDIT STUDENT
  // =====================================================

  const handleEdit = (student) => {
    setEditingStudent({
      id: student.id,
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      email: student.email || "",
      phone: student.phone || "",
      gender: student.gender || "",
      address: student.address || "",
    });

    setShowEditForm(true);
  };

  // =====================================================
  // UPDATE STUDENT
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingStudent) return;

    try {
      setUpdating(true);

      const token =
        localStorage.getItem("adminAccessToken") ||
        localStorage.getItem("adminAccess");

      const response = await fetch(
        `${API_URL}/students/${editingStudent.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: editingStudent.first_name,
            last_name: editingStudent.last_name,
            email: editingStudent.email,
            phone: editingStudent.phone,
            gender: editingStudent.gender,
            address: editingStudent.address,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("Student updated successfully.");

        setShowEditForm(false);
        setEditingStudent(null);

        fetchStudents();
      } else {
        console.error("Update error:", data);

        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

          alert(messages || "Failed to update student.");
        } else {
          alert("Failed to update student.");
        }
      }
    } catch (err) {
      console.error("Update student error:", err);
      alert("Something went wrong while updating the student.");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("adminAccessToken") ||
        localStorage.getItem("adminAccess");

      const response = await fetch(`${API_URL}/students/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Student deleted successfully.");

        fetchStudents();
      } else {
        const data = await response.json().catch(() => ({}));

        console.error("Delete error:", data);

        alert(data.detail || "Failed to delete student.");
      }
    } catch (err) {
      console.error("Delete student error:", err);
      alert("Something went wrong while deleting the student.");
    }
  };

  // =====================================================
  // DOWNLOAD REPORT
  // =====================================================

  const downloadReport = () => {
    if (filteredStudents.length === 0) {
      alert("There are no student records to download.");
      return;
    }

    const headers = [
      "ID",
      "Student Name",
      "Email",
      "Phone",
      "Gender",
      "Address",
    ];

    const rows = filteredStudents.map((student) => [
      student.id,
      `${student.first_name || ""} ${student.last_name || ""}`.trim(),
      student.email || "N/A",
      student.phone || "N/A",
      student.gender || "N/A",
      student.address || "N/A",
    ]);

    const escapeCSV = (value) => {
      const stringValue = String(value ?? "");

      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const BOM = "\uFEFF";

    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `Student_Report_${
      new Date().toISOString().slice(0, 10)
    }.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {
    setShowEditForm(false);
    setEditingStudent(null);
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="admin-page">

      {/* EXISTING ADMIN SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <div className="admin-content">

        {/* PAGE HEADER */}

        <div className="admin-page-header">

          <div>
            <h1>Students</h1>

            <p>
              Manage registered student records
            </p>
          </div>

        </div>

        {/* =================================================
            TOTAL STUDENTS
        ================================================= */}

        <div className="student-stat-card">

          <h3>Total Students</h3>

          <h2>{totalStudents}</h2>

        </div>

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <div className="student-filters">

          <div className="student-filter-group">

            <label>
              Search Student
            </label>

            <input
              type="text"
              placeholder="Name, email, phone..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

          </div>

          <div className="student-filter-group">

            <label>
              Gender
            </label>

            <select
              value={genderFilter}
              onChange={(e) =>
                setGenderFilter(e.target.value)
              }
            >

              <option value="">
                All Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          <div className="student-filter-buttons">

            <button
              className="student-clear-btn"
              onClick={clearFilters}
            >
              Clear Filter
            </button>

            <button
              className="student-download-btn"
              onClick={downloadReport}
            >
              Download Report
            </button>

          </div>

          <div className="student-filter-result">

            Showing{" "}
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            of{" "}
            <strong>
              {students.length}
            </strong>{" "}
            students

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="student-error">
            {error}
          </div>
        )}

        {/* =================================================
            STUDENT TABLE
        ================================================= */}

        <div className="students-table-container">

          {loading ? (

            <div className="student-loading">
              Loading students...
            </div>

          ) : filteredStudents.length === 0 ? (

            <div className="student-no-data">

              {students.length === 0
                ? "No students found."
                : "No students match your filter."}

            </div>

          ) : (

            <table className="students-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Gender
                  </th>

                  <th>
                    Address
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredStudents.map((student) => (

                  <tr key={student.id}>

                    <td className="student-id">
                      {student.id}
                    </td>

                    <td>
                      {student.first_name || ""}{" "}
                      {student.last_name || ""}
                    </td>

                    <td>
                      {student.email || "N/A"}
                    </td>

                    <td>
                      {student.phone || "N/A"}
                    </td>

                    <td>
                      {student.gender || "N/A"}
                    </td>

                    <td>
                      {student.address || "N/A"}
                    </td>

                    <td className="student-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(student.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* =================================================
          EDIT STUDENT MODAL
      ================================================= */}

      {showEditForm && editingStudent && (

        <div className="edit-modal">

          <div className="edit-modal-content">

            <div className="edit-modal-header">

              <h2>
                Edit Student
              </h2>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeEditModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleUpdate}>

              {/* ID */}

              <div className="edit-input-group">

                <label>
                  Student ID
                </label>

                <input
                  type="text"
                  value={editingStudent.id}
                  disabled
                />

              </div>

              {/* FIRST + LAST NAME */}

              <div className="edit-form-row">

                <div className="edit-input-group">

                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    value={editingStudent.first_name}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        first_name:
                          e.target.value,
                      })
                    }
                    required
                  />

                </div>

                <div className="edit-input-group">

                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={editingStudent.last_name}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        last_name:
                          e.target.value,
                      })
                    }
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="edit-input-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      email: e.target.value,
                    })
                  }
                  required
                />

              </div>

              {/* PHONE */}

              <div className="edit-input-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  value={editingStudent.phone}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              {/* GENDER */}

              <div className="edit-input-group">

                <label>
                  Gender
                </label>

                <select
                  value={editingStudent.gender}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      gender: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* ADDRESS */}

              <div className="edit-input-group">

                <label>
                  Address
                </label>

                <textarea
                  value={editingStudent.address}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      address: e.target.value,
                    })
                  }
                />

              </div>

              {/* FORM BUTTONS */}

              <div className="edit-form-actions">

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={closeEditModal}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-btn"
                  disabled={updating}
                >
                  {updating
                    ? "Updating..."
                    : "Update Student"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminStudents;