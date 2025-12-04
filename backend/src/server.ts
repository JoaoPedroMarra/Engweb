import dotenv from 'dotenv'
import app from './app'
import { env } from './utils/env'
import { seed } from './db/seed'

dotenv.config()

;(async () => {
  await seed()
  app.listen(env.PORT, () => {
    process.stdout.write(`server listening on port ${env.PORT}\n`)
  })
})()