import { Request, Response } from 'express'
import db from '../../db/index.js'
import { randomInt } from 'crypto'

export async function createPollHandler(req: Request, res: Response) {
  logger.info('Create poll running')
  try {
    const { title, categories, duration, userId, setPrivacy } = req.body
    const randomId = randomInt(100000, 999999).toString()

    const save = await db.runningPoll.create({
      data: {
        title,
        duration,
        roomId: `poll-${randomId}`,
        userId: userId ? userId : '1',
        isPrivate: setPrivacy,
        categories: {
          create: categories.map((category: string) => ({
            name: category,
            voteCount: 0,
          })),
        },
      },
    })
    logger.info('Poll created successfully:', save)
    res.json({
      ok: true,
      message: 'Poll created successfully',
      data: save,
      roomId: `poll-${randomId}`,
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
