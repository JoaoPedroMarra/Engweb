import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../utils/env'
import { findById } from '../repositories/user.repository'
import { User } from '../models/user.model'

export type AuthRequest = Request & { user?: User }

export default function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || ''
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string }
    const userId = Number(decoded.sub)
    const user = findById(userId)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}