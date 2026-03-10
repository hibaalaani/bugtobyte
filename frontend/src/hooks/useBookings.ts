import { useState, useEffect, useCallback } from 'react'
import { supabase, Appointment } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useBookings() {
  const { user }  = useAuth()
  const [bookings, setBookings] = useState<Appointment[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error: err } = await supabase
      .from('appointments')
      .select(`*, courses(title), kids(name)`)
      .eq('parent_id', user.id)
      .order('appt_date', { ascending: true })
      .order('time_slot',  { ascending: true })

    if (err) { setError(err.message) }
    else {
      setBookings(
        (data ?? []).map((b: any) => ({
          ...b,
          course_title: b.courses?.title ?? null,
          kid_name:     b.kids?.name    ?? null,
        }))
      )
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const cancelBooking = async (id: string) => {
    // DELETE the row so the slot is freed for re-booking (unique constraint on date+time)
    await supabase.from('appointments').delete().eq('id', id).eq('parent_id', user!.id)
    fetchBookings()
  }

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking }
}
