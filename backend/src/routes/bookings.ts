import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { sendBookingConfirmation } from '../lib/email'
import { requireAuth } from '../middleware/auth'

const router = Router()

// POST /api/bookings/confirm — send confirmation email after booking
// Requires auth; verifies the booking belongs to the requesting user
router.post('/confirm', requireAuth, async (req: Request, res: Response) => {
  const { bookingId } = req.body
  if (!bookingId) { res.status(400).json({ error: 'bookingId required' }); return }

  const { data: booking, error } = await supabaseAdmin
    .from('appointments')
    .select(`*, profiles(full_name, email), courses(title)`)
    .eq('id', bookingId)
    .single()

  if (error || !booking) { res.status(404).json({ error: 'Booking not found' }); return }

  // Ownership check — only the booking owner can trigger confirmation
  if (booking.parent_id !== req.userId) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  // Fallback: get email directly from auth.users if profiles.email is missing
  let parentEmail: string = booking.profiles?.email ?? ''
  if (!parentEmail) {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(booking.parent_id)
    parentEmail = authUser?.user?.email ?? ''
  }

  try {
    await sendBookingConfirmation({
      parentName:  booking.profiles?.full_name ?? 'Parent',
      parentEmail,
      date:        booking.appt_date,
      time:        booking.time_slot?.slice(0, 5),
      courseName:  booking.courses?.title,
      zoomLink:    booking.zoom_link,
      bookingId:   booking.id,
    })

    await supabaseAdmin.from('appointments').update({ confirmation_sent: true }).eq('id', bookingId)
    res.json({ success: true })
  } catch (err: any) {
    console.error('Email error:', err)
    res.status(500).json({ error: 'Email failed', detail: err.message })
  }
})

// GET /api/bookings/availability?date=YYYY-MM-DD — public, returns only taken time slots
router.get('/availability', async (req: Request, res: Response) => {
  const { date } = req.query as { date: string }
  if (!date) { res.status(400).json({ error: 'date required' }); return }

  const { data } = await supabaseAdmin
    .from('appointments')
    .select('time_slot')
    .eq('appt_date', date)
    .neq('status', 'cancelled')

  res.json({ date, bookedSlots: (data ?? []).map((r: any) => r.time_slot.slice(0, 5)) })
})

export default router
