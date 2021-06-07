import { NextFunction, Request, Response } from 'express';

import { UserBase, User, UserDTO, UserId } from './user-dto';

const WITH_COMPLETE_DATA = 'true' as const;

interface GetAllUsersQueryParams {
  withCompleteData?: typeof WITH_COMPLETE_DATA;
}

interface AutosuggestUsersQueryParams {
  loginSubstring: string;
  limit?: number;
}

interface AutosuggestUsersResponse {
  totalCount: number;
  users: User[];
}

interface UserParams {
  id: UserId;
}

interface IUserController {
  getAll: (
    req: Request<unknown, User[] | UserDTO[], any, GetAllUsersQueryParams>,
    res: Response<User[]>,
    next: NextFunction
  ) => Promise<void>;

  getAutoSuggestUsers: (
    req: Request<
      unknown,
      AutosuggestUsersResponse,
      undefined,
      AutosuggestUsersQueryParams
    >,
    res: Response<AutosuggestUsersResponse>,
    next: NextFunction
  ) => Promise<void>;

  getOne: (
    req: Request<UserParams>,
    res: Response<User>,
    next: NextFunction
  ) => Promise<void>;

  create: (
    req: Request<unknown, User, UserBase>,
    res: Response<User>,
    next: NextFunction
  ) => Promise<void>;

  update: (
    req: Request<UserParams, User, UserBase>,
    res: Response<User>,
    next: NextFunction
  ) => Promise<void>;

  delete: (
    req: Request<UserParams>,
    res: Response<string>,
    next: NextFunction
  ) => Promise<void | Response<string>>;
}

export { WITH_COMPLETE_DATA };

export type {
  IUserController,
  GetAllUsersQueryParams,
  AutosuggestUsersQueryParams,
  AutosuggestUsersResponse,
  UserParams,
};
