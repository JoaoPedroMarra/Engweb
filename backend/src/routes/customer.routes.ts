import { Router } from 'express'
import authenticate from '../middlewares/auth.middleware'
import requireRole from '../middlewares/role.middleware'
import { getOrders, getPurchases, createOrder } from '../controllers/customer.controller'

const router = Router()

router.get('/orders', authenticate, requireRole('customer'), getOrders)
router.get('/purchases', authenticate, requireRole('customer'), getPurchases)
router.post('/orders', authenticate, requireRole('customer'), createOrder)

export default router