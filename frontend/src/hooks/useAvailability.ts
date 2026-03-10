import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function useAvailability(date: string | null) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading,     setLoading]     = useState(false)

  useEffect(() => {
    if (!date) { setBookedSlots([]); return }

    setLoading(true)

    const fetchSlots = async () => {
      // 1. Try appointments table directly (works with existing RLS "Anyone can read booked slots")
      const { data: apptData, error: apptError } = await supabase
        .from('appointments')
        .select('time_slot')
        .eq('appt_date', date)
        .neq('status', 'cancelled')

      if (!apptError && apptData && apptData.length >= 0) {
        const slots = apptData.map((r: { time_slot: string }) => r.time_slot.slice(0, 5))
        console.log('[availability] appointments query ok →', slots)
        setBookedSlots(slots)
        setLoading(false)
        return
      }

      console.warn('[availability] appointments query failed:', apptError?.message)

      // 2. Try booked_slots view (exists after running updated schema.sql)
      const { data: viewData, error: viewError } = await supabase
        .from('booked_slots')
        .select('time_slot')
        .eq('appt_date', date)

      if (!viewError && viewData) {
        const slots = viewData.map((r: { time_slot: string }) => r.time_slot.slice(0, 5))
        console.log('[availability] booked_slots view ok →', slots)
        setBookedSlots(slots)
        setLoading(false)
        return
      }

      console.warn('[availability] view query failed:', viewError?.message)

      // 3. Last resort: backend API
      try {
        const res = await fetch(`${API}/api/bookings/availability?date=${date}`)
        const json = await res.json()
        console.log('[availability] backend fallback →', json.bookedSlots)
        setBookedSlots(json.bookedSlots ?? [])
      } catch (e) {
        console.error('[availability] all sources failed:', e)
        setBookedSlots([])
      }
      setLoading(false)
    }

    fetchSlots()

    const channel = supabase
      .channel(`availability:${date}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments', filter: `appt_date=eq.${date}` },
        () => { fetchSlots() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [date])

  return { bookedSlots, loading }
}
