import { User } from '../models/user.model'
import { Product } from '../models/product.model'
import { Order } from '../models/order.model'
import fs from 'fs'
import path from 'path'

type DBShape = {
  users: User[]
  products: Product[]
  orders: Order[]
  seq: { userId: number; productId: number; orderId: number }
}

const dataDir = path.join(process.cwd(), 'data')
const dbFile = path.join(dataDir, 'db.json')

function reviveDates(raw: any) {
  const out: DBShape = raw || { users: [], products: [], orders: [], seq: { userId: 1, productId: 1, orderId: 1 } }
  for (const u of out.users) { (u as any).createdAt = new Date(u.createdAt) }
  for (const p of out.products) { (p as any).createdAt = new Date(p.createdAt) }
  for (const o of out.orders) { (o as any).createdAt = new Date(o.createdAt) }
  return out
}

function ensureDir() {
  try { fs.mkdirSync(dataDir, { recursive: true }) } catch {}
}

function load(): DBShape {
  ensureDir()
  try {
    const text = fs.readFileSync(dbFile, 'utf-8')
    return reviveDates(JSON.parse(text))
  } catch {
    const initial: DBShape = { users: [], products: [], orders: [], seq: { userId: 1, productId: 1, orderId: 1 } }
    try { fs.writeFileSync(dbFile, JSON.stringify(initial)) } catch {}
    return initial
  }
}

export const db: DBShape = load()

export function persist() {
  ensureDir()
  const serializable = {
    users: db.users.map(u => ({ ...u, createdAt: (u.createdAt as any)?.toISOString?.() || u.createdAt })),
    products: db.products.map(p => ({ ...p, createdAt: (p.createdAt as any)?.toISOString?.() || p.createdAt })),
    orders: db.orders.map(o => ({ ...o, createdAt: (o.createdAt as any)?.toISOString?.() || o.createdAt })),
    seq: db.seq
  }
  try { fs.writeFileSync(dbFile, JSON.stringify(serializable)) } catch {}
}
