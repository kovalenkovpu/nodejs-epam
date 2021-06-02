import express from 'express';

import { loginController } from './login-controller';

const loginRouter = express.Router();

// TODO: add validation
loginRouter.post('/', loginController.login);

export { loginRouter };
