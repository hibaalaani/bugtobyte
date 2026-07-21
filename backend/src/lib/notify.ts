import { sendEmail } from './email'
import { sendWhatsAppMessage } from './whatsapp'

const ADMIN_EMAIL            = process.env.ADMIN_EMAIL || ''
const ADMIN_WHATSAPP_NUMBER  = process.env.ADMIN_WHATSAPP_NUMBER || ''

type Channel = 'web' | 'whatsapp'

export async function notifyTeam(channel: Channel, conversationKey: string, reason: string): Promise<void> {
  const contactLine = channel === 'whatsapp'
    ? `Reached via WhatsApp: ${conversationKey}`
    : `Reached via website chat (session ${conversationKey})`

  await Promise.all([
    ADMIN_EMAIL
      ? sendEmail(
          ADMIN_EMAIL,
          '🙋 Chatbot handoff — parent wants to talk to a person',
          `<p><strong>${contactLine}</strong></p><p>${reason}</p>`,
        )
      : Promise.resolve(),
    ADMIN_WHATSAPP_NUMBER
      ? sendWhatsAppMessage(ADMIN_WHATSAPP_NUMBER, `🙋 Chatbot handoff\n${contactLine}\n${reason}`)
      : Promise.resolve(),
  ])
}
