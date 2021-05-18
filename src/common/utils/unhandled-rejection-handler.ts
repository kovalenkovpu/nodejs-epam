import { logger } from './logger';

const registerUnhandledRejectionHandler = (): void => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.log({
      level: 'error',
      message: `Unhandled Rejection at: ${promise}, reason: ${reason}`,
    });
  });
};

export { registerUnhandledRejectionHandler };
