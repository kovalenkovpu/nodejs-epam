import express from 'express';

import { iocContainer } from '../inversify.config';
import { TYPES } from '../inversify.types';

import * as loginValidationMiddleware from './middlewares/login-validator';
import { ILoginController } from './types/login-controller.types';

const loginRouter = express.Router();
const loginController = iocContainer.get<ILoginController>(
  TYPES.LoginController
);

loginRouter.post(
  '/',
  loginValidationMiddleware.validateLogin,
  loginController.login
);

export { loginRouter };
