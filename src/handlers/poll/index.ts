import { Request, Response } from 'express'
import db from '../../db/index.js'

// interface Poll {
//   title: string
//   categories: [string]
//   duration: string
//   formattedDuration: string
//   // TODO: remove optional once implemented
//   userId?: string
// }

export async function createPollHandler(req: Request, res: Response) {
  try {
    const { title, categories, duration, formattedDuration, userId } = req.body

    const save = await db.poll.create({
      data: {
        title,
        categories,
        duration,
        formattedDuration,
        userId,
      },
    })
    res.json(save)
  } catch (err) {
    res.json(err)
  }
}
