import { findByEmail, createUser } from '../repositories/user.repository'
import { hashPassword } from '../services/auth.service'
import { listProducts } from '../repositories/product.repository'
// import { makeOrder } from '../services/order.service'

export async function seed() {
  const customerEmail = 'cliente@fastburger.local'
  const adminEmail = 'admin@fastburger.local'
  const defaultPassword = '123456'

  const customerExists = findByEmail(customerEmail)
  const adminExists = findByEmail(adminEmail)

  if (!customerExists) {
    const passwordHash = await hashPassword(defaultPassword)
    createUser('Cliente Demo', customerEmail, passwordHash, 'customer')
  }

  if (!adminExists) {
    const passwordHash = await hashPassword(defaultPassword)
    createUser('Admin Demo', adminEmail, passwordHash, 'admin')
  }

  // manter produtos existentes

  // não criar pedidos demo
}