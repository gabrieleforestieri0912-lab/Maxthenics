import { getSupabase } from './supabase'

export default async function dbConnect() {
  return getSupabase()
}
