import express from 'express'
import cors from 'cors'
import router from './routes'
import errorMiddleware from './middlewares/error.middleware'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/docs', express.static('docs'))
app.use('/uploads', express.static('uploads'))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use(router)

app.use(errorMiddleware)

export default app