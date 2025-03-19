-- Create custom trading pairs table
CREATE TABLE IF NOT EXISTS custom_trading_pairs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pair TEXT NOT NULL,
  UNIQUE(user_id, pair)
);

-- Add RLS policies
ALTER TABLE custom_trading_pairs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom pairs" 
ON custom_trading_pairs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom pairs" 
ON custom_trading_pairs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom pairs" 
ON custom_trading_pairs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom pairs" 
ON custom_trading_pairs FOR DELETE 
USING (auth.uid() = user_id); 