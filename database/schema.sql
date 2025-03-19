-- First, drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS journal_tags;
DROP TABLE IF EXISTS trade_images; 
DROP TABLE IF EXISTS trade_tags;
DROP TABLE IF EXISTS trades CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS emotions CASCADE;
DROP TABLE IF EXISTS strategies CASCADE;
DROP TABLE IF EXISTS journal_screenshots;

-- Now create tables in the correct order

-- Emotions table (if needed in your schema)
CREATE TABLE emotions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategies table (if needed in your schema)
CREATE TABLE strategies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT CHECK (mood IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
  -- Add trading fields
  trade_pair TEXT,
  trade_direction TEXT CHECK (trade_direction IN ('LONG', 'SHORT')),
  entry_price DECIMAL(10,2),
  exit_price DECIMAL(10,2),
  position_size DECIMAL(10,2),
  trade_outcome TEXT CHECK (trade_outcome IN ('WIN', 'LOSS', 'BREAKEVEN')),
  trade_duration INTEGER,
  strategy_id INTEGER REFERENCES strategies(id) ON DELETE SET NULL,
  risk_reward_ratio DECIMAL(10,2),
  net_pnl DECIMAL(10,2),
  trade_setup TEXT,
  trade_notes TEXT,
  emotions TEXT,
  trade_mistakes TEXT,
  trade_lessons TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades table (with potential references to emotions and strategies)
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER REFERENCES journal_entries(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  entry_price DECIMAL(10,2),
  exit_price DECIMAL(10,2),
  position_size DECIMAL(10,2),
  trade_direction TEXT CHECK (trade_direction IN ('LONG', 'SHORT')),
  profit_loss DECIMAL(10,2),
  entry_date TIMESTAMP WITH TIME ZONE,
  exit_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('OPEN', 'CLOSED')) DEFAULT 'OPEN',
  emotion_id INTEGER REFERENCES emotions(id) ON DELETE SET NULL,
  strategy_id INTEGER REFERENCES strategies(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade images table
CREATE TABLE trade_images (
  id SERIAL PRIMARY KEY,
  trade_id INTEGER REFERENCES trades(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal screenshots table
CREATE TABLE journal_screenshots (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER REFERENCES journal_entries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for journal entries and tags
CREATE TABLE journal_tags (
  journal_id INTEGER REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_id, tag_id)
);

-- Junction table for trades and tags
CREATE TABLE trade_tags (
  trade_id INTEGER REFERENCES trades(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (trade_id, tag_id)
);

-- Add Row Level Security policies
ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_screenshots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own journal entries" 
  ON journal_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" 
  ON journal_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Trade policies
CREATE POLICY "Users can view their own trades" 
  ON trades FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = trades.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own trades" 
  ON trades FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = trades.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own trades" 
  ON trades FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = trades.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own trades" 
  ON trades FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = trades.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

-- Emotion and Strategy policies (shared across users)
CREATE POLICY "All users can view emotions" 
  ON emotions FOR SELECT 
  USING (true);

CREATE POLICY "All users can view strategies" 
  ON strategies FOR SELECT 
  USING (true);

-- Tags policies (shared across users)
CREATE POLICY "All users can view tags" 
  ON tags FOR SELECT 
  USING (true);

-- Trade images policies
CREATE POLICY "Users can view their own trade images" 
  ON trade_images FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM trades 
    JOIN journal_entries ON trades.journal_id = journal_entries.id
    WHERE trade_images.trade_id = trades.id 
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own trade images" 
  ON trade_images FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM trades 
    JOIN journal_entries ON trades.journal_id = journal_entries.id
    WHERE trade_images.trade_id = trades.id 
    AND journal_entries.user_id = auth.uid()
  ));

-- Journal tags policies
CREATE POLICY "Users can manage their own journal tags" 
  ON journal_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = journal_tags.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

-- Trade tags policies
CREATE POLICY "Users can manage their own trade tags" 
  ON trade_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM trades 
    JOIN journal_entries ON trades.journal_id = journal_entries.id
    WHERE trade_tags.trade_id = trades.id 
    AND journal_entries.user_id = auth.uid()
  ));

-- Journal screenshots policies
CREATE POLICY "Users can view their own journal screenshots" 
  ON journal_screenshots FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = journal_screenshots.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own journal screenshots" 
  ON journal_screenshots FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = journal_screenshots.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own journal screenshots" 
  ON journal_screenshots FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM journal_entries 
    WHERE journal_entries.id = journal_screenshots.journal_id 
    AND journal_entries.user_id = auth.uid()
  ));
