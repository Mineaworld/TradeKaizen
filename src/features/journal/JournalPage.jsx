import React, { useState, useEffect } from "react";
import {
  fetchJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
} from "../../api/journalAPI";
import JournalEntry from "./JournalEntry";
import JournalForm from "./JournalForm";
import "./Journal.css";

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [editingEntry, setEditingEntry] = useState(null);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await fetchJournalEntries();
      setEntries(data);
      applyFilters(data, searchTerm, selectedTag, sortOrder);
    } catch (err) {
      console.error("Error fetching journal entries:", err);
      setError(err.message);
      setEntries([]);
      setFilteredEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    applyFilters(entries, searchTerm, selectedTag, sortOrder);
  }, [searchTerm, selectedTag, sortOrder]);

  const applyFilters = (entries, search, tag, order) => {
    // Make sure entries is an array before proceeding
    let filtered = Array.isArray(entries) ? [...entries] : [];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          (entry.title?.toLowerCase() || "").includes(searchLower) ||
          (entry.content?.toLowerCase() || "").includes(searchLower)
      );
    }

    // Apply tag filter
    if (tag) {
      filtered = filtered.filter(
        (entry) => Array.isArray(entry.tags) && entry.tags.includes(tag)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredEntries(filtered);
  };

  const handleCreateEntry = async (entryData) => {
    try {
      const newEntry = await createJournalEntry(entryData);
      setEntries([...entries, newEntry]);
      applyFilters([...entries, newEntry], searchTerm, selectedTag, sortOrder);
      setShowForm(false);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteJournalEntry(entryId);
      const updatedEntries = entries.filter((entry) => entry.id !== entryId);
      setEntries(updatedEntries);
      applyFilters(updatedEntries, searchTerm, selectedTag, sortOrder);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get unique tags for filter dropdown
  const allTags = Array.from(
    new Set(
      (Array.isArray(entries) ? entries : []).flatMap((entry) =>
        Array.isArray(entry.tags) ? entry.tags : []
      )
    )
  );

  // Render loading state
  if (loading) {
    return (
      <div className="journal-page loading">
        <h2>Journal</h2>
        <p>Loading journal entries...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="journal-page error">
        <h2>Journal</h2>
        <p>Error: {error}</p>
        <button onClick={() => loadEntries()} className="btn btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="journal-page">
      <div className="journal-header">
        <h2>Trading Journal</h2>
        <button
          onClick={() => {
            setEditingEntry(null);
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "New Entry"}
        </button>
      </div>

      {showForm && (
        <JournalForm
          onSubmit={handleCreateEntry}
          initialData={editingEntry}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="journal-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="tag-filter"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-control"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredEntries && filteredEntries.length > 0 ? (
        <div className="entries-container">
          {filteredEntries.map((entry) => (
            <JournalEntry
              key={entry.id}
              entry={entry}
              onEdit={() => handleEditEntry(entry)}
              onDelete={() => handleDeleteEntry(entry.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No journal entries found. Create your first entry!</p>
          {entries.length > 0 && filteredEntries.length === 0 && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTag("");
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
