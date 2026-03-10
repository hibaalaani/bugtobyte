import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '../lib/supabase'
import { transporter } from '../lib/email'

const router = Router()

const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(3000),
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = schema.parse(req.body)

    // Supabase stores the message (with RLS policy allowing public insert)
    await supabaseAdmin.from('contact_messages').insert(body)

    // Email admin
    transporter.sendMail({
      from:    process.env.FROM_EMAIL,
      to:      process.env.ADMIN_EMAIL,
      subject: `💬 Contact: ${body.name} — ${body.subject ?? 'No subject'}`,
      html:    `<p><strong>${body.name}</strong> (${body.email})</p><p>${body.message}</p>`,
    }).catch(() => {})

    res.status(201).json({ success: true })
  } catch (err: any) {
    if (err.name === 'ZodError') { res.status(400).json({ error: err.flatten() }); return }
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
