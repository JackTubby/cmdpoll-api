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
  logger.info("Create poll running")
  try {
    const { title, categories, duration, formattedDuration, userId } = req.body

    const save = await db.poll.create({
      data: {
        title,
        categories,
        duration,
        formattedDuration,
        userId: userId ? userId : '1',
      },
    })
    logger.info('Poll created successfully:', save)
    res.json({
      ok: true,
      message: 'Poll created successfully',
      data: save,
    })
  } catch (err) {
    logger.error('Error creating poll:', err)
    res.json({
      ok: false,
      message: 'Error creating poll',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}
