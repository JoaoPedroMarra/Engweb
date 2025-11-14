import { Request, Response } from 'express'
import { productSchema } from '../schemas/product.schema'
import { addProduct } from '../services/product.service'

export function createProduct(req: Request, res: Response) {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { name, price, description } = parsed.data
  const product = addProduct(name, price, description)
  return res.status(201).json({ product })
}
