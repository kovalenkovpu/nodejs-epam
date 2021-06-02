import express from 'express';

import { loginController } from './login-controller';
import * as loginValidationMiddleware from './middlewares/login-validator';

const loginRouter = express.Router();

loginRouter.post(
  '/',
  loginValidationMiddleware.validateLogin,
  loginController.login
);

export { loginRouter };
