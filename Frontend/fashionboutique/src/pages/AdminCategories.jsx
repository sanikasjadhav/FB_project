import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminCategories.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminCategories = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [categories, setCategories] = useState([]);

  // Add/Edit form
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Page states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show / Hide Add Form
  const [showForm, setShowForm] = useState(false);

  // Show / Hide Search Form
  const [showSearchForm, setShowSearchForm] = useState(false);

  // Search filters
  const [filters, setFilters] = useState({
    search: "",
  });

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/categories/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load categories."
        );
      }

      const data = await response.json();

      console.log("Categories API:", data);

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.results)) {
        setCategories(data.results);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(
        "Category fetch error:",
        err
      );

      setError(
        err.message ||
          "Unable to load categories."
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // =====================================================
  // CLEAR FORM
  // =====================================================

  const clearForm = () => {
    setCategoryName("");
    setDescription("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN ADD CATEGORY FORM
  // =====================================================

  const openAddForm = () => {
    clearForm();

    setShowSearchForm(false);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CLOSE ADD CATEGORY FORM
  // =====================================================

  const closeForm = () => {
    clearForm();
    setShowForm(false);
  };

  // =====================================================
  // OPEN SEARCH FORM
  // =====================================================

  const openSearchForm = () => {
    setShowForm(false);
    setEditingId(null);

    setShowSearchForm(
      (previous) => !previous
    );
  };

  // =====================================================
  // SEARCH FILTER CHANGE
  // =====================================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET SEARCH
  // =====================================================

  const resetFilters = () => {
    setFilters({
      search: "",
    });
  };

  // =====================================================
  // FILTER CATEGORIES
  // =====================================================

  const filteredCategories =
    categories.filter((category) => {
      const searchText =
        filters.search
          .trim()
          .toLowerCase();

      if (!searchText) {
        return true;
      }

      const categoryName = (
        category.category_name ||
        category.name ||
        ""
      ).toLowerCase();

      const categoryDescription = (
        category.description ||
        ""
      ).toLowerCase();

      return (
        categoryName.includes(searchText) ||
        categoryDescription.includes(
          searchText
        )
      );
    });

  // =====================================================
  // ADD / UPDATE CATEGORY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!categoryName.trim()) {
      setError(
        "Please enter a category name."
      );
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/categories/${editingId}/`
        : `${API_URL}/categories/`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          category_name:
            categoryName.trim(),

          description:
            description.trim(),
        }),
      });

      const data = await response.json();

      console.log(
        "Category response:",
        data
      );

      if (!response.ok) {
        console.error(
          "Category save error:",
          data
        );

        throw new Error(
          data.detail ||
            data.category_name?.[0] ||
            data.name?.[0] ||
            "Unable to save category."
        );
      }

      if (editingId) {
        setSuccess(
          "Category updated successfully."
        );
      } else {
        setSuccess(
          "Category added successfully."
        );
      }

      clearForm();
      setShowForm(false);

      await fetchCategories();
    } catch (err) {
      console.error(
        "Save category error:",
        err
      );

      setError(
        err.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT CATEGORY
  // =====================================================

  const handleEdit = (category) => {
    setEditingId(category.id);

    setCategoryName(
      category.category_name ||
        category.name ||
        ""
    );

    setDescription(
      category.description || ""
    );

    setError("");
    setSuccess("");

    setShowSearchForm(false);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this category?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/categories/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          data.detail ||
            "Unable to delete category."
        );
      }

      setSuccess(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (err) {
      console.error(
        "Delete category error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete category."
      );
    }
  };

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

  const downloadCategoryReport =
    () => {
      if (
        filteredCategories.length === 0
      ) {
        alert(
          "No categories available to download."
        );
        return;
      }

      const headers = [
        "Category ID",
        "Category Name",
        "Description",
      ];

      const rows =
        filteredCategories.map(
          (category) => [
            category.id || "",
            category.category_name ||
              category.name ||
              "",
            category.description ||
              "",
          ]
        );

      const csv = [
        headers
          .map(escapeCSV)
          .join(","),
        ...rows.map((row) =>
          row
            .map(escapeCSV)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "filtered_categories_report.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-categories-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-categories-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="categories-header">

          <div>
            <h1>Categories</h1>

            <p>
              Manage course categories
              for your Fashion Boutique
              learning platform.
            </p>
          </div>

          {/* HEADER BUTTONS */}

          <div className="categories-header-buttons">

            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="search-category-btn"
              onClick={
                openSearchForm
              }
            >
              {showSearchForm
                ? "✕ Close Search"
                : "🔍 Search Categories"}
            </button>

            {/* ADD BUTTON */}

            <button
              type="button"
              className="add-category-header-btn"
              onClick={
                showForm
                  ? closeForm
                  : openAddForm
              }
            >
              {showForm
                ? "✕ Close Form"
                : "+ Add Category"}
            </button>

          </div>

        </div>

        {/* =================================================
            COUNT CARD
        ================================================= */}

        <div className="categories-count-card">

          <span className="count-icon">
            📂
          </span>

          <div>
            <small>
              Total Categories
            </small>

            <strong>
              {categories.length}
            </strong>
          </div>

        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {error && (
          <div className="category-message error">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="category-message success">
            ✓ {success}
          </div>
        )}

        {/* =================================================
            SEARCH CATEGORY FORM
        ================================================= */}

        {showSearchForm && (
          <section className="category-search-card">

            <div className="category-search-header">

              <div>
                <h2>
                  Search Categories
                </h2>

                <p>
                  Search categories by
                  name or description.
                </p>
              </div>

              <button
                type="button"
                className="close-category-search-btn"
                onClick={() =>
                  setShowSearchForm(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>

            <div className="category-search-form">

              <div className="category-search-field">

                <label>
                  Search Category
                </label>

                <input
                  type="text"
                  name="search"
                  value={
                    filters.search
                  }
                  onChange={
                    handleFilterChange
                  }
                  placeholder="Search category name or description..."
                />

              </div>

            </div>

            <div className="category-search-actions">

              <button
                type="button"
                className="reset-category-filter-btn"
                onClick={
                  resetFilters
                }
              >
                Reset
              </button>

              <button
                type="button"
                className="download-category-report-btn"
                onClick={
                  downloadCategoryReport
                }
                disabled={
                  filteredCategories.length ===
                  0
                }
              >
                ↓ Download Report
              </button>

            </div>

            <div className="category-filter-result">

              Showing{" "}
              <strong>
                {
                  filteredCategories.length
                }
              </strong>{" "}
              of{" "}
              <strong>
                {categories.length}
              </strong>{" "}
              categories

            </div>

          </section>
        )}

        {/* =================================================
            ADD / EDIT CATEGORY FORM
        ================================================= */}

        {showForm && (
          <section className="category-form-card">

            <div className="category-form-heading">

              <div>
                <h2>
                  {editingId
                    ? "Edit Category"
                    : "Add New Category"}
                </h2>

                <p>
                  {editingId
                    ? "Update the selected category."
                    : "Create a new course category."}
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  className="cancel-category-btn"
                  onClick={
                    closeForm
                  }
                >
                  Cancel
                </button>
              )}

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="category-form"
            >

              <div className="category-form-group">

                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  value={
                    categoryName
                  }
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
                  placeholder="Enter category name"
                />

              </div>

              <div className="category-form-group">

                <label>
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter category description"
                  rows="4"
                />

              </div>

              <button
                type="submit"
                className="save-category-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Add Category"}
              </button>

            </form>

          </section>
        )}

        {/* =================================================
            CATEGORY LIST
        ================================================= */}

        <section className="category-list-card">

          <div className="category-list-heading">

            <div>
              <h2>
                Category Records
              </h2>

              <p>
                View and manage all
                course categories.
              </p>
            </div>

            <div className="category-list-count">
              {filteredCategories.length}{" "}
              Categories
            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="category-loading">

              <div className="category-spinner"></div>

              <p>
                Loading categories...
              </p>

            </div>

          ) : filteredCategories.length ===
            0 ? (

            <div className="no-categories">

              <div className="no-category-icon">
                📂
              </div>

              <h3>
                No Categories Found
              </h3>

              <p>
                {categories.length ===
                0
                  ? "Add your first course category using the Add Category button."
                  : "No categories match your search."}
              </p>

            </div>

          ) : (

            <div className="category-table-wrapper">

              <table className="category-table">

                <thead>

                  <tr>

                    <th>
                      Cat_Id
                    </th>

                    <th>
                      Category Name
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

                  {filteredCategories.map(
                    (
                      category,
                      index
                    ) => (

                      <tr
                        key={
                          category.id ||
                          index
                        }
                      >

                        <td>
                          <span className="category-id">
                            #
                            {
                              category.id
                            }
                          </span>
                        </td>

                        <td>
                          <strong className="category-name">
                            {category.category_name ||
                              category.name ||
                              "N/A"}
                          </strong>
                        </td>

                        <td>

                          <span className="category-description">

                            {category.description ||
                              "No description"}

                          </span>

                        </td>

                        <td>

                          <div className="category-actions">

                            <button
                              type="button"
                              className="edit-category-btn"
                              onClick={() =>
                                handleEdit(
                                  category
                                )
                              }
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="delete-category-btn"
                              onClick={() =>
                                handleDelete(
                                  category.id
                                )
                              }
                            >
                              🗑️ Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default AdminCategories;