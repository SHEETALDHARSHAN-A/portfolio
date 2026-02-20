import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables')
}

// Configuration for the Celato Product Project
// This project handles Celato-specific data (e.g., Code implementations, specific assets).
// Authentication is now handled by the Hexoran client (src/lib/hexoran.ts).

export const celatoSupabase = createClient(supabaseUrl, supabaseAnonKey);

// Legacy export for backward compatibility during migration
export const supabase = celatoSupabase;