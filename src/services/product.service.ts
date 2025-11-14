import { createProduct } from '../repositories/product.repository'

export function addProduct(name: string, price: number, description?: string, imageUrl?: string) {
  return createProduct(name, price, description, imageUrl)
}