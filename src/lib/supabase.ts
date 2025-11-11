/**
 * Supabase Client Configuration
 * Creates and exports a configured Supabase client instance
 */

import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Development warning if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase credentials not found. ' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
    'are set in .env.local'
  )
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


