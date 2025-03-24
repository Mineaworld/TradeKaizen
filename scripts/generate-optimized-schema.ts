import { supabase } from "../lib/supabase";
import fs from "fs";
import path from "path";

// Function to generate optimized schema SQL
async function generateOptimizedSchema() {
  try {
    console.log("Generating optimized schema...");

    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from("pg_tables")
      .select("schemaname, tablename")
      .eq("schemaname", "public");

    if (tablesError) throw tablesError;

    let schemaOutput = "";

    // Process each table
    for (const table of tables || []) {
      const tableName = table.tablename;
      schemaOutput += `\n-- Table: ${tableName}\n`;

      // Get columns for each table
      const { data: columns } = await supabase.rpc("get_columns_info", {
        table_name: tableName,
      });

      // Generate column recommendations
      if (tableName === "strategies" && columns && columns.length > 10) {
        schemaOutput += generateStrategyOptimizations();
      }

      if (tableName === "journal_entries") {
        schemaOutput += generateJournalEntryOptimizations();
      }

      if (tableName === "trades" && columns && columns.length > 10) {
        schemaOutput += generateTradeOptimizations();
      }
    }

    // Add index recommendations
    schemaOutput += generateIndexRecommendations();

    // Write the output to a file
    const outputDir = path.join(__dirname, "../schema");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, "optimized-schema.sql"),
      schemaOutput
    );
    console.log("Optimized schema generated at schema/optimized-schema.sql");
  } catch (error) {
    console.error("Error generating optimized schema:", error);
  }
}

// Helper functions to generate specific optimizations
function generateStrategyOptimizations() {
  return `
-- Strategy table optimizations
-- Consider creating a strategy_metrics table for flexible metric tracking
CREATE TABLE IF NOT EXISTS strategy_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  metric_name VARCHAR(50) NOT NULL,
  metric_value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_strategy_metrics_strategy_id ON strategy_metrics(strategy_id);
`;
}

function generateJournalEntryOptimizations() {
  return `
-- Journal entries optimizations
-- Add emotional state tracking
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS emotional_state VARCHAR(50);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS lesson_learned TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS follow_up_action TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
`;
}

function generateTradeOptimizations() {
  return `
-- Trades table optimizations
-- Add useful analytics fields
ALTER TABLE trades ADD COLUMN IF NOT EXISTS risk_reward_ratio DECIMAL;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS executed_strategy_id UUID REFERENCES strategies(id);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS deviation_from_plan TEXT;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS position_size_percentage DECIMAL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol) WHERE symbol IS NOT NULL;
`;
}

function generateIndexRecommendations() {
  return `
-- General index recommendations
-- User-specific data lookups
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_trading_pairs_user_id ON custom_trading_pairs(user_id);

-- Performance improvement for frequently accessed data
CREATE INDEX IF NOT EXISTS idx_journal_tags_journal_entry_id ON journal_tags(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_trade_tags_trade_id ON trade_tags(trade_id);
CREATE INDEX IF NOT EXISTS idx_trade_images_trade_id ON trade_images(trade_id);
`;
}

// Execute the function
generateOptimizedSchema();
