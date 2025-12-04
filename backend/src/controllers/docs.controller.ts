import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'

export async function readReadme(_req: Request, res: Response) {
  try {
    const p = path.join(process.cwd(), 'README.md')
    const md = await fs.readFile(p, 'utf-8')
    res.type('text/markdown').send(md)
  } catch {
    res.status(404).json({ error: 'README not found' })
  }
}