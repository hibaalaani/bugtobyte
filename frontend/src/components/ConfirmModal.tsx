import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(5,10,18,.8)',
            backdropFilter: 'blur(6px)',
            display: 'grid', placeItems: 'center',
            padding: 16,
          }}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0F1120',
              border: '1px solid rgba(248,113,113,.25)',
              borderRadius: 14,
              padding: '32px 28px',
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,.6)',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'rgba(248,113,113,.1)',
              border: '1px solid rgba(248,113,113,.25)',
              display: 'grid', placeItems: 'center',
              marginBottom: 20,
            }}>
              <AlertTriangle size={24} color="#f87171" />
            </div>

            <h3 style={{
              fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700,
              fontSize: 20, color: '#F0EFE7', marginBottom: 10,
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15,
              color: 'rgba(240,239,231,.55)', lineHeight: 1.6,
              marginBottom: 28,
            }}>
              {message}
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCancel}
                style={{
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 8, padding: '10px 22px',
                  color: 'rgba(240,239,231,.65)',
                  fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
                  fontSize: 14, cursor: 'pointer',
                }}
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                style={{
                  background: 'rgba(248,113,113,.15)',
                  border: '1px solid rgba(248,113,113,.35)',
                  borderRadius: 8, padding: '10px 22px',
                  color: '#f87171',
                  fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer',
                }}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
