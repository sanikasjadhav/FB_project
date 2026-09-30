
import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminGallery.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD GALLERY
  // =====================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  const fetchGallery = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/gallery/`);

      const data = await response.json();

      console.log("Gallery API response:", data);

      if (!response.ok) {
        setError("Unable to load gallery.");
        setGallery([]);
        return;
      }

      if (Array.isArray(data)) {
        setGallery(data);
      } else if (Array.isArray(data.results)) {
        setGallery(data.results);
      } else {
        setGallery([]);
      }
    } catch (err) {
      console.error("Gallery fetch error:", err);

      setError("Unable to connect to backend.");
      setGallery([]);
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
  // HANDLE IMAGE SELECTION
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Allow common image types
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // Optional 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");

    setFormData({
      ...formData,
      image: file,
    });
  };

  // =====================================================
  // EDIT GALLERY
  // =====================================================

  const editGallery = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      image: null,
      description: item.description || "",
    });

    setExistingImage(
      item.image_url ||
      item.image ||
      ""
    );

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

    setFormData({
      title: "",
      image: null,
      description: "",
    });

    setExistingImage("");

    setMessage("");
    setError("");

    // Clear file input
    const fileInput =
      document.getElementById("gallery-image");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // ADD / UPDATE GALLERY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter image title.");
      return;
    }

    // Image is required only when adding
    if (!editingId && !formData.image) {
      setError("Please select an image from your device.");
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();

      uploadData.append(
        "title",
        formData.title
      );

      uploadData.append(
        "description",
        formData.description
      );

      // Only send image if a new image was selected
      if (formData.image) {
        uploadData.append(
          "image",
          formData.image
        );
      }

      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        response = await fetch(
          `${API_URL}/gallery/${editingId}/`,
          {
            method: "PATCH",
            body: uploadData,
          }
        );
      }

      // =================================================
      // ADD
      // =================================================

      else {
        response = await fetch(
          `${API_URL}/gallery/`,
          {
            method: "POST",
            body: uploadData,
          }
        );
      }

      const contentType =
        response.headers.get("content-type");

      let data = {};

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(
        "Gallery save response:",
        data
      );

      if (!response.ok) {
        console.error(
          "Gallery save error:",
          data
        );

        if (typeof data === "object") {
          setError(
            data.detail ||
            JSON.stringify(data)
          );
        } else {
          setError(
            data ||
            "Gallery image could not be saved."
          );
        }

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      if (editingId) {
        setMessage(
          "Gallery image updated successfully."
        );
      } else {
        setMessage(
          "Gallery image added successfully."
        );
      }

      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        title: "",
        image: null,
        description: "",
      });

      setEditingId(null);
      setExistingImage("");

      const fileInput =
        document.getElementById("gallery-image");

      if (fileInput) {
        fileInput.value = "";
      }

      // =================================================
      // REFRESH
      // =================================================

      await fetchGallery();

    } catch (err) {
      console.error(
        "Gallery save error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE GALLERY
  // =====================================================

  const deleteGallery = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this gallery image?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/gallery/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let data = {};

        try {
          data = await response.json();
        } catch {
          // Empty DELETE response
        }

        console.error(
          "Delete gallery error:",
          data
        );

        setError(
          "Unable to delete gallery image."
        );

        return;
      }

      setMessage(
        "Gallery image deleted successfully."
      );

      if (editingId === id) {
        cancelEdit();
      }

      await fetchGallery();

    } catch (err) {
      console.error(
        "Delete gallery error:",
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
    <div className="admin-gallery-layout">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN BODY */}

      <div className="admin-gallery-body">

        {/* HEADER */}

        <div className="gallery-header">

          <div>
            <h1>Gallery</h1>

            <p>
              Manage Fashion Boutique gallery images
            </p>
          </div>

          <div className="gallery-count">
            Total Images: {gallery.length}
          </div>

        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="gallery-alert success">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="gallery-alert error">
            {error}
          </div>
        )}

        {/* ADD / EDIT FORM */}

        <div className="gallery-card">

          <div className="gallery-card-title">

            <h2>
              {editingId
                ? "Edit Gallery Image"
                : "Add Gallery Image"}
            </h2>

            <p>
              {editingId
                ? "Update gallery image details"
                : "Select an image from your device"}
            </p>

          </div>

          <form
            className="gallery-form"
            onSubmit={handleSubmit}
          >

            {/* TITLE */}

            <div className="gallery-input">

              <label>
                Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter image title"
                required
              />

            </div>

            {/* IMAGE */}

            <div className="gallery-input">

              <label>
                Select Image{" "}
                {!editingId && <span>*</span>}
              </label>

              <input
                id="gallery-image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />

              <small>
                JPG, JPEG, PNG, WEBP — Maximum 5 MB
              </small>

              {/* NEW IMAGE NAME */}

              {formData.image && (
                <div className="selected-image-name">
                  Selected: {formData.image.name}
                </div>
              )}

              {/* EXISTING IMAGE DURING EDIT */}

              {editingId && existingImage && (
                <div className="existing-image-preview">

                  <p>
                    Current Image:
                  </p>

                  <img
                    src={existingImage}
                    alt="Current Gallery"
                  />

                </div>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="gallery-input gallery-full">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter image description"
                rows="3"
              />

            </div>

            {/* BUTTONS */}

            <div className="gallery-button">

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "Update Image"
                    : "Add Image"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-gallery-btn"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* GALLERY RECORDS */}

        <div className="gallery-card">

          <div className="gallery-card-title">

            <h2>
              Gallery Records
            </h2>

            <p>
              All gallery images
            </p>

          </div>

          {/* GALLERY GRID */}

          <div className="gallery-grid">

            {gallery.length === 0 ? (

              <div className="gallery-empty">
                No gallery images found.
              </div>

            ) : (

              gallery.map((item) => (

                <div
                  className="gallery-item"
                  key={item.id}
                >

                  {/* IMAGE */}

                  <div className="gallery-image-wrapper">

                    <img
                      src={
                        item.image_url ||
                        item.image
                      }
                      alt={
                        item.title ||
                        "Gallery"
                      }
                      onError={(e) => {
                        e.target.style.display =
                          "none";
                      }}
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="gallery-item-content">

                    <h3>
                      {item.title || "-"}
                    </h3>

                    <p>
                      {item.description || "-"}
                    </p>

                    {/* ACTIONS */}

                    <div className="gallery-action-buttons">

                      <button
                        type="button"
                        className="edit-gallery-btn"
                        onClick={() =>
                          editGallery(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-gallery-btn"
                        onClick={() =>
                          deleteGallery(item.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminGallery;
