import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { getBotReply } from '../lib/chatbot'

const router = Router()

const schema = z.object({
  sessionId: z.string().min(8).max(100),
  message:   z.string().min(1).max(2000),
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = schema.parse(req.body)
    const reply = await getBotReply('web', sessionId, message)
    res.json({ reply })
  } catch (err: any) {
    if (err.name === 'ZodError') { res.status(400).json({ error: err.flatten() }); return }
    console.error('[chat] error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
