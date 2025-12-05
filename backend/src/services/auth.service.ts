import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../utils/env'
import { User } from '../models/user.model'

export async function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User) {
  const payload = { sub: String(user.id), role: user.role }
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}
