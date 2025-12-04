import { Router } from 'express'
import { readReadme } from '../controllers/docs.controller'

const router = Router()

router.get('/readme', readReadme)

export default router