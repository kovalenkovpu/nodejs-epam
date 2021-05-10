import { NextFunction, Request, Response } from 'express';

const serverErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  return res.status(500).json(error.message);
};

export { serverErrorHandler };
