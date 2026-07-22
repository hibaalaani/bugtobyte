export const WA_NUMBER = '15551531161'

const MESSAGES: Record<string, string> = {
  en: "Hi BugToByte! 👋 I'd like to know more about your coding courses for my child.",
  de: "Hallo BugToByte! 👋 Ich möchte mehr über eure Programmierkurse für mein Kind erfahren.",
  ar: "مرحبًا BugToByte! 👋 أود معرفة المزيد عن دورات البرمجة لطفلي.",
}

export function getWaUrl(lang: string, customMsg?: string): string {
  const msg = customMsg ?? MESSAGES[lang] ?? MESSAGES.en
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}
