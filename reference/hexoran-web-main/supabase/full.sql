-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  subscription_status text default 'free', -- 'active', 'past_due', 'cancelled', 'free'
  subscription_tier text default 'free',   -- 'code', 'live', 'pro', 'free'
  subscription_id text,                    -- Razorpay Subscription ID
  current_period_end timestamptz,
  device_id text,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies (Allow users to read their own data)
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- HEXORAN DATABASE FUNCTIONS
-- Run this script in the SQL Editor of your Hexoran Supabase Project.
-- ==============================================================================

-- 1. RPC: check_email_exists
-- Used by: Celato Electron App (Smart Auth)
-- Purpose: Checks if an email is already registered to switch between Sign In / Sign Up.
-- Security: SECURITY DEFINER (Runs with elevated privileges to check auth.users)
create or replace function check_email_exists(email_input text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (select 1 from auth.users where email = email_input);
end;
$$;

-- 2. RPC: get_user_tier
-- Used by: Celato Electron App (Subscription Check)
-- Purpose: Returns the subscription tier for a given user ID.
create or replace function get_user_tier(user_id_input uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  tier_val text;
begin
  select subscription_tier into tier_val from public.profiles where id = user_id_input;
  return coalesce(tier_val, 'free');
end;
$$;

-- 3. Trigger: handle_new_user (Ensure this exists)
-- Purpose: Creates a profile row when a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid conflicts, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. RLS Policy Fixes
-- (Policies already exist, so we skip creating them to avoid errors)
-- If you need to recreate them, you can drop them first:
-- drop policy if exists "Users can view own profile" on profiles;
-- drop policy if exists "Users can update own profile" on profiles;
-- ==============================================================================
-- STRICT PROFILE VERIFICATION & UNIQUENESS
-- Run this script in the SQL Editor of your Hexoran Supabase Project to apply changes.
-- ==============================================================================

-- 1. Ensure Email Uniqueness in Profiles Table
-- This prevents multiple profiles from claiming the same email address.
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_email_key UNIQUE (email);


-- 2. Redefine 'handle_new_user' to support Deferred Creation
-- This function will now be smart enough to handle both INSERT (OAuth) and UPDATE (Email Verification).

CREATE OR REPLACE FUNCTION public.handle_verified_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Logic: Only proceed if the user is VERIFIED.
  -- Case A: UPDATE - User clicked email verification link (OLD was unverified, NEW is verified)
  -- Case B: INSERT - User signed up with a pre-verified method (e.g., Google OAuth)
  
  IF (TG_OP = 'INSERT' AND NEW.email_confirmed_at IS NOT NULL) OR 
     (TG_OP = 'UPDATE' AND OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
     
     INSERT INTO public.profiles (id, email, full_name, avatar_url)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
       NEW.raw_user_meta_data->>'avatar_url'
     )
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       full_name = EXCLUDED.full_name,
       avatar_url = EXCLUDED.avatar_url;
       
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Update Triggers on auth.users

-- A. Drop the old "Create on Insert" trigger if it exists (legacy behavior)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- B. Create Trigger for INSERT (Handles OAuth which is verified immediately)
CREATE TRIGGER on_auth_user_created_verified
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_verified_user();

-- C. Create Trigger for UPDATE (Handles Email Verification flow)
CREATE TRIGGER on_auth_user_updated_verification
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_verified_user();

-- ==============================================================================
-- NOTE: 
-- Existing unverified users will NOT have profiles created until they verify.
-- Users who are already verified but missing profiles won't be backfilled automatically by this trigger 
-- unless their user record is updated again.
-- ==============================================================================
-- ==============================================================================
-- MULTI-PRODUCT SUBSCRIPTION SCHEMA
-- Rationale: Decouple "Who you are" (Profile) from "What you own" (Subscriptions).
-- This allows one user to have independent statuses for Celato, Stook, etc.
-- ==============================================================================

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Which product is this for? ('celato', 'stook', 'hexoran-bundle')
    product_id text NOT NULL, 
    
    -- Status of this specific product (active, trialing, past_due, canceled, unpaid)
    status text NOT NULL DEFAULT 'inactive',
    
    -- Specific plan details
    tier text DEFAULT 'free', -- e.g. 'pro', 'enterprise', 'free'
    plan_id text,             -- ID from Razorpay/Stripe (e.g., plan_RqPCH5fYA3pbs3)
    
    -- Billing Cycles
    current_period_start timestamptz,
    current_period_end timestamptz,
    
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Prevent duplicate active rows for the same product to simplify logic
    -- A user should have only one "row" per product, which we update.
    UNIQUE(user_id, product_id)
);

-- 2. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Service Role (Payment Webhook) can manage everything (Implicit, but good to know)

-- 4. Migration Helper (Optional)
-- If you want to migrate existing data from 'profiles' to 'subscriptions'
-- INSERT INTO public.subscriptions (user_id, product_id, status, tier)
-- SELECT id, 'celato', subscription_status, subscription_tier 
-- FROM public.profiles 
-- WHERE subscription_status IS NOT NULL;

-- 5. Helper Function: check_subscription(user_id, product_name)
-- Usage: select check_subscription(auth.uid(), 'celato')
CREATE OR REPLACE FUNCTION check_product_access(
    user_uuid uuid, 
    product_key text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_status text;
BEGIN
    SELECT status 
    INTO current_status
    FROM public.subscriptions
    WHERE user_id = user_uuid 
    AND product_id = product_key
    AND (current_period_end > now() OR status = 'active' OR status = 'lifetime');
    
    RETURN COALESCE(current_status, 'free');
END;
$$;
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
-- ==============================================================================
-- CLEANUP MIGRATION: PROFILES & FLOW OPTIMIZATION
-- Rationale: Removing legacy subscription columns from 'profiles'. 
-- Subscription data is now strictly hosted in the 'subscriptions' table.
-- ==============================================================================

-- 1. Remove Legacy Columns from Profiles
-- We use DO structure to avoid errors if columns don't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE public.profiles DROP COLUMN subscription_status;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE public.profiles DROP COLUMN subscription_tier;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE public.profiles DROP COLUMN stripe_customer_id;
    END IF;
    
    -- Add any other Legacy columns here
END $$;

-- 2. Ensure Profiles serves only Identity
-- The profiles table should only contain: id, email, full_name, avatar_url, created_at.

-- 3. Optimization Indexes for the New Flow
-- Since we will frequent query subscriptions by user+product, let's index it.
CREATE INDEX IF NOT EXISTS idx_subscriptions_lookup ON public.subscriptions(user_id, product_id);

-- 4. Updated 'check_subscription' RPC helper (Optional but recommended)
-- This makes it easy for the Electron App to check status with one RPC call.
CREATE OR REPLACE FUNCTION public.check_user_access(target_product text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    curr_user_id uuid;
BEGIN
    curr_user_id := auth.uid();
    
    SELECT json_build_object(
        'status', coalesce(status, 'inactive'),
        'tier', coalesce(tier, 'free')
    )
    INTO result
    FROM public.subscriptions
    WHERE user_id = curr_user_id AND product_id = target_product
    LIMIT 1;
    
    RETURN coalesce(result, json_build_object('status', 'inactive', 'tier', 'free'));
END;
$$;
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
-- Fix for missing columns in subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS external_subscription_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS external_plan_id text;
-- ==============================================================================
-- PROFILE REFINEMENT MIGRATION (Industry Standard)
-- Purpose: Remove legacy billing fields and add professional identity fields.
-- ==============================================================================
-- 1. ADD PROFESSIONAL IDENTITY FIELDS
-- These fields allow us to build a richer user experience (e.g. "Welcome, Senior Engineer at Google")
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text;
-- 2. REMOVE LEGACY BILLING FIELDS
-- We have successfully moved billing to the 'subscriptions' table.
-- Keeping these fields causes confusion and data inconsistency.
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS current_period_end;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS plan; -- specific legacy name if it exists
ALTER TABLE public.profiles DROP COLUMN IF EXISTS tier; -- specific legacy name if it exists
-- 3. ENSURE METADATA SYNC (Optional but recommended)
-- This function ensures that if a user updates their metadata, it syncs to this table.
-- (Assuming we might want this later, but for now just the columns are enough)
-- 4. SECURITY (Re-assert)
-- Ensure users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);
-- 5. STORAGE BUCKET FOR AVATARS
-- Create a new public bucket for avatars if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
-- Allow authenticated users to upload avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
-- ==============================================================================
-- MULTI-PRODUCT SUBSCRIPTION SCHEMA
-- Rationale: Decouple "Who you are" (Profile) from "What you own" (Subscriptions).
-- This allows one user to have independent statuses for Celato, Stook, etc.
-- ==============================================================================

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Which product is this for? ('celato', 'stook', 'hexoran-bundle')
    product_id text NOT NULL, 
    
    -- Status of this specific product (active, trialing, past_due, canceled, unpaid)
    status text NOT NULL DEFAULT 'inactive',
    
    -- Specific plan details
    tier text DEFAULT 'free', -- e.g. 'pro', 'enterprise', 'free'
    plan_id text,             -- ID from Razorpay/Stripe (e.g., plan_RqPCH5fYA3pbs3)
    
    -- Billing Cycles
    current_period_start timestamptz,
    current_period_end timestamptz,
    
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Prevent duplicate active rows for the same product to simplify logic
    -- A user should have only one "row" per product, which we update.
    UNIQUE(user_id, product_id)
);

-- 2. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Service Role (Payment Webhook) can manage everything (Implicit, but good to know)

-- 4. Migration Helper (Optional)
-- If you want to migrate existing data from 'profiles' to 'subscriptions'
-- INSERT INTO public.subscriptions (user_id, product_id, status, tier)
-- SELECT id, 'celato', subscription_status, subscription_tier 
-- FROM public.profiles 
-- WHERE subscription_status IS NOT NULL;

-- 5. Helper Function: check_subscription(user_id, product_name)
-- Usage: select check_subscription(auth.uid(), 'celato')
CREATE OR REPLACE FUNCTION check_product_access(
    user_uuid uuid, 
    product_key text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_status text;
BEGIN
    SELECT status 
    INTO current_status
    FROM public.subscriptions
    WHERE user_id = user_uuid 
    AND product_id = product_key
    AND (current_period_end > now() OR status = 'active' OR status = 'lifetime');
    
    RETURN COALESCE(current_status, 'free');
END;
$$;
-- Migration: Add Unique Constraint for Multi-Product Subscriptions
-- Required for ON CONFLICT (user_id, product_id) DO UPDATE

-- 1. Ensure user_id and product_id combination is unique
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_user_product_key UNIQUE (user_id, product_id);

-- 2. (Optional but Safe) Create index for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_product 
ON subscriptions(user_id, product_id);

-- Add columns to store banked subscription details
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS banked_tier text,
ADD COLUMN IF NOT EXISTS banked_days integer DEFAULT 0;

-- Comment on columns
COMMENT ON COLUMN public.subscriptions.banked_tier IS 'The tier of the subscription that was active before upgrading, to be resumed later.';
COMMENT ON COLUMN public.subscriptions.banked_days IS 'The number of days remaining on the banked subscription.';
-- Add JSONB column for storing multiple banked plans
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS banked_plans JSONB DEFAULT '{}'::jsonb;

-- Migrate existing data (if any) to the new structure
-- Example: 'code' -> 100 days becomes '{"code": 100}'
UPDATE public.subscriptions 
SET banked_plans = jsonb_build_object(banked_tier, banked_days)
WHERE banked_tier IS NOT NULL AND banked_days > 0;

-- Optional: Drop old columns if you want to clean up immediately
-- ALTER TABLE public.subscriptions DROP COLUMN banked_tier;
-- ALTER TABLE public.subscriptions DROP COLUMN banked_days;
ALTER TABLE public.subscriptions DROP COLUMN banked_tier;
ALTER TABLE public.subscriptions DROP COLUMN banked_days;
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS banked_plans JSONB DEFAULT '{}'::jsonb;
-- Migration: Single Device Enforcement
-- Creates active_sessions table for tracking and force signout via realtime
-- Run this in Hexoran Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.active_sessions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    device_name TEXT,
    logged_in_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for service_role (backend operations)
CREATE POLICY "Service role full access" ON public.active_sessions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Policy for authenticated users to read their own session
CREATE POLICY "Users read own session" ON public.active_sessions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Policy for authenticated users to upsert their own session
CREATE POLICY "Users manage own session" ON public.active_sessions
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable Realtime for force signout detection
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;
-- 1. Enable key extensions (just in case)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Schedule the job
select
  cron.schedule(
    'expire-subscriptions-hourly', -- The name of the job
    '0 * * * *',                   -- Runs every hour (at minute 0)
    $$
    select
      net.http_post(
          url:='https://cftsswljzajozubekyjy.supabase.co/functions/v1/cron-expire-subscriptions',
          headers:='{"Content-Type": "application/json"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );