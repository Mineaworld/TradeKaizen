-- Ensure journal entries can reference trades (optional relationship)
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_id UUID REFERENCES trades(id) ON DELETE SET NULL;
-- Add more metadata fields that are useful for analysis
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS mood_before VARCHAR(50);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS mood_after VARCHAR(50);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS self_rating SMALLINT CHECK (self_rating BETWEEN 1 AND 10);
