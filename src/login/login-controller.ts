import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { userService } from '../user/user-service';

import { AuthData, ILoginController } from './types/login-controller.types';

class LoginController implements ILoginController {
  async login(
    req: Request<unknown, unknown, AuthData>,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) {
    try {
      const user = await userService.findOneByCredentials(req.body);
      const payload = { sub: user.id };
      const token = jwt.sign(payload, user.password, { expiresIn: 60 });

      res.send({ success: true, message: token });
    } catch (error) {
      res.status(403).send({ success: false, message: 'Bad credentials.' });
    }
  }
}

const loginController = new LoginController();

export { loginController };
