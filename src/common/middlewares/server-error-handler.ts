import { NextFunction, Request, Response } from 'express';

import { logger } from '../utils/logger';

const serverErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  logger.log({
    level: 'error',
    message: 'Internal Server Error',
  });

  return res.status(500).json(error.message);
};

export { serverErrorHandler };
