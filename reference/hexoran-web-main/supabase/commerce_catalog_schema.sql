-- ==============================================================================
-- COMPREHENSIVE COMMERCE SCHEMA (PROPER V1)
-- Rationale: Fully normalized schema with Products, Plans, and Subscriptions.
-- ==============================================================================

-- 1. PRODUCTS CATALOG
-- Stores the high-level applications/offerings.
CREATE TABLE IF NOT EXISTS public.products (
    id text PRIMARY KEY, -- e.g. 'celato', 'stook' (Human readable IDs are fine here and easier for frontend)
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Seed Initial Products
INSERT INTO public.products (id, name, description, is_active)
VALUES 
    ('celato', 'Celato AI Copilot', 'AI powered interview assistant and coding tool.', true),
    ('stook', 'Stook Terminal', 'Institutional grade financial analytics.', false) -- Coming Soon
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;


-- 2. SUBSCRIPTIONS TABLE (Refined)
-- Links a User to a Product with a specific status.
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Who?
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- What? (Strict Foreign Key to Products)
    product_id text REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    
    -- Status details
    status text NOT NULL DEFAULT 'inactive', -- active, trialing, past_due, canceled, inactive
    tier text DEFAULT 'free',                -- pro, enterprise, free
     
    -- External Billing Link (Razorpay/Stripe)
    external_subscription_id text,           -- sub_123456...
    external_plan_id text,                   -- plan_123456...
    
    -- Timing
    current_period_start timestamptz,
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Enforcement: One subscription per product per user.
    UNIQUE(user_id, product_id)
);

-- 3. Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Products are public/readable by everyone (Authenticated or Anon)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (true);

-- Subscriptions are private to the user
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);


-- 4. Helper Function to get Access Level
-- Example: select get_product_access(auth.uid(), 'celato');
CREATE OR REPLACE FUNCTION get_product_access(
    lookup_user_id uuid, 
    lookup_product_id text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    sub_status text;
    sub_tier text;
BEGIN
    SELECT status, tier
    INTO sub_status, sub_tier
    FROM public.subscriptions
    WHERE user_id = lookup_user_id 
    AND product_id = lookup_product_id;
    
    -- Logic: If active or valid period, return the tier. Else free.
    IF sub_status = 'active' OR sub_status = 'trialing' THEN
        RETURN sub_tier;
    END IF;
    
    RETURN 'free';
END;
$$;
