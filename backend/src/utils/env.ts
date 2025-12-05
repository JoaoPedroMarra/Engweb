import dotenv from 'dotenv'
dotenv.config()

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'devsecret',
  PORT: Number(process.env.PORT || 3000),
  ADMIN_REGISTER_TOKEN: process.env.ADMIN_REGISTER_TOKEN || '',
  BLOBB_READ_WRITE_TOKEN: process.env.BLOBB_READ_WRITE_TOKEN || ''
}
