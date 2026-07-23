import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase'

// Extends Express Request to carry the verified Supabase user
declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

/**
 * Verifies the Supabase JWT from the Authorization header.
 * Attaches req.userId for downstream handlers.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return
  }

  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }

  req.userId = user.id
  next()
}

/**
 * Requires requireAuth to have run first (needs req.userId).
 * Rejects unless the authenticated user's profile has role = 'admin'.
 */
export async function requireAdminRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', req.userId).single()

  if (profile?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  next()
}
