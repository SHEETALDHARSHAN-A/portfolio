import { createClient } from '@supabase/supabase-js';

// Configuration for the central Hexoran Management Project
// This project handles Authentication, User Profiles, and Global Billing.

const HEXORAN_SUPABASE_URL = process.env.NEXT_PUBLIC_HEXORAN_SUPABASE_URL || 'https://cftsswljzajozubekyjy.supabase.co';
const HEXORAN_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_HEXORAN_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdHNzd2xqemFqb3p1YmVreWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzMwMDcsImV4cCI6MjA4MTMwOTAwN30.9UsjtX-AN3saVvvPWir3K-eal4VIH0b9VlvGKQIwk0w';

if (HEXORAN_SUPABASE_URL === 'INSERT_HEXORAN_URL_HERE') {
    console.warn('Hexoran Supabase URL is missing. Please set NEXT_PUBLIC_HEXORAN_SUPABASE_URL.');
}

export const hexoranSupabase = createClient(HEXORAN_SUPABASE_URL, HEXORAN_SUPABASE_ANON_KEY);
