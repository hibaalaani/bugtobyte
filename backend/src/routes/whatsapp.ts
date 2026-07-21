import { Router, Request, Response } from 'express'
import { getBotReply } from '../lib/chatbot'

const router = Router()

const VERIFY_TOKEN    = process.env.WHATSAPP_VERIFY_TOKEN || ''
const ACCESS_TOKEN     = process.env.WHATSAPP_ACCESS_TOKEN || ''
const PHONE_NUMBER_ID  = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
const API_VERSION      = process.env.WHATSAPP_API_VERSION || 'v20.0'

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

    const from  = message.from as string // sender's phone number — doubles as the conversation key
    const text  = message.text?.body as string
    const reply = await getBotReply('whatsapp', from, text)

    await sendWhatsAppMessage(from, reply)
  } catch (err: any) {
    console.error('[whatsapp webhook] error:', err.message)
  }
})

async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error(`[whatsapp send] API error ${res.status}:`, JSON.stringify(body))
  }
}

export default router
