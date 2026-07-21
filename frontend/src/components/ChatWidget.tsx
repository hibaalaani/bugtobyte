import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const SESSION_KEY = 'btb_chat_session'

type ChatMsg = { role: 'user' | 'assistant'; content: string }

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export default function ChatWidget() {
  const { tr } = useLanguage()
  const t = tr.chatWidget
  const sessionId = useRef(getSessionId())
  const bottomRef  = useRef<HTMLDivElement>(null)

  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'assistant', content: t.initialMessage }])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sessionId: sessionId.current, message: text }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: res.ok ? data.reply : t.error }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: t.error }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        title={t.title}
        style={{
          position: 'fixed', bottom: 24, right: 96, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#00FF87,#00D4AA)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,255,135,0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {open ? <X size={24} color="#050A12" /> : <MessageCircle size={24} color="#050A12" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: 96, right: 24, zIndex: 9998,
              width: 'min(360px, 90vw)', height: 'min(520px, 70vh)',
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 16, boxShadow: 'var(--shadow-hover)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg,rgba(0,255,135,.12),rgba(96,165,250,.08))', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{t.title}</div>
              <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>{t.subtitle}</div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#00FF87,#00D4AA)' : 'var(--bg-alt)',
                  color: m.role === 'user' ? '#050A12' : 'var(--text-primary)',
                  padding: '9px 14px', borderRadius: 14,
                  fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '9px 14px' }}>
                  <Loader2 size={16} color="var(--text-muted)" className="animate-spin" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--border-color)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder={t.inputPlaceholder}
                style={{
                  flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                  borderRadius: 20, padding: '9px 16px', color: 'var(--text-primary)',
                  fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#00FF87,#00D4AA)', border: 'none',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Send size={16} color="#050A12" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
