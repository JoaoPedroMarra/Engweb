import { db, persist } from '../db/memory'
import { Product } from '../models/product.model'

export function createProduct(name: string, price: number, description?: string, imageUrl?: string) {
  const product: Product = { id: db.seq.productId++, name, price, description, imageUrl, createdAt: new Date() }
  db.products.push(product)
  persist()
  return product
}

export function clearProducts() {
  const count = db.products.length
  db.products = []
  persist()
  return count
}

export function listProducts() {
  return db.products
}

export function findProductById(id: number) {
  return db.products.find(p => p.id === id) || null
}

export function updateProduct(id: number, changes: { name?: string; price?: number; description?: string; imageUrl?: string }) {
  const product = db.products.find(p => p.id === id)
  if (!product) return null
  if (typeof changes.name === 'string') product.name = changes.name
  if (typeof changes.price === 'number') product.price = changes.price
  if (typeof changes.description === 'string') product.description = changes.description
  if (typeof changes.imageUrl === 'string') product.imageUrl = changes.imageUrl
  persist()
  return product
}

export function deleteProduct(id: number) {
  const idx = db.products.findIndex(p => p.id === id)
  if (idx < 0) return false
  db.products.splice(idx, 1)
  persist()
  return true
}
