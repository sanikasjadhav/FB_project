import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminReports.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminReports = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH API DATA
  // =====================================================

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}/`);

      if (!response.ok) {
        throw new Error(`Failed to load ${endpoint}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      }

      if (data.results) {
        return data.results;
      }

      return [];
    } catch (err) {
      console.error(`${endpoint} error:`, err);
      return [];
    }
  };

  // =====================================================
  // LOAD ALL REPORT DATA
  // =====================================================

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          studentsData,
          coursesData,
          batchesData,
          enrollmentsData,
          paymentsData,
          certificatesData,
          feedbacksData,
          videosData,
          materialsData,
        ] = await Promise.all([
          fetchData("students"),
          fetchData("courses"),
          fetchData("batches"),
          fetchData("enrollments"),
          fetchData("payments"),
          fetchData("certificates"),
          fetchData("feedback"),
          fetchData("course-videos"),
          fetchData("study-materials"),
        ]);

        setStudents(studentsData);
        setCourses(coursesData);
        setBatches(batchesData);
        setEnrollments(enrollmentsData);
        setPayments(paymentsData);
        setCertificates(certificatesData);
        setFeedbacks(feedbacksData);
        setVideos(videosData);
        setMaterials(materialsData);
      } catch (err) {
        console.error(err);
        setError("Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // =====================================================
  // TOTAL REVENUE
  // =====================================================

  const totalRevenue = payments.reduce((total, payment) => {
    const status =
      payment.status ||
      payment.payment_status ||
      "";

    if (
      status.toLowerCase() === "successful" ||
      status.toLowerCase() === "success"
    ) {
      return total + Number(payment.amount || 0);
    }

    return total;
  }, 0);

  // =====================================================
  // PAYMENT TOTALS
  // =====================================================

  const successfulPayments = payments.filter((payment) => {
    const status =
      payment.status ||
      payment.payment_status ||
      "";

    return (
      status.toLowerCase() === "successful" ||
      status.toLowerCase() === "success"
    );
  });

  const pendingPayments = payments.filter((payment) => {
    const status =
      payment.status ||
      payment.payment_status ||
      "";

    return status.toLowerCase() === "pending";
  });

  const failedPayments = payments.filter((payment) => {
    const status =
      payment.status ||
      payment.payment_status ||
      "";

    return status.toLowerCase() === "failed";
  });

  // =====================================================
  // ENROLLMENT STATUS
  // =====================================================

  const pendingEnrollments = enrollments.filter(
    (item) =>
      item.status?.toLowerCase() === "pending"
  );

  const activeEnrollments = enrollments.filter(
    (item) =>
      item.status?.toLowerCase() === "enrolled"
  );

  const completedEnrollments = enrollments.filter(
    (item) =>
      item.status?.toLowerCase() === "completed"
  );

  const cancelledEnrollments = enrollments.filter(
    (item) =>
      item.status?.toLowerCase() === "cancelled"
  );

  // =====================================================
  // BATCH STATUS
  // =====================================================

  const upcomingBatches = batches.filter(
    (batch) =>
      batch.status?.toLowerCase() === "upcoming"
  );

  const ongoingBatches = batches.filter(
    (batch) =>
      batch.status?.toLowerCase() === "ongoing"
  );

  const completedBatches = batches.filter(
    (batch) =>
      batch.status?.toLowerCase() === "completed"
  );

  // =====================================================
  // COURSE NAME
  // =====================================================

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) =>
        Number(item.id) === Number(courseId)
    );

    return course?.course_name || "-";
  };

  // =====================================================
  // COURSE-WISE ENROLLMENTS
  // =====================================================

  const courseReports = courses.map((course) => {
    const courseEnrollments = enrollments.filter(
      (enrollment) =>
        Number(enrollment.course) ===
        Number(course.id)
    );

    const coursePayments = payments.filter(
      (payment) => {
        const enrollment = enrollments.find(
          (item) =>
            Number(item.id) ===
            Number(payment.enrollment)
        );

        return (
          enrollment &&
          Number(enrollment.course) ===
            Number(course.id)
        );
      }
    );

    const revenue = coursePayments.reduce(
      (total, payment) => {
        const status =
          payment.status ||
          payment.payment_status ||
          "";

        if (
          status.toLowerCase() ===
            "successful" ||
          status.toLowerCase() === "success"
        ) {
          return (
            total +
            Number(payment.amount || 0)
          );
        }

        return total;
      },
      0
    );

    return {
      id: course.id,
      name: course.course_name,
      enrollments: courseEnrollments.length,
      revenue,
    };
  });

  // =====================================================
  // PRINT REPORT
  // =====================================================

  const printReport = () => {
    window.print();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-report-loading">
        Loading reports...
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-reports-layout">

      <AdminSidebar />

      <div className="admin-reports-body">

        {/* =========================
            HEADER
        ========================= */}

        <div className="reports-header">

          <div>
            <h1>Reports</h1>

            <p>
              View complete reports of your
              Fashion Boutique management system
            </p>
          </div>

          <button
            className="print-report-btn"
            onClick={printReport}
          >
            Print Report
          </button>

        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="report-alert">
            {error}
          </div>
        )}

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <div className="report-summary-grid">

          <div className="report-summary-card">
            <h3>Total Students</h3>
            <strong>{students.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Total Courses</h3>
            <strong>{courses.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Total Batches</h3>
            <strong>{batches.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Total Enrollments</h3>
            <strong>{enrollments.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Total Payments</h3>
            <strong>{payments.length}</strong>
          </div>

          <div className="report-summary-card revenue-card">
            <h3>Total Revenue</h3>
            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="report-summary-card">
            <h3>Certificates</h3>
            <strong>{certificates.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Feedback</h3>
            <strong>{feedbacks.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Course Videos</h3>
            <strong>{videos.length}</strong>
          </div>

          <div className="report-summary-card">
            <h3>Study Materials</h3>
            <strong>{materials.length}</strong>
          </div>

        </div>

        {/* =========================
            ENROLLMENT REPORT
        ========================= */}

        <div className="report-card">

          <div className="report-card-title">
            <h2>Enrollment Report</h2>

            <p>
              Enrollment status summary
            </p>
          </div>

          <div className="status-grid">

            <div className="status-box pending">
              <span>Pending</span>
              <strong>
                {pendingEnrollments.length}
              </strong>
            </div>

            <div className="status-box enrolled">
              <span>Enrolled</span>
              <strong>
                {activeEnrollments.length}
              </strong>
            </div>

            <div className="status-box completed">
              <span>Completed</span>
              <strong>
                {completedEnrollments.length}
              </strong>
            </div>

            <div className="status-box cancelled">
              <span>Cancelled</span>
              <strong>
                {cancelledEnrollments.length}
              </strong>
            </div>

          </div>

        </div>

        {/* =========================
            PAYMENT REPORT
        ========================= */}

        <div className="report-card">

          <div className="report-card-title">

            <h2>Payment Report</h2>

            <p>
              Payment transaction summary
            </p>

          </div>

          <div className="status-grid">

            <div className="status-box successful">
              <span>Successful</span>

              <strong>
                {successfulPayments.length}
              </strong>
            </div>

            <div className="status-box pending">
              <span>Pending</span>

              <strong>
                {pendingPayments.length}
              </strong>
            </div>

            <div className="status-box failed">
              <span>Failed</span>

              <strong>
                {failedPayments.length}
              </strong>
            </div>

            <div className="status-box revenue">
              <span>Revenue</span>

              <strong>
                ₹{totalRevenue.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </div>

        {/* =========================
            BATCH REPORT
        ========================= */}

        <div className="report-card">

          <div className="report-card-title">

            <h2>Batch Report</h2>

            <p>
              Current batch status
            </p>

          </div>

          <div className="status-grid">

            <div className="status-box upcoming">
              <span>Upcoming</span>

              <strong>
                {upcomingBatches.length}
              </strong>
            </div>

            <div className="status-box enrolled">
              <span>Ongoing</span>

              <strong>
                {ongoingBatches.length}
              </strong>
            </div>

            <div className="status-box completed">
              <span>Completed</span>

              <strong>
                {completedBatches.length}
              </strong>
            </div>

            <div className="status-box total">
              <span>Total</span>

              <strong>
                {batches.length}
              </strong>
            </div>

          </div>

        </div>

        {/* =========================
            COURSE REPORT
        ========================= */}

        <div className="report-card">

          <div className="report-card-title">

            <h2>Course-wise Report</h2>

            <p>
              Enrollment and revenue for each course
            </p>

          </div>

          <div className="report-table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Enrollments</th>
                  <th>Revenue</th>
                </tr>

              </thead>

              <tbody>

                {courseReports.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="report-empty"
                    >
                      No course records found.
                    </td>
                  </tr>

                ) : (

                  courseReports.map((course) => (

                    <tr key={course.id}>

                      <td>
                        #{course.id}
                      </td>

                      <td>
                        <strong>
                          {course.name}
                        </strong>
                      </td>

                      <td>
                        {course.enrollments}
                      </td>

                      <td className="revenue-text">
                        ₹
                        {course.revenue.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =========================
            SYSTEM CONTENT REPORT
        ========================= */}

        <div className="report-card">

          <div className="report-card-title">

            <h2>Learning Content Report</h2>

            <p>
              Available online learning resources
            </p>

          </div>

          <div className="content-report-grid">

            <div className="content-box">
              <span>Courses</span>
              <strong>{courses.length}</strong>
            </div>

            <div className="content-box">
              <span>Videos</span>
              <strong>{videos.length}</strong>
            </div>

            <div className="content-box">
              <span>Study Materials</span>
              <strong>{materials.length}</strong>
            </div>

            <div className="content-box">
              <span>Certificates</span>
              <strong>{certificates.length}</strong>
            </div>

          </div>

        </div>

        {/* =========================
            STUDENT ACTIVITY REPORT
        ========================= */}

        <div className="report-card">

          <div className="report-card-title">

            <h2>Student Activity Report</h2>

            <p>
              Overall student participation
            </p>

          </div>

          <div className="activity-report">

            <div>
              <span>Total Students</span>
              <strong>{students.length}</strong>
            </div>

            <div>
              <span>Total Enrollments</span>
              <strong>{enrollments.length}</strong>
            </div>

            <div>
              <span>Completed Enrollments</span>
              <strong>
                {completedEnrollments.length}
              </strong>
            </div>

            <div>
              <span>Certificates Issued</span>
              <strong>{certificates.length}</strong>
            </div>

            <div>
              <span>Feedback Received</span>
              <strong>{feedbacks.length}</strong>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminReports;