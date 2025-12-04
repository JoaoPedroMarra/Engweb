import { Request, Response } from 'express'
import { listProducts } from '../repositories/product.repository'

export function list(_req: Request, res: Response) {
  return res.json({ products: listProducts() })
}