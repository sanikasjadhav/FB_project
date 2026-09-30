import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminReports.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminReports = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [selectedReport, setSelectedReport] = useState("students");

  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    category: "",
    course: "",
    batch: "",
    status: "",
    mode: "",
    rating: "",
    date: "",
  });

  // =====================================================
  // REPORT INFORMATION
  // =====================================================

  const reportNames = {
    students: "Student Report",
    categories: "Category Report",
    courses: "Course Report",
    batches: "Batch Report",
    enrollments: "Enrollment Report",
    payments: "Payment Report",
    videos: "Course Video Report",
    materials: "Study Material Report",
    certificates: "Certificate Report",
    feedback: "Feedback Report",
  };

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("adminAccessToken");
  };

  // =====================================================
  // FETCH HELPER
  // =====================================================

  const fetchData = async (endpoint) => {

    const token = getToken();

    if (!token) {
      throw new Error(
        "Admin login session expired. Please login again."
      );
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error(
        "Unauthorized. Please login again."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${endpoint}`
      );
    }

    const data = await response.json();

    // DRF pagination
    if (Array.isArray(data)) {
      return data;
    }

    if (data.results) {
      return data.results;
    }

    return [];
  };

  // =====================================================
  // FETCH ALL REPORT DATA
  // =====================================================

  const fetchReports = async () => {

    setLoading(true);
    setError("");

    try {

      const [
        studentsData,
        categoriesData,
        coursesData,
        batchesData,
        enrollmentsData,
        paymentsData,
        videosData,
        materialsData,
        certificatesData,
        feedbackData,
      ] = await Promise.all([

        fetchData("/students/"),

        fetchData("/categories/"),

        fetchData("/courses/"),

        fetchData("/batches/"),

        fetchData("/enrollments/"),

        // IMPORTANT:
        // Admin report uses /payments/
        fetchData("/payments/"),

        fetchData("/course-videos/"),

        fetchData("/study-materials/"),

        fetchData("/certificates/"),

        fetchData("/feedback/"),

      ]);

      setStudents(studentsData);
      setCategories(categoriesData);
      setCourses(coursesData);
      setBatches(batchesData);
      setEnrollments(enrollmentsData);
      setPayments(paymentsData);
      setVideos(videosData);
      setMaterials(materialsData);
      setCertificates(certificatesData);
      setFeedback(feedbackData);

    } catch (err) {

      console.error("Report Error:", err);

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    fetchReports();
  }, []);

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      gender: "",
      category: "",
      course: "",
      batch: "",
      status: "",
      mode: "",
      rating: "",
      date: "",
    });

  };

  // =====================================================
  // REPORT CHANGE
  // =====================================================

  const handleReportChange = (value) => {

    setSelectedReport(value);

    resetFilters();

  };

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (name, value) => {

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  // =====================================================
  // TEXT HELPER
  // =====================================================

  const normalize = (value) => {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .toLowerCase()
      .trim();

  };

  // =====================================================
  // DISPLAY HELPERS
  // =====================================================

  const getStudentName = (item) => {

    if (item.student_name) {
      return item.student_name;
    }

    if (item.student_display) {
      return item.student_display;
    }

    if (
      item.first_name ||
      item.last_name
    ) {
      return `${item.first_name || ""} ${
        item.last_name || ""
      }`.trim();
    }

    return item.student || "";

  };

  const getCourseName = (item) => {

    return (
      item.course_name_display ||
      item.course_name ||
      item.course_display ||
      item.course ||
      ""
    );

  };

  const getBatchName = (item) => {

    return (
      item.batch_name ||
      item.batch_display ||
      item.batch ||
      ""
    );

  };

  const getCategoryName = (item) => {

    if (item.category_name) {
      return item.category_name;
    }

    if (item.category_display) {
      return item.category_display;
    }

    if (
      item.category &&
      typeof item.category === "object"
    ) {
      return (
        item.category.category_name ||
        item.category.name ||
        ""
      );
    }

    // If course/category is returned as an ID,
    // find the category name from categories.
    if (item.category) {

      const category = categories.find(
        (cat) =>
          String(cat.id) ===
          String(item.category)
      );

      if (category) {
        return (
          category.category_name ||
          category.name ||
          ""
        );
      }
    }

    return "";
  };

  // =====================================================
  // GET CURRENT DATA
  // =====================================================

  const getCurrentData = () => {

    switch (selectedReport) {

      case "students":
        return students;

      case "categories":
        return categories;

      case "courses":
        return courses;

      case "batches":
        return batches;

      case "enrollments":
        return enrollments;

      case "payments":
        return payments;

      case "videos":
        return videos;

      case "materials":
        return materials;

      case "certificates":
        return certificates;

      case "feedback":
        return feedback;

      default:
        return [];
    }
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const getFilteredData = () => {

    const data = getCurrentData();

    const search = normalize(filters.search);

    return data.filter((item) => {

      // =================================================
      // STUDENTS
      // =================================================

      if (selectedReport === "students") {

        const studentText = normalize(
          [
            item.id,
            item.first_name,
            item.last_name,
            item.email,
            item.phone,
            item.gender,
            item.address,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          studentText.includes(search);

        const genderMatch =
          !filters.gender ||
          normalize(item.gender) ===
            normalize(filters.gender);

        return (
          searchMatch &&
          genderMatch
        );
      }

      // =================================================
      // CATEGORIES
      // =================================================

      if (selectedReport === "categories") {

        const categoryText = normalize(
          [
            item.id,
            item.category_name,
            item.name,
            item.description,
          ].join(" ")
        );

        return (
          !search ||
          categoryText.includes(search)
        );
      }

      // =================================================
      // COURSES
      // =================================================

      if (selectedReport === "courses") {

        const courseText = normalize(
          [
            item.id,
            item.course_name,
            item.name,
            item.description,
            item.duration,
            item.fees,
            getCategoryName(item),
            item.status,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          courseText.includes(search);

        const categoryMatch =
          !filters.category ||
          normalize(
            getCategoryName(item)
          ) === normalize(filters.category);

        const statusMatch =
          !filters.status ||
          normalize(item.status) ===
            normalize(filters.status);

        return (
          searchMatch &&
          categoryMatch &&
          statusMatch
        );
      }

      // =================================================
      // BATCHES
      // =================================================

      if (selectedReport === "batches") {

        const batchText = normalize(
          [
            item.id,
            item.batch_name,
            getCourseName(item),
            item.start_date,
            item.end_date,
            item.timing,
            item.status,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          batchText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        const statusMatch =
          !filters.status ||
          normalize(item.status) ===
            normalize(filters.status);

        return (
          searchMatch &&
          courseMatch &&
          statusMatch
        );
      }

      // =================================================
      // ENROLLMENTS
      // =================================================

      if (selectedReport === "enrollments") {

        const enrollmentText = normalize(
          [
            item.id,
            getStudentName(item),
            getCourseName(item),
            getBatchName(item),
            item.mode,
            item.enrollment_date,
            item.status,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          enrollmentText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        const batchMatch =
          !filters.batch ||
          normalize(
            getBatchName(item)
          ) === normalize(filters.batch);

        const modeMatch =
          !filters.mode ||
          normalize(item.mode) ===
            normalize(filters.mode);

        const statusMatch =
          !filters.status ||
          normalize(item.status) ===
            normalize(filters.status);

        return (
          searchMatch &&
          courseMatch &&
          batchMatch &&
          modeMatch &&
          statusMatch
        );
      }

      // =================================================
      // PAYMENTS
      // =================================================

      if (selectedReport === "payments") {

        const paymentText = normalize(
          [
            item.id,
            getStudentName(item),
            getCourseName(item),
            item.amount,
            item.status,
            item.razorpay_payment_id,
            item.razorpay_order_id,
            item.created_at,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          paymentText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        const statusMatch =
          !filters.status ||
          normalize(item.status) ===
            normalize(filters.status);

        let dateMatch = true;

        if (filters.date) {

          const paymentDate =
            item.created_at ||
            item.payment_date ||
            "";

          dateMatch =
            normalize(paymentDate).startsWith(
              normalize(filters.date)
            );
        }

        return (
          searchMatch &&
          courseMatch &&
          statusMatch &&
          dateMatch
        );
      }

      // =================================================
      // VIDEOS
      // =================================================

      if (selectedReport === "videos") {

        const videoText = normalize(
          [
            item.id,
            getCourseName(item),
            item.title,
            item.video_title,
            item.video_url,
            item.video,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          videoText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        return (
          searchMatch &&
          courseMatch
        );
      }

      // =================================================
      // MATERIALS
      // =================================================

      if (selectedReport === "materials") {

        const materialText = normalize(
          [
            item.id,
            getCourseName(item),
            item.title,
            item.material_title,
            item.file,
            item.file_url,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          materialText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        return (
          searchMatch &&
          courseMatch
        );
      }

      // =================================================
      // CERTIFICATES
      // =================================================

      if (selectedReport === "certificates") {

        const certificateText = normalize(
          [
            item.id,
            getStudentName(item),
            getCourseName(item),
            item.certificate_number,
            item.certificate_no,
            item.issue_date,
            item.created_at,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          certificateText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        return (
          searchMatch &&
          courseMatch
        );
      }

      // =================================================
      // FEEDBACK
      // =================================================

      if (selectedReport === "feedback") {

        const feedbackText = normalize(
          [
            item.id,
            getStudentName(item),
            getCourseName(item),
            item.rating,
            item.comment,
            item.feedback,
            item.created_at,
            item.date,
          ].join(" ")
        );

        const searchMatch =
          !search ||
          feedbackText.includes(search);

        const courseMatch =
          !filters.course ||
          normalize(
            getCourseName(item)
          ) === normalize(filters.course);

        const ratingMatch =
          !filters.rating ||
          String(item.rating) ===
            String(filters.rating);

        return (
          searchMatch &&
          courseMatch &&
          ratingMatch
        );
      }

      return true;
    });
  };

  // =====================================================
  // FILTERED DATA
  // =====================================================

  const currentData = getFilteredData();

  // =====================================================
  // GET VALUE
  // =====================================================

  const getValue = (value) => {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  };

  // =====================================================
  // REPORT HEADERS
  // =====================================================

  const getHeaders = () => {

    switch (selectedReport) {

      case "students":
        return [
          "ID",
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Gender",
          "Address",
        ];

      case "categories":
        return [
          "ID",
          "Category Name",
          "Description",
        ];

      case "courses":
        return [
          "ID",
          "Course Name",
          "Category",
          "Description",
          "Duration",
          "Fees",
          "Status",
        ];

      case "batches":
        return [
          "ID",
          "Batch Name",
          "Course",
          "Start Date",
          "End Date",
          "Timing",
          "Status",
        ];

      case "enrollments":
        return [
          "ID",
          "Student",
          "Course",
          "Batch",
          "Mode",
          "Enrollment Date",
          "Status",
        ];

      case "payments":
        return [
          "ID",
          "Student",
          "Course",
          "Amount",
          "Payment Status",
          "Razorpay Payment ID",
          "Razorpay Order ID",
          "Payment Date",
        ];

      case "videos":
        return [
          "ID",
          "Course",
          "Title",
          "Video URL",
        ];

      case "materials":
        return [
          "ID",
          "Course",
          "Title",
          "File",
        ];

      case "certificates":
        return [
          "ID",
          "Student",
          "Course",
          "Certificate Number",
          "Issue Date",
        ];

      case "feedback":
        return [
          "ID",
          "Student",
          "Course",
          "Rating",
          "Comment",
          "Date",
        ];

      default:
        return [];
    }
  };

  // =====================================================
  // GET ROW
  // =====================================================

  const getRow = (item) => {

    switch (selectedReport) {

      case "students":
        return [
          item.id,
          item.first_name || "",
          item.last_name || "",
          item.email || "",
          item.phone || "",
          item.gender || "",
          item.address || "",
        ];

      case "categories":
        return [
          item.id,
          item.category_name ||
            item.name ||
            "",
          item.description || "",
        ];

      case "courses":
        return [
          item.id,
          item.course_name ||
            item.name ||
            "",
          getCategoryName(item),
          item.description || "",
          item.duration || "",
          item.fees || "",
          item.status || "",
        ];

      case "batches":
        return [
          item.id,
          item.batch_name || "",
          getCourseName(item),
          item.start_date ||
            item.start ||
            "",
          item.end_date ||
            item.end ||
            "",
          item.timing || "",
          item.status || "",
        ];

      case "enrollments":
        return [
          item.id,
          getStudentName(item),
          getCourseName(item),
          getBatchName(item),
          item.mode || "",
          item.enrollment_date || "",
          item.status || "",
        ];

      case "payments":
        return [
          item.id,
          getStudentName(item),
          getCourseName(item),
          item.amount || "",
          item.status || "",
          item.razorpay_payment_id || "",
          item.razorpay_order_id || "",
          item.created_at ||
            item.payment_date ||
            "",
        ];

      case "videos":
        return [
          item.id,
          getCourseName(item),
          item.title ||
            item.video_title ||
            "",
          item.video_url ||
            item.video ||
            "",
        ];

      case "materials":
        return [
          item.id,
          getCourseName(item),
          item.title ||
            item.material_title ||
            "",
          item.file ||
            item.file_url ||
            "",
        ];

      case "certificates":
        return [
          item.id,
          getStudentName(item),
          getCourseName(item),
          item.certificate_number ||
            item.certificate_no ||
            "",
          item.issue_date ||
            item.created_at ||
            "",
        ];

      case "feedback":
        return [
          item.id,
          getStudentName(item),
          getCourseName(item),
          item.rating || "",
          item.comment ||
            item.feedback ||
            "",
          item.created_at ||
            item.date ||
            "",
        ];

      default:
        return [];
    }
  };

  // =====================================================
  // CSV ESCAPE
  // =====================================================

  const escapeCSV = (value) => {

    const text = getValue(value)
      .toString()
      .replace(/"/g, '""');

    return `"${text}"`;
  };

  // =====================================================
  // DOWNLOAD FILTERED REPORT
  // =====================================================

  const downloadExcel = () => {

    // IMPORTANT:
    // currentData is already FILTERED
    const data = currentData;

    if (!data.length) {

      alert(
        "No filtered data available for this report."
      );

      return;
    }

    const headers = getHeaders();

    const rows = data.map((item) =>
      getRow(item)
    );

    let csv = "";

    // Report title
    csv += escapeCSV(
      reportNames[selectedReport]
    ) + "\n";

    // Filter information
    csv += escapeCSV(
      `Total Filtered Records: ${data.length}`
    ) + "\n\n";

    // Headers
    csv += headers
      .map(escapeCSV)
      .join(",") + "\n";

    // Rows
    rows.forEach((row) => {

      csv += row
        .map(escapeCSV)
        .join(",") + "\n";

    });

    const blob = new Blob(
      ["\ufeff" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${selectedReport}_filtered_report.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // PRINT FILTERED REPORT
  // =====================================================

  const printReport = () => {

    if (!currentData.length) {

      alert(
        "No filtered data available for printing."
      );

      return;
    }

    window.print();
  };

  // =====================================================
  // FILTER OPTIONS
  // =====================================================

  const courseOptions = courses.filter(
    (course, index, self) => {

      const courseName =
        course.course_name ||
        course.name ||
        "";

      return (
        courseName &&
        self.findIndex(
          (c) =>
            normalize(
              c.course_name ||
              c.name ||
              ""
            ) ===
            normalize(courseName)
        ) === index
      );
    }
  );

  const batchOptions = batches.filter(
    (batch, index, self) => {

      const batchName =
        batch.batch_name ||
        batch.batch_display ||
        "";

      return (
        batchName &&
        self.findIndex(
          (b) =>
            normalize(
              b.batch_name ||
              b.batch_display ||
              ""
            ) ===
            normalize(batchName)
        ) === index
      );
    }
  );

  // =====================================================
  // FILTER UI
  // =====================================================

  const renderFilters = () => {

    return (
      <div className="report-filter-panel">

        <div className="filter-title">
          <h3>Filter Report</h3>

          <button
            type="button"
            className="clear-filter-button"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="report-filter-grid">

          {/* ===========================================
              SEARCH
          =========================================== */}

          <div className="filter-group">

            <label>Search</label>

            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                handleFilterChange(
                  "search",
                  e.target.value
                )
              }
              placeholder={
                selectedReport === "students"
                  ? "Name, email, phone..."
                  : "Search report..."
              }
            />

          </div>

          {/* ===========================================
              STUDENT GENDER
          =========================================== */}

          {selectedReport === "students" && (

            <div className="filter-group">

              <label>Gender</label>

              <select
                value={filters.gender}
                onChange={(e) =>
                  handleFilterChange(
                    "gender",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Genders
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

          )}

          {/* ===========================================
              COURSE CATEGORY
          =========================================== */}

          {selectedReport === "courses" && (

            <div className="filter-group">

              <label>Category</label>

              <select
                value={filters.category}
                onChange={(e) =>
                  handleFilterChange(
                    "category",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (

                  <option
                    key={category.id}
                    value={
                      category.category_name ||
                      category.name ||
                      ""
                    }
                  >
                    {category.category_name ||
                      category.name ||
                      ""}
                  </option>

                ))}

              </select>

            </div>

          )}

          {/* ===========================================
              COURSE FILTER
          =========================================== */}

          {[
            "batches",
            "enrollments",
            "payments",
            "videos",
            "materials",
            "certificates",
            "feedback",
          ].includes(selectedReport) && (

            <div className="filter-group">

              <label>Course</label>

              <select
                value={filters.course}
                onChange={(e) =>
                  handleFilterChange(
                    "course",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Courses
                </option>

                {courseOptions.map((course) => {

                  const courseName =
                    course.course_name ||
                    course.name ||
                    "";

                  return (
                    <option
                      key={course.id}
                      value={courseName}
                    >
                      {courseName}
                    </option>
                  );

                })}

              </select>

            </div>

          )}

          {/* ===========================================
              COURSE STATUS
          =========================================== */}

          {selectedReport === "courses" && (

            <div className="filter-group">

              <label>Status</label>

              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    e.target.value
                  )
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

          )}

          {/* ===========================================
              BATCH STATUS
          =========================================== */}

          {selectedReport === "batches" && (

            <div className="filter-group">

              <label>Status</label>

              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    e.target.value
                  )
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

          )}

          {/* ===========================================
              BATCH FILTER
          =========================================== */}

          {selectedReport === "enrollments" && (

            <div className="filter-group">

              <label>Batch</label>

              <select
                value={filters.batch}
                onChange={(e) =>
                  handleFilterChange(
                    "batch",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Batches
                </option>

                {batchOptions.map((batch) => {

                  const batchName =
                    batch.batch_name ||
                    batch.batch_display ||
                    "";

                  return (
                    <option
                      key={batch.id}
                      value={batchName}
                    >
                      {batchName}
                    </option>
                  );

                })}

              </select>

            </div>

          )}

          {/* ===========================================
              ENROLLMENT MODE
          =========================================== */}

          {selectedReport === "enrollments" && (

            <div className="filter-group">

              <label>Mode</label>

              <select
                value={filters.mode}
                onChange={(e) =>
                  handleFilterChange(
                    "mode",
                    e.target.value
                  )
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

          )}

          {/* ===========================================
              ENROLLMENT STATUS
          =========================================== */}

          {selectedReport === "enrollments" && (

            <div className="filter-group">

              <label>Status</label>

              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    e.target.value
                  )
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

          )}

          {/* ===========================================
              PAYMENT STATUS
          =========================================== */}

          {selectedReport === "payments" && (

            <div className="filter-group">

              <label>Payment Status</label>

              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Payment Status
                </option>

                <option value="created">
                  Created
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="failed">
                  Failed
                </option>

              </select>

            </div>

          )}

          {/* ===========================================
              PAYMENT DATE
          =========================================== */}

          {selectedReport === "payments" && (

            <div className="filter-group">

              <label>Payment Date</label>

              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  handleFilterChange(
                    "date",
                    e.target.value
                  )
                }
              />

            </div>

          )}

          {/* ===========================================
              FEEDBACK RATING
          =========================================== */}

          {selectedReport === "feedback" && (

            <div className="filter-group">

              <label>Rating</label>

              <select
                value={filters.rating}
                onChange={(e) =>
                  handleFilterChange(
                    "rating",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Ratings
                </option>

                <option value="5">
                  5 Stars
                </option>

                <option value="4">
                  4 Stars
                </option>

                <option value="3">
                  3 Stars
                </option>

                <option value="2">
                  2 Stars
                </option>

                <option value="1">
                  1 Star
                </option>

              </select>

            </div>

          )}

        </div>

      </div>
    );
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = [
    {
      title: "Students",
      count: students.length,
    },
    {
      title: "Categories",
      count: categories.length,
    },
    {
      title: "Courses",
      count: courses.length,
    },
    {
      title: "Batches",
      count: batches.length,
    },
    {
      title: "Enrollments",
      count: enrollments.length,
    },
    {
      title: "Payments",
      count: payments.length,
    },
    {
      title: "Course Videos",
      count: videos.length,
    },
    {
      title: "Study Materials",
      count: materials.length,
    },
    {
      title: "Certificates",
      count: certificates.length,
    },
    {
      title: "Feedback",
      count: feedback.length,
    },
  ];

  // =====================================================
  // HEADERS
  // =====================================================

  const headers = getHeaders();

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="admin-page">

      {/* SIDEBAR */}

      <AdminSidebar />


      {/* MAIN CONTENT */}

      <main className="admin-content">

        {/* HEADER */}

        <div className="reports-header">

          <div>

            <h1>Reports</h1>

            <p>
              Generate and download Fashion Boutique
              management reports.
            </p>

          </div>

        </div>


        {/* SUMMARY CARDS */}

        <div className="report-summary">

          {summary.map((item) => (

            <div
              className="report-summary-card"
              key={item.title}
            >

              <h3>{item.count}</h3>

              <p>{item.title}</p>

            </div>

          ))}

        </div>


        {/* REPORT CONTROLS */}

        <div className="report-controls">

          <div className="report-select-box">

            <label>
              Select Report
            </label>

            <select
              value={selectedReport}
              onChange={(e) =>
                handleReportChange(
                  e.target.value
                )
              }
            >

              <option value="students">
                Student Report
              </option>

              <option value="categories">
                Category Report
              </option>

              <option value="courses">
                Course Report
              </option>

              <option value="batches">
                Batch Report
              </option>

              <option value="enrollments">
                Enrollment Report
              </option>

              <option value="payments">
                Payment Report
              </option>

              <option value="videos">
                Course Video Report
              </option>

              <option value="materials">
                Study Material Report
              </option>

              <option value="certificates">
                Certificate Report
              </option>

              <option value="feedback">
                Feedback Report
              </option>

            </select>

          </div>


          <div className="report-buttons">

            <button
              className="refresh-report"
              onClick={fetchReports}
            >
              🔄 Refresh
            </button>

            <button
              className="excel-button"
              onClick={downloadExcel}
            >
              📊 Download Excel
            </button>

            <button
              className="pdf-button"
              onClick={printReport}
            >
              📄 Print / PDF
            </button>

          </div>

        </div>


        {/* FILTERS */}

        {renderFilters()}


        {/* ERROR */}

        {error && (

          <div className="report-error">

            {error}

          </div>

        )}


        {/* REPORT CARD */}

        <div className="report-card">

          <div className="report-card-header">

            <div>

              <h2>
                {reportNames[selectedReport]}
              </h2>

              <p>
                Showing{" "}
                <strong>
                  {currentData.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {getCurrentData().length}
                </strong>{" "}
                records
              </p>

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="report-loading">
              Loading report data...
            </div>

          ) : currentData.length === 0 ? (

            <div className="no-report-data">

              No records match the selected filters.

            </div>

          ) : (

            <div className="report-table-container">

              <table className="report-table">

                <thead>

                  <tr>

                    {headers.map((header) => (

                      <th key={header}>
                        {header}
                      </th>

                    ))}

                  </tr>

                </thead>


                <tbody>

                  {currentData.map(
                    (item, index) => {

                      const row =
                        getRow(item);

                      return (

                        <tr
                          key={
                            item.id ||
                            index
                          }
                        >

                          {row.map(
                            (
                              value,
                              cellIndex
                            ) => (

                              <td
                                key={
                                  cellIndex
                                }
                                title={getValue(
                                  value
                                )}
                              >
                                {getValue(
                                  value
                                )}
                              </td>

                            )
                          )}

                        </tr>

                      );

                    }
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

export default AdminReports;