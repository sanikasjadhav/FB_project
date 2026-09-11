import React from "react";
import { Link } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import "./OfflineBatch.css";

function OfflineBatch() {

  const batches = [
    {
      id: 1,
      batchName: "Fashion Designing - Morning Batch",
      course: "Fashion Designing",
      instructor: "Fashion Boutique Academy",
      duration: "3 Months",
      startDate: "01 August 2026",
      endDate: "31 October 2026",
      time: "10:00 AM - 12:00 PM",
      days: "Monday - Friday",
      room: "Room No. 101",
      status: "Active",
      image: "/images/course1.jpg"
    },

    {
      id: 2,
      batchName: "Boutique Management - Afternoon Batch",
      course: "Boutique Management",
      instructor: "Fashion Boutique Academy",
      duration: "2 Months",
      startDate: "05 August 2026",
      endDate: "05 October 2026",
      time: "2:00 PM - 4:00 PM",
      days: "Monday - Friday",
      room: "Room No. 102",
      status: "Active",
      image: "/images/course2.jpg"
    },

    {
      id: 3,
      batchName: "Embroidery - Weekend Batch",
      course: "Embroidery",
      instructor: "Fashion Boutique Academy",
      duration: "45 Days",
      startDate: "10 August 2026",
      endDate: "25 September 2026",
      time: "10:00 AM - 1:00 PM",
      days: "Saturday - Sunday",
      room: "Room No. 103",
      status: "Active",
      image: "/images/course3.jpg"
    }
  ];


  return (
    <div className="offline-batch-page">

      {/* =====================================
          COMMON STUDENT SIDEBAR
      ===================================== */}

      <StudentSidebar />


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="offline-batch-content">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="offline-batch-header">

          <div>
            <h1>Offline Batch</h1>

            <p>
              View your classroom batch and schedule details.
            </p>
          </div>


          <Link
            to="/student-dashboard"
            className="offline-dashboard-btn"
          >
            ← Dashboard
          </Link>

        </div>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="offline-batch-stats">

          <div className="offline-stat-card">

            <h2>03</h2>

            <p>Total Batches</p>

          </div>


          <div className="offline-stat-card">

            <h2>03</h2>

            <p>Active Batches</p>

          </div>


          <div className="offline-stat-card">

            <h2>00</h2>

            <p>Completed Batches</p>

          </div>


          <div className="offline-stat-card">

            <h2>100%</h2>

            <p>Attendance</p>

          </div>

        </div>


        {/* =====================================
            BATCH SECTION
        ===================================== */}

        <section className="offline-batch-section">

          <div className="offline-section-heading">

            <h2>
              My Offline Batches
            </h2>

            <p>
              Attend your scheduled classroom sessions.
            </p>

          </div>


          {/* =====================================
              BATCH GRID
          ===================================== */}

          <div className="offline-batch-grid">

            {batches.map((batch) => (

              <div
                className="offline-batch-card"
                key={batch.id}
              >


                {/* IMAGE */}

                <div className="offline-batch-image">

                  <img
                    src={batch.image}
                    alt={batch.course}
                  />

                  <span className="offline-active-badge">
                    {batch.status}
                  </span>

                </div>


                {/* DETAILS */}

                <div className="offline-batch-details">

                  <h3>
                    {batch.batchName}
                  </h3>


                  <p className="offline-course">
                    Course: {batch.course}
                  </p>


                  <div className="offline-detail-list">

                    <div className="offline-detail-item">
                      <span>👩‍🏫</span>

                      <div>
                        <strong>Instructor</strong>
                        <p>{batch.instructor}</p>
                      </div>
                    </div>


                    <div className="offline-detail-item">
                      <span>📅</span>

                      <div>
                        <strong>Batch Dates</strong>
                        <p>
                          {batch.startDate} - {batch.endDate}
                        </p>
                      </div>
                    </div>


                    <div className="offline-detail-item">
                      <span>⏰</span>

                      <div>
                        <strong>Class Time</strong>
                        <p>{batch.time}</p>
                      </div>
                    </div>


                    <div className="offline-detail-item">
                      <span>📆</span>

                      <div>
                        <strong>Class Days</strong>
                        <p>{batch.days}</p>
                      </div>
                    </div>


                    <div className="offline-detail-item">
                      <span>🏫</span>

                      <div>
                        <strong>Classroom</strong>
                        <p>{batch.room}</p>
                      </div>
                    </div>


                    <div className="offline-detail-item">
                      <span>⏱</span>

                      <div>
                        <strong>Duration</strong>
                        <p>{batch.duration}</p>
                      </div>
                    </div>

                  </div>


                  {/* BUTTON */}

                  <button className="attendance-btn">
                    View Attendance
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =====================================
            CLASSROOM NOTICE
        ===================================== */}

        <div className="offline-batch-notice">

          <div className="offline-notice-icon">
            💡
          </div>

          <div>

            <h3>
              Offline Class Information
            </h3>

            <p>
              Please arrive at the academy at least 10 minutes
              before your scheduled class. Bring your required
              materials and maintain regular attendance.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default OfflineBatch;