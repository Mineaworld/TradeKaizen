import React, { useState, useEffect } from "react";
import { updateJournalEntry } from "../../api/journalAPI";

const JournalForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    mood: "neutral",
    trades: [],
    date: new Date().toISOString().split("T")[0],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If initialData is provided, this is an edit operation
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      try {
        // Format the date for the date input
        const formattedDate = initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        setFormData({
          ...initialData,
          date: formattedDate,
          tags: Array.isArray(initialData.tags) ? initialData.tags : [],
          mood: initialData.mood || "neutral",
          trades: Array.isArray(initialData.trades) ? initialData.trades : [],
        });
      } catch (error) {
        console.error("Error processing initial data:", error);
        // Reset to default values on error
        setFormData({
          title: "",
          content: "",
          tags: [],
          mood: "neutral",
          trades: [],
          date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }

    if (!formData.content) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEditing) {
        // Update existing entry
        result = await updateJournalEntry(initialData.id, formData);
      } else {
        // Create new entry
        result = await onSubmit(formData);
      }

      if (result) {
        // Reset the form if successful and it's a new entry
        if (!isEditing) {
          setFormData({
            title: "",
            content: "",
            tags: [],
            mood: "neutral",
            trades: [],
            date: new Date().toISOString().split("T")[0],
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: error.message || "Failed to submit entry" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-form-container">
      <h3>{isEditing ? "Edit Journal Entry" : "Create New Journal Entry"}</h3>

      <form onSubmit={handleSubmit} className="journal-form">
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            placeholder="Entry title"
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Journal Entry*</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={`form-control ${errors.content ? "is-invalid" : ""}`}
            placeholder="What happened today in your trading journey?"
            rows="6"
          ></textarea>
          {errors.content && (
            <div className="invalid-feedback">{errors.content}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mood">Mood</label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="form-control"
          >
            <option value="positive">Positive 😊</option>
            <option value="neutral">Neutral 😐</option>
            <option value="negative">Negative 😞</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="form-control"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary btn-sm"
            >
              Add Tag
            </button>
          </div>

          <div className="tags-container">
            {formData.tags.map((tag, index) => (
              <div key={index} className="tag-item">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="btn-remove-tag"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Entry"
              : "Create Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalForm;
