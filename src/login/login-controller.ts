import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { iocContainer } from '../inversify.config';
import { UserService } from '../user/user-service';

import { AuthData, ILoginController } from './types/login-controller.types';

const userService = iocContainer.resolve(UserService);
const secret = String(process.env.SECRET);

class LoginController implements ILoginController {
  async login(req: Request<unknown, unknown, AuthData>, res: Response) {
    try {
      const user = await userService.findOneByCredentials(req.body);
      const payload = { sub: user?.id };
      const token = jwt.sign(payload, secret, { expiresIn: 600 });

      res.setHeader('x-access-token', token);
      res.send({ success: true, message: token });
    } catch (error) {
      if (error.isNotFound) {
        res.status(404).json(`User ${req.body.login} not found.`);
      } else {
        res.sendStatus(403);
      }
    }
  }
}

const loginController = new LoginController();

export { loginController };
