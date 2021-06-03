import express from 'express';

import { iocContainer } from '../inversify.config';

import { LoginController } from './login-controller';
import * as loginValidationMiddleware from './middlewares/login-validator';

const loginRouter = express.Router();
const loginController = iocContainer.resolve(LoginController);

loginRouter.post(
  '/',
  loginValidationMiddleware.validateLogin,
  loginController.login
);

export { loginRouter };
