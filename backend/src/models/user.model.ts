export type Role = 'customer' | 'admin'

export type User = {
  id: number
  name: string
  email: string
  passwordHash: string
  role: Role
  createdAt: Date
}