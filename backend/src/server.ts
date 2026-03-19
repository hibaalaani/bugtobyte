// ================================================================
//  BugToByte Academy v2 — Express Backend
//  Auth is handled by Supabase. This server handles:
//    - Email notifications
//    - Stripe webhooks (payments)
//    - Admin operations (service-role key)
// ================================================================

import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import morgan  from 'morgan'
import dotenv  from 'dotenv'
import Stripe  from 'stripe'
import { supabaseAdmin } from './lib/supabase'
import { transporter }   from './lib/email'
import bookingsRouter    from './routes/bookings'
import contactRouter     from './routes/contact'
import { requireAuth }   from './middleware/auth'

dotenv.config()

const app = express()

// ── Stripe webhook must come before body parser ───────────────
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' })
  const sig    = req.headers['stripe-signature'] as string

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.metadata?.booking_id) {
        await supabaseAdmin.from('appointments').update({
          payment_status:         'paid',
          stripe_payment_intent:  session.payment_intent as string,
          status:                 'confirmed',
        }).eq('id', session.metadata.booking_id)
      }
    }

    res.json({ received: true })
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

// ── Middleware ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

// ── Health ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/bookings', bookingsRouter)
app.use('/api/contact',  contactRouter)

// ── Stripe checkout session (auth required) ───────────────────
app.post('/api/stripe/create-checkout', requireAuth, async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' })
  const { booking_id, course_id } = req.body

  if (!booking_id) { res.status(400).json({ error: 'booking_id required' }); return }

  // Verify the booking belongs to the authenticated user
  const { data: appt } = await supabaseAdmin
    .from('appointments')
    .select('id, parent_id')
    .eq('id', booking_id)
    .single()

  if (!appt || appt.parent_id !== req.userId) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  let priceAmount = 2999
  let productName = 'Demo Lesson'

  if (course_id) {
    const { data: course } = await supabaseAdmin.from('courses').select('title,price_usd').eq('id', course_id).single()
    if (course) { priceAmount = Math.round(Number(course.price_usd) * 100); productName = course.title }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'payment',
      line_items: [{ price_data: { currency: 'eur', product_data: { name: productName }, unit_amount: priceAmount}, quantity: 1 }],
      metadata:    { booking_id },
      success_url: `${process.env.CLIENT_ORIGIN}/?payment=success`,
      cancel_url:  `${process.env.CLIENT_ORIGIN}/?payment=cancelled`,
    })

    await supabaseAdmin.from('appointments').update({ stripe_session_id: session.id, amount_paid: priceAmount / 100 }).eq('id', booking_id)
    res.json({ url: session.url })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 5000

// Verify DB connection
void (async () => {
  try {
    await supabaseAdmin.from('courses').select('count').single()
    console.log('✅  Supabase connected')
  } catch (err: any) {
    console.warn('⚠️   Supabase warning:', err.message)
  }
})()

// Verify mail
transporter.verify()
  .then(() => console.log('✅  Mail server ready'))
  .catch((e: Error) => console.warn('⚠️   Mail:', e.message))

app.listen(PORT, () => console.log(`🚀  BugToByte API running at http://localhost:${PORT}`))

export default app
