import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true,
  },
})

// ── Database types ────────────────────────────────────────────
export interface Profile {
  id:         string
  full_name:  string | null
  email:      string | null
  phone:      string | null
  avatar_url: string | null
  role:       'parent' | 'admin'
  created_at: string
  updated_at: string
}

export interface Kid {
  id:          string
  parent_id:   string
  name:        string
  age:         number
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  interests:   string[]
  created_at:  string
}

export interface Course {
  id:             string
  title:          string
  slug:           string
  description:    string | null
  category:       string | null
  age_min:        number
  age_max:        number
  duration_weeks: number
  price_usd:      number
  thumbnail_url:  string | null
  is_active:      boolean
  sort_order:     number
}

export interface Appointment {
  id:                     string
  parent_id:              string
  kid_id:                 string | null
  course_id:              string | null
  appt_date:              string
  time_slot:              string
  timezone:               string
  status:                 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes:                  string | null
  zoom_link:              string | null
  payment_status:         'unpaid' | 'paid' | 'refunded'
  amount_paid:            number | null
  created_at:             string
  updated_at:             string
  // Joined fields
  course_title?:          string
  kid_name?:              string
}

export interface Testimonial {
  id:               string
  parent_name:      string
  kid_name:         string | null
  avatar_initials:  string | null
  rating:           number
  body:             string
  is_featured:      boolean
}
