import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

const API_URL = "http://127.0.0.1:8000/api";

function Home() {

  // =====================================================
  // STATES
  // =====================================================

  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  const [gallery, setGallery] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);


  // =====================================================
  // LOAD HOME DATA
  // =====================================================

  useEffect(() => {

    fetchHomeData();

  }, []);


  const fetchHomeData = async () => {
  try {
    setLoadingStats(true);
    setGalleryLoading(true);

    const [studentsResponse, coursesResponse, galleryResponse] =
      await Promise.allSettled([
        fetch(`${API_URL}/students/`),
        fetch(`${API_URL}/courses/`),
        fetch(`${API_URL}/gallery/`)
      ]);

    // =========================
    // STUDENTS
    // =========================
    if (studentsResponse.status === "fulfilled") {
      const response = studentsResponse.value;

      if (response.ok) {
        const data = await response.json();

        console.log("Home Students:", data);

        if (Array.isArray(data)) {
          setStudentCount(data.length);
        } else if (Array.isArray(data.results)) {
          setStudentCount(
            typeof data.count === "number"
              ? data.count
              : data.results.length
          );
        }
      }
    }

    // =========================
    // COURSES
    // =========================
    if (coursesResponse.status === "fulfilled") {
      const response = coursesResponse.value;

      if (response.ok) {
        const data = await response.json();

        console.log("Home Courses:", data);

        if (Array.isArray(data)) {
          setCourseCount(data.length);
        } else if (Array.isArray(data.results)) {
          setCourseCount(
            typeof data.count === "number"
              ? data.count
              : data.results.length
          );
        }
      }
    }

    // =========================
    // GALLERY
    // =========================
    if (galleryResponse.status === "fulfilled") {
      const response = galleryResponse.value;

      if (response.ok) {
        const data = await response.json();

        console.log("Home Gallery:", data);

        if (Array.isArray(data)) {
          setGallery(data);
        } else if (Array.isArray(data.results)) {
          setGallery(data.results);
        }
      }
    }
  } catch (error) {
    console.error("Home data error:", error);
  } finally {
    setLoadingStats(false);
    setGalleryLoading(false);
  }
};

  // =====================================================
  // GALLERY IMAGE URL
  // =====================================================

  const getImageUrl = (item) => {

    const image =
      item.image_url ||
      item.image;

    if (!image) {
      return "";
    }


    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {

      return image;

    }


    return `http://127.0.0.1:8000${
      image.startsWith("/")
        ? ""
        : "/"
    }${image}`;

  };


  // =====================================================
  // DISPLAY NUMBER
  // =====================================================

  const displayStudentCount =
    loadingStats
      ? "..."
      : `${studentCount}+`;


  const displayCourseCount =
    loadingStats
      ? "..."
      : `${courseCount}+`;


  return (

    <div className="home">


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">


        <div className="hero-left">


          <div className="badge">
            🏆 Trusted Fashion Learning Platform
          </div>


          <h1>
            Build Skills That
            <span>Transform Your</span>
            Future
          </h1>


          <p>

            Learn Fashion Boutique, Stitching,
            Embroidery, Boutique Management and
            Creative Skills with practical training.

          </p>


          {/* =================================================
              DYNAMIC STATISTICS
          ================================================= */}

          <div className="stats">


            <div>

              <h2>
                {displayStudentCount}
              </h2>

              <p>
                Students
              </p>

            </div>


            <div>

              <h2>
                {displayCourseCount}
              </h2>

              <p>
                Courses
              </p>

            </div>


          </div>


          <Link
            to="/courses"
            className="main-btn"
          >
            Explore Courses →
          </Link>


        </div>


        {/* =================================================
            VIDEO
        ================================================= */}

        <div className="hero-video">

          <video
            autoPlay
            muted
            loop
            playsInline
          >

            <source
              src="/images/fbv.mp4"
              type="video/mp4"
            />

            Your browser does not support
            the video tag.

          </video>

          <div className="video-overlay"></div>

        </div>


      </section>


      {/* =================================================
          COURSES
      ================================================= */}

      <section className="courses">


        <h2>
          Popular Courses
        </h2>


        <div className="course-grid">


          <div className="course-card">

            <img
              src="/images/bg1.png"
              alt="Fashion Boutique"
            />

            <h3>
              Fashion Boutique
            </h3>

            <p>
              Learn creative design of boutique,
              styling and fashion illustration.
            </p>

          </div>


          <div className="course-card">

            <img
              src="/images/tailor.avif"
              alt="Tailoring Course"
            />

            <h3>
              Tailoring Course
            </h3>

            <p>
              Master stitching and garment making skills.
            </p>

          </div>


          <div className="course-card">

            <img
              src="/images/emd2.jpg"
              alt="Embroidery"
            />

            <h3>
              Embroidery
            </h3>

            <p>
              Create beautiful handmade fashion designs.
            </p>

          </div>


        </div>


      </section>


      {/* =================================================
          WHY CHOOSE US
      ================================================= */}

      <section className="why">


        <h2>
          Why Choose Fashion Boutique?
        </h2>


        <div className="why-grid">


          <div>

            <h3>
              👩‍🏫 Expert Trainer
            </h3>

            <p>
              Learn from experienced designers.
            </p>

          </div>


          <div>

            <h3>
              💻 Online Learning
            </h3>

            <p>
              Study anytime anywhere.
            </p>

          </div>


          <div>

            <h3>
              🏆 Certificate
            </h3>

            <p>
              Get course completion certificate.
            </p>

          </div>


          <div>

            <h3>
              ✂ Practical Training
            </h3>

            <p>
              Real fashion projects and practice.
            </p>

          </div>


        </div>


      </section>


      {/* =================================================
          STUDENT WORK
      ================================================= */}

      <section className="student-work-new">


        <h2 className="student-work-title">
          Student Work
        </h2>


        {galleryLoading ? (

          <div className="gallery-loading">
            Loading student work...
          </div>

        ) : gallery.length === 0 ? (

          <div className="gallery-empty-home">
            No student work available yet.
          </div>

        ) : (

          <div className="student-work-window">


            <div className="student-work-moving">


              {/* FIRST SET */}

              {gallery.map((item) => (

                <div
                  className="work-card-new"
                  key={item.id}
                >

                  <img
                    src={getImageUrl(item)}
                    alt={
                      item.title ||
                      "Student Work"
                    }
                  />

                </div>

              ))}


              {/* SECOND SET
                  For continuous animation */}

              {gallery.map((item) => (

                <div
                  className="work-card-new"
                  key={`duplicate-${item.id}`}
                >

                  <img
                    src={getImageUrl(item)}
                    alt={
                      item.title ||
                      "Student Work"
                    }
                  />

                </div>

              ))}


            </div>

          </div>

        )}


      </section>


      {/* =================================================
          CTA
      ================================================= */}

      <section className="cta">


        <h2>
          Start Your Fashion Journey Today
        </h2>


        <p>
          Join our professional fashion courses.
        </p>


        <Link to="/courses">
          Join Now
        </Link>


      </section>


    </div>

  );

}


export default Home;