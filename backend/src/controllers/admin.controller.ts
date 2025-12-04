import { Request, Response } from 'express'
import { productSchema } from '../schemas/product.schema'
import { addProduct, updateProduct, removeProduct } from '../services/product.service'

export function createProduct(req: Request, res: Response) {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { name, price, description } = parsed.data
  const imageUrl = typeof (req.body as any).imageUrl === 'string' ? (req.body as any).imageUrl : undefined
  const product = addProduct(name, price, description, imageUrl)
  return res.status(201).json({ product })
}

export function updateProductById(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const partial = productSchema.partial().safeParse(req.body)
  if (!partial.success) return res.status(400).json({ error: partial.error.flatten() })
  const imageUrl = typeof (req.body as any).imageUrl === 'string' ? (req.body as any).imageUrl : undefined
  const updated = updateProduct(id, { ...partial.data, imageUrl })
  if (!updated) return res.status(404).json({ error: 'Not Found' })
  return res.json({ product: updated })
}

export function deleteProductById(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const ok = removeProduct(id)
  if (!ok) return res.status(404).json({ error: 'Not Found' })
  return res.status(204).send()
}
