import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminGallery.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

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

      const response = await fetch(
        `${API_URL}/gallery/`
      );

      const data = await response.json();

      console.log("Gallery API response:", data);

      if (!response.ok) {
        setError("Unable to load gallery.");
        setGallery([]);
        return;
      }

      if (Array.isArray(data)) {
        setGallery(data);
      } else if (data.results) {
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
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // EDIT GALLERY
  // =====================================================

  const editGallery = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      image_url: item.image_url || item.image || "",
      description: item.description || "",
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

    setFormData({
      title: "",
      image_url: "",
      description: "",
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // ADD / UPDATE GALLERY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.title || !formData.image_url) {
      setError(
        "Please enter title and image URL."
      );
      return;
    }

    setLoading(true);

    try {
      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        response = await fetch(
          `${API_URL}/gallery/${editingId}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: formData.title,
              image_url: formData.image_url,
              description: formData.description,
            }),
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
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      }

      const data = await response.json();

      console.log(
        "Gallery save response:",
        data
      );

      if (!response.ok) {
        setError(
          data.detail ||
          JSON.stringify(data) ||
          "Gallery image could not be saved."
        );

        return;
      }

      // =================================================
      // SUCCESS MESSAGE
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
        image_url: "",
        description: "",
      });

      setEditingId(null);

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
          // DELETE may return empty response
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

      // If deleted item was being edited
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

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />

      {/* =================================================
          MAIN BODY
      ================================================= */}

      <div className="admin-gallery-body">

        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="gallery-alert success">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="gallery-alert error">
            {error}
          </div>
        )}

        {/* =================================================
            ADD / EDIT GALLERY FORM
        ================================================= */}

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
                : "Add an image to the website gallery"}
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

            {/* IMAGE URL */}

            <div className="gallery-input">

              <label>
                Image URL <span>*</span>
              </label>

              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />

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

              {/* CANCEL EDIT BUTTON */}

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

        {/* =================================================
            GALLERY RECORDS
        ================================================= */}

        <div className="gallery-card">

          <div className="gallery-card-title">

            <h2>
              Gallery Records
            </h2>

            <p>
              All gallery images
            </p>

          </div>

          {/* =================================================
              GALLERY GRID
          ================================================= */}

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

                    {/* ACTION BUTTONS */}

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