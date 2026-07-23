import { supabaseAdmin } from './supabase'

// Takeover tracking is WhatsApp-only for now — the website widget has no
// mechanism to push a message into an already-open browser tab.
const CHANNEL = 'whatsapp'

export async function isConversationPaused(conversationKey: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('conversation_takeovers')
    .select('is_paused')
    .eq('channel', CHANNEL)
    .eq('conversation_key', conversationKey)
    .maybeSingle()

  return data?.is_paused ?? false
}

export async function setPaused(conversationKey: string, isPaused: boolean): Promise<void> {
  await supabaseAdmin.from('conversation_takeovers').upsert({
    channel:          CHANNEL,
    conversation_key: conversationKey,
    is_paused:        isPaused,
    updated_at:       new Date().toISOString(),
  }, { onConflict: 'channel,conversation_key' })
}
