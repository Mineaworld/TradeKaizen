import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const JournalEntry = ({ entry, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Safety check for undefined entry
  if (!entry) {
    return (
      <div className="journal-entry error">Invalid journal entry data</div>
    );
  }

  const {
    id,
    title,
    date,
    content,
    tags = [],
    mood = "neutral",
    trades = [],
  } = entry;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(id);
    } else {
      setConfirmDelete(true);
      // Reset confirm state after 3 seconds
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
  };

  // Format date relative to now (e.g. "2 days ago")
  const formattedDate = date
    ? formatDistanceToNow(new Date(date), { addSuffix: true })
    : "No date";

  // Get mood icon
  const getMoodIcon = (mood) => {
    switch (mood) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
        return "😐";
      default:
        return "";
    }
  };

  return (
    <div className={`journal-entry ${expanded ? "expanded" : ""}`}>
      <div className="entry-header" onClick={toggleExpanded}>
        <div className="entry-title-row">
          <h3>{title || "Untitled Entry"}</h3>
          <span className="mood-indicator">{getMoodIcon(mood)}</span>
        </div>
        <p className="entry-date">{formattedDate}</p>
      </div>

      <div className={`entry-content ${expanded ? "show" : ""}`}>
        <div className="entry-body">{content || "No content"}</div>

        {expanded && Array.isArray(trades) && trades.length > 0 && (
          <div className="entry-trades">
            <h4>Related Trades</h4>
            <ul className="trades-list">
              {trades.map((trade, index) => (
                <li key={index} className={`trade-item ${trade.result || ""}`}>
                  <span className="trade-symbol">{trade.symbol}</span>
                  <span className="trade-result">{trade.result}</span>
                  <span className="trade-pnl">{trade.pnl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {Array.isArray(tags) && tags.length > 0 && (
        <div className="entry-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="entry-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(entry);
          }}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          className={`btn btn-delete ${confirmDelete ? "confirm" : ""}`}
        >
          {confirmDelete ? "Confirm Delete" : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default JournalEntry;
