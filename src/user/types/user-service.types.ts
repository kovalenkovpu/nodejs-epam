import { AutosuggestUsersResponse } from './user-controller.types';
import { User, UserDTO, UserId } from './user-dto';

interface IUserService {
  usersWithoutDeleted: UserDTO[];

  getAll: () => UserDTO[];

  getAutoSuggestUsers: (
    loginSubstring: string | undefined,
    limit: string | undefined
  ) => AutosuggestUsersResponse;

  getOne: (id: UserId) => UserDTO | undefined;

  create: (user: User) => UserDTO | undefined;

  update: (id: UserId, user: User) => UserDTO | undefined;

  delete: (id: UserId) => UserDTO | undefined;
}

export type { IUserService };
