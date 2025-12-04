import { Router } from 'express'
import { loginAdmin, loginCustomer, registerAdmin, registerCustomer } from '../controllers/auth.controller'

const router = Router()

router.post('/register/customer', registerCustomer)
router.post('/register/admin', registerAdmin)
router.post('/login/customer', loginCustomer)
router.post('/login/admin', loginAdmin)

export default router