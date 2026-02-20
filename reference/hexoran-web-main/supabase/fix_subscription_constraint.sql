-- Migration: Add Unique Constraint for Multi-Product Subscriptions
-- Required for ON CONFLICT (user_id, product_id) DO UPDATE

-- 1. Ensure user_id and product_id combination is unique
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_user_product_key UNIQUE (user_id, product_id);

-- 2. (Optional but Safe) Create index for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_product 
ON subscriptions(user_id, product_id);
