import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'
import { Role } from '../models/user.model'

export default function requireRole(role: Role) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}