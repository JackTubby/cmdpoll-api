// index.ts - Application entry point
import { createServer } from './config/server'
import { config } from './config'
import { logger } from './utils/logger'

let server: any = null

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Graceful shutdown function
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, starting graceful shutdown...`)
  
  try {
    if (server && server.close) {
      await server.close()
      logger.info('Server closed successfully')
    }
    
    // We could close db connections or other resources here
    
    logger.info('Graceful shutdown completed')
    process.exit(0)
  } catch (error) {
    logger.error('Error during graceful shutdown:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

async function bootstrap() {
  try {
    server = createServer()
    const port = config.port || 3000
    
    server.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`)
      logger.info(`📊 Polling system ready to accept connections`)
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
    
    return server
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()