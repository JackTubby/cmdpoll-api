// types/global.d.ts
import { Logger } from '../utils/logger.js'

declare global {
  var logger: typeof logger
}

export {}
