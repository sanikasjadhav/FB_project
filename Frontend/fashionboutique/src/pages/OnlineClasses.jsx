import React from "react";
import { Link } from "react-router-dom";
import "./OnlineClasses.css";

function OnlineClasses() {

  const classes = [
    {
      title: "Introduction to Fashion Designing",
      instructor: "Fashion Boutique Academy",
      duration: "25 Minutes",
      progress: 100,
      image: "/images/course1.jpg",
      status: "Completed"
    },
    {
      title: "Basic Sewing Techniques",
      instructor: "Fashion Boutique Academy",
      duration: "35 Minutes",
      progress: 70,
      image: "/images/bg1.png",
      status: "Continue"
    },
    {
      title: "Fabric Selection & Knowledge",
      instructor: "Fashion Boutique Academy",
      duration: "30 Minutes",
      progress: 45,
      image: "/images/course2.jpg",
      status: "Continue"
    },
    {
      title: "Pattern Making",
      instructor: "Fashion Boutique Academy",
      duration: "40 Minutes",
      progress: 20,
      image: "/images/course3.jpg",
      status: "Continue"
    },
    {
      title: "Dress Designing",
      instructor: "Fashion Boutique Academy",
      duration: "45 Minutes",
      progress: 0,
      image: "/images/bg1.png",
      status: "Start Class"
    },
    {
      title: "Embroidery Basics",
      instructor: "Fashion Boutique Academy",
      duration: "30 Minutes",
      progress: 0,
      image: "/images/course1.jpg",
      status: "Start Class"
    }
  ];

  return (
    <div className="online-page">

      {/* HEADER */}

      <div className="online-header">

        <div>
          <h1>Online Classes</h1>

          <p>
            Learn fashion designing from anywhere, anytime.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Dashboard
        </Link>

      </div>


      {/* STATISTICS */}

      <div className="online-stats">

        <div className="online-stat">
          <h2>06</h2>
          <p>Total Classes</p>
        </div>

        <div className="online-stat">
          <h2>02</h2>
          <p>Completed</p>
        </div>

        <div className="online-stat">
          <h2>04</h2>
          <p>Remaining</p>
        </div>

        <div className="online-stat">
          <h2>58%</h2>
          <p>Overall Progress</p>
        </div>

      </div>


      {/* CLASSES */}

      <div className="classes-section">

        <div className="section-title">

          <div>
            <h2>My Online Classes</h2>

            <p>
              Continue your learning journey
            </p>
          </div>

        </div>


        <div className="classes-grid">

          {classes.map((item, index) => (

            <div
              className="class-card"
              key={index}
            >

              {/* IMAGE */}

              <div className="class-image">

                <img
                  src={item.image}
                  alt={item.title}
                />

                <span
                  className={
                    item.progress === 100
                      ? "class-status completed-status"
                      : "class-status"
                  }
                >
                  {item.status}
                </span>

              </div>


              {/* CONTENT */}

              <div className="class-content">

                <h3>
                  {item.title}
                </h3>

                <p className="instructor">
                  👩‍🏫 {item.instructor}
                </p>

                <p className="duration">
                  ⏱ {item.duration}
                </p>


                {/* PROGRESS */}

                <div className="class-progress-title">

                  <span>
                    Progress
                  </span>

                  <strong>
                    {item.progress}%
                  </strong>

                </div>

                <progress
                  value={item.progress}
                  max="100"
                ></progress>


                {/* BUTTON */}

                {item.progress === 100 ? (

                  <button className="watch-btn">
                    ✓ Completed
                  </button>

                ) : (

                  <button className="watch-btn">
                    ▶ Watch Class
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default OnlineClasses;