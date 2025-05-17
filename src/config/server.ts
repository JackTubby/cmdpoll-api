// server.ts
import express from 'express'
import { createServer as createHttpServer } from 'http'
import { Server } from 'socket.io'

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

  app.get('/', (req, res) => {
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
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
  })

  /**
   * Socket.IO connection handler
   * This function handles incoming WebSocket connections.
   */
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })

    socket.on('message', (data) => {
      console.log('Received message:', data)
      // Broadcast to all clients
      io.emit('message', data)
    })

    socket.on('join_room', (room) => {
      socket.join(room)
      console.log(`User ${socket.id} joined room: ${room}`)
      socket.to(room).emit('user_joined', { userId: socket.id, room })
    })
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
  Object.assign(httpServer, { close: closeServer })

  return httpServer
}
