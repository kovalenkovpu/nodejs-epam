import { AutosuggestUsersResponse } from './user-controller.types';
import { UserBase, User, UserDTO, UserId } from './user-dto';
import { IUserModel } from './user-model.types';

interface IUserService {
  userModel: IUserModel;

  getAll: () => Promise<User[]>;

  getAllWithCompleteData: () => Promise<UserDTO[]>;

  getAutoSuggestUsers: (
    loginSubstring: string | undefined,
    limit: string | undefined
  ) => Promise<AutosuggestUsersResponse>;

  getOne: (id: UserId) => Promise<User | undefined>;

  create: (user: UserBase) => Promise<User | undefined>;

  update: (id: UserId, user: UserBase) => Promise<User | undefined>;

  delete: (id: UserId) => Promise<User | undefined>;
}

export type { IUserService };
