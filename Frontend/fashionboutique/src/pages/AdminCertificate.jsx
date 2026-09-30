import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminCertificate.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    enrollment: "",
    certificate_number: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SEARCH
  // =====================================================

  const [showSearchForm, setShowSearchForm] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchCertificates();
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  // =====================================================
  // FETCH CERTIFICATES
  // =====================================================

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${API_URL}/certificates/`);
      const data = await response.json();

      console.log("Certificates API:", data);

      if (!response.ok) {
        setError("Unable to load certificates.");
        return;
      }

      if (Array.isArray(data)) {
        setCertificates(data);
      } else if (data.results) {
        setCertificates(data.results);
      } else {
        setCertificates([]);
      }
    } catch (err) {
      console.error("Certificate fetch error:", err);
      setError("Unable to connect to backend.");
    }
  };

  // =====================================================
  // FETCH ENROLLMENTS
  // =====================================================

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_URL}/enrollments/`);
      const data = await response.json();

      console.log("Enrollments API:", data);

      if (!response.ok) {
        setError("Unable to load enrollments.");
        return;
      }

      if (Array.isArray(data)) {
        setEnrollments(data);
      } else if (data.results) {
        setEnrollments(data.results);
      } else {
        setEnrollments([]);
      }
    } catch (err) {
      console.error("Enrollment fetch error:", err);
    }
  };

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students/`);
      const data = await response.json();

      if (!response.ok) {
        return;
      }

      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data.results) {
        setStudents(data.results);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Student fetch error:", err);
    }
  };

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses/`);
      const data = await response.json();

      if (!response.ok) {
        return;
      }

      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data.results) {
        setCourses(data.results);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Course fetch error:", err);
    }
  };

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
  // HANDLE SEARCH FILTER CHANGE
  // =====================================================

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // GET STUDENT NAME
  // =====================================================

  const getStudentName = (studentId) => {
    const student = students.find(
      (item) => Number(item.id) === Number(studentId)
    );

    if (!student) {
      return "-";
    }

    return `${student.first_name || ""} ${
      student.last_name || ""
    }`.trim();
  };

  // =====================================================
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) => Number(item.id) === Number(courseId)
    );

    return course?.course_name || "-";
  };

  // =====================================================
  // GET ENROLLMENT DETAILS
  // =====================================================

  const getEnrollmentDetails = (enrollment) => {
    const studentName =
      enrollment.student_name ||
      getStudentName(enrollment.student);

    const courseName =
      enrollment.course_name ||
      getCourseName(enrollment.course);

    return `${studentName} - ${courseName}`;
  };

  // =====================================================
  // FILTER CERTIFICATES
  // =====================================================

  const filteredCertificates = certificates.filter(
    (certificate) => {
      const searchText = filters.search
        .trim()
        .toLowerCase();

      if (!searchText) {
        return true;
      }

      const certificateNumber = (
        certificate.certificate_number || ""
      ).toLowerCase();

      const studentName = (
        certificate.student_name ||
        getStudentName(certificate.student) ||
        ""
      ).toLowerCase();

      const courseName = (
        certificate.course_name ||
        getCourseName(certificate.course) ||
        ""
      ).toLowerCase();

      return (
        certificateNumber.includes(searchText) ||
        studentName.includes(searchText) ||
        courseName.includes(searchText)
      );
    }
  );

  // =====================================================
  // RESET SEARCH
  // =====================================================

  const resetFilters = () => {
    setFilters({
      search: "",
    });
  };

  // =====================================================
  // OPEN SEARCH FORM
  // =====================================================

  const openSearchForm = () => {
    setShowSearchForm((previous) => !previous);
  };

  // =====================================================
  // EDIT CERTIFICATE
  // =====================================================

  const handleEdit = (certificate) => {
    setMessage("");
    setError("");

    setShowSearchForm(false);

    setEditingId(certificate.id);

    const matchingEnrollment = enrollments.find(
      (enrollment) =>
        Number(enrollment.student) ===
          Number(certificate.student) &&
        Number(enrollment.course) ===
          Number(certificate.course)
    );

    setFormData({
      enrollment: matchingEnrollment
        ? String(matchingEnrollment.id)
        : "",
      certificate_number:
        certificate.certificate_number || "",
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
      certificate_number: "",
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // ISSUE / UPDATE CERTIFICATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.enrollment ||
      !formData.certificate_number
    ) {
      setError(
        "Please select enrollment and enter certificate number."
      );
      return;
    }

    setLoading(true);

    try {
      const selectedEnrollment = enrollments.find(
        (item) =>
          Number(item.id) ===
          Number(formData.enrollment)
      );

      if (!selectedEnrollment) {
        setError("Selected enrollment not found.");
        setLoading(false);
        return;
      }

      // Check completed enrollment
      if (
        selectedEnrollment.status &&
        selectedEnrollment.status.toLowerCase() !==
          "completed"
      ) {
        setError(
          "Certificate can only be issued for a completed enrollment."
        );

        setLoading(false);
        return;
      }

      const certificateData = {
        student: Number(selectedEnrollment.student),
        course: Number(selectedEnrollment.course),
        certificate_number:
          formData.certificate_number,
      };

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        const response = await fetch(
          `${API_URL}/certificates/${editingId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(certificateData),
          }
        );

        const data = await response.json();

        console.log(
          "Certificate update response:",
          data
        );

        if (!response.ok) {
          setError(JSON.stringify(data));
          setLoading(false);
          return;
        }

        setMessage(
          "Certificate updated successfully."
        );

        setEditingId(null);

        setFormData({
          enrollment: "",
          certificate_number: "",
        });

        await fetchCertificates();

        setLoading(false);
        return;
      }

      // =================================================
      // ADD
      // =================================================

      const response = await fetch(
        `${API_URL}/certificates/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(certificateData),
        }
      );

      const data = await response.json();

      console.log(
        "Certificate save response:",
        data
      );

      if (!response.ok) {
        console.error(
          "Certificate backend error:",
          data
        );

        setError(JSON.stringify(data));
        setLoading(false);
        return;
      }

      setMessage(
        "Certificate issued successfully."
      );

      setFormData({
        enrollment: "",
        certificate_number: "",
      });

      await fetchCertificates();
    } catch (err) {
      console.error(
        "Certificate save error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );
    }

    setLoading(false);
  };

  // =====================================================
  // DELETE CERTIFICATE
  // =====================================================

  const deleteCertificate = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/certificates/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setError(
          "Unable to delete certificate."
        );
        return;
      }

      setMessage(
        "Certificate deleted successfully."
      );

      if (editingId === id) {
        handleCancelEdit();
      }

      await fetchCertificates();
    } catch (err) {
      console.error(
        "Delete certificate error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );
    }
  };

  // =====================================================
  // DOWNLOAD FILTERED REPORT
  // =====================================================

  const escapeCSV = (value) => {
    return `"${String(value ?? "").replace(
      /"/g,
      '""'
    )}"`;
  };

  const downloadCertificateReport = () => {
    if (filteredCertificates.length === 0) {
      alert("No certificates available to download.");
      return;
    }

    const headers = [
      "Certificate ID",
      "Certificate Number",
      "Student",
      "Course",
      "Issue Date",
    ];

    const rows = filteredCertificates.map(
      (certificate) => [
        certificate.id || "",
        certificate.certificate_number || "",
        certificate.student_name ||
          getStudentName(certificate.student) ||
          "",
        certificate.course_name ||
          getCourseName(certificate.course) ||
          "",
        certificate.issue_date
          ? new Date(
              certificate.issue_date
            ).toLocaleDateString("en-IN")
          : "",
      ]
    );

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
    link.download =
      "filtered_certificates_report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-certificate-layout">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN BODY */}
      <div className="admin-certificate-body">

        {/* HEADER */}
        <div className="certificate-header">

          <div>
            <h1>Certificates</h1>

            <p>
              Manage student certificates
            </p>
          </div>

          <div className="certificate-header-buttons">

            {/* SEARCH BUTTON */}
            <button
              type="button"
              className="search-certificate-btn"
              onClick={openSearchForm}
            >
              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Certificates"}
            </button>

            {/* COUNT */}
            <div className="certificate-count">
              Total Certificates:{" "}
              {certificates.length}
            </div>

          </div>

        </div>

        {/* SEARCH FORM */}

        {showSearchForm && (
          <section className="certificate-search-card">

            <div className="certificate-search-title">

              <h2>
                Search Certificates
              </h2>

              <p>
                Search by certificate number,
                student name, or course name.
              </p>

            </div>

            <div className="certificate-search-form">

              <div className="certificate-search-field">

                <label>
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Certificate number, student name or course..."
                />

              </div>

              <div className="certificate-search-actions">

                <button
                  type="button"
                  className="reset-certificate-search-btn"
                  onClick={resetFilters}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="download-certificate-report-btn"
                  onClick={downloadCertificateReport}
                  disabled={
                    filteredCertificates.length === 0
                  }
                >
                  ↓ Download Report
                </button>

              </div>

            </div>

            <div className="certificate-filter-result">

              Showing{" "}
              <strong>
                {filteredCertificates.length}
              </strong>{" "}
              of{" "}
              <strong>
                {certificates.length}
              </strong>{" "}
              certificates

            </div>

          </section>
        )}

        {/* ALERTS */}

        {message && (
          <div className="certificate-alert success">
            {message}
          </div>
        )}

        {error && (
          <div className="certificate-alert error">
            {error}
          </div>
        )}

        {/* ISSUE / EDIT CERTIFICATE */}

        <div className="certificate-card">

          <div className="certificate-card-title">

            <h2>
              {editingId
                ? "Edit Certificate"
                : "Issue Certificate"}
            </h2>

            <p>
              {editingId
                ? "Update certificate details below"
                : "Create a certificate for a completed enrollment"}
            </p>

          </div>

          <form
            className="certificate-form"
            onSubmit={handleSubmit}
          >

            {/* ENROLLMENT */}

            <div className="certificate-input">

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
                      {getEnrollmentDetails(
                        enrollment
                      )}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* CERTIFICATE NUMBER */}

            <div className="certificate-input">

              <label>
                Certificate Number{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="certificate_number"
                value={
                  formData.certificate_number
                }
                onChange={handleChange}
                placeholder="FB-CERT-001"
                required
              />

            </div>

            {/* BUTTON */}

            <div className="certificate-button-group">

              <button
                type="submit"
                disabled={loading}
                className={
                  editingId
                    ? "update-certificate-btn"
                    : "issue-certificate-btn"
                }
              >

                {loading
                  ? editingId
                    ? "Updating..."
                    : "Issuing..."
                  : editingId
                  ? "Update Certificate"
                  : "Issue Certificate"}

              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-certificate-btn"
                  onClick={
                    handleCancelEdit
                  }
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* CERTIFICATE RECORDS */}

        <div className="certificate-card">

          <div className="certificate-card-title">

            <h2>
              Certificate Records
            </h2>

            <p>
              All issued certificates
            </p>

          </div>

          <div className="certificate-table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>
                    Certificate No.
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Issue Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCertificates.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="certificate-empty"
                    >
                      {certificates.length === 0
                        ? "No certificates found."
                        : "No certificates match your search."}
                    </td>

                  </tr>

                ) : (

                  filteredCertificates.map(
                    (certificate) => (

                      <tr
                        key={certificate.id}
                      >

                        <td>
                          #{certificate.id}
                        </td>

                        <td>

                          <strong>
                            {
                              certificate.certificate_number
                            }
                          </strong>

                        </td>

                        <td>
                          {certificate.student_name ||
                            getStudentName(
                              certificate.student
                            )}
                        </td>

                        <td>
                          {certificate.course_name ||
                            getCourseName(
                              certificate.course
                            )}
                        </td>

                        <td>

                          {certificate.issue_date
                            ? new Date(
                                certificate.issue_date
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}

                        </td>

                        <td>

                          <div className="certificate-action-buttons">

                            {/* EDIT */}

                            <button
                              type="button"
                              className="edit-certificate-btn"
                              onClick={() =>
                                handleEdit(
                                  certificate
                                )
                              }
                            >
                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-certificate-btn"
                              onClick={() =>
                                deleteCertificate(
                                  certificate.id
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

export default AdminCertificate;