import { AutosuggestUsersResponse } from './user-controller.types';
import { UserBase, User, UserDTO, UserId } from './user-dto';

interface IUserService {
  userDTOsWithDeleted: UserDTO[];
  userDTOsWithoutDeleted: UserDTO[];

  getUserFromUserDTO: (userDTO: UserDTO) => User;

  getUsers: (userDTOs: UserDTO[]) => User[];

  getAll: () => User[];

  getAutoSuggestUsers: (
    loginSubstring: string | undefined,
    limit: string | undefined
  ) => AutosuggestUsersResponse;

  getOne: (id: UserId) => User | undefined;

  create: (user: UserBase) => User | undefined;

  update: (id: UserId, user: UserBase) => User | undefined;

  delete: (id: UserId) => User | undefined;
}

export type { IUserService };
