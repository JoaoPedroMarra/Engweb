import { db, persist } from '../db/memory'
import { Order, OrderItem } from '../models/order.model'

export function listByCustomer(customerId: number) {
  return db.orders.filter(o => o.customerId === customerId)
}

export function createOrder(customerId: number, items: OrderItem[], total: number, deliveryAddress: string) {
  const order: Order = { id: db.seq.orderId++, customerId, items, total, deliveryAddress, createdAt: new Date() }
  db.orders.push(order)
  persist()
  return order
}
