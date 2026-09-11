import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import AdminSidebar from "../components/AdminSidebar";
import "./AdminCategories.css";

const AdminCategories = () => {

  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    category_name: "",
    description: ""
  });


  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/categories/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      console.log("Categories from backend:", data);

      if (Array.isArray(data)) {

        setCategories(data);

      } else if (data.results) {

        setCategories(data.results);

      } else {

        setCategories([]);

      }

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

      setCategories([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  useEffect(() => {

    fetchCategories();

  }, []);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const handleAdd = () => {

    setEditingId(null);

    setFormData({
      category_name: "",
      description: ""
    });

    setShowForm(true);

  };


  // =====================================================
  // EDIT CATEGORY
  // =====================================================

  const handleEdit = (category) => {

    setEditingId(category.id);

    setFormData({

      category_name:
        category.category_name || "",

      description:
        category.description || ""

    });

    setShowForm(true);

  };


  // =====================================================
  // SAVE CATEGORY
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const url = editingId
        ? `http://127.0.0.1:8000/api/categories/${editingId}/`
        : "http://127.0.0.1:8000/api/categories/";


      const method =
        editingId ? "PUT" : "POST";


      const response = await fetch(
        url,
        {
          method: method,

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            category_name:
              formData.category_name,

            description:
              formData.description

          })

        }
      );


      if (!response.ok) {

        const errorData =
          await response.json();

        console.error(
          "Backend error:",
          errorData
        );

        alert(
          "Failed to save category"
        );

        return;

      }


      if (editingId) {

        alert(
          "Category updated successfully"
        );

      } else {

        alert(
          "Category added successfully"
        );

      }


      // Close form

      setShowForm(false);

      setEditingId(null);

      setFormData({
        category_name: "",
        description: ""
      });


      // Refresh category list

      fetchCategories();


    } catch (error) {

      console.error(
        "Error saving category:",
        error
      );

      alert(
        "Server error"
      );

    }

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

      const response =
        await fetch(

          `http://127.0.0.1:8000/api/categories/${id}/`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        const errorData =
          await response.json();

        console.error(
          errorData
        );

        alert(
          "Failed to delete category"
        );

        return;

      }


      alert(
        "Category deleted successfully"
      );


      fetchCategories();


    } catch (error) {

      console.error(
        "Error deleting category:",
        error
      );

      alert(
        "Server error"
      );

    }

  };


  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {

    setShowForm(false);

    setEditingId(null);

    setFormData({
      category_name: "",
      description: ""
    });

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-category-loading">

        Loading categories...

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-categories-page">


      {/* ================= SIDEBAR ================= */}

      <AdminSidebar />


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-categories-main">


        {/* ================= HEADER ================= */}

        <div className="categories-header">

          <div>

            <h1>
              Categories
            </h1>

            <p>
              Manage fashion boutique course categories
            </p>

          </div>


          <button
            className="add-category-btn"
            onClick={handleAdd}
          >

            <FaPlus />

            <span>
              Add Category
            </span>

          </button>

        </div>


        {/* ================= ADD / EDIT FORM ================= */}

        {showForm && (

          <div className="category-form-card">

            <div className="category-form-title">

              <h2>

                {editingId
                  ? "Edit Category"
                  : "Add New Category"
                }

              </h2>

            </div>


            <form
              onSubmit={handleSubmit}
            >


              {/* CATEGORY NAME */}

              <div className="category-form-group">

                <label>
                  Category Name
                </label>

                <input

                  type="text"

                  name="category_name"

                  value={
                    formData.category_name
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter category name"

                  required

                />

              </div>


              {/* DESCRIPTION */}

              <div className="category-form-group">

                <label>
                  Description
                </label>

                <textarea

                  name="description"

                  value={
                    formData.description
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter category description"

                  rows="4"

                  required

                />

              </div>


              {/* BUTTONS */}

              <div className="category-form-buttons">


                <button
                  type="submit"
                  className="save-category-btn"
                >

                  {editingId
                    ? "Update Category"
                    : "Save Category"
                  }

                </button>


                <button
                  type="button"
                  className="cancel-category-btn"
                  onClick={handleCancel}
                >

                  Cancel

                </button>


              </div>

            </form>

          </div>

        )}


        {/* ================= CATEGORY TABLE ================= */}

        <div className="category-table-card">


          <div className="category-table-heading">

            <h2>
              Category List
            </h2>

            <p>
              View and manage all available categories
            </p>

          </div>


          <div className="category-table-wrapper">

            <table className="category-table">


              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Category Name
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>


                {categories.length > 0 ? (

                  categories.map(
                    (category) => (

                     <tr key={course.id}>

                        {/* ID */}
                        <td>
                          #{course.id}
                        </td>

                        {/* CATEGORY */}
                        <td>
                          {
                            categories.find(
                              (category) => category.id === course.category
                            )?.category_name || "N/A"
                          }
                        </td>

                        {/* COURSE NAME */}
                        <td>
                          <strong>
                            {course.course_name || "N/A"}
                          </strong>
                        </td>

                        {/* DESCRIPTION */}
                        <td>
                          {course.description || "N/A"}
                        </td>

                        {/* DURATION */}
                        <td>
                          {course.duration || "N/A"}
                        </td>

                        {/* FEES */}
                        <td>
                          ₹{course.fees || "0.00"}
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={
                              course.status === "Active"
                                ? "course-status active"
                                : "course-status inactive"
                            }
                          >
                            {course.status || "N/A"}
                          </span>
                        </td>

                      

                        {/* ACTIONS */}

                        <td>

                          <div className="category-actions">


                            {/* EDIT */}

                            <button
                              className="edit-category-btn"
                              onClick={() =>
                                handleEdit(category)
                              }
                            >

                              <FaEdit />

                              <span>
                                Edit
                              </span>

                            </button>


                            {/* DELETE */}

                            <button
                              className="delete-category-btn"
                              onClick={() =>
                                handleDelete(
                                  category.id
                                )
                              }
                            >

                              <FaTrash />

                              <span>
                                Delete
                              </span>

                            </button>


                          </div>

                        </td>


                      </tr>

                    )

                  )

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="no-categories"
                    >

                      <div className="no-category-icon">
                        📂
                      </div>

                      <h3>
                        No Categories Found
                      </h3>

                      <p>
                        Add your first category
                        using the button above.
                      </p>

                    </td>

                  </tr>

                )}


              </tbody>


            </table>

          </div>


        </div>


      </main>


    </div>

  );

};


export default AdminCategories;