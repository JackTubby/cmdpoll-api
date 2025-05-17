export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  maxPollOptions: parseInt(process.env.MAX_POLL_OPTIONS || '10'),
  maxPollDuration: parseInt(process.env.MAX_POLL_DURATION || '7') // days
};