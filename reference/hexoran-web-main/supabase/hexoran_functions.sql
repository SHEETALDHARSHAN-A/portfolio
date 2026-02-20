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
