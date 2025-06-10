// server.ts
import express from 'express'
import { createServer as createHttpServer } from 'http'
import { Server } from 'socket.io'
import { createPollHandler } from '../handlers/poll/index.js'
import db from '../db/index.js'

export function createServer() {
  const app = express()
  const httpServer = createHttpServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // TODO: Configure this for production
      methods: ['GET', 'POST'],
    },
  })

  app.use(express.json())

  app.get('/', (_req, res) => {
    res.send('Server is running!')
  })

  /**
   * Health check endpoint
   * This endpoint can be used to check the status of the server.
   * It returns a JSON response with the status and current timestamp.
   * Example response:
   * {
   *   "status": "OK",
   *   "timestamp": "2023-10-01T12:00:00Z"
   * }
   * This is useful for monitoring and ensuring the server is up and running.
   */
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
  })

  // Handle poll creation
  app.post('/api/v1/poll/create', createPollHandler)

  /**
   * Socket.IO connection handler
   * This function handles incoming WebSocket connections.
   */
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id)
    const room = socket.handshake.query.room
    console.log('room param: ', room)
    if (!room || typeof room !== 'string') {
      console.error('Invalid room name:', room)
      socket.emit('error', 'Invalid room name')
      return
    }
    console.log(`User joinning room: ${room}`)

    socket.join(room)
    console.log(`User ${socket.id} joined room: ${room}`)
    socket.emit('message', `You joined room: ${room}`)

    // Our inital poll data
    const pollData = await db.runningPoll.findFirst({
      where: {
        roomId: room,
      },
      include: {
        categories: true,
        votes: true,
      },
    })
    console.log('Poll data: ', pollData)
    socket.emit('pollData', pollData)

    // User makes a vote
    socket.on('vote', async (vote) => {
      console.log('Vote: ', vote)
      if (!vote.categoryId || !vote.runningPollId) {
        socket.emit('Missing category or poll')
      }
      const hasVoted = !!(await db.pollVote.findFirst({
        where: {
          userId: '1',
          runningPollId: vote.pollId,
        },
      }))
      if (hasVoted) {
        console.log('User has already voted in this poll')
        socket.emit('votedResponse', 'You vote has already been cast')
      } else {
        const makeVote = await db.pollVote.create({
          data: {
            userId: '1',
            categoryId: vote.categoryId,
            runningPollId: vote.pollId,
          },
        })
        console.log('votedbresponse: ', makeVote)
        socket.emit('votedResponse', makeVote)
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
    // socket.on('joinRoom', async () => {})
  })

  /**
   * Broadcast endpoint
   * This endpoint allows broadcasting a message to all connected clients or a specific room.
   * It accepts a JSON payload with the message and optional room.
   * Example request:
   * POST /api/broadcast
   * {
   *  "message": "Hello, world!",
   *  "room": "room1"
   *  }
   */
  app.post('/api/broadcast', (req, res) => {
    const { message, room } = req.body

    if (room) {
      io.to(room).emit('message', message)
    } else {
      io.emit('message', message)
    }

    res.json({ success: true, message: 'Message broadcasted' })
  })

  /**
   * Error handling middleware
   * This middleware catches errors and sends a JSON response with the error message.
   * It also logs the error to the console.
   */
  const closeServer = () => {
    return new Promise<void>((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err)
        } else {
          io.close()
          resolve()
        }
      })
    })
  }

  // Attach close method to the server
  Object.assign(httpServer as any, { close: closeServer })

  return httpServer
}
