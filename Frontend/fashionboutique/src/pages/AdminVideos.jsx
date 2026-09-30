import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import "./AdminVideos.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminVideos = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    youtube_url: "",
    description: "",
    video_order: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    course: "",
    video_order: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, []);


  // =====================================================
  // FETCH VIDEOS
  // =====================================================

  const fetchVideos = async () => {

    try {

      const response = await fetch(
        `${API_URL}/course-videos/`
      );

      const data = await response.json();

      console.log(
        "Course Videos API:",
        data
      );

      if (!response.ok) {

        setError(
          "Unable to load videos."
        );

        return;

      }

      if (Array.isArray(data)) {

        setVideos(data);

      } else if (data.results) {

        setVideos(data.results);

      } else {

        setVideos([]);

      }

    } catch (err) {

      console.error(
        "Fetch videos error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );

    }

  };


  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {

    try {

      const response = await fetch(
        `${API_URL}/courses/`
      );

      const data = await response.json();

      console.log(
        "Courses API:",
        data
      );

      if (!response.ok) {

        setError(
          "Unable to load courses."
        );

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

      console.error(
        "Fetch courses error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );

    }

  };


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================================
  // HANDLE SEARCH FILTER
  // =====================================================

  const handleFilterChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFilters({
      ...filters,
      [name]: value,
    });

  };


  // =====================================================
  // OPEN ADD VIDEO FORM
  // =====================================================

  const openAddForm = () => {

    setShowSearchForm(false);

    setEditingId(null);

    setFormData({
      course: "",
      title: "",
      youtube_url: "",
      description: "",
      video_order: 1,
    });

    setMessage("");
    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =====================================================
  // CLOSE VIDEO FORM
  // =====================================================

  const closeForm = () => {

    setShowForm(false);

    setEditingId(null);

    setFormData({
      course: "",
      title: "",
      youtube_url: "",
      description: "",
      video_order: 1,
    });

    setMessage("");
    setError("");

  };


  // =====================================================
  // OPEN SEARCH FORM
  // =====================================================

  const openSearchForm = () => {

    setShowForm(false);

    setEditingId(null);

    setFormData({
      course: "",
      title: "",
      youtube_url: "",
      description: "",
      video_order: 1,
    });

    setMessage("");
    setError("");

    setShowSearchForm(
      (previous) => !previous
    );

  };


  // =====================================================
  // RESET SEARCH
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      course: "",
      video_order: "",
    });

  };


  // =====================================================
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (video) => {

    if (video.course_name) {

      return video.course_name;

    }

    if (
      video.course &&
      typeof video.course === "object"
    ) {

      return (
        video.course.course_name ||
        video.course.name ||
        "-"
      );

    }

    const course =
      courses.find(
        (item) =>
          Number(item.id) ===
          Number(
            typeof video.course === "object"
              ? video.course?.id
              : video.course
          )
      );

    return (
      course?.course_name ||
      "-"
    );

  };


  // =====================================================
  // GET COURSE ID
  // =====================================================

  const getCourseId = (video) => {

    if (
      video.course &&
      typeof video.course === "object"
    ) {

      return video.course.id;

    }

    return video.course;

  };


  // =====================================================
  // FILTER VIDEOS
  // =====================================================

  const filteredVideos = videos.filter(
    (video) => {

      const searchText =
        filters.search
          .trim()
          .toLowerCase();


      const courseName =
        getCourseName(video)
          .toLowerCase();


      const title =
        String(
          video.title || ""
        ).toLowerCase();


      const youtubeUrl =
        String(
          video.youtube_url || ""
        ).toLowerCase();


      const description =
        String(
          video.description || ""
        ).toLowerCase();


      const videoOrder =
        String(
          video.video_order || ""
        );


      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      const matchesSearch =
        !searchText ||
        courseName.includes(
          searchText
        ) ||
        title.includes(
          searchText
        ) ||
        youtubeUrl.includes(
          searchText
        ) ||
        description.includes(
          searchText
        );


      // -------------------------------------------------
      // COURSE
      // -------------------------------------------------

      const matchesCourse =
        !filters.course ||
        String(
          getCourseId(video)
        ) ===
          String(
            filters.course
          );


      // -------------------------------------------------
      // VIDEO ORDER
      // -------------------------------------------------

      const matchesOrder =
        !filters.video_order ||
        videoOrder ===
          String(
            filters.video_order
          );


      return (
        matchesSearch &&
        matchesCourse &&
        matchesOrder
      );

    }
  );


  // =====================================================
  // DOWNLOAD CSV
  // =====================================================

  const escapeCSV = (value) => {

    return `"${String(
      value ?? ""
    ).replace(/"/g, '""')}"`;

  };


  const downloadVideoReport = () => {

    if (
      filteredVideos.length === 0
    ) {

      alert(
        "No videos available to download."
      );

      return;

    }


    const headers = [
      "Video ID",
      "Course",
      "Video Title",
      "YouTube URL",
      "Video Order",
      "Description",
    ];


    const rows =
      filteredVideos.map(
        (video) => [

          video.id || "",

          getCourseName(video),

          video.title || "",

          video.youtube_url || "",

          video.video_order || "",

          video.description || "",

        ]
      );


    const csv = [

      headers
        .map(escapeCSV)
        .join(","),

      ...rows.map(
        (row) =>
          row
            .map(escapeCSV)
            .join(",")
      ),

    ].join("\n");


    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "filtered_course_videos_report.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  // =====================================================
  // EDIT VIDEO
  // =====================================================

  const editVideo = (video) => {

    setShowSearchForm(false);

    setShowForm(true);

    setEditingId(video.id);

    setFormData({
      course:
        typeof video.course === "object"
          ? video.course?.id || ""
          : video.course || "",

      title:
        video.title || "",

      youtube_url:
        video.youtube_url || "",

      description:
        video.description || "",

      video_order:
        video.video_order || 1,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setEditingId(null);

    setShowForm(false);

    setFormData({
      course: "",
      title: "",
      youtube_url: "",
      description: "",
      video_order: 1,
    });

    setMessage("");
    setError("");

  };


  // =====================================================
  // ADD / UPDATE VIDEO
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (
      !formData.course ||
      !formData.title ||
      !formData.youtube_url ||
      !formData.video_order
    ) {

      setError(
        "Please fill all required fields."
      );

      return;

    }


    setLoading(true);


    try {

      const url = editingId
        ? `${API_URL}/course-videos/${editingId}/`
        : `${API_URL}/course-videos/`;


      const method = editingId
        ? "PUT"
        : "POST";


      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              course:
                Number(
                  formData.course
                ),

              title:
                formData.title,

              youtube_url:
                formData.youtube_url,

              description:
                formData.description,

              video_order:
                Number(
                  formData.video_order
                ),

            }),

          }
        );


      const data =
        await response.json();


      console.log(
        "Video response:",
        data
      );


      if (!response.ok) {

        console.error(
          "Backend video error:",
          data
        );

        setError(
          JSON.stringify(data)
        );

        setLoading(false);

        return;

      }


      if (editingId) {

        setMessage(
          "Video updated successfully."
        );

      } else {

        setMessage(
          "Video added successfully."
        );

      }


      setFormData({
        course: "",
        title: "",
        youtube_url: "",
        description: "",
        video_order: 1,
      });


      setEditingId(null);

      setShowForm(false);


      await fetchVideos();

    } catch (err) {

      console.error(
        "Save video error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );

    }


    setLoading(false);

  };


  // =====================================================
  // DELETE VIDEO
  // =====================================================

  const deleteVideo = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this video?"
      );


    if (!confirmDelete) {

      return;

    }


    setMessage("");
    setError("");


    try {

      const response =
        await fetch(
          `${API_URL}/course-videos/${id}/`,
          {
            method: "DELETE",
          }
        );


      if (!response.ok) {

        setError(
          "Unable to delete video."
        );

        return;

      }


      setMessage(
        "Video deleted successfully."
      );


      if (
        editingId === id
      ) {

        cancelEdit();

      }


      await fetchVideos();

    } catch (err) {

      console.error(
        "Delete video error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );

    }

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-videos-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN BODY
      ================================================= */}

      <div className="admin-videos-body">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="videos-header">


          <div>

            <h1>
              Course Videos
            </h1>

            <p>
              Manage videos for your courses
            </p>

          </div>


          <div className="videos-header-buttons">


            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="search-video-btn"
              onClick={openSearchForm}
            >

              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Videos"}

            </button>


            {/* ADD VIDEO BUTTON */}

            <button
              type="button"
              className="add-video-header-btn"
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
            >

              {showForm
                ? "✕ Close Form"
                : "+ Add Video"}

            </button>


            {/* COUNT */}

            <div className="video-count">

              Total Videos:{" "}

              {videos.length}

            </div>

          </div>

        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        {message && (

          <div className="video-alert success">

            {message}

          </div>

        )}


        {error && (

          <div className="video-alert error">

            {error}

          </div>

        )}


        {/* =================================================
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (

          <div className="video-search-card">


            <div className="video-search-title">

              <h2>
                Search Course Videos
              </h2>

              <p>
                Filter videos by course, title, URL or video order
              </p>

            </div>


            <div className="video-search-form">


              {/* SEARCH */}

              <div className="video-search-field">

                <label>
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search course, video title, URL or description..."
                />

              </div>


              {/* COURSE */}

              <div className="video-search-field">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                >

                  <option value="">
                    All Courses
                  </option>


                  {courses.map(
                    (course) => (

                      <option
                        key={course.id}
                        value={course.id}
                      >

                        {course.course_name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* VIDEO ORDER */}

              <div className="video-search-field">

                <label>
                  Video Order
                </label>

                <input
                  type="number"
                  name="video_order"
                  value={filters.video_order}
                  onChange={handleFilterChange}
                  min="1"
                  placeholder="Order"
                />

              </div>


              {/* ACTIONS */}

              <div className="video-search-actions">

                <button
                  type="button"
                  className="reset-video-search-btn"
                  onClick={resetFilters}
                >

                  Reset

                </button>


                <button
                  type="button"
                  className="download-video-btn"
                  onClick={downloadVideoReport}
                  disabled={
                    filteredVideos.length === 0
                  }
                >

                  ↓ Download Report

                </button>

              </div>

            </div>


            {/* FILTER COUNT */}

            <div className="video-filter-result">

              Showing{" "}

              <strong>
                {filteredVideos.length}
              </strong>{" "}

              of{" "}

              <strong>
                {videos.length}
              </strong>{" "}

              videos

            </div>

          </div>

        )}


        {/* =================================================
            ADD / EDIT VIDEO FORM
        ================================================= */}

        {showForm && (

          <div className="video-card">


            <div className="video-card-title">

              <h2>

                {editingId
                  ? "Edit Course Video"
                  : "Add Course Video"}

              </h2>


              <p>

                {editingId
                  ? "Update course video details"
                  : "Add an online video for a course"}

              </p>

            </div>


            <form
              className="video-form"
              onSubmit={handleSubmit}
            >


              {/* COURSE */}

              <div className="video-input">

                <label>

                  Course <span>*</span>

                </label>


                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Course
                  </option>


                  {courses.map(
                    (course) => (

                      <option
                        key={course.id}
                        value={course.id}
                      >

                        {course.course_name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* TITLE */}

              <div className="video-input">

                <label>

                  Video Title <span>*</span>

                </label>


                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  required
                />

              </div>


              {/* YOUTUBE URL */}

              <div className="video-input video-full">

                <label>

                  YouTube Video URL <span>*</span>

                </label>


                <input
                  type="url"
                  name="youtube_url"
                  value={
                    formData.youtube_url
                  }
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />

              </div>


              {/* VIDEO ORDER */}

              <div className="video-input">

                <label>

                  Video Order <span>*</span>

                </label>


                <input
                  type="number"
                  name="video_order"
                  value={
                    formData.video_order
                  }
                  onChange={handleChange}
                  min="1"
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="video-input video-full">

                <label>
                  Description
                </label>


                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter video description"
                  rows="4"
                />

              </div>


              {/* BUTTONS */}

              <div className="video-button">


                <button
                  type="submit"
                  className="submit-video-btn"
                  disabled={loading}
                >

                  <FaEdit />

                  <span>

                    {loading
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                        ? "Update Video"
                        : "Add Video"}

                  </span>

                </button>


                {/* CANCEL */}

                <button
                  type="button"
                  className="cancel-video-btn"
                  onClick={
                    editingId
                      ? cancelEdit
                      : closeForm
                  }
                >

                  <FaTimes />

                  <span>
                    Cancel
                  </span>

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            VIDEO RECORDS
        ================================================= */}

        <div className="video-card">


          <div className="video-card-title">

            <h2>
              Course Video Records
            </h2>

            <p>
              All uploaded course videos
            </p>

          </div>


          <div className="video-table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Video Title
                  </th>

                  <th>
                    Video URL
                  </th>

                  <th>
                    Order
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>


                {filteredVideos.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="video-empty"
                    >

                      {videos.length === 0
                        ? "No course videos found."
                        : "No matching course videos found."}

                    </td>

                  </tr>

                ) : (

                  filteredVideos.map(
                    (video) => (

                      <tr
                        key={
                          video.id
                        }
                      >


                        {/* ID */}

                        <td>

                          #{video.id}

                        </td>


                        {/* COURSE */}

                        <td>

                          {getCourseName(
                            video
                          )}

                        </td>


                        {/* TITLE */}

                        <td>

                          <strong>

                            {video.title}

                          </strong>

                        </td>


                        {/* URL */}

                        <td>

                          <a
                            href={
                              video.youtube_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="video-link"
                          >

                            Watch Video

                          </a>

                        </td>


                        {/* ORDER */}

                        <td>

                          {video.video_order}

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          {video.description ||
                            "-"}

                        </td>


                        {/* ACTION */}

                        <td className="video-actions">


                          {/* EDIT */}

                          <button
                            type="button"
                            className="edit-video-btn"
                            onClick={() =>
                              editVideo(
                                video
                              )
                            }
                          >

                            <FaEdit />

                            <span>
                              Edit
                            </span>

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="delete-video-btn"
                            onClick={() =>
                              deleteVideo(
                                video.id
                              )
                            }
                          >

                            <FaTrash />

                            <span>
                              Delete
                            </span>

                          </button>


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

export default AdminVideos;