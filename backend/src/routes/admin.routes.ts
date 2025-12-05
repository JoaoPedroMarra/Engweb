import { Router } from 'express'
import authenticate from '../middlewares/auth.middleware'
import requireRole from '../middlewares/role.middleware'
import { createProduct, updateProductById, deleteProductById } from '../controllers/admin.controller'
import multer from 'multer'
import path from 'path'
import { put } from '@vercel/blob'
import { addProduct } from '../services/product.service'
import { env } from '../utils/env'
import { clearProducts } from '../repositories/product.repository'

const router = Router()

router.post('/products', authenticate, requireRole('admin'), createProduct)

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg']
    if (allowed.includes(file.mimetype)) return cb(null, true)
    cb(new Error('Unsupported file type'))
  }
})

router.post('/products/upload', authenticate, requireRole('admin'), upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body as any
  const file = req.file
  if (!name || !price || !file) return res.status(400).json({ error: 'Invalid payload' })
  try {
    if (!env.BLOBB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'Blob token not configured' })
    }
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const key = `products/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    const { url } = await put(key, file.buffer, {
      access: 'public',
      contentType: file.mimetype || 'image/jpeg',
      token: env.BLOBB_READ_WRITE_TOKEN,
    })
    const product = addProduct(String(name), Number(price), description ? String(description) : undefined, url)
    return res.status(201).json({ product })
  } catch (e) {
    return res.status(500).json({ error: 'Upload failed' })
  }
})

router.put('/products/:id', authenticate, requireRole('admin'), updateProductById)
router.delete('/products/:id', authenticate, requireRole('admin'), deleteProductById)

router.delete('/products', authenticate, requireRole('admin'), (_req, res) => {
  const count = clearProducts()
  return res.json({ cleared: count })
})

export default router
