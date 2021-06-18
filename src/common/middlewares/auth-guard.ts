import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const secret = String(process.env.SECRET);

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
      return res.status(403).json({
        success: false,
        message: 'You are not authorised. Please login.',
      });
    }
  } else {
    return res.sendStatus(401);
  }
};

export { authGuard };
