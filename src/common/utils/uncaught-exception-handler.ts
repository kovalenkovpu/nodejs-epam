import { logger } from './logger';

const registerUncoughExceptionHandler = (): void => {
  process.on('uncaughtException', (err) => {
    logger.log({
      level: 'error',
      message: `Uncaught Exception: ${err.message}`,
    });

    process.exit(1);
  });
};

export { registerUncoughExceptionHandler };
