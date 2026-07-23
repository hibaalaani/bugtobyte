import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from './supabase'
import { notifyTeam } from './notify'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type Channel = 'web' | 'whatsapp'

export async function saveMessage(channel: Channel, conversationKey: string, role: 'user' | 'assistant', content: string): Promise<void> {
  await supabaseAdmin.from('chat_messages').insert({ channel, conversation_key: conversationKey, role, content })
}

function buildSystemPrompt(channel: Channel): string {
  const contactInstruction = channel === 'web'
    ? `This conversation is happening on the website widget, which is anonymous — you have no way to know this parent's name, phone number, or email. Before calling notify_team, ask for their name and a phone number or email so a real person can actually reach them back, and pass those into the tool's parent_name / contact_method fields. If they decline to share contact info after being asked once, call notify_team anyway and leave those fields out.`
    : `This conversation is happening on WhatsApp — you already know the parent's phone number from this channel, so there's no need to ask for it before calling notify_team.`

  return `You are the BugToByte Academy assistant, chatting with parents on the website and on WhatsApp.

BugToByte teaches live, small-group coding & AI classes for kids ages 7-18, taught over Zoom (max 5-6 students per class).

Courses:
- Scratch Explorers (ages 7-9) — block-based coding, games & animations, 12 sessions
- Python Pioneers (ages 10-12) — real Python, apps & games, 16 sessions
- AI Innovators (ages 13+) — machine learning & AI tools, 10 sessions

Pricing: €9.99 per session, no subscriptions. A free 30-minute demo lesson is available first, no commitment.
Booking: parents book demos and courses through the live calendar on the website — visit bugtobyte.com and click "Book Free Demo" on the homepage. There is no separate booking URL to share directly; always point people to the homepage button, never a /booking link.
Refunds: full refund within 48 hours of the first session.

Be warm, concise, and helpful. Answer questions about courses, pricing, scheduling, and the booking process.
Keep replies to 2-4 sentences — this is a chat conversation, not an essay.

If a parent explicitly asks to speak with a real teacher/instructor, wants a phone call or callback, or asks for
a human instead of the chatbot, use the notify_team tool. ${contactInstruction}
After calling notify_team, tell the parent the team has been notified and someone will reach out to them soon —
don't keep answering as if nothing happened.`
}

const NOTIFY_TOOL: Anthropic.Tool = {
  name:        'notify_team',
  description: 'Notify the BugToByte team that a parent wants to be contacted by a real person (teacher, instructor, or staff) instead of continuing with the chatbot. Only call this when the parent explicitly asks for human contact — not for questions the bot can answer itself.',
  input_schema: {
    type:       'object',
    properties: {
      reason:         { type: 'string', description: "Brief summary of what the parent wants, e.g. 'Wants a callback to discuss Python Pioneers scheduling'" },
      parent_name:    { type: 'string', description: "The parent's name, if they gave one. Omit if not provided." },
      contact_method: { type: 'string', description: "Phone number or email the parent gave to be reached at. Required on the website channel unless they declined to share it; not needed on WhatsApp since the number is already known." },
    },
    required: ['reason'],
  },
}

const HISTORY_LIMIT = 12

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

  const system = buildSystemPrompt(channel)

  let response = await anthropic.messages.create({
    model:      'claude-opus-4-8',
    max_tokens: 1024,
    system,
    tools:      [NOTIFY_TOOL],
    messages,
  })

  if (response.stop_reason === 'tool_use') {
    const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')

    if (toolUse) {
      const { reason, parent_name, contact_method } = toolUse.input as {
        reason: string; parent_name?: string; contact_method?: string
      }
      await notifyTeam(channel, conversationKey, reason, parent_name, contact_method)

      messages.push({ role: 'assistant', content: response.content })
      messages.push({
        role:    'user',
        content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: 'Team notified successfully.' }],
      })

      response = await anthropic.messages.create({
        model:      'claude-opus-4-8',
        max_tokens: 1024,
        system,
        tools:      [NOTIFY_TOOL],
        messages,
      })
    }
  }

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  const reply = textBlock?.text ?? "Sorry, I couldn't process that — could you rephrase?"

  await supabaseAdmin.from('chat_messages').insert([
    { channel, conversation_key: conversationKey, role: 'user',      content: userMessage },
    { channel, conversation_key: conversationKey, role: 'assistant', content: reply },
  ])

  return reply
}
