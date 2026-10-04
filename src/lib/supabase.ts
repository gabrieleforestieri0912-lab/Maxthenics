import { createClient } from '@supabase/supabase-js'
import { getEnv } from './env'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    const env = getEnv()
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  }
  return supabaseClient
}
