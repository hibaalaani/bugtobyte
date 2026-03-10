import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Ensure .env is loaded before reading variables
dotenv.config()

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')

// Service-role client — full DB access, only use server-side
export const supabaseAdmin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})
