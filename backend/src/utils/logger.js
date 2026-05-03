import { createLogger, format, transports } from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, '../../logs');

if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });

const { combine, timestamp, printf, colorize, errors, json } = format;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    // Console (development)
    new transports.Console({
      format: combine(colorize(), consoleFormat),
      silent: process.env.NODE_ENV === 'test',
    }),
    // Error log file
    new transports.File({
      filename: join(logsDir, 'error.log'),
      level: 'error',
      format: json(),
      maxsize: 5 * 1024 * 1024,  // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new transports.File({
      filename: join(logsDir, 'combined.log'),
      format: json(),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: join(logsDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: join(logsDir, 'rejections.log') }),
  ],
});

export default logger;