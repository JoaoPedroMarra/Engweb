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