import { db, persist } from '../db/memory'
import { Role, User } from '../models/user.model'

export function findByEmail(email: string) {
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export function findById(id: number) {
  return db.users.find(u => u.id === id) || null
}

export function createUser(name: string, email: string, passwordHash: string, role: Role) {
  const user: User = { id: db.seq.userId++, name, email, passwordHash, role, createdAt: new Date() }
  db.users.push(user)
  persist()
  return user
}
