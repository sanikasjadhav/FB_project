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

    setEditingId(material.id);
    setIsEditing(true);

    setFormData({
      course: material.course || "",
      title: material.title || "",
      file: null,
    });

    setMessage("");
    setError("");

    // Scroll to form
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
          result = await response.json();
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
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (material) => {

    if (material.course_name) {

      return material.course_name;

    }

    const course =
      courses.find(
        (item) =>
          Number(item.id) ===
          Number(material.course)
      );

    return (
      course?.course_name ||
      "-"
    );
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


          <div className="study-count">

            Total Materials:{" "}

            {materials.length}

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
            ADD / EDIT MATERIAL
        ================================================= */}

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

              {isEditing && (

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={cancelEdit}
                >

                  Cancel

                </button>

              )}

            </div>

          </form>

        </div>


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


                {materials.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="study-empty"
                    >

                      No study materials found.

                    </td>

                  </tr>

                ) : (

                  materials.map(
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


                          {/* =================================================
                              ID
                          ================================================= */}

                          <td>

                            #{material.id}

                          </td>


                          {/* =================================================
                              COURSE
                          ================================================= */}

                          <td>

                            {getCourseName(
                              material
                            )}

                          </td>


                          {/* =================================================
                              TITLE
                          ================================================= */}

                          <td>

                            <strong>

                              {material.title}

                            </strong>

                          </td>


                          {/* =================================================
                              FILE
                          ================================================= */}

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


                          {/* =================================================
                              ACTION
                          ================================================= */}

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