-- Standardize junction tables to follow same pattern
ALTER TABLE journal_tags RENAME COLUMN IF EXISTS tag_id TO tag_id;
ALTER TABLE journal_tags RENAME COLUMN IF EXISTS journal_id TO journal_entry_id;
-- Ensure proper constraints
ALTER TABLE journal_tags ADD CONSTRAINT IF NOT EXISTS pk_journal_tags PRIMARY KEY (journal_entry_id, tag_id);
ALTER TABLE journal_tags ADD CONSTRAINT IF NOT EXISTS fk_journal_tags_journal FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE;
ALTER TABLE journal_tags ADD CONSTRAINT IF NOT EXISTS fk_journal_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
