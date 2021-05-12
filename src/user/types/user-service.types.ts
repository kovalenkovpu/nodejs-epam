import { IDataBase } from '../../common/types/db-types';

import { AutosuggestUsersResponse } from './user-controller.types';
import { UserBase, User, UserId } from './user-dto';

interface IUserService {
  userModel: IDataBase['User'];

  getAll: () => Promise<User[]>;

  getAllWithCompleteData: () => Promise<User[]>;

  getAutoSuggestUsers: (
    loginSubstring: string,
    limit: number | undefined
  ) => Promise<AutosuggestUsersResponse>;

  getOne: (id: UserId) => Promise<User | undefined>;

  create: (user: UserBase) => Promise<User | undefined>;

  update: (id: UserId, user: UserBase) => Promise<User | undefined>;

  delete: (id: UserId) => Promise<User | undefined>;
}

export type { IUserService };
