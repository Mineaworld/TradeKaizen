-- Drop the old strategies table if it exists
DROP TABLE IF EXISTS strategies CASCADE;

-- Create the updated strategies table
CREATE TABLE strategies (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rules TEXT,
  timeframes TEXT[],
  markets TEXT[],
  indicators TEXT[],
  win_rate NUMERIC,
  risk_reward NUMERIC,
  average_profit NUMERIC,
  average_loss NUMERIC
);

-- Add RLS policies
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own strategies"
  ON strategies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own strategies"
  ON strategies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies"
  ON strategies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies"
  ON strategies
  FOR DELETE
  USING (auth.uid() = user_id); 