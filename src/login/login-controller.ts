import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { TYPES } from '../types';
import { UserService } from '../user/user-service';

import { AuthData, ILoginController } from './types/login-controller.types';

const secret = String(process.env.SECRET);

@injectable()
class LoginController implements ILoginController {
  private userService: UserService;

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;

    this.login = this.login.bind(this);
  }

  async login(
    req: Request<unknown, unknown, AuthData>,
    res: Response
  ): Promise<void> {
    try {
      const user = await this.userService.findOneByCredentials(req.body);
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

export { LoginController };
