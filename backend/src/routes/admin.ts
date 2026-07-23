import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { saveMessage } from '../lib/chatbot'
import { sendWhatsAppMessage } from '../lib/whatsapp'
import { setPaused } from '../lib/takeover'
import { requireAuth, requireAdminRole } from '../middleware/auth'

const router = Router()
router.use(requireAuth, requireAdminRole)

interface ConversationSummary {
  conversation_key: string
  last_message: string
  last_role: string
  last_at: string
  is_paused: boolean
}

// One row per WhatsApp conversation, newest activity first
router.get('/conversations', async (_req: Request, res: Response) => {
  const [{ data: messages }, { data: takeovers }] = await Promise.all([
    supabaseAdmin
      .from('chat_messages')
      .select('conversation_key, role, content, created_at')
      .eq('channel', 'whatsapp')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('conversation_takeovers')
      .select('conversation_key, is_paused')
      .eq('channel', 'whatsapp'),
  ])

  const pausedKeys = new Set((takeovers ?? []).filter((t) => t.is_paused).map((t) => t.conversation_key))

  const conversations = new Map<string, ConversationSummary>()
  for (const m of messages ?? []) {
    if (conversations.has(m.conversation_key)) continue // already have the newest message for this key
    conversations.set(m.conversation_key, {
      conversation_key: m.conversation_key,
      last_message:     m.content,
      last_role:        m.role,
      last_at:          m.created_at,
      is_paused:        pausedKeys.has(m.conversation_key),
    })
  }

  res.json({ conversations: Array.from(conversations.values()) })
})

// Full message history for one conversation
router.get('/conversations/:key/messages', async (req: Request, res: Response) => {
  const { data } = await supabaseAdmin
    .from('chat_messages')
    .select('role, content, created_at')
    .eq('channel', 'whatsapp')
    .eq('conversation_key', req.params.key)
    .order('created_at', { ascending: true })

  res.json({ messages: data ?? [] })
})

// Send a manual reply as the business — pauses the bot for this conversation
router.post('/conversations/:key/reply', async (req: Request, res: Response) => {
  const key     = req.params.key
  const message = (req.body?.message as string)?.trim()
  if (!message) { res.status(400).json({ error: 'message required' }); return }

  await sendWhatsAppMessage(key, message)
  await saveMessage('whatsapp', key, 'assistant', message)
  await setPaused(key, true)

  res.json({ success: true })
})

// Hand the conversation back to the bot
router.post('/conversations/:key/resume', async (req: Request, res: Response) => {
  await setPaused(req.params.key, false)
  res.json({ success: true })
})

export default router
