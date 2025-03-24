-- The strategies table has 14 columns which is quite a lot
-- Suggestion: Split into core strategy data and strategy_metrics

-- First, create a new strategy_metrics table
CREATE TABLE IF NOT EXISTS strategy_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  value VARCHAR(255) NOT NULL,
  data_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Then modify the strategies table to focus on core attributes
ALTER TABLE strategies DROP COLUMN IF EXISTS metric1;
ALTER TABLE strategies DROP COLUMN IF EXISTS metric2;
-- Add additional DROP statements for metrics that should be moved to strategy_metrics
-- Preserve essential columns: id, name, description, user_id, type, created_at, updated_at
