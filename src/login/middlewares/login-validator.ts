import { NextFunction, Request, Response } from 'express';

import { formatError } from '../../common/utils';
import { LoginData } from '../types/login-data';

import { loginSchema } from './login-schema';

const validateLogin = async (
  req: Request<any, unknown, LoginData>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: loginData } = req;

    await loginSchema.validateAsync(loginData, {
      abortEarly: false,
    });

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

export { validateLogin };
