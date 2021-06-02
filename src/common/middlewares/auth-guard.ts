import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const secret = String(process.env.SECRET);
const JWT_EXPIRED_MESSAGE = 'jwt expired';

const authGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const token = req.headers['x-access-token'] as string | undefined;

  if (token) {
    try {
      jwt.verify(token, secret);

      return next();
    } catch (error) {
      if (error.message === JWT_EXPIRED_MESSAGE) {
        return res.status(403).json({
          success: false,
          message: 'Your token expired. Please login again.',
        });
      }

      // TODO: make consistent
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401);
  }
};

export { authGuard };
