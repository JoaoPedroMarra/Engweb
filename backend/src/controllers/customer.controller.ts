import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import { getCustomerHistory, makeOrder } from '../services/order.service'
import { createOrderSchema } from '../schemas/order.schema'

export function getOrders(req: AuthRequest, res: Response) {
  const userId = req.user!.id
  const history = getCustomerHistory(userId)
  return res.json({ orders: history })
}

export function getPurchases(req: AuthRequest, res: Response) {
  const userId = req.user!.id
  const history = getCustomerHistory(userId)
  return res.json({ purchases: history })
}

export function createOrder(req: AuthRequest, res: Response) {
  const userId = req.user!.id
  const parsed = createOrderSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  try {
    const order = makeOrder(userId, parsed.data.items, parsed.data.deliveryAddress)
    return res.status(201).json({ order })
  } catch (e: any) {
    if (e && e.message === 'invalid_product') return res.status(400).json({ error: 'Invalid product' })
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
