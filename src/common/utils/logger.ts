import { createLogger, format, transports } from 'winston';

const customFormatter = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.splat(),
    format.colorize(),
    format.simple(),
    customFormatter
  ),
  transports: [new transports.Console()],
});

export { logger };
