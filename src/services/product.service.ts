import { createProduct, updateProduct as repoUpdateProduct, deleteProduct as repoDeleteProduct } from '../repositories/product.repository'

export function addProduct(name: string, price: number, description?: string, imageUrl?: string) {
  return createProduct(name, price, description, imageUrl)
}

export function updateProduct(id: number, changes: { name?: string; price?: number; description?: string; imageUrl?: string }) {
  return repoUpdateProduct(id, changes)
}

export function removeProduct(id: number) {
  return repoDeleteProduct(id)
}
