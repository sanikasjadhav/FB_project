import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminContacts.css";

const API_URL = "http://127.0.0.1:8000/api";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CONTACTS
  // =====================================================

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/contacts/`
      );

      const data = await response.json();

      console.log(
        "Contacts API response:",
        data
      );

      if (!response.ok) {
        setError("Unable to load contacts.");
        setContacts([]);
        return;
      }

      if (Array.isArray(data)) {
        setContacts(data);
      } else if (data.results) {
        setContacts(data.results);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error(
        "Fetch contacts error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );

      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CONTACTS
  // =====================================================

  useEffect(() => {
    fetchContacts();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // EDIT CONTACT
  // =====================================================

  const editContact = (contact) => {
    setEditingId(contact.id);

    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      message: contact.message || "",
    });

    setMessage("");
    setError("");

    // Scroll to edit form
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
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // UPDATE CONTACT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.message
    ) {
      setError(
        "Please enter name, email and message."
      );
      return;
    }

    if (!editingId) {
      setError(
        "Please select a contact to edit."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/contacts/${editingId}/`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Update contact response:",
        data
      );

      if (!response.ok) {
        console.error(
          "Update contact error:",
          data
        );

        setError(
          data.detail ||
          JSON.stringify(data) ||
          "Unable to update contact."
        );

        return;
      }

      setMessage(
        "Contact updated successfully."
      );

      setEditingId(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      await fetchContacts();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Update contact error:",
        err
      );

      setError(
        "Unable to connect to backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CONTACT
  // =====================================================

  const deleteContact = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/contacts/${id}/`,
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
          "Delete contact error:",
          data
        );

        setError(
          "Unable to delete contact."
        );

        return;
      }

      // If deleted contact was being edited
      if (editingId === id) {
        cancelEdit();
      }

      setMessage(
        "Contact deleted successfully."
      );

      await fetchContacts();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete contact error:",
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
    <div className="admin-contacts-layout">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <div className="admin-contacts-body">

        {/* HEADER */}

        <div className="contacts-header">

          <div>
            <h1>
              Contact Messages
            </h1>

            <p>
              Manage messages received from website visitors
            </p>
          </div>

          <div className="contacts-count">
            Total Messages:{" "}
            {contacts.length}
          </div>

        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="contacts-alert success">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="contacts-alert error">
            {error}
          </div>
        )}

        {/* =================================================
            EDIT CONTACT FORM
        ================================================= */}

        {editingId && (
          <div className="contacts-card edit-contact-card">

            <div className="contacts-card-title">

              <h2>
                Edit Contact
              </h2>

              <p>
                Update the selected contact message
              </p>

            </div>

            <form
              className="contacts-edit-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="contact-input">

                <label>
                  Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="contact-input">

                <label>
                  Email <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />

              </div>

              {/* PHONE */}

              <div className="contact-input">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>

              {/* MESSAGE */}

              <div className="contact-input contact-input-full">

                <label>
                  Message <span>*</span>
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message"
                  rows="5"
                  required
                />

              </div>

              {/* BUTTONS */}

              <div className="contact-form-buttons">

                <button
                  type="submit"
                  className="update-contact-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Update Contact"}
                </button>

                <button
                  type="button"
                  className="cancel-contact-btn"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =================================================
            CONTACT RECORDS
        ================================================= */}

        <div className="contacts-card">

          <div className="contacts-card-title">

            <h2>
              Contact Records
            </h2>

            <p>
              Messages submitted through Contact Us
            </p>

          </div>

          {/* TABLE */}

          <div className="contacts-table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Message
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* LOADING */}

                {loading && (

                  <tr>

                    <td
                      colSpan="6"
                      className="contacts-empty"
                    >
                      Loading contacts...
                    </td>

                  </tr>

                )}

                {/* EMPTY */}

                {!loading &&
                  contacts.length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="contacts-empty"
                      >
                        No contact messages found.
                      </td>

                    </tr>

                  )}

                {/* CONTACT DATA */}

                {!loading &&
                  contacts.length > 0 &&
                  contacts.map(
                    (contact) => (

                      <tr
                        key={contact.id}
                      >

                        {/* ID */}

                        <td>
                          #{contact.id}
                        </td>

                        {/* NAME */}

                        <td>
                          {contact.name || "-"}
                        </td>

                        {/* EMAIL */}

                        <td>
                          {contact.email || "-"}
                        </td>

                        {/* PHONE */}

                        <td>
                          {contact.phone || "-"}
                        </td>

                        {/* MESSAGE */}

                        <td className="contact-message">
                          {contact.message || "-"}
                        </td>

                        {/* ACTION */}

                        <td>

                          <div className="contact-action-buttons">

                            <button
                              className="edit-contact-btn"
                              onClick={() =>
                                editContact(contact)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-contact-btn"
                              onClick={() =>
                                deleteContact(
                                  contact.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

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

export default AdminContacts;