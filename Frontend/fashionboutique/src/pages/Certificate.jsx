import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Certificate.css";

const API_URL = "http://127.0.0.1:8000/api";

function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const student =
    JSON.parse(localStorage.getItem("student")) || null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!student?.id) {
        setLoading(false);
        return;
      }

      // Get certificates
      const certificateResponse = await fetch(
        `${API_URL}/certificates/`
      );

      if (!certificateResponse.ok) {
        throw new Error("Unable to load certificates.");
      }

      const certificateData =
        await certificateResponse.json();

      const allCertificates = Array.isArray(
        certificateData
      )
        ? certificateData
        : certificateData.results || [];

      const studentCertificates =
        allCertificates.filter((certificate) => {
          const certificateStudent =
            typeof certificate.student === "object"
              ? certificate.student.id
              : certificate.student;

          return (
            Number(certificateStudent) ===
            Number(student.id)
          );
        });

      setCertificates(studentCertificates);

      // Get courses
      const courseResponse = await fetch(
        `${API_URL}/courses/`
      );

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();

        const allCourses = Array.isArray(courseData)
          ? courseData
          : courseData.results || [];

        setCourses(allCourses);
      }
    } catch (error) {
      console.error("Certificate error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     GET COURSE NAME
  ========================================== */

  const getCourseName = (certificate) => {
    if (!certificate.course) {
      return "Course";
    }

    // If API already returns course object
    if (typeof certificate.course === "object") {
      return (
        certificate.course.course_name ||
        certificate.course.name ||
        "Course"
      );
    }

    // If API returns course ID
    const courseId = Number(certificate.course);

    const foundCourse = courses.find(
      (course) =>
        Number(course.id) === courseId
    );

    // Example:
    // course ID 1 -> Basic tailoring
    if (foundCourse) {
      return (
        foundCourse.course_name ||
        foundCourse.name ||
        "Course"
      );
    }

    return "Course";
  };

  /* ==========================================
     DATE
  ========================================== */

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /* ==========================================
     DOWNLOAD PDF
  ========================================== */

  const downloadCertificate = async (
    certificate
  ) => {
    try {
      setDownloading(true);

      const element = document.getElementById(
        `certificate-${certificate.id}`
      );

      if (!element) {
        throw new Error(
          "Certificate element not found."
        );
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageWidth = pageWidth;
      const imageHeight =
        (canvas.height / canvas.width) *
        imageWidth;

      let finalHeight = imageHeight;

      if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
      }

      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        imageWidth,
        finalHeight
      );

      const courseName =
        getCourseName(certificate);

      const safeCourseName =
        courseName
          .replace(/[^a-zA-Z0-9]/g, "_")
          .replace(/_+/g, "_");

      const studentName =
        `${student?.first_name || ""}_${student?.last_name || ""}`
          .trim()
          .replace(/[^a-zA-Z0-9]/g, "_");

      pdf.save(
        `${studentName}_${safeCourseName}_Certificate.pdf`
      );
    } catch (error) {
      console.error(
        "Download certificate error:",
        error
      );

      alert(
        "Unable to download certificate."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="certificate-page">

      <div className="certificate-sidebar">
        <StudentSidebar />
      </div>

      <main className="certificate-main">

        <div className="certificate-header">
          <h1>My Certificates</h1>

          <p>
            Certificates earned after successfully
            completing your courses.
          </p>
        </div>

        {loading && (
          <div className="certificate-message">
            Loading certificates...
          </div>
        )}

        {!loading &&
          certificates.length === 0 && (
            <div className="certificate-empty">

              <div className="empty-trophy">
                🏆
              </div>

              <h2>No Certificates Yet</h2>

              <p>
                Complete your enrolled course to
                receive your certificate.
              </p>

            </div>
          )}

        {!loading &&
          certificates.length > 0 && (
            <div className="certificates-container">

              {certificates.map((certificate) => (

                <div
                  className="certificate-wrapper"
                  key={certificate.id}
                >

                  {/* CERTIFICATE */}
                  <div
                    className="certificate"
                    id={`certificate-${certificate.id}`}
                  >

                    <div className="corner corner-top-left"></div>
                    <div className="corner corner-top-right"></div>
                    <div className="corner corner-bottom-left"></div>
                    <div className="corner corner-bottom-right"></div>

                    <div className="top-decoration"></div>

                    {/* LOGO */}
                    <div className="certificate-logo">
                      <img
                        src="/images/logofbn.jpg"
                        alt="Fashion Boutique Learn"
                        crossOrigin="anonymous"
                      />
                    </div>

                    {/* BRAND */}
                    <div className="brand-name">
                      FASHION BOUTIQUE LEARN
                    </div>

                    <div className="brand-line">
                      LEARN&nbsp;&nbsp;•&nbsp;&nbsp;
                      PRACTICE&nbsp;&nbsp;•&nbsp;&nbsp;
                      SUCCEED
                    </div>

                    {/* TITLE */}
                    <div className="certificate-title">
                      CERTIFICATE
                    </div>

                    <div className="certificate-subtitle">
                      OF COURSE COMPLETION
                    </div>

                    <div className="gold-divider">
                      ✦ ───────── ❖ ───────── ✦
                    </div>

                    {/* STUDENT */}
                    <div className="certificate-text">
                      This is to certify that
                    </div>

                    <div className="student-name">
                      {student?.first_name || ""}{" "}
                      {student?.last_name || ""}
                    </div>

                    <div className="student-line"></div>

                    {/* COURSE */}
                    <div className="completion-text">
                      has successfully completed the
                    </div>

                    <div className="course-name">
                      {getCourseName(certificate)}
                    </div>

                    <div className="conducted-text">
                      conducted by Fashion Boutique Learn.
                      <br />
                      We wish you great success in your future.
                    </div>

                    {/* EXCELLENCE BADGE */}
                    <div className="excellence-badge">

                      <div className="excellence-circle">

                        <span>CERTIFIED</span>
                        <span>WITH</span>
                        <span>EXCELLENCE</span>

                        <div className="stars">
                          ★ ★ ★
                        </div>

                      </div>

                    </div>

                    {/* ONLY SIGNATURE */}
                    <div className="director-signature">

                      <div className="signature-name">
                        M.P.Khatavkar
                      </div>

                      <div className="signature-line"></div>

                      <span>
                        Course Director
                      </span>

                    </div>

                    {/* INFORMATION */}
                    <div className="certificate-info">

                      <div>
                        <span>
                          Date of Completion :
                        </span>

                        <strong>
                          {formatDate(
                            certificate.issue_date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Certificate ID :
                        </span>

                        <strong>
                          {certificate.certificate_number}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="certificate-actions">

                    <button
                      className="download-button"
                      onClick={() =>
                        downloadCertificate(
                          certificate
                        )
                      }
                      disabled={downloading}
                    >
                      {downloading
                        ? "Preparing PDF..."
                        : "⬇ Download Certificate"}
                    </button>

                    <button
                      className="print-button"
                      onClick={() =>
                        window.print()
                      }
                    >
                      🖨 Print Certificate
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>
    </div>
  );
}

export default Certificate;