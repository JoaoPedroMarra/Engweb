import { listByCustomer, createOrder } from '../repositories/order.repository'
import { OrderItem } from '../models/order.model'
import { listProducts } from '../repositories/product.repository'

export function getCustomerHistory(customerId: number) {
  return listByCustomer(customerId)
}

export function makeOrder(customerId: number, items: { productId: number; quantity: number }[]) {
  const products = listProducts()
  const orderItems: OrderItem[] = []
  let total = 0
  for (const it of items) {
    const prod = products.find(p => p.id === it.productId)
    if (!prod) throw new Error('invalid_product')
    const unitPrice = prod.price
    total += unitPrice * it.quantity
    orderItems.push({ productId: it.productId, quantity: it.quantity, unitPrice })
  }
  return createOrder(customerId, orderItems, total)
}