-- Add constraints for improved data integrity
ALTER TABLE journal_entries ADD CONSTRAINT IF NOT EXISTS check_profit_loss CHECK (profit_loss IS NULL OR profit_loss::text ~ '^-?\d+(\.\d+)?$');
ALTER TABLE trades ADD CONSTRAINT IF NOT EXISTS check_trade_direction CHECK (direction IN ('LONG', 'SHORT'));
ALTER TABLE trades ADD CONSTRAINT IF NOT EXISTS check_trade_status CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED', 'PENDING'));
