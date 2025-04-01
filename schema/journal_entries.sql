-- Ensure journal entries can reference trades (optional relationship)
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_id UUID REFERENCES trades(id) ON DELETE SET NULL;
-- Add more metadata fields that are useful for analysis
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS mood_before VARCHAR(50);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS mood_after VARCHAR(50);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS self_rating SMALLINT CHECK (self_rating BETWEEN 1 AND 10);

-- Add detailed trade metrics
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS risk_reward_ratio DECIMAL(10,2);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS stop_loss DECIMAL(20,8);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS take_profit DECIMAL(20,8);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS risk_per_trade DECIMAL(10,2);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS commission_fees DECIMAL(10,2);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS slippage DECIMAL(10,2);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_quality_score SMALLINT CHECK (trade_quality_score BETWEEN 1 AND 10);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS market_conditions TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_timeframe VARCHAR(20);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_execution_rating SMALLINT CHECK (trade_execution_rating BETWEEN 1 AND 10);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_management_notes TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS trade_exit_reason TEXT;
