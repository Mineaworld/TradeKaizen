-- Create junction table to track multiple emotions per journal entry
CREATE TABLE IF NOT EXISTS journal_emotions (
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  emotion_id UUID REFERENCES emotions(id) ON DELETE CASCADE,
  intensity SMALLINT CHECK (intensity BETWEEN 1 AND 10),
  notes TEXT,
  PRIMARY KEY (journal_entry_id, emotion_id)
);
