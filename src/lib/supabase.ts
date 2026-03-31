import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Browser client (uses anon key, respects RLS)
let _supabase: SupabaseClient | null = null
export function getSupabase() {
  if (!_supabase && supabaseUrl && supabaseAnonKey) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  if (!_supabase) throw new Error('Supabase not configured')
  return _supabase
}

// Server client (uses service role key, bypasses RLS)
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey || !supabaseUrl) throw new Error('Supabase service role not configured')
  return createClient(supabaseUrl, serviceKey)
}
