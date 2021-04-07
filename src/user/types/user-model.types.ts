import { UserBase, UserDTO, UserId } from './user-dto';

interface IUserModel {
  getAll: () => Promise<UserDTO[]>;

  getOne: (id: UserId) => Promise<UserDTO | undefined>;

  create: (user: UserBase) => Promise<UserDTO | undefined>;

  update: (id: UserId, userData: UserBase) => Promise<UserDTO | undefined>;

  delete: (id: UserId) => Promise<UserDTO | undefined>;
}

export type { IUserModel };
