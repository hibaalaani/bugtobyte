import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import { CheckCircle, XCircle, Trash2, RefreshCw, Mail, Calendar, Users, MessageSquare, ChevronDown, Phone, Send, Play } from 'lucide-react'
import toast from 'react-hot-toast'

const ADMIN_EMAIL = 'hiba.a.alaani@gmail.com'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type Tab = 'appointments' | 'students' | 'messages' | 'whatsapp'
type StatusFilter = 'all' | 'confirmed' | 'completed' | 'cancelled' | 'pending'

interface AdminAppointment {
  id: string
  parent_id: string
  appt_date: string
  time_slot: string
  status: string
  notes: string | null
  zoom_link: string | null
  course_id: string | null
  created_at: string
  profiles: { full_name: string | null; email: string | null } | null
  courses:  { title: string } | null
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  created_at: string
}

interface Student {
  parent_id: string
  full_name: string | null
  email: string | null
  total: number
  completed: number
  upcoming: number
  last_booking: string
}

interface Conversation {
  conversation_key: string
  last_message: string
  last_role: string
  last_at: string
  is_paused: boolean
}

interface ConvoMessage {
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed:  { bg: 'rgba(0,255,135,.12)',  color: '#00FF87' },
  completed:  { bg: 'rgba(96,165,250,.12)', color: '#60A5FA' },
  cancelled:  { bg: 'rgba(248,113,113,.12)',color: '#F87171' },
  pending:    { bg: 'rgba(251,191,36,.12)', color: '#FBBF24' },
}

export default function AdminPage({ setPage }: { setPage: (p: string) => void }) {
  const { user, session } = useAuth()
  const [tab, setTab]           = useState<Tab>('appointments')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [messages, setMessages]         = useState<ContactMessage[]>([])
  const [students, setStudents]         = useState<Student[]>([])
  const [loading, setLoading]           = useState(true)
  const [expandedId, setExpandedId]     = useState<string | null>(null)

  // ── WhatsApp inbox ──
  const [conversations, setConversations]   = useState<Conversation[]>([])
  const [selectedKey, setSelectedKey]       = useState<string | null>(null)
  const [convoMessages, setConvoMessages]   = useState<ConvoMessage[]>([])
  const [replyText, setReplyText]           = useState('')
  const [sending, setSending]               = useState(false)

  // ── Data fetching ─────────────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('appointments')
      .select('*, profiles(full_name, email), courses(title)')
      .order('appt_date', { ascending: false })
    setAppointments((data ?? []) as AdminAppointment[])
    setLoading(false)
  }, [])

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages((data ?? []) as ContactMessage[])
    setLoading(false)
  }, [])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('appointments')
      .select('parent_id, status, appt_date, profiles(full_name, email)')
      .order('appt_date', { ascending: false })

    if (!data) { setLoading(false); return }

    const map = new Map<string, Student>()
    for (const row of data as any[]) {
      if (!map.has(row.parent_id)) {
        map.set(row.parent_id, {
          parent_id: row.parent_id,
          full_name: row.profiles?.full_name ?? null,
          email:     row.profiles?.email ?? null,
          total: 0, completed: 0, upcoming: 0,
          last_booking: row.appt_date,
        })
      }
      const s = map.get(row.parent_id)!
      s.total++
      if (row.status === 'completed') s.completed++
      if (row.status === 'confirmed' || row.status === 'pending') s.upcoming++
    }
    setStudents(Array.from(map.values()))
    setLoading(false)
  }, [])

  const fetchConversations = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const res = await fetch(`${API}/api/admin/conversations`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
    const data = await res.json().catch(() => ({}))
    setConversations(res.ok ? (data.conversations ?? []) : [])
    setLoading(false)
  }, [session])

  const fetchConvoMessages = useCallback(async (key: string) => {
    if (!session) return
    const res = await fetch(`${API}/api/admin/conversations/${encodeURIComponent(key)}/messages`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
    const data = await res.json().catch(() => ({}))
    setConvoMessages(res.ok ? (data.messages ?? []) : [])
  }, [session])

  useEffect(() => {
    if (tab === 'appointments') fetchAppointments()
    else if (tab === 'messages')     fetchMessages()
    else if (tab === 'students')     fetchStudents()
    else if (tab === 'whatsapp')     fetchConversations()
  }, [tab])

  useEffect(() => {
    if (selectedKey) fetchConvoMessages(selectedKey)
  }, [selectedKey])

  // ── Actions ───────────────────────────────────────────────────
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success(`Marked as ${status}`)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Deleted')
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  const updateZoomLink = async (id: string, zoom_link: string) => {
    const { error } = await supabase.from('appointments').update({ zoom_link }).eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Zoom link saved')
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, zoom_link } : a))
  }

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
    toast.success('Deleted')
  }

  const sendManualReply = async () => {
    if (!session || !selectedKey || !replyText.trim() || sending) return
    setSending(true)
    const res = await fetch(`${API}/api/admin/conversations/${encodeURIComponent(selectedKey)}/reply`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body:    JSON.stringify({ message: replyText.trim() }),
    })
    if (!res.ok) { toast.error('Failed to send'); setSending(false); return }
    setReplyText('')
    setSending(false)
    await fetchConvoMessages(selectedKey)
    await fetchConversations()
  }

  const resumeBot = async (key: string) => {
    if (!session) return
    await fetch(`${API}/api/admin/conversations/${encodeURIComponent(key)}/resume`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
    toast.success('Bot resumed for this conversation')
    fetchConversations()
  }

  // ── Guard ─────────────────────────────────────────────────────
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ background: '#050A12', minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#F0EFE7', fontFamily: 'IBM Plex Sans, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Admin Only</h2>
          <p style={{ color: 'rgba(240,239,231,.5)', marginBottom: 24 }}>You don't have permission to view this page.</p>
          <button onClick={() => setPage('home')} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '10px 24px', color: '#F0EFE7', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Go Home</button>
        </div>
      </div>
    )
  }

  // ── Filtered appointments ─────────────────────────────────────
  const filtered = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === statusFilter)

  const counts = {
    all:       appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    pending:   appointments.filter(a => a.status === 'pending').length,
  }

  const cell: React.CSSProperties = {
    padding: '14px 16px', fontFamily: 'IBM Plex Sans, sans-serif',
    fontSize: 13, color: '#F0EFE7', borderBottom: '1px solid rgba(255,255,255,.05)',
    verticalAlign: 'middle',
  }
  const th: React.CSSProperties = {
    ...cell, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'rgba(240,239,231,.4)',
    borderBottom: '1px solid rgba(255,255,255,.1)',
  }

  return (
    <div style={{ background: '#050A12', color: '#F0EFE7', minHeight: '100vh', paddingTop: 80, fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 4 }}>Admin Panel</h1>
            <p style={{ color: 'rgba(240,239,231,.4)', fontSize: 14 }}>BugToByte Academy — manage your school</p>
          </div>
          <button onClick={() => setPage('dashboard')} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 18px', color: '#F0EFE7', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13 }}>← Dashboard</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 0 }}>
          {([
            { key: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
            { key: 'students',     label: 'Students',     icon: Users,    count: students.length },
            { key: 'messages',     label: 'Messages',     icon: MessageSquare, count: messages.length },
            { key: 'whatsapp',     label: 'WhatsApp',     icon: Phone,    count: conversations.length },
          ] as const).map(({ key, label, icon: Icon, count }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                padding: '12px 20px', fontSize: 14, fontWeight: 600,
                color: tab === key ? '#00FF87' : 'rgba(240,239,231,.45)',
                borderBottom: tab === key ? '2px solid #00FF87' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s',
                marginBottom: -1,
              }}>
              <Icon size={15} />
              {label}
              {count > 0 && (
                <span style={{ background: tab === key ? 'rgba(0,255,135,.15)' : 'rgba(255,255,255,.08)', color: tab === key ? '#00FF87' : 'rgba(240,239,231,.4)', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── APPOINTMENTS TAB ── */}
        {tab === 'appointments' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>

            {/* Filter + Refresh */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['all', 'confirmed', 'completed', 'cancelled', 'pending'] as StatusFilter[]).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    style={{
                      background: statusFilter === s ? 'rgba(0,255,135,.12)' : 'rgba(255,255,255,.04)',
                      border: `1px solid ${statusFilter === s ? 'rgba(0,255,135,.3)' : 'rgba(255,255,255,.08)'}`,
                      borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: 12, fontWeight: 600, color: statusFilter === s ? '#00FF87' : 'rgba(240,239,231,.5)',
                      textTransform: 'capitalize',
                    }}>
                    {s === 'all' ? `All (${counts.all})` : `${s} (${counts[s]})`}
                  </button>
                ))}
              </div>
              <button onClick={fetchAppointments} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'rgba(240,239,231,.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>No appointments found</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Parent', 'Session', 'Date & Time', 'Status', 'Actions'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(appt => {
                      const sc = STATUS_COLORS[appt.status] ?? STATUS_COLORS.pending
                      const isExpanded = expandedId === appt.id
                      return (
                        <>
                          <tr key={appt.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : appt.id)}>
                            <td style={cell}>
                              <div style={{ fontWeight: 600 }}>{appt.profiles?.full_name ?? '—'}</div>
                              <div style={{ fontSize: 12, color: 'rgba(240,239,231,.4)', marginTop: 2 }}>{appt.profiles?.email ?? '—'}</div>
                            </td>
                            <td style={cell}>
                              {appt.course_id ? (appt.courses?.title ?? 'Unknown Course') : (
                                <span style={{ color: '#00FF87', fontWeight: 600 }}>Free Demo</span>
                              )}
                            </td>
                            <td style={cell}>
                              <div style={{ fontWeight: 600 }}>{appt.appt_date}</div>
                              <div style={{ fontSize: 12, color: 'rgba(240,239,231,.4)' }}>{appt.time_slot?.slice(0, 5)}</div>
                            </td>
                            <td style={cell}>
                              <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>
                                {appt.status}
                              </span>
                            </td>
                            <td style={cell}>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {appt.status !== 'completed' && (
                                  <button onClick={e => { e.stopPropagation(); updateStatus(appt.id, 'completed') }}
                                    title="Mark complete"
                                    style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
                                    <CheckCircle size={13} /> Done
                                  </button>
                                )}
                                {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                  <button onClick={e => { e.stopPropagation(); updateStatus(appt.id, 'cancelled') }}
                                    title="Cancel"
                                    style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#F87171', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
                                    <XCircle size={13} /> Cancel
                                  </button>
                                )}
                                <button onClick={e => { e.stopPropagation(); if (confirm('Delete this appointment?')) deleteAppointment(appt.id) }}
                                  title="Delete"
                                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'rgba(240,239,231,.4)', display: 'flex', alignItems: 'center' }}>
                                  <Trash2 size={13} />
                                </button>
                                <ChevronDown size={14} style={{ color: 'rgba(240,239,231,.3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                              </div>
                            </td>
                          </tr>

                          {/* Expanded row — notes + zoom link */}
                          {isExpanded && (
                            <tr key={`${appt.id}-exp`}>
                              <td colSpan={5} style={{ ...cell, background: 'rgba(255,255,255,.02)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,239,231,.35)', marginBottom: 6 }}>Notes</div>
                                    <div style={{ fontSize: 13, color: 'rgba(240,239,231,.6)', lineHeight: 1.6 }}>{appt.notes || '—'}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,239,231,.35)', marginBottom: 6 }}>Zoom Link</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                      <input
                                        defaultValue={appt.zoom_link ?? ''}
                                        placeholder="https://zoom.us/j/..."
                                        id={`zoom-${appt.id}`}
                                        onClick={e => e.stopPropagation()}
                                        style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '7px 12px', color: '#F0EFE7', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
                                      />
                                      <button
                                        onClick={e => {
                                          e.stopPropagation()
                                          const val = (document.getElementById(`zoom-${appt.id}`) as HTMLInputElement)?.value ?? ''
                                          updateZoomLink(appt.id, val)
                                        }}
                                        style={{ background: 'rgba(0,255,135,.1)', border: '1px solid rgba(0,255,135,.2)', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', color: '#00FF87', fontFamily: 'inherit', fontSize: 12, fontWeight: 600 }}>
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ── STUDENTS TAB ── */}
        {tab === 'students' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>Loading...</div>
            ) : students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>No students yet</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Parent', 'Email', 'Total Sessions', 'Completed', 'Upcoming', 'Last Booking'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.parent_id}>
                        <td style={cell}><div style={{ fontWeight: 600 }}>{s.full_name ?? '—'}</div></td>
                        <td style={{ ...cell }}>
                          <a href={`mailto:${s.email}`} style={{ color: '#60A5FA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Mail size={12} /> {s.email ?? '—'}
                          </a>
                        </td>
                        <td style={{ ...cell, textAlign: 'center' }}><span style={{ fontWeight: 700 }}>{s.total}</span></td>
                        <td style={{ ...cell, textAlign: 'center' }}><span style={{ color: '#60A5FA', fontWeight: 700 }}>{s.completed}</span></td>
                        <td style={{ ...cell, textAlign: 'center' }}><span style={{ color: '#00FF87', fontWeight: 700 }}>{s.upcoming}</span></td>
                        <td style={cell}>{s.last_booking}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={fetchMessages} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'rgba(240,239,231,.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>Loading...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>No messages yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map(m => (
                  <div key={m.id} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</span>
                        <a href={`mailto:${m.email}`} style={{ marginLeft: 10, color: '#60A5FA', fontSize: 13, textDecoration: 'none' }}>{m.email}</a>
                        {m.subject && <span style={{ marginLeft: 10, color: 'rgba(240,239,231,.4)', fontSize: 13 }}>— {m.subject}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'rgba(240,239,231,.3)' }}>{m.created_at ? format(new Date(m.created_at), 'MMM d, HH:mm') : ''}</span>
                        <button onClick={() => deleteMessage(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,239,231,.3)', padding: 4 }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(240,239,231,.65)', lineHeight: 1.7, margin: 0 }}>{m.message}</p>
                    <div style={{ marginTop: 12 }}>
                      <a href={`mailto:${m.email}?subject=Re: ${m.subject ?? 'Your message'}`}
                        style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 6, padding: '6px 14px', color: '#60A5FA', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={12} /> Reply via email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── WHATSAPP TAB ── */}
        {tab === 'whatsapp' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={fetchConversations} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'rgba(240,239,231,.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(240,239,231,.3)' }}>No WhatsApp conversations yet</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>

                {/* Conversation list */}
                <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
                  {conversations.map(c => (
                    <div key={c.conversation_key} onClick={() => setSelectedKey(c.conversation_key)}
                      style={{
                        padding: '14px 16px', cursor: 'pointer',
                        background: selectedKey === c.conversation_key ? 'rgba(0,255,135,.06)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,.05)',
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>+{c.conversation_key}</span>
                        {c.is_paused && (
                          <span style={{ background: 'rgba(251,191,36,.12)', color: '#FBBF24', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Paused</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(240,239,231,.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.last_role === 'user' ? '' : '↳ '}{c.last_message}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(240,239,231,.3)', marginTop: 4 }}>
                        {c.last_at ? format(new Date(c.last_at), 'MMM d, HH:mm') : ''}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected conversation thread */}
                <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, display: 'flex', flexDirection: 'column', height: 560 }}>
                  {!selectedKey ? (
                    <div style={{ margin: 'auto', color: 'rgba(240,239,231,.3)', fontSize: 14 }}>Select a conversation</div>
                  ) : (
                    <>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700 }}>+{selectedKey}</span>
                        {conversations.find(c => c.conversation_key === selectedKey)?.is_paused && (
                          <button onClick={() => resumeBot(selectedKey)} style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
                            <Play size={13} /> Resume bot
                          </button>
                        )}
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {convoMessages.map((m, i) => (
                          <div key={i} style={{
                            alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
                            maxWidth: '75%',
                            background: m.role === 'user' ? 'rgba(255,255,255,.05)' : 'rgba(0,255,135,.1)',
                            border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,.08)' : 'rgba(0,255,135,.2)'}`,
                            borderRadius: 10, padding: '9px 14px', fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                          }}>
                            {m.content}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid rgba(255,255,255,.07)' }}>
                        <input
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') sendManualReply() }}
                          placeholder="Type a reply — sending will pause the bot for this chat"
                          style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 14px', color: '#F0EFE7', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
                        />
                        <button onClick={sendManualReply} disabled={sending || !replyText.trim()}
                          style={{ background: 'rgba(0,255,135,.1)', border: '1px solid rgba(0,255,135,.2)', borderRadius: 8, padding: '10px 16px', cursor: sending ? 'default' : 'pointer', opacity: sending || !replyText.trim() ? 0.5 : 1, color: '#00FF87', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontWeight: 600 }}>
                          <Send size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}
