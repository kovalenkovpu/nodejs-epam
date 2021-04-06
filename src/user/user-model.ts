import { v4 as uuidv4 } from 'uuid';

import { UserBase, UserDTO, UserId } from './types/user-dto';
import { IUserModel } from './types/user-model.types';

class UserModel implements IUserModel {
  private _users: UserDTO[] = [];

  getAll = async () => {
    return this._users;
  };

  getOne = async (id: UserId) => {
    return this._users.find((user) => id === user.id);
  };

  create = async (userData: UserBase) => {
    const newUser: UserDTO = {
      ...userData,
      id: uuidv4(),
      isDeleted: false,
    };

    this._users.push(newUser);

    return newUser;
  };

  update = async (id: UserId, userData: UserBase) => {
    const currentUserIndex = this._users.findIndex(
      (currentUser) => id === currentUser.id
    );

    if (currentUserIndex !== -1 && !this._users[currentUserIndex].isDeleted) {
      const updatedUser: UserDTO = {
        ...this._users[currentUserIndex],
        ...userData,
      };

      this._users[currentUserIndex] = updatedUser;

      return updatedUser;
    }
  };

  delete = async (id: UserId) => {
    const currentUserIndex = this._users.findIndex((user) => id === user.id);

    if (currentUserIndex !== -1 && !this._users[currentUserIndex].isDeleted) {
      this._users[currentUserIndex].isDeleted = true;

      return this._users[currentUserIndex];
    }
  };
}

const userModel = new UserModel();

export { userModel };
