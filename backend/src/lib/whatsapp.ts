const ACCESS_TOKEN    = process.env.WHATSAPP_ACCESS_TOKEN || ''
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
const API_VERSION     = process.env.WHATSAPP_API_VERSION || 'v20.0'

export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
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
