import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',  // Set target to 'pino-pretty'
    options: {
      colorize: true, // Optional: Colorize the output (for better readability)
    },
  },
})
