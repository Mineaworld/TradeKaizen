-- Create strategies table if it doesn't exist
CREATE TABLE IF NOT EXISTS strategies (
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

-- Create the custom_trading_pairs table if it doesn't exist
CREATE TABLE IF NOT EXISTS custom_trading_pairs (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pair VARCHAR(100) NOT NULL,
  UNIQUE(user_id, pair)
);

ALTER TABLE custom_trading_pairs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trading pairs"
  ON custom_trading_pairs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trading pairs"
  ON custom_trading_pairs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading pairs"
  ON custom_trading_pairs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trading pairs"
  ON custom_trading_pairs
  FOR DELETE
  USING (auth.uid() = user_id);
