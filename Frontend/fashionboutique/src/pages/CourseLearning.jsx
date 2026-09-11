import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";

import "./CourseLearning.css";

const API_URL = "http://127.0.0.1:8000/api";

function CourseLearning() {
  const { enrollmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(
    location.state?.enrollment || null
  );

  const [videos, setVideos] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState(false);

  // =========================================================
  // LOAD COURSE DATA
  // =========================================================

  useEffect(() => {
    if (enrollmentId) {
      loadLearningData();
    }
  }, [enrollmentId]);

  // =========================================================
  // SAFE JSON RESPONSE
  // =========================================================

  const getJsonResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (
      !contentType ||
      !contentType.includes("application/json")
    ) {
      const text = await response.text();

      console.error("Server response:", text);

      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }

    return await response.json();
  };

  // =========================================================
  // LOAD ENROLLMENT + VIDEOS + MATERIALS
  // =========================================================

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError("");

      let currentEnrollment = enrollment;

      // -----------------------------------------------------
      // GET ENROLLMENT
      // -----------------------------------------------------

      if (!currentEnrollment) {
        const enrollmentResponse = await fetch(
          `${API_URL}/enrollments/${enrollmentId}/`
        );

        if (!enrollmentResponse.ok) {
          throw new Error("Enrollment not found.");
        }

        currentEnrollment =
          await getJsonResponse(
            enrollmentResponse
          );

        setEnrollment(currentEnrollment);
      }

      // -----------------------------------------------------
      // CHECK ENROLLMENT STATUS
      // -----------------------------------------------------

      const status =
        currentEnrollment?.status?.toLowerCase();

      if (
        status !== "enrolled" &&
        status !== "completed"
      ) {
        setError(
          "You do not have access to this course. Please complete the payment first."
        );

        setVideos([]);
        setMaterials([]);

        return;
      }

      // -----------------------------------------------------
      // GET COURSE ID
      // -----------------------------------------------------

      const courseId =
        typeof currentEnrollment.course === "object" &&
        currentEnrollment.course !== null
          ? currentEnrollment.course.id
          : currentEnrollment.course;

      if (!courseId) {
        throw new Error(
          "Course information not found."
        );
      }

      console.log(
        "Enrollment ID:",
        enrollmentId
      );

      console.log(
        "Course ID:",
        courseId
      );

      // =====================================================
      // GET COURSE VIDEOS
      // =====================================================

      const videosResponse = await fetch(
        `${API_URL}/course-videos/?course=${courseId}`
      );

      if (!videosResponse.ok) {
        throw new Error(
          `Unable to load course videos (${videosResponse.status}).`
        );
      }

      const videosData =
        await getJsonResponse(
          videosResponse
        );

      // DRF pagination
      const allVideos = Array.isArray(videosData)
        ? videosData
        : videosData.results || [];

      // -----------------------------------------------------
      // FILTER COURSE VIDEOS
      // -----------------------------------------------------

      const courseVideos =
        allVideos.filter((video) => {
          const videoCourseId =
            typeof video.course === "object" &&
            video.course !== null
              ? video.course.id
              : video.course;

          return (
            Number(videoCourseId) ===
            Number(courseId)
          );
        });

      // -----------------------------------------------------
      // SORT VIDEOS
      // -----------------------------------------------------

      courseVideos.sort(
        (a, b) =>
          Number(a.video_order || 0) -
          Number(b.video_order || 0)
      );

      console.log(
        "Course videos:",
        courseVideos
      );

      setVideos(courseVideos);

      // =====================================================
      // GET STUDY MATERIALS
      // =====================================================

      const materialsResponse = await fetch(
        `${API_URL}/study-materials/?course=${courseId}`
      );

      if (!materialsResponse.ok) {
        throw new Error(
          `Unable to load study materials (${materialsResponse.status}).`
        );
      }

      const materialsData =
        await getJsonResponse(
          materialsResponse
        );

      // DRF pagination
      const allMaterials =
        Array.isArray(materialsData)
          ? materialsData
          : materialsData.results || [];

      // -----------------------------------------------------
      // FILTER COURSE MATERIALS
      // -----------------------------------------------------

      const courseMaterials =
        allMaterials.filter((material) => {
          const materialCourseId =
            typeof material.course === "object" &&
            material.course !== null
              ? material.course.id
              : material.course;

          return (
            Number(materialCourseId) ===
            Number(courseId)
          );
        });

      console.log(
        "Course materials:",
        courseMaterials
      );

      setMaterials(courseMaterials);

    } catch (error) {
      console.error(
        "Course Learning Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load course content."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // YOUTUBE URL CONVERTER
  // =========================================================

  const getYouTubeEmbed = (url) => {
    if (!url) {
      return "";
    }

    const cleanUrl = url.trim();

    console.log(
      "Original YouTube URL:",
      cleanUrl
    );

    try {
      // -----------------------------------------------------
      // Already an embed URL
      // -----------------------------------------------------

      if (
        cleanUrl.includes(
          "youtube.com/embed/"
        )
      ) {
        return cleanUrl;
      }

      // -----------------------------------------------------
      // youtube.com/watch?v=VIDEO_ID
      // -----------------------------------------------------

      if (
        cleanUrl.includes(
          "youtube.com/watch"
        )
      ) {
        const parsedUrl =
          new URL(cleanUrl);

        const videoId =
          parsedUrl.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // -----------------------------------------------------
      // youtu.be/VIDEO_ID
      // -----------------------------------------------------

      if (
        cleanUrl.includes("youtu.be/")
      ) {
        const videoId =
          cleanUrl
            .split("youtu.be/")[1]
            .split("?")[0]
            .split("&")[0]
            .split("/")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // -----------------------------------------------------
      // youtube.com/shorts/VIDEO_ID
      // -----------------------------------------------------

      if (
        cleanUrl.includes(
          "youtube.com/shorts/"
        )
      ) {
        const videoId =
          cleanUrl
            .split("youtube.com/shorts/")[1]
            .split("?")[0]
            .split("&")[0]
            .split("/")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

    } catch (error) {
      console.error(
        "Invalid YouTube URL:",
        error
      );
    }

    return "";
  };

  // =========================================================
  // COMPLETE COURSE
  // =========================================================

  const handleCompleteCourse = async () => {
    try {
      const response = await fetch(
        `${API_URL}/enrollments/${enrollmentId}/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: "Completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to complete course."
        );
      }

      setCompleted(true);

      alert(
        "Course completed successfully!"
      );

      navigate("/certificate");

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Unable to complete course."
      );
    }
  };

  // =========================================================
  // COURSE NAME
  // =========================================================

  const getCourseName = () => {
    if (!enrollment) {
      return "My Course";
    }

    if (
      typeof enrollment.course === "object" &&
      enrollment.course !== null
    ) {
      return (
        enrollment.course.course_name ||
        enrollment.course.name ||
        "My Course"
      );
    }

    if (enrollment.course_name) {
      return enrollment.course_name;
    }

    return "My Course";
  };

  // =========================================================
  // LOADING PAGE
  // =========================================================

  if (loading) {
    return (
      <div className="course-learning-page">

        <StudentSidebar />

        <main className="course-learning-main">

          <div className="learning-message">
            Loading course...
          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // ERROR PAGE
  // =========================================================

  if (error) {
    return (
      <div className="course-learning-page">

        <StudentSidebar />

        <main className="course-learning-main">

          <div className="course-error">

            <h2>
              Access Denied
            </h2>

            <p>
              {error}
            </p>

            <button
              className="retry-button"
              onClick={() =>
                navigate("/my-courses")
              }
            >
              ← Back to My Courses
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="course-learning-page">

      <StudentSidebar />

      <main className="course-learning-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="learning-header">

          <button
            className="back-course-button"
            onClick={() =>
              navigate("/my-courses")
            }
          >
            ← Back to My Courses
          </button>

          <h1>
            {getCourseName()}
          </h1>

          <p>
            Continue your learning journey.
          </p>

        </div>


        {/* =================================================
            COURSE VIDEOS
        ================================================= */}

        <section className="learning-section">

          <h2>
            Course Videos
          </h2>

          {videos.length === 0 ? (

            <div className="learning-empty">
              No videos available yet.
            </div>

          ) : (

            <div className="video-grid">

              {videos.map(
                (video, index) => {

                  const embedUrl =
                    getYouTubeEmbed(
                      video.youtube_url
                    );

                  return (
                    <div
                      className="video-card"
                      key={video.id}
                    >

                      {/* VIDEO */}
                      <div className="video-container">

                        {embedUrl ? (

                          <iframe
                            src={embedUrl}
                            title={
                              video.title ||
                              `Course Video ${
                                index + 1
                              }`
                            }
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />

                        ) : (

                          <div className="video-error">

                            <p>
                              Invalid YouTube URL
                            </p>

                            <small>
                              Please contact the
                              administrator.
                            </small>

                          </div>

                        )}

                      </div>


                      {/* VIDEO INFORMATION */}
                      <div className="video-content">

                        <span className="video-number">
                          Video {index + 1}
                        </span>

                        <h3>
                          {video.title}
                        </h3>

                        {video.description && (
                          <p>
                            {video.description}
                          </p>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =================================================
    STUDY MATERIALS
================================================= */}

<section className="learning-section">

  <h2>
    Study Materials
  </h2>

  {materials.length === 0 ? (

    <div className="learning-empty">
      No study materials available yet.
    </div>

  ) : (

    <div className="material-list">

      {materials.map((material) => {

        // -----------------------------------------
        // CREATE FULL DJANGO FILE URL
        // -----------------------------------------

        const materialUrl = material.file
          ? material.file.startsWith("http")
            ? material.file
            : `http://127.0.0.1:8000${material.file}`
          : "";

        return (
          <div
            className="material-card"
            key={material.id}
          >

            <div className="material-info">

              <h3>
                {material.title}
              </h3>

            </div>

            {materialUrl ? (

              <a
                href={materialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="material-btn"
              >
                View Material
              </a>

            ) : (

              <span className="no-material">
                File not available
              </span>

            )}

          </div>
        );

      })}

    </div>

  )}

</section>

        {/* =================================================
            COMPLETE COURSE
        ================================================= */}

        <div className="complete-course-box">

          <h2>
            Finished the Course?
          </h2>

          <p>
            After completing all your classes,
            mark the course as completed.
          </p>

          <button
            onClick={
              handleCompleteCourse
            }
            disabled={completed}
          >
            {completed
              ? "Course Completed"
              : "Complete Course"}
          </button>

        </div>

      </main>

    </div>
  );
}

export default CourseLearning;