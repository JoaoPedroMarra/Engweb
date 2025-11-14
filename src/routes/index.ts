import { Router } from 'express'
import authRoutes from './auth.routes'
import customerRoutes from './customer.routes'
import adminRoutes from './admin.routes'
import docsRoutes from './docs.routes'
import productsRoutes from './products.routes'
import cardapioRoutes from './cardapio.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/customer', customerRoutes)
router.use('/admin', adminRoutes)
router.use('/products', productsRoutes)
router.use('/cardapio', cardapioRoutes)
router.use('/', docsRoutes)

export default router