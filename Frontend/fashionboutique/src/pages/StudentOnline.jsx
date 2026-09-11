import React from "react";
import StudentSidebar from "../components/StudentSidebar";
import "./StudentOnline.css";

const OnlineClasses = () => {
  const classes = [
    {
      id: 1,
      title: "Fashion Designing - Basic Concepts",
      course: "Fashion Designing",
      instructor: "Fashion Boutique Academy",
      date: "20 August 2026",
      time: "10:00 AM - 11:30 AM",
      mode: "Live Class",
      image: "/images/bg1.png",
    },
    {
      id: 2,
      title: "Boutique Management",
      course: "Boutique Management",
      instructor: "Fashion Boutique Academy",
      date: "21 August 2026",
      time: "11:00 AM - 12:30 PM",
      mode: "Live Class",
      image: "/images/course2.jpg",
    },
    {
      id: 3,
      title: "Embroidery Techniques",
      course: "Embroidery",
      instructor: "Fashion Boutique Academy",
      date: "22 August 2026",
      time: "2:00 PM - 3:30 PM",
      mode: "Live Class",
      image: "/images/course3.jpg",
    },
  ];

  return (
    <div className="online-classes-page">

      {/* COMMON SIDEBAR */}
      <StudentSidebar />

      {/* MAIN CONTENT */}
      <main className="online-classes-content">

        {/* PAGE HEADER */}
        <div className="online-classes-header">
          <div>
            <h1>Online Classes</h1>
            <p>
              Join your scheduled online classes and continue learning.
            </p>
          </div>
        </div>


        {/* SUMMARY CARDS */}
        <div className="online-class-stats">

          <div className="online-stat-card">
            <div className="online-stat-icon">📚</div>

            <div>
              <h2>03</h2>
              <p>Total Classes</p>
            </div>
          </div>


          <div className="online-stat-card">
            <div className="online-stat-icon">🎥</div>

            <div>
              <h2>03</h2>
              <p>Upcoming Classes</p>
            </div>
          </div>


          <div className="online-stat-card">
            <div className="online-stat-icon">▶</div>

            <div>
              <h2>00</h2>
              <p>Completed Classes</p>
            </div>
          </div>

        </div>


        {/* UPCOMING CLASSES */}
        <section className="online-classes-section">

          <div className="online-section-heading">
            <h2>Upcoming Online Classes</h2>

            <p>
              Your scheduled live classes are shown below.
            </p>
          </div>


          <div className="online-classes-grid">

            {classes.map((item) => (

              <div
                className="online-class-card"
                key={item.id}
              >

                {/* IMAGE */}
                <div className="online-class-image">

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <span className="live-badge">
                    {item.mode}
                  </span>

                </div>


                {/* DETAILS */}
                <div className="online-class-details">

                  <h3>
                    {item.title}
                  </h3>

                  <p className="online-course-name">
                    Course: {item.course}
                  </p>

                  <div className="online-class-info">

                    <p>
                      <strong>Instructor:</strong>
                      <br />
                      {item.instructor}
                    </p>

                    <p>
                      <strong>Date:</strong>
                      <br />
                      {item.date}
                    </p>

                    <p>
                      <strong>Time:</strong>
                      <br />
                      {item.time}
                    </p>

                  </div>


                  <button
                    className="join-class-btn"
                    onClick={() =>
                      alert(`Joining ${item.title}`)
                    }
                  >
                    Join Class
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ONLINE CLASS INFORMATION */}
        <section className="online-class-notice">

          <div className="notice-icon">
            💡
          </div>

          <div>
            <h3>Online Class Information</h3>

            <p>
              Please join the class a few minutes before the scheduled
              time. Make sure you have a stable internet connection,
              working microphone, and camera when required.
            </p>
          </div>

        </section>

      </main>

    </div>
  );
};

export default OnlineClasses;