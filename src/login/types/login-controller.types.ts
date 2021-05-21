import { Request, Response } from 'express';

import { UserLogin, UserPassword } from '../../user/types/user-dto';

interface AuthData {
  login: UserLogin;
  password: UserPassword;
}

interface ILoginController {
  login: (
    req: Request<unknown, unknown, AuthData>,
    res: Response
  ) => Promise<void>;
}

export type { AuthData, ILoginController };
