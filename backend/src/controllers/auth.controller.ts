import { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { findByEmail, createUser } from '../repositories/user.repository'
import { hashPassword, comparePassword, generateToken } from '../services/auth.service'
import { env } from '../utils/env'

export async function registerCustomer(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { name, email, password } = parsed.data
  const exists = findByEmail(email)
  if (exists) return res.status(409).json({ error: 'Email already registered' })
  const passwordHash = await hashPassword(password)
  const user = createUser(name, email, passwordHash, 'customer')
  const token = generateToken(user)
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export async function registerAdmin(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { name, email, password } = parsed.data
  const headerToken = (req.headers['x-admin-token'] as string | undefined) || (req.headers['X-Admin-Token'] as string | undefined)
  const adminToken = (req.body?.adminToken as string | undefined) || headerToken
  const expected = String(env.ADMIN_REGISTER_TOKEN || '').trim()
  if (!expected || String(adminToken || '').trim() !== expected) return res.status(403).json({ error: 'Forbidden' })
  const exists = findByEmail(email)
  if (exists) return res.status(409).json({ error: 'Email already registered' })
  const passwordHash = await hashPassword(password)
  const user = createUser(name, email, passwordHash, 'admin')
  const token = generateToken(user)
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export async function loginCustomer(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { email, password } = parsed.data
  const user = findByEmail(email)
  if (!user || user.role !== 'customer') return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await comparePassword(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = generateToken(user)
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export async function loginAdmin(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { email, password } = parsed.data
  const user = findByEmail(email)
  if (!user || user.role !== 'admin') return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await comparePassword(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = generateToken(user)
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}