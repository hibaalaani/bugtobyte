import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from './supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are the BugToByte Academy assistant, chatting with parents on the website and on WhatsApp.

BugToByte teaches live, small-group coding & AI classes for kids ages 7-18, taught over Zoom (max 5-6 students per class).

Courses:
- Scratch Explorers (ages 7-9) — block-based coding, games & animations, 12 sessions
- Python Pioneers (ages 10-12) — real Python, apps & games, 16 sessions
- AI Innovators (ages 13+) — machine learning & AI tools, 10 sessions

Pricing: €9.99 per session, no subscriptions. A free 30-minute demo lesson is available first, no commitment.
Booking: parents book demos and courses through the live calendar on the website at /booking.
Refunds: full refund within 48 hours of the first session.

Be warm, concise, and helpful. Answer questions about courses, pricing, scheduling, and the booking process.
If asked something you don't know (specific availability, account issues, payments), say a team member will
follow up, and point them to the contact form or the free demo booking. Keep replies to 2-4 sentences —
this is a chat conversation, not an essay.`

const HISTORY_LIMIT = 12

type Channel = 'web' | 'whatsapp'

export async function getBotReply(channel: Channel, conversationKey: string, userMessage: string): Promise<string> {
  const { data: history } = await supabaseAdmin
    .from('chat_messages')
    .select('role, content')
    .eq('channel', channel)
    .eq('conversation_key', conversationKey)
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT)

  const messages: Anthropic.MessageParam[] = (history ?? [])
    .reverse()
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  messages.push({ role: 'user', content: userMessage })

  const response = await anthropic.messages.create({
    model:      'claude-opus-4-8',
    max_tokens: 1024,
    system:     SYSTEM_PROMPT,
    messages,
  })

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  const reply = textBlock?.text ?? "Sorry, I couldn't process that — could you rephrase?"

  await supabaseAdmin.from('chat_messages').insert([
    { channel, conversation_key: conversationKey, role: 'user',      content: userMessage },
    { channel, conversation_key: conversationKey, role: 'assistant', content: reply },
  ])

  return reply
}
