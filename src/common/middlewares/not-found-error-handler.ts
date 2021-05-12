import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../types/error-handling';

const notFoundErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (error.isNotFound) {
    return res.status(404).json(error.message);
  }

  return next(error);
};

export { notFoundErrorHandler };
