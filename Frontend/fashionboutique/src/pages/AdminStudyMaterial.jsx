import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminStudyMaterial.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminStudyMaterial = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    file: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // EDIT STATES
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ADD FORM STATE
  const [showForm, setShowForm] = useState(false);

  // SEARCH FORM STATE
  const [showSearchForm, setShowSearchForm] = useState(false);

  // SEARCH FILTERS
  const [filters, setFilters] = useState({
    search: "",
    course: "",
  });


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);


  // =====================================================
  // FETCH STUDY MATERIALS
  // =====================================================

  const fetchMaterials = async () => {

    try {

      const response = await fetch(
        `${API_URL}/study-materials/`
      );

      const data = await response.json();

      console.log("Study Materials API:", data);

      if (!response.ok) {

        setError(
          "Unable to load study materials."
        );

        return;
      }

      if (Array.isArray(data)) {

        setMaterials(data);

      } else if (data.results) {

        setMaterials(data.results);

      } else {

        setMaterials([]);

      }

    } catch (err) {

      console.error(
        "Fetch materials error:",
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

      console.log("Courses API:", data);

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
  // HANDLE TEXT INPUT
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================================
  // HANDLE FILE
  // =====================================================

  const handleFileChange = (e) => {

    setFormData({
      ...formData,
      file: e.target.files[0] || null,
    });

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {

    // Close search form
    setShowSearchForm(false);

    // Clear editing
    setEditingId(null);
    setIsEditing(false);

    // Clear form
    setFormData({
      course: "",
      title: "",
      file: null,
    });

    // Clear messages
    setMessage("");
    setError("");

    // Open form
    setShowForm(true);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =====================================================
  // CLOSE ADD / EDIT FORM
  // =====================================================

  const closeForm = () => {

    setShowForm(false);

    setEditingId(null);
    setIsEditing(false);

    setFormData({
      course: "",
      title: "",
      file: null,
    });

    setMessage("");
    setError("");

    const fileInput =
      document.getElementById(
        "study-material-file"
      );

    if (fileInput) {

      fileInput.value = "";

    }

  };


  // =====================================================
  // OPEN SEARCH FORM
  // =====================================================

  const openSearchForm = () => {

    // Close add/edit form
    setShowForm(false);

    setEditingId(null);
    setIsEditing(false);

    setFormData({
      course: "",
      title: "",
      file: null,
    });

    setMessage("");
    setError("");

    setShowSearchForm(
      (previous) => !previous
    );

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
  // RESET SEARCH FILTERS
  // =====================================================

  const resetFilters = () => {

    setFilters({
      search: "",
      course: "",
    });

  };


  // =====================================================
  // GET COURSE ID
  // =====================================================

  const getCourseId = (material) => {

    if (
      typeof material.course === "object" &&
      material.course !== null
    ) {

      return material.course.id;

    }

    return material.course;

  };


  // =====================================================
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (material) => {

    // If API directly provides course_name
    if (material.course_name) {

      return material.course_name;

    }


    // If course is an object
    if (
      material.course &&
      typeof material.course === "object"
    ) {

      return (
        material.course.course_name ||
        material.course.name ||
        "-"
      );

    }


    // If course is an ID
    const course = courses.find(
      (item) =>
        String(item.id) ===
        String(getCourseId(material))
    );


    return (
      course?.course_name ||
      course?.name ||
      "-"
    );

  };


  // =====================================================
  // FILTER MATERIALS
  // =====================================================

  const filteredMaterials =
    materials.filter((material) => {

      const searchText =
        filters.search
          .trim()
          .toLowerCase();


      const materialTitle =
        (
          material.title || ""
        ).toLowerCase();


      const courseName =
        getCourseName(material)
          .toLowerCase();


      const fileName =
        (
          material.file || ""
        ).toLowerCase();


      // SEARCH
      const matchesSearch =
        !searchText ||
        materialTitle.includes(searchText) ||
        courseName.includes(searchText) ||
        fileName.includes(searchText);


      // COURSE
      const materialCourseId =
        getCourseId(material);


      const matchesCourse =
        !filters.course ||
        String(materialCourseId) ===
        String(filters.course);


      return (
        matchesSearch &&
        matchesCourse
      );

    });


  // =====================================================
  // CSV ESCAPE
  // =====================================================

  const escapeCSV = (value) => {

    return `"${String(
      value ?? ""
    ).replace(/"/g, '""')}"`;

  };


  // =====================================================
  // DOWNLOAD FILTERED REPORT
  // =====================================================

  const downloadMaterialReport = () => {

    if (
      filteredMaterials.length === 0
    ) {

      alert(
        "No study materials available to download."
      );

      return;

    }


    const headers = [
      "Material ID",
      "Course",
      "Material Title",
      "File",
    ];


    const rows =
      filteredMaterials.map(
        (material) => [

          material.id || "",

          getCourseName(material),

          material.title || "",

          material.file || "",

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
      "filtered_study_materials_report.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  // =====================================================
  // ADD / UPDATE MATERIAL
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // Validation
    if (
      !formData.course ||
      !formData.title
    ) {

      setError(
        "Please select course and enter title."
      );

      return;
    }


    // File required only while adding
    if (
      !isEditing &&
      !formData.file
    ) {

      setError(
        "Please choose a study material file."
      );

      return;
    }


    setLoading(true);


    try {

      const data = new FormData();


      data.append(
        "course",
        formData.course
      );


      data.append(
        "title",
        formData.title
      );


      // Add file only if selected
      if (formData.file) {

        data.append(
          "file",
          formData.file
        );

      }


      // =================================================
      // UPDATE
      // =================================================

      if (isEditing) {

        const response = await fetch(
          `${API_URL}/study-materials/${editingId}/`,
          {
            method: "PUT",
            body: data,
          }
        );


        const result =
          await response.json();


        console.log(
          "Study material update response:",
          result
        );


        if (!response.ok) {

          setError(
            JSON.stringify(result)
          );

          setLoading(false);

          return;
        }


        setMessage(
          "Study material updated successfully."
        );

      }


      // =================================================
      // ADD
      // =================================================

      else {

        const response = await fetch(
          `${API_URL}/study-materials/`,
          {
            method: "POST",
            body: data,
          }
        );


        const result =
          await response.json();


        console.log(
          "Study material save response:",
          result
        );


        if (!response.ok) {

          setError(
            JSON.stringify(result)
          );

          setLoading(false);

          return;
        }


        setMessage(
          "Study material added successfully."
        );

      }


      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        course: "",
        title: "",
        file: null,
      });


      setEditingId(null);
      setIsEditing(false);
      setShowForm(false);


      // Clear file input
      const fileInput =
        document.getElementById(
          "study-material-file"
        );


      if (fileInput) {

        fileInput.value = "";

      }


      // Reload materials
      await fetchMaterials();

    } catch (err) {

      console.error(
        "Save/update material error:",
        err
      );


      setError(
        "Unable to connect to backend."
      );

    }


    setLoading(false);

  };


  // =====================================================
  // EDIT MATERIAL
  // =====================================================

  const editMaterial = (material) => {

    console.log(
      "Editing material:",
      material
    );


    // Close search
    setShowSearchForm(false);

    // Open form
    setShowForm(true);


    setEditingId(material.id);

    setIsEditing(true);


    setFormData({
      course:
        getCourseId(material) || "",

      title:
        material.title || "",

      file: null,
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

    setIsEditing(false);

    setShowForm(false);


    setFormData({
      course: "",
      title: "",
      file: null,
    });


    setMessage("");
    setError("");


    const fileInput =
      document.getElementById(
        "study-material-file"
      );


    if (fileInput) {

      fileInput.value = "";

    }

  };


  // =====================================================
  // DELETE MATERIAL
  // =====================================================

  const deleteMaterial = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this study material?"
      );


    if (!confirmDelete) {

      return;

    }


    setMessage("");
    setError("");


    try {

      const response =
        await fetch(
          `${API_URL}/study-materials/${id}/`,
          {
            method: "DELETE",
          }
        );


      if (!response.ok) {

        let result = {};

        try {

          result =
            await response.json();

        } catch {

          result = {};

        }


        console.error(
          "Delete backend error:",
          result
        );


        setError(
          "Unable to delete study material."
        );


        return;

      }


      setMessage(
        "Study material deleted successfully."
      );


      // If currently editing deleted material
      if (editingId === id) {

        cancelEdit();

      }


      await fetchMaterials();


    } catch (err) {

      console.error(
        "Delete material error:",
        err
      );


      setError(
        "Unable to connect to backend."
      );

    }

  };


  // =====================================================
  // GET FILE URL
  // =====================================================

  const getFileUrl = (material) => {

    if (!material.file) {

      return null;

    }


    if (
      material.file.startsWith("http")
    ) {

      return material.file;

    }


    return `http://127.0.0.1:8000${material.file}`;

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-study-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="admin-study-body">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="study-header">

          <div>

            <h1>
              Study Materials
            </h1>

            <p>
              Manage study materials for courses
            </p>

          </div>


          <div className="study-header-buttons">


            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="search-study-btn"
              onClick={openSearchForm}
            >

              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Materials"}

            </button>


            {/* ADD BUTTON */}

            <button
              type="button"
              className="add-study-btn"
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
            >

              {showForm
                ? "✕ Close Form"
                : "+ Add Study Material"}

            </button>


            {/* COUNT */}

            <div className="study-count">

              Total Materials:{" "}

              {materials.length}

            </div>

          </div>

        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        {message && (

          <div className="study-alert success">

            {message}

          </div>

        )}


        {error && (

          <div className="study-alert error">

            {error}

          </div>

        )}


        {/* =================================================
            SEARCH FORM
        ================================================= */}

        {showSearchForm && (

          <div className="study-search-card">


            <div className="study-search-title">

              <h2>
                Search Study Materials
              </h2>

              <p>
                Filter materials by course or material title
              </p>

            </div>


            <div className="study-search-form">


              {/* SEARCH */}

              <div className="study-search-field">

                <label>
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search material title, course or file..."
                />

              </div>


              {/* COURSE */}

              <div className="study-search-field">

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


              {/* ACTIONS */}

              <div className="study-search-actions">

                <button
                  type="button"
                  className="reset-study-search-btn"
                  onClick={resetFilters}
                >

                  Reset

                </button>


                <button
                  type="button"
                  className="download-study-btn"
                  onClick={downloadMaterialReport}
                  disabled={
                    filteredMaterials.length === 0
                  }
                >

                  ↓ Download Report

                </button>

              </div>

            </div>


            {/* FILTER RESULT */}

            <div className="study-filter-result">

              Showing{" "}

              <strong>
                {filteredMaterials.length}
              </strong>{" "}

              of{" "}

              <strong>
                {materials.length}
              </strong>{" "}

              study materials

            </div>

          </div>

        )}


        {/* =================================================
            ADD / EDIT MATERIAL FORM
        ================================================= */}

        {showForm && (

          <div className="study-card">


            <div className="study-card-title">

              <h2>

                {isEditing
                  ? "Edit Study Material"
                  : "Add Study Material"}

              </h2>


              <p>

                {isEditing
                  ? "Update study material details"
                  : "Upload notes, PDFs, documents or other learning resources"}

              </p>

            </div>


            <form
              className="study-form"
              onSubmit={handleSubmit}
            >


              {/* =================================================
                  COURSE
              ================================================= */}

              <div className="study-input">

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


              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="study-input">

                <label>

                  Material Title <span>*</span>

                </label>


                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter material title"
                  required
                />

              </div>


              {/* =================================================
                  FILE
              ================================================= */}

              <div className="study-input study-full">

                <label>

                  Study Material File{" "}

                  {!isEditing && (
                    <span>*</span>
                  )}

                </label>


                <input
                  id="study-material-file"
                  type="file"
                  onChange={handleFileChange}
                  required={!isEditing}
                />


                <small>

                  {isEditing
                    ? "Select a new file only if you want to replace the existing file."
                    : "Select PDF, DOC, DOCX or other study material file."}

                </small>

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="study-button">


                <button
                  type="submit"
                  disabled={loading}
                >

                  {loading
                    ? (
                      isEditing
                        ? "Updating..."
                        : "Uploading..."
                    )
                    : (
                      isEditing
                        ? "Update Study Material"
                        : "Add Study Material"
                    )}

                </button>


                {/* CANCEL */}

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={isEditing ? cancelEdit : closeForm}
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            MATERIAL RECORDS
        ================================================= */}

        <div className="study-card">


          <div className="study-card-title">

            <h2>
              Study Material Records
            </h2>

            <p>
              All available course materials
            </p>

          </div>


          <div className="study-table-container">

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
                    Material Title
                  </th>

                  <th>
                    File
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>


                {filteredMaterials.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="study-empty"
                    >

                      {materials.length === 0
                        ? "No study materials found."
                        : "No matching study materials found."}

                    </td>

                  </tr>

                ) : (

                  filteredMaterials.map(
                    (material) => {

                      const fileUrl =
                        getFileUrl(
                          material
                        );


                      return (

                        <tr
                          key={
                            material.id
                          }
                        >


                          {/* ID */}

                          <td>

                            #{material.id}

                          </td>


                          {/* COURSE */}

                          <td>

                            {getCourseName(
                              material
                            )}

                          </td>


                          {/* TITLE */}

                          <td>

                            <strong>

                              {material.title}

                            </strong>

                          </td>


                          {/* FILE */}

                          <td>

                            {fileUrl ? (

                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="study-link"
                              >

                                Open Material

                              </a>

                            ) : (

                              "-"

                            )}

                          </td>


                          {/* ACTION */}

                          <td>

                            <div className="study-action-buttons">


                              {/* EDIT */}

                              <button
                                type="button"
                                className="edit-study-btn"
                                onClick={() =>
                                  editMaterial(
                                    material
                                  )
                                }
                              >

                                Edit

                              </button>


                              {/* DELETE */}

                              <button
                                type="button"
                                className="delete-study-btn"
                                onClick={() =>
                                  deleteMaterial(
                                    material.id
                                  )
                                }
                              >

                                Delete

                              </button>


                            </div>

                          </td>


                        </tr>

                      );

                    }
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

export default AdminStudyMaterial;