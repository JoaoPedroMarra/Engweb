import { Router } from 'express'
import authenticate from '../middlewares/auth.middleware'
import requireRole from '../middlewares/role.middleware'
import { createProduct, updateProductById, deleteProductById } from '../controllers/admin.controller'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { addProduct } from '../services/product.service'
import { clearProducts } from '../repositories/product.repository'

const router = Router()

router.post('/products', authenticate, requireRole('admin'), createProduct)

const uploadDir = path.join(process.cwd(), 'uploads')
try { fs.mkdirSync(uploadDir, { recursive: true }) } catch {}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  }
})
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg']
    if (allowed.includes(file.mimetype)) return cb(null, true)
    cb(new Error('Unsupported file type'))
  }
})

router.post('/products/upload', authenticate, requireRole('admin'), upload.single('image'), (req, res) => {
  const { name, price, description } = req.body as any
  const file = req.file
  if (!name || !price || !file) return res.status(400).json({ error: 'Invalid payload' })
  const imageUrl = `/uploads/${file.filename}`
  const product = addProduct(String(name), Number(price), description ? String(description) : undefined, imageUrl)
  return res.status(201).json({ product })
})

router.put('/products/:id', authenticate, requireRole('admin'), updateProductById)
router.delete('/products/:id', authenticate, requireRole('admin'), deleteProductById)

router.delete('/products', authenticate, requireRole('admin'), (_req, res) => {
  const count = clearProducts()
  return res.json({ cleared: count })
})

export default router
