-- Similarly standardize trade_tags
ALTER TABLE trade_tags RENAME COLUMN IF EXISTS tag_id TO tag_id;
ALTER TABLE trade_tags RENAME COLUMN IF EXISTS trade_id TO trade_id;
-- Ensure proper constraints
ALTER TABLE trade_tags ADD CONSTRAINT IF NOT EXISTS pk_trade_tags PRIMARY KEY (trade_id, tag_id);
ALTER TABLE trade_tags ADD CONSTRAINT IF NOT EXISTS fk_trade_tags_trade FOREIGN KEY (trade_id) REFERENCES trades(id) ON DELETE CASCADE;
ALTER TABLE trade_tags ADD CONSTRAINT IF NOT EXISTS fk_trade_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
