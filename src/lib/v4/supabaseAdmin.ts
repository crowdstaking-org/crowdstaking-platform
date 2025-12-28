import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('[v4] Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!serviceRoleKey) {
  console.warn('[v4] Missing SUPABASE_SERVICE_ROLE_KEY – falling back to anon key (limited writes)')
}

export const supabaseAdmin = createClient(
  supabaseUrl ?? '',
  (serviceRoleKey && serviceRoleKey !== '') ? serviceRoleKey : (anonKey ?? '')
)

