import { Router, Request, Response } from 'express'
import { getBotReply, saveMessage } from '../lib/chatbot'
import { sendWhatsAppMessage } from '../lib/whatsapp'
import { isConversationPaused } from '../lib/takeover'

const router = Router()

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || ''

// Meta calls this once (and whenever you re-verify) to confirm you own the callback URL
router.get('/', (req: Request, res: Response) => {
  const mode      = req.query['hub.mode']
  const token     = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge)
    return
  }
  res.sendStatus(403)
})

// Meta posts every incoming WhatsApp message here
router.post('/', async (req: Request, res: Response) => {
  // Acknowledge immediately — Meta retries the delivery if it doesn't get a fast 200
  res.sendStatus(200)

  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    if (!message || message.type !== 'text') return

    const from = message.from as string // sender's phone number — doubles as the conversation key
    const text = message.text?.body as string

    // An admin has taken over this conversation manually — log the message
    // for the inbox to show, but don't let the bot jump in and reply too.
    if (await isConversationPaused(from)) {
      await saveMessage('whatsapp', from, 'user', text)
      return
    }

    const reply = await getBotReply('whatsapp', from, text)
    await sendWhatsAppMessage(from, reply)
  } catch (err: any) {
    console.error('[whatsapp webhook] error:', err.message)
  }
})

export default router
