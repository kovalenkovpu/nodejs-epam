import { Request, Response } from 'express';

import { UserBase, User, UserDTO, UserId } from './user-dto';

const WITH_COMPLETE_DATA = 'true' as const;

interface GetAllUsersQueryParams {
  withCompleteData?: typeof WITH_COMPLETE_DATA;
}

interface AutosuggestUsersQueryParams {
  loginSubstring?: string;
  limit?: string;
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
    req: Request<any, User[] | UserDTO[], any, GetAllUsersQueryParams>,
    res: Response<User[]>
  ) => Promise<void>;

  getAutoSuggestUsers: (
    req: Request<
      any,
      AutosuggestUsersResponse,
      undefined,
      AutosuggestUsersQueryParams
    >,
    res: Response<AutosuggestUsersResponse>
  ) => Promise<void>;

  getOne: (
    req: Request<UserParams>,
    res: Response<User | string>
  ) => Promise<void | Response<string>>;

  create: (
    req: Request<any, User, UserBase>,
    res: Response<User>
  ) => Promise<void>;

  update: (
    req: Request<UserParams, User, UserBase>,
    res: Response<User | string>
  ) => Promise<void | Response<string>>;

  delete: (
    req: Request<UserParams>,
    res: Response<User | string>
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
